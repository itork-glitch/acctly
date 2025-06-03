import { NextRequest, NextResponse } from 'next/server';
import { verifyTOTPToken } from '@/lib/2fa';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { signIn } from 'next-auth/react';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { tempToken, totpCode, emailCode, type } = await request.json();

    if (!tempToken) {
      return NextResponse.json(
        { success: false, error: 'Session expired. Please login again.' },
        { status: 401 }
      );
    }

    // Verify temp token
    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET!) as any;
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Session expired. Please login again.' },
        { status: 401 }
      );
    }

    const { userEmail, userId, twoFaType } = decoded;

    if (type === 'app' && twoFaType === 'app') {
      if (!totpCode) {
        return NextResponse.json(
          { success: false, error: 'Authentication code is required' },
          { status: 400 }
        );
      }

      // Get user's TOTP secret
      const { data: twoFaData, error: twoFaError } = await supabaseAdmin
        .from('user_2fa')
        .select('totp_secret')
        .eq('user_id', userId)
        .single();

      if (twoFaError || !twoFaData?.totp_secret) {
        return NextResponse.json(
          {
            success: false,
            error: 'Two-factor authentication not properly configured',
          },
          { status: 400 }
        );
      }

      // Verify TOTP code
      if (!verifyTOTPToken(totpCode, twoFaData.totp_secret)) {
        return NextResponse.json(
          { success: false, error: 'Invalid authentication code' },
          { status: 400 }
        );
      }
    } else if (type === 'email' && twoFaType === 'email') {
      if (!emailCode) {
        return NextResponse.json(
          { success: false, error: 'Email verification code is required' },
          { status: 400 }
        );
      }

      // Get stored email code from user_2fa table
      const { data: twoFaData, error: twoFaError } = await supabaseAdmin
        .from('user_2fa')
        .select('email_code, email_code_expires')
        .eq('user_id', userId)
        .single();

      if (twoFaError || !twoFaData) {
        return NextResponse.json(
          { success: false, error: 'Email verification not found' },
          { status: 400 }
        );
      }

      // Check if code expired
      if (new Date() > new Date(twoFaData.email_code_expires)) {
        return NextResponse.json(
          { success: false, error: 'Email verification code has expired' },
          { status: 400 }
        );
      }

      // Verify email code
      if (emailCode !== twoFaData.email_code) {
        return NextResponse.json(
          { success: false, error: 'Invalid email verification code' },
          { status: 400 }
        );
      }

      // Clear used email code
      await supabaseAdmin
        .from('user_2fa')
        .update({
          email_code: null,
          email_code_expires: null,
        })
        .eq('user_id', userId);
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid verification method' },
        { status: 400 }
      );
    }

    // Create session token for successful 2FA
    const sessionToken = jwt.sign(
      {
        userId,
        userEmail,
        twoFaVerified: true,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      success: true,
      message: 'Two-factor authentication successful',
      sessionToken,
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
