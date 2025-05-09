'use client';

import React from 'react';
import { ModeToggle } from './ui/themeSwitcher';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  // Animation variants
  const textVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: any) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: custom * 0.3, ease: 'easeOut' },
    }),
  };

  const buttonVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, delay: 1.2, ease: 'easeOut' },
    },
  };

  return (
    <div
      className='h-[100vh]'
      style={{
        backgroundImage: 'conic-gradient(from -70deg, #111, #1a1a1a)',
      }}>
      <div className='flex w-full h-full justify-center items-center flex-col -pt-10'>
        {/* Top link appears last */}
        <motion.div
          variants={textVariant}
          initial='hidden'
          animate='visible'
          custom={0}>
          <Link
            href={'/deals'}
            className='p-[3px] rounded-full bg-gradient-to-r from-[#209e5a] to-[#141414] inline-block'>
            <div className='bg-[#141414] rounded-xl px-5 py-1 text-[#9c9c9c]'>
              Summer 2025 hot deals
            </div>
          </Link>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          className='font-bold font-montserrat text-6xl text-center tracking-wide py-6 leading-18'
          variants={textVariant}
          initial='hidden'
          animate='visible'
          custom={1}>
          Access to affordable entertainment <br /> with Acct
          <span className='text-primary'>ly</span>
        </motion.h1>

        {/* Subheading */}
        <motion.span
          className='text-[#9c9c9c]'
          variants={textVariant}
          initial='hidden'
          animate='visible'
          custom={2}>
          Your gateway to unlimited entertainment with Acctly
        </motion.span>

        {/* Buttons container with stagger */}
        <motion.div
          className='flex flex-col sm:flex-row gap-4 mt-8'
          initial='hidden'
          animate='visible'
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.2, delayChildren: 1.2 },
            },
          }}>
          <motion.div variants={buttonVariant}>
            <Link
              href={'/shop'}
              className='flex justify-between items-center gap-3 font-medium bg-white pl-3 pr-1 py-1 rounded-4xl text-black hover:scale-110 transition-all duration-300'>
              See our offers{' '}
              <ArrowRight
                className='bg-primary p-1 rounded-full text-white'
                size={36}
                strokeWidth={2.5}
              />
            </Link>
          </motion.div>

          {/*           <motion.div variants={buttonVariant}>
            <ModeToggle />
          </motion.div> */}
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
