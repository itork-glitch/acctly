'use client';

import React, { useMemo } from 'react';
import { postions, logos, logoSize } from '@/constants/hero';
import { motion } from 'framer-motion';
import Image from 'next/image';

const shuffleArray = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const HeroLogos = () => {
  const shuffledLogos = useMemo(() => shuffleArray(logos), []);

  const rotations = useMemo(
    () => postions.map(() => (Math.random() * 20 - 15).toFixed(2)),
    []
  );
  return (
    <div className='absolute inset-0 pointer-events-none'>
      {postions.map((pos, index) => {
        const logo = shuffledLogos[index];
        const rotation = Number(rotations[index]);

        return (
          <motion.div
            key={logo.id}
            className='absolute'
            style={{ top: pos.top, left: pos.left, rotate: `${rotation}deg` }}
            initial={{ opacity: 0, scale: 0.5, y: '300%' }}
            animate={{ opacity: 1, scale: 1, y: '0%' }}
            transition={{
              type: 'spring',
              stiffness: 80,
              damping: 12,
              delay: Math.random() * 1.5 + 1.2,
            }}>
            <div
              style={{
                width: logoSize,
                height: logoSize,
                position: 'relative',
              }}>
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                style={{ objectFit: 'contain' }}
                draggable={false}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default HeroLogos;
