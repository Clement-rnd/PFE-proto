import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />

        {/* PWA — Android / Chrome */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ff5a7d" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* PWA — iOS Safari */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="NAYA" />
        <link rel="apple-touch-icon" href="/icon.png" />

        <style>{`
          html, body, #root { background-color: #FDF7F9; }
          html, body, #root { height: 100%; height: 100dvh; }
          input, select, textarea { font-size: 16px !important; }
        `}</style>

        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
