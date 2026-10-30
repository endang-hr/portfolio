import React from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowLeft } from 'lucide-react';
import { projectsList } from '../data/portfolioData';

export default function TunnelHUD({
  scrollProgress,
  activeProjectIndex,
  selectedProjectId,
  onSelectProject,
  onNavigateProject,
  onScrollToHome
}) {
  // Visible when scrolling into tunnel (> 0.045) or when inspecting a project
  const isVisible = scrollProgress > 0.045 || Boolean(selectedProjectId);
  const project = projectsList[activeProjectIndex] || projectsList[0];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 pointer-events-none px-3 pb-3 sm:px-6 sm:pb-6 md:px-10 md:pb-8 transition-all duration-300">
      <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Project Quick Nav & Inspect (Fades out when project drawer is open) */}
        <div className={`pointer-events-auto flex items-center gap-1.5 sm:gap-3 transition-opacity duration-300 ${
          selectedProjectId ? 'opacity-0 pointer-events-none md:invisible' : 'opacity-100'
        }`}>
          {/* Prev / Next Arrows */}
          <div className="flex items-center gap-0.5 rounded-full border border-white/10 bg-[#09090d]/80 p-0.5 backdrop-blur-xl sm:gap-1 sm:p-1 shadow-lg">
            <button
              type="button"
              aria-label="Previous project"
              disabled={activeProjectIndex <= 0}
              onClick={() => onNavigateProject(Math.max(0, activeProjectIndex - 1))}
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 transition hover:bg-white/15 hover:text-white disabled:opacity-25 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label="Next project"
              disabled={activeProjectIndex >= projectsList.length - 1}
              onClick={() => onNavigateProject(Math.min(projectsList.length - 1, activeProjectIndex + 1))}
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 transition hover:bg-white/15 hover:text-white disabled:opacity-25 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Inspect Button & Title */}
          <button
            type="button"
            onClick={() => onSelectProject(project.id)}
            className="group flex items-center gap-2 rounded-full border border-white/15 bg-[#0b0b0e]/90 px-3 py-1.5 text-left backdrop-blur-xl transition-all hover:border-cyan-400/50 hover:bg-white/[0.12] sm:gap-3.5 sm:px-4 sm:py-2 cursor-pointer shadow-lg"
          >
            <span
              style={{ color: project.accentColor || '#00F0FF' }}
              className="font-mono text-[11px] font-bold tracking-wider tabular-nums sm:text-xs"
            >
              {project.formattedIndex}
            </span>
            <span className="max-w-[120px] truncate text-xs font-semibold tracking-tight text-white xs:max-w-[180px] sm:max-w-xs md:max-w-none md:text-sm">
              {project.title}
            </span>
            <span className="hidden items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/80 transition-colors group-hover:bg-white group-hover:text-black md:inline-flex">
              <Sparkles className="h-2.5 w-2.5" />
              Inspect
            </span>
          </button>
        </div>

        {/* Right: Counter, Progress Bar & Back to Home */}
        <div className="pointer-events-auto flex items-center justify-end gap-1.5 sm:gap-3">
          <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-[#0b0b0e]/85 px-3 py-1.5 backdrop-blur-xl sm:gap-3 sm:px-4 sm:py-2 shadow-lg">
            <span className="whitespace-nowrap text-[11px] text-white/75 tabular-nums sm:text-xs">
              <strong className="font-semibold text-white">{activeProjectIndex + 1}</strong> of {projectsList.length} project
            </span>
            <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-white/10 md:block">
              <div
                className="h-full bg-cyan-400 transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.max(((activeProjectIndex + 1) / projectsList.length) * 100, scrollProgress * 100))}%`
                }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onScrollToHome}
            aria-label="Back to home top"
            className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#050505] transition-all hover:bg-white/90 active:scale-95 sm:px-4 sm:py-2 cursor-pointer shadow-lg"
          >
            <ArrowLeft className="h-3 w-3 transition-transform duration-300 group-hover:-translate-x-0.5 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">Back to home</span>
          </button>
        </div>

      </div>
    </div>
  );
}
