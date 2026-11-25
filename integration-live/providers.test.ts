import { expect, test } from 'vitest';
import { defaultSettings } from '../src/domain/models';
import { discover, findAddresses } from '../src/integrations/discovery';

test('adaptadores reais resolvem endereço e selecionam estabelecimentos com coordenadas', async () => {
  const settings = { ...defaultSettings(), resultLimit: 3, overpassUrl: process.env.PESCALEAD_OVERPASS_URL ?? defaultSettings().overpassUrl };
  const addresses = await findAddresses('Avenida Paulista, São Paulo, Brasil', settings.photonUrl);
  expect(addresses.length).toBeGreaterThan(0);
  const result = await discover(addresses[0]!.point, 10, settings);
  expect(result.leads.length).toBeGreaterThan(0);
  expect(result.leads.length).toBeLessThanOrEqual(3);
  expect(result.leads.every(l => l.distance <= 10 && l.evidence.length > 0)).toBe(true);
  console.log(`Fontes reais: ${result.candidates} candidatos; ${result.leads.length} selecionados; parcial=${result.partial}.`);
});
