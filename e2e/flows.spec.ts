import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { fixtureOsm } from '../tests/fixtures';

test.beforeEach(async ({ page }) => {
  await page.route('https://example.com/**', route => route.request().url().endsWith('/robots.txt') ? route.fulfill({ body: 'User-agent: *\nAllow: /', contentType: 'text/plain' }) : route.fulfill({ body: '<html><title>Café de teste</title><meta name="description" content="Cafeteria do cenário de teste."></html>', contentType: 'text/html' }));
  await page.route('**/photon.komoot.io/api/**', route => route.fulfill({ json: { features: [{ geometry: { coordinates: [-46.6333, -23.5505] }, properties: { name: 'São Paulo — endereço de teste', city: 'São Paulo', country: 'Brasil' } }] } }));
  await page.route('**/overpass-api.de/api/interpreter*', route => route.fulfill({ json: { elements: [fixtureOsm(), fixtureOsm({ id: 2, tags: { name: 'Oficina de teste', shop: 'car_repair', phone: '+5511988881234' } })] } }));
});

test('busca, seleção, carteira, notas, cobrança e PDF permanecem coerentes', async ({ page, context }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByText('Onde vamos pescar?')).toBeVisible();
  mkdirSync('artifacts/screenshots', { recursive: true });
  await page.screenshot({ path: 'artifacts/screenshots/sonar.png', fullPage: true });
  await page.getByLabel('Endereço de partida').fill('São Paulo, Brasil');
  await page.getByRole('button', { name: 'Buscar endereço', exact: true }).click();
  await page.getByRole('button', { name: 'São Paulo — endereço de teste, São Paulo, Brasil' }).click();
  await page.getByRole('button', { name: '50 km', exact: true }).click();
  await page.getByRole('button', { name: 'Lançar busca', exact: true }).click();
  await page.getByRole('button', { name: 'Abrir Café de teste', exact: true }).click();
  await page.getByRole('button', { name: 'Salvar na carteira', exact: true }).click();
  await page.getByRole('button', { name: 'Qualificado', exact: true }).click();
  await page.getByLabel('Adicionar nota privada').fill('NOTA PRIVADA DO TESTE — conversar diretamente com o proprietário.');
  await page.getByRole('button', { name: 'Registrar nota', exact: true }).click();
  await expect(page.getByText('NOTA PRIVADA DO TESTE — conversar diretamente com o proprietário.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Análise', exact: true }).click();
  await expect(page.getByText('Sugestão por regras locais', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Aprofundar análise', exact: true }).click();
  await expect(page.getByText(/Configure a chave, o modelo/)).toBeVisible();
  await page.getByRole('button', { name: 'Fechar mensagem' }).click();
  await page.getByRole('button', { name: 'Proposta', exact: true }).click();
  await page.getByLabel('Implantação (R$)', { exact: true }).fill('1.250,50');
  await page.getByLabel('Mensalidade (R$)', { exact: true }).fill('250,00');
  await page.getByRole('button', { name: 'Salvar proposta', exact: true }).click();
  await expect(page.getByText(/Proposta salva na carteira/)).toBeVisible();
  await page.getByRole('button', { name: 'Fechar mensagem' }).click();
  await context.addInitScript(() => { window.print = () => {}; });
  const popupPromise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Salvar e compartilhar PDF', exact: true }).click();
  const popup = await popupPromise;
  await expect(popup.getByText('Investimento', { exact: true })).toBeVisible();
  await expect(popup.locator('body')).not.toContainText('NOTA PRIVADA');
  await expect(popup.locator('body')).toContainText('1.250,50');
  await popup.pdf({ path: 'artifacts/proposta-teste.pdf', format: 'A4', printBackground: true });
  await popup.close();
  await page.getByRole('button', { name: 'Voltar', exact: true }).click();
  await page.reload();
  await page.getByRole('tab', { name: 'Carteira', exact: true }).click();
  await expect(page.getByText('Qualificado', { exact: true })).toHaveCount(2);
  await page.getByRole('button', { name: 'Abrir Café de teste', exact: true }).click();
  await expect(page.getByText('NOTA PRIVADA DO TESTE — conversar diretamente com o proprietário.', { exact: true })).toBeVisible();
  await context.setOffline(true);
  await page.getByLabel('Adicionar nota privada').fill('Nota adicionada sem conexão.');
  await page.getByRole('button', { name: 'Registrar nota', exact: true }).click();
  await expect(page.getByText('Nota adicionada sem conexão.', { exact: true })).toBeVisible();
  await context.setOffline(false);
  expect(errors).toEqual([]);
});

test('falha de fonte é explicada e não produz resultados fictícios', async ({ page }) => {
  await page.route('**/overpass-api.de/api/interpreter*', route => route.fulfill({ status: 429, body: '' }));
  await page.goto('/');
  await page.getByLabel('Endereço de partida').fill('São Paulo, Brasil');
  await page.getByRole('button', { name: 'Buscar endereço', exact: true }).click();
  await page.getByRole('button', { name: 'São Paulo — endereço de teste, São Paulo, Brasil' }).click();
  await page.getByRole('button', { name: 'Lançar busca', exact: true }).click();
  await expect(page.getByText(/Cota ou limite do serviço atingido/)).toBeVisible();
  await page.getByRole('tab', { name: 'Oportunidades', exact: true }).click();
  await expect(page.getByText('Um bom negócio começa com uma busca', { exact: true })).toBeVisible();
});

test('configuração explícita habilita a IA e contabiliza as chamadas', async ({ page }) => {
  let calls = 0;
  await page.route('**/generativelanguage.googleapis.com/v1beta/models?*', route => route.fulfill({ json: { models: [{ name: 'models/gemini-flash-teste', displayName: 'Flash — modelo de teste', supportedGenerationMethods: ['generateContent'] }] } }));
  await page.route('**/models/gemini-flash-teste:generateContent', async route => {
    calls++;
    const body = route.request().postDataJSON();
    const input = JSON.parse(body.contents[0].parts[0].text);
    expect(input).not.toHaveProperty('notes');
    expect(input).not.toHaveProperty('history');
    await route.fulfill({ json: { candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify({ summary: `Análise de teste para ${input.name}`, hypothesis: ['Hipótese do cenário controlado.'], solution: `Solução de teste para ${input.name}`, features: [{ name: 'Fluxo personalizado de teste', benefit: 'Benefício a validar com o responsável.', hours: 40 }], questions: ['Como funciona o processo hoje?'], phases: ['Diagnóstico', 'Implantação'], assumptions: ['Cenário de teste, sem chamada real ao provedor.'], maintenanceHours: 2 }) }] } }] } });
  });
  await page.goto('/');
  await page.getByRole('tab', { name: 'Ajustes', exact: true }).click();
  await page.getByLabel('Chave da API Gemini', { exact: true }).fill('chave-ficticia-apenas-para-teste');
  await page.getByRole('button', { name: 'Consultar modelos disponíveis', exact: true }).click();
  await page.getByRole('button', { name: 'Flash — modelo de teste', exact: true }).click();
  await page.getByRole('switch', { name: 'Habilitar IA com minha chave e cotas', exact: true }).click();
  await page.getByRole('button', { name: 'Salvar ajustes', exact: true }).click();
  await expect(page.getByText(/Ajustes salvos neste dispositivo/)).toBeVisible();
  await page.getByRole('tab', { name: 'Sonar', exact: true }).click();
  await page.getByLabel('Endereço de partida').fill('São Paulo, Brasil');
  await page.getByRole('button', { name: 'Buscar endereço', exact: true }).click();
  await page.getByRole('button', { name: 'São Paulo — endereço de teste, São Paulo, Brasil' }).click();
  await page.getByRole('button', { name: 'Lançar busca', exact: true }).click();
  await page.getByRole('button', { name: 'Abrir Café de teste', exact: true }).click();
  await page.getByRole('button', { name: 'Análise', exact: true }).click();
  await expect(page.getByText('Análise de teste para Café de teste', { exact: true })).toBeVisible();
  expect(calls).toBe(2);
});

test('amostra após sobrecarga é apresentada com a cobertura efetiva de 1 km', async ({ page }) => {
  let queries = 0;
  await page.route('**/overpass-api.de/api/interpreter*', async route => {
    queries++;
    if (queries === 1) await route.fulfill({ status: 502, body: '' });
    else await route.fulfill({ json: { elements: [fixtureOsm()] } });
  });
  await page.goto('/');
  await page.getByLabel('Endereço de partida').fill('São Paulo, Brasil');
  await page.getByRole('button', { name: 'Buscar endereço', exact: true }).click();
  await page.getByRole('button', { name: 'São Paulo — endereço de teste, São Paulo, Brasil' }).click();
  await page.getByRole('button', { name: '50 km', exact: true }).click();
  await page.getByRole('button', { name: 'Lançar busca', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Abrir Café de teste', exact: true })).toBeVisible();
  await expect(page.getByText(/somente a amostra central de 1 km foi consultada/)).toBeVisible();
  expect(queries).toBe(2);
});
