'use client';

import React from 'react';
import { useLogin } from '@/hooks/useLogin';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthHeader from '@/components/auth/AuthHeader';
import LoginForm from '@/components/auth/LoginForm';
import TwoFAForm from '@/components/auth/TwoFaForm';

export default function LoginPage() {
  const {
    formData,
    loginStep,
    errors,
    showPassword,
    isLoading,
    otpCode,
    timeRemaining,
    handleChange,
    handleSubmit,
    handleOTPSubmit,
    handleOTPComplete,
    handleBackToLogin,
    handleGoogleSignIn,
    handleAppleSignIn,
    setShowPassword,
    setOtpCode,
  } = useLogin();

  return (
    <AuthLayout>
      {loginStep === 'login' ? (
        <>
          <AuthHeader />
          <LoginForm
            formData={formData}
            errors={errors}
            showPassword={showPassword}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onGoogleSignIn={handleGoogleSignIn}
            onAppleSignIn={handleAppleSignIn}
          />
        </>
      ) : (
        <TwoFAForm
          otpCode={otpCode}
          errors={errors}
          isLoading={isLoading}
          timeRemaining={timeRemaining}
          onSubmit={handleOTPSubmit}
          onOTPChange={setOtpCode}
          onOTPComplete={handleOTPComplete}
          onBackToLogin={handleBackToLogin}
        />
      )}
    </AuthLayout>
  );
}
