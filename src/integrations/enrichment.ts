import { Lead, PhotoSchema, timestamp } from '../domain/models';
import { publicHttps, request, ServiceError } from './http';
import { z } from 'zod';

export function plainText(html: string) {
  return html.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

// Apply the most specific matching robot group and longest path rule.
export function robotsAllowed(robots: string, path: string): boolean {
  const groups: { agents: string[]; rules: { allow: boolean; path: string }[] }[] = [];
  let current = { agents: [] as string[], rules: [] as { allow: boolean; path: string }[] };
  for (const raw of robots.split(/\r?\n/)) {
    const line = raw.split('#')[0]?.trim() ?? '';
    const colon = line.indexOf(':');
    if (colon < 0) continue;
    const key = line.slice(0, colon).toLowerCase(), value = line.slice(colon + 1).trim();
    if (key === 'user-agent') {
      if (current.rules.length) { groups.push(current); current = { agents: [], rules: [] }; }
      current.agents.push(value.toLowerCase());
    } else if ((key === 'allow' || key === 'disallow') && value && current.agents.length) current.rules.push({ allow: key === 'allow', path: value });
  }
  groups.push(current);
  const specific = groups.filter(g => g.agents.includes('pescalead'));
  const selected = specific.length ? specific : groups.filter(g => g.agents.includes('*'));
  const matching = selected.flatMap(g => g.rules).filter(rule => {
    const anchored = rule.path.endsWith('$');
    const source = anchored ? rule.path.slice(0, -1) : rule.path;
    const regex = source.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
    return new RegExp(`^${regex}${anchored ? '$' : ''}`).test(path);
  }).sort((a, b) => b.path.length - a.path.length || Number(b.allow) - Number(a.allow));
  return matching[0]?.allow ?? true;
}

export async function enrichWebsite(lead: Lead): Promise<Lead> {
  const site = lead.website && publicHttps(lead.website);
  if (!site) throw new Error('Não há um site HTTPS válido informado para este lead.');
  const url = new URL(site);
  let robots = '';
  try { robots = await (await request(`${url.origin}/robots.txt`, {}, 10000)).text(); }
  catch (error) { if (!(error instanceof ServiceError && error.status === 404)) throw new Error('Não foi possível verificar a política do site. A consulta foi suspensa.'); }
  if (!robotsAllowed(robots, url.pathname + url.search)) throw new Error('O site restringe esta consulta em robots.txt. Abra o site para consultar manualmente.');
  const response = await request(site, { headers: { 'User-Agent': 'PescaLead/1.0 (personal business research)' }, redirect: 'error' }, 15000);
  if (!response.headers.get('content-type')?.includes('text/html')) throw new Error('O site não retornou uma página HTML para análise.');
  if (Number(response.headers.get('content-length') ?? 0) > 1_000_000) throw new Error('Página muito grande para consulta automática.');
  const html = await response.text();
  if (html.length > 1_000_000) throw new Error('Página muito grande para consulta automática.');
  const snippets: { field: string; value: string }[] = [];
  const title = plainText(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '');
  if (title) snippets.push({ field: 'site.title', value: title.slice(0, 300) });
  for (const match of html.matchAll(/<meta\s+[^>]*>/gi)) {
    const attrs = Object.fromEntries([...match[0].matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map(a => [a[1]?.toLowerCase(), a[2]]));
    if ((attrs.name === 'description' || attrs.property === 'og:description') && attrs.content) snippets.push({ field: 'site.description', value: plainText(attrs.content).slice(0, 1500) });
  }
  if (!snippets.length) throw new Error('Não foram encontrados título ou descrição utilizáveis. Consulte o site manualmente.');
  return { ...lead, evidence: [...lead.evidence.filter(e => !e.field.startsWith('site.')), ...snippets.map(s => ({ ...s, url: site, retrievedAt: timestamp() }))] };
}

export async function findCommonsPhoto(lead: Lead): Promise<Lead> {
  if (!lead.commons?.startsWith('File:')) throw new Error('Não há foto com licença identificada nos dados deste estabelecimento.');
  const params = new URLSearchParams({ action: 'query', format: 'json', origin: '*', prop: 'imageinfo', iiprop: 'url|extmetadata', iiurlwidth: '1000', titles: lead.commons });
  const response = await request(`https://commons.wikimedia.org/w/api.php?${params}`);
  const data = z.object({ query: z.object({ pages: z.record(z.string(), z.object({ imageinfo: z.array(z.object({ url: z.string(), thumburl: z.string().optional(), descriptionurl: z.string(), extmetadata: z.record(z.string(), z.object({ value: z.string() })) })).optional() })) }) }).parse(await response.json());
  const image = Object.values(data.query.pages).flatMap(p => p.imageinfo ?? [])[0];
  if (!image) throw new Error('Foto não encontrada no Wikimedia Commons.');
  const meta = image.extmetadata;
  const license = plainText(meta.LicenseShortName?.value ?? '');
  if (!/^(CC BY|CC0|Public domain)/i.test(license)) throw new Error('Licença da foto não suportada para download automático.');
  const photo = PhotoSchema.parse({ url: image.thumburl ?? image.url, page: image.descriptionurl, author: plainText(meta.Artist?.value ?? 'Autoria na fonte'), license, licenseUrl: meta.LicenseUrl?.value ?? image.descriptionurl });
  if (new URL(photo.url).hostname !== 'upload.wikimedia.org') throw new Error('Origem de imagem não suportada.');
  return { ...lead, photo };
}
