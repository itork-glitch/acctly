'use client';

import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginGradient from '@/components/ui/gradient';
import AuthCards from '@/components/authCards';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { signIn, getSession } from 'next-auth/react';

interface FormData {
  email: string;
  password: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for success message from signup
    const message = searchParams.get('message');
    if (message) {
      setSuccessMessage(message);
    }
  }, [searchParams]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.includes('@');
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address with @';
    }

    // Password validation
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

    // Clear specific field error when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        console.error('Login failed:', result.error);

        // Handle different types of errors
        if (result.error === 'CredentialsSignin') {
          setErrors({
            general:
              'Invalid email or password. Please check your credentials and try again.',
          });
        } else if (result.error === 'AccessDenied') {
          setErrors({
            general: 'Access denied. Please contact support if this continues.',
          });
        } else {
          setErrors({ general: 'Login failed. Please try again.' });
        }
      } else if (result?.ok) {
        console.log('Login successful');

        // Force session refresh and redirect
        await getSession();
        router.push('/dashboard');
        router.refresh();
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
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Google sign-in error:', error);
      setErrors({ general: 'Google sign-in failed. Please try again.' });
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signIn('apple', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Apple sign-in error:', error);
      setErrors({ general: 'Apple sign-in failed. Please try again.' });
    }
  };

  return (
    <main className='flex justify-center items-center h-screen bg-[#111111]'>
      <div className='w-[98vw] h-[98vh] grid grid-cols-1 md:grid-cols-2'>
        {/* Left panel */}
        <div className='flex flex-col justify-center px-8 py-12'>
          <div className='max-w-sm w-full mx-auto'>
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
            <p className='text-[#9c9c9c] mb-6'>Login to access your account</p>

            {successMessage && (
              <div className='bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg mb-4 text-sm'>
                {successMessage}
              </div>
            )}

            {errors.general && (
              <div className='bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm'>
                {errors.general}
              </div>
            )}

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
              className='space-y-4 w-full max-w-md mx-auto'>
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
                  <p className='text-red-400 text-sm mt-1'>{errors.email}</p>
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
                  <p className='text-red-400 text-sm mt-1'>{errors.password}</p>
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
                  Sign up here
                </span>
              </Link>
            </p>
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
