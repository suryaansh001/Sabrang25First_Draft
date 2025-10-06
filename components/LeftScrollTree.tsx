"use client";
import React from "react";
import { usePathname } from "next/navigation";

export default function LeftScrollTree() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return null;
  }
  const [progress, setProgress] = React.useState(0);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const targetProgressRef = React.useRef(0);
  const rafIdRef = React.useRef<number | null>(null);
  const animatingRef = React.useRef(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handleChange = () => setReducedMotion(mq.matches);
    mq.addEventListener?.("change", handleChange);

    // rAF-synced scroll progress for smoother, real-time updates
    let ticking = false;
    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const raw = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(Math.max(0, Math.min(1, raw)));
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateProgress);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      mq.removeEventListener?.("change", handleChange);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const barHeightPercent = `${(progress * 100).toFixed(3)}%`;

  const updateScrollFromPointer = (clientY: number) => {
    const ctn = containerRef.current;
    if (!ctn) return;
    const rect = ctn.getBoundingClientRect();
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
    const newProgress = rect.height > 0 ? y / rect.height : 0;
    setProgress(newProgress);
    targetProgressRef.current = newProgress;
    if (!animatingRef.current) {
      animatingRef.current = true;
      const animate = () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight <= 0) {
          animatingRef.current = false;
          rafIdRef.current = null;
          return;
        }
        const targetTop = Math.max(0, Math.min(docHeight, targetProgressRef.current * docHeight));
        const currentTop = window.scrollY || document.documentElement.scrollTop;
        const delta = targetTop - currentTop;
        // Smoothing factor (~60fps -> 0.35 gives quick catch-up without jank)
        const step = Math.abs(delta) < 1 ? delta : delta * 0.35;
        window.scrollTo({ top: currentTop + step, behavior: 'auto' });
        if (dragging || Math.abs(delta) >= 1) {
          rafIdRef.current = requestAnimationFrame(animate);
        } else {
          animatingRef.current = false;
          rafIdRef.current = null;
        }
      };
      rafIdRef.current = requestAnimationFrame(animate);
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setActive(true);
    updateScrollFromPointer(e.clientY);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setDragging(true);
    setActive(true);
    updateScrollFromPointer(e.touches[0].clientY);
  };

  React.useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => updateScrollFromPointer(e.clientY);
    const onTouchMove = (e: TouchEvent) => updateScrollFromPointer(e.touches[0].clientY);
    const onUp = () => {
      setDragging(false);
      // keep active visual state for 0.5s after release
      setTimeout(() => setActive(false), 500);
      // let the rAF loop finish easing, then stop automatically
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('mouseup', onUp, { passive: true });
    window.addEventListener('touchend', onUp, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove as any);
      window.removeEventListener('touchmove', onTouchMove as any);
      window.removeEventListener('mouseup', onUp as any);
      window.removeEventListener('touchend', onUp as any);
    };
  }, [dragging]);

  return (
    <div
      aria-hidden
      ref={containerRef}
      className={`hidden md:block fixed right-0 top-0 bottom-0 z-[2000] w-4 sm:w-4 md:w-5 pointer-events-auto select-none ${active ? '' : ''}`}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      role="presentation"
    >
      {/* Track */}
      <div className={`absolute right-0 top-0 bottom-0 w-[4px] sm:w-[4px] rounded-none ${active ? 'bg-white/25' : 'bg-white/10'} transition-colors will-change-transform`} />

      {/* No full-height progress fill; only a draggable thumb */}

      {/* Draggable handle */}
      <div
        className={`absolute right-0 translate-x-0 w-4 h-12 sm:w-4 sm:h-12 rounded-sm bg-gradient-to-b from-[#8b5cf6] via-[#ec4899] to-[#22d3ee] border border-white/20 shadow-[0_1px_6px_rgba(139,92,246,0.28)] cursor-grab active:cursor-grabbing ${active ? 'opacity-100' : 'opacity-85'} transition-opacity will-change-transform`}
        style={{ top: `calc(${barHeightPercent} - 24px)` }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <div className="absolute inset-0 rounded-sm" style={{ boxShadow: 'inset 0 0 3px rgba(255,255,255,0.25)' }} />
      </div>

      {/* Vine / tree tangle SVG overlay */}
      <svg
        className={`absolute inset-0 ${active ? 'opacity-60' : 'opacity-90'} mix-blend-screen pointer-events-none`}
        width="100%"
        height="100%"
        viewBox="0 0 8 800"
        preserveAspectRatio="xMidYMin slice"
      >
        <defs>
          <linearGradient id="vineGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="${active ? 0.5 : 1.5}" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Main vine */}
        <path
          d="M4 0 C 3 60, 5 120, 4 180 S 3 300, 4 360 S 5 480, 4 560 S 3 680, 4 800"
          fill="none"
          stroke="url(#vineGrad)"
          strokeWidth="1.2"
          filter="url(#glow)"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 1 }}
        />

        {/* Side branches */}
        <path d="M4 90 C 2.2 110, 2.2 140, 3.2 160" fill="none" stroke="#8b5cf6" strokeWidth="0.8" opacity="0.98" />
        <path d="M4 140 C 5.6 160, 5.6 190, 4.8 210" fill="none" stroke="#ec4899" strokeWidth="0.8" opacity="0.98" />
        <path d="M4 240 C 2.5 260, 2.5 290, 3.2 305" fill="none" stroke="#22d3ee" strokeWidth="0.7" opacity="0.98" />
        <path d="M4 300 C 5.5 320, 6 350, 4.8 370" fill="none" stroke="#8b5cf6" strokeWidth="0.7" opacity="0.98" />
        <path d="M4 420 C 2.5 440, 2.7 470, 3.3 490" fill="none" stroke="#ec4899" strokeWidth="0.6" opacity="0.98" />
        <path d="M4 520 C 5.4 540, 5.8 570, 4.6 590" fill="none" stroke="#22d3ee" strokeWidth="0.6" opacity="0.98" />

        {/* Leaves */}
        {Array.from({ length: 22 }).map((_, i) => {
          const y = 24 + i * 34;
          const left = i % 2 === 0;
          const x = left ? 3.2 : 4.8;
          const rot = left ? -18 : 18;
          return (
            <g key={i} transform={`translate(${x}, ${y}) rotate(${rot})`} opacity={1}>
              <path d="M0 0 C 1 -0.6, 1.6 -0.3, 2 0 C 1.6 0.3, 1 0.6, 0 0 Z" fill="#8b5cf6" />
              <path d="M0 0 C 1 -0.6, 1.6 -0.3, 2 0" fill="none" stroke="#22d3ee" strokeWidth="0.2" />
            </g>
          );
        })}

        {/* Subtle sway animation (disabled if reduced motion) */}
        {!reducedMotion && !active && (
          <style>{`
            @keyframes vineSway { 0%,100% { transform: translateX(0px) } 50% { transform: translateX(0.5px) } }
            svg path { transform-origin: 24px 400px; animation: vineSway 8s ease-in-out infinite; }
          `}</style>
        )}
      </svg>
    </div>
  );
}


