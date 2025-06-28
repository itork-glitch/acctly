'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { StatsCards } from './stats-cards';
import { OrderHistoryItem } from './order-history-item';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/dashboard';
import { Plus, Download, Shield, Calendar, Gift } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { supabase } from '@/utils/supabase/client';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import {
  ORDER_HISTORY,
  PAYMENT_METHODS,
  USER_PROFILE,
} from '@/constants/dashboard';
import { PaymentMethodCard } from './payment-method-card';

type Product = {
  id: number;
  name: string;
  price: number;
  compare_price: number;
  quantity: number;
  description: string;
};

type OrderItem = {
  id: number;
  product_id: string;
  product_name?: string;
  email: string;
  password: string;
  expires_in: string;
};

type OrderWithItems = {
  id: number;
  order_number: string;
  total: number;
  status: string;
  notes: string | null;
  created_at: string;
  order_items: OrderItem[];
};

export function DashboardContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<OrderWithItems[]>([]);

  const { data: session } = useSession();

  useEffect(() => {
    const fetchUser = async () => {
      if (!session?.user?.email) return;
      setIsLoading(true);

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .maybeSingle();

      userError
        ? console.error('Error while fetching user: ', userError)
        : setUser(userData);

      setIsLoading(false);
    };

    fetchUser();
  }, [session]);

  useEffect(() => {
    if (!user) return;

    const fetchFeaturedProducts = async () => {
      const { data: products, error } = await supabase
        .from('products')
        .select('id, name, price, compare_price, quantity, description')
        .eq('is_featured', true);

      if (error || !products) {
        console.error(error);
        return;
      }

      setFeatured(products.slice(0, 2));
    };

    const fetchRecentOrders = async () => {
      const orderSelect = `
      id,
      order_number,
      total,
      status,
      created_at,
      order_items (
        id,
        product_id,
        email,
        password,
        expires_in
      )
    `;

      const { data: orders, error } = await supabase
        .from('orders')
        .select(orderSelect)
        .eq('user_id', session?.user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error || !orders) {
        console.error(error);
        return;
      }

      const productIDs = Array.from(
        new Set(orders.flatMap((o) => o.order_items.map((i) => i.product_id)))
      );

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name')
        .in('id', productIDs);

      if (productsError || !productsData) {
        console.error('Fetch product names error:', productsError);
      }

      const nameMap = (productsData || []).reduce(
        (acc, p) => {
          acc[p.id] = p.name;
          return acc;
        },
        {} as Record<number, string>
      );

      const enriched = orders.map((o) => ({
        ...o,
        order_items: o.order_items.map((i) => ({
          ...i,
          product_name: nameMap[i.product_id] || 'Unknown',
        })),
      })) as OrderWithItems[];

      setRecentOrders(enriched);
    };

    const fetchAll = async () => {
      setIsLoading(true);
      await Promise.all([fetchFeaturedProducts(), fetchRecentOrders()]);
      setIsLoading(false);
    };

    fetchAll();
  }, [user]);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  if (isLoading) {
    return (
      <div className='flex-1 p-6'>
        {/* Header Skeleton */}
        <Skeleton className='h-8 w-1/3 mb-6' />
        {/* Featured skeletons */}
        <div className='grid grid-cols-2 gap-4 mb-8'>
          <Skeleton className='h-48 w-full' />
          <Skeleton className='h-48 w-full' />
        </div>
        {/* Orders skeletons */}
        <div className='space-y-4'>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className='h-40 w-full' />
          ))}
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <div className='mb-6'>
              <h1 className='text-2xl font-bold text-white mb-2'>Dashboard</h1>
              <p className='text-gray-400'>
                Welcome back! Here's your account overview.
              </p>
            </div>

            <StatsCards userID={session?.user.id || ''} />

            {/* Featured Offers */}
            <h2 className='text-xl font-semibold text-white mb-4'>
              Featured Offers
            </h2>
            <div className='grid grid-cols-2 gap-4 mb-8'>
              {featured.map((offer) => (
                <Card
                  key={offer.id}
                  className={`border-0 overflow-hidden bg-gradient-to-r ${offer.name.includes('Netflix') ? 'from-red-500 to-rose-800' : offer.name.includes('Spotify') ? 'from-emerald-500 to-green-700' : ''}`}>
                  <div className='p-5'>
                    <div className='flex justify-between items-start'>
                      <div>
                        <Badge className='bg-white/20 text-white border-0 mb-2'>
                          You saving up to{' '}
                          {Math.round(offer.compare_price - offer.price)}$
                          monthly
                        </Badge>
                        <h3 className='text-xl font-bold text-white mb-1'>
                          {offer.name}
                        </h3>
                        <p className='text-white/80 mb-3'>
                          {offer.description}
                        </p>
                        <div className='flex items-center gap-2 mb-2'>
                          <span className='text-2xl font-bold text-white'>
                            {formatCurrency(offer.price)}
                          </span>
                          <span className='text-white/60 line-through'>
                            {formatCurrency(offer.compare_price)}
                          </span>
                        </div>
                        <p className='text-sm text-white/70'>
                          Expires: 31 July 2025
                        </p>
                      </div>
                      {/*  <Gift className='w-12 h-12 text-white/90' /> */}
                    </div>
                    <Link
                      href={`/shop/${offer.name.split(' ')[0].toLowerCase()}`}>
                      <Button className='mt-4 bg-white text-gray-900 hover:bg-white/90'>
                        Claim Offer
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            {/* Recent Orders */}
            <h2 className='text-xl font-semibold text-white mb-4'>
              Recent Orders
            </h2>
            <div className='space-y-4 mb-8'>
              {recentOrders.length === 0 ? (
                <div>You dont have any recent orders.</div>
              ) : (
                <div>
                  {recentOrders.map((order, idx) => (
                    <div>
                      <OrderHistoryItem key={idx + 1} order={order} />
                    </div>
                  ))}
                  <div className='text-center pt-6'>
                    <Button
                      variant='outline'
                      className='border-gray-700 text-gray-300 hover:bg-gray-800'
                      onClick={() => setActiveTab('orders')}>
                      View All Orders
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'offers':
        return (
          <div>
            <div className='mb-6'>
              <h1 className='text-2xl font-bold text-white mb-2'>
                Available Offers
              </h1>
              <p className='text-gray-400'>
                Browse our premium entertainment account offers.
              </p>
            </div>

            <div className='grid grid-cols-2 gap-6'>
              {/*    {ENTERTAINMENT_OFFERS.map((offer) => (
                <OfferCard key={offer.id}  />
              ))} */}
            </div>
          </div>
        );

      case 'orders':
        return (
          <div>
            <div className='mb-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <h1 className='text-2xl font-bold text-white mb-2'>
                    Order History
                  </h1>
                  <p className='text-gray-400'>
                    View and manage your past orders.
                  </p>
                </div>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    className='border-gray-700 text-gray-300 hover:bg-gray-800'>
                    <Download className='w-4 h-4 mr-2' />
                    Export
                  </Button>
                  <Button
                    variant='outline'
                    className='border-gray-700 text-gray-300 hover:bg-gray-800'>
                    <Calendar className='w-4 h-4 mr-2' />
                    Filter
                  </Button>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              {/* {ORDER_HISTORY.map((order) => (
                <OrderHistoryItem key={order.id} order={order} />
              ))} */}
            </div>
          </div>
        );

      case 'payment':
        return (
          <div>
            <div className='mb-6'>
              <h1 className='text-2xl font-bold text-white mb-2'>
                Payment Methods
              </h1>
              <p className='text-gray-400'>
                Manage your payment methods and billing information.
              </p>
            </div>

            <div className='grid grid-cols-2 gap-6 mb-8'>
              {PAYMENT_METHODS.map((method) => (
                <PaymentMethodCard key={method.id} method={method} />
              ))}

              <Card className='bg-[#212121] border-gray-800 border-dashed'>
                <CardContent className='p-5 flex flex-col items-center justify-center h-full'>
                  <div className='w-12 h-12 rounded-full bg-[#414141]/50 flex items-center justify-center mb-3'>
                    <Plus className='w-6 h-6 text-[rgb(54,235,138)]' />
                  </div>
                  <h3 className='font-medium text-white mb-1'>
                    Add Payment Method
                  </h3>
                  <p className='text-sm text-gray-400 text-center mb-4'>
                    Add a new credit card or payment method
                  </p>
                  <Button className='bg-[rgb(54,235,138)] hover:bg-[rgb(54,235,138)]/90 text-black'>
                    Add New Card
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div>
            <div className='mb-6'>
              <h1 className='text-2xl font-bold text-white mb-2'>
                Profile Settings
              </h1>
              <p className='text-gray-400'>
                Manage your account information and preferences.
              </p>
            </div>

            <div className='grid grid-cols-3 gap-6'>
              <div className='col-span-2 space-y-6'>
                <Card className='bg-[#212121] border-gray-800'>
                  <CardHeader>
                    <CardTitle className='text-white'>
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <label className='text-sm text-gray-400'>
                            First Name
                          </label>
                          <Input
                            defaultValue={USER_PROFILE.name.split(' ')[0]}
                            className='bg-[#414141] border-gray-700 text-white focus:border-[rgb(54,235,138)]'
                          />
                        </div>
                        <div className='space-y-2'>
                          <label className='text-sm text-gray-400'>
                            Last Name
                          </label>
                          <Input
                            defaultValue={USER_PROFILE.name.split(' ')[1]}
                            className='bg-[#414141] border-gray-700 text-white focus:border-[rgb(54,235,138)]'
                          />
                        </div>
                        <div className='space-y-2'>
                          <label className='text-sm text-gray-400'>
                            Email Address
                          </label>
                          <Input
                            defaultValue={USER_PROFILE.email}
                            className='bg-[#414141] border-gray-700 text-white focus:border-[rgb(54,235,138)]'
                          />
                        </div>
                        <div className='space-y-2'>
                          <label className='text-sm text-gray-400'>
                            Phone Number
                          </label>
                          <Input
                            defaultValue={USER_PROFILE.phone}
                            className='bg-[#414141] border-gray-700 text-white focus:border-[rgb(54,235,138)]'
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className='border-t border-gray-800 p-4'>
                    <Button className='bg-[rgb(54,235,138)] hover:bg-[rgb(54,235,138)]/90 text-black'>
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className='space-y-6'>
                <Card className='bg-[#212121] border-gray-800'>
                  <CardHeader>
                    <CardTitle className='text-white'>Profile</CardTitle>
                  </CardHeader>
                  <CardContent className='flex flex-col items-center'>
                    <Avatar className='w-24 h-24 mb-4'>
                      <AvatarImage
                        src={USER_PROFILE.avatar || '/placeholder.svg'}
                      />
                      <AvatarFallback className='bg-[rgb(54,235,138)] text-black text-2xl'>
                        {USER_PROFILE.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className='font-medium text-white text-lg mb-1'>
                      {USER_PROFILE.name}
                    </h3>
                    <p className='text-sm text-gray-400 mb-4'>
                      Premium Member since {USER_PROFILE.memberSince}
                    </p>
                    <Button
                      variant='outline'
                      className='w-full border-gray-700 text-gray-300 hover:bg-gray-800 mb-2'>
                      Change Avatar
                    </Button>
                  </CardContent>
                </Card>

                <Card className='bg-[#212121] border-gray-800'>
                  <CardContent className='p-5'>
                    <div className='flex items-center gap-3 mb-3'>
                      <Shield className='w-5 h-5 text-[rgb(54,235,138)]' />
                      <h3 className='font-medium text-white'>
                        Account Security
                      </h3>
                    </div>
                    <p className='text-sm text-gray-400 mb-4'>
                      Enable two-factor authentication to secure your account.
                    </p>
                    <Button className='w-full bg-[rgb(54,235,138)] hover:bg-[rgb(54,235,138)]/90 text-black'>
                      Enable 2FA
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='flex h-screen bg-[#111111]'>
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
        handleSignOut={handleSignOut}
      />
      <div className='flex-1 flex flex-col'>
        <Header />
        <main className='flex-1 p-6 overflow-auto'>{renderTabContent()}</main>
      </div>
    </div>
  );
}
