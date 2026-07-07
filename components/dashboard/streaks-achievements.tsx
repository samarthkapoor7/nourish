'use client';

import { MOCK_ACHIEVEMENTS } from '@/constants/mock-data';
import { cn } from '@/lib/utils';

export function StreaksAchievements() {
  return (
    <section className="animate-fade-in-up space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Streaks & Achievements</h2>
        <p className="text-muted-foreground mt-1 text-sm">Keep the momentum going</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_ACHIEVEMENTS.map((achievement) => (
          <div
            key={achievement.id}
            className={cn(
              'relative overflow-hidden rounded-[20px] bg-gradient-to-br p-5 transition-transform duration-300 hover:scale-[1.02]',
              achievement.gradient,
            )}
          >
            <div className="absolute inset-0 bg-[#171717]/80" />
            <div className="relative">
              <p className="text-sm leading-snug font-medium">{achievement.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
