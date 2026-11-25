import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';
import { File, Paths } from 'expo-file-system';
import { Lead, Point, Settings } from '../domain/models';
import { proposalHtml } from './proposal-html';

let webKey = '';
export const keyStore = {
  get: async () => Platform.OS === 'web' ? webKey : await SecureStore.getItemAsync('pescalead.gemini') ?? '',
  set: async (value: string) => { if (Platform.OS === 'web') webKey = value; else if (value) await SecureStore.setItemAsync('pescalead.gemini', value); else await SecureStore.deleteItemAsync('pescalead.gemini'); },
};

export async function currentLocation(): Promise<Point> {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (permission.status !== 'granted') throw new Error('Localização não autorizada. Você pode digitar um endereço.');
  const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  return { latitude: location.coords.latitude, longitude: location.coords.longitude };
}

export async function shareProposal(lead: Lead, settings: Settings) {
  const html = proposalHtml(lead, settings);
  if (Platform.OS === 'web') {
    const preview = window.open('', '_blank');
    if (!preview) throw new Error('Permita abrir a janela da proposta para imprimir ou salvar em PDF.');
    preview.opener = null;
    preview.document.write(html);
    preview.document.close();
    preview.focus();
    preview.print();
    return;
  }
  const file = await Print.printToFileAsync({ html });
  if (!await Sharing.isAvailableAsync()) { await Print.printAsync({ uri: file.uri }); return; }
  await Sharing.shareAsync(file.uri, { mimeType: 'application/pdf', dialogTitle: 'Compartilhar proposta PescaLead', UTI: '.pdf' });
}

export async function exportBackup(raw: string) {
  if (Platform.OS === 'web') {
    const url = URL.createObjectURL(new Blob([raw], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = `pescalead-backup-${Date.now()}.json`; link.click(); URL.revokeObjectURL(url); return;
  }
  const file = new File(Paths.cache, `pescalead-backup-${Date.now()}.json`);
  file.write(raw);
  if (!await Sharing.isAvailableAsync()) throw new Error('Compartilhamento indisponível neste dispositivo.');
  await Sharing.shareAsync(file.uri, { mimeType: 'application/json', dialogTitle: 'Salvar backup PescaLead' });
}

export async function importBackupFile(): Promise<string | undefined> {
  const result = await DocumentPicker.getDocumentAsync({ type: ['application/json', 'text/plain'], copyToCacheDirectory: true });
  if (result.canceled || !result.assets[0]) return;
  const asset = result.assets[0];
  if ((asset.size ?? 0) > 10_000_000) throw new Error('Backup maior que 10 MB.');
  if (Platform.OS === 'web') return await (await fetch(asset.uri)).text();
  return new File(asset.uri).text();
}

export async function downloadPhoto(lead: Lead): Promise<string> {
  if (!lead.photo || new URL(lead.photo.url).hostname !== 'upload.wikimedia.org') throw new Error('Não há foto com origem suportada para download.');
  if (Platform.OS === 'web') throw new Error('O download local de fotos está disponível no APK Android.');
  const file = new File(Paths.document, `pescalead-${lead.id.replace(/[^a-zA-Z0-9]/g, '-')}.jpg`);
  if (file.exists) return file.uri;
  const result = await File.downloadFileAsync(lead.photo.url, file);
  return result.uri;
}
