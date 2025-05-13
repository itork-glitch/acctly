'use client';

import React, { useEffect, useState } from 'react';
import * as hero from '@/constants/hero';
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
  const [clientReady, setClientReady] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [shuffled, setShuffled] = useState(hero.logos);
  const [rots, setRots] = useState<Number[]>([]);

  useEffect(() => {
    setShuffled(shuffleArray(hero.logos));
    setRots(hero.postions.map(() => Math.random() * 20 - 15));

    const onResize = () => setIsMobile(window.innerWidth < 640);
    onResize();

    window.addEventListener('resize', onResize);
    setClientReady(true);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (!clientReady) return null;

  const logoSize = isMobile ? hero.logoSizeMobile : hero.logoSize;
  const posArr = isMobile ? hero.positionsMobile : hero.postions;

  return (
    <div className='absolute inset-0 -z-5'>
      {posArr.map((pos, idx) => {
        const logo = shuffled[idx];
        const rot = rots[idx];

        return (
          <motion.div
            key={logo.id}
            className='absolute'
            style={{ top: pos.top, left: pos.left, rotate: rot + 'deg' }}
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
