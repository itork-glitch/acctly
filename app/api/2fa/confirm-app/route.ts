import { NextRequest, NextResponse } from 'next/server';
import { verifyTOTPToken } from '@/lib/2fa';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { token, tempToken } = await request.json();

    if (!token || !tempToken)
      return NextResponse.json(
        { error: 'Token and tempToken are required' },
        { status: 400 }
      );

    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET!) as any;
    const { secret, userEmail } = decoded;

    if (!verifyTOTPToken(token, secret))
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 });

    NextResponse.json({ message: '2FA is enabled' }, { status: 200 });
  } catch (error) {
    NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
