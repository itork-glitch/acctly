'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Home,
  Package,
  ShoppingBag,
  CreditCard,
  User,
  HelpCircle,
  LogOut,
  Play,
  Gift,
  Zap,
} from 'lucide-react';
import { pages, USER_PROFILE } from '@/constants/dashboard';
import Image from 'next/image';
import Link from 'next/link';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: any;
  handleSignOut: () => void;
}

const iconMap = {
  Home,
  Package,
  ShoppingBag,
  CreditCard,
  User,
};

export function Sidebar({
  activeTab,
  onTabChange,
  user,
  handleSignOut,
}: SidebarProps) {
  if (!user) return <p>loading</p>;
  return (
    <div className='w-64 bg-[#212121] border-r border-gray-800 flex flex-col'>
      {/* Brand */}
      <div className='p-6'>
        <div className='flex items-center gap-2'>
          <Image src={'/logo.png'} alt='Acctly logo' height={36} width={36} />
          <span className='font-semibold text-lg text-white'>Acctly</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className='flex-1 px-4'>
        <div className='space-y-1 mb-6'>
          {pages.map((item) => {
            const IconComponent = iconMap[item.icon as keyof typeof iconMap];
            return (
              <Button
                key={item.id}
                variant='ghost'
                className={`w-full justify-start ${
                  activeTab === item.id
                    ? 'bg-[rgb(54,235,138)]/10 text-[rgb(54,235,138)]'
                    : 'text-gray-300 hover:bg-[rgb(54,235,138)]/20'
                }`}
                onClick={() => onTabChange(item.id)}>
                <IconComponent className='w-4 h-4 mr-3' />
                {item.label}
              </Button>
            );
          })}
        </div>

        <div className='pt-4 border-t border-[#414141]'>
          <div className='space-y-1'>
            <Button
              variant='default'
              className='w-full justify-start bg-transparent hover:bg-[rgb(54,235,138)]/10 text-gray-300 '>
              <HelpCircle className='w-4 h-4 mr-3' />
              Help & Support
            </Button>
            <Button
              variant='default'
              className='w-full justify-start bg-transparent text-gray-300 hover:text-white hover:bg-red-500'
              onClick={handleSignOut}>
              <LogOut className='w-4 h-4 mr-3' />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Promotional Card */}
      <div className='p-4'>
        <Card className='bg-gradient-to-br from-purple-600 to-pink-600 text-white border-0'>
          <CardContent className='p-4'>
            <div className='flex items-center gap-2 mb-2'>
              <Gift className='w-5 h-5' />
              <h3 className='font-semibold'>Black Friday Sale</h3>
            </div>
            <p className='text-sm text-purple-100 mb-3'>
              Save up to 50% on premium bundles
            </p>
            <Link href='/shop'>
              <Button
                size='sm'
                className='w-full bg-white text-purple-600 hover:bg-gray-100'>
                <Zap className='w-4 h-4 mr-2' />
                View Deals
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* User Profile */}
      <div className='p-4 border-t border-gray-800'>
        <div className='flex items-center gap-3 p-3 rounded-lg bg-[#414141]/50'>
          <img
            src={`/api/avatar?username=${user.username}`}
            alt={`profile picture`}
            height={40}
            width={40}
            className='rounded-full'
          />
          <div>
            <p className='font-medium text-white'>{user.username}</p>
            <p className='text-xs text-gray-400'>
              Member since:&nbsp;
              {new Date(user.created_at).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
