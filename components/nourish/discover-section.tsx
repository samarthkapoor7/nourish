'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { MOCK_MEAL_RECOMMENDATIONS } from '@/constants/mock-data';

const STORIES = [
  {
    headline: "You're only one meal away from today's protein goal",
    sub: 'A light dinner with 35g protein closes the gap perfectly.',
  },
  {
    headline: '₹160 left in your budget for tonight',
    sub: 'Plenty of room for something satisfying without overspending.',
  },
  {
    headline: 'The Green Bowl delivers in 20 minutes',
    sub: 'Your most-ordered spot this week — always a safe bet.',
  },
];

export function DiscoverSection() {
  const spotlight = MOCK_MEAL_RECOMMENDATIONS[0];

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Discover</h2>
        <p className="text-muted-foreground mt-1 text-sm">Insights and picks for right now</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {STORIES.map((story) => (
          <div
            key={story.headline}
            className="nourish-glass rounded-[20px] p-6 transition-all duration-300 hover:bg-[#1a1a1a]/90"
          >
            <p className="text-base leading-snug font-medium">{story.headline}</p>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{story.sub}</p>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="group nourish-glass relative w-full overflow-hidden rounded-[24px] text-left transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
      >
        <div className="grid lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
              Tonight&apos;s pick
            </p>
            <h3 className="mt-2 text-2xl font-bold sm:text-3xl">{spotlight.name}</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              {spotlight.restaurantName} · {spotlight.etaMinutes} min delivery
            </p>
            <span className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-medium text-[#FC8019] transition-colors group-hover:text-[#FF9A3C]">
              Order now
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
          <div className="relative min-h-[200px] lg:min-h-[280px]">
            <Image
              src={spotlight.imageUrl}
              alt={spotlight.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#151515] via-transparent to-transparent lg:from-[#151515]/60" />
          </div>
        </div>
      </button>
    </section>
  );
}
