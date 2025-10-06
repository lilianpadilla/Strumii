"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { Capacitor } from "@capacitor/core";

export function MobileStatusBar() {
  const { resolvedTheme } = useTheme(); // 'light' | 'dark' | undefined

  useEffect(() => {
    if (!resolvedTheme) return;
    if (!Capacitor.isNativePlatform()) return;

    (async () => {
      const { StatusBar, Style } = await import("@capacitor/status-bar");

      // Don’t let the webview sit under the status bar
      await StatusBar.setOverlaysWebView({ overlay: false });

      // Map theme -> icon/text color:
      //  - dark theme => light icons
      //  - light theme => dark icons
      if (resolvedTheme === 'dark') {
        await StatusBar.setBackgroundColor({ color: "#000000" });
        await StatusBar.setStyle({ style: Style.Dark});
      } else {
        await StatusBar.setBackgroundColor({ color: "#ffffff" });
        await StatusBar.setStyle({ style: Style.Light });
      }

    })();
  }, [resolvedTheme]);

  // Only return this for Android, iOS handles this automatically
  if (Capacitor.getPlatform() !== 'android') {
    return null;
  }
  return (
    <div className="pt-6">
    </div>
  );
}
