import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PescaApp } from '../../state/usePescaLead';
import { AddressResult, findAddresses } from '../../integrations/discovery';
import { currentLocation } from '../../integrations/device';
import { Badge, Body, Button, Card, Chip, Field, Heading, Icon, Label, styles } from '../../components/ui';
import { colors as c } from '../../theme';

function Sonar() {
  return <View style={{ width: 168, height: 168, alignItems: 'center', justifyContent: 'center' }} accessibilityLabel="Ilustração de sonar">
    {[168, 124, 80].map(size => <View key={size} style={{ position: 'absolute', width: size, height: size, borderRadius: size / 2, borderWidth: 1, borderColor: '#72AF9E55' }} />)}
    <View style={{ position: 'absolute', height: 168, width: 1, backgroundColor: '#72AF9E33' }} /><View style={{ position: 'absolute', width: 168, height: 1, backgroundColor: '#72AF9E33' }} />
    <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: '#B8E3C8', alignItems: 'center', justifyContent: 'center' }}><Icon name="fish" color={c.ocean} size={25} /></View>
    <View style={{ position: 'absolute', top: 25, right: 29, width: 9, height: 9, borderRadius: 5, backgroundColor: '#EAAD83' }} /><View style={{ position: 'absolute', bottom: 28, left: 26, width: 6, height: 6, borderRadius: 3, backgroundColor: '#B8E3C8' }} />
  </View>;
}

export function SearchScreen({ app, onResults, onSettings }: { app: PescaApp; onResults: () => void; onSettings: () => void }) {
  const [address, setAddress] = useState('');
  const [origin, setOrigin] = useState<AddressResult>();
  const [matches, setMatches] = useState<AddressResult[]>([]);
  const [radius, setRadius] = useState(10);
  const [locating, setLocating] = useState(false);
  const settings = app.state.settings;
  const resolve = async (gps = false) => {
    setLocating(true);
    try {
      if (gps) { const point = await currentLocation(); setOrigin({ point, label: `Sua localização · ${point.latitude.toFixed(4)}, ${point.longitude.toFixed(4)}` }); setMatches([]); }
      else { const results = await findAddresses(address, settings.photonUrl); setMatches(results); if (!results.length) app.setMessage('Endereço não encontrado. Inclua cidade e estado.'); }
    } catch (error) { app.notify(error); } finally { setLocating(false); }
  };
  return <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
    <View style={{ gap: 7 }}><Text style={{ color: c.teal, fontSize: 10, fontWeight: '800', letterSpacing: 2 }}>SEU PRÓXIMO BOM NEGÓCIO</Text><Text style={{ fontSize: 30, lineHeight: 36, color: c.ink, fontWeight: '700', letterSpacing: -1 }}>{'Tem oportunidade\nna sua região.'}</Text><Body muted>Encontre negócios. Entenda o potencial. Faça a conexão.</Body></View>
    <LinearGradient colors={['#154D4D', '#0B3438']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 21, padding: 20, minHeight: 177, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' }}>
      <View style={{ flex: 1, gap: 13, zIndex: 1 }}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}><View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#B5DEC0' }} /><Text style={{ color: '#B5DEC0', fontSize: 9, fontWeight: '700', letterSpacing: 1.6 }}>SONAR DE OPORTUNIDADES</Text></View><Text style={{ color: '#F4F7EB', fontSize: 22, fontWeight: '600', lineHeight: 29 }}>{'Lance a busca.\nEncontre potencial.'}</Text><Text style={{ color: '#B0C7BE', fontSize: 11, lineHeight: 17 }}>{'Negócios locais, propostas\nfeitas para cada um.'}</Text></View><View style={{ marginRight: -37 }}><Sonar /></View>
    </LinearGradient>
    <Card><View style={styles.row}><Icon name="locate-outline" color={c.teal} /><Heading>Onde vamos pescar?</Heading></View><Field label="Endereço de partida" placeholder="Rua, bairro ou cidade" value={address} onChangeText={value => { setAddress(value); setOrigin(undefined); setMatches([]); }} onSubmitEditing={() => void resolve()} returnKeyType="search" />
      <View style={styles.row}><View style={{ flex: 1 }}><Button title="Buscar endereço" icon="search-outline" variant="secondary" onPress={() => void resolve()} loading={locating} disabled={!!app.busy} /></View><Button title="Usar GPS" icon="navigate-outline" variant="secondary" onPress={() => void resolve(true)} disabled={locating || !!app.busy} /></View>
      {matches.map((match, i) => <Pressable key={i} accessibilityRole="button" onPress={() => { setOrigin(match); setMatches([]); }} style={{ padding: 12, backgroundColor: c.soft, borderRadius: 9 }}><Body>{match.label}</Body></Pressable>)}
      {origin && <View style={{ padding: 12, backgroundColor: c.mint, borderRadius: 10, gap: 5 }}><Label>Origem selecionada</Label><Body>{origin.label}</Body></View>}
      <View style={{ height: 1, backgroundColor: c.border }} /><Label>Raio de busca</Label><View style={styles.wrap}>{[10, 20, 30, 40, 50].map(value => <Chip key={value} title={`${value} km`} selected={radius === value} onPress={() => setRadius(value)} />)}</View>
      <View style={{ ...styles.row, justifyContent: 'space-between' }}><Body muted>Seleção de até {settings.resultLimit} oportunidades</Body><Pressable accessibilityRole="button" onPress={onSettings}><Text style={{ color: c.teal, fontSize: 12, fontWeight: '700' }}>Ajustar</Text></Pressable></View>
      <Button title={app.busy || 'Lançar busca'} icon="radio-outline" disabled={!origin || locating} loading={!!app.busy} onPress={() => { if (origin) void app.search(origin.point, radius).then(count => { if (count !== undefined) onResults(); }); }} />
      <Text style={{ color: c.muted, textAlign: 'center', fontSize: 10, lineHeight: 16 }}>Distância em linha reta · Dados públicos do OpenStreetMap</Text>
    </Card>
    <View style={{ gap: 13 }}><Label>DA DESCOBERTA À PROPOSTA</Label>{[{ icon: 'compass-outline' as const, title: 'Encontre os negócios certos', text: 'Seleção por potencial comercial e acesso ao decisor.' }, { icon: 'sparkles-outline' as const, title: 'Transforme sinais em oportunidades', text: 'Hipóteses claras e soluções que você pode validar.' }, { icon: 'document-text-outline' as const, title: 'Chegue com uma proposta', text: 'Escopo e cobrança personalizáveis, prontos para PDF.' }].map((item, i) => <View key={item.title} style={{ ...styles.row, alignItems: 'flex-start', gap: 14 }}><View style={{ width: 35, height: 35, backgroundColor: c.soft, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}><Icon name={item.icon} color={c.teal} size={18} /></View><View style={{ flex: 1, gap: 3 }}><Label>{item.title}</Label><Body muted>{item.text}</Body></View><Text style={{ fontSize: 10, color: '#9DAEA4' }}>0{i + 1}</Text></View>)}</View>
    <View style={{ ...styles.row, justifyContent: 'center' }}><Badge text={settings.aiEnabled ? 'IA habilitada' : 'Modo local · IA opcional'} /><Text style={{ fontSize: 10, color: c.muted }}>Feito para prospectar com intenção.</Text></View>
  </ScrollView>;
}
