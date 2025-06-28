import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/dashboard';
import { CheckCircle2, Clock, Eye, Download } from 'lucide-react';

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

export function OrderHistoryItem({ order }: { order: OrderWithItems }) {
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
              <h3 className='font-medium text-white'>
                {order.order_items[0].product_name}
              </h3>
              <p className='text-sm text-gray-400'>
                {order.order_number} • {formatDate(order.created_at)}
              </p>
            </div>
          </div>
          <div className='text-right'>
            <p className='font-medium text-white'>
              {formatCurrency(order.total)}
            </p>
            <Badge className={getStatusColor(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
        </div>

        {order && (
          <div className='bg-[#414141]/30 rounded-lg p-4 mb-4'>
            <h4 className='font-medium text-white mb-2'>Account Details</h4>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Email:</span>
                <span className='text-white font-mono'>
                  {order.order_items[0].email}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Password:</span>
                <span className='text-white font-mono'>
                  {order.order_items[0].password}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Expires:</span>
                <span className='text-white'>
                  {formatDate(order.order_items[0].expires_in)}
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
          {order && (
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
