import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.melio.app',
  appName: 'Melio',
  webDir: 'dist',
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    backgroundColor: '#ffffff',
    allowsLinkPreview: false,
    handleApplicationURL: false
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#ffffff'
  },
  server: {
    androidScheme: 'https',
    iosScheme: 'capacitor'
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
