import type { Metadata } from "next";
import "./globals.css";
import AppShell from "../../components/AppShell";



export const metadata: Metadata = {
  title: "Sabrang",
  description: "A cosmic carnival themed website",
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
      <body className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
