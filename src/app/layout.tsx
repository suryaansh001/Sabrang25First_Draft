import type { Metadata } from "next";
import "./globals.css";
import AppShell from "../../components/AppShell";
import { VideoProvider } from "../../components/VideoContext";
import DesignedByStrip from "../../components/DesignedByStrip";

export const metadata: Metadata = {
  metadataBase: new URL('https://sabrang.jklu.edu.in'),
  title: {
    default: "SABRANG'25 | Official Fest of JK Lakshmipat University",
    template: "%s | SABRANG'25"
  },
  description: "SABRANG'25 is JK Lakshmipat University's annual cultural and technical fest in Jaipur featuring pro-shows, competitions, workshops, and more.",
  keywords: [
    'Sabrang', 'SABRANG 2025', 'JK Lakshmipat University', 'JKLU', 'Jaipur fest',
    'college fest', 'cultural fest', 'technical fest', 'proshow', 'concert',
    'competitions', 'workshops', 'Jaipur events'
  ],
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  openGraph: {
    type: 'website',
    url: 'https://sabrang.jklu.edu.in/',
    title: "SABRANG'25 | Official Fest of JK Lakshmipat University",
    description: "Experience Jaipur's most vibrant college fest with star-studded nights and thrilling competitions.",
    siteName: "Sabrang'25",
    images: [{ url: '/og/sabrang-og.jpg', width: 1200, height: 630, alt: "SABRANG'25" }]
  },
  twitter: {
    card: 'summary_large_image',
    title: "SABRANG'25 | Official Fest of JK Lakshmipat University",
    description: "JK Lakshmipat University's annual cultural and technical fest.",
    images: ['/og/sabrang-og.jpg']
  },
  alternates: {
    canonical: 'https://sabrang.jklu.edu.in/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: 'index, follow, max-image-preview:large'
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
          <DesignedByStrip />
        </VideoProvider>
      </body>
    </html>
  );
}
