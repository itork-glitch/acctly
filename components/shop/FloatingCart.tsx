'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FloatingCartProps {
  itemCount: number;
  onClick: () => void;
}

export function FloatingCart({ itemCount, onClick }: FloatingCartProps) {
  if (itemCount === 0) return null;

  return (
    <div className='fixed bottom-6 right-6 z-40'>
      <Button
        onClick={onClick}
        size='lg'
        className='w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-black shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:scale-110'>
        <div className='relative'>
          <ShoppingCart className='w-6 h-6' />
          {itemCount > 0 && (
            <Badge className='absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center'>
              {itemCount > 9 ? '9+' : itemCount}
            </Badge>
          )}
        </div>
      </Button>
    </div>
  );
}
