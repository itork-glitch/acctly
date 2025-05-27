import speakeasy, { otpauthURL } from 'speakeasy';
import QRCode from 'qrcode';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export function generateTOTPSecret(
  userEmail: string,
  appName: string = 'Acctly'
) {
  const secret = speakeasy.generateSecret({
    name: userEmail,
    issuer: appName,
    length: 32,
  });

  return {
    secret: secret.base32,
    otpauth_url: secret.otpauth_url,
  };
}

export async function generateQRCode(otpauth_url: string): Promise<string> {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(otpauth_url);
    return qrCodeDataURL;
  } catch (error) {
    throw new Error('QR code generation error');
  }
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
  return crypto.randomInt(10 ^ 4, 999999).toString();
}

export async function sendEmailCode(
  email: string,
  code: string
): Promise<void> {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Kod weryfikacyjny 2FA - Acctly',
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
  };

  await transporter.sendMail(mailOptions);
}

export function hashEmailCode(code: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(code).digest('hex');
}

export function verifyEmailCode(
  code: string,
  hashedCode: string,
  secret: string
): boolean {
  const computedHash = hashEmailCode(code, secret);
  return crypto.timingSafeEqual(
    Buffer.from(hashedCode),
    Buffer.from(computedHash)
  );
}
