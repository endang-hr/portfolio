import React from 'react';
import { User, ArrowUpRight } from 'lucide-react';
import { portfolioProfile } from '../data/portfolioData';

export default function Header({ onOpenAbout, onOpenContact, onScrollToHome }) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 px-4 py-3.5 sm:px-6 sm:py-5 md:px-10 md:py-7 pointer-events-none transition-all duration-300">
      <div className="mx-auto flex max-w-[1800px] items-center justify-between">
        {/* Left: Brand Monogram */}
        <div>
          <button
            type="button"
            onClick={onScrollToHome}
            aria-label="Scroll to home"
            className="pointer-events-auto group inline-flex items-center gap-2.5 text-left focus:outline-none sm:gap-3 cursor-pointer"
          >
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 overflow-hidden transition-all duration-300 group-hover:border-cyan-400 group-hover:scale-105 shadow-sm">
              <img
                src={portfolioProfile.profileImage}
                alt={portfolioProfile.name}
                className="h-full w-full object-cover object-top"
              />
            </span>
            <span className="hidden text-xs font-semibold tracking-tight text-white/95 sm:inline transition-colors duration-200 group-hover:text-cyan-300">
              {portfolioProfile.name}
            </span>
          </button>
        </div>

        {/* Center: About & Awards pill */}
        <div className="pointer-events-auto absolute left-1/2 -translate-x-1/2">
          <button
            type="button"
            onClick={onOpenAbout}
            className="group inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-[#09090c]/80 px-3.5 py-1.5 text-[11px] font-medium text-white/85 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/50 hover:bg-white/10 hover:text-white hover:scale-105 active:scale-95 sm:gap-2 sm:px-4 sm:py-2 sm:text-xs cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          >
            <User className="h-3 w-3 text-cyan-400 transition-transform duration-300 group-hover:scale-110 sm:h-3.5 sm:w-3.5" />
            <span className="whitespace-nowrap">About &amp; Awards</span>
          </button>
        </div>

        {/* Right: Get in touch pill */}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={onOpenContact}
            className="pointer-events-auto group inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.08] px-3.5 py-1.5 text-[11px] font-medium text-white backdrop-blur-xl transition-all duration-300 hover:border-white/40 hover:bg-white hover:text-[#050505] hover:scale-105 active:scale-95 sm:px-4 sm:py-2 sm:text-xs cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          >
            <span className="whitespace-nowrap">Get in touch</span>
            <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:h-3.5 sm:w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
