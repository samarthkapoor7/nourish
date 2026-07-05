import { APP_NAME } from '@/constants/app';

export function MarketingFooter() {
  return (
    <footer className="border-border/60 border-t">
      <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm sm:flex-row">
        <p>
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
        <p>Built for people who want great food without the spreadsheet.</p>
      </div>
    </footer>
  );
}
