import type { Metadata } from "next";
import "./globals.css";
import AppShell from "../../components/AppShell";
import { VideoProvider } from "../../components/VideoContext";
import DesignedByStrip from "../../components/DesignedByStrip";

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
      </head>
      <body className="antialiased">
        <VideoProvider>
          <AppShell>{children}</AppShell>
          <DesignedByStrip />
        </VideoProvider>
      </body>
    </html>
  );
}
