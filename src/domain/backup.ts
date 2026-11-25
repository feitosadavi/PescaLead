import { AppState, StateSchema } from './models';

export function createBackup(state: AppState): string {
  const safe = { ...state, leads: state.leads.filter(l => l.saved).map(l => ({ ...l, photo: l.photo ? { ...l.photo, localUri: undefined } : undefined })), settings: { ...state.settings, aiEnabled: false } };
  return JSON.stringify({ ...StateSchema.parse(safe), attribution: 'Dados públicos: © Colaboradores do OpenStreetMap — ODbL — https://www.openstreetmap.org/copyright', exportedAt: new Date().toISOString() }, null, 2);
}

export function restoreBackup(raw: string): AppState {
  if (raw.length > 10_000_000) throw new Error('Arquivo muito grande. O limite é 10 MB.');
  const result = StateSchema.safeParse(JSON.parse(raw));
  if (!result.success) throw new Error('Backup inválido ou de uma versão não suportada. Nenhum dado foi alterado.');
  const ids = new Set<string>();
  for (const lead of result.data.leads) {
    if (ids.has(lead.id)) throw new Error('Backup contém identificadores repetidos. Nenhum dado foi alterado.');
    ids.add(lead.id);
  }
  return { ...result.data, settings: { ...result.data.settings, aiEnabled: false }, leads: result.data.leads.map(l => ({ ...l, saved: true, photo: l.photo ? { ...l.photo, localUri: undefined } : undefined })) };
}
