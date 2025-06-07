import React from 'react';
import LoginGradient from '@/components/ui/gradient';
import AuthCards from '@/components/authCards';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className='flex justify-center items-center h-screen bg-[#111111]'>
      <div className='w-[98vw] h-[98vh] grid grid-cols-1 md:grid-cols-2'>
        {/* Left Panel */}
        <div className='flex flex-col justify-center px-8 py-12'>
          <div className='max-w-sm w-full mx-auto'>{children}</div>
        </div>

        {/* Right Panel */}
        <div className='relative overflow-hidden rounded-xl'>
          <div className='absolute inset-0 bg-fancy-gradient' />
          <LoginGradient />
          <AuthCards />
        </div>
      </div>
    </main>
  );
}
