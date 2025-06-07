import { supabase } from '@/utils/supabase/client';
import jwt from 'jsonwebtoken';

export interface FormData {
  email: string;
  password: string;
}

export interface ValidationErrors {
  email?: string;
  password?: string;
  general?: string;
  otp?: string;
}

export type LoginStep = 'login' | '2fa';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.includes('@');
};

export const validateLoginForm = (formData: FormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address with @';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  return errors;
};

export const checkUserAndTwoFa = async (email: string) => {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', email)
    .single();

  if (userError || !userData) {
    throw new Error('User not found. Please create account');
  }

  const { data: twoFaData, error: twoFaError } = await supabase
    .from('user_2fa')
    .select('id, user_id, email_2fa_enabled, app_2fa_enabled')
    .eq('user_id', userData.id)
    .single();

  if (twoFaError || !twoFaData) {
    throw new Error('User not found. Please create account');
  }

  return { userData, twoFaData };
};

export const createTempToken = (
  email: string,
  userID: string,
  twoFaData: any
) => {
  return jwt.sign(
    {
      userEmail: email,
      userId: userID,
      twoFaType: twoFaData.app_2fa_enabled ? 'app' : 'email',
    },
    process.env.NEXT_PUBLIC_JWT_SECRET!,
    { expiresIn: '5m' }
  );
};

export const sendEmailCode = async (
  email: string,
  userID: string,
  tempToken: string
) => {
  await fetch('api/2fa/send-email-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userEmail: email,
      userId: userID,
      tempToken,
    }),
  });
};

export const verifyTwoFa = async (tempToken: string, totpCode: string) => {
  const responce = await fetch('api/auth/verify-2fa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tempToken,
      totpCode,
    }),
  });

  return await responce.json();
};
