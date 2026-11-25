import React, { useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { usePescaLead } from './src/state/usePescaLead';
import { SearchScreen } from './src/features/search/SearchScreen';
import { LeadListScreen } from './src/features/opportunities/LeadListScreen';
import { LeadDetail } from './src/features/leads/LeadDetail';
import { SettingsScreen } from './src/features/settings/SettingsScreen';
import { Body, Button, Icon, IconName } from './src/components/ui';
import { colors as c } from './src/theme';

type Tab = 'Sonar' | 'Oportunidades' | 'Carteira' | 'Ajustes';
const tabs: { label: Tab; icon: IconName; active: IconName }[] = [{ label: 'Sonar', icon: 'radio-outline', active: 'radio' }, { label: 'Oportunidades', icon: 'compass-outline', active: 'compass' }, { label: 'Carteira', icon: 'bookmark-outline', active: 'bookmark' }, { label: 'Ajustes', icon: 'options-outline', active: 'options' }];

export default function App() { return <SafeAreaProvider><PescaLead /></SafeAreaProvider>; }

function PescaLead() {
  const app = usePescaLead();
  const [fontsLoaded, fontError] = useFonts(Ionicons.font);
  const [tab, setTab] = useState<Tab>('Sonar');
  const [selected, setSelected] = useState<string>();
  if (app.loadError || fontError) return <SafeAreaView style={s.loading}><Text style={s.brand}>PescaLead</Text><Body>{app.loadError || 'Não foi possível carregar os ícones do aplicativo.'}</Body><Body muted>Os dados locais foram preservados. Feche e abra o app ou revise a instalação.</Body></SafeAreaView>;
  if (!app.ready || !fontsLoaded) return <View style={s.loading}><ActivityIndicator color={c.teal} /><Text style={s.brand}>PescaLead</Text></View>;
  return <SafeAreaView style={{ flex: 1, backgroundColor: '#EDF1EA' }}><StatusBar style="dark" /><View style={s.shell}>
    <View style={s.header}><View style={{ flexDirection: 'row', gap: 9, alignItems: 'center' }}><View style={s.logo}><Icon name="fish" color="#E3EED7" size={22} /></View><Text style={s.brand}>Pesca<Text style={{ color: c.teal }}>Lead</Text></Text></View><View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}><View style={{ backgroundColor: c.teal, width: 5, height: 5, borderRadius: 3 }} /><Text style={{ color: c.muted, fontSize: 9, letterSpacing: 0.6 }}>SEU SONAR COMERCIAL</Text></View></View>
    {!!app.message && !selected && <Pressable accessibilityRole="button" accessibilityLabel="Fechar mensagem" onPress={() => app.setMessage('')} style={s.message}><Text style={{ color: c.red, fontSize: 12, lineHeight: 18 }}>{app.message} · Fechar</Text></Pressable>}
    <View style={{ flex: 1 }}>
      {tab === 'Sonar' && <SearchScreen app={app} onResults={() => setTab('Oportunidades')} onSettings={() => setTab('Ajustes')} />}
      {tab === 'Oportunidades' && <LeadListScreen app={app} onOpen={setSelected} onSearch={() => setTab('Sonar')} />}
      {tab === 'Carteira' && <LeadListScreen app={app} saved onOpen={setSelected} onSearch={() => setTab('Sonar')} />}
      {tab === 'Ajustes' && <SettingsScreen app={app} />}
    </View>
    {!!app.busy && tab !== 'Sonar' && <View style={{ padding: 10, backgroundColor: c.mint, flexDirection: 'row', gap: 8, justifyContent: 'center' }}><ActivityIndicator color={c.teal} size="small" /><Text style={{ color: c.ink, fontSize: 12 }}>{app.busy}</Text></View>}
    <View style={s.nav}>{tabs.map(t => <Pressable key={t.label} accessibilityRole="tab" accessibilityLabel={t.label} accessibilityState={{ selected: t.label === tab }} onPress={() => setTab(t.label)} style={s.navItem}><View style={[s.navIcon, tab === t.label && { backgroundColor: c.mint }]}><Icon name={tab === t.label ? t.active : t.icon} size={21} color={tab === t.label ? c.teal : '#87968D'} /></View><Text style={{ color: tab === t.label ? c.teal : c.muted, fontSize: 10, fontWeight: tab === t.label ? '700' : '400' }}>{t.label}</Text></Pressable>)}</View>
    {selected && <LeadDetail key={selected} id={selected} app={app} onClose={() => setSelected(undefined)} />}
  </View></SafeAreaView>;
}

const s = StyleSheet.create({
  shell: { flex: 1, width: '100%', maxWidth: 560, alignSelf: 'center', backgroundColor: c.sand, ...(Platform.OS === 'web' ? { boxShadow: '0 0 70px #103F4210' } : {}) },
  header: { paddingHorizontal: 22, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: c.border, backgroundColor: c.sand },
  logo: { backgroundColor: c.ocean, width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  brand: { fontSize: 21, fontWeight: '800', letterSpacing: -0.9, color: c.ink },
  nav: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 9, paddingBottom: 10, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: c.border },
  navItem: { alignItems: 'center', gap: 5, flex: 1 },
  navIcon: { width: 49, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  message: { margin: 12, padding: 13, backgroundColor: '#FAE8DF', borderRadius: 10 },
  loading: { flex: 1, padding: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: c.sand, gap: 20 },
});
