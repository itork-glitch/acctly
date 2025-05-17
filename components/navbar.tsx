'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { disabledPages } from '@/constants/navbar';
import { Cross as Hamburger } from 'hamburger-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Deals', href: '/deals' },
  { label: 'Contact', href: '/contact' },
];

const Navbar = () => {
  const pathname = usePathname() ?? '';
  const isDisabled = disabledPages.some((page) => pathname.startsWith(page));

  if (isDisabled) return null;

  const [isOpen, setOpen] = useState(false);
  const toggleMenu = () => setOpen((prev) => !prev);

  return (
    <nav className='w-[100vw] px-2 lg:px-10 py-2 lg:py-5 fixed z-50'>
      <section className='flex justify-between items-center'>
        <div className='flex gap-2 items-center'>
          <div className='relative w-[52px] sm:w-[40px] aspect-square'>
            <Image src='/logo.png' alt='' fill className='object-contain' />
          </div>
          <h1 className='text-[22px] font-bold font-montserrat tracking-wide'>
            Acct<span className='text-primary font-black'>ly</span>
          </h1>
        </div>

        <div className='bg-[#212121] rounded-full'>
          <ul className='gap-3 hidden md:flex'>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href} className='h-full'>
                  <Link
                    href={item.href}
                    className={[
                      'block h-full px-5 py-2 rounded-full transition-colors',
                      isActive
                        ? 'bg-primary text-black font-medium'
                        : 'text-[#f5f5f5] hover:text-white hover:bg-[#414141]',
                    ].join(' ')}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <Button className='rounded-lg hidden md:flex' asChild>
            <Link href='/login'>Login</Link>
          </Button>
          <DropdownMenu open={isOpen} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='p-2 md:hidden flex'
                onClick={() => toggleMenu}>
                <Hamburger
                  aria-hidden='true'
                  size={24}
                  toggled={isOpen}
                  toggle={setOpen}
                  rounded
                />
                <span className='sr-only'>Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' sideOffset={4}>
              <DropdownMenuLabel>Good morning {'{NAME}'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link href={'/'}>Home</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={'/shop'}>Shop</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={'/deals'}>Deals</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={'/contact'}>Contact</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Settings</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>TBA</DropdownMenuItem>
                      <DropdownMenuItem>TBA</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>More...</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem>Orders</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>
    </nav>
  );
};

export default Navbar;
