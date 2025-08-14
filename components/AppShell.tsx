"use client";

import { usePathname } from "next/navigation";
import Background from "./Background";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SplashCursor from "./SplashCursor";
import SidebarDock from "./SidebarDock";
import React from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = pathname === "/" || pathname?.startsWith("/home") || pathname === "/Login" || pathname === "/Signup" || pathname === "/Events" || pathname === "/Gallery" || pathname === "/Team" || pathname === "/FAQ" || pathname === "/Contact" || pathname === "/About" || pathname === "/why-sponsor-us";

  return (
    <>
      <SplashCursor />
      <Background />
      <div className="relative z-10">
        {!hideChrome && <Navbar />}
        <main>{children}</main>
        {!hideChrome && <SidebarDock />}
      </div>
      {!hideChrome && <Footer />}
    </>
  );
}

