import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hindmedicalhall.com',
  appName: 'hind-medical-hall-app',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
};

export default config;
