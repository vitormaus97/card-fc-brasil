import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useDemo } from "@/lib/demo-store";
import { catalogCards, variants, getCard, matchesText, type CardVariant } from "@/lib/catalog";
import { CardTile } from "./card-tile";
import { Button } from "./ui/button";
export type Filters = {
  player: string;
  club: string;
  season: string;
  manufacturer: string;
  collection: string;
  parallel: string;
  autograph: string;
  grading: string;
};
const empty: Filters = {
  player: "",
  club: "",
  season: "",
  manufacturer: "",
  collection: "",
  parallel: "",
  autograph: "",
  grading: "",
};
export function CatalogBrowser({
  initialQuery = "",
  initialCollection = "",
  market = false,
}: {
  initialQuery?: string;
  initialCollection?: string;
  market?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<Filters>({ ...empty, collection: initialCollection });
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState("recent");
  const { copies } = useDemo();
  const active = Object.values(filters).filter(Boolean).length;
  const filterVariant = (v: CardVariant) => {
    const c = getCard(v);
    if (!c || !matchesText(v, query)) return false;
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      if (key === "parallel") return v.parallel === value;
      if (key === "autograph") return v.autograph === (value === "Sim");
      if (key === "grading")
        return copies.some(
          (copy) => copy.variantId === v.id && copy.grading === value && (!market || copy.listed),
        );
      return c[key as keyof typeof c] === value;
    });
  };
  const filtered = variants.filter(filterVariant);
  const listings = copies
    .filter((c) => c.listed && filtered.some((v) => v.id === c.variantId))
    .sort((a, b) =>
      sort === "low"
        ? (a.price ?? 0) - (b.price ?? 0)
        : sort === "high"
          ? (b.price ?? 0) - (a.price ?? 0)
          : b.createdAt.localeCompare(a.createdAt),
    );
  const fields: [keyof Filters, string, string[]][] = [
    ["player", "Jogador", catalogCards.map((c) => c.player)],
    ["club", "Clube representado", catalogCards.map((c) => c.club)],
    ["season", "Temporada", catalogCards.map((c) => c.season)],
    ["manufacturer", "Fabricante", catalogCards.map((c) => c.manufacturer)],
    ["collection", "Coleção", catalogCards.map((c) => c.collection)],
    ["parallel", "Paralelo", variants.map((v) => v.parallel)],
    ["autograph", "Autógrafo", ["Sim", "Não"]],
    ["grading", "Graduação", copies.map((c) => c.grading)],
  ];
  return (
    <>
      <div className="mb-7 mt-6 flex gap-3">
        <div className="search-box flex-1">
          <Search size={18} className="shrink-0 text-muted-foreground" />
          <input
            aria-label="Buscar cards"
            placeholder="Jogador, clube ou coleção..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Limpar busca"
              onClick={() => setQuery("")}
            >
              <X />
            </Button>
          )}
        </div>
        <Button
          variant="outline"
          className="h-[52px] md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          <SlidersHorizontal />
          Filtros {active > 0 && `(${active})`}
        </Button>
      </div>
      <div className="grid gap-7 md:grid-cols-[205px_minmax(0,1fr)]">
        <aside className={`filter-panel ${open ? "block" : "hidden"} md:block`}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <SlidersHorizontal size={15} />
              Filtros
            </h2>
            {active > 0 && (
              <Button variant="link" size="sm" onClick={() => setFilters(empty)}>
                Limpar
              </Button>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
            {fields.map(([key, label, values]) => (
              <label key={key} className="field-label">
                {label}
                <select
                  aria-label={label}
                  className="field"
                  value={filters[key]}
                  onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                >
                  <option value="">Todos</option>
                  {[...new Set(values)].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </aside>
        <section className="min-w-0">
          <div className="mb-5 flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">
                {market ? listings.length : filtered.length}
              </strong>{" "}
              {market ? "exemplares anunciados" : "variantes encontradas"}
            </p>
            <select
              aria-label="Ordenar resultados"
              className="field max-w-[165px]"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="recent">Mais recentes</option>
              {market ? (
                <>
                  <option value="low">Menor preço</option>
                  <option value="high">Maior preço</option>
                </>
              ) : (
                <option value="name">Nome do jogador</option>
              )}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-5">
            {market
              ? listings.map((copy) => {
                  const variant = variants.find((v) => v.id === copy.variantId);
                  return variant ? <CardTile key={copy.id} variant={variant} copy={copy} /> : null;
                })
              : [...filtered]
                  .sort((a, b) =>
                    sort === "name"
                      ? (getCard(a)?.player ?? "").localeCompare(getCard(b)?.player ?? "")
                      : 0,
                  )
                  .map((v) => <CardTile key={v.id} variant={v} />)}
          </div>
          {(market ? listings.length : filtered.length) === 0 && (
            <div className="empty-state">
              <Search size={30} className="mx-auto mb-4" />
              <p className="font-semibold text-foreground">Nenhum card encontrado</p>
              <p className="mt-2 text-sm">Tente outro jogador ou ajuste os filtros.</p>
              <Button
                variant="outline"
                className="mt-5"
                onClick={() => {
                  setQuery("");
                  setFilters(empty);
                }}
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
