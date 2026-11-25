import { Lead, LeadSchema, Point, PointSchema, Settings, timestamp } from '../domain/models';
import { distanceKm, mergeDiscovery, rankLeads } from '../domain/prospecting';
import { publicHttps, request, ServiceError } from './http';
import { z } from 'zod';

const categories: Record<string, string> = { restaurant: 'Restaurante', cafe: 'Café', bakery: 'Padaria', bar: 'Bar', clinic: 'Clínica', doctors: 'Consultório', dentist: 'Dentista', veterinary: 'Veterinária', beauty: 'Salão de beleza', hairdresser: 'Salão de beleza', fitness_centre: 'Academia', car_repair: 'Oficina', clothes: 'Loja de roupas', supermarket: 'Supermercado', convenience: 'Conveniência', pharmacy: 'Farmácia', hotel: 'Hotel', guest_house: 'Pousada', pet: 'Pet shop', furniture: 'Móveis', electronics: 'Eletrônicos', hardware: 'Materiais de construção' };
const ElementSchema = z.object({ type: z.enum(['node', 'way', 'relation']), id: z.number(), lat: z.number().optional(), lon: z.number().optional(), center: z.object({ lat: z.number(), lon: z.number() }).optional(), tags: z.record(z.string(), z.string()).default({}) });
export type OsmElement = z.infer<typeof ElementSchema>;

export function fromOsm(raw: OsmElement, origin: Point): Lead | undefined {
  const tags = raw.tags, latitude = raw.lat ?? raw.center?.lat, longitude = raw.lon ?? raw.center?.lon;
  if (!tags.name || latitude === undefined || longitude === undefined) return;
  const point = PointSchema.safeParse({ latitude, longitude });
  if (!point.success) return;
  const url = `https://www.openstreetmap.org/${raw.type}/${raw.id}`;
  const date = timestamp();
  const category = categories[tags.shop ?? tags.healthcare ?? tags.amenity ?? tags.leisure ?? tags.tourism ?? ''] ?? tags.shop ?? tags.healthcare ?? tags.amenity ?? 'Comércio e serviços';
  const address = [tags['addr:street'], tags['addr:housenumber'], tags['addr:suburb'], tags['addr:city']].filter(Boolean).join(', ');
  const phone = tags['contact:whatsapp'] ?? tags['contact:phone'] ?? tags.phone;
  const website = publicHttps(tags['contact:website'] ?? tags.website ?? '');
  const evidence = Object.entries({ name: tags.name, category, address, phone, website, hours: tags.opening_hours, brand: tags.brand }).filter((e): e is [string, string] => !!e[1]).map(([field, value]) => ({ field, value, url, retrievedAt: date }));
  return LeadSchema.parse({ id: `osm:${raw.type}:${raw.id}`, name: tags.name, category, point: point.data, address, phone, website, hours: tags.opening_hours, brand: tags.brand, commons: tags.wikimedia_commons ?? (tags.image?.startsWith('File:') ? tags.image : undefined), evidence, retrievedAt: date, distance: distanceKm(origin, point.data) });
}

export function buildQuery(origin: Point, radius: number) {
  PointSchema.parse(origin);
  if (![10, 20, 30, 40, 50].includes(radius)) throw new Error('Raio inválido.');
  return buildAreaQuery(origin, radius, 1500);
}

function buildAreaQuery(origin: Point, radius: number, limit: number) {
  const filters = ['["shop"]', '["healthcare"]', '["amenity"~"^(restaurant|cafe|bar|pub|fast_food|clinic|doctors|dentist|veterinary|pharmacy)$"]', '["leisure"="fitness_centre"]', '["tourism"~"^(hotel|guest_house)$"]'];
  // Indexed bounding boxes reduce shared-server work. The exact circular radius is
  // applied by distanceKm below, before candidates can enter the selection.
  const queries = boundingBoxes(origin, radius).flatMap(box => filters.map(filter => `nwr${filter}["name"](${box.join(',')});`));
  return `[out:json][timeout:30][maxsize:67108864];(${queries.join('')});out body center ${limit};`;
}

