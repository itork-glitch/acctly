import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const { email, password, username } = await request.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'Email, password and username are required' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({ email, username, password: passwordHash })
      .select('id, email, username')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: 'User created',
        user: {
          id: data.id,
          email: data.email,
          username: data.username,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
