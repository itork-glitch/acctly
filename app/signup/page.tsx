'use client';

import React, { ChangeEvent, FormEvent, useState } from 'react';
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

interface cardTypes {
  title: string;
  value: string;
  subtitle: string;
  bottom: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
}

export default function SignUpPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
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
              className='space-y-6 w-full max-w-md mx-auto'>
              <div>
                <Label htmlFor='name'>
                  Name <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='name'
                  name='name'
                  type='text'
                  required
                  placeholder='Enter your name'
                  value={formData.name}
                  onChange={handleChange}
                  className='mt-2'
                />
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
                  className='mt-2'
                />
              </div>

              <div>
                <Label htmlFor='password'>
                  Password <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  required
                  placeholder='Enter your password'
                  value={formData.password}
                  onChange={handleChange}
                  className='mt-2'
                />
              </div>

              <Button
                type='submit'
                className='w-full bg-[#414141] text-white hover:bg-white hover:text-black transition'>
                Create Account
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
