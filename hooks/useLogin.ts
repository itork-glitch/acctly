import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, signIn } from 'next-auth/react';
import {
  FormData,
  ValidationErrors,
  LoginStep,
  validateLoginForm,
  checkUserAndTwoFa,
  createTempToken,
  sendEmailCode,
  verifyTwoFa,
} from '@/lib/login';

export const useLogin = () => {
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (successMessage) setSuccessMessage('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateLoginForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { userData, twoFaData } = await checkUserAndTwoFa(formData.email);

      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
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
        return;
      }

      if (twoFaData.app_2fa_enabled || twoFaData.email_2fa_enabled) {
        const tempToken = createTempToken(
          formData.email,
          userData.id,
          twoFaData
        );
        localStorage.setItem('tempToken', tempToken);

        if (twoFaData.email_2fa_enabled) {
          await sendEmailCode(formData.email, userData.id, tempToken);
        }

        setLoginStep('2fa');
        setTimeRemaining(300);
      } else {
        await getSession();
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error: any) {
      setErrors({
        general: error.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (otpCode.length !== 6) {
      setErrors({ ...errors, otp: 'Please enter a 6 digit code' });
      return;
    }

    setIsLoading(true);
    setErrors({ ...errors, otp: '' });

    try {
      const tempToken = localStorage.getItem('tempToken');
      if (!tempToken) {
        setErrors({ ...errors, otp: 'Session expired. Please login again' });
        handleBackToLogin();
        return;
      }

      const data = await verifyTwoFa(tempToken, otpCode);

      if (data.success) {
        router.push('/dashboard');
      } else {
        setErrors({
          ...errors,
          otp: data.error || 'Invalid code. Please try again.',
        });
        setOtpCode('');
      }
    } catch {
      setErrors({ ...errors, otp: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPComplete = (value: string) => {
    setOtpCode(value);
    if (value.length === 6) {
      setTimeout(() => {
        const form = document.querySelector('form');
        form?.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true })
        );
      }, 100);
    }
  };

  const handleBackToLogin = () => {
    setLoginStep('login');
    setOtpCode('');
    setErrors((prev) => ({ ...prev, otp: '' }));
    localStorage.removeItem('tempToken');
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch {
      setErrors({ general: 'Google sign-in failed. Please try again.' });
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signIn('apple', { callbackUrl: '/dashboard' });
    } catch {
      setErrors({ general: 'Apple sign-in failed. Please try again.' });
    }
  };

  return {
    // States
    formData,
    loginStep,
    errors,
    showPassword,
    isLoading,
    successMessage,
    otpCode,
    timeRemaining,

    // Handlers
    handleChange,
    handleSubmit,
    handleOTPSubmit,
    handleOTPComplete,
    handleBackToLogin,
    handleGoogleSignIn,
    handleAppleSignIn,
    setShowPassword,
    setOtpCode,
  };
};
