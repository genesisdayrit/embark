import type { NormalizedMessage } from '../Types'

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
 return {
   emailId: msg.id,
   userId,
   rawText: msg.body || msg.snippet || '',
   subject: msg.subject || null,
   fromEmail: msg.from || null,
   receivedAt: msg.date ? new Date(msg.date).toISOString() : null,
 }
}

