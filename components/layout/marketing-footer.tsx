import { APP_NAME } from '@/constants/app';

export function MarketingFooter() {
  return (
    <footer className="border-border/40 border-t">
      <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm sm:flex-row">
        <p>
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
        <p>Good food, less stress — that&apos;s the whole idea.</p>
      </div>
    </footer>
  );
}
