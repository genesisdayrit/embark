// source: https://stackoverflow.com/questions/619977/regular-expression-patterns-for-tracking-numbers
export function mentionsCarrier(text: string, carrier: 'UPS'|'FedEx'|'USPS'): boolean {
  const patterns = {
    UPS: /\b(UPS|United Parcel Service)\b/i,
    FedEx: /\b(FEDEX|Federal Express)\b/i,
    USPS: /\b(USPS|Postal Service|United States Postal)\b/i
  }
  return patterns[carrier].test(text)
}

export function findUPSTracks(text: string): string[] {
  return text.match(/\b1Z[0-9A-Z]{16}\b/g) ?? []
}


export function findUSPSTracks(t: string) {
  // Broaden USPS range and keep 9-start
  return t.match(/\b(92|93|94|95)\d{18,24}\b/g) ?? [];
}

export function findFedExTracks(t: string) {
  // Drop 20-digit FedEx, keep 12–15
  return t.match(/\b(\d{12}|\d{15})\b/g) ?? [];
}

// Optional: handle UniUni-like alphanumeric codes
export function findAlphanumericTracks(t: string) {
  return t.match(/\b[A-Z0-9]{15,25}\b/g) ?? [];
}

export function regexExtract(text: string) {
  const ups = findUPSTracks(text);
  if (ups.length) return { carrier: 'UPS', tracking_numbers: ups };

  const usps = findUSPSTracks(text); // USPS first now
  if (usps.length) return { carrier: 'USPS', tracking_numbers: usps };

  const fedex = findFedExTracks(text);
  if (fedex.length) return { carrier: 'FedEx', tracking_numbers: fedex };

  const alnum = findAlphanumericTracks(text);
  if (alnum.length) return { carrier: 'Other', tracking_numbers: alnum };

  return null;
}