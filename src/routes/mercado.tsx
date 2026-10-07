import { createFileRoute, Link } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { CatalogBrowser } from '@/components/catalog-browser';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/lib/metadata';
export const Route=createFileRoute('/mercado')({head:()=>pageHead('Mercado de cards','Exemplares físicos demonstrativos de colecionadores brasileiros. Preços ilustrativos, sem compras reais.'),component:Market});
function Market(){return <div className="site-shell enter-animation py-9"><div className="section-heading"><div><span className="eyebrow">De colecionador para colecionador</span><h1 className="page-title mt-2">Mercado</h1><p className="mt-3 text-sm text-muted-foreground">Um novo capítulo para cada card.</p></div><Button asChild><Link to="/anunciar"><Plus/>Anunciar</Link></Button></div><CatalogBrowser market/></div>;}