import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { Resend } from 'resend';
import jwt from 'jsonwebtoken';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { userEmail, userId, tempToken } = await request.json();

    if (!userEmail || !userId) {
      return NextResponse.json(
        { success: false, error: 'Email and user ID are required' },
        { status: 400 }
      );
    }

    // Verify temp token if provided (for login flow)
    if (tempToken) {
      try {
        jwt.verify(tempToken, process.env.JWT_SECRET!);
      } catch (error) {
        return NextResponse.json(
          { success: false, error: 'Session expired. Please login again.' },
          { status: 401 }
        );
      }
    }

    // Generate 6-digit code
    const emailCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store code in database
    const { error: updateError } = await supabaseAdmin
      .from('user_2fa')
      .update({
        email_code: emailCode,
        email_code_expires: expiresAt.toISOString(),
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Database update error:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to generate verification code' },
        { status: 500 }
      );
    }

    // Send email via Resend
    try {
      await resend.emails.send({
        from: 'Acctly <noreply@acctly.com>',
        to: [userEmail],
        subject: 'Your Acctly Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; font-size: 24px; margin-bottom: 10px;">Acctly</h1>
              <p style="color: #666; font-size: 16px;">Your verification code</p>
            </div>
            
            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px; text-align: center; margin-bottom: 20px;">
              <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
                Use this verification code to complete your login:
              </p>
              <div style="background-color: #fff; border: 2px solid #e9ecef; border-radius: 6px; padding: 15px; display: inline-block;">
                <span style="font-size: 32px; font-weight: bold; color: #333; letter-spacing: 8px;">
                  ${emailCode}
                </span>
              </div>
              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                This code will expire in 10 minutes
              </p>
            </div>
            
            <div style="text-align: center;">
              <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
                If you didn't request this code, please ignore this email.
              </p>
              <p style="color: #666; font-size: 14px;">
                For security reasons, never share this code with anyone.
              </p>
            </div>
          </div>
        `,
        text: `Your Acctly verification code is: ${emailCode}. This code will expire in 10 minutes. If you didn't request this code, please ignore this email.`,
      });

      return NextResponse.json({
        success: true,
        message: 'Verification code sent to your email',
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return NextResponse.json(
        { success: false, error: 'Failed to send verification email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Send email 2FA error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
