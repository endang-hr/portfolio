import React, { useEffect, useState } from 'react';

export default function IntroLoader({ isLoaded, progress, theme = 'dark' }) {
  const [visible, setVisible] = useState(true);
  const [internalProgress, setInternalProgress] = useState(25);
  const isLight = theme === 'light';

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
      style={{ backgroundColor: isLight ? '#F7F7F9' : '#050505' }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center select-none transition-opacity duration-700 ${
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
            stroke={isLight ? 'rgba(15,16,20,0.22)' : 'rgba(255,255,255,0.25)'}
            strokeWidth="1.2"
          />
          {/* Central Monogram Paths */}
          <path
            d="M21 25L38 55L55 25"
            stroke={isLight ? '#111115' : '#FFFFFF'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="38" cy="25" r="4.5" stroke={isLight ? '#111115' : '#FFFFFF'} strokeWidth="1.6" />
        </svg>

        {/* Progress Bar & Label */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="h-[1px] w-36 overflow-hidden rounded-full"
            style={{ backgroundColor: isLight ? 'rgba(15,16,20,0.12)' : 'rgba(255,255,255,0.1)' }}
          >
            <div
              className="h-full transition-all duration-300 ease-out"
              style={{
                width: `${currentPercent}%`,
                backgroundColor: isLight ? '#111115' : '#FFFFFF'
              }}
            />
          </div>
          <span
            className="font-sans text-[10px] uppercase tracking-[0.28em] tabular-nums"
            style={{ color: isLight ? 'rgba(15,16,20,0.52)' : 'rgba(255,255,255,0.45)' }}
          >
            Initializing Archive • {currentPercent}%
          </span>
        </div>
      </div>
    </div>
  );
}
