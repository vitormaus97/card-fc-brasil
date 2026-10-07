import { Link } from '@tanstack/react-router';
import { Library, ShoppingBag, Store, Heart, LogOut, Save } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { Button } from './ui/button';
import { CardTile } from './card-tile';
import { useCollection } from '@/lib/collection-state';
import { useAuth } from '@/lib/auth-state';
import { variants, getCard, variantLabel } from '@/lib/catalog';
const destinations = [
  { to: '/colecao', label: 'Minha coleção', icon: Library },
  { to: '/compras', label: 'Minhas compras', icon: ShoppingBag },
  { to: '/meus-anuncios', label: 'Meus anúncios', icon: Store },
  { to: '/favoritos', label: 'Quero', icon: Heart },
] as const;
export function AccountNav() { return <nav aria-label="Áreas da conta" className="my-7 flex flex-wrap gap-x-5 gap-y-2 border-y border-border py-4">{destinations.map(item => <Button key={item.to} variant="ghost" asChild><Link to={item.to} className="nav-link"><item.icon />{item.label}</Link></Button>)}</nav>; }
export function AccountStatus() {
  const { loading, error, retry } = useCollection();
  if (loading) return <p role="status" className="py-8 text-muted-foreground">Carregando sua conta...</p>;
  if (error) return <div role="alert" className="py-8"><p className="text-destructive">{error}</p><Button variant="outline" onClick={retry} className="mt-4">Tentar novamente</Button></div>;
  return null;
}
export function AcquiredPage() {
  const { acquired, loading, error } = useCollection();
  return <div className="site-shell enter-animation py-9"><span className="eyebrow">Cards adquiridos</span><h1 className="page-title mt-2">Minha coleção</h1><AccountNav /><AccountStatus />{!loading && !error && (acquired.length ? <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{acquired.map(item => { const copy = item.physical_copies; const v = variants.find(v => v.id === copy?.variant_id); const card = v ? getCard(v) : undefined; return card && v ? <article key={item.id} className="card-tile"><div className="card-stage"><img src={card.image} alt={`${card.player} — imagem ilustrativa`} /></div><div className="p-4"><h2 className="font-bold">{card.player}</h2><p className="text-sm text-muted-foreground">{variantLabel(v)} · {copy?.serial || 'Não numerado'}</p><p className="mt-2 text-xs text-muted-foreground">{copy?.condition} · {copy?.grading}</p></div></article> : null; })}</div> : <div className="empty-state"><Library size={36} className="mx-auto mb-4" /><h2 className="text-lg font-bold">Nenhum card adquirido</h2><p className="mt-3 text-sm">Nenhum recebimento confirmado.</p><Button asChild className="mt-6"><Link to="/mercado">Explorar mercado</Link></Button></div>)}</div>;
}
export function PurchasesPage() {
  const { orders, loading, error } = useCollection();
  const labels: Record<string,string> = { pending: 'Pendente', paid: 'Pago', shipped: 'Enviado', received: 'Recebido', cancelled: 'Cancelado' };
  return <div className="site-shell enter-animation py-9"><span className="eyebrow">Seus pedidos</span><h1 className="page-title mt-2">Minhas compras</h1><AccountNav /><AccountStatus />{!loading && !error && (orders.length ? <ul className="divide-y divide-border">{orders.map(o => <li className="flex flex-wrap justify-between gap-3 py-5" key={o.id}><span className="text-sm">Pedido {o.id.slice(0,8)}</span><span className="tag">{labels[o.status] ?? o.status}</span></li>)}</ul> : <div className="empty-state"><ShoppingBag size={36} className="mx-auto mb-4" /><h2 className="text-lg font-bold">Nenhuma compra realizada</h2><Button asChild className="mt-6"><Link to="/mercado">Explorar mercado</Link></Button></div>)}</div>;
}
export function FavoritesPage() {
  const { wanted, loading, error } = useCollection();
  return <div className="site-shell enter-animation py-9"><span className="eyebrow">Favoritos e interesses</span><h1 className="page-title mt-2">Quero</h1><AccountNav /><AccountStatus />{!loading && !error && (wanted.length ? <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">{variants.filter(v => wanted.includes(v.id)).map(v => <CardTile key={v.id} variant={v} />)}</div> : <div className="empty-state"><Heart size={36} className="mx-auto mb-4" /><h2 className="text-lg font-bold">Nenhum favorito ainda</h2><Button asChild variant="outline" className="mt-6"><Link to="/explorar">Explorar cards</Link></Button></div>)}</div>;
}
export function OwnListingsPage() {
  return <div className="site-shell enter-animation py-9"><span className="eyebrow">Área do vendedor</span><h1 className="page-title mt-2">Meus anúncios</h1><AccountNav /><div className="empty-state"><Store size={36} className="mx-auto mb-4" /><h2 className="text-lg font-bold">Nenhum anúncio real</h2><Button asChild variant="outline" className="mt-6"><Link to="/anunciar">Criar anúncio demonstrativo</Link></Button></div></div>;
}
export function PrivateAccount() {
  const { user, ready, signOut } = useAuth();
  const { displayName, updateName, busy, loading, error } = useCollection();
  const [name, setName] = useState(''), [message, setMessage] = useState('');
  useEffect(() => { setName(displayName); }, [displayName]);
  if (!ready) return <div className="site-shell py-12">Carregando...</div>;
  if (!user) return <div className="site-shell py-12"><span className="eyebrow">Card FC Brasil</span><h1 className="page-title mt-3">Minha conta</h1><Button asChild className="mt-8"><Link to="/auth" search={{ redirect: '/perfil' }}>Entrar ou criar conta</Link></Button></div>;
  async function submit(e: FormEvent) { e.preventDefault(); setMessage(await updateName(name) ? 'Nome salvo.' : 'Não foi possível salvar o nome.'); }
  return <div className="site-shell py-9"><span className="eyebrow">Conta privada</span><h1 className="page-title mt-2">Minha conta</h1><AccountNav /><AccountStatus />{!loading && !error && <form className="grid max-w-md gap-4" onSubmit={submit}><label className="field-label">Nome de exibição<input className="field" required maxLength={80} value={name} onChange={e => setName(e.target.value)} /></label><Button disabled={busy}><Save />Salvar nome</Button></form>}{message && <p role="status" className="mt-4 text-sm">{message}</p>}<Button className="mt-8" variant="outline" onClick={() => { void signOut().catch(() => setMessage('Não foi possível sair. Tente novamente.')); }}><LogOut />Sair</Button></div>;
}
