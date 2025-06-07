'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, ShoppingCart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartToastProps {
  isVisible: boolean;
  productName: string;
  onClose: () => void;
}

export function CartToast({ isVisible, productName, onClose }: CartToastProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!shouldRender) return null;

  return (
    <div className='fixed top-4 right-4 z-50'>
      <div
        className={`
          bg-[#212121] border border-[#414141] rounded-lg p-4 shadow-2xl max-w-sm
          transform transition-all duration-300 ease-out
          ${isVisible ? 'animate-slide-in' : 'animate-slide-out'}
        `}>
        <div className='flex items-start gap-3'>
          <div className='relative'>
            <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center'>
              <CheckCircle className='w-5 h-5 text-black' />
            </div>
            <div className='absolute inset-0 w-8 h-8 bg-primary rounded-full animate-pulse-ring'></div>
          </div>

          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 mb-1'>
              <ShoppingCart className='w-4 h-4 text-primary' />
              <p className='text-sm font-semibold text-white'>Added to Cart!</p>
            </div>
            <p className='text-sm text-gray-300 truncate'>{productName}</p>
            <div className='flex items-center gap-2 mt-2'>
              <Button
                size='sm'
                className='bg-primary hover:bg-primary/90 text-black text-xs h-7'>
                View Cart
              </Button>
              <Button
                size='sm'
                variant='outline'
                className='border-gray-600 text-gray-300 hover:bg-gray-800 text-xs h-7'>
                Continue Shopping
              </Button>
            </div>
          </div>

          <Button
            size='icon'
            variant='ghost'
            onClick={onClose}
            className='w-6 h-6 text-gray-400 hover:text-white hover:bg-gray-800 shrink-0'>
            <X className='w-4 h-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
