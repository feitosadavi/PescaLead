import { z } from 'zod';

export const STATUSES = ['Novo', 'Qualificado', 'Contatado', 'Reunião', 'Proposta', 'Ganho', 'Perdido'] as const;
export const StatusSchema = z.enum(STATUSES);
export const PointSchema = z.object({ latitude: z.number().min(-90).max(90), longitude: z.number().min(-180).max(180) });
export type Point = z.infer<typeof PointSchema>;
export const EvidenceSchema = z.object({ field: z.string(), value: z.string(), url: z.string().url(), retrievedAt: z.string() });
export const PhotoSchema = z.object({ url: z.string().url(), page: z.string().url(), author: z.string(), license: z.string(), licenseUrl: z.string(), localUri: z.string().optional() });
export const AnalysisSchema = z.object({
  summary: z.string().min(1).max(3000),
  hypothesis: z.array(z.string().max(1500)).max(12),
  solution: z.string().min(1).max(3000),
  features: z.array(z.object({ name: z.string().max(200), benefit: z.string().max(1000), hours: z.number().min(1).max(1000) })).min(1).max(15),
  questions: z.array(z.string().max(1000)).max(10),
  phases: z.array(z.string().max(1000)).max(10),
  assumptions: z.array(z.string().max(1000)).max(10),
  maintenanceHours: z.number().min(0).max(200),
});
export type AnalysisContent = z.infer<typeof AnalysisSchema>;
export const AnalysisRecordSchema = AnalysisSchema.extend({ mode: z.enum(['local', 'ai']), detailed: z.boolean(), createdAt: z.string(), model: z.string().optional() });
export type Analysis = z.infer<typeof AnalysisRecordSchema>;
export const ProposalSchema = z.object({ title: z.string().min(1), scope: z.string(), setup: z.number().finite().min(0), monthly: z.number().finite().min(0), terms: z.string(), validityDays: z.number().int().min(1).max(365) });
export type Proposal = z.infer<typeof ProposalSchema>;
export const LeadSchema = z.object({
  id: z.string().min(1), name: z.string().min(1), category: z.string(), point: PointSchema, address: z.string(),
  phone: z.string().optional(), website: z.string().optional(), hours: z.string().optional(), brand: z.string().optional(),
  commons: z.string().optional(), photo: PhotoSchema.optional(),
  evidence: z.array(EvidenceSchema), retrievedAt: z.string(), distance: z.number().nonnegative(),
  ownerAccess: z.enum(['unknown', 'likely', 'confirmed']).default('unknown'),
  ownerInfo: z.string().default(''), priority: z.enum(['auto', 'high', 'low']).default('auto'),
  saved: z.boolean().default(false), status: StatusSchema.default('Novo'), notes: z.array(z.object({ id: z.string(), text: z.string(), createdAt: z.string() })).default([]),
  history: z.array(z.object({ at: z.string(), text: z.string() })).default([]), lossReason: z.string().default(''),
  analysis: AnalysisRecordSchema.optional(), proposal: ProposalSchema.optional(),
});
export type Lead = z.infer<typeof LeadSchema>;
export const SettingsSchema = z.object({
  resultLimit: z.number().int().min(1).max(50).default(12), hourlyRate: z.number().min(1).max(10000).default(80),
  margin: z.number().min(0).max(90).default(35), providerName: z.string().default(''), providerContact: z.string().default(''),
  model: z.string().regex(/^[a-zA-Z0-9._-]*$/).default(''), aiEnabled: z.boolean().default(false),
  dailyAiLimit: z.number().int().min(1).max(100).default(20),
  photonUrl: z.string().url().default('https://photon.komoot.io'),
  overpassUrl: z.string().url().default('https://overpass-api.de/api/interpreter'),
  excludeChains: z.boolean().default(true),
});
export type Settings = z.infer<typeof SettingsSchema>;
export const StateSchema = z.object({ version: z.literal(1), leads: z.array(LeadSchema), settings: SettingsSchema, aiUsage: z.object({ date: z.string(), count: z.number().int().nonnegative() }) });
export type AppState = z.infer<typeof StateSchema>;
export const defaultSettings = (): Settings => SettingsSchema.parse({});
export const initialState = (): AppState => ({ version: 1, leads: [], settings: defaultSettings(), aiUsage: { date: '', count: 0 } });
export const timestamp = () => new Date().toISOString();
export const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
export const localDate = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
