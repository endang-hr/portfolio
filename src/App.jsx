import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import FlythroughScene from './three/FlythroughScene';
import Header from './components/Header';
import HeroOverlay from './components/HeroOverlay';
import AboutModal from './components/AboutModal';
import ContactModal from './components/ContactModal';
import ProjectModal from './components/ProjectModal';
import IntroLoader from './components/IntroLoader';
import TunnelHUD from './components/TunnelHUD';
import { projectsList } from './data/portfolioData';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [hoveredProjectId, setHoveredProjectId] = useState(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      const saved = window.localStorage.getItem('portfolio-theme');
      return saved === 'light' || saved === 'dark' ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    try {
      window.localStorage.setItem('portfolio-theme', theme);
    } catch {
      // Ignore storage write restriction
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll with mobile touch synchronization
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      syncTouch: true,
      syncTouchLerp: 0.08,
      touchMultiplier: 1.75
    });
    lenisRef.current = lenis;

    const onScroll = (e) => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollY = typeof e?.scroll === 'number' ? e.scroll : window.scrollY;
      const progress = e?.progress !== undefined
        ? Math.min(1, Math.max(0, e.progress))
        : Math.min(1, Math.max(0, scrollY / maxScroll));
      setScrollProgress(progress);
    };

    lenis.on('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const animId = requestAnimationFrame(raf);

    // Initial check
    onScroll();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', onScroll);
      lenis.destroy();
    };
  }, []);

  // When any modal is opened, stop/resume Lenis
  useEffect(() => {
    if (isAboutModalOpen || isContactModalOpen || selectedProjectId) {
      lenisRef.current?.stop();
    } else {
      lenisRef.current?.start();
    }
  }, [isAboutModalOpen, isContactModalOpen, selectedProjectId]);

  // Direct Touch & Pointer Drag controller for mobile / iPhone and iOS Simulator
  const progressRef = useRef(0);
  useEffect(() => {
    progressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    let startY = 0;
    let lastY = 0;
    let isDragging = false;
    let velocityY = 0;
    let lastTime = 0;
    let momentumAnimId = null;

    const isModalActive = () => Boolean(isAboutModalOpen || isContactModalOpen || selectedProjectId);

    const handleDragStart = (clientY) => {
      if (isModalActive()) return;
      startY = clientY;
      lastY = clientY;
      lastTime = performance.now();
      isDragging = true;
      velocityY = 0;
      if (momentumAnimId) {
        cancelAnimationFrame(momentumAnimId);
        momentumAnimId = null;
      }
    };

    const handleDragMove = (clientY, cancelableEvent) => {
      if (!isDragging || isModalActive()) return;
      const deltaY = lastY - clientY;
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);

      velocityY = deltaY / dt;
      lastY = clientY;
      lastTime = now;

      // Sensitivity: ~4.5x screen height traverses the entire 0 -> 1 tunnel progress
      const scrollDomain = Math.max(1, window.innerHeight * 4.5);
      const progressDelta = deltaY / scrollDomain;

      const nextSp = Math.min(1, Math.max(0, progressRef.current + progressDelta));
      progressRef.current = nextSp;
      setScrollProgress(nextSp);

      if (cancelableEvent && cancelableEvent.cancelable) {
        cancelableEvent.preventDefault();
      }

      if (lenisRef.current) {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        lenisRef.current.scroll = nextSp * maxScroll;
      }
    };

    const handleDragEnd = () => {
      if (!isDragging || isModalActive()) {
        isDragging = false;
        return;
      }
      isDragging = false;

      // Smooth inertia glide on release
      if (Math.abs(velocityY) > 0.08) {
        const scrollDomain = Math.max(1, window.innerHeight * 4.5);
        let velocityProgress = (velocityY * 16) / scrollDomain;

        const decay = () => {
          if (isModalActive()) return;
          if (Math.abs(velocityProgress) < 0.0001) return;

          const nextSp = Math.min(1, Math.max(0, progressRef.current + velocityProgress));
          progressRef.current = nextSp;
          setScrollProgress(nextSp);

          if (lenisRef.current) {
            const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            lenisRef.current.scroll = nextSp * maxScroll;
          }

          velocityProgress *= 0.92;
          momentumAnimId = requestAnimationFrame(decay);
        };
        momentumAnimId = requestAnimationFrame(decay);
      }
    };

    // Touch events for real iPhone and touch simulation
    const onTouchStart = (e) => {
      if (e.touches && e.touches.length === 1) {
        handleDragStart(e.touches[0].clientY);
      }
    };
    const onTouchMove = (e) => {
      if (e.touches && e.touches.length === 1) {
        handleDragMove(e.touches[0].clientY, e);
      }
    };
    const onTouchEnd = () => {
      handleDragEnd();
    };

    // Pointer / mouse drag for Simulator mouse drag & desktop testing
    const onMouseDown = (e) => {
      if (e.target.closest('button, a, input, textarea, [data-lenis-prevent]')) return;
      handleDragStart(e.clientY);
    };
    const onMouseMove = (e) => {
      if (isDragging) {
        handleDragMove(e.clientY, e);
      }
    };
    const onMouseUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    // Wheel event fallback (if user uses mouse wheel in simulator or desktop)
    const onWheel = (e) => {
      if (isModalActive()) return;
      const deltaY = e.deltaY;
      const scrollDomain = Math.max(1, window.innerHeight * 4.5);
      const progressDelta = (deltaY * 1.1) / scrollDomain;
      const nextSp = Math.min(1, Math.max(0, progressRef.current + progressDelta));
      progressRef.current = nextSp;
      setScrollProgress(nextSp);
      if (lenisRef.current) {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        lenisRef.current.scroll = nextSp * maxScroll;
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('wheel', onWheel, { passive: true });

    return () => {
      if (momentumAnimId) cancelAnimationFrame(momentumAnimId);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('wheel', onWheel);
    };
  }, [isAboutModalOpen, isContactModalOpen, selectedProjectId]);

  const handleExploreProjects = () => {
    handleNavigateProject(0);
  };

  const handleScrollToHome = () => {
    progressRef.current = 0;
    setScrollProgress(0);
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.2 });
    }
  };

  const handleNavigateProject = (idx) => {
    setActiveProjectIndex(idx);
    if (projectsList[idx]) {
      const startCamZ = 9.5;
      const lastProject = projectsList[projectsList.length - 1];
      const endCamZ = lastProject ? (lastProject.zPosition - 14) : -65;
      const targetCamZ = projectsList[idx].zPosition + 6.35;
      const targetSp = Math.min(0.98, Math.max(0.05, (targetCamZ - startCamZ) / (endCamZ - startCamZ)));
      
      progressRef.current = targetSp;
      setScrollProgress(targetSp);

      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (lenisRef.current) {
        lenisRef.current.scrollTo(maxScroll * targetSp, { duration: 1.2 });
      }
    }
  };

  return (
    <main
      className="relative min-h-screen w-full touch-pan-y transition-colors duration-300"
      style={{
        touchAction: 'pan-y',
        backgroundColor: theme === 'light' ? '#F7F7F9' : '#050505',
        color: theme === 'light' ? '#0f1014' : '#ffffff'
      }}
    >
      {/* Intro Loading Screen */}
      <IntroLoader isLoaded={isLoaded} progress={85} theme={theme} />

      {/* 3D WebGL Flythrough Canvas */}
      <FlythroughScene
        scrollProgress={scrollProgress}
        selectedProjectId={selectedProjectId}
        onSelectProject={(id) => setSelectedProjectId(id)}
        hoveredProjectId={hoveredProjectId}
        setHoveredProjectId={setHoveredProjectId}
        onActiveProjectChange={setActiveProjectIndex}
        onLoaded={() => setIsLoaded(true)}
        theme={theme}
      />

      {/* Persistent Navigation Header */}
      <Header
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onOpenContact={() => setIsContactModalOpen(true)}
        onScrollToHome={handleScrollToHome}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Hero Bottom Overlay */}
      <HeroOverlay
        scrollProgress={scrollProgress}
        onExploreProjects={handleExploreProjects}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        theme={theme}
      />

      {/* Tunnel Bottom HUD (as seen in friend's design) */}
      <TunnelHUD
        scrollProgress={scrollProgress}
        activeProjectIndex={
          selectedProjectId
            ? Math.max(0, projectsList.findIndex(p => p.id === selectedProjectId))
            : activeProjectIndex
        }
        selectedProjectId={selectedProjectId}
        onSelectProject={(id) => setSelectedProjectId(id)}
        onNavigateProject={handleNavigateProject}
        onScrollToHome={() => {
          setSelectedProjectId(null);
          handleScrollToHome();
        }}
        theme={theme}
      />

      {/* Floating Interactive Modals */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        onOpenContact={() => setIsContactModalOpen(true)}
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      <ProjectModal
        selectedProjectId={selectedProjectId}
        onClose={() => setSelectedProjectId(null)}
        onSelectProject={(id) => setSelectedProjectId(id)}
        onOpenContact={() => setIsContactModalOpen(true)}
        onOpenAbout={() => setIsAboutModalOpen(true)}
      />

      {/* Scroll Spacer for smooth 3D flight camera control */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative z-10 w-full"
        style={{ height: '1000vh', minHeight: '1000vh' }}
      />
    </main>
  );
}
