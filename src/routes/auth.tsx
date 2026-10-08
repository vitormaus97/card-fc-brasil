import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { LogIn, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth, safeReturn } from '@/lib/auth-state';
import { pageHead } from '@/lib/metadata';
export const Route = createFileRoute('/auth')({ validateSearch: (s: Record<string, unknown>) => ({ redirect: safeReturn(s['redirect']) }), head: () => pageHead('Entrar na sua conta', 'Acesse sua coleção privada de cards de futebol ou crie uma conta no Card FC Brasil.'), component: AuthPage });
function AuthPage() {
  const { user, ready } = useAuth();
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState(''), [password, setPassword] = useState(''), [name, setName] = useState('');
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [message, setMessage] = useState('');
  useEffect(() => { if (ready && user) void navigate({ to: safeReturn(redirect), replace: true }); }, [ready, user, redirect, navigate]);
  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        setMessage('Se houver uma conta com este e-mail, você receberá um link para redefinir a senha.');
      } else if (mode === 'signup') {
        sessionStorage.setItem('fc-return-after-confirm', safeReturn(redirect));
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { display_name: name.trim() }, emailRedirectTo: window.location.origin } });
        if (error) throw error;
        if (!data.session) { setMessage('Confira seu e-mail para confirmar o cadastro. Depois, entre com sua senha.'); setPassword(''); }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        sessionStorage.removeItem('fc-return-after-confirm');
        // The verified root auth state drives the single post-login navigation.
      }
    } catch { setError(mode === 'login' ? 'Não foi possível entrar. Confira e-mail, senha e a confirmação do cadastro.' : 'Não foi possível enviar. Confira os dados e tente novamente em alguns instantes.'); }
    finally { setBusy(false); }
  }
  function change(next: typeof mode) { setMode(next); setError(''); setMessage(''); setPassword(''); }
  return <div className="site-shell py-12"><div className="mx-auto max-w-md"><span className="eyebrow">Card FC Brasil</span><h1 className="page-title mt-3">{mode === 'signup' ? 'Criar conta' : mode === 'forgot' ? 'Recuperar acesso' : 'Entrar'}</h1>
    <form className="mt-8 grid gap-5" onSubmit={submit}>
      {mode === 'signup' && <label className="field-label">Nome de exibição<input className="field" required minLength={1} maxLength={80} autoComplete="nickname" value={name} onChange={e => setName(e.target.value)} /></label>}
      <label className="field-label">E-mail<input className="field" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
      {mode !== 'forgot' && <label className="field-label">Senha<input className="field" type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} required minLength={8} maxLength={128} value={password} onChange={e => setPassword(e.target.value)} /></label>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}{message && <p role="status" className="text-sm text-primary">{message}</p>}
      <Button type="submit" disabled={busy || !ready}>{mode === 'forgot' ? <Mail /> : <LogIn />}{busy ? 'Aguarde...' : mode === 'signup' ? 'Cadastrar' : mode === 'forgot' ? 'Enviar link de recuperação' : 'Entrar'}</Button>
    </form>
    <div className="mt-5 flex flex-wrap gap-2"><Button variant="link" onClick={() => change(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? 'Criar conta' : 'Já tenho conta'}</Button>{mode === 'login' && <Button variant="link" onClick={() => change('forgot')}>Esqueci minha senha</Button>}</div>
  </div></div>;
}
