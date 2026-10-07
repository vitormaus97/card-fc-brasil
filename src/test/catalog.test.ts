import { describe, expect, it } from 'vitest';
import { catalogCards, variants, initialCopies, matchesText, variantLabel } from '@/lib/catalog';

describe('Demonstrative catalog model', () => {
  it('links every variant to a catalog card and every physical copy to a variant', () => {
    expect(variants.every(v => catalogCards.some(c => c.id === v.cardId))).toBe(true);
    expect(initialCopies.every(c => variants.some(v => v.id === c.variantId))).toBe(true);
  });
  it('keeps distinct physical copies of the same Gold /50 variant', () => {
    const gold = variants.find(v => v.id === 'vini-gold');
    expect(gold).toBeDefined();
    if (!gold) return;
    expect(variantLabel(gold)).toBe('Gold /50');
    const physical = initialCopies.filter(c => c.variantId === gold.id);
    expect(physical.length).toBeGreaterThan(1);
    expect(new Set(physical.map(c => c.serial)).size).toBe(physical.length);
    expect(new Set(physical.map(c => c.condition)).size).toBeGreaterThan(1);
  });
  it('searches player and represented club without accent or case sensitivity', () => {
    const gold = variants.find(v => v.id === 'vini-gold');
    if (!gold) throw new Error('Missing demo variant');
    expect(matchesText(gold, 'VINICIUS')).toBe(true);
    expect(matchesText(gold, 'real madrid')).toBe(true);
    expect(matchesText(gold, 'Palmeiras')).toBe(false);
  });
});