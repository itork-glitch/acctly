import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, DollarSign, Package, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/dashboard';
import { DASHBOARD_STATS } from '@/constants/dashboard';

export function StatsCards() {
  const stats = [
    {
      title: 'Total Purchases',
      value: DASHBOARD_STATS.totalPurchases.toString(),
      subtitle: 'Lifetime orders',
      icon: ShoppingBag,
      color: 'from-[rgb(54,235,138)] to-emerald-400',
    },
    {
      title: 'Total Spent',
      value: formatCurrency(DASHBOARD_STATS.totalSpent),
      subtitle: 'All-time spending',
      icon: DollarSign,
      color: 'from-blue-600 to-blue-500',
    },
    {
      title: 'Active Purchases',
      value: DASHBOARD_STATS.activePurchases.toString(),
      subtitle: 'Currently active',
      icon: Package,
      color: 'from-purple-600 to-purple-500',
    },
    {
      title: 'Total Saved',
      value: formatCurrency(DASHBOARD_STATS.savedAmount),
      subtitle: 'Through discounts',
      icon: TrendingUp,
      color: 'from-green-600 to-green-500',
    },
  ];

  return (
    <div className='grid grid-cols-4 gap-4 mb-6'>
      {stats.map((stat, index) => (
        <Card
          key={index}
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
