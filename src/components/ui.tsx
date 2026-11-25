import React, { ComponentProps, ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors as c } from '../theme';

export type IconName = ComponentProps<typeof Ionicons>['name'];
export const Icon = ({ name, size = 20, color = c.ink }: { name: IconName; size?: number; color?: string }) => <Ionicons name={name} size={size} color={color} />;
export const Label = ({ children }: { children: ReactNode }) => <Text style={styles.label}>{children}</Text>;
export const Body = ({ children, muted = false }: { children: ReactNode; muted?: boolean }) => <Text style={[styles.body, muted && { color: c.muted }]}>{children}</Text>;
export const Heading = ({ children }: { children: ReactNode }) => <Text style={styles.heading}>{children}</Text>;
export const Card = ({ children, style }: { children: ReactNode; style?: ViewStyle }) => <View style={[styles.card, style]}>{children}</View>;

export function Button({ title, onPress, icon, variant = 'primary', disabled = false, loading = false, small = false }: { title: string; onPress: () => void; icon?: IconName; variant?: 'primary' | 'secondary' | 'ghost' | 'coral'; disabled?: boolean; loading?: boolean; small?: boolean }) {
  const foreground = variant === 'primary' || variant === 'coral' ? c.white : c.ink;
  return <Pressable accessibilityRole="button" accessibilityLabel={title} disabled={disabled || loading} onPress={onPress} style={({ pressed }) => [styles.button, variant === 'secondary' && styles.secondary, variant === 'ghost' && styles.ghost, variant === 'coral' && { backgroundColor: c.coral }, small && { minHeight: 38, paddingHorizontal: 12 }, (disabled || loading) && { opacity: 0.5 }, pressed && { opacity: 0.78 }]}>
    {loading ? <ActivityIndicator color={foreground} size="small" /> : icon ? <Icon name={icon} color={foreground} size={small ? 16 : 19} /> : null}
    <Text style={{ color: foreground, fontSize: small ? 12 : 14, fontWeight: '700' }}>{title}</Text>
  </Pressable>;
}

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return <View style={{ gap: 8 }}><Label>{label}</Label><TextInput accessibilityLabel={label} placeholderTextColor="#8A9B94" {...props} style={[styles.input, props.multiline && { minHeight: 100, textAlignVertical: 'top' }, props.style]} /></View>;
}

export function Chip({ title, selected, onPress }: { title: string; selected: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={[styles.chip, selected && { backgroundColor: c.ocean, borderColor: c.ocean }]}><Text style={{ fontSize: 12, color: selected ? c.white : c.muted, fontWeight: selected ? '700' : '500' }}>{title}</Text></Pressable>;
}

export function Empty({ icon = 'fish-outline', title, text, children }: { icon?: IconName; title: string; text: string; children?: ReactNode }) {
  return <View style={{ alignItems: 'center', padding: 28, gap: 16 }}><View style={styles.emptyIcon}><Icon name={icon} size={35} color={c.teal} /></View><Heading>{title}</Heading><Text style={[styles.body, { color: c.muted, textAlign: 'center', maxWidth: 400 }]}>{text}</Text>{children}</View>;
}

export function Badge({ text, tone = 'mint' }: { text: string; tone?: 'mint' | 'sand' | 'coral' }) {
  return <View style={{ backgroundColor: tone === 'mint' ? c.mint : tone === 'coral' ? '#FAE8DF' : c.soft, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 7, alignSelf: 'flex-start' }}><Text style={{ color: tone === 'coral' ? '#A75538' : c.teal, fontSize: 10, fontWeight: '700' }}>{text}</Text></View>;
}

export const styles = StyleSheet.create({
  page: { padding: 22, gap: 24, paddingBottom: 32 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  heading: { color: c.ink, fontSize: 21, fontWeight: '700', letterSpacing: -0.5 },
  body: { color: c.ink, fontSize: 13, lineHeight: 21 },
  label: { color: c.ink, fontSize: 12, fontWeight: '700', letterSpacing: 0.1 },
  card: { backgroundColor: c.white, borderRadius: 19, borderWidth: 1, borderColor: c.border, padding: 20, gap: 16 },
  button: { backgroundColor: c.ocean, borderRadius: 11, minHeight: 49, paddingHorizontal: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  secondary: { backgroundColor: c.white, borderWidth: 1, borderColor: c.border },
  ghost: { backgroundColor: 'transparent' },
  input: { minHeight: 48, backgroundColor: '#FAFBF7', borderWidth: 1, borderColor: c.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, color: c.ink, fontSize: 14 },
  chip: { borderRadius: 9, paddingHorizontal: 13, paddingVertical: 11, borderWidth: 1, borderColor: c.border, backgroundColor: c.white },
  emptyIcon: { width: 76, height: 76, borderRadius: 38, backgroundColor: c.mint, alignItems: 'center', justifyContent: 'center' },
});
