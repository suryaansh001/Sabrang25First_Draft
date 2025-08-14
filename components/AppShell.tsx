"use client";

import { usePathname } from "next/navigation";
import Background from "./Background";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SplashCursor from "./SplashCursor";
import React, { useEffect, useState } from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hideChrome = pathname === "/" || pathname?.startsWith("/home") || pathname === "/Team" || pathname === "/Gallery" || pathname === "/Sponsors/why-sponsor-us";

  return (
    <>
      <SplashCursor />
      <Background />
      <div className="relative z-10">
        {mounted && !hideChrome && <Navbar />}
        <main>{children}</main>
      </div>
      {mounted && !hideChrome && <Footer />}
    </>
  );
}

