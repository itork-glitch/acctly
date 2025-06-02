import { NextRequest, NextResponse } from 'next/server';
import { generateEmailCode, sendEmailCode, hashEmailCode } from '@/lib/2fa';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email)
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );

    const code = generateEmailCode();
    const hashedCode = hashEmailCode(code, process.env.TOTP_SECRET!);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const { error } = await supabaseAdmin.from('email_codes').insert({
      user_email: email,
      code_hash: hashedCode,
      expiresAt: expiresAt.toISOString(),
    });

    if (error) {
      console.error('Database error: ', error);
      return NextResponse.json({ message: 'Database error' }, { status: 500 });
    }

    await sendEmailCode(email, code);

    return NextResponse.json(
      { message: 'Verification code sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email verifycation error: ', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
