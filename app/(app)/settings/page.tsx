import { Suspense } from 'react';
import { SwiggyConnectCard } from '@/components/settings/swiggy-connect-card';
import { SettingsForms } from '@/components/settings/settings-forms';

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
        <p className="text-muted-foreground text-sm">Manage your profile and nutrition goals.</p>
      </div>

      <Suspense fallback={null}>
        <SwiggyConnectCard />
      </Suspense>

      <SettingsForms />
    </div>
  );
}
