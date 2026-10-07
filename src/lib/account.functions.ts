import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
const fields = z.object({ variantId: z.string().min(1).max(80), condition: z.string().trim().min(1).max(80), serial: z.string().trim().max(40), grading: z.string().trim().min(1).max(80) });
export const readAccount = createServerFn({ method: 'GET' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const [copies, wishes, profile] = await Promise.all([
    context.supabase.from('physical_copies').select('id,variant_id,condition,serial,grading,created_at').eq('owner_id', context.userId).order('created_at', { ascending: false }),
    context.supabase.from('wishlist').select('variant_id').eq('user_id', context.userId),
    context.supabase.from('profiles').select('display_name').eq('id', context.userId).single(),
  ]);
  if (copies.error || wishes.error || profile.error) throw new Error('Não foi possível carregar sua conta. Tente novamente.');
  return { copies: copies.data ?? [], wanted: (wishes.data ?? []).map(w => w.variant_id), displayName: profile.data?.display_name ?? '' };
});
export const saveCopy = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator((input) => fields.extend({ id: z.string().uuid().optional() }).parse(input)).handler(async ({ data, context }) => {
  const row = { variant_id: data.variantId, condition: data.condition, serial: data.serial, grading: data.grading };
  const result = data.id
    ? await context.supabase.from('physical_copies').update(row).eq('id', data.id).eq('owner_id', context.userId).select('id').single()
    : await context.supabase.from('physical_copies').insert({ ...row, owner_id: context.userId }).select('id').single();
  if (result.error) throw new Error('Não foi possível salvar o exemplar.');
  return { id: result.data.id };
});
export const deleteCopy = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input)).handler(async ({ data, context }) => {
  const { data: rows, error } = await context.supabase.from('physical_copies').delete().eq('id', data.id).eq('owner_id', context.userId).select('id');
  if (error || !rows?.length) throw new Error('Não foi possível remover o exemplar.');
  return { ok: true };
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
