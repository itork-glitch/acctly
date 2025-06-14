import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, calculateDiscountPercentage } from '@/lib/dashboard';
import { ShoppingCart, Star } from 'lucide-react';

interface OfferCardProps {
  offer: {
    id: number;
    name: string;
    description: string;
    icon: string;
    price: number;
    originalPrice: number;
    discount: number;
    category: string;
    features: string[];
    validUntil: string;
    color: string;
    popular: boolean;
  };
}

export function OfferCard({ offer }: OfferCardProps) {
  const discountPercentage = calculateDiscountPercentage(
    offer.originalPrice,
    offer.price
  );

  return (
    <Card className='bg-[#212121] border-gray-800 overflow-hidden hover:border-[rgb(54,235,138)]/30 transition-colors'>
      <CardContent className='p-0'>
        <div className='flex items-stretch'>
          <div
            className={`w-2 bg-gradient-to-b ${offer.color}`}
            aria-hidden='true'></div>
          <div className='flex-1 p-5'>
            <div className='flex items-start justify-between mb-3'>
              <div className='flex items-center gap-3'>
                <div className='text-2xl'>{offer.icon}</div>
                <div>
                  <h3 className='font-medium text-white'>{offer.name}</h3>
                  <p className='text-sm text-gray-400'>{offer.category}</p>
                </div>
              </div>
              <div className='flex gap-2'>
                {offer.popular && (
                  <Badge className='bg-[rgb(54,235,138)]/20 text-[rgb(54,235,138)] border-[rgb(54,235,138)]/30'>
                    <Star className='w-3 h-3 mr-1' />
                    Popular
                  </Badge>
                )}
                <Badge className='bg-red-500/20 text-red-400 border-red-500/30'>
                  {discountPercentage}% OFF
                </Badge>
              </div>
            </div>

            <p className='text-sm text-gray-300 mb-4'>{offer.description}</p>

            <div className='space-y-2 mb-4'>
              {offer.features.slice(0, 3).map((feature, index) => (
                <div
                  key={index}
                  className='flex items-center gap-2 text-sm text-gray-400'>
                  <div className='w-1.5 h-1.5 bg-[rgb(54,235,138)] rounded-full'></div>
                  {feature}
                </div>
              ))}
            </div>

            <div className='flex items-center justify-between mb-4'>
              <div>
                <div className='flex items-center gap-2'>
                  <span className='text-2xl font-bold text-white'>
                    {formatCurrency(offer.price)}
                  </span>
                  <span className='text-sm text-gray-400 line-through'>
                    {formatCurrency(offer.originalPrice)}
                  </span>
                </div>
                <p className='text-xs text-gray-500'>
                  Valid until {new Date(offer.validUntil).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className='border-t border-gray-800 p-4'>
        <Button className='w-full bg-[rgb(54,235,138)] hover:bg-[rgb(54,235,138)]/90 text-black'>
          <ShoppingCart className='w-4 h-4 mr-2' />
          Purchase Now
        </Button>
      </CardFooter>
    </Card>
  );
}
