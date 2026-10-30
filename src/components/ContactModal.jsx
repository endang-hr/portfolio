import React, { useState } from 'react';
import { X, Mail, Check, Github, Linkedin, Instagram, ArrowUpRight } from 'lucide-react';
import { portfolioProfile } from '../data/portfolioData';

export default function ContactModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  // Escape key to close
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(portfolioProfile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/15 bg-[#09090c]/95 p-6 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close modal"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-30 flex h-10 w-10 min-h-[40px] min-w-[40px] items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/90 hover:border-white/50 hover:bg-white hover:text-black transition-all cursor-pointer shadow-lg touch-manipulation active:scale-90"
        >
          <X className="h-4 w-4" />
        </button>

        <div>
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Open for collaborations &amp; selected commissions
          </span>
          <h2 className="font-serif italic text-3xl sm:text-4xl text-white mt-1.5 tracking-tight">
            Let's build something impactful.
          </h2>
          <p className="text-xs sm:text-sm text-white/60 mt-2 leading-relaxed">
            Get in touch with {portfolioProfile.name} ({portfolioProfile.role}) for full-stack engineering, UI/UX systems, or cutting-edge 3D web experiences.
          </p>

          {/* Email button card */}
          <div className="mt-6 flex flex-col gap-2">
            <a
              href={`mailto:${portfolioProfile.email}`}
              className="group flex items-center justify-between rounded-2xl bg-white px-5 py-3.5 text-black font-semibold text-xs sm:text-sm shadow-[0_0_30px_rgba(255,255,255,0.18)] hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-black" />
                <span>{portfolioProfile.email}</span>
              </div>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2 text-[11px] font-medium text-white/70 hover:border-white/20 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Email copied to clipboard!</span>
                </>
              ) : (
                <span>Copy email address</span>
              )}
            </button>
          </div>

          {/* Social Links Row */}
          <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-3 gap-2">
            <a
              href={portfolioProfile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-white/80 hover:border-white/30 hover:bg-white/10 hover:text-white transition-all"
            >
              <Linkedin className="h-3.5 w-3.5 text-cyan-400" />
              <span>LinkedIn</span>
            </a>
            <a
              href={portfolioProfile.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-white/80 hover:border-white/30 hover:bg-white/10 hover:text-white transition-all"
            >
              <Github className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href={portfolioProfile.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-white/80 hover:border-white/30 hover:bg-white/10 hover:text-white transition-all"
            >
              <Instagram className="h-3.5 w-3.5 text-pink-400" />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
