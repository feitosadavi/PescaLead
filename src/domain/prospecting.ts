import { Analysis, AnalysisContent, Lead, Point, Proposal, Settings, timestamp } from './models';

export function distanceKm(a: Point, b: Point): number {
  const rad = (n: number) => n * Math.PI / 180;
  const h = Math.sin(rad(b.latitude - a.latitude) / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(rad(b.longitude - a.longitude) / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(Math.max(0, 1 - h)));
}

export function estimate(analysis: Pick<AnalysisContent, 'features' | 'maintenanceHours'>, settings: Settings) {
  const hours = analysis.features.reduce((total, f) => total + f.hours, 0);
  const cost = hours * settings.hourlyRate;
  const monthlyCost = analysis.maintenanceHours * settings.hourlyRate;
  const setup = Math.ceil(cost / (1 - settings.margin / 100) / 10) * 10;
  const monthly = Math.ceil(monthlyCost / (1 - settings.margin / 100) / 10) * 10;
  return { hours, cost, monthlyCost, setup, monthly, grossMargin: setup - cost };
}

export function localAnalysis(lead: Lead): Analysis {
  const appointment = /clínica|saúde|dentista|salão|academia|veterin|consultório/i.test(lead.category);
  const food = /restaurante|café|padaria|bar|alimentação/i.test(lead.category);
  const core = appointment ? 'Agenda e relacionamento com clientes' : food ? 'Gestão de pedidos e relacionamento' : 'Gestão comercial e acompanhamento de clientes';
  const features = [
    { name: appointment ? 'Agenda com confirmação' : food ? 'Painel de pedidos' : 'Orçamentos e acompanhamento', benefit: 'Organizar a operação; confirmar o fluxo atual com o proprietário.', hours: appointment ? 28 : 32 },
    { name: 'Cadastro e histórico de clientes', benefit: 'Centralizar informações comerciais e reduzir retrabalho, se houver essa necessidade.', hours: 20 },
    { name: lead.website ? 'Integração com a presença digital' : 'Página de apresentação e contato', benefit: lead.website ? 'Avaliar integração com o site informado.' : 'Verificar se já existe site antes de propor uma nova página.', hours: 16 },
  ];
  return {
    summary: `${lead.name} está classificado como ${lead.category}. ${lead.address ? `Endereço informado: ${lead.address}.` : 'Endereço completo não disponível.'} Diagnóstico preliminar baseado nos dados públicos encontrados.`,
    hypothesis: ['Pode haver oportunidade de organizar atendimento e acompanhamento comercial. Necessidade ainda não confirmada.'],
    solution: `${core} para ${lead.name}, com escopo a validar em conversa com o responsável.`, features,
    questions: ['Você é o responsável por decidir sobre sistemas?', 'Como organiza atendimento, vendas e clientes hoje?', 'Qual processo gera mais retrabalho?', 'Qual orçamento e prazo fariam sentido para resolver esse problema?'],
    phases: ['Entrevista e validação do processo', 'Protótipo e confirmação de escopo', 'Desenvolvimento e testes', 'Implantação e acompanhamento'],
    assumptions: ['Sugestão por regras locais, sem análise por IA.', 'Horas e necessidades são hipóteses para qualificação, não diagnóstico confirmado.', 'Infraestrutura, licenças e integrações de terceiros não estão incluídas nos custos.'],
    maintenanceHours: 3, mode: 'local', detailed: false, createdAt: timestamp(),
  };
}

export function scoreLead(lead: Lead, settings: Settings) {
  const analysis = lead.analysis ?? localAnalysis(lead);
  const price = estimate(analysis, settings);
  const reasons: { label: string; points: number }[] = [
    { label: 'Margem estimada de implantação (hipótese)', points: Math.min(25, Math.round(price.grossMargin / 200)) },
    { label: 'Recorrência potencial (hipótese)', points: Math.min(15, Math.round((price.monthly - price.monthlyCost) / 20)) },
    { label: 'Contato comercial disponível', points: lead.phone ? 15 : 0 },
    { label: 'Site informado para investigar a operação', points: lead.website ? 10 : 0 },
    { label: 'Acesso ao decisor', points: lead.ownerAccess === 'confirmed' ? 20 : lead.brand ? 0 : 7 },
    { label: 'Menor esforço inicial estimado', points: price.hours <= 80 ? 10 : price.hours <= 160 ? 5 : 0 },
    { label: 'Endereço disponível para visita', points: lead.address ? 5 : 0 },
  ];
  const fields = [!!lead.phone, !!lead.website, !!lead.address, !!lead.hours, lead.ownerAccess === 'confirmed'];
  const confidence = fields.filter(Boolean).length >= 4 ? 'Maior' : fields.filter(Boolean).length >= 2 ? 'Moderada' : 'Baixa';
  return { value: reasons.reduce((n, r) => n + r.points, 0), reasons, confidence, version: '1.0.0' };
}

export function rankLeads(leads: Lead[], settings: Settings): Lead[] {
  const manual = { high: 1, auto: 0, low: -1 };
  return [...leads].sort((a, b) => manual[b.priority] - manual[a.priority] || scoreLead(b, settings).value - scoreLead(a, settings).value || a.distance - b.distance || a.id.localeCompare(b.id));
}

export function sameBusiness(a: Lead, b: Lead): boolean {
  if (a.id === b.id) return true;
  const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return normalize(a.name) === normalize(b.name) && distanceKm(a.point, b.point) < 0.05 && !!a.phone && !!b.phone && normalize(a.phone) === normalize(b.phone);
}

export function mergeDiscovery(existing: Lead[], incoming: Lead[]): Lead[] {
  const merged = [...existing];
  for (const lead of incoming) {
    const index = merged.findIndex(old => sameBusiness(old, lead));
    const old = merged[index];
    if (old) {
      merged[index] = { ...lead, id: old.id, saved: old.saved, status: old.status, notes: old.notes, history: old.history, ownerAccess: old.ownerAccess, ownerInfo: old.ownerInfo, priority: old.priority, lossReason: old.lossReason, analysis: old.analysis ?? lead.analysis, proposal: old.proposal, photo: old.photo ?? lead.photo };
    } else merged.push(lead);
  }
  return merged;
}

export function draftProposal(lead: Lead, settings: Settings): Proposal {
  const analysis = lead.analysis ?? localAnalysis(lead);
  const values = estimate(analysis, settings);
  return { title: `Proposta de solução para ${lead.name}`, scope: `${analysis.solution}\n\n${analysis.features.map(f => `• ${f.name}: ${f.benefit}`).join('\n')}\n\nEtapas:\n${analysis.phases.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\nPrazo preliminar: ${Math.ceil(values.hours / 30)} a ${Math.ceil(values.hours / 20)} semanas, sujeito à validação de escopo e disponibilidade.`, setup: values.setup, monthly: values.monthly, terms: '50% na contratação e 50% na entrega, sujeito à negociação. Custos de infraestrutura e serviços de terceiros serão definidos separadamente. Escopo e prazo dependem de validação conjunta.', validityDays: 15 };
}

export const money = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
export function parseAmount(value: string): number {
  const normalized = value.trim().replace(/\s|R\$/g, '');
  if (!normalized) return NaN;
  if (/^\d{1,3}(\.\d{3})+(,\d{1,2})?$/.test(normalized)) return Number(normalized.replace(/\./g, '').replace(',', '.'));
  if (!/^\d+([.,]\d{1,2})?$/.test(normalized)) return NaN;
  return Number(normalized.replace(',', '.'));
}
