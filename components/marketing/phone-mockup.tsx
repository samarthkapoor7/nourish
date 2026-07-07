import Image from 'next/image';
import { MARKETING_FOOD_IMAGES, MARKETING_MEALS } from '@/constants/marketing-food';
import { cn } from '@/lib/utils';

export function PhoneMockup({ className }: { className?: string }) {
  return (
    <div className={cn('relative mx-auto w-full max-w-[280px]', className)}>
      <div className="absolute -top-6 -right-8 z-10 size-24 overflow-hidden rounded-3xl shadow-lg ring-4 ring-background sm:size-28">
        <Image
          src={MARKETING_FOOD_IMAGES.saladBowl}
          alt="Fresh salad bowl"
          fill
          className="object-cover"
          sizes="112px"
        />
      </div>
      <div className="absolute -bottom-4 -left-10 z-10 size-20 overflow-hidden rounded-3xl shadow-lg ring-4 ring-background sm:size-24">
        <Image
          src={MARKETING_FOOD_IMAGES.paneerTikka}
          alt="Paneer tikka"
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>

      <div className="border-border/40 bg-card relative overflow-hidden rounded-[2.75rem] border-[5px] shadow-2xl">
        <div className="bg-primary/10 px-5 pt-4 pb-3">
          <p className="text-muted-foreground text-[11px]">Good afternoon</p>
          <h3 className="text-base font-semibold tracking-tight">Today&apos;s meals</h3>
        </div>

        <div className="space-y-3 px-3 pb-5">
          {MARKETING_MEALS.map((meal) => (
            <div
              key={meal.id}
              className="border-border/30 bg-background/80 flex gap-3 overflow-hidden rounded-2xl border p-2"
            >
              <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                <Image src={meal.image} alt={meal.name} fill className="object-cover" sizes="56px" />
              </div>
              <div className="min-w-0 flex-1 py-0.5">
                <p className="truncate text-xs font-medium">{meal.name}</p>
                <p className="text-muted-foreground truncate text-[10px]">
                  {meal.restaurant} · {meal.time}
                </p>
                <p className="text-primary mt-1 text-[10px] font-medium">Ready to order</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-3 pb-5">
          <div className="bg-primary text-primary-foreground rounded-2xl py-3 text-center text-xs font-medium">
            Plan today&apos;s meals
          </div>
        </div>
      </div>
    </div>
  );
}
