export const unwrapRedirects = (s: string) =>
  s.replace(/https?:\/\/[^ )\]>"]*?[?&]U=([^&>\s)"]+)/gi, (_m,u) => decodeURIComponent(u));

export const stripImageArtifacts = (s: string) =>
  s.replace(/\[image:[^\]]+\]/gi, '');

export const collapseWhitespace = (s: string) =>
  s.replace(/\s+/g, ' ').trim();

export function extractUrls(s: string): string[] {
  return Array.from(s.matchAll(/\bhttps?:\/\/[^\s)>"']+/gi), m => m[0]);
}

const BLOCK = ['google.com','g.doubleclick.net','facebook.com','twitter.com','linkedin.com'];
const isBlocked = (u: string) => {
  try { const h = new URL(u).hostname.replace(/^www\./,''); return BLOCK.some(d => h.endsWith(d)); }
  catch { return true; }
};

export function preClean(emailText: string) {
  const unwrapped = unwrapRedirects(emailText);
  const noImgs    = stripImageArtifacts(unwrapped);
  const cleaned   = collapseWhitespace(noImgs);

  const urls      = extractUrls(cleaned);
  const candidate = urls.filter(u => !isBlocked(u));

  return { cleaned, candidateLinks: Array.from(new Set(candidate)).slice(0, 6) };
}