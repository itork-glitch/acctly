'use client';

import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
}

export function AnimatedBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 2 + 0.5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className='fixed inset-0 overflow-hidden pointer-events-none opacity-30'>
      <div className='absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10'></div>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className='absolute rounded-full bg-accent/20 animate-float'
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.id * 0.1}s`,
            animationDuration: `${particle.speed + 2}s`,
          }}
        />
      ))}
    </div>
  );
}
