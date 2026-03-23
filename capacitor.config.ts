import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aeddi.app',
  appName: 'AEDDI',
  webDir: 'public',
  server: {
    url: 'https://aeddi-antsiranana.vercel.app',
    cleartext: false
  },
  plugins: {
    Browser: {
      presentationStyle: 'fullscreen',
    },
  },
};

export default config;