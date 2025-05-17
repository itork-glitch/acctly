'use client';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { cardsData } from '@/constants/auth';

interface cardTypes {
  title: string;
  value: string;
  subtitle: string;
  isQuote?: boolean;
}

const Card = ({ title, value, subtitle, isQuote }: cardTypes) => (
  <div className='bg-white bg-opacity-60 backdrop-blur-md rounded-xl p-6 w-64 shadow-lg'>
    <h3 className='text-sm font-medium text-gray-600'>{title}</h3>
    <p
      className={`mt-2 text-3xl font-bold ${
        isQuote
          ? 'bg-gradient-to-r from-[#E8C1F0] via-[#B39DDB] to-[#94B9E9] bg-clip-text text-transparent italic'
          : 'text-gray-900'
      }`}>
      {value}
    </p>

    {subtitle && <p className='mt-1 text-xs text-gray-500'>{subtitle}</p>}
  </div>
);

export default function AuthCards() {
  const fullList = [...cardsData, ...cardsData, ...cardsData]; // 3x for loop safety
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState(0);

  useEffect(() => {
    if (cardRef.current) {
      const height = cardRef.current.offsetHeight + 24; // 24 = vertical margin (my-6)
      setCardHeight(height);
    }
  }, []);

  const totalHeight = fullList.length * cardHeight;

  return (
    <div className='absolute inset-0 overflow-hidden pointer-events-none'>
      <motion.div
        className='absolute w-full flex flex-col items-center'
        initial={{ y: 0 }}
        animate={{ y: [-totalHeight / 3, -2 * (totalHeight / 3)] }}
        transition={{
          duration: 30,
          ease: 'linear',
          repeat: Infinity,
        }}
        style={{ top: 0 }}>
        {fullList.map((card, idx) => (
          <div
            key={idx}
            className='my-6'
            ref={idx === 0 ? cardRef : null} // only the first one needs measurement
          >
            <Card
              title={card.title}
              value={card.value}
              subtitle={card.subtitle}
              isQuote={card.title.toLowerCase().includes('trust')}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
