import Image from 'next/image';
import { cn } from '@/lib/utils';

interface MealFoodCardProps {
  name: string;
  restaurant: string;
  image: string;
  className?: string;
}

export function MealFoodCard({ name, restaurant, image, className }: MealFoodCardProps) {
  return (
    <div
      className={cn(
        'border-border/40 bg-card overflow-hidden rounded-3xl border shadow-sm transition-transform hover:-translate-y-1',
        className,
      )}
    >
      <div className="relative aspect-[4/3] w-full">
        <Image src={image} alt={name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 320px" />
      </div>
      <div className="p-5">
        <p className="font-medium leading-snug">{name}</p>
        <p className="text-muted-foreground mt-1 text-sm">{restaurant}</p>
      </div>
    </div>
  );
}
