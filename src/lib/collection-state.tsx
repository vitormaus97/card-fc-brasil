import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { useRouter } from '@tanstack/react-router';
import { readAccount, saveCopy, deleteCopy, setWish, saveProfile } from './account.functions';
import { useAuth, safeReturn } from './auth-state';
import { variants, type CardVariant } from './catalog';

type Account = Awaited<ReturnType<typeof readAccount>>;
export type OwnedCopy = Account['copies'][number];
type CopyInput = { id?: string; variantId: string; condition: string; serial: string; grading: string };
interface CollectionState {
  copies: OwnedCopy[]; wanted: string[]; displayName: string; loading: boolean; error: string; busy: boolean;
  add: (input: CopyInput) => Promise<boolean>; remove: (id: string) => Promise<boolean>; updateName: (name: string) => Promise<boolean>;
  toggleHave: (variant: CardVariant) => void; toggleWant: (id: string) => void; retry: () => void;
}
const Context = createContext<CollectionState | null>(null);
export function CollectionProvider({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const qc = useQueryClient();
  const read = useServerFn(readAccount), save = useServerFn(saveCopy), removeCopy = useServerFn(deleteCopy), wish = useServerFn(setWish), profile = useServerFn(saveProfile);
  const queryKey = ['private-account', user?.id];
  const query = useQuery({ queryKey, queryFn: () => read(), enabled: ready && !!user, retry: false });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const resumed = useRef<string | null>(null);
  const copies = user ? query.data?.copies ?? [] : [];
  const wanted = user ? query.data?.wanted ?? [] : [];
  async function perform(task: () => Promise<unknown>) {
    if (!user || lock.current) return false;
    lock.current = true; setBusy(true); setError('');
    try { await task(); await qc.invalidateQueries({ queryKey }); return true; }
    catch (e) { setError(e instanceof Error ? e.message : 'Não foi possível salvar. Tente novamente.'); return false; }
    finally { lock.current = false; setBusy(false); }
  }
  function request(action: 'have' | 'want', variantId: string) {
    if (!ready || lock.current) return;
    if (!user) {
      const redirect = safeReturn(router.state.location.href);
      sessionStorage.setItem('fc-pending-action', JSON.stringify({ action, variantId }));
      void router.navigate({ to: '/auth', search: { redirect } });
      return;
    }
    if (query.isPending || query.isError) { setError('Aguarde sua coleção carregar ou tente novamente.'); return; }
    if (action === 'have') {
      if (copies.some(c => c.variant_id === variantId)) { void router.navigate({ to: '/colecao', search: { variant: variantId } }); return; }
      void perform(() => save({ data: { variantId, condition: 'Não informada', serial: '', grading: 'Sem graduação' } }));
    } else void perform(() => wish({ data: { variantId, wanted: !wanted.includes(variantId) } }));
  }
  useEffect(() => {
    if (!user || !query.data || resumed.current === user.id || router.state.location.pathname === '/reset-password') return;
    const raw = sessionStorage.getItem('fc-pending-action');
    if (!raw) return;
    resumed.current = user.id;
    try {
      const pending = JSON.parse(raw);
      if (!variants.some(v => v.id === pending.variantId) || !['have', 'want'].includes(pending.action)) { sessionStorage.removeItem('fc-pending-action'); return; }
      const task = pending.action === 'have'
        ? () => save({ data: { variantId: pending.variantId, condition: 'Não informada', serial: '', grading: 'Sem graduação' } })
        : () => wish({ data: { variantId: pending.variantId, wanted: true } });
      void perform(task).then(ok => { if (ok) sessionStorage.removeItem('fc-pending-action'); else resumed.current = null; });
    } catch { sessionStorage.removeItem('fc-pending-action'); }
  }, [user, query.data]);
  return <Context.Provider value={{ copies, wanted, displayName: query.data?.displayName ?? '', loading: !ready || (!!user && query.isPending), error: error || (query.isError ? 'Não foi possível carregar sua coleção. Tente novamente.' : ''), busy,
    add: input => perform(() => save({ data: input })), remove: id => perform(() => removeCopy({ data: { id } })), updateName: displayName => perform(() => profile({ data: { displayName } })),
    toggleHave: v => request('have', v.id), toggleWant: id => request('want', id), retry: () => { setError(''); void query.refetch(); }
  }}><>{children}{error && <div role="alert" className="site-shell border-t border-destructive py-3 text-sm text-destructive">{error}</div>}</></Context.Provider>;
}
export function useCollection() { const value = useContext(Context); if (!value) throw new Error('CollectionProvider required'); return value; }
