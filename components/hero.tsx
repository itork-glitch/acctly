import React from 'react';
import { ModeToggle } from './ui/themeSwitcher';
import Link from 'next/link';

const Hero = () => {
  return (
    <div
      className=' h-[100vh]'
      style={{
        backgroundImage: 'conic-gradient(from -70deg, #111, #1a1a1a)',
      }}>
      <div className='flex w-full h-full justify-center items-center flex-col'>
        <Link
          href={'/deals'}
          className='p-[3px] rounded-full bg-gradient-to-r from-[#209e5a] to-[#212121] inline-block'>
          <div className='bg-[#212121] rounded-xl px-5 py-1 text-[#9c9c9c]'>
            Summer 2025 hot deals
          </div>
        </Link>
        <h1 className='font-bold font-montserrat text-6xl'>
          Access to affordable entertaiment <br /> with Acctly
        </h1>
        <span className='text-[#9c9c9c]'>
          Your gateway to unlimited entertaiment with Acctly
        </span>
        <Link href={'/shop'}></Link>
      </div>
    </div>
  );
};

export default Hero;
