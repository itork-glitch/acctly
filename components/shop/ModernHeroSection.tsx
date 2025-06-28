'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart,
  Star,
  Shield,
  Zap,
  Play,
  TrendingUp,
} from 'lucide-react';
import type { ServiceStats } from '@/lib/streaming-data';
import Image from 'next/image';
import { AnimatedCounter } from '@/components/shop/AnimatedCounter';
import { useEffect, useState } from 'react';

interface ModernHeroSectionProps {
  name: string;
  logo: string;
  description: string;
  tagline: string;
  stats: ServiceStats;
  urgencyMessage: string;
  valueProposition: string[];
}

export function ModernHeroSection({
  name,
  logo,
  description,
  tagline,
  stats,
  urgencyMessage,
  valueProposition,
}: ModernHeroSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className='relative min-h-screen flex items-center justify-center overflow-hidden'>
      {/* Animated Background */}
      <div className='absolute inset-0 bg-gradient-to-br from-background via-accent/5 to-background animate-gradient'></div>

      {/* Floating Elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-20 left-10 w-20 h-20 rounded-full bg-accent/10 animate-float'></div>
        <div
          className='absolute top-40 right-20 w-16 h-16 rounded-full bg-accent/15 animate-float'
          style={{ animationDelay: '1s' }}></div>
        <div
          className='absolute bottom-40 left-20 w-12 h-12 rounded-full bg-accent/20 animate-float'
          style={{ animationDelay: '2s' }}></div>
        <div
          className='absolute bottom-20 right-10 w-24 h-24 rounded-full bg-accent/10 animate-float'
          style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-20 relative z-10'>
        {/* Urgency Banner */}
        <div
          className={`text-center mb-8 ${isLoaded ? 'animate-slide-up' : 'opacity-0'}`}>
          <Badge className='accent-bg text-black font-semibold px-6 py-3 text-sm animate-pulse-glow shadow-lg'>
            <TrendingUp className='w-4 h-4 mr-2' />
            {urgencyMessage}
          </Badge>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          <div
            className={`space-y-8 ${isLoaded ? 'animate-slide-up' : 'opacity-0'}`}
            style={{ animationDelay: '0.2s' }}>
            <div className='space-y-6'>
              <Image
                src={logo || '/placeholder.svg'}
                alt={`${name} logo`}
                width={140}
                height={45}
                className='h-12 w-auto filter drop-shadow-lg'
              />

              <Badge variant='secondary' className='text-sm glass-effect'>
                <Zap className='w-3 h-3 mr-1' />
                {tagline}
              </Badge>

              <h1 className='text-5xl lg:text-7xl font-bold leading-tight'>
                Experience{' '}
                <span className='accent-text bg-gradient-to-r from-accent to-green-400 bg-clip-text text-transparent'>
                  {name}
                </span>
                <br />
                <span className='text-3xl lg:text-4xl text-muted-foreground'>
                  Like Never Before
                </span>
              </h1>

              <p className='text-xl text-muted-foreground leading-relaxed max-w-lg'>
                {description}
              </p>

              {/* Animated Value Proposition */}
              <div className='space-y-4'>
                {valueProposition.map((value, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-4 ${isLoaded ? 'animate-slide-up' : 'opacity-0'}`}
                    style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                    <div className='w-3 h-3 accent-bg rounded-full animate-pulse-glow'></div>
                    <span className='text-muted-foreground font-medium'>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 ${isLoaded ? 'animate-scale-in' : 'opacity-0'}`}
              style={{ animationDelay: '0.6s' }}>
              <Button
                size='lg'
                className='accent-bg text-black hover:bg-accent/90 font-semibold shadow-lg hover-lift group'>
                <ShoppingCart className='mr-2 h-5 w-5 group-hover:scale-110 transition-transform' />
                Get Instant Access
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='border-accent text-accent hover:bg-accent/10 shadow-lg hover-lift group'>
                <Shield className='mr-2 h-5 w-5 group-hover:scale-110 transition-transform' />
                30-Day Guarantee
              </Button>
            </div>

            {/* Trust Indicators */}
            <div
              className={`flex items-center gap-8 pt-6 ${isLoaded ? 'animate-slide-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.8s' }}>
              <div className='flex items-center gap-2'>
                <div className='flex'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className='h-5 w-5 fill-yellow-400 text-yellow-400'
                    />
                  ))}
                </div>
                <span className='font-semibold'>{stats.rating}</span>
                <span className='text-muted-foreground text-sm'>
                  ({stats.satisfaction} satisfaction)
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <Zap className='h-5 w-5 text-accent animate-pulse' />
                <span className='text-sm font-medium'>Instant activation</span>
              </div>
            </div>
          </div>

          {/* Interactive Preview */}
          <div
            className={`relative ${isLoaded ? 'animate-scale-in' : 'opacity-0'}`}
            style={{ animationDelay: '0.4s' }}>
            <div className='relative group'>
              <div className='aspect-video bg-gradient-to-br from-accent/20 via-accent/10 to-accent/5 rounded-2xl overflow-hidden shadow-2xl border border-accent/20 hover-lift'>
                <div className='w-full h-full flex items-center justify-center relative'>
                  <div className='absolute inset-0 bg-gradient-to-br from-transparent to-accent/10'></div>
                  <Button
                    size='lg'
                    className='accent-bg text-black hover:bg-accent/90 rounded-full w-20 h-20 shadow-2xl group-hover:scale-110 transition-all duration-300'>
                    <Play className='h-8 w-8 ml-1' />
                  </Button>
                </div>
              </div>

              {/* Floating Stats */}
              <div className='absolute -bottom-6 -left-6 glass-effect rounded-xl p-4 shadow-lg hover-lift'>
                <div className='text-center'>
                  <div className='font-bold text-lg accent-text'>
                    <AnimatedCounter
                      end={Number.parseInt(
                        stats.totalUsers.replace(/[^\d]/g, '')
                      )}
                      suffix='M+'
                    />
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    Active Users
                  </div>
                </div>
              </div>

              <div className='absolute -top-6 -right-6 glass-effect rounded-xl p-4 shadow-lg hover-lift'>
                <div className='text-center'>
                  <div className='font-bold text-lg accent-text'>
                    <AnimatedCounter end={stats.countries} />
                  </div>
                  <div className='text-xs text-muted-foreground'>Countries</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
