import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { verifyTOTPToken } from '@/lib/2fa';
import { verifyPassword } from '@/lib/encrypt';

export async function POST(request: NextRequest) {
  try {
    const { userEmail, password, type, confirmationCode } =
      await request.json();

    if (!userEmail || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get user data
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, password')
      .eq('email', userEmail)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, userData.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Get 2FA data
    const { data: twoFaData, error: twoFaError } = await supabaseAdmin
      .from('user_2fa')
      .select('*')
      .eq('user_id', userData.id)
      .single();

    if (twoFaError || !twoFaData) {
      return NextResponse.json(
        { success: false, error: '2FA configuration not found' },
        { status: 404 }
      );
    }

    // Verify current 2FA method
    if (type === 'app' && twoFaData.app_2fa_enabled) {
      if (
        !confirmationCode ||
        !verifyTOTPToken(confirmationCode, twoFaData.totp_secret)
      ) {
        return NextResponse.json(
          { success: false, error: 'Invalid authenticator code' },
          { status: 400 }
        );
      }

      // Disable app 2FA
      const { error: updateError } = await supabaseAdmin
        .from('user_2fa')
        .update({
          app_2fa_enabled: false,
          totp_secret: null,
        })
        .eq('user_id', userData.id);

      if (updateError) {
        return NextResponse.json(
          { success: false, error: 'Failed to disable app 2FA' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'App 2FA disabled successfully',
      });
    } else if (type === 'email' && twoFaData.email_2fa_enabled) {
      // For email 2FA, we just need password verification
      const { error: updateError } = await supabaseAdmin
        .from('user_2fa')
        .update({
          email_2fa_enabled: false,
          email_code: null,
          email_code_expires: null,
        })
        .eq('user_id', userData.id);

      if (updateError) {
        return NextResponse.json(
          { success: false, error: 'Failed to disable email 2FA' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Email 2FA disabled successfully',
      });
    } else {
      return NextResponse.json(
        { success: false, error: '2FA method not enabled or invalid type' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Disable 2FA error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
