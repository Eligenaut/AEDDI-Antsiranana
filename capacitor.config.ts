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
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '221609391832-8h09fts75kp9milp5p5scjg00r0297fg.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;