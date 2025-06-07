import React, { ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { FormData, ValidationErrors } from '@/lib/login';

interface LoginFormProps {
  formData: FormData;
  errors: ValidationErrors;
  showPassword: boolean;
  isLoading: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
  onGoogleSignIn: () => void;
  onAppleSignIn: () => void;
}

export default function LoginForm({
  formData,
  errors,
  showPassword,
  isLoading,
  onSubmit,
  onChange,
  onTogglePassword,
  onGoogleSignIn,
  onAppleSignIn,
}: LoginFormProps) {
  return (
    <>
      <div className='grid grid-cols-2 gap-3 mb-6'>
        <button
          onClick={onGoogleSignIn}
          className='w-full flex items-center justify-center border px-4 py-2 rounded-lg hover:bg-gray-50'>
          <FcGoogle size={24} />
        </button>
        <button
          onClick={onAppleSignIn}
          className='w-full flex items-center justify-center border px-4 py-2 rounded-lg hover:bg-gray-50'>
          <FaApple size={24} />
        </button>
      </div>

      <div className='flex items-center mb-3'>
        <div className='flex-1 border-t' />
        <span className='px-3 text-[#9c9c9c]'>or</span>
        <div className='flex-1 border-t' />
      </div>

      <form onSubmit={onSubmit} className='space-y-6 w-full max-w-md mx-auto'>
        <div>
          <Label htmlFor='email'>
            Email <span className='text-red-500'>*</span>
          </Label>
          <Input
            id='email'
            name='email'
            type='email'
            placeholder='Enter your email'
            value={formData.email}
            onChange={onChange}
            className={`mt-2 ${errors.email ? 'border-red-500' : ''}`}
            required
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
              placeholder='Enter your password'
              value={formData.password}
              onChange={onChange}
              className={`mt-2 pr-12 ${errors.password ? 'border-red-500' : ''}`}
              required
              autoComplete='current-password'
            />
            <button
              type='button'
              onClick={onTogglePassword}
              className='absolute right-3 top-1/2 transform -translate-y-1/2'>
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
              type='checkbox'
              className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
            />
            <label
              htmlFor='remember-me'
              className='ml-2 block text-sm text-[#9c9c9c]'>
              Remember me
            </label>
          </div>
          <Link href='/auth/forgot-password'>
            <span className='text-indigo-400 hover:underline'>
              Forgot your password?
            </span>
          </Link>
        </div>

        <Button
          type='submit'
          disabled={isLoading}
          className='w-full bg-[#414141] text-white hover:bg-white hover:text-black'>
          {isLoading ? 'Signing in...' : 'Login'}
        </Button>
      </form>

      <p className='mt-4 text-center text-sm text-[#9c9c9c]'>
        You don't have an account?{' '}
        <Link href='/signup'>
          <span className='text-indigo-400 hover:underline'>Sign here</span>
        </Link>
      </p>
    </>
  );
}