export function boundingBoxes(origin: Point, radius: number): number[][] {
  const angular = radius / 6371;
  const degrees = 180 / Math.PI;
  const span = angular * degrees;
  const south = Math.max(-90, origin.latitude - span), north = Math.min(90, origin.latitude + span);
  if (south === -90 || north === 90) return [[south, -180, north, 180]];
  const longitudeSpan = Math.asin(Math.sin(angular) / Math.cos(origin.latitude / degrees)) * degrees;
  const west = origin.longitude - longitudeSpan, east = origin.longitude + longitudeSpan;
  if (west < -180) return [[south, west + 360, north, 180], [south, -180, north, east]];
  if (east > 180) return [[south, west, north, 180], [south, -180, north, east - 360]];
  return [[south, west, north, east]];
}

export async function discover(origin: Point, radius: number, settings: Settings, onProgress?: (message: string) => void) {
  const endpoint = publicHttps(settings.overpassUrl);
  if (!endpoint) throw new Error('Configure um endereço HTTPS válido para o Overpass.');
  const query = buildQuery(origin, radius);
  const fetchArea = async (body: string, timeout: number) => {
    const response = await request(`${endpoint}${endpoint.includes('?') ? '&' : '?'}data=${encodeURIComponent(body)}`, { headers: { Accept: 'application/json', 'User-Agent': 'PescaLead/1.0 (personal business research)' } }, timeout);
    const data = z.object({ elements: z.array(ElementSchema), remark: z.string().optional() }).parse(await response.json());
    if (data.remark && !data.elements.length) throw new ServiceError('O servidor não concluiu a busca. Reduza o raio ou tente mais tarde.', 503);
    return data;
  };
  let coverageNote = '';
  let effectiveRadius = radius;
  let data: Awaited<ReturnType<typeof fetchArea>>;
  try { data = await fetchArea(query, 65000); }
  catch (error) {
    // One bounded lighter query on overload/timeouts. Never retry a quota error,
    // and never pretend that a central sample covers the requested wider area.
    if (!(error instanceof ServiceError) || (error.status !== undefined && error.status < 500)) throw error;
    effectiveRadius = 1;
    onProgress?.('Fonte ocupada · tentando uma amostra central de 1 km…');
    coverageNote = `A fonte não concluiu os ${radius} km. Resultado parcial: somente a amostra central de 1 km foi consultada. Para explorar outras áreas, altere o endereço de partida.`;
    data = await fetchArea(buildAreaQuery(origin, effectiveRadius, 250), 35000);
  }
  const parsed = data.elements.map(e => fromOsm(e, origin)).filter((l): l is Lead => !!l && l.distance <= effectiveRadius && (!settings.excludeChains || !l.brand));
  const leads = rankLeads(mergeDiscovery([], parsed), settings).slice(0, settings.resultLimit);
  return { leads, candidates: parsed.length, partial: !!coverageNote || !!data.remark || data.elements.length >= 1500, coverageNote };
}

export type AddressResult = { label: string; point: Point };
export async function findAddresses(query: string, endpoint: string): Promise<AddressResult[]> {
  if (query.trim().length < 4) throw new Error('Digite um endereço mais completo, incluindo a cidade.');
  const base = publicHttps(endpoint);
  if (!base) throw new Error('Configure um endereço HTTPS válido para o Photon.');
  const url = `${base.replace(/\/$/, '')}/api/?q=${encodeURIComponent(query.trim())}&limit=5`;
  const response = await request(url);
  const data = z.object({ features: z.array(z.object({ geometry: z.object({ coordinates: z.array(z.number()).min(2) }), properties: z.record(z.string(), z.unknown()) })) }).parse(await response.json());
  return data.features.flatMap(f => {
    const point = PointSchema.safeParse({ longitude: f.geometry.coordinates[0], latitude: f.geometry.coordinates[1] });
    if (!point.success) return [];
    return [{ point: point.data, label: ['name', 'street', 'housenumber', 'district', 'city', 'state', 'country'].map(k => f.properties[k]).filter(v => typeof v === 'string').join(', ') }];
  });
}
