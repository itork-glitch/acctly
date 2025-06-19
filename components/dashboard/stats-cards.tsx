'use client';

import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/dashboard';
import { supabase } from '@/utils/supabase/client';
import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ShoppingBag,
  DollarSign,
  Package,
  TrendingUp,
  LucideIcon,
} from 'lucide-react';

interface StatsCardsProps {
  userID: string;
}

interface Stats {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
}

export function StatsCards({ userID }: StatsCardsProps) {
  const [stats, setStats] = useState<Stats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userID) return;

    const fetchStats = async () => {
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, total, status')
        .eq('user_id', userID);

      if (ordersError || !orders) {
        console.error(ordersError);
        setLoading(false);
        return;
      }

      const orderIDs = orders.map((order) => order.id);

      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select(
          'order_id, quantity, price, product_id, products!inner(compare_price)'
        )
        .in('order_id', orderIDs);

      if (itemsError || !orderItems) {
        console.error(itemsError);
        setLoading(false);
        return;
      }

      const totalPurchases = orders.length;
      const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      const activePurchases = orders.filter(
        (o) => o.status === 'active'
      ).length;

      const savedAmount = orderItems.reduce((sum, item) => {
        const compare = (item.products as any)?.compare_price ?? item.price;
        const savedPerItem = (compare - item.price) * item.quantity;
        return sum + (savedPerItem > 0 ? savedPerItem : 0);
      }, 0);

      const stats_draft: Stats[] = [
        {
          title: 'Total Purchases',
          value: totalPurchases.toString(),
          subtitle: 'Lifetime orders',
          icon: ShoppingBag,
          color: 'from-[rgb(54,235,138)] to-emerald-400',
        },
        {
          title: 'Total Spent',
          value: formatCurrency(totalSpent),
          subtitle: 'All-time spending',
          icon: DollarSign,
          color: 'from-blue-600 to-blue-500',
        },
        {
          title: 'Active Purchases',
          value: activePurchases.toString(),
          subtitle: 'Currently active',
          icon: Package,
          color: 'from-purple-600 to-purple-500',
        },
        {
          title: 'Total Saved',
          value: formatCurrency(savedAmount),
          subtitle: 'Through discounts',
          icon: TrendingUp,
          color: 'from-green-600 to-green-500',
        },
      ];

      setStats(stats_draft);
      setLoading(false);
    };

    fetchStats();
  }, [userID]);

  if (loading) {
    return (
      <div className='grid grid-cols-4 gap-4 mb-6'>
        {[...Array(4)].map((_, idx) => (
          <Card key={idx} className='bg-muted'>
            <CardContent className='p-6 space-y-3'>
              <Skeleton className='w-1/2 h-4 bg-muted-foreground/20' />
              <Skeleton className='w-full h-8 bg-muted-foreground/30' />
              <Skeleton className='w-2/3 h-3 bg-muted-foreground/20' />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-4 gap-4 mb-6'>
      {stats.map((stat, idx) => (
        <Card
          key={idx}
          className={`bg-gradient-to-br ${stat.color} text-white border-0`}>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-white/80 font-medium'>{stat.title}</span>
              <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'>
                <stat.icon className='w-4 h-4' />
              </div>
            </div>
            <div className='text-3xl font-bold mb-1'>{stat.value}</div>
            <div className='text-sm text-white/80'>{stat.subtitle}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
