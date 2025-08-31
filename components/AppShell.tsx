"use client";

import { usePathname } from "next/navigation";
import Background from "./Background";
import SplashCursor from "./SplashCursor";
import { SidebarDock } from "./SidebarDock";
import Logo from "./Logo";
import InfinityTransition from "./InfinityTransition";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";

// Separate component that uses usePathname
function AppShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle page transitions
  useEffect(() => {
    if (mounted && previousPath && previousPath !== pathname) {
      // If there's no pending navigation, this is a direct URL change
      // Just update the path without animation
      setPreviousPath(pathname);
      setIsTransitioning(false); // Ensure content is visible for direct navigation
    } else if (!previousPath) {
      // Initial load
      setPreviousPath(pathname);
      setIsTransitioning(false);
    }
  }, [pathname, mounted, previousPath]);

  // Reset transition state when pathname changes (after animation)
  useEffect(() => {
    if (!showTransition && pendingNavigation) {
      // Clear pending navigation after successful transition
      setPendingNavigation(null);
    }
  }, [showTransition, pendingNavigation]);

  // Ensure content is properly synchronized with pathname changes
  useEffect(() => {
    if (pathname && !showTransition && isTransitioning) {
      // If pathname has changed and transition is complete, ensure content is visible immediately
      setIsTransitioning(false);
    }
  }, [pathname, showTransition, isTransitioning]);

  // Ensure content is visible when pathname changes (for direct navigation)
  useEffect(() => {
    if (pathname && !isTransitioning && !showTransition) {
      setIsTransitioning(false);
    }
  }, [pathname, isTransitioning, showTransition]);

  const handleSidebarNavigate = (href: string) => {
    // Clean the href to remove query parameters for consistent navigation
    const cleanHref = href.split('?')[0];
    
    // Hide content immediately
    setIsTransitioning(true);
    
    // Start transition
    setPendingNavigation(cleanHref);
    setShowTransition(true);
    
    // Don't navigate here - let the transition handle it
    // router.push(cleanHref);
  };

  const handleTransitionComplete = () => {
    // Clear pending navigation immediately
    if (pendingNavigation) {
      setPendingNavigation(null);
    }
    
    // Remove transition overlay
    setShowTransition(false);
    
    // Make content visible immediately - no delay
    setIsTransitioning(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const hideChrome = pathname === "/" || pathname?.startsWith("/home") || pathname === "/Login" || pathname === "/Signup";

  return (
    <div className="min-h-screen flex flex-col">
      <SplashCursor />
      <Background />
      <InfinityTransition 
        isActive={showTransition} 
        targetHref={pendingNavigation}
        onComplete={handleTransitionComplete}
      />
      <div className="relative z-30 flex-grow">
        {mounted && !hideChrome && pathname !== "/why-sponsor-us" && <Logo />}
        <main 
          key={pathname}
          className={`${
            isTransitioning ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {children}
        </main>
        {!hideChrome && <SidebarDock onNavigate={handleSidebarNavigate} />}
      </div>
      
    </div>
  );
}

// Main AppShell component with Suspense boundary
export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black">
        <Background />
        <main>{children}</main>
      </div>
    }>
      <AppShellContent>{children}</AppShellContent>
    </Suspense>
  );
}

