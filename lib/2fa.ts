import { Resend } from 'resend';
import speakeasy, { otpauthURL } from 'speakeasy';
import QRCode from 'qrcode';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_KEY!);

export function generateTOTPSecret(
  userEmail: string,
  appName: string = 'Acctly'
) {
  const secret = speakeasy.generateSecret({
    name: userEmail,
    issuer: appName,
    length: 32,
  });

  return { secret: secret.base32, otpauth_url: secret.otpauth_url! };
}

export async function generateQRCode(otpauth_url: string): Promise<string> {
  return QRCode.toDataURL(otpauth_url);
}

export function verifyTOTPToken(token: string, secret: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2,
  });
}

export function generateEmailCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export async function sendEmailCode(to: string, code: string): Promise<void> {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject: 'Kod weryfikacyjny 2FA – Acctly',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Kod weryfikacyjny</h2>
        <p>Twój kod weryfikacyjny 2FA to:</p>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #007bff; font-size: 32px; margin: 0;">${code}</h1>
        </div>
        <p>Kod jest ważny przez 5 minut.</p>
        <p>Jeśli to nie Ty, zignoruj tę wiadomość.</p>
      </div>
    `,
  });
}

export function hashEmailCode(code: string, secret: string): string {
  //if (!secret) throw new Error('Missing secret for hashing email code');
  return crypto
    .createHmac('sha256', process.env['2FA_SECRET']!)
    .update(code)
    .digest('hex');
}

export function verifyEmailCode(
  code: string,
  hashedCode: string,
  secret: string
): boolean {
  const computedHash = hashEmailCode(code, secret);
  return crypto.timingSafeEqual(
    Buffer.from(hashedCode, 'hex'),
    Buffer.from(computedHash, 'hex')
  );
}
