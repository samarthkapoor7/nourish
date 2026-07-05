import type { UserProfile } from '@/types';

/**
 * Placeholder auth service. Wire these up to Supabase Auth
 * (@/lib/supabase/client, @/lib/supabase/server) when auth is implemented.
 */

export async function getCurrentUser(): Promise<UserProfile | null> {
  throw new Error('Not implemented: getCurrentUser');
}

export async function signInWithEmail(_email: string, _password: string): Promise<void> {
  throw new Error('Not implemented: signInWithEmail');
}

export async function signOut(): Promise<void> {
  throw new Error('Not implemented: signOut');
}
