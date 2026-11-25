import { describe, expect, it } from 'vitest';
import { defaultSettings, initialState } from '../src/domain/models';
import { distanceKm, draftProposal, estimate, localAnalysis, mergeDiscovery, parseAmount, rankLeads, scoreLead } from '../src/domain/prospecting';
import { createBackup, restoreBackup } from '../src/domain/backup';
import { fixtureLead, origin } from './fixtures';

describe('seleção geográfica e preservação do CRM', () => {
  it('calcula distâncias geográficas, incluindo extremos numéricos', () => {
    expect(distanceKm(origin, origin)).toBe(0);
    expect(distanceKm({ latitude: 0, longitude: 0 }, { latitude: 0, longitude: 1 })).toBeCloseTo(111.195, 2);
    expect(distanceKm({ latitude: 0, longitude: 0 }, { latitude: 0, longitude: 180 })).toBeCloseTo(20015, 0);
  });
  it('preserva notas, status, proposta e informações privadas ao reencontrar lead', () => {
    const saved = fixtureLead({ saved: true, status: 'Proposta', ownerInfo: 'informação privada', ownerAccess: 'confirmed', notes: [{ id: 'n1', text: 'Privado', createdAt: '2026-11-17' }], proposal: draftProposal(fixtureLead(), defaultSettings()) });
    const merged = mergeDiscovery([saved], [fixtureLead({ phone: '+5511888881234' })]);
    expect(merged).toHaveLength(1);
    expect(merged[0]).toMatchObject({ status: 'Proposta', saved: true, ownerInfo: 'informação privada', phone: '+5511888881234' });
    expect(merged[0]?.notes).toEqual(saved.notes);
    expect(merged[0]?.proposal).toEqual(saved.proposal);
  });
  it('não funde filiais de mesmo nome sem evidência suficiente', () => {
    const a = fixtureLead(), b = fixtureLead({ id: 'osm:node:2', point: { ...origin, latitude: origin.latitude + 0.02 } });
    expect(mergeDiscovery([a], [b])).toHaveLength(2);
    expect(mergeDiscovery([fixtureLead({ phone: undefined })], [fixtureLead({ id: 'osm:way:2', phone: undefined })])).toHaveLength(2);
  });
  it('funde identificadores diferentes apenas com nome, contato e proximidade', () => {
    expect(mergeDiscovery([fixtureLead({ saved: true })], [fixtureLead({ id: 'osm:way:2' })])).toHaveLength(1);
  });
});

describe('cobrança e prioridade', () => {
  it('calcula preço pela margem sobre receita e não como markup', () => {
    const value = estimate({ features: [{ name: 'A', benefit: 'B', hours: 10 }], maintenanceHours: 2 }, { ...defaultSettings(), hourlyRate: 100, margin: 20 });
    expect(value.setup).toBe(1250);
    expect(value.monthly).toBe(250);
    expect(value.grossMargin).toBe(250);
  });
  it.each([['1.250,50', 1250.5], ['1250.50', 1250.5], ['0', 0], ['80,00', 80], ['R$ 1.250,00', 1250]])('interpreta %s sem perder a escala', (raw, expected) => expect(parseAmount(raw)).toBe(expected));
  it.each(['', 'abc', '-10', '1,234,5', 'Infinity'])('rejeita valor comercial inválido %s', raw => expect(Number.isNaN(parseAmount(raw))).toBe(true));
  it('não afirma que ausência de site significa ausência de sistema', () => {
    const result = localAnalysis(fixtureLead({ website: undefined }));
    expect(result.mode).toBe('local');
    expect(result.features[2]?.benefit).toContain('Verificar se já existe');
    expect(result.assumptions.join(' ')).toContain('sem análise por IA');
  });
  it('prioridade tem fatores somáveis e confiança separada', () => {
    const score = scoreLead(fixtureLead(), defaultSettings());
    expect(score.value).toBe(score.reasons.reduce((a, b) => a + b.points, 0));
    expect(score.value).toBeLessThanOrEqual(100);
    expect(score).not.toHaveProperty('probability');
    expect(scoreLead(fixtureLead({ phone: undefined, website: undefined, address: '' }), defaultSettings()).confidence).toBe('Baixa');
  });
  it('respeita a priorização manual e desempata de forma estável', () => {
    const ranked = rankLeads([fixtureLead({ id: 'b', priority: 'low' }), fixtureLead({ id: 'a', priority: 'high', phone: undefined })], defaultSettings());
    expect(ranked[0]?.id).toBe('a');
  });
});

describe('backup e recuperação', () => {
  it('exporta apenas a carteira, não exporta chave e desabilita IA restaurada', () => {
    const state = { ...initialState(), leads: [fixtureLead({ saved: true }), fixtureLead({ id: 'b' })] };
    state.settings.aiEnabled = true;
    const result = restoreBackup(createBackup(state));
    expect(result.leads).toHaveLength(1);
    expect(result.settings.aiEnabled).toBe(false);
    expect(JSON.parse(createBackup(state))).not.toHaveProperty('apiKey');
  });
  it('rejeita versão futura e arquivo com IDs duplicados', () => {
    expect(() => restoreBackup(JSON.stringify({ ...initialState(), version: 2 }))).toThrow();
    expect(() => restoreBackup(JSON.stringify({ ...initialState(), leads: [fixtureLead(), fixtureLead()] }))).toThrow();
  });
  it('não aceita dados geográficos corrompidos', () => {
    const invalid = { ...initialState(), leads: [{ ...fixtureLead(), point: { latitude: 91, longitude: 0 } }] };
    expect(() => restoreBackup(JSON.stringify(invalid))).toThrow();
  });
});
