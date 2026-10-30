import React, { useEffect, useState } from 'react';

export default function IntroLoader({ isLoaded, progress }) {
  const [visible, setVisible] = useState(true);
  const [internalProgress, setInternalProgress] = useState(25);

  useEffect(() => {
    const timer = setInterval(() => {
      setInternalProgress(prev => {
        if (prev >= 95) {
          clearInterval(timer);
          return 95;
        }
        return prev + 15;
      });
    }, 180);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setInternalProgress(100);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  if (!visible) return null;

  const currentPercent = isLoaded ? 100 : Math.max(internalProgress, progress || 25);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] select-none transition-opacity duration-700 ${
        isLoaded && currentPercent >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center gap-7">
        {/* Diamond SVG Logo */}
        <svg
          width="76"
          height="76"
          viewBox="0 0 76 76"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible animate-pulse-glow"
        >
          {/* Diamond Border */}
          <path
            d="M38 4L72 38L38 72L4 38L38 4Z"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.2"
          />
          {/* Central Monogram Paths */}
          <path
            d="M21 25L38 55L55 25"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="38" cy="25" r="4.5" stroke="#FFFFFF" strokeWidth="1.6" />
        </svg>

        {/* Progress Bar & Label */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-[1px] w-36 overflow-hidden bg-white/10 rounded-full">
            <div
              className="h-full bg-white transition-all duration-300 ease-out"
              style={{ width: `${currentPercent}%` }}
            />
          </div>
          <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-white/45 tabular-nums">
            Initializing Archive • {currentPercent}%
          </span>
        </div>
      </div>
    </div>
  );
}
