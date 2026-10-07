import { createFileRoute } from '@tanstack/react-router';
import { FavoritesPage } from '@/components/account-pages';
import { pageHead } from '@/lib/metadata';
export const Route = createFileRoute('/_authenticated/favoritos')({ head: () => pageHead('Quero — favoritos', 'Seus favoritos e interesses privados, separados dos cards adquiridos.'), component: FavoritesPage });
