'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Feature } from '@/lib/streaming-data';

interface ModernFeaturesSectionProps {
  features: Feature[];
}

export function ModernFeatureSection({ features }: ModernFeaturesSectionProps) {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = Number.parseInt(
              entry.target.getAttribute('data-index') || '0'
            );
            setVisibleCards((prev) => [...prev, cardIndex]);
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = sectionRef.current?.querySelectorAll('[data-index]');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className='py-20 px-4 relative overflow-hidden'>
      {/* Background Elements */}
      <div className='absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent'></div>

      <div className='max-w-6xl mx-auto relative z-10'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent'>
            Premium Features Included
          </h2>
          <p className='text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed'>
            Unlock the full potential of your entertainment experience with our
            comprehensive feature set
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {features.map((feature, index) => (
            <Card
              key={index}
              data-index={index}
              className={`group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover-lift glass-effect ${
                visibleCards.includes(index) ? 'animate-scale-in' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className='p-8 text-center relative overflow-hidden'>
                {/* Background Glow */}
                <div className='absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

                <div className='relative z-10'>
                  <div className='text-5xl mb-6 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto bg-gradient-to-br from-accent/20 to-accent/10 group-hover:scale-110 transition-transform duration-300 shadow-lg'>
                    {feature.icon}
                  </div>
                  <h3 className='font-bold text-xl mb-4 group-hover:text-accent transition-colors duration-300'>
                    {feature.title}
                  </h3>
                  <p className='text-muted-foreground text-sm leading-relaxed'>
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
