import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { pageHead } from '@/lib/metadata';
export const Route = createFileRoute('/reset-password')({ head: () => pageHead('Redefinir senha', 'Defina uma nova senha para sua conta Card FC Brasil com seu link de recuperação.'), component: ResetPassword });
function ResetPassword() {
  const navigate = useNavigate();
  const [valid, setValid] = useState(false), [checked, setChecked] = useState(false), [password, setPassword] = useState(''), [confirm, setConfirm] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState('');
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const recovery = hash.get('type') === 'recovery' || sessionStorage.getItem('fc-recovery') === 'true';
    if (hash.get('type') === 'recovery') sessionStorage.setItem('fc-recovery', 'true');
    void supabase.auth.getUser().then(({ data }) => { setValid(recovery && !!data.user); setChecked(true); });
  }, []);
  async function submit(e: FormEvent) {
    e.preventDefault(); setError('');
    if (password !== confirm) { setError('As senhas não coincidem.'); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { setError('O link pode ter expirado. Solicite outro e tente novamente.'); return; }
    sessionStorage.removeItem('fc-recovery');
    await navigate({ to: '/colecao', replace: true });
  }
  return <div className="site-shell py-12"><div className="mx-auto max-w-md"><span className="eyebrow">Card FC Brasil</span><h1 className="page-title mt-3">Nova senha</h1>{!checked ? <p className="mt-6">Validando link...</p> : !valid ? <><p role="alert" className="mt-6 text-sm text-muted-foreground">Link inválido ou expirado. Solicite um novo link de recuperação.</p><Button className="mt-5" onClick={() => navigate({ to: '/auth', search: { redirect: '/colecao' } })}>Recuperar acesso</Button></> : <form className="mt-8 grid gap-5" onSubmit={submit}><label className="field-label">Nova senha<input className="field" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} /></label><label className="field-label">Confirmar senha<input className="field" type="password" autoComplete="new-password" required minLength={8} value={confirm} onChange={e => setConfirm(e.target.value)} /></label>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button disabled={busy}>{busy ? 'Salvando...' : 'Salvar nova senha'}</Button></form>}</div></div>;
}
