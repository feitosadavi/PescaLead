import { afterEach, describe, expect, it, vi } from 'vitest';
import { defaultSettings } from '../src/domain/models';
import { analysisInput, analyzeLead } from '../src/integrations/ai';
import { boundingBoxes, buildQuery, discover, fromOsm } from '../src/integrations/discovery';
import { robotsAllowed } from '../src/integrations/enrichment';
import { publicHttps, request } from '../src/integrations/http';
import { mapsUrl, whatsappUrl } from '../src/integrations/links';
import { proposalHtml } from '../src/integrations/proposal-html';
import { draftProposal } from '../src/domain/prospecting';
import { fixtureLead, fixtureOsm, origin } from './fixtures';

afterEach(() => vi.unstubAllGlobals());

describe('dados reais e limites da descoberta', () => {
  it('constrói uma consulta limitada para cada raio suportado', () => {
    for (const radius of [10, 20, 30, 40, 50]) {
      const box = boundingBoxes(origin, radius)[0]!;
      expect(box[0]).toBeLessThan(origin.latitude);
      expect(box[2]).toBeGreaterThan(origin.latitude);
      expect(buildQuery(origin, radius)).toContain(box.join(','));
    }
    expect(buildQuery(origin, 50)).toContain('out body center 1500');
    expect(() => buildQuery(origin, 80)).toThrow();
    expect(() => buildQuery({ latitude: NaN, longitude: 0 }, 10)).toThrow();
    expect(boundingBoxes({ latitude: 0, longitude: 179.9 }, 50)).toHaveLength(2);
    expect(boundingBoxes({ latitude: 89.9, longitude: 0 }, 50)[0]).toEqual(expect.arrayContaining([-180, 90, 180]));
  });
  it('não fabrica coordenadas, avaliações ou contato do proprietário', () => {
    expect(fromOsm(fixtureOsm({ lat: undefined }), origin)).toBeUndefined();
    const lead = fromOsm(fixtureOsm(), origin)!;
    expect(lead.ownerAccess).toBe('unknown');
    expect(lead).not.toHaveProperty('rating');
    expect(lead.evidence.every(e => e.url.includes('openstreetmap.org'))).toBe(true);
  });
  it('filtra fora do raio, redes e duplicados antes da seleção', async () => {
    const elements = [fixtureOsm(), fixtureOsm(), fixtureOsm({ id: 2, tags: { name: 'Rede', brand: 'Marca', shop: 'clothes' } }), fixtureOsm({ id: 3, lat: 0 })];
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ elements }))));
    const result = await discover(origin, 10, defaultSettings());
    expect(result.leads).toHaveLength(1);
    expect(result.leads[0]?.name).toBe('Café de teste');
  });
  it('expõe timeout parcial e falha completa sem resultados simulados', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ elements: [], remark: 'runtime error' }))));
    await expect(discover(origin, 10, defaultSettings())).rejects.toThrow();
  });
  it('em sobrecarga tenta uma única amostra menor e explicita cobertura reduzida', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(new Response('', { status: 502 })).mockResolvedValueOnce(new Response(JSON.stringify({ elements: [fixtureOsm()] })));
    vi.stubGlobal('fetch', fetch);
    const result = await discover(origin, 50, defaultSettings());
    expect(result.leads).toHaveLength(1);
    expect(result.partial).toBe(true);
    expect(result.coverageNote).toContain('amostra central de 1 km');
    expect(fetch).toHaveBeenCalledTimes(2);
  });
  it('não faz consulta adicional quando a fonte retorna limite de uso', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response('', { status: 429 })); vi.stubGlobal('fetch', fetch);
    await expect(discover(origin, 10, defaultSettings())).rejects.toThrow('Cota');
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

describe('IA, privacidade e falhas', () => {
  it('nunca envia notas privadas e histórico ao modelo', () => {
    const input = JSON.stringify(analysisInput(fixtureLead({ ownerInfo: 'SEGREDO_A', lossReason: 'SEGREDO_B', notes: [{ id: 'n', text: 'SEGREDO_C', createdAt: 'hoje' }], history: [{ text: 'SEGREDO_D', at: 'hoje' }] }), defaultSettings(), true));
    expect(input).not.toContain('SEGREDO');
  });
  it('exige configuração explícita antes de chamar a IA', async () => {
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
    await expect(analyzeLead(fixtureLead(), defaultSettings(), '', false)).rejects.toThrow('Configure');
    expect(fetch).not.toHaveBeenCalled();
  });
  it('rejeita resposta truncada ou análise fora do schema', async () => {
    const settings = { ...defaultSettings(), aiEnabled: true, model: 'gemini-teste' };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ candidates: [{ finishReason: 'MAX_TOKENS', content: { parts: [{ text: '{}' }] } }] }))));
    await expect(analyzeLead(fixtureLead(), settings, 'chave-teste', true)).rejects.toThrow('não concluiu');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: '{}' }] } }] }))));
    await expect(analyzeLead(fixtureLead(), settings, 'chave-teste', true)).rejects.toThrow('validação');
  });
  it('apresenta cota esgotada e não repete chamadas automaticamente', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response('', { status: 429 })); vi.stubGlobal('fetch', fetch);
    await expect(request('https://example.com')).rejects.toThrow('Cota');
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

describe('políticas de consulta e links externos', () => {
  it('respeita robots, regras específicas, curingas e allow em empate', () => {
    expect(robotsAllowed('User-agent: *\nDisallow: /', '/')).toBe(false);
    expect(robotsAllowed('User-agent: *\nDisallow: /privado\nAllow: /privado/publico', '/privado/publico')).toBe(true);
    expect(robotsAllowed('User-agent: *\nDisallow: /\nUser-agent: PescaLead\nAllow: /', '/')).toBe(true);
    expect(robotsAllowed('User-agent: *\nDisallow: /*?\nAllow: /', '/x?q=1')).toBe(false);
    expect(robotsAllowed('User-agent: *\nDisallow: /private$', '/private/public')).toBe(true);
    expect(robotsAllowed('User-agent: *\nDisallow: /private$', '/private')).toBe(false);
  });
  it.each(['javascript:alert(1)', 'http://example.com', 'https://127.0.0.1/', 'https://192.168.0.1/', 'https://user:pass@example.com', 'https://test.local/'])('rejeita destino inválido %s', url => expect(publicHttps(url)).toBeUndefined());
  it('normaliza WhatsApp e abre Maps com destino exato', () => {
    expect(whatsappUrl('(11) 99999-1234')).toBe('https://wa.me/5511999991234');
    expect(whatsappUrl('1234')).toBeUndefined();
    expect(whatsappUrl('+49 30 123456')).toBe('https://wa.me/4930123456');
    expect(mapsUrl(fixtureLead())).toContain(encodeURIComponent('-23.5505,-46.6333'));
  });
});

describe('PDF comercial', () => {
  it('escapa conteúdo externo e exclui notas, histórico e pontuação', () => {
    const lead = fixtureLead({ name: '<script>TESTE</script>', notes: [{ id: 'n', text: 'NOTA_PRIVADA', createdAt: 'hoje' }] });
    lead.proposal = draftProposal(lead, defaultSettings());
    const html = proposalHtml(lead, defaultSettings(), new Date('2026-11-17T12:00:00Z'));
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('NOTA_PRIVADA');
    expect(html).not.toContain('pontos');
    expect(html).toContain('Investimento');
  });
});
