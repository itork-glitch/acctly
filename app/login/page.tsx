'use client';

import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LoginGradient from '@/components/ui/gradient';
import AuthCards from '@/components/authCards';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cardsData } from '@/constants/auth';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getSession, signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

interface FormData {
  email: string;
  password: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  general?: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type LoginStep = 'login' | '2fa';

export default function LoginForm() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const [loginStep, setLoginStep] = useState<LoginStep>('login');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(300);

  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const message = params.get('message');

    if (message) setSuccessMessage(message);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (loginStep === '2fa' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleBackToLogin();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loginStep, timeRemaining]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.includes('@');
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address with @';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Check if user exists and has 2FA enabled
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', formData.email)
        .single();

      if (!userData || userError) {
        setErrors({ general: 'User not found. Please create account' });
        setIsLoading(false);
        return;
      }

      const { data: twoFaData, error: twoFaError } = await supabase
        .from('user_2fa')
        .select('id, user_id, email_2fa_enabled, app_2fa_enabled')
        .eq('user_id', userData.id)
        .single();

      if (twoFaError) {
        setErrors({ general: 'User not found. Please create account' });
        setIsLoading(false);
        return;
      }

      // Verify credentials first
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        console.error('Login failed:', result.error);

        switch (result.error) {
          case 'CredentialsSignin':
            setErrors({
              general:
                'Invalid email or password. Please check your credentials and try again.',
            });
            break;
          case 'AccessDenied':
            setErrors({
              general:
                'Access denied. Please contact support if this continues.',
            });
            break;
          default:
            setErrors({ general: 'Login failed. Please try again.' });
        }
        setIsLoading(false);
        return;
      }

      // Check if 2FA is enabled
      if (twoFaData.app_2fa_enabled || twoFaData.email_2fa_enabled) {
        // Create temporary token for 2FA flow
        const tempToken = jwt.sign(
          {
            userEmail: formData.email,
            userId: userData.id,
            twoFaType: twoFaData.app_2fa_enabled ? 'app' : 'email',
          },
          process.env.NEXT_PUBLIC_JWT_SECRET!,
          { expiresIn: '5m' }
        );

        localStorage.setItem('tempToken', tempToken);

        // If email 2FA is enabled, send the code
        if (twoFaData.email_2fa_enabled) {
          await fetch('/api/2fa/send-email-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userEmail: formData.email,
              userId: userData.id,
              tempToken,
            }),
          });
        }

        onLoginSuccess(tempToken, twoFaData.app_2fa_enabled ? 'app' : 'email');
      } else {
        // No 2FA enabled, direct login
        onDirectLogin();
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/account' });
    } catch (error) {
      console.error('Google sign-in error:', error);
      setErrors({ general: 'Google sign-in failed. Please try again.' });
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signIn('apple', { callbackUrl: '/account' });
    } catch (error) {
      console.error('Apple sign-in failed. Please try again.');
      setErrors({ general: 'Apple sign-in failed. Please try again.' });
    }
  };

  return (
    <main className='flex justify-center items-center h-screen bg-[#111111]'>
      <div className='w-[98vw] h-[98vh] grid grid-cols-1 md:grid-cols-2'>
        {/* Left panel */}
        <div className='flex flex-col justify-center px-8 py-12'>
          <div className='max-w-sm w-full mx-auto'>
            {loginStep === 'login' ? (
              <>
                <div className='flex items-center gap-2 mb-5'>
                  <Image
                    src={'/logo.png'}
                    alt='Acctly Logo'
                    height={32}
                    width={32}
                    quality={100}
                    priority
                    className='grayscale-100'
                  />
                  <h1 className='font-bold text-lg'>Acctly ID</h1>
                </div>
                <h1 className='text-3xl font-extrabold mb-2'>
                  Keep your all accounts organized in one place
                </h1>
                <p className='text-[#9c9c9c] mb-6'>
                  Login to access your account
                </p>

                <div className='grid grid-cols-2 grid-rows-1 gap-3'>
                  <button
                    type='button'
                    onClick={handleGoogleSignIn}
                    className='w-full flex items-center justify-center border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition duration-300 mb-6'>
                    <FcGoogle size={24} />
                  </button>
                  <button
                    type='button'
                    onClick={handleAppleSignIn}
                    className='w-full flex items-center justify-center border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 mb-6 hover:[&>*>*]:text-black transition-all duration-300'>
                    <FaApple size={24} />
                  </button>
                </div>

                <div className='flex items-center mb-3'>
                  <div className='flex-1 border-t border-gray-300' />
                  <span className='px-3 text-[#9c9c9c]'>or</span>
                  <div className='flex-1 border-t border-gray-300' />
                </div>
                <form
                  onSubmit={handleSubmit}
                  className='space-y-6 w-full max-w-md mx-auto'>
                  <div>
                    <Label htmlFor='email'>
                      Email <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      required
                      placeholder='Enter your email'
                      value={formData.email}
                      onChange={handleChange}
                      className={`mt-2 ${errors.email ? 'border-red-500' : ''}`}
                      autoComplete='email'
                    />
                    {errors.email && (
                      <p className='text-red-400 text-sm mt-1'>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor='password'>
                      Password <span className='text-red-500'>*</span>
                    </Label>
                    <div className='relative'>
                      <Input
                        id='password'
                        name='password'
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder='Enter your password'
                        value={formData.password}
                        onChange={handleChange}
                        className={`mt-2 pr-12 ${
                          errors.password ? 'border-red-500' : ''
                        }`}
                        autoComplete='current-password'
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 mt-1'>
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                    {errors.password && (
                      <p className='text-red-400 text-sm mt-1'>
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <input
                        id='remember-me'
                        name='remember-me'
                        type='checkbox'
                        className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                      />
                      <label
                        htmlFor='remember-me'
                        className='ml-2 block text-sm text-[#9c9c9c]'>
                        Remember me
                      </label>
                    </div>

                    <div className='text-sm'>
                      <Link
                        href='/auth/forgot-password'
                        className='text-indigo-400 hover:underline'>
                        Forgot your password?
                      </Link>
                    </div>
                  </div>

                  <Button
                    type='submit'
                    disabled={isLoading}
                    className='w-full bg-[#414141] text-white hover:bg-white hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed'>
                    {isLoading ? 'Signing in...' : 'Login'}
                  </Button>
                </form>
                <p className='mt-4 text-center text-sm text-[#9c9c9c]'>
                  You don't have an account?{' '}
                  <Link href='/signup'>
                    <span className='text-indigo-400 hover:underline'>
                      Sign here
                    </span>
                  </Link>
                </p>
              </>
            ) : (
              <div className='space-y-6 w-full max-w-md mx-auto'>
                <div className='text-center mb-6'>
                  <div className='w-16 h-16 bg-[#414141] rounded-full flex items-center justify-center mx-auto mb-4'>
                    <svg
                      className='w-8 h-8 text-white'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                      />
                    </svg>
                  </div>
                  <h2 className='text-xl font-bold mb-2'>
                    Two-Factor Authentication
                  </h2>
                  <p className='text-[#9c9c9c] text-sm'>
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>

                <form onSubmit={handleOTPSubmit} className='space-y-6'>
                  <div className='flex justify-center'>
                    <InputOTP
                      maxLength={6}
                      value={otpCode}
                      onChange={(value) => setOtpCode(value)}
                      onComplete={handleOTPComplete}>
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={0}
                          className='w-12 h-12 text-lg border-gray-600 bg-[#1a1a1a] text-white focus:border-indigo-500'
                        />
                        <InputOTPSlot
                          index={1}
                          className='w-12 h-12 text-lg border-gray-600 bg-[#1a1a1a] text-white focus:border-indigo-500'
                        />
                        <InputOTPSlot
                          index={2}
                          className='w-12 h-12 text-lg border-gray-600 bg-[#1a1a1a] text-white focus:border-indigo-500'
                        />
                      </InputOTPGroup>
                      <InputOTPSeparator className='text-[#9c9c9c]' />
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={3}
                          className='w-12 h-12 text-lg border-gray-600 bg-[#1a1a1a] text-white focus:border-indigo-500'
                        />
                        <InputOTPSlot
                          index={4}
                          className='w-12 h-12 text-lg border-gray-600 bg-[#1a1a1a] text-white focus:border-indigo-500'
                        />
                        <InputOTPSlot
                          index={5}
                          className='w-12 h-12 text-lg border-gray-600 bg-[#1a1a1a] text-white focus:border-indigo-500'
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  {errors.otp && (
                    <p className='text-red-400 text-sm text-center'>
                      {errors.otp}
                    </p>
                  )}

                  <div className='flex flex-col gap-3'>
                    <Button
                      type='submit'
                      disabled={isLoading || otpCode.length !== 6}
                      className='w-full bg-[#414141] text-white hover:bg-white hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed'>
                      {isLoading ? 'Verifying...' : 'Verify Code'}
                    </Button>

                    <button
                      type='button'
                      onClick={handleBackToLogin}
                      className='w-full py-2 text-[#9c9c9c] hover:text-white transition duration-300 border border-[#9c9c9c] rounded-lg hover:border-primary'>
                      Back to Login
                    </button>
                  </div>

                  {/* Timer pokazujący pozostały czas na wprowadzenie kodu */}
                  {timeRemaining > 0 && (
                    <div className='text-center'>
                      <p className='text-[#9c9c9c] text-xs'>
                        Session expires in {Math.floor(timeRemaining / 60)}:
                        {(timeRemaining % 60).toString().padStart(2, '0')}
                      </p>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className='relative overflow-hidden rounded-xl'>
          <div className='absolute inset-0 bg-fancy-gradient' />
          <LoginGradient />
          <AuthCards />
        </div>
      </div>
    </main>
  );
}
