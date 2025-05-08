// components/Navbar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Deals', href: '/deals' },
  { label: 'Contact', href: '/contact' },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className='w-[100vw] px-10 py-5 fixed'>
      <section className='flex justify-between items-center'>
        <div className='flex gap-2 items-center'>
          <Image src='/vercel.svg' alt='' height={32} width={32} />
          <h1 className='text-xl font-bold font-montserrat'>
            Acct<span className='text-primary'>ly</span>
          </h1>
        </div>

        <div className='bg-[#212121] rounded-full'>
          <ul className='flex gap-3'>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                // li ma pełną wysokość kontenera
                <li key={item.href} className='h-full'>
                  <Link
                    href={item.href}
                    className={[
                      // robimy z linka block-level i wypełniamy całą wysokość rodzica
                      'block h-full px-5 py-2 rounded-full transition-colors',
                      isActive
                        ? // aktywny – białe tło + czarny tekst
                          'bg-primary text-black font-medium'
                        : // nieaktywny – tylko tekst, na hover ciemniejsze tło
                          'text-[#f5f5f5] hover:text-white hover:bg-[#414141]',
                    ].join(' ')}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <Button className='rounded-lg' asChild>
            <Link href='/login'>Login</Link>
          </Button>
        </div>
      </section>
    </nav>
  );
};

export default Navbar;
