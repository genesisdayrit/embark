const KNOWN = new Map([ ['amazon', 'Amazon'], ['nike', 'Nike'], ['etsy', 'Etsy'] ]);
export function detectMerchantHeuristic({ subject, fromEmail, body }:{ subject?: string|null; fromEmail?: string|null; body: string; }): string|null {
  const hay = [subject ?? '', fromEmail ?? '', body].join(' ').toLowerCase();
  for (const key of KNOWN.keys()) if (hay.includes(key)) return KNOWN.get(key)!;
  return null;
}