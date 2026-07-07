'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface FitnessRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  gradientId: string;
  children?: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FitnessRing({
  value,
  size = 160,
  strokeWidth = 12,
  gradientId,
  children,
  className,
  delay = 0,
}: FitnessRingProps) {
  const [animated, setAnimated] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference - (animated / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(clamped), delay);
    return () => clearTimeout(timer);
  }, [clamped, delay]);

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-[1.4s] ease-out"
        />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FC8019" />
            <stop offset="100%" stopColor="#FF9A3C" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}
