import React from 'react';
import { ArrowDownRight } from 'lucide-react';
import { portfolioProfile } from '../data/portfolioData';

export default function HeroOverlay({
  scrollProgress,
  onExploreProjects,
  onOpenAbout,
  theme = 'dark'
}) {
  const isLight = theme === 'light';
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
            style={{
              fontSize: 'clamp(2.8rem, 6.4vw, 5.8rem)',
              color: isLight ? '#0f1014' : '#ffffff'
            }}
            className="font-serif italic leading-[1.0] tracking-[-0.03em] select-none transition-colors duration-300"
          >
            {portfolioProfile.name}
          </h1>
        </div>
      </div>

      {/* 2. From the straight line downwards: pure theme background blackout/whiteout across full screen width */}
      <div
        className="relative w-full transition-colors duration-300"
        style={{
          backgroundColor: isLight ? '#F7F7F9' : '#050505',
          borderTop: isLight ? '1px solid rgba(15, 16, 20, 0.10)' : '1px solid rgba(255, 255, 255, 0.10)',
          boxShadow: isLight ? '0 -20px 40px rgba(247, 247, 249, 1)' : '0 -20px 40px rgba(5, 5, 5, 1)'
        }}
      >
        {/* Subtle gradient upward fade above the line so particles blend into the theme baseline */}
        <div
          className="pointer-events-none absolute inset-x-0 -top-28 h-28"
          style={{
            background: isLight
              ? 'linear-gradient(to top, #F7F7F9 0%, rgba(247, 247, 249, 0) 100%)'
              : 'linear-gradient(to top, #050505 0%, rgba(5, 5, 5, 0) 100%)'
          }}
        />

        <div className="mx-auto flex max-w-[1800px] flex-col items-start justify-between gap-3.5 px-4 pt-3 pb-4 sm:gap-5 sm:px-6 sm:pt-4 sm:pb-5 md:px-10 md:pb-7 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p
              className="text-[11px] leading-relaxed sm:text-xs md:text-sm transition-colors duration-300"
              style={{ color: isLight ? 'rgba(15, 16, 20, 0.72)' : 'rgba(255, 255, 255, 0.70)' }}
            >
              {portfolioProfile.bioSnippet}
            </p>
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onOpenAbout}
                style={{ color: isLight ? '#0284c7' : '#22d3ee' }}
                className="text-[11px] font-medium underline underline-offset-4 transition-colors sm:text-xs cursor-pointer focus:outline-none"
              >
                Read full bio, education &amp; achievements →
              </button>
            </div>
          </div>

          <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end sm:gap-4">
            <span
              className="hidden text-[11px] uppercase tracking-[0.2em] sm:inline transition-colors duration-300"
              style={{ color: isLight ? 'rgba(15, 16, 20, 0.45)' : 'rgba(255, 255, 255, 0.35)' }}
            >
              Scroll to fly through
            </span>
            <button
              type="button"
              onClick={onExploreProjects}
              style={{
                backgroundColor: isLight ? '#111115' : '#ffffff',
                color: isLight ? '#ffffff' : '#050505',
                boxShadow: isLight
                  ? '0 10px 28px rgba(15, 16, 20, 0.18)'
                  : '0 0 30px rgba(255, 255, 255, 0.18)'
              }}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-tight transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] sm:w-auto sm:px-6 sm:py-3 md:text-sm cursor-pointer"
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
