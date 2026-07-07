'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useUserSettings } from '@/hooks/use-user-settings';
import {
  getDefaultUserSettings,
  USER_SETTINGS_STORAGE_KEY,
  type UserSettings,
} from '@/lib/user-settings';

export function SettingsForms() {
  const { settings: storedSettings, persist } = useUserSettings();
  const [settings, setSettings] = useState<UserSettings>(getDefaultUserSettings);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettings(storedSettings);
    setHydrated(true);
  }, [storedSettings]);

  const update = (field: keyof UserSettings, value: string) => {
    setSettings((current) => ({ ...current, [field]: value }));
  };

  const handleSaveProfile = () => {
    persist(settings);
    toast.success('Profile saved.');
  };

  const handleSaveGoals = () => {
    persist(settings);
    toast.success('Nutrition goals saved.');
  };

  if (!hydrated) {
    return null;
  }

  return (
    <>
      <Card className="bg-card rounded-xl ring-1 ring-white/6">
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>Basic account information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              placeholder="Jane Doe"
              value={settings.name}
              onChange={(event) => update('name', event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-email">Email</Label>
            <Input
              id="settings-email"
              type="email"
              placeholder="jane@example.com"
              value={settings.email}
              onChange={(event) => update('email', event.target.value)}
            />
          </div>
          <Button onClick={handleSaveProfile}>Save changes</Button>
        </CardContent>
      </Card>

      <Card className="bg-card rounded-xl ring-1 ring-white/6">
        <CardHeader>
          <CardTitle className="text-base">Nutrition goals</CardTitle>
          <CardDescription>Used to score every recommended meal.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="daily-calories">Daily calories</Label>
              <Input
                id="daily-calories"
                inputMode="numeric"
                placeholder="2,200"
                value={settings.dailyCalories}
                onChange={(event) => update('dailyCalories', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="daily-protein">Daily protein (g)</Label>
              <Input
                id="daily-protein"
                inputMode="numeric"
                placeholder="150"
                value={settings.dailyProtein}
                onChange={(event) => update('dailyProtein', event.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="daily-budget">Daily budget</Label>
            <Input
              id="daily-budget"
              inputMode="numeric"
              placeholder="₹600"
              value={settings.dailyBudget}
              onChange={(event) => update('dailyBudget', event.target.value)}
            />
          </div>
          <Button onClick={handleSaveGoals}>Save goals</Button>
        </CardContent>
      </Card>

      <Card className="bg-card rounded-xl ring-1 ring-red-500/25">
        <CardHeader>
          <CardTitle className="text-base">Danger zone</CardTitle>
          <CardDescription>Permanently delete your account and all data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <Button
            variant="destructive"
            onClick={() => {
              localStorage.removeItem(USER_SETTINGS_STORAGE_KEY);
              persist(getDefaultUserSettings());
              toast.success('Local settings cleared.');
            }}
          >
            Delete account
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
