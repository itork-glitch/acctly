import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import {
  isValidEmail,
  isValidPassword,
  isValidUsername,
  hashPassword,
} from '@/lib/encrypt';

export async function POST(request: NextRequest) {
  try {
    const { email, password, username, firstName, lastName } =
      await request.json();

    if (!email || !password || !username || !firstName || !lastName) {
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

    if (!isValidUsername(username, firstName, lastName)) {
      return NextResponse.json(
        { error: 'Invalid username, first name or last name' },
        { status: 400 }
      );
    }

    const [
      { data: existingUser, error: existingUserError },
      { data: existingUsername, error: existingUsernameError },
    ] = await Promise.all([
      supabaseAdmin.from('users').select('email').eq('email', email).single(),
      supabaseAdmin
        .from('users')
        .select('username')
        .eq('username', username)
        .single(),
    ]);

    if (existingUserError || existingUsernameError) {
      return NextResponse.json(
        { error: 'Database error during user lookup' },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username is already taken' },
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
      email,
      password: hashedPassword,
      username,
      first_name: firstName,
      last_name: lastName,
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
