'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Star,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Quote,
} from 'lucide-react';
import type { Review } from '@/lib/streaming-data';
import { useState, useEffect } from 'react';

interface ModernReviewsSectionProps {
  reviews: Review[];
}

export function ModernFeatureSection({ reviews }: ModernReviewsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    });

    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length]);
}
