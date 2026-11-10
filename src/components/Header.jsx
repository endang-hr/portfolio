import React from 'react';
import { User, ArrowUpRight } from 'lucide-react';
import { portfolioProfile } from '../data/portfolioData';

export default function Header({
  onOpenAbout,
  onOpenContact,
  onScrollToHome,
  theme = 'dark',
  onToggleTheme
}) {
  const isLight = theme === 'light';

  return (
    <header className="fixed inset-x-0 top-0 z-30 px-3.5 py-3.5 sm:px-6 sm:py-5 md:px-10 md:py-7 pointer-events-none transition-all duration-300">
      <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-1.5 sm:gap-4 relative">
        {/* Left: Brand Monogram */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onScrollToHome}
            aria-label="Scroll to home"
            className="pointer-events-auto group inline-flex items-center gap-2.5 text-left focus:outline-none sm:gap-3 cursor-pointer"
          >
            <span
              className="relative flex h-8 w-8 items-center justify-center rounded-full overflow-hidden transition-all duration-300 group-hover:scale-105 shadow-sm"
              style={{
                border: isLight ? '1px solid rgba(15, 23, 42, 0.16)' : '1px solid rgba(255, 255, 255, 0.2)',
                backgroundColor: isLight ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255, 255, 255, 0.05)'
              }}
            >
              <img
                src={portfolioProfile.profileImage}
                alt={portfolioProfile.name}
                className="h-full w-full object-cover object-top"
              />
            </span>
            <span
              className="hidden text-xs font-semibold tracking-tight sm:inline transition-colors duration-200"
              style={{ color: isLight ? 'rgba(15, 16, 20, 0.92)' : 'rgba(255, 255, 255, 0.95)' }}
            >
              {portfolioProfile.name}
            </span>
          </button>
        </div>

        {/* Center: About & Awards pill */}
        <div className="pointer-events-auto header-center-pill shrink-0">
          <button
            type="button"
            onClick={onOpenAbout}
            style={{
              backgroundColor: isLight ? 'rgba(255, 255, 255, 0.88)' : 'rgba(9, 9, 12, 0.80)',
              borderColor: isLight ? 'rgba(15, 23, 42, 0.12)' : 'rgba(255, 255, 255, 0.12)',
              color: isLight ? 'rgba(15, 16, 20, 0.88)' : 'rgba(255, 255, 255, 0.85)',
              boxShadow: isLight ? '0 4px 18px rgba(0, 0, 0, 0.08)' : '0 4px 20px rgba(0, 0, 0, 0.4)'
            }}
            className="group inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-medium backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 sm:gap-2 sm:px-4 sm:py-2 sm:text-xs cursor-pointer"
          >
            <User
              className="h-3 w-3 transition-transform duration-300 group-hover:scale-110 sm:h-3.5 sm:w-3.5"
              style={{ color: isLight ? '#0284c7' : '#22d3ee' }}
            />
            <span className="whitespace-nowrap">About &amp; Awards</span>
          </button>
        </div>

        {/* Right: Get in touch + Theme Toggle (Hitam/Putih) */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenContact}
            style={{
              backgroundColor: isLight ? 'rgba(15, 23, 42, 0.06)' : 'rgba(255, 255, 255, 0.08)',
              borderColor: isLight ? 'rgba(15, 23, 42, 0.15)' : 'rgba(255, 255, 255, 0.15)',
              color: isLight ? '#0f1014' : '#ffffff',
              boxShadow: isLight ? '0 4px 18px rgba(0, 0, 0, 0.06)' : '0 4px 20px rgba(0, 0, 0, 0.3)'
            }}
            className="pointer-events-auto group inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-[11px] font-medium backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 sm:gap-1.5 sm:px-4 sm:py-2 sm:text-xs cursor-pointer"
          >
            <span className="whitespace-nowrap">Get in touch</span>
            <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:h-3.5 sm:w-3.5" />
          </button>

          {/* Circular Hitam / Putih Theme Toggle Button matching reference icon */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isLight ? 'Ubah ke mode hitam (gelap)' : 'Ubah ke mode putih (terang)'}
            title={isLight ? 'Mode Hitam (Gelap)' : 'Mode Putih (Terang)'}
            style={{
              backgroundColor: isLight ? '#efefef' : '#2b2b2f',
              color: isLight ? '#5a5a60' : '#ffffff',
              border: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: isLight ? '0 2px 10px rgba(0, 0, 0, 0.06)' : '0 2px 12px rgba(0, 0, 0, 0.35)'
            }}
            className="pointer-events-auto flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full transition-all duration-300 hover:scale-105 active:scale-90 cursor-pointer touch-manipulation shrink-0"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 sm:h-[17px] sm:w-[17px] transition-transform duration-300"
              style={{ transform: isLight ? 'rotate(-12deg)' : 'rotate(0deg)' }}
              aria-hidden="true"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
