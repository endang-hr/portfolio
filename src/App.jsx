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

  const handleExploreProjects = () => {
    handleNavigateProject(0);
  };

  const handleScrollToHome = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.2 });
    }
  };

  const handleNavigateProject = (idx) => {
    setActiveProjectIndex(idx);
    if (lenisRef.current && projectsList[idx]) {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const startCamZ = 9.5;
      const lastProject = projectsList[projectsList.length - 1];
      const endCamZ = lastProject ? (lastProject.zPosition - 14) : -65;
      const targetCamZ = projectsList[idx].zPosition + 6.35;
      const targetSp = Math.min(0.98, Math.max(0.05, (targetCamZ - startCamZ) / (endCamZ - startCamZ)));
      lenisRef.current.scrollTo(maxScroll * targetSp, { duration: 1.3 });
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-[#050505] text-white touch-pan-y" style={{ touchAction: 'pan-y' }}>
      {/* Intro Loading Screen */}
      <IntroLoader isLoaded={isLoaded} progress={85} />

      {/* 3D WebGL Flythrough Canvas */}
      <FlythroughScene
        scrollProgress={scrollProgress}
        selectedProjectId={selectedProjectId}
        onSelectProject={(id) => setSelectedProjectId(id)}
        hoveredProjectId={hoveredProjectId}
        setHoveredProjectId={setHoveredProjectId}
        onActiveProjectChange={setActiveProjectIndex}
        onLoaded={() => setIsLoaded(true)}
      />

      {/* Persistent Navigation Header */}
      <Header
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onOpenContact={() => setIsContactModalOpen(true)}
        onScrollToHome={handleScrollToHome}
      />

      {/* Hero Bottom Overlay */}
      <HeroOverlay
        scrollProgress={scrollProgress}
        onExploreProjects={handleExploreProjects}
        onOpenAbout={() => setIsAboutModalOpen(true)}
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
