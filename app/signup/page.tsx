'use client';

import React, { ChangeEvent, FormEvent, useState } from 'react';
import LoginGradient from '@/components/ui/gradient';
import AuthCards from '@/components/authCards';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

interface FormData {
  username: string;
  email: string;
  password: string;
}

interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
  general?: string;
}

export default function SignUpPage() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.includes('@');
  };

  const validatePassword = (
    password: string
  ): { valid: boolean; message?: string } => {
    if (password.length < 6) {
      return {
        valid: false,
        message: 'Password must be at least 6 characters long',
      };
    }
    if (!/\d/.test(password)) {
      return {
        valid: false,
        message: 'Password must contain at least one number',
      };
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return {
        valid: false,
        message: 'Password must contain at least one special character',
      };
    }

    return { valid: true };
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Name is required';
    } else if (formData.username.trim().length < 2) {
      newErrors.username = 'Name must be at least 2 characters long';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address with @';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.valid) {
        newErrors.password = passwordValidation.message;
      }
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
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok) {
        const signInResult = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (signInResult?.ok) {
          router.push('/account');
        } else {
          router.push(
            '/login?message=Account created successfully. Please sign in.'
          );
        }
      } else {
        setErrors({ general: data.error || 'Registration failed' });
      }
    } catch (error) {
      console.error('Registration error: ', error);
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (
    password: string
  ): { strength: string; color: string } => {
    if (password.length === 0) return { strength: '', color: '' };

    const validation = validatePassword(password);
    const hasLength = password.length >= 6;
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    const score = [hasLength, hasNumber, hasSpecial].filter(Boolean).length;

    switch (score) {
      case 3:
        return { strength: 'Strong', color: 'text-green-500' };
      case 2:
        return { strength: 'Medium', color: 'text-yellow-500' };
      default:
        return { strength: 'Weak', color: 'text-red-500' };
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

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
            <p className='text-[#9c9c9c] mb-6'>
              Sign up to start your journey.
            </p>

            <div className='grid grid-cols-2 grid-rows-1 gap-3'>
              <button className='w-full flex items-center justify-center border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition duration-300 mb-6'>
                <FcGoogle size={24} />
              </button>
              <button className='w-full flex items-center justify-center border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 mb-6 hover:[&>*>*]:text-black transition-all duration-300'>
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
                <Label htmlFor='username'>
                  Name <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='username'
                  name='username'
                  type='text'
                  required
                  placeholder='Enter your name'
                  value={formData.username}
                  onChange={handleChange}
                  className={`mt-2 ${errors.username ? 'border-red-500' : ''}`}
                />
                {errors.username && (
                  <p className='text-red-400 text-sm mt-1'>{errors.username}</p>
                )}
              </div>

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
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 mt-1'>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {formData.password && passwordStrength.strength && (
                  <p className={`text-sm mt-1 ${passwordStrength.color}`}>
                    Password strength: {passwordStrength.strength}
                  </p>
                )}
                {errors.password && (
                  <p className='text-red-400 text-sm mt-1'>{errors.password}</p>
                )}
                <div className='text-xs text-gray-400 mt-1'>
                  Must contain: 6+ characters, 1 number, 1 special character
                </div>
              </div>

              <Button
                type='submit'
                disabled={isLoading}
                className='w-full bg-[#414141] text-white hover:bg-white hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed'>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <p className='mt-4 text-center text-sm text-[#9c9c9c]'>
              Already have an account?{' '}
              <Link href='/login'>
                <span className='text-indigo-400 hover:underline'>
                  Login here
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
