'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getUserGoals,
  loadUserSettings,
  saveUserSettings,
  USER_SETTINGS_UPDATED_EVENT,
  type UserGoals,
  type UserSettings,
} from '@/lib/user-settings';

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(() => loadUserSettings());

  useEffect(() => {
    const syncSettings = () => setSettings(loadUserSettings());

    syncSettings();
    window.addEventListener(USER_SETTINGS_UPDATED_EVENT, syncSettings);
    window.addEventListener('storage', syncSettings);

    return () => {
      window.removeEventListener(USER_SETTINGS_UPDATED_EVENT, syncSettings);
      window.removeEventListener('storage', syncSettings);
    };
  }, []);

  const goals = useMemo<UserGoals>(() => getUserGoals(settings), [settings]);

  const persist = useCallback((next: UserSettings) => {
    saveUserSettings(next);
    setSettings(next);
  }, []);

  return { settings, goals, persist };
}
