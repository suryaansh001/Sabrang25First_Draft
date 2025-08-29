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
        {/* Preload custom fonts */}
        <link rel="preload" href="/Font/TAN_Nimbus/TAN-NIMBUS.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <VideoProvider>
          <AppShell>{children}</AppShell>
        </VideoProvider>
      </body>
    </html>
  );
}
