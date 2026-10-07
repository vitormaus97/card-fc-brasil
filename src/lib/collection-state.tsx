import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { useRouter } from '@tanstack/react-router';
import { readAccount, setWish, saveProfile } from './account.functions';
import { useAuth, safeReturn } from './auth-state';
import { variants } from './catalog';
type Account = Awaited<ReturnType<typeof readAccount>>;
interface CollectionState {
  acquired: Account['acquired']; orders: Account['orders']; wanted: string[]; displayName: string;
  loading: boolean; error: string; busy: boolean;
  updateName: (name: string) => Promise<boolean>; toggleWant: (id: string) => void; retry: () => void;
}
const Context = createContext<CollectionState | null>(null);
export function CollectionProvider({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const qc = useQueryClient();
  const read = useServerFn(readAccount), wish = useServerFn(setWish), profile = useServerFn(saveProfile);
  const queryKey = ['private-account', user?.id];
  const query = useQuery({ queryKey, queryFn: () => read(), enabled: ready && !!user, retry: false });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const resumed = useRef<string | null>(null);
  const wanted = user ? query.data?.wanted ?? [] : [];
  async function perform(task: () => Promise<unknown>) {
    if (!user || lock.current) return false;
    lock.current = true; setBusy(true); setError('');
    try { await task(); await qc.invalidateQueries({ queryKey }); return true; }
    catch (e) { setError(e instanceof Error ? e.message : 'Não foi possível salvar. Tente novamente.'); return false; }
    finally { lock.current = false; setBusy(false); }
  }
  function toggleWant(variantId: string) {
    if (!ready || lock.current) return;
    if (!user) {
      sessionStorage.setItem('fc-pending-action', JSON.stringify({ action: 'want', variantId }));
      void router.navigate({ to: '/auth', search: { redirect: safeReturn(router.state.location.href) } });
      return;
    }
    if (query.isPending || query.isError) { setError('Aguarde seus favoritos carregarem ou tente novamente.'); return; }
    void perform(() => wish({ data: { variantId, wanted: !wanted.includes(variantId) } }));
  }
  useEffect(() => {
    if (!user || !query.data || resumed.current === user.id || router.state.location.pathname === '/reset-password') return;
    const raw = sessionStorage.getItem('fc-pending-action');
    if (!raw) return;
    resumed.current = user.id;
    try {
      const pending = JSON.parse(raw);
      if (!variants.some(v => v.id === pending.variantId) || pending.action !== 'want') { sessionStorage.removeItem('fc-pending-action'); return; }
      void perform(() => wish({ data: { variantId: pending.variantId, wanted: true } })).then(ok => { if (ok) sessionStorage.removeItem('fc-pending-action'); else resumed.current = null; });
    } catch { sessionStorage.removeItem('fc-pending-action'); }
  }, [user, query.data]);
  return <Context.Provider value={{ acquired: user ? query.data?.acquired ?? [] : [], orders: user ? query.data?.orders ?? [] : [], wanted, displayName: user ? query.data?.displayName ?? '' : '', loading: !ready || (!!user && query.isPending), error: error || (query.isError ? 'Não foi possível carregar sua conta. Tente novamente.' : ''), busy,
    updateName: displayName => perform(() => profile({ data: { displayName } })), toggleWant, retry: () => { setError(''); void query.refetch(); }
  }}><>{children}{error && <div role="alert" className="site-shell border-t border-destructive py-3 text-sm text-destructive">{error}</div>}</></Context.Provider>;
}
export function useCollection() { const value = useContext(Context); if (!value) throw new Error('CollectionProvider required'); return value; }
