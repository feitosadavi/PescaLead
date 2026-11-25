import React, { useEffect, useState } from 'react';
import { Linking, ScrollView, Switch, Text, View } from 'react-native';
import { PescaApp } from '../../state/usePescaLead';
import { SettingsSchema, localDate } from '../../domain/models';
import { parseAmount } from '../../domain/prospecting';
import { createBackup, restoreBackup } from '../../domain/backup';
import { availableModels } from '../../integrations/ai';
import { exportBackup, importBackupFile, keyStore } from '../../integrations/device';
import { publicHttps } from '../../integrations/http';
import { Badge, Body, Button, Card, Chip, Field, Heading, Label, styles } from '../../components/ui';
import { colors as c } from '../../theme';

export function SettingsScreen({ app }: { app: PescaApp }) {
  const initial = app.state.settings;
  const [form, setForm] = useState(initial);
  const [key, setKey] = useState('');
  const [rate, setRate] = useState(String(initial.hourlyRate));
  const [margin, setMargin] = useState(String(initial.margin));
  const [limit, setLimit] = useState(String(initial.resultLimit));
  const [daily, setDaily] = useState(String(initial.dailyAiLimit));
  const [models, setModels] = useState<{ id: string; name: string }[]>([]);
  const [backup, setBackup] = useState<{ raw: string; count: number }>();
  useEffect(() => { keyStore.get().then(setKey).catch(app.notify); }, []);
  const save = () => void app.perform('Salvando ajustes…', async () => {
    const parsed = SettingsSchema.safeParse({ ...form, hourlyRate: parseAmount(rate), margin: parseAmount(margin), resultLimit: Number(limit), dailyAiLimit: Number(daily) });
    if (!parsed.success) throw new Error('Confira quantidade (1–50), custo/hora (1–10.000), margem (0–90%) e limite diário (1–100).');
    if (!publicHttps(form.photonUrl) || !publicHttps(form.overpassUrl)) throw new Error('Os serviços devem usar endereços HTTPS públicos.');
    if (form.aiEnabled && (!key.trim() || !form.model)) throw new Error('Para habilitar IA, informe a chave e selecione um modelo.');
    await app.saveSettings(parsed.data, key);
  });
  return <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled"><View style={{ gap: 8 }}><Text style={{ color: c.teal, fontSize: 10, letterSpacing: 2, fontWeight: '700' }}>DO SEU JEITO</Text><Heading>Ajuste sua pescaria</Heading><Body muted>Seus dados e parâmetros ficam neste dispositivo.</Body></View>
    <Card><Heading>Busca e seleção</Heading><Field label="Quantidade de oportunidades (1–50)" value={limit} onChangeText={setLimit} keyboardType="number-pad" /><View style={styles.row}><View style={{ flex: 1, gap: 5 }}><Label>Priorizar negócios independentes</Label><Body muted>Excluir estabelecimentos com marca de rede informada na fonte. Acesso ao proprietário ainda precisa ser confirmado.</Body></View><Switch accessibilityLabel="Priorizar negócios independentes" value={form.excludeChains} onValueChange={excludeChains => setForm({ ...form, excludeChains })} trackColor={{ true: c.teal }} /></View></Card>
    <Card><Heading>Sua operação comercial</Heading><Field label="Nome do prestador / empresa" placeholder="Como deve aparecer na proposta?" value={form.providerName} onChangeText={providerName => setForm({ ...form, providerName })} /><Field label="Seu contato na proposta" value={form.providerContact} onChangeText={providerContact => setForm({ ...form, providerContact })} /><Field label="Custo da hora de trabalho (R$)" value={rate} onChangeText={setRate} keyboardType="decimal-pad" /><Field label="Margem bruta desejada (%)" value={margin} onChangeText={setMargin} keyboardType="decimal-pad" /><Body muted>Preço sugerido = custo estimado ÷ (1 − margem). Os valores iniciais são parâmetros de partida editáveis. Infraestrutura e licenças são cobradas à parte.</Body></Card>
    <Card><View style={{ ...styles.row, justifyContent: 'space-between' }}><Heading>Inteligência artificial</Heading><Badge text="Opcional" /></View><Body muted>Sem chave, o app funciona com hipóteses por regras locais. Com IA habilitada, cada lead selecionado poderá gerar uma chamada. Use uma chave de um projeto com plano gratuito e confira as cotas do provedor; o app não consegue verificar sua modalidade de cobrança.</Body><Field label="Chave da API Gemini" value={key} onChangeText={setKey} secureTextEntry autoCapitalize="none" autoCorrect={false} placeholder="Sua chave pessoal" /><Button title="Consultar modelos disponíveis" icon="refresh-outline" variant="secondary" disabled={!!app.busy || !key.trim()} onPress={() => void app.perform('Consultando modelos…', async () => { const found = await availableModels(key); setModels(found); if (!found.length) throw new Error('Não foram encontrados modelos de texto compatíveis para esta chave.'); })} />
      {models.map(m => <Chip key={m.id} title={m.name} selected={form.model === m.id} onPress={() => setForm({ ...form, model: m.id })} />)}{form.model ? <Body>Modelo selecionado: {form.model}</Body> : <Body muted>Nenhum modelo selecionado.</Body>}
      <Field label="Limite diário local de chamadas IA (1–100)" value={daily} onChangeText={setDaily} keyboardType="number-pad" /><Body muted>{app.state.aiUsage.date === localDate() ? app.state.aiUsage.count : 0} chamadas iniciadas hoje neste dispositivo. Falhas também contam para o limite local.</Body>
      <View style={styles.row}><View style={{ flex: 1 }}><Label>Habilitar IA com minha chave e cotas</Label></View><Switch accessibilityLabel="Habilitar IA com minha chave e cotas" value={form.aiEnabled} onValueChange={aiEnabled => setForm({ ...form, aiEnabled })} trackColor={{ true: c.teal }} /></View><Text style={{ fontSize: 10, lineHeight: 17, color: c.muted }}>No Android, a chave usa armazenamento protegido do sistema e não entra no backup. No navegador, fica apenas na memória desta sessão. Evidências públicas são enviadas à API; notas privadas ficam no dispositivo. O plano gratuito pode utilizar conteúdo para melhoria dos serviços, conforme as condições do provedor.</Text>
      <Button title="Abrir Google AI Studio" icon="open-outline" variant="ghost" onPress={() => void Linking.openURL('https://aistudio.google.com/apikey').catch(app.notify)} />
    </Card>
    <Card><Heading>Fontes de dados</Heading><Field label="Servidor Photon (geocodificação)" value={form.photonUrl} onChangeText={photonUrl => setForm({ ...form, photonUrl })} autoCapitalize="none" /><Field label="Servidor Overpass (estabelecimentos)" value={form.overpassUrl} onChangeText={overpassUrl => setForm({ ...form, overpassUrl })} autoCapitalize="none" /><Body muted>Servidores públicos têm limites e disponibilidade variável. Buscas são iniciadas por você, sem monitoramento em segundo plano. A cobertura de imagens, contatos e avaliações varia por fonte.</Body><Text style={{ color: c.teal, fontSize: 11 }} onPress={() => void Linking.openURL('https://www.openstreetmap.org/copyright').catch(app.notify)}>© Colaboradores do OpenStreetMap · Licença ODbL ↗</Text></Card>
    <Button title="Salvar ajustes" icon="checkmark-outline" onPress={save} disabled={!!app.busy} />
    <Card><Heading>Sua carteira, com você</Heading><Body muted>Exporte leads salvos, notas, histórico e propostas. Guarde o arquivo com cuidado: ele contém seus dados comerciais. Chave da IA não é exportada.</Body><Button title="Exportar backup da carteira" icon="download-outline" variant="secondary" disabled={!!app.busy} onPress={() => void app.perform('Preparando backup…', () => exportBackup(createBackup(app.state)))} /><Button title="Selecionar backup para importar" icon="cloud-upload-outline" variant="secondary" disabled={!!app.busy} onPress={() => void app.perform('Lendo backup…', async () => { const raw = await importBackupFile(); if (raw) { const parsed = restoreBackup(raw); setBackup({ raw, count: parsed.leads.length }); } })} />
      {backup && <View style={{ gap: 12, backgroundColor: c.soft, padding: 14, borderRadius: 10 }}><Body>Arquivo válido com {backup.count} leads. A importação adiciona somente identificadores novos, preserva seus leads existentes e mantém seus ajustes atuais.</Body><Button title="Confirmar importação" disabled={!!app.busy} onPress={() => void app.perform('Importando…', async () => { await app.importState(backup.raw); setBackup(undefined); })} /><Button title="Cancelar importação" variant="ghost" onPress={() => setBackup(undefined)} /></View>}
    </Card><Text style={{ textAlign: 'center', color: c.muted, fontSize: 10 }}>PescaLead 1.0 · Uso pessoal · Feito para bons negócios.</Text>
  </ScrollView>;
}
