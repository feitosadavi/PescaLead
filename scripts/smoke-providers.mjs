// Optional live smoke test. No Gemini key and no paid services are used.
const request = async (url, init) => {
  const response = await fetch(url, { ...init, headers: { Accept: 'application/json', 'User-Agent': 'PescaLead/1.0 (personal business research)', ...init?.headers }, signal: AbortSignal.timeout(45000) });
  if (!response.ok) throw new Error(`HTTP ${response.status} ao consultar ${new URL(url).hostname}: ${(await response.text()).slice(0, 200)}`);
  return response.json();
};
const query = process.env.PESCALEAD_TEST_ADDRESS ?? 'Avenida Paulista, São Paulo, Brasil';
const geocoded = await request(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=1`);
const coordinates = geocoded.features?.[0]?.geometry?.coordinates;
if (!coordinates) throw new Error('O endereço de teste não foi encontrado.');
console.log('Photon: endereço resolvido.', coordinates);
const [lon, lat] = coordinates;
const q = `[out:json][timeout:25];(nwr["name"]["shop"](around:1000,${lat},${lon});nwr["name"]["amenity"="restaurant"](around:1000,${lat},${lon}););out body center 20;`;
const endpoint = process.env.PESCALEAD_OVERPASS_URL ?? 'https://overpass-api.de/api/interpreter';
const places = await request(`${endpoint}?data=${encodeURIComponent(q)}`);
if (!places.elements?.length) throw new Error('Nenhum estabelecimento retornado no teste de cobertura.');
console.log('Overpass: estabelecimentos reais retornados:', places.elements.length);
if (!places.elements.every(e => (e.lat !== undefined && e.lon !== undefined) || e.center)) throw new Error('Retorno sem coordenadas utilizáveis.');
console.log('Amostra:', places.elements.slice(0, 3).map(e => e.tags.name).join(' / '));
if (places.remark) console.log('Aviso do provedor:', places.remark);
