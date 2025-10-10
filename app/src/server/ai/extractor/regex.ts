// source: https://stackoverflow.com/questions/619977/regular-expression-patterns-for-tracking-numbers


export function findUPSTracks(text: string): string[] {
  return text.match(/\b1Z[0-9A-Z]{16}\b/g) ?? []
}


export function findFedExTracks(t: string) { return t.match(/\b(\d{12}|\d{15}|\d{20})\b/g) ?? []; }



export function findUSPSTracks(t: string) { return t.match(/\b9\d{21}\b|\b9\d{19}\b/g) ?? []; }


export function mentionsCarrier(text: string, carrier: 'UPS'|'FedEx'|'USPS'): boolean {
  const patterns = {
    UPS: /\b(UPS|United Parcel Service)\b/i,
    FedEx: /\b(FEDEX|Federal Express)\b/i,
    USPS: /\b(USPS|Postal Service|United States Postal)\b/i
  }
  return patterns[carrier].test(text)
}


export function regexExtract(text: string) {
  const ups = findUPSTracks(text)
  if (ups.length) return { carrier: 'UPS', tracking_numbers: ups }
  const fedex = findFedExTracks(text);
  if (fedex.length) return { carrier: 'FedEx', tracking_numbers: fedex }
  const usps = findUSPSTracks(text);
  if (usps.length) return { carrier: 'USPS', tracking_numbers: usps }
  return null
}