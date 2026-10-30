import React from 'react';
import { ArrowDownRight } from 'lucide-react';
import { portfolioProfile } from '../data/portfolioData';

export default function HeroOverlay({ scrollProgress, onExploreProjects, onOpenAbout }) {
  // Fade out cleanly so hero name, bio snippet, and buttons only appear on initial view
  const opacity = Math.max(0, Math.min(1, 1 - scrollProgress / 0.03));
  const translateY = Math.min(60, scrollProgress * 500);

  if (opacity <= 0.001) return null;

  return (
    <div
      style={{
        opacity,
        transform: `translate3d(0, ${translateY}px, 0)`,
        pointerEvents: opacity > 0.3 ? 'auto' : 'none'
      }}
      className="fixed inset-x-0 bottom-0 z-20 select-none transition-opacity duration-200"
    >
      {/* 1. Name row above the divider */}
      <div className="relative z-20 mx-auto flex max-w-[1800px] flex-col px-4 sm:px-6 md:px-10">
        <div className="relative pb-2 sm:pb-3">
          <h1
            style={{ fontSize: 'clamp(2.8rem, 6.4vw, 5.8rem)' }}
            className="font-serif italic leading-[1.0] tracking-[-0.03em] text-white select-none"
          >
            {portfolioProfile.name}
          </h1>
        </div>
      </div>

      {/* 2. From the straight line downwards: pure solid #050505 blackout across full screen width */}
      <div className="relative w-full border-t border-white/10 bg-[#050505] shadow-[0_-20px_40px_rgba(5,5,5,1)]">
        {/* Subtle gradient upward fade above the line so particles blend into the dark baseline */}
        <div className="pointer-events-none absolute inset-x-0 -top-28 h-28 bg-gradient-to-t from-[#050505] to-transparent" />

        <div className="mx-auto flex max-w-[1800px] flex-col items-start justify-between gap-3.5 px-4 pt-3 pb-4 sm:gap-5 sm:px-6 sm:pt-4 sm:pb-5 md:px-10 md:pb-7 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="text-[11px] leading-relaxed text-white/70 sm:text-xs md:text-sm">
              {portfolioProfile.bioSnippet}
            </p>
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onOpenAbout}
                className="text-[11px] font-medium text-cyan-400 underline underline-offset-4 transition-colors hover:text-cyan-300 sm:text-xs cursor-pointer focus:outline-none"
              >
                Read full bio, education &amp; achievements →
              </button>
            </div>
          </div>

          <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end sm:gap-4">
            <span className="hidden text-[11px] uppercase tracking-[0.2em] text-white/35 sm:inline">
              Scroll to fly through
            </span>
            <button
              type="button"
              onClick={onExploreProjects}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold tracking-tight text-[#050505] shadow-[0_0_30px_rgba(255,255,255,0.18)] transition-all duration-300 hover:scale-[1.03] hover:bg-white/90 active:scale-[0.98] sm:w-auto sm:px-6 sm:py-3 md:text-sm cursor-pointer"
            >
              <span>Explore {portfolioProfile.totalWorks} Projects</span>
              <ArrowDownRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
