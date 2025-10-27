import type { CapacitorConfig } from '@capacitor/cli';

// For local dev, point to your machine's LAN IP (not localhost)
// e.g. http://192.168.1.50:3000
const devUrl = process.env.CAP_SERVER_URL;

const config: CapacitorConfig = {
  appId: 'com.strumii.app',
  appName: 'Strumii',
  webDir: 'public',
  server: devUrl
    ? {
        url: devUrl,
        cleartext: true,
        allowNavigation: ["*"]
      }
    : undefined,
};

export default config;
