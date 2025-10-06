import type { CapacitorConfig } from '@capacitor/cli';

// For local dev, point to your machine's LAN IP (not localhost)
// e.g. http://192.168.1.50:3000
const devUrl = process.env.CAP_SERVER_URL;

const config: CapacitorConfig = {
  appId: 'com.placeholder.app',
  appName: 'PlaceHolder',
  webDir: 'public',
  server: "http://192.168.1.199:3000"
    ? {
        url: "http://192.168.1.199:3000",           // ex: "http://192.168.1.50:3000"
        cleartext: true,       // needed for http in dev (Android); harmless on iOS
        allowNavigation: ["*"] // or ["your-domain.com", "127.0.0.1", "192.168.1.0/24"]
      }
    : undefined,
};

export default config;
