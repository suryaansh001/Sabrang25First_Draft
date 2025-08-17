import type { Metadata } from "next";
import "./globals.css";
import AppShell from "../../components/AppShell";
import { VideoProvider } from "../../components/VideoContext";

export const metadata: Metadata = {
  title: "Sabrang",
  description: "A modern event website",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        
        {/* Essential preloading for Spline */}
        <link rel="preload" href="https://prod.spline.design/3O0nwQNm6dcILIOA/scene.splinecode" as="fetch" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://prod.spline.design" />
        <link rel="preconnect" href="https://prod.spline.design" crossOrigin="anonymous" />
        
        {/* Simple preloading script */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Simple preloading - no complex logic
            fetch('https://prod.spline.design/3O0nwQNm6dcILIOA/scene.splinecode', {
              method: 'GET',
              mode: 'cors',
              cache: 'force-cache'
            }).then(res => res.arrayBuffer()).then(buffer => {
              try {
                localStorage.setItem('splineSceneCache', JSON.stringify(Array.from(new Uint8Array(buffer))));
              } catch (e) {}
            }).catch(() => {});
          `
        }} />
      </head>
      <body className="antialiased">
        <VideoProvider>
          <AppShell>{children}</AppShell>
        </VideoProvider>
      </body>
    </html>
  );
}
