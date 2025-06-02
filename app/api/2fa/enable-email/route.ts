import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const { userEmail } = await request.json();

    if (!userEmail) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('users')
      .update({ email_2fa_enabled: true })
      .eq('email', userEmail);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ message: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Email 2FA enabled successfully',
    });
  } catch (error) {
    console.error('Email 2FA enable error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
