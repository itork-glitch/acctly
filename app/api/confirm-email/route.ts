import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailCode } from '@/lib/2fa';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code)
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });

    const { data: storedCode, error } = await supabaseAdmin
      .from('email_codes')
      .select('*')
      .eq('user_email', email)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !storedCode)
      return NextResponse.json(
        { message: 'Invalid or expired code' },
        { status: 400 }
      );

    const isValid = verifyEmailCode(
      code,
      storedCode.code_hash,
      process.env.TOTP_SECRET!
    );

    if (!isValid)
      return NextResponse.json({ message: 'Invalid code' }, { status: 400 });

    await supabaseAdmin
      .from('email_codes')
      .update({ used: true })
      .eq('id', storedCode.id);

    return NextResponse.json(
      { message: 'Email verifyed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email confirmation error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
