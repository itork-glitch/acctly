import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { isValidEmail, isValidPassword, hashPassword } from '@/lib/encrypt';

export async function POST(request: NextRequest) {
  try {
    const { email, password, username } = await request.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address with @' },
        { status: 400 }
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        {
          error:
            'Password must be at least 6 characters long and contain at least one number and one special character',
        },
        { status: 400 }
      );
    }

    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      console.error('Supabase auth error: ', authError);
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const avatarUrl = `/api/avatar?username=${encodeURIComponent(username)}`;

    const { error: dbError } = await supabaseAdmin.from('users').insert({
      id: authData.user.id,
      username,
      email,
      password: hashedPassword,
      avatar_url: avatarUrl,
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error('Database error: ', dbError);
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: 'Failed to save user data' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: {
          id: authData.user.id,
          email: authData.user.email,
          username,
          avatar_url: avatarUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
