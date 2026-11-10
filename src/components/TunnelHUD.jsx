import React from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowLeft } from 'lucide-react';
import { projectsList } from '../data/portfolioData';

export default function TunnelHUD({
  scrollProgress,
  activeProjectIndex,
  selectedProjectId,
  onSelectProject,
  onNavigateProject,
  onScrollToHome,
  theme = 'dark'
}) {
  const isLight = theme === 'light';
  // Visible when scrolling into tunnel (> 0.045) or when inspecting a project
  const isVisible = scrollProgress > 0.045 || Boolean(selectedProjectId);
  const project = projectsList[activeProjectIndex] || projectsList[0];

  if (!isVisible) return null;

  const pillSurfaceStyle = {
    backgroundColor: isLight ? 'rgba(255, 255, 255, 0.90)' : 'rgba(9, 9, 13, 0.85)',
    borderColor: isLight ? 'rgba(15, 23, 42, 0.12)' : 'rgba(255, 255, 255, 0.12)',
    color: isLight ? '#0f1014' : '#ffffff',
    boxShadow: isLight ? '0 8px 28px rgba(0, 0, 0, 0.08)' : '0 10px 25px rgba(0, 0, 0, 0.4)'
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 pointer-events-none px-3 pb-3 sm:px-6 sm:pb-6 md:px-10 md:pb-8 transition-all duration-300">
      <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Project Quick Nav & Inspect (Fades out when project drawer is open) */}
        <div className={`pointer-events-auto flex items-center gap-1.5 sm:gap-3 transition-opacity duration-300 ${
          selectedProjectId ? 'opacity-0 pointer-events-none md:invisible' : 'opacity-100'
        }`}>
          {/* Prev / Next Arrows */}
          <div
            style={pillSurfaceStyle}
            className="flex items-center gap-0.5 rounded-full border p-0.5 backdrop-blur-xl sm:gap-1 sm:p-1"
          >
            <button
              type="button"
              aria-label="Previous project"
              disabled={activeProjectIndex <= 0}
              onClick={() => onNavigateProject(Math.max(0, activeProjectIndex - 1))}
              style={{ color: isLight ? 'rgba(15, 16, 20, 0.72)' : 'rgba(255, 255, 255, 0.70)' }}
              className="flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-full transition disabled:opacity-25 cursor-pointer disabled:cursor-not-allowed touch-manipulation active:scale-90"
            >
              <ChevronLeft className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            </button>
            <button
              type="button"
              aria-label="Next project"
              disabled={activeProjectIndex >= projectsList.length - 1}
              onClick={() => onNavigateProject(Math.min(projectsList.length - 1, activeProjectIndex + 1))}
              style={{ color: isLight ? 'rgba(15, 16, 20, 0.72)' : 'rgba(255, 255, 255, 0.70)' }}
              className="flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-full transition disabled:opacity-25 cursor-pointer disabled:cursor-not-allowed touch-manipulation active:scale-90"
            >
              <ChevronRight className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            </button>
          </div>

          {/* Inspect Button & Title */}
          <button
            type="button"
            onClick={() => onSelectProject(project.id)}
            style={pillSurfaceStyle}
            className="group flex min-h-[38px] items-center gap-2 rounded-full border px-3.5 py-1.5 text-left backdrop-blur-xl transition-all active:scale-95 sm:gap-3.5 sm:px-4 sm:py-2 cursor-pointer touch-manipulation"
          >
            <span
              style={{
                color: project.accentColor || '#00F0FF',
                filter: isLight ? 'brightness(0.75) saturate(1.2)' : 'none'
              }}
              className="font-mono text-[11px] font-bold tracking-wider tabular-nums sm:text-xs"
            >
              {project.formattedIndex}
            </span>
            <span
              style={{ color: isLight ? '#0f1014' : '#ffffff' }}
              className="max-w-[120px] truncate text-xs font-semibold tracking-tight xs:max-w-[180px] sm:max-w-xs md:max-w-none md:text-sm"
            >
              {project.title}
            </span>
            <span
              style={{
                backgroundColor: isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.10)',
                color: isLight ? 'rgba(15, 16, 20, 0.82)' : 'rgba(255, 255, 255, 0.80)'
              }}
              className="hidden items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors md:inline-flex"
            >
              <Sparkles className="h-2.5 w-2.5" />
              Inspect
            </span>
          </button>
        </div>

        {/* Right: Counter, Progress Bar & Back to Home */}
        <div className="pointer-events-auto flex items-center justify-end gap-1.5 sm:gap-3">
          <div
            style={pillSurfaceStyle}
            className="flex items-center gap-2.5 rounded-full border px-3 py-1.5 backdrop-blur-xl sm:gap-3 sm:px-4 sm:py-2"
          >
            <span
              style={{ color: isLight ? 'rgba(15, 16, 20, 0.72)' : 'rgba(255, 255, 255, 0.75)' }}
              className="whitespace-nowrap text-[11px] tabular-nums sm:text-xs"
            >
              <strong style={{ color: isLight ? '#0f1014' : '#ffffff' }} className="font-semibold">
                {activeProjectIndex + 1}
              </strong>{' '}
              of {projectsList.length} project
            </span>
            <div
              className="hidden h-1.5 w-16 overflow-hidden rounded-full md:block"
              style={{ backgroundColor: isLight ? 'rgba(15, 23, 42, 0.10)' : 'rgba(255, 255, 255, 0.10)' }}
            >
              <div
                className="h-full transition-all duration-300"
                style={{
                  backgroundColor: isLight ? '#0284c7' : '#22d3ee',
                  width: `${Math.min(100, Math.max(((activeProjectIndex + 1) / projectsList.length) * 100, scrollProgress * 100))}%`
                }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onScrollToHome}
            aria-label="Back to home top"
            style={{
              backgroundColor: isLight ? '#111115' : '#ffffff',
              color: isLight ? '#ffffff' : '#050505',
              borderColor: isLight ? '#111115' : 'rgba(255, 255, 255, 0.15)',
              boxShadow: isLight ? '0 8px 22px rgba(0, 0, 0, 0.16)' : '0 8px 25px rgba(0, 0, 0, 0.4)'
            }}
            className="group inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all active:scale-95 sm:px-4 sm:py-2 cursor-pointer"
          >
            <ArrowLeft className="h-3 w-3 transition-transform duration-300 group-hover:-translate-x-0.5 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">Back to home</span>
          </button>
        </div>

      </div>
    </div>
  );
}
