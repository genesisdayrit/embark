import type { NormalizedMessage } from '../Types.ts'

export const getHeader = (msg: any, name: string): string | null =>
  msg.payload?.headers?.find((h: { name: string; value: string }) =>
    h.name?.toLowerCase() === name.toLowerCase()
  )?.value ?? null

export function findPlain(msg: any): string | null {

  const walk = (p:any): string | null =>
    p?.mimeType === 'text/plain' && p.body?.data ? p.body.data :
    Array.isArray(p?.parts) ? (p.parts.map(walk).find(Boolean) ?? null) : null

  return walk(msg.payload) ?? null
}

export function findHtml(msg: any): string | null {
  const walk = (p: any): string | null =>
    p?.mimeType === 'text/html' && p.body?.data ? p.body.data :
    Array.isArray(p?.parts) ? (p.parts.map(walk).find(Boolean) ?? null) : null
  return walk(msg.payload) ?? null;
}

export const b64url = (s:string) => Buffer.from(s.replace(/-/g,'+').replace(/_/g,'/'), 'base64').toString('utf8')

export const stripHtml = (html:string) => html.replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()

export function gmailNormalize(msg: any, userId: string): NormalizedMessage {
  const plain = findPlain(msg);
  const html  = !plain ? findHtml(msg) : null;          
  const raw   = plain ? b64url(plain) : html ? stripHtml(b64url(html)) : '';
  const rawText = raw.trim();

  return {
    emailId: msg.id,
    userId,
    rawText,
    subject: getHeader(msg, 'Subject'),
    fromEmail: getHeader(msg, 'From'),
    receivedAt: msg.internalDate ? new Date(+msg.internalDate).toISOString() : null,
      }
}