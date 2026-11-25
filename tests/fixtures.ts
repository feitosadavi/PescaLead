import { Lead, LeadSchema } from '../src/domain/models';
import { OsmElement } from '../src/integrations/discovery';

export const origin = { latitude: -23.5505, longitude: -46.6333 };
export const fixtureLead = (overrides: Partial<Lead> = {}): Lead => LeadSchema.parse({ id: 'osm:node:1', name: 'Café de teste', category: 'Café', point: origin, address: 'Rua de Teste, 10, São Paulo', phone: '+55 11 99999-1234', website: 'https://example.com/', evidence: [{ field: 'name', value: 'Café de teste', url: 'https://www.openstreetmap.org/node/1', retrievedAt: '2026-11-17T12:00:00Z' }], retrievedAt: '2026-11-17T12:00:00Z', distance: 1, ...overrides });
export const fixtureOsm = (overrides: Partial<OsmElement> = {}): OsmElement => ({ type: 'node', id: 1, lat: origin.latitude, lon: origin.longitude, tags: { name: 'Café de teste', amenity: 'cafe', 'addr:street': 'Rua de Teste', 'addr:housenumber': '10', phone: '+5511999991234', website: 'https://example.com/' }, ...overrides });
