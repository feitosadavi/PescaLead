import { Lead, Settings } from '../domain/models';
import { money } from '../domain/prospecting';

export const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export function proposalHtml(lead: Lead, settings: Settings, date = new Date()): string {
  const p = lead.proposal;
  if (!p) throw new Error('Revise e salve a proposta antes de gerar o PDF.');
  const text = (s: string) => escapeHtml(s).replace(/\n/g, '<br>');
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${escapeHtml(p.title)}</title><style>
  @page { size:A4; margin:22mm 19mm; } body { font-family:Arial,sans-serif; color:#173e42; font-size:11pt; line-height:1.6; } .brand{font-size:16pt;font-weight:bold;color:#11766c;letter-spacing:1px} .eyebrow{font-size:9pt;color:#647b80;text-transform:uppercase;letter-spacing:1px;margin-top:36px} h1{font-size:25pt;line-height:1.2} h2{font-size:14pt;margin-top:28px;page-break-after:avoid} .muted{color:#647b80;font-size:10pt} .prices{border:1px solid #b9d7d0;padding:18px;page-break-inside:avoid;border-radius:8px;background:#f1f8f5} .price{font-size:22pt;font-weight:bold} .footer{border-top:1px solid #dce5df;margin-top:36px;padding-top:14px;font-size:9pt;color:#647b80} p{orphans:3;widows:3} </style></head><body>
  <div class="brand">PescaLead · Proposta comercial</div><div class="eyebrow">Preparada especialmente para</div><h1>${escapeHtml(lead.name)}</h1><p class="muted">${escapeHtml(lead.category)} · ${escapeHtml(lead.address || 'Endereço não informado')}<br>Emitida em ${date.toLocaleDateString('pt-BR')} · Validade de ${p.validityDays} dias</p>
  <h2>${escapeHtml(p.title)}</h2><p>${text(p.scope)}</p><h2>Investimento</h2><div class="prices">Implantação<br><span class="price">${money(p.setup)}</span><br>Mensalidade: <strong>${money(p.monthly)}</strong></div><h2>Condições comerciais</h2><p>${text(p.terms)}</p>
  <div class="footer">${escapeHtml(settings.providerName || 'Prestador a identificar')}<br>${escapeHtml(settings.providerContact)}<br>Proposta sujeita à confirmação de escopo. Não constitui garantia de faturamento ou retorno financeiro.</div></body></html>`;
}
