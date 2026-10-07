import { Link } from "@tanstack/react-router";
import {
  Layers2,
  Search,
  Library,
  Store,
  UserRound,
  Plus,
  ArrowUpRight,
  CircleDot,
} from "lucide-react";
import { Button } from "./ui/button";
export function PlatformShell({ children }: { children: React.ReactNode }) {
  const links = [
    { to: "/explorar", label: "Explorar", icon: Search },
    { to: "/colecao", label: "Coleção", icon: Library },
    { to: "/mercado", label: "Mercado", icon: Store },
    { to: "/perfil", label: "Conta", icon: UserRound },
  ] as const;
  return (
    <>
      <header className="top-nav">
        <div className="site-shell grid h-full grid-cols-[minmax(0,1fr)_auto] items-center gap-6 md:flex">
          <Link to="/" className="flex min-w-0 items-center gap-2.5 md:mr-9">
            <span className="brand-mark">
              <Layers2 size={29} strokeWidth={2} />
            </span>
            <span className="truncate text-[17px] font-extrabold">
              football<span className="text-primary">cards</span>
              <span className="ml-2 hidden text-[9px] font-medium text-muted-foreground lg:inline">
                BR
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            <Link to="/" className="nav-link" activeOptions={{ exact: true }}>
              Início
            </Link>
            {links.slice(0, 3).map((item) => (
              <Link key={item.to} to={item.to} className="nav-link">
                {item.label === "Coleção" ? "Minha coleção" : item.label}
              </Link>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-5 md:ml-auto">
            <Button asChild className="hidden md:inline-flex">
              <Link to="/anunciar">
                <Plus />
                Anunciar card
              </Link>
            </Button>
            <Link
              to="/perfil"
              aria-label="Minha conta"
              className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-secondary text-[11px] font-bold"
            >
              LF
            </Link>
          </div>
        </div>
      </header>
      <div className="demo-strip">
        <CircleDot size={10} className="mr-1.5 inline text-primary" />
        Protótipo demonstrativo · Dados, preços e imagens ilustrativos · Sem transações reais
      </div>
      <main>{children}</main>
      <footer className="footer">
        <div className="site-shell flex flex-wrap items-center justify-between gap-4">
          <span className="flex items-center gap-2">
            <Layers2 size={16} /> Football Cards <span className="text-border">/</span> Feito para
            quem coleciona.
          </span>
          <span>
            Protótipo local · Brasil <ArrowUpRight size={12} className="ml-1 inline" />
          </span>
        </div>
      </footer>
      <nav className="bottom-nav" aria-label="Navegação principal">
        {links.map((item) => (
          <Link key={item.to} to={item.to} className="nav-link">
            <item.icon />
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
