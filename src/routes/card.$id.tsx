import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Plus, Heart, BadgeCheck, Image, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardTile } from "@/components/card-tile";
import { variants, getCard, variantLabel, type PhysicalCopy } from "@/lib/catalog";
import { useCollection } from "@/lib/collection-state";
import { useDemo } from "@/lib/demo-store";
import { pageHead } from "@/lib/metadata";
export const Route = createFileRoute("/card/$id")({
  loader: ({ params }) => {
    const v = variants.find((v) => v.id === params.id);
    if (!v) throw notFound();
    return v;
  },
  head: ({ loaderData }) =>
    pageHead(
      loaderData
        ? `${getCard(loaderData)?.player} · ${variantLabel(loaderData)}`
        : "Card não encontrado",
      loaderData
        ? `Informações e exemplares demonstrativos de ${getCard(loaderData)?.player}, ${variantLabel(loaderData)}.`
        : "Este card não está disponível no catálogo demonstrativo.",
    ),
  component: CardDetail,
  notFoundComponent: () => (
    <div className="site-shell empty-state">
      <h1 className="page-title">Card não encontrado</h1>
      <Button asChild className="mt-5">
        <Link to="/explorar">Explorar catálogo</Link>
      </Button>
    </div>
  ),
});
function CardDetail() {
  const v = Route.useLoaderData();
  const card = getCard(v);
  const { copies } = useDemo();
  const { copies: owned, wanted, toggleHave, toggleWant, busy, loading } = useCollection();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<PhysicalCopy | null>(null);
  const [side, setSide] = useState("front");
  if (!card) return null;
  const have = owned.some((c) => c.variant_id === v.id);
  const want = wanted.includes(v.id);
  const listings = copies.filter((c) => c.variantId === v.id && c.listed);
  const sameCard = variants.filter((item) => item.cardId === card.id);
  return (
    <div className="site-shell enter-animation py-7">
      <Link to="/explorar" className="inline-flex items-center gap-2 text-xs text-muted-foreground">
        <ArrowLeft size={14} />
        Voltar ao catálogo
      </Link>
      <div className="mt-6 grid gap-8 md:grid-cols-2 lg:gap-14">
        <div>
          <div className="detail-stage">
            {side === "back" && selected?.back ? (
              <img src={selected.back} alt="Verso do exemplar" />
            ) : side === "back" ? (
              <div className="text-center text-muted-foreground">
                <Image className="mx-auto mb-3" size={40} />
                <p className="text-sm">Verso não informado</p>
              </div>
            ) : (
              <img
                src={selected?.front || card.image}
                alt={`${card.player} — imagem ilustrativa`}
                width={300}
                height={420}
              />
            )}
            <span className="tag absolute bottom-4 left-4">
              Imagem{" "}
              {selected?.ownerId === "me" && selected.front.startsWith("data:")
                ? "enviada"
                : "ilustrativa"}
            </span>
          </div>
          <div className="mt-3 flex justify-center gap-2">
            <Button
              variant={side === "front" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSide("front")}
            >
              Frente
            </Button>
            <Button
              variant={side === "back" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSide("back")}
            >
              Verso
            </Button>
          </div>
        </div>
        <div className="pt-3">
          <span className="eyebrow">
            {card.manufacturer} · {card.season}
          </span>
          <h1 className="page-title mt-3">{card.player}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {card.club} · {card.collection}
          </p>
          <div className="mt-5 flex gap-2">
            <span className={v.printRun ? "tag tag-gold" : "tag"}>{variantLabel(v)}</span>
            {v.autograph && <span className="tag tag-green">Autógrafo</span>}
            <span className="tag">{card.number}</span>
          </div>
          <dl className="mt-7 grid grid-cols-2 gap-x-7 gap-y-5 border-y border-border py-6">
            {[
              ["Coleção", card.collection],
              ["Temporada", card.season],
              ["Fabricante", card.manufacturer],
              ["Clube representado", card.club],
              ["Paralelo", v.parallel],
              ["Tiragem", v.printRun ? `${v.printRun} exemplares` : "Não numerada"],
              ["Autógrafo", v.autograph ? "Sim" : "Não"],
              ["Número no checklist", card.number],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[11px] text-muted-foreground">{label}</dt>
                <dd className="mt-1 text-sm font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              size="lg"
              disabled={busy || loading}
              onClick={() => toggleHave(v)}
              variant={have ? "secondary" : "default"}
              aria-pressed={have}
            >
              {have ? <Check /> : <Plus />}
              {have ? "Tenho na coleção" : "Tenho"}
            </Button>
            <Button
              size="lg"
              variant={want ? "secondary" : "outline"}
              disabled={busy || loading}
              onClick={() => toggleWant(v.id)}
              aria-pressed={want}
            >
              <Heart className={want ? "fill-current text-primary" : ""} />
              {want ? "Na lista de desejos" : "Quero"}
            </Button>
          </div>
          <label className="field-label mt-6">
            Variante do card
            <select
              className="field"
              value={v.id}
              onChange={(e) => {
                setSelected(null);
                setSide("front");
                navigate({ to: "/card/$id", params: { id: e.target.value } });
              }}
            >
              {sameCard.map((item) => (
                <option key={item.id} value={item.id}>
                  {variantLabel(item)}
                </option>
              ))}
            </select>
          </label>
          <Button asChild variant="link" className="mt-3 px-0">
            <Link to="/anunciar" search={{ variant: v.id }}>
              Anunciar um exemplar desta variante
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
      <section className="mt-10">
        <div className="section-heading">
          <div>
            <h2>
              Exemplares anunciados{" "}
              <span className="text-muted-foreground">({listings.length})</span>
            </h2>
            <p className="section-kicker">
              Mesma variante. Cada exemplar com sua própria história.
            </p>
          </div>
        </div>
        {listings.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {listings.map((copy) => (
              <div key={copy.id}>
                <CardTile variant={v} copy={copy} />
                <div className="mt-2 px-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1">
                    <BadgeCheck size={12} />
                    {copy.condition} · {copy.grading}
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    className="px-0"
                    onClick={() => {
                      setSelected(copy);
                      setSide("front");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Ver fotos deste exemplar
                    <ArrowRight />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state border-y border-border">
            <p>Nenhum exemplar anunciado desta variante.</p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/anunciar" search={{ variant: v.id }}>
                Anunciar exemplar
              </Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
