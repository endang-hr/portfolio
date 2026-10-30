import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Share2,
  Check,
  CheckCircle2,
  Layers,
  Target,
  User,
  Sparkles,
  Film,
  FileText,
  Send,
  X
} from 'lucide-react';
import { projectsList } from '../data/portfolioData';

export default function ProjectModal({
  selectedProjectId,
  onClose,
  onSelectProject,
  onOpenContact,
  onOpenAbout
}) {
  const [activeTab, setActiveTab] = useState('visual');
  const [isCopied, setIsCopied] = useState(false);
  const [currentProject, setCurrentProject] = useState(() => projectsList[0]);
  const isOpen = Boolean(selectedProjectId);

  // Update current project whenever selectedProjectId changes to a valid project
  useEffect(() => {
    if (selectedProjectId) {
      const found = projectsList.find(p => p.id === selectedProjectId);
      if (found) {
        setCurrentProject(found);
        setActiveTab('visual');
      }
    }
  }, [selectedProjectId]);

  const project = currentProject || projectsList[0];
  const currentIndex = projectsList.findIndex(p => p.id === project?.id);

  const handlePrev = () => {
    if (currentIndex < 0) return;
    const prevIdx = (currentIndex - 1 + projectsList.length) % projectsList.length;
    onSelectProject(projectsList[prevIdx].id);
  };

  const handleNext = () => {
    if (currentIndex < 0) return;
    const nextIdx = (currentIndex + 1) % projectsList.length;
    onSelectProject(projectsList[nextIdx].id);
  };

  const handleShare = () => {
    const url = window.location.origin + window.location.pathname + `?project=${project?.id || ''}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2200);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e) => {
      if (!selectedProjectId) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedProjectId, currentIndex, onClose]);

  const handleClose = (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    onClose();
  };

  return (
    <>
      {/* Click/Tap outside to Close & Return to Tunnel */}
      <div
        className={`project-side-backdrop ${isOpen ? 'is-open' : ''}`}
        onClick={handleClose}
        onTouchEnd={(e) => {
          if (e.target === e.currentTarget) {
            handleClose(e);
          }
        }}
        aria-label="Click outside to close project panel"
      />

      {/* Side Drawer Panel (Left-docked on Laptop/Desktop, Slide-in Morph from left) */}
      <aside
        className={`project-side-drawer ${isOpen ? 'is-open' : ''}`}
        data-lenis-prevent="true"
        aria-hidden={!isOpen}
      >
        {/* Top Header Bar with Safe Area padding & dedicated iOS touch targets */}
        <div className="project-drawer-header sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#070709]/95 backdrop-blur-2xl px-5 sm:px-7">
          {/* Close button with Chevron - minimum 44px hit target for iOS HIG */}
          <button
            type="button"
            onClick={handleClose}
            onTouchEnd={handleClose}
            className="group inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs sm:text-sm font-semibold text-white backdrop-blur-xl transition-all duration-200 hover:border-white/40 hover:bg-white/20 active:scale-95 cursor-pointer touch-manipulation select-none shadow-md"
            aria-label="Close project panel"
          >
            <ChevronLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span>Close</span>
          </button>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Share button */}
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-medium text-white/85 backdrop-blur-xl transition-all duration-200 hover:border-white/35 hover:bg-white/15 hover:text-white cursor-pointer active:scale-95 touch-manipulation select-none"
            >
              {isCopied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>

            {/* Visit Live button */}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[44px] items-center gap-1 rounded-full border border-white/20 bg-white px-3.5 py-2 text-xs font-semibold text-black transition-all duration-200 hover:bg-white/90 active:scale-95 cursor-pointer shadow-sm touch-manipulation select-none"
              >
                <span>Visit Live</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}

            {/* Dedicated mobile X Close button */}
            <button
              type="button"
              onClick={handleClose}
              onTouchEnd={handleClose}
              className="flex sm:hidden h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/25 active:scale-90 transition-all cursor-pointer touch-manipulation shadow-sm"
              aria-label="Close project details"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div
          className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-7 md:p-8 space-y-6 custom-drawer-scroll overscroll-contain"
          style={{
            flex: '1 1 0%',
            minHeight: 0,
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch'
          }}
          data-lenis-prevent="true"
        >
          {/* Metadata Subheader: 001 • Category • Year */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-medium tracking-wider text-cyan-400 uppercase">
              <span>{project.formattedIndex}</span>
              <span className="text-white/30">•</span>
              <span>{project.category}</span>
              <span className="text-white/30">•</span>
              <span className="text-white/60">{project.year}</span>
            </div>

            {/* Project Title (Serif Italic Display) */}
            <h1 className="project-drawer-title">
              {project.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-white/70 font-light mt-2 leading-relaxed">
              {project.category}
            </p>

            {/* Tech Tags / Badges */}
            <div className="flex flex-wrap gap-1.5 mt-3.5">
              {project.tags?.map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs text-white/80 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Project Summary & Narrative */}
          <div className="space-y-3 text-xs sm:text-sm text-white/75 leading-relaxed">
            <p>{project.summary}</p>
            {project.challenge && (
              <p className="text-white/60">{project.challenge}</p>
            )}
          </div>

          {/* Key Metrics Glass Box */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
              {project.metrics.map((m, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center py-1">
                  <span
                    className="font-serif italic text-xl sm:text-2xl font-bold tracking-tight"
                    style={{ color: project.accentColor || '#38BDF8' }}
                  >
                    {m.value}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-white/45 mt-0.5">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Media Showcase Section with Interactive Tabs */}
          <div className="space-y-3 pt-1">
            {/* Tab Navigation Pill Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex flex-wrap items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('visual')}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'visual'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Project Visual</span>
                </button>
                {project.telegramBotMediaUrl && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('telegram')}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                      activeTab === 'telegram'
                        ? 'bg-cyan-400 text-black shadow-sm font-semibold'
                        : 'text-cyan-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Send className="h-3 w-3" />
                    <span>Bot Telegram</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveTab('reel')}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'reel'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Film className="h-3 w-3" />
                  <span>Dynamic Reel</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('deliverables')}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'deliverables'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <FileText className="h-3 w-3" />
                  <span>Deliverables</span>
                </button>
              </div>

              <span className="text-[10px] font-mono tracking-wider text-white/40 uppercase hidden sm:inline">
                LIVE ASSET
              </span>
            </div>

            {/* Tab Content: Project Visual */}
            {activeTab === 'visual' && project.mediaUrl && (
              <div className="space-y-3 animate-fadeIn">
                <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-[0_0_40px_rgba(0,0,0,0.6)] bg-[#07070a] group">
                  <div
                    className="max-h-[50vh] overflow-y-auto custom-drawer-scroll overscroll-contain"
                    data-lenis-prevent="true"
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                  >
                    <img
                      src={project.mediaUrl}
                      alt={project.title}
                      className="w-full h-auto block select-none"
                      decoding="sync"
                    />
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 pointer-events-none flex items-center gap-1.5 rounded-full bg-black/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-medium text-white/75 border border-white/15 shadow-lg">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>Scroll gambar untuk melihat tampilan penuh</span>
                  </div>
                </div>

                {/* Banner Link to Telegram Bot if available */}
                {project.telegramBotMediaUrl && (
                  <div
                    onClick={() => setActiveTab('telegram')}
                    className="group flex items-center justify-between rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/15 via-sky-500/5 to-transparent p-3.5 hover:border-cyan-400/60 hover:bg-cyan-500/20 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/20 text-cyan-300 group-hover:scale-105 transition-transform">
                        <Send className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-semibold text-white group-hover:text-cyan-200">
                            Terhubung ke Bot Telegram Presensi
                          </h5>
                          <span className="rounded-full bg-cyan-400/20 border border-cyan-400/40 px-2 py-0.5 text-[9px] font-bold text-cyan-300">
                            ACTIVE BOT
                          </span>
                        </div>
                        <p className="text-[11px] text-white/65 mt-0.5">
                          Notifikasi rekapitulasi harian per kelas &amp; penandaan status Alfa otomatis pada batas waktu 18:00 WIB.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-cyan-300 group-hover:translate-x-0.5 transition-transform shrink-0 hidden sm:inline">
                      Buka Preview Bot →
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-white/45 px-1">
                  <span>Design &amp; Engineering by Muhamad Endang</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('deliverables')}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium cursor-pointer"
                  >
                    Read full craft notes →
                  </button>
                </div>
              </div>
            )}

            {/* Tab Content: Telegram Bot Integration */}
            {activeTab === 'telegram' && project.telegramBotMediaUrl && (
              <div className="space-y-4 animate-fadeIn">
                {/* Header Information Box */}
                <div className="rounded-2xl border border-cyan-500/25 bg-cyan-500/10 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4 text-cyan-400" />
                      <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-cyan-300">
                        Integrasi Bot Telegram: Presensi Real-Time
                      </h4>
                    </div>
                    <p className="text-xs text-white/70">
                      Grup: <span className="font-semibold text-white">{project.telegramBotDetails?.groupName || 'ABSENSI SMK SETIA BUDHI RANGKASBITUNG'}</span>
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-cyan-400/30 bg-cyan-400/20 px-3 py-1 text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Telegram Bot API Active</span>
                  </span>
                </div>

                {/* Screenshot of Telegram Web */}
                <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-[0_0_40px_rgba(0,0,0,0.6)] bg-[#07070a] group">
                  <div
                    className="max-h-[52vh] overflow-y-auto custom-drawer-scroll overscroll-contain"
                    data-lenis-prevent="true"
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                  >
                    <img
                      src={project.telegramBotMediaUrl}
                      alt="Telegram Bot Rekap Presensi Siswa"
                      className="w-full h-auto block select-none"
                    />
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 pointer-events-none flex items-center gap-1.5 rounded-full bg-black/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-medium text-white/80 border border-white/15 shadow-lg">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>Scroll untuk melihat pesan rekap bot Telegram</span>
                  </div>
                </div>

                {/* Automation Rules & Technical Highlights */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 space-y-3">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-white/50">
                    Alur Otomatisasi &amp; Fitur Bot Telegram
                  </h5>
                  <div className="space-y-2.5">
                    {project.telegramBotDetails?.highlights?.map((hl, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-white/80">
                        <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content: Dynamic Reel */}
            {activeTab === 'reel' && (
              <div className="rounded-2xl border border-white/12 bg-white/[0.02] p-6 text-center space-y-4 animate-fadeIn">
                <div
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 shadow-inner"
                  style={{ backgroundColor: `${project.accentColor}18` }}
                >
                  <Film className="h-6 w-6" style={{ color: project.accentColor }} />
                </div>
                <div>
                  <h4 className="font-serif italic text-lg text-white">Interactive Motion Simulation</h4>
                  <p className="text-xs text-white/55 mt-1 max-w-sm mx-auto">
                    Kombinasi micro-animations, transisi responsif 60fps, dan 3D spatial presentation dirancang khusus untuk pengalaman imersif.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-left pt-2 max-w-xs mx-auto">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                    <span className="text-[10px] text-white/40 uppercase block">Frame Rate</span>
                    <span className="font-mono text-sm font-bold text-emerald-400">60 FPS Smooth</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                    <span className="text-[10px] text-white/40 uppercase block">Viewport</span>
                    <span className="font-mono text-sm font-bold text-cyan-400">Adaptive 3D</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content: Deliverables */}
            {activeTab === 'deliverables' && (
              <div className="rounded-2xl border border-white/12 bg-white/[0.02] p-5 space-y-3 animate-fadeIn">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-1">
                  Scope of Work &amp; Deliverables
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {project.deliverables?.map((d, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white/85"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom CTA Card ("Have something in mind? Let's make the next one yours.") */}
          <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-5 sm:p-6 backdrop-blur-xl mt-6">
            <h3 className="font-serif italic text-2xl sm:text-[26px] text-white leading-snug">
              Have something in mind? Let's make the next one yours.
            </h3>
            <p className="text-xs sm:text-sm text-white/60 mt-2 leading-relaxed">
              Available for UI/UX design leadership, web &amp; mobile application engineering, and AI-driven product solutions.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 mt-5">
              <button
                type="button"
                onClick={onOpenContact}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-black transition-all duration-200 hover:bg-white/90 active:scale-95 cursor-pointer shadow-lg"
              >
                <span>Start a project</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={onOpenAbout}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs sm:text-sm font-medium text-white transition-all duration-200 hover:border-white/35 hover:bg-white/15 active:scale-95 cursor-pointer"
              >
                <User className="h-3.5 w-3.5 text-white/70" />
                <span>View Muhamad Endang's Profile</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

