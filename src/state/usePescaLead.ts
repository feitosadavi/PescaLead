import { useEffect, useRef, useState } from 'react';
import { AppState, initialState, Lead, localDate, Point, Settings, timestamp } from '../domain/models';
import { localAnalysis, mergeDiscovery, rankLeads, sameBusiness } from '../domain/prospecting';
import { restoreBackup } from '../domain/backup';
import { repository } from '../storage/repository';
import { analyzeLead } from '../integrations/ai';
import { discover } from '../integrations/discovery';
import { keyStore } from '../integrations/device';
import { enrichWebsite, findCommonsPhoto } from '../integrations/enrichment';

export function usePescaLead() {
  const [state, setState] = useState<AppState>(initialState);
  const live = useRef(state);
  const transactions = useRef(Promise.resolve());
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState('');
  const [searchIds, setSearchIds] = useState<string[] | null>(null);
  const [coverage, setCoverage] = useState('');
  const notify = (error: unknown) => setMessage(error instanceof Error ? error.message : String(error));

  useEffect(() => {
    let active = true;
    repository.load().then(value => { if (active) { live.current = value; setState(value); setReady(true); } }).catch(error => { if (active) setLoadError(error instanceof Error ? error.message : 'Falha ao carregar dados locais.'); });
    return () => { active = false; };
  }, []);

  function mutate(change: (previous: AppState) => AppState): Promise<void> {
    const task = transactions.current.catch(() => {}).then(async () => {
      const next = change(live.current);
      await repository.save(next);
      live.current = next;
      setState(next);
    });
    transactions.current = task;
    return task;
  }

  async function updateLead(id: string, update: (lead: Lead) => Lead, event?: string) {
    await mutate(previous => ({ ...previous, leads: previous.leads.map(lead => lead.id !== id ? lead : { ...update(lead), history: event ? [...lead.history, { at: timestamp(), text: event }] : lead.history }) }));
  }

  async function runAi(id: string, detailed: boolean) {
    const key = await keyStore.get();
    const settings = live.current.settings;
    if (!key || !settings.aiEnabled || !settings.model) throw new Error('Configure a chave, o modelo e a habilitação de IA em Ajustes.');
    const lead = live.current.leads.find(l => l.id === id);
    if (!lead) throw new Error('Lead não encontrado.');
    await mutate(previous => {
      const count = previous.aiUsage.date === localDate() ? previous.aiUsage.count : 0;
      if (count >= settings.dailyAiLimit) throw new Error('Limite diário local de análises atingido. Ajuste o limite ou tente amanhã.');
      return { ...previous, aiUsage: { date: localDate(), count: count + 1 } };
    });
    const analysis = await analyzeLead(lead, settings, key, detailed);
    await updateLead(id, current => ({ ...current, analysis }), detailed ? 'Análise detalhada por IA gerada.' : 'Análise inicial por IA gerada.');
  }

  async function search(point: Point, radius: number) {
    if (busy) return;
    setBusy('Lançando a busca…');
    setMessage('');
    try {
      const settings = live.current.settings;
      const result = await discover(point, radius, settings, setBusy);
      const incoming = result.leads.map(lead => ({ ...lead, analysis: localAnalysis(lead) }));
      let ids: string[] = [];
      await mutate(previous => {
        const merged = mergeDiscovery(previous.leads, incoming);
        ids = [...new Set(incoming.map(l => merged.find(m => sameBusiness(m, l))?.id ?? l.id))];
        const retained = merged.filter(l => l.saved || ids.includes(l.id));
        return { ...previous, leads: retained };
      });
      setSearchIds(ids);
      setCoverage(`${result.candidates} candidatos encontrados · ${ids.length} selecionados${result.partial ? ' · consulta parcial' : ''}. ${result.coverageNote || 'Cobertura dos dados abertos; não é uma lista completa da região.'}`);
      let unavailableSources = 0;
      for (let i = 0; i < ids.length; i++) {
        const lead = live.current.leads.find(l => l.id === ids[i]);
        if (!lead) continue;
        if (lead.website && !lead.evidence.some(e => e.field.startsWith('site.'))) {
          setBusy(`Consultando informações públicas · ${i + 1}/${ids.length}`);
          try {
            const enriched = await enrichWebsite(lead);
            await updateLead(lead.id, current => ({ ...current, evidence: enriched.evidence }));
          } catch { unavailableSources++; }
        }
        if (lead.commons && !lead.photo) {
          setBusy(`Consultando fotos licenciadas · ${i + 1}/${ids.length}`);
          try {
            const enriched = await findCommonsPhoto(lead);
            await updateLead(lead.id, current => ({ ...current, photo: enriched.photo }));
          } catch { unavailableSources++; }
        }
      }
      if (unavailableSources) setCoverage(previous => `${previous} ${unavailableSources} consultas de enriquecimento indisponíveis ou restritas; dados da descoberta preservados.`);
      if (settings.aiEnabled && ids.length) {
        for (let i = 0; i < ids.length; i++) {
          setBusy(`Analisando com IA · ${i + 1}/${ids.length}`);
          try { await runAi(ids[i]!, false); }
          catch (error) { notify(error); break; }
          if (i < ids.length - 1) await new Promise(resolve => setTimeout(resolve, 700));
        }
      }
      if (!ids.length) setMessage('Nenhum negócio encontrado com esses filtros. Tente outro endereço ou permita negócios de redes nos ajustes.');
      return ids.length;
    } catch (error) { notify(error); return undefined; }
    finally { setBusy(''); }
  }

  async function perform(label: string, action: () => Promise<void>) {
    if (busy) return;
    setBusy(label);
    try { await action(); } catch (error) { notify(error); } finally { setBusy(''); }
  }

  async function saveSettings(settings: Settings, key: string) {
    await keyStore.set(key.trim());
    await mutate(previous => ({ ...previous, settings }));
    setMessage('Ajustes salvos neste dispositivo.');
  }

  async function importState(raw: string) {
    const restored = restoreBackup(raw);
    await mutate(previous => {
      const ids = new Set(previous.leads.map(l => l.id));
      const added = restored.leads.filter(l => !ids.has(l.id));
      return { ...previous, leads: [...previous.leads, ...added] };
    });
    setMessage('Backup importado. Leads já existentes e ajustes atuais foram preservados.');
  }

  const opportunities = rankLeads(state.leads.filter(l => searchIds ? searchIds.includes(l.id) : !l.saved), state.settings);
  return { state, ready, loadError, busy, message, setMessage, coverage, opportunities, search, updateLead, runAi, perform, saveSettings, importState, notify };
}

export type PescaApp = ReturnType<typeof usePescaLead>;
