import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';

export function safeReturn(value: unknown) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') && !value.includes('\\') && !value.startsWith('/auth') && !value.startsWith('/reset-password') ? value : '/colecao';
}
const AuthContext = createContext<{ user: User | null; ready: boolean; signOut: () => Promise<void> }>({ user: null, ready: false, signOut: async () => {} });
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  useEffect(() => {
    let alive = true;
    async function refresh() {
      const { data } = await supabase.auth.getUser();
      if (alive) {
        setUser(data.user); setReady(true);
        const destination = sessionStorage.getItem('fc-return-after-confirm');
        if (data.user && destination && router.state.location.pathname === '/' && sessionStorage.getItem('fc-recovery') !== 'true') {
          sessionStorage.removeItem('fc-return-after-confirm');
          void router.navigate({ to: safeReturn(destination), replace: true });
        }
      }
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event !== 'SIGNED_IN' && event !== 'SIGNED_OUT' && event !== 'USER_UPDATED' && event !== 'PASSWORD_RECOVERY') return;
      // Auth callback must not await another auth call (the auth lock is still held).
      setTimeout(() => {
        if (!alive) return;
        if (event === 'SIGNED_OUT') { setUser(null); queryClient.clear(); void router.invalidate(); }
        else { void refresh(); void router.invalidate(); void queryClient.invalidateQueries(); }
        if (event === 'PASSWORD_RECOVERY') {
          sessionStorage.setItem('fc-recovery', 'true');
          void router.navigate({ to: '/reset-password' });
        }
      }, 0);
    });
    const hash = new URLSearchParams(window.location.hash.slice(1));
    if (hash.get('type') === 'recovery') sessionStorage.setItem('fc-recovery', 'true');
    void refresh();
    return () => { alive = false; subscription.unsubscribe(); };
  }, [queryClient, router]);
  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error('Não foi possível sair. Tente novamente.');
    setUser(null);
    sessionStorage.removeItem('fc-pending-action');
    sessionStorage.removeItem('fc-recovery');
    sessionStorage.removeItem('fc-return-after-confirm');
    await router.navigate({ to: '/auth', search: { redirect: '/mercado' }, replace: true });
  }
  return <AuthContext.Provider value={{ user, ready, signOut }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
