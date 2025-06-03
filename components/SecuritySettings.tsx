'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  Smartphone,
  Shield,
  CheckCircle,
  ArrowLeft,
  QrCode,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Session } from 'next-auth';

interface SecurityProps {
  user: Session['user'];
}

type Step = 'email-verification' | '2fa' | 'app-2fa-setup' | 'app-2fa-confirm';

export const SecuritySettings = ({ user }: SecurityProps) => {
  const [currentStep, setCurrentStep] = useState<Step>('2fa');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [OTPValue, setOTPValue] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user) return;

  const triggerSuccessAnimation = async () => {
    setShowSuccess(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setShowSuccess(false);
    setCurrentStep('2fa');
  };

  const handleEmailVerification = async () => {
    if (OTPValue.length !== 6) return;

    setIsVerifying(true);
    try {
      const response = await fetch('/api/confirm-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          code: OTPValue,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await triggerSuccessAnimation();
      } else {
        alert(data.message || 'Verification failed');
        setOTPValue('');
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('Network error. Please try again.');
    }
    setIsVerifying(false);
  };

  const sendVerificationEmail = async (email: string) => {
    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send verification email');
      }

      return data;
    } catch (error) {
      console.error('Send email error:', error);
      throw error;
    }
  };

  const handleResendCode = async () => {
    try {
      await sendVerificationEmail(user.email ?? '');
      alert('Verification code sent successfully');
    } catch (error) {
      alert(`Failed to send verification code: ${error}`);
    }
  };

  const handleSkip2FA = async () => {
    setIsProcessing(true);
    try {
      window.location.reload();
    } catch (error) {
      console.error('Skip 2FA error:', error);
      alert('Something went wrong. Please try again.');
    }
    setIsProcessing(false);
  };

  const handleEmailAuth = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/2fa/enable-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: user.email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Email 2FA enabled successfully!');
        window.location.reload(); // Reload to close modal and refresh dashboard
      } else {
        alert(data.message || 'Failed to enable email 2FA');
      }
    } catch (error) {
      console.error('Email 2FA enable error:', error);
      alert('Network error. Please try again.');
    }
    setIsProcessing(false);
  };

  const handleAppAuth = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/2fa/enable-app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: user.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setQrCode(data.qrCode);
        setTempToken(data.tempToken);
        setCurrentStep('app-2fa-setup');
      } else {
        alert(data.message || 'Failed to setup app 2FA');
      }
    } catch (error) {
      console.error('App 2FA setup error:', error);
      alert('Network error. Please try again.');
    }
    setIsProcessing(false);
  };

  const handleConfirmAppAuth = async () => {
    if (OTPValue.length !== 6) return;

    setIsVerifying(true);
    try {
      const response = await fetch('/api/2fa/confirm-app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: OTPValue,
          tempToken: tempToken,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('App 2FA enabled successfully!');
        window.location.reload(); // Reload to close modal and refresh dashboard
      } else {
        alert(data.message || 'Invalid code');
        setOTPValue('');
      }
    } catch (error) {
      console.error('App 2FA confirm error:', error);
      alert('Network error. Please try again.');
    }
    setIsVerifying(false);
  };

  const goBack = () => {
    if (currentStep === 'app-2fa-setup') {
      setCurrentStep('2fa');
      setQrCode('');
      setTempToken('');
    } else {
      setCurrentStep('email-verification');
    }
    setOTPValue('');
  };

  /*   useEffect(() => {
    const sendEmail = async () => {
      await sendVerificationEmail(email);
    };
    sendEmail();
  }, []); */

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.03 },
    tap: { scale: 0.97 },
  };

  const successVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
      },
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const checkmarkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 0.5, ease: 'easeInOut' },
        opacity: { duration: 0.3 },
      },
    },
  };

  const StepIndicator = ({ currentStep }: { currentStep: Step }) => {
    const getStepNumber = (step: Step) => {
      switch (step) {
        case 'email-verification':
          return 1;
        case '2fa':
          return 2;
        case 'app-2fa-setup':
          return 2;
        case 'app-2fa-confirm':
          return 2;
        default:
          return 1;
      }
    };

    const currentStepNumber = getStepNumber(currentStep);

    return (
      <div className='flex justify-center items-center gap-2 px-6 pt-6 pb-2'>
        <motion.div
          className={`w-2 h-2 rounded-full ${
            currentStepNumber >= 1 ? 'bg-[#209e5a]' : 'bg-gray-600'
          }`}
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{
            scale: currentStepNumber === 1 ? 1.2 : 1,
            opacity: 1,
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className='w-8 h-0.5 bg-gray-600'
          initial={{ scaleX: 0 }}
          animate={{ scaleX: currentStepNumber >= 2 ? 1 : 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
        <motion.div
          className={`w-2 h-2 rounded-full ${
            currentStepNumber >= 2 ? 'bg-[#209e5a]' : 'bg-gray-600'
          }`}
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{
            scale: currentStepNumber === 2 ? 1.2 : 0.8,
            opacity: currentStepNumber >= 2 ? 1 : 0.6,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    );
  };

  return (
    <div className='absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] flex items-center justify-center'>
      <motion.div
        initial='hidden'
        animate='visible'
        variants={cardVariants}
        className='w-full max-w-md'>
        <Card className='bg-[#313131] border-[#212121] overflow-hidden relative'>
          <AnimatePresence mode='wait'>
            {currentStep === 'email-verification' ? (
              <motion.div
                key='email-verification'
                initial='hidden'
                animate='visible'
                exit='exit'
                variants={cardVariants}>
                <StepIndicator currentStep={currentStep} />
                <CardHeader className='text-center space-y-2'>
                  <motion.div
                    variants={itemVariants}
                    className='mx-auto w-12 h-12 bg-[#209e5a]/10 rounded-full flex items-center justify-center'>
                    <Mail className='w-6 h-6 text-[#209e5a]' />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <CardTitle className='text-2xl font-bold text-white'>
                      Verify Your Email
                    </CardTitle>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <CardDescription className='text-gray-400 pb-2'>
                      Enter the 6-digit code sent to your email address to
                      confirm your account
                    </CardDescription>
                  </motion.div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <motion.div variants={contentVariants} className='space-y-4'>
                    <motion.div
                      variants={itemVariants}
                      className='flex justify-center'>
                      <InputOTP
                        maxLength={6}
                        value={OTPValue}
                        onChange={setOTPValue}
                        className='gap-2'>
                        <InputOTPGroup className='gap-2'>
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 + index * 0.05 }}>
                              <InputOTPSlot
                                index={index}
                                className='w-12 h-12 text-lg border-[#414141] bg-gray-700/40 text-white focus:border-[#209e5a] focus:ring-[#209e5a] backdrop-blur-sm'
                                color='primary'
                              />
                            </motion.div>
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <motion.div
                        variants={buttonVariants}
                        initial='rest'
                        whileHover='hover'
                        whileTap='tap'>
                        <Button
                          onClick={handleEmailVerification}
                          disabled={OTPValue.length !== 6 || isVerifying}
                          className='w-full bg-[#209e5a] hover:bg-[#1a7d48] text-white font-medium py-3'>
                          {isVerifying ? (
                            <div className='flex items-center gap-2'>
                              <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                              Verifying...
                            </div>
                          ) : (
                            'Verify Email'
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  <motion.div variants={itemVariants} className='text-center'>
                    <p className='text-sm text-gray-400 mb-2'>
                      {"Didn't receive the code?"}
                    </p>
                    <motion.div
                      variants={buttonVariants}
                      initial='rest'
                      whileHover='hover'
                      whileTap='tap'>
                      <Button
                        variant='ghost'
                        className='text-[#209e5a] hover:text-[#1a7d48] hover:bg-[#209e5a]/10'
                        onClick={handleResendCode}>
                        Resend Code
                      </Button>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </motion.div>
            ) : currentStep === '2fa' ? (
              <motion.div
                key='2fa-selection'
                initial='hidden'
                animate='visible'
                exit='exit'
                variants={cardVariants}>
                <StepIndicator currentStep={currentStep} />
                <CardHeader className='space-y-2'>
                  <motion.div
                    variants={itemVariants}
                    className='flex items-center gap-3'>
                    <motion.div
                      variants={buttonVariants}
                      initial='rest'
                      whileHover='hover'
                      whileTap='tap'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={goBack}
                        className='text-gray-400 hover:text-white hover:bg-gray-800'>
                        <ArrowLeft className='w-4 h-4' />
                      </Button>
                    </motion.div>
                    <div className='flex items-center gap-2'>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 260,
                          damping: 20,
                          delay: 0.2,
                        }}>
                        <CheckCircle className='w-5 h-5 text-[#209e5a]' />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}>
                        <Badge
                          variant='secondary'
                          className='bg-[#209e5a]/10 text-[#209e5a] border-[#209e5a]/20'>
                          Email Verified
                        </Badge>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={contentVariants}
                    className='text-center space-y-2'>
                    <motion.div
                      variants={itemVariants}
                      className='mx-auto w-12 h-12 bg-[#209e5a]/10 rounded-full flex items-center justify-center'>
                      <Shield className='w-6 h-6 text-[#209e5a]' />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <CardTitle className='text-2xl font-bold text-white'>
                        Secure Your Account
                      </CardTitle>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <CardDescription className='text-gray-400 pb-2'>
                        Choose your preferred two-factor authentication method
                        for enhanced security
                      </CardDescription>
                    </motion.div>
                  </motion.div>
                </CardHeader>

                <CardContent className='space-y-4'>
                  <motion.div variants={contentVariants} className='space-y-3'>
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ y: -2, transition: { duration: 0.2 } }}>
                      <Button
                        onClick={handleEmailAuth}
                        disabled={isProcessing}
                        variant='outline'
                        className='w-full h-auto p-4 border-gray-600 bg-gray-700/30 hover:bg-gray-600/40 hover:border-[#209e5a] text-left flex items-start gap-4 group disabled:opacity-50'>
                        <div className='flex-1 text-left'>
                          <div className='flex items-center gap-2'>
                            <div className='w-7 h-7 bg-[#209e5a]/10 rounded-lg flex items-center justify-center group-hover:bg-[#209e5a]/20 transition-colors'>
                              <Mail className='w-5 h-5 text-[#209e5a]' />
                            </div>
                            <h3 className='font-semibold text-white mb-1'>
                              Email Authentication
                            </h3>
                          </div>
                          <p className='text-sm text-gray-400'>
                            Receive verification codes via email when signing in
                          </p>
                        </div>
                      </Button>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      whileHover={{ y: -2, transition: { duration: 0.2 } }}>
                      <Button
                        onClick={handleAppAuth}
                        disabled={isProcessing}
                        variant='outline'
                        className='w-full h-auto p-4 border-gray-600 bg-gray-700/30 hover:bg-gray-600/40 hover:border-[#209e5a] text-left flex items-start gap-4 group disabled:opacity-50'>
                        <div className='flex-1 text-left'>
                          <div className='flex items-center gap-2'>
                            <div className='w-7 h-7 bg-[#209e5a]/10 rounded-lg flex items-center justify-center group-hover:bg-[#209e5a]/20 transition-colors'>
                              <Smartphone className='w-5 h-5 text-[#209e5a]' />
                            </div>
                            <h3 className='font-semibold text-white mb-1'>
                              Authenticator App
                            </h3>
                          </div>
                          <p className='text-sm text-gray-400'>
                            Use an authenticator app like Google Authenticator{' '}
                            <br />
                            or Authy
                          </p>
                          <Badge
                            variant='secondary'
                            className='mt-2 bg-[#209e5a]/10 text-[#209e5a] border-[#209e5a]/20 text-xs'>
                            Recommended
                          </Badge>
                        </div>
                      </Button>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className='pt-4 border-t border-gray-700'>
                    <motion.div
                      variants={buttonVariants}
                      initial='rest'
                      whileHover='hover'
                      whileTap='tap'>
                      <Button
                        onClick={handleSkip2FA}
                        disabled={isProcessing}
                        variant='ghost'
                        className='w-full text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50'>
                        {isProcessing ? (
                          <div className='flex items-center gap-2'>
                            <div className='w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin' />
                            Processing...
                          </div>
                        ) : (
                          'Skip for now'
                        )}
                      </Button>
                    </motion.div>
                    <p className='text-xs text-gray-500 text-center mt-2'>
                      You can enable 2FA later in your account settings
                    </p>
                  </motion.div>
                </CardContent>
              </motion.div>
            ) : currentStep === 'app-2fa-setup' ? (
              <motion.div
                key='app-2fa-setup'
                initial='hidden'
                animate='visible'
                exit='exit'
                variants={cardVariants}>
                <StepIndicator currentStep={currentStep} />
                <CardHeader className='space-y-2'>
                  <motion.div
                    variants={itemVariants}
                    className='flex items-center gap-3'>
                    <motion.div
                      variants={buttonVariants}
                      initial='rest'
                      whileHover='hover'
                      whileTap='tap'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={goBack}
                        className='text-gray-400 hover:text-white hover:bg-gray-800'>
                        <ArrowLeft className='w-4 h-4' />
                      </Button>
                    </motion.div>
                    <motion.div
                      variants={itemVariants}
                      className='mx-auto w-8 h-8 bg-[#209e5a]/10 rounded-full flex items-center justify-center'>
                      <QrCode className='w-5 h-5 text-[#209e5a]' />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    variants={contentVariants}
                    className='text-center space-y-2'>
                    <motion.div variants={itemVariants}>
                      <CardTitle className='text-2xl font-bold text-white'>
                        Scan QR Code
                      </CardTitle>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <CardDescription className='text-gray-400 pb-2'>
                        Scan this QR code with your authenticator app, then
                        enter the 6-digit code
                      </CardDescription>
                    </motion.div>
                  </motion.div>
                </CardHeader>

                <CardContent className='space-y-6'>
                  <motion.div variants={contentVariants} className='space-y-4'>
                    {qrCode && (
                      <motion.div
                        variants={itemVariants}
                        className='flex justify-center'>
                        <div className='bg-white p-4 rounded-lg'>
                          <img
                            src={qrCode}
                            alt='QR Code'
                            className='w-48 h-48'
                          />
                        </div>
                      </motion.div>
                    )}

                    <motion.div
                      variants={itemVariants}
                      className='flex justify-center'>
                      <InputOTP
                        maxLength={6}
                        value={OTPValue}
                        onChange={setOTPValue}
                        className='gap-2'>
                        <InputOTPGroup className='gap-2'>
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 + index * 0.05 }}>
                              <InputOTPSlot
                                index={index}
                                className='w-12 h-12 text-lg border-[#414141] bg-gray-700/40 text-white focus:border-[#209e5a] focus:ring-[#209e5a] backdrop-blur-sm'
                                color='primary'
                              />
                            </motion.div>
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <motion.div
                        variants={buttonVariants}
                        initial='rest'
                        whileHover='hover'
                        whileTap='tap'>
                        <Button
                          onClick={handleConfirmAppAuth}
                          disabled={OTPValue.length !== 6 || isVerifying}
                          className='w-full bg-[#209e5a] hover:bg-[#1a7d48] text-white font-medium py-3'>
                          {isVerifying ? (
                            <div className='flex items-center gap-2'>
                              <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                              Verifying...
                            </div>
                          ) : (
                            'Confirm Setup'
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </motion.div>
            ) : null}
          </AnimatePresence>
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial='hidden'
                animate='visible'
                exit='exit'
                variants={successVariants}
                className='absolute inset-0 bg-[#313131] flex items-center justify-center z-10 rounded-lg'>
                <div className='text-center'>
                  <motion.div
                    variants={successVariants}
                    className='mx-auto w-20 h-20 bg-[#209e5a]/10 rounded-full flex items-center justify-center mb-4'>
                    <svg
                      className='w-10 h-10'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'>
                      <motion.path
                        variants={checkmarkVariants}
                        d='M20 6L9 17L4 12'
                        stroke='#209e5a'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className='text-xl font-semibold text-white mb-2'>
                    Email Verified!
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className='text-gray-400'>
                    Proceeding to security setup...
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
};
