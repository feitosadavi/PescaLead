import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'PescaLead',
  slug: 'pescalead',
  version: '1.0.2',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  scheme: 'pescalead',
  android: {
    package: 'com.pescalead.app',
    versionCode: 3,
    permissions: ['ACCESS_COARSE_LOCATION', 'ACCESS_FINE_LOCATION'],
    blockedPermissions: [
      'android.permission.RECORD_AUDIO',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.SYSTEM_ALERT_WINDOW',
      'android.permission.USE_BIOMETRIC',
      'android.permission.USE_FINGERPRINT',
      'android.permission.VIBRATE',
    ],
  },
  plugins: [
    ['expo-location', { locationWhenInUsePermission: 'Permitir que o PescaLead encontre negócios próximos de você.' }],
    'expo-secure-store',
    'expo-font',
    'expo-sharing',
    'expo-status-bar',
    './plugins/withBranding',
  ],
  web: { bundler: 'metro', name: 'PescaLead', shortName: 'PescaLead', themeColor: '#103F42' },
};

export default config;
