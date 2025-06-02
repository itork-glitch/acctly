import { NextRequest, NextResponse } from 'next/server';
import { verifyTOTPToken } from '@/lib/2fa';
import { supabaseAdmin } from '@/utils/supabase/admin';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { token, tempToken } = await request.json();

    if (!token || !tempToken) {
      return NextResponse.json(
        { message: 'Token and code are required' },
        { status: 400 }
      );
    }

    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET!) as any;
    const { secret, userEmail } = decoded;

    if (!verifyTOTPToken(token, secret)) {
      return NextResponse.json({ message: 'Invalid code' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('users')
      .update({
        totp_secret: secret,
        app_2fa_enabled: true,
      })
      .eq('email', userEmail);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ message: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ message: '2FA enabled successfully' });
  } catch (error) {
    console.error('2FA confirm error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
