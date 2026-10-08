import { describe, expect, it } from 'vitest';
import { safeReturn } from '@/lib/auth-state';
import { readFileSync } from 'node:fs';

describe('Marketplace account scope', () => {
  it('preserves safe return paths without accepting external destinations', () => {
    expect(safeReturn('/card/vini-gold')).toBe('/card/vini-gold');
    for (const path of ['https://other.example', '//other.example', '/\\other.example', '/auth', '/reset-password']) expect(safeReturn(path)).toBe('/colecao');
  });
  it('has no manual collection mutation or demo imports in private operations', () => {
    const source = readFileSync('src/lib/account.functions.ts', 'utf8');
    expect(source).not.toContain('initialCopies');
    expect(source).not.toContain('saveCopy');
    expect(source).not.toContain('deleteCopy');
    expect(source).toContain("from('purchased_collection')");
    expect(source).toContain('requireSupabaseAuth');
  });
});