"use client";

import { usePathname } from "next/navigation";
import Background from "./Background";
import Footer from "./Footer";
import SplashCursor from "./SplashCursor";
import SidebarDock from "./SidebarDock";
import Logo from "./Logo";
import React from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = pathname === "/" || pathname?.startsWith("/home") || pathname === "/Login" || pathname === "/Signup" || pathname === "/Events" || pathname === "/FAQ" || pathname === "/Contact" || pathname === "/About" || pathname === "/Team";

  return (
    <>
      <SplashCursor />
      <Background />
      <div className="relative z-10">
        {!hideChrome && <Logo />}
        <main>{children}</main>
        {!hideChrome && <SidebarDock />}
      </div>
      {!hideChrome && <Footer />}
    </>
  );
}

