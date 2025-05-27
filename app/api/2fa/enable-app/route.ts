import { NextRequest, NextResponse } from 'next/server';
import { generateTOTPSecret, generateQRCode } from '@/lib/2fa';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const { userEmail } = await request.json();

    if (!userEmail)
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );

    const { secret, otpauth_url } = generateTOTPSecret(userEmail);

    if (!otpauth_url) {
      return NextResponse.json(
        { message: 'Failed to generate OTP Auth URL' },
        { status: 500 }
      );
    }
    const qrCode = await generateQRCode(otpauth_url);

    const tempToken = jwt.sign({ secret, userEmail }, process.env.JWT_SECRET!, {
      expiresIn: '10m',
    });

    NextResponse.json({ qrCode, secret, tempToken }, { status: 200 });
  } catch (error) {
    NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
