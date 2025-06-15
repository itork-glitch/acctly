'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { StatsCards } from './stats-cards';
import { OfferCard } from './offer-card';
import { OrderHistoryItem } from './order-history-item';
import { PaymentMethodCard } from './payment-method-card';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ENTERTAINMENT_OFFERS,
  ORDER_HISTORY,
  PAYMENT_METHODS,
  USER_PROFILE,
  PROMOTIONAL_OFFERS,
} from '@/constants/dashboard';
import { formatCurrency } from '@/lib/dashboard';
import { Plus, Gift, Calendar, Download, Shield } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { supabase } from '@/utils/supabase/client';
import { signOut } from 'next-auth/react';

export function DashboardContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  const { data: session, status } = useSession();

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

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  if (status === 'loading' || isLoading) return <p>Loading...</p>;

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

            <StatsCards />

            {/* Featured Offers */}
            <h2 className='text-xl font-semibold text-white mb-4'>
              Featured Offers
            </h2>
            <div className='grid grid-cols-2 gap-4 mb-8'>
              {PROMOTIONAL_OFFERS.map((promo) => (
                <Card key={promo.id} className='border-0 overflow-hidden'>
                  <div className={`bg-gradient-to-r ${promo.color} p-5`}>
                    <div className='flex justify-between items-start'>
                      <div>
                        <Badge className='bg-white/20 text-white border-0 mb-2'>
                          {promo.discount}
                        </Badge>
                        <h3 className='text-xl font-bold text-white mb-1'>
                          {promo.title}
                        </h3>
                        <p className='text-white/80 mb-3'>
                          {promo.description}
                        </p>
                        <div className='flex items-center gap-2 mb-2'>
                          <span className='text-2xl font-bold text-white'>
                            {formatCurrency(promo.salePrice)}
                          </span>
                          <span className='text-white/60 line-through'>
                            {formatCurrency(promo.originalPrice)}
                          </span>
                        </div>
                        <p className='text-sm text-white/70'>
                          Expires: {promo.expires}
                        </p>
                      </div>
                      <Gift className='w-12 h-12 text-white/30' />
                    </div>
                    <Button className='mt-4 bg-white text-gray-900 hover:bg-white/90'>
                      Claim Offer
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Recent Orders */}
            <h2 className='text-xl font-semibold text-white mb-4'>
              Recent Orders
            </h2>
            <div className='space-y-4 mb-8'>
              {ORDER_HISTORY.slice(0, 3).map((order) => (
                <OrderHistoryItem key={order.id} order={order} />
              ))}
            </div>

            <div className='text-center'>
              <Button
                variant='outline'
                className='border-gray-700 text-gray-300 hover:bg-gray-800'
                onClick={() => setActiveTab('orders')}>
                View All Orders
              </Button>
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
              {ORDER_HISTORY.map((order) => (
                <OrderHistoryItem key={order.id} order={order} />
              ))}
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
