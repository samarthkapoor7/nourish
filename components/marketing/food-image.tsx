import Image from 'next/image';
import { cn } from '@/lib/utils';

interface FoodImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function FoodImage({ src, alt, className, priority, sizes = '(max-width: 768px) 100vw, 33vw' }: FoodImageProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}
