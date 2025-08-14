"use client";

import { usePathname } from "next/navigation";
import Background from "./Background";
import Footer from "./Footer";
import SplashCursor from "./SplashCursor";
import SidebarDock from "./SidebarDock";
import Logo from "./Logo";
import React, { useEffect, useState } from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hideChrome = pathname === "/" || pathname?.startsWith("/home") || pathname === "/Login" || pathname === "/Signup" || pathname === "/Events" || pathname === "/Team" || pathname === "/FAQ" || pathname === "/Contact" || pathname === "/About" || pathname === "/Gallery" || pathname === "/Sponsors/why-sponsor-us";
  const hideChrome = pathname === "/" || pathname?.startsWith("/home") || pathname === "/Login" || pathname === "/Signup" || pathname === "/Events" || pathname === "/FAQ" || pathname === "/Contact" || pathname === "/About" || pathname === "/Team";

  return (
    <>
      <SplashCursor />
      <Background />
      <div className="relative z-10">
        {mounted && !hideChrome && <Logo />}
        <main>{children}</main>
        {!hideChrome && <SidebarDock />}
      </div>
      {mounted && !hideChrome && <Footer />}
    </>
  );
}

