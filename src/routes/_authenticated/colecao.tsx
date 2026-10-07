import { createFileRoute } from '@tanstack/react-router';
import { AcquiredPage } from '@/components/account-pages';
import { pageHead } from '@/lib/metadata';
export const Route = createFileRoute('/_authenticated/colecao')({ head: () => pageHead('Minha coleção adquirida', 'Cards adquiridos na plataforma após confirmação de recebimento. Sua coleção é privada.'), component: AcquiredPage });
