import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Lead, STATUSES } from '../../domain/models';
import { estimate, localAnalysis, money, rankLeads, scoreLead } from '../../domain/prospecting';
import { PescaApp } from '../../state/usePescaLead';
import { Badge, Body, Button, Card, Chip, Empty, Field, Heading, Icon, styles } from '../../components/ui';
import { colors as c } from '../../theme';

export function LeadListScreen({ app, saved = false, onOpen, onSearch }: { app: PescaApp; saved?: boolean; onOpen: (id: string) => void; onSearch: () => void }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Todos');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [maxDistance, setMaxDistance] = useState(0);
  const [minScore, setMinScore] = useState(0);
  const [confidence, setConfidence] = useState('Qualquer');
  const leads = useMemo(() => rankLeads((saved ? app.state.leads.filter(l => l.saved) : app.opportunities).filter(l => {
    const score = scoreLead(l, app.state.settings);
    return `${l.name} ${l.category}`.toLowerCase().includes(query.toLowerCase()) && (status === 'Todos' || l.status === status) && (!maxDistance || l.distance <= maxDistance) && score.value >= minScore && (confidence === 'Qualquer' || score.confidence === confidence);
  }), app.state.settings), [app.state, app.opportunities, saved, query, status, maxDistance, minScore, confidence]);
  const renderLead = ({ item: lead, index }: { item: Lead; index: number }) => {
    const score = scoreLead(lead, app.state.settings), price = estimate(lead.analysis ?? localAnalysis(lead), app.state.settings);
    return <Pressable accessibilityRole="button" accessibilityLabel={`Abrir ${lead.name}`} onPress={() => onOpen(lead.id)} style={{ marginBottom: 13 }}><Card>
      <View style={{ ...styles.row, justifyContent: 'space-between' }}><Badge text={lead.category} /><Text style={{ color: c.muted, fontSize: 11 }}>{lead.distance.toFixed(1)} km</Text></View>
      <View style={{ ...styles.row, alignItems: 'flex-start' }}><View style={{ flex: 1, gap: 5 }}><Text style={{ color: c.ink, fontSize: 19, fontWeight: '700', letterSpacing: -0.5 }}>{lead.name}</Text><Text style={{ fontSize: 11, color: c.muted, lineHeight: 17 }} numberOfLines={2}>{lead.address || 'Endereço completo não disponível'}</Text></View><View style={{ alignItems: 'center', backgroundColor: c.soft, padding: 9, borderRadius: 10, minWidth: 48 }}><Text style={{ color: c.teal, fontSize: 21, fontWeight: '700' }}>{score.value}</Text><Text style={{ color: c.muted, fontSize: 8 }}>PRIORIDADE</Text></View></View>
      <View style={{ height: 1, backgroundColor: c.border }} /><View style={{ ...styles.row, justifyContent: 'space-between' }}><View style={{ gap: 3 }}><Text style={{ fontSize: 9, color: c.muted }}>IMPLANTAÇÃO ESTIMADA</Text><Text style={{ color: c.ink, fontWeight: '700', fontSize: 16 }}>{money(price.setup)}</Text></View><Icon name="arrow-forward-outline" color={c.teal} /></View>
      <View style={styles.wrap}><Badge text={lead.analysis?.mode === 'ai' ? 'Análise por IA' : 'Hipótese local'} tone="sand" />{lead.saved && <Badge text={lead.status} tone="coral" />}<Badge text={`Evidência ${score.confidence.toLowerCase()}`} tone="sand" /></View>
    </Card></Pressable>;
  };
  return <FlatList data={leads} keyExtractor={item => item.id} renderItem={renderLead} contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled" ListHeaderComponent={<View style={{ gap: 17, marginBottom: 20 }}><View style={{ gap: 7 }}><Text style={{ color: c.teal, fontSize: 10, letterSpacing: 2, fontWeight: '700' }}>{saved ? 'RELACIONAMENTOS QUE AVANÇAM' : 'O QUE O SONAR ENCONTROU'}</Text><Heading>{saved ? 'Sua carteira' : 'Boas oportunidades'}</Heading><Body muted>{leads.length} {leads.length === 1 ? 'negócio' : 'negócios'} · Ordem por prioridade comercial estimada</Body></View><Field label="Filtrar por nome ou segmento" placeholder="Qual negócio você procura?" value={query} onChangeText={setQuery} />{saved && <View style={styles.wrap}>{['Todos', ...STATUSES].map(s => <Chip title={s} key={s} selected={s === status} onPress={() => setStatus(s)} />)}</View>}
    <Button title={filtersOpen ? 'Recolher filtros' : 'Distância, prioridade e evidências'} icon="options-outline" variant="secondary" small onPress={() => setFiltersOpen(!filtersOpen)} />
    {filtersOpen && <Card><Body>Distância máxima da origem da busca</Body><View style={styles.wrap}>{[0, 5, 10, 20, 30, 40, 50].map(d => <Chip key={d} title={d ? `Até ${d} km` : 'Qualquer distância'} selected={d === maxDistance} onPress={() => setMaxDistance(d)} />)}</View><Body>Prioridade mínima</Body><View style={styles.wrap}>{[0, 50, 70].map(s => <Chip key={s} title={s ? `${s}+ pontos` : 'Qualquer pontuação'} selected={s === minScore} onPress={() => setMinScore(s)} />)}</View><Body>Confiança nas evidências</Body><View style={styles.wrap}>{['Qualquer', 'Baixa', 'Moderada', 'Maior'].map(s => <Chip key={s} title={s} selected={s === confidence} onPress={() => setConfidence(s)} />)}</View><Button title="Limpar filtros" variant="ghost" small onPress={() => { setQuery(''); setStatus('Todos'); setMaxDistance(0); setMinScore(0); setConfidence('Qualquer'); }} /></Card>}
    {!saved && !!app.coverage && <Body muted>{app.coverage}</Body>}<Text style={{ color: c.muted, fontSize: 10, lineHeight: 16 }}>Pontuação não representa probabilidade de fechamento. Valores são hipóteses revisáveis. © Colaboradores do OpenStreetMap · ODbL.</Text></View>} ListEmptyComponent={<Empty title={saved ? 'Sua carteira começa aqui' : 'Um bom negócio começa com uma busca'} text={query || status !== 'Todos' || maxDistance || minScore || confidence !== 'Qualquer' ? 'Nenhum lead corresponde a esses filtros.' : saved ? 'Salve oportunidades para acompanhar conversas, propostas e próximos passos.' : 'Escolha uma região no Sonar para encontrar oportunidades reais.'}><Button title="Ir para o Sonar" icon="radio-outline" onPress={onSearch} /></Empty>} />;
}
