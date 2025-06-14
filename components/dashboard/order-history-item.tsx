import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/dashboard';
import { CheckCircle2, Clock, Eye, Download } from 'lucide-react';

interface OrderHistoryItemProps {
  order: {
    id: string;
    date: string;
    service: string;
    amount: number;
    status: 'delivered' | 'processing' | 'cancelled';
    category: string;
    accountDetails: {
      email: string;
      password: string;
      expiresOn: string;
    } | null;
  };
}

export function OrderHistoryItem({ order }: OrderHistoryItemProps) {
  const statusIcon = order.status === 'delivered' ? CheckCircle2 : Clock;

  return (
    <Card className='bg-[#212121] border-gray-800'>
      <CardContent className='p-5'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-4'>
            <div className='w-10 h-10 rounded-full bg-[#414141] flex items-center justify-center'>
              {statusIcon === CheckCircle2 ? (
                <CheckCircle2 className='w-5 h-5 text-[rgb(54,235,138)]' />
              ) : (
                <Clock className='w-5 h-5 text-yellow-400' />
              )}
            </div>
            <div>
              <h3 className='font-medium text-white'>{order.service}</h3>
              <p className='text-sm text-gray-400'>
                {order.id} • {formatDate(order.date)}
              </p>
            </div>
          </div>
          <div className='text-right'>
            <p className='font-medium text-white'>
              {formatCurrency(order.amount)}
            </p>
            <Badge className={getStatusColor(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
        </div>

        {order.accountDetails && (
          <div className='bg-[#414141]/30 rounded-lg p-4 mb-4'>
            <h4 className='font-medium text-white mb-2'>Account Details</h4>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Email:</span>
                <span className='text-white font-mono'>
                  {order.accountDetails.email}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Password:</span>
                <span className='text-white font-mono'>
                  {order.accountDetails.password}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Expires:</span>
                <span className='text-white'>
                  {formatDate(order.accountDetails.expiresOn)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className='flex gap-2'>
          <Button
            variant='outline'
            className='flex-1 border-gray-700 text-gray-300 hover:bg-gray-800'>
            <Eye className='w-4 h-4 mr-2' />
            View Details
          </Button>
          {order.accountDetails && (
            <Button
              variant='outline'
              className='flex-1 border-gray-700 text-gray-300 hover:bg-gray-800'>
              <Download className='w-4 h-4 mr-2' />
              Download Receipt
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
