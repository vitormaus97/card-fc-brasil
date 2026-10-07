import { createFileRoute } from '@tanstack/react-router';
import { OwnListingsPage } from '@/components/account-pages';
import { pageHead } from '@/lib/metadata';
export const Route = createFileRoute('/_authenticated/meus-anuncios')({ head: () => pageHead('Meus anúncios', 'Área dos itens do vendedor, independente da coleção adquirida.'), component: OwnListingsPage });
