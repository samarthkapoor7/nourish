import { Suspense } from 'react';
import { SwiggyConnectCard } from '@/components/settings/swiggy-connect-card';
import { SettingsForms } from '@/components/settings/settings-forms';

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Settings</h2>
        <p className="text-muted-foreground text-sm">Manage your profile and nutrition goals.</p>
      </div>

      <Suspense fallback={null}>
        <SwiggyConnectCard />
      </Suspense>

      <section className="bg-card rounded-xl p-5 ring-1 ring-white/6">
        <p className="text-sm font-semibold">AI Status</p>
        <p className="text-muted-foreground mt-2 text-sm">
          Watching for discounts, menu changes, restaurant closures, and better alternatives.
        </p>
      </section>

      <SettingsForms />
    </div>
  );
}
