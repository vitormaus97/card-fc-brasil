import { createFileRoute } from '@tanstack/react-router';
import { PurchasesPage } from '@/components/account-pages';
import { pageHead } from '@/lib/metadata';
export const Route = createFileRoute('/_authenticated/compras')({ head: () => pageHead('Minhas compras', 'Acompanhe seus pedidos de cards físicos no Card FC Brasil.'), component: PurchasesPage });
