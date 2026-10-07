import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
export const readAccount = createServerFn({ method: 'GET' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const [acquired, wishes, profile, orders] = await Promise.all([
    context.supabase.from('purchased_collection').select('id,copy_id,order_id,acquired_at,physical_copies(variant_id,condition,serial,grading)').eq('owner_id', context.userId),
    context.supabase.from('wishlist').select('variant_id').eq('user_id', context.userId),
    context.supabase.from('profiles').select('display_name').eq('id', context.userId).single(),
    context.supabase.from('purchase_orders').select('id,status,created_at').eq('buyer_id', context.userId),
  ]);
  if (acquired.error || wishes.error || profile.error || orders.error) throw new Error('Não foi possível carregar sua conta. Tente novamente.');
  return { acquired: acquired.data ?? [], orders: orders.data ?? [], wanted: (wishes.data ?? []).map(w => w.variant_id), displayName: profile.data?.display_name ?? '' };
});
export const setWish = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator((input) => z.object({ variantId: z.string().min(1).max(80), wanted: z.boolean() }).parse(input)).handler(async ({ data, context }) => {
  const result = data.wanted
    ? await context.supabase.from('wishlist').upsert({ user_id: context.userId, variant_id: data.variantId })
    : await context.supabase.from('wishlist').delete().eq('user_id', context.userId).eq('variant_id', data.variantId);
  if (result.error) throw new Error('Não foi possível atualizar os desejos.');
  return { ok: true };
});
export const saveProfile = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator((input) => z.object({ displayName: z.string().trim().min(1).max(80) }).parse(input)).handler(async ({ data, context }) => {
  const { error } = await context.supabase.from('profiles').update({ display_name: data.displayName }).eq('id', context.userId);
  if (error) throw new Error('Não foi possível salvar o nome.');
  return { ok: true };
});
