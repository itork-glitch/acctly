declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_KEY: string;
    GOOGLE_CLIENT: string;
    GOOGLE_SECRET: string;
    RESEND_KEY: string;
    EMAIL_FROM: string;
    '2FA_SECRET': string;
    TOTP_SECRET: string;
    NEXT_PUBLIC_JWT_SECRET: string;
  }
}
