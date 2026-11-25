import { Lead } from '../domain/models';

export function whatsappUrl(raw: string): string | undefined {
  const international = raw.trim().startsWith('+') || raw.trim().startsWith('00');
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (!international && (digits.length === 10 || digits.length === 11)) digits = `55${digits}`;
  if (!/^[1-9]\d{7,14}$/.test(digits)) return;
  return `https://wa.me/${digits}`;
}

export function mapsUrl(lead: Lead) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${lead.point.latitude},${lead.point.longitude}`)}&travelmode=driving`;
}
