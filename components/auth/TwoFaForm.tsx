import React, { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { ValidationErrors } from '@/lib/login';

interface TwoFAFormProps {
  otpCode: string;
  errors: ValidationErrors;
  isLoading: boolean;
  timeRemaining: number;
  onSubmit: (e: FormEvent) => void;
  onOTPChange: (value: string) => void;
  onOTPComplete: (value: string) => void;
  onBackToLogin: () => void;
}

export default function TwoFAForm({
  otpCode,
  errors,
  isLoading,
  timeRemaining,
  onSubmit,
  onOTPChange,
  onOTPComplete,
  onBackToLogin,
}: TwoFAFormProps) {
  return (
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
        <h2 className='text-xl font-bold mb-2'>Two-Factor Authentication</h2>
        <p className='text-[#9c9c9c] text-sm'>
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      <form onSubmit={onSubmit} className='space-y-6'>
        <div className='flex justify-center'>
          <InputOTP
            maxLength={6}
            value={otpCode}
            onChange={onOTPChange}
            onComplete={onOTPComplete}>
            <InputOTPGroup>
              <InputOTPSlot index={0} className='w-12 h-12' />
              <InputOTPSlot index={1} className='w-12 h-12' />
              <InputOTPSlot index={2} className='w-12 h-12' />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} className='w-12 h-12' />
              <InputOTPSlot index={4} className='w-12 h-12' />
              <InputOTPSlot index={5} className='w-12 h-12' />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {errors.otp && (
          <p className='text-red-400 text-sm text-center'>{errors.otp}</p>
        )}

        <div className='flex flex-col gap-3'>
          <Button
            type='submit'
            disabled={isLoading || otpCode.length !== 6}
            className='w-full'>
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </Button>
          <button
            type='button'
            onClick={onBackToLogin}
            className='w-full py-2 border rounded-lg'>
            Back to Login
          </button>
        </div>

        {timeRemaining > 0 && (
          <div className='text-center'>
            <p className='text-xs'>
              Session expires in {Math.floor(timeRemaining / 60)}:
              {(timeRemaining % 60).toString().padStart(2, '0')}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
