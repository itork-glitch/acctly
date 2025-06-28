'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ShoppingCart, Zap, Shield, Crown, Star } from 'lucide-react';
import type { PricingPlan } from '@/lib/streaming-data';
import { useState, useEffect } from 'react';

interface ModernPricingSectionProps {
  plans: PricingPlan[];
  serviceName: string;
}

export function ModernPricingSection({
  plans,
  serviceName,
}: ModernPricingSectionProps) {
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className='py-20 px-4 relative overflow-hidden'>
      {/* Animated Background */}
      <div className='absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 animate-gradient'></div>

      <div className='max-w-6xl mx-auto relative z-10'>
        <div
          className={`text-center mb-16 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
          <Badge className='accent-bg text-black font-semibold px-4 py-2 mb-6'>
            <Crown className='w-4 h-4 mr-2' />
            Premium Plans
          </Badge>
          <h2 className='text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent'>
            Choose Your Perfect Plan
          </h2>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed'>
            Get instant access to {serviceName} with our flexible pricing
            options. All plans include our 30-day money-back guarantee.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative transition-all duration-500 cursor-pointer group ${
                plan.popular
                  ? 'border-2 border-accent shadow-2xl shadow-accent/20 scale-105 z-10'
                  : 'border hover:border-accent/50 hover:shadow-xl'
              } ${isVisible ? 'animate-scale-in' : 'opacity-0'} ${
                hoveredPlan === index
                  ? 'scale-110'
                  : hoveredPlan !== null && hoveredPlan !== index
                    ? 'scale-95 opacity-75'
                    : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredPlan(index)}
              onMouseLeave={() => setHoveredPlan(null)}>
              {/* Background Glow */}
              <div className='absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg'></div>

              {plan.popular && (
                <Badge className='absolute -top-4 left-1/2 transform -translate-x-1/2 accent-bg text-black font-semibold shadow-lg animate-pulse-glow'>
                  <Star className='w-3 h-3 mr-1' />
                  {plan.urgency || 'Most Popular'}
                </Badge>
              )}

              {plan.savings && (
                <Badge
                  variant='secondary'
                  className='absolute -top-4 right-4 bg-orange-500 text-white shadow-lg'>
                  {plan.savings}
                </Badge>
              )}

              <CardHeader className='text-center pb-4 relative z-10'>
                <CardTitle className='text-2xl font-bold'>
                  {plan.name}
                </CardTitle>
                <div className='mt-6 space-y-2'>
                  {plan.originalPrice && (
                    <div className='text-lg text-muted-foreground line-through'>
                      ${plan.originalPrice}/{plan.period}
                    </div>
                  )}
                  <div className='flex items-baseline justify-center gap-1'>
                    <span className='text-5xl font-bold accent-text group-hover:scale-110 transition-transform duration-300'>
                      ${plan.price}
                    </span>
                    <span className='text-muted-foreground text-lg'>
                      /{plan.period}
                    </span>
                  </div>
                  {plan.originalPrice && (
                    <div className='text-sm font-medium text-green-600 animate-pulse'>
                      Save $
                      {(
                        (plan.originalPrice - plan.price) *
                        (plan.period === 'year' ? 1 : 12)
                      ).toFixed(0)}
                      {plan.period === 'month' ? '/year' : ''}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className='space-y-6 relative z-10'>
                <ul className='space-y-4'>
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className='flex items-start gap-3 group/item'>
                      <Check className='h-5 w-5 text-accent mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200' />
                      <span className='text-sm font-medium'>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className='space-y-4 pt-4'>
                  <Button
                    className={`w-full font-semibold shadow-lg hover-lift group/btn ${
                      plan.popular
                        ? 'accent-bg text-black hover:bg-accent/90'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}>
                    <ShoppingCart className='mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform' />
                    Get {plan.name} Now
                  </Button>

                  <div className='flex items-center justify-center gap-2 text-xs text-muted-foreground'>
                    <Zap className='h-3 w-3 text-accent animate-pulse' />
                    <span>Instant activation • Cancel anytime</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust indicators */}
        <div
          className={`text-center mt-16 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
          style={{ animationDelay: '0.6s' }}>
          <div className='flex items-center justify-center gap-12 text-sm text-muted-foreground flex-wrap'>
            <div className='flex items-center gap-2 hover:text-accent transition-colors cursor-pointer'>
              <Shield className='h-5 w-5 text-accent' />
              <span className='font-medium'>30-day money back</span>
            </div>
            <div className='flex items-center gap-2 hover:text-accent transition-colors cursor-pointer'>
              <Zap className='h-5 w-5 text-accent animate-pulse' />
              <span className='font-medium'>Instant access</span>
            </div>
            <div className='flex items-center gap-2 hover:text-accent transition-colors cursor-pointer'>
              <Check className='h-5 w-5 text-accent' />
              <span className='font-medium'>No contracts</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
