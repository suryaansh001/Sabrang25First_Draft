"use client";

import { usePathname } from "next/navigation";
import Background from "./Background";
import Footer from "./Footer";
import SplashCursor from "./SplashCursor";
import SidebarDock from "./SidebarDock";
import Logo from "./Logo";
import CosmicPartyTransition from "./CosmicPartyTransition";
import React, { useEffect, useState } from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [previousPath, setPreviousPath] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle page transitions
  useEffect(() => {
    if (mounted && previousPath && previousPath !== pathname) {
      // Trigger cosmic party transition
      setShowTransition(true);
    }
    setPreviousPath(pathname);
  }, [pathname, mounted, previousPath]);

  const handleTransitionComplete = () => {
    setShowTransition(false);
  };

  const hideChrome = pathname === "/" || pathname?.startsWith("/home") || pathname === "/Login" || pathname === "/Signup" || pathname === "/Events" || pathname === "/Team" || pathname === "/FAQ" || pathname === "/Contact" || pathname === "/About" || pathname === "/Sponsors/why-sponsor-us";

  return (
    <>
      <SplashCursor />
      <Background />
      <CosmicPartyTransition 
        isActive={showTransition} 
        onComplete={handleTransitionComplete}
      />
      <div className="relative z-10">
        {mounted && !hideChrome && <Logo />}
        <main>{children}</main>
        {!hideChrome && <SidebarDock />}
      </div>
      {mounted && pathname !== "/" && <Footer />}
    </>
  );
}

