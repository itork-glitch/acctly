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

    // Pobierz user_id na podstawie emaila z tabeli users
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users') // lub jak nazywa się twoja główna tabela użytkowników
      .select('id')
      .eq('email', userEmail)
      .single();

    if (userError || !userData) {
      console.error('User lookup error:', userError);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const user_id = userData.id;

    if (!verifyTOTPToken(token, secret)) {
      return NextResponse.json({ message: 'Invalid code' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('user_2fa')
      .update({
        totp_secret: secret,
        app_2fa_enabled: true,
      })
      .eq('user_id', user_id);

    if (error)
      return NextResponse.json({ message: 'Database error' }, { status: 500 });

    return NextResponse.json(
      { message: 'App 2FA enabled successfully!' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json(
        { message: 'Setup session expired. Please start again.' },
        { status: 401 }
      );
    }
    console.log(error);

    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
