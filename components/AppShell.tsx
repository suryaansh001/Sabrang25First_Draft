"use client";

import { usePathname } from "next/navigation";
import Background from "./Background";
import Footer from "./Footer";
import SplashCursor from "./SplashCursor";
import SidebarDock, { setNavigationCallback } from "./SidebarDock";
import Logo from "./Logo";
import InfinityTransition from "./InfinityTransition";
import React, { useEffect, useState, Suspense } from "react";
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

  // Ensure content is visible when pathname changes (for direct navigation)
  useEffect(() => {
    if (pathname && !isTransitioning && !showTransition) {
      setIsTransitioning(false);
    }
  }, [pathname, isTransitioning, showTransition]);

  // Set up navigation callback
  useEffect(() => {
    setNavigationCallback((href: string) => {
      setPendingNavigation(href);
      setIsTransitioning(true); // Hide current page content immediately
      setShowTransition(true);
      
      // Navigate immediately but keep content hidden
      router.push(href);
    });
  }, [router]);

  const handleTransitionComplete = () => {
    setShowTransition(false);
    
    // Animation completed, now show the new page content
    if (pendingNavigation) {
      setPendingNavigation(null);
      setIsTransitioning(false); // Show new page content
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);



  const hideChrome = pathname === "/" || pathname?.startsWith("/home") || pathname === "/Login" || pathname === "/Signup" || pathname === "/Events" || pathname === "/Team" || pathname === "/FAQ" || pathname === "/Contact" || pathname === "/About" || pathname === "/Sponsors/why-sponsor-us";

  return (
    <>
      <SplashCursor />
      <Background />
      <InfinityTransition 
        isActive={showTransition} 
        onComplete={handleTransitionComplete}
      />
      <div className="relative z-10">
        {mounted && !hideChrome && <Logo />}
        <main 
          className={`transition-opacity duration-200 ${
            isTransitioning ? 'opacity-0 pointer-events-none invisible' : 'opacity-100 visible'
          }`}
        >
          {children}
        </main>
        {!hideChrome && <SidebarDock />}
      </div>
      {mounted && pathname !== "/" && <Footer />}
    </>
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

