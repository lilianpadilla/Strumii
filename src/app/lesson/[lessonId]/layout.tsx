"use client";
import Script from "next/script";

export default function ChordDiagramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}

      {/* Load Essentia core API first */}
      <Script
        src="https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-core.js"
        strategy="afterInteractive"
        onLoad={() => console.log("✅ Essentia.js core loaded")}
      />

      {/* Then load the WASM backend */}
      <Script
        src="https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia-wasm.web.js"
        strategy="afterInteractive"
        onLoad={() => console.log("✅ Essentia WASM backend loaded")}
      />
    </>
  );
}
