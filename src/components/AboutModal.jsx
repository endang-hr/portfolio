import React, { useState } from 'react';
import {
  X,
  Globe,
  Briefcase,
  Award,
  Code,
  ExternalLink,
  Github,
  Linkedin,
  Instagram,
  Mail,
  Sparkles,
  Layers,
  Camera,
  Maximize2,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import {
  portfolioProfile,
  aboutContent,
  careerTimeline,
  awardsList,
  skillsData,
  projectsList,
  itDocumentation
} from '../data/portfolioData';

export default function AboutModal({ isOpen, onClose, onOpenContact }) {
  const [activeTab, setActiveTab] = useState('biography');
  const [selectedDocImage, setSelectedDocImage] = useState(null);

  // Escape key to close modal or lightbox
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedDocImage) {
          setSelectedDocImage(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, selectedDocImage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 animate-fadeIn" data-lenis-prevent="true">
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div
        className="relative z-10 flex flex-col w-full max-w-4xl max-h-[90vh] rounded-3xl border border-white/15 bg-[#09090c]/95 shadow-[0_0_80px_rgba(0,0,0,0.9)] backdrop-blur-2xl overflow-hidden transition-all duration-300 my-auto"
        style={{
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
        data-lenis-prevent="true"
      >
        
        {/* Top Header Card with Rich Dizzo-Style Gradient */}
        <div className="profile-gradient-header flex-shrink-0 p-5 sm:p-6 md:p-8">
          {/* Ambient radial teal glow behind avatar */}
          <div className="pointer-events-none absolute -left-10 -top-10 h-64 w-64 rounded-full bg-cyan-500/25 blur-3xl" />
          <div className="pointer-events-none absolute left-1/4 -top-16 h-48 w-80 rounded-full bg-teal-500/15 blur-3xl" />
          {/* Close button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close modal"
            className="absolute top-5 right-5 sm:top-6 sm:right-6 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 hover:border-white/50 hover:bg-white hover:text-black transition-all cursor-pointer shadow-lg"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Profile Avatar with Cyan Glow */}
              <div className="about-avatar">
                <img
                  src={portfolioProfile.profileImage}
                  alt={portfolioProfile.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    // Fallback avatar graphic
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              {/* Identity & Status */}
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="font-serif italic text-2xl sm:text-3xl text-white tracking-tight">
                    {portfolioProfile.name}
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-cyan-400 font-medium mt-1">
                  {portfolioProfile.role}
                </p>
                <p className="text-[11px] sm:text-xs text-white/60 mt-1 max-w-xl leading-relaxed">
                  {portfolioProfile.specialization}
                </p>

                {/* Social icons */}
                <div className="flex items-center gap-2 mt-3">
                  <a
                    href={portfolioProfile.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub Profile"
                    title="GitHub"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 hover:border-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Github className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={portfolioProfile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn Profile"
                    title="LinkedIn"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 hover:border-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={portfolioProfile.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram Profile"
                    title="Instagram"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 hover:border-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Instagram className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Contact Button */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenContact();
              }}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-white/90 transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Contact</span>
            </button>
          </div>

          {/* Tab Navigation Pill Bar */}
          <div className="flex flex-wrap items-center gap-2 mt-6 pt-2 border-t border-white/5">
            {[
              { id: 'biography', label: 'Biography', icon: Globe },
              { id: 'experience', label: 'Experience & Education', icon: Briefcase },
              { id: 'documentation', label: `Dokumentasi IT (${itDocumentation.length})`, icon: Camera },
              { id: 'awards', label: `Awards & Certifications (${awardsList.length})`, icon: Award },
              { id: 'skills', label: 'Tech Stack & Skills', icon: Code }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-black font-semibold shadow-md'
                      : 'border border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Tab Content Body */}
        <div
          className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 md:p-8 custom-drawer-scroll space-y-6 overscroll-contain"
          style={{
            flex: '1 1 0%',
            minHeight: 0,
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch'
          }}
          data-lenis-prevent="true"
        >
          
          {/* TAB 1: BIOGRAPHY */}
          {activeTab === 'biography' && (
            <div className="space-y-6 animate-fadeIn">
              {/* 3 Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
                  <span className="font-serif italic text-3xl sm:text-4xl text-white">2+</span>
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-white/45 mt-1">
                    Years Designing &amp; Coding
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
                  <span className="font-serif italic text-3xl sm:text-4xl text-cyan-400">{projectsList.length}</span>
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-white/45 mt-1">
                    Flagship Works
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
                  <span className="font-serif italic text-3xl sm:text-4xl text-amber-400">{awardsList.length}</span>
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-white/45 mt-1">
                    Certifications &amp; Honors
                  </p>
                </div>
              </div>

              {/* Bio Paragraphs */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 space-y-4 text-xs sm:text-sm leading-relaxed text-white/75">
                {aboutContent.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Core Philosophy Box */}
              {aboutContent.philosophy && (
                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
                  <div className="flex items-center gap-2 text-cyan-300">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Filosofi &amp; Pendekatan</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-white/70 sm:text-sm">
                    {aboutContent.philosophy}
                  </p>
                </div>
              )}

              {/* Core Focus & Specializations */}
              {aboutContent.focusAreas && aboutContent.focusAreas.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wider text-cyan-400 uppercase mb-3">
                    <Layers className="h-3.5 w-3.5" />
                    Area Fokus &amp; Keahlian
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {aboutContent.focusAreas.map((area, idx) => (
                      <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            {area.badge && (
                              <span className="text-sm">{area.badge}</span>
                            )}
                            <h4 className="text-xs sm:text-sm font-semibold text-white">{area.title}</h4>
                          </div>
                          <p className="text-[11px] text-white/65 leading-relaxed">
                            {area.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EXPERIENCE & EDUCATION */}
          {activeTab === 'experience' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Work Section */}
              <div>
                <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wider text-cyan-400 uppercase mb-4">
                  <Briefcase className="h-3.5 w-3.5" />
                  Work &amp; Internship Experience
                </h3>
                <div className="space-y-3">
                  {careerTimeline.work.map((item, idx) => (
                    <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 transition-colors hover:border-white/20">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="text-sm sm:text-base font-semibold text-white">{item.role}</h4>
                        <span className="text-[11px] text-white/40">{item.period}</span>
                      </div>
                      <p className="text-xs text-white/60 mt-0.5">{item.company} • {item.location}</p>
                      <ul className="mt-3 space-y-1.5 list-disc list-inside text-xs text-white/70">
                        {item.points.map((pt, ptIdx) => (
                          <li key={ptIdx}>{pt}</li>
                        ))}
                      </ul>

                      {item.company.includes('CBA') && (
                        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[11px] text-white/50">Dokumentasi riil lapangan: Fiber Optik, Rack Server, NVR, CCTV &amp; Printer</span>
                          <button
                            type="button"
                            onClick={() => setActiveTab('documentation')}
                            className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold text-cyan-300 hover:bg-cyan-400/20 hover:border-cyan-400 transition-all cursor-pointer shadow-sm"
                          >
                            <Camera className="h-3 w-3" />
                            <span>Buka Dokumentasi IT ({itDocumentation.length} Foto) →</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Education Section */}
              <div>
                <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wider text-cyan-400 uppercase mb-4">
                  <Globe className="h-3.5 w-3.5" />
                  Education
                </h3>
                <div className="space-y-3">
                  {careerTimeline.education.map((edu, idx) => (
                    <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 transition-colors hover:border-white/20">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="text-sm sm:text-base font-semibold text-white">{edu.degree}</h4>
                        <span className="text-[11px] text-white/40">{edu.period}</span>
                      </div>
                      <p className="text-xs text-white/60 mt-0.5">{edu.institution} • {edu.location}</p>
                      {edu.gpa && (
                        <p className="text-xs font-medium text-emerald-400 mt-2">
                          {edu.gpa.includes('/') || (!isNaN(edu.gpa[0]) && edu.gpa.includes('.')) ? `GPA / Score: ${edu.gpa}` : edu.gpa}
                        </p>
                      )}
                      <p className="text-xs text-white/65 mt-1">{edu.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organization Section */}
              <div>
                <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wider text-cyan-400 uppercase mb-4">
                  <Award className="h-3.5 w-3.5" />
                  Organization &amp; Leadership
                </h3>
                <div className="space-y-3">
                  {careerTimeline.organization.map((org, idx) => (
                    <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 transition-colors hover:border-white/20">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="text-sm sm:text-base font-semibold text-white">{org.role}</h4>
                        <span className="text-[11px] text-white/40">{org.period}</span>
                      </div>
                      <p className="text-xs text-white/60 mt-0.5">{org.organization} • {org.location}</p>
                      <ul className="mt-3 space-y-1.5 list-disc list-inside text-xs text-white/70">
                        {org.points.map((pt, ptIdx) => (
                          <li key={ptIdx}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: IT OPERATIONS & FIELD DOCUMENTATION */}
          {activeTab === 'documentation' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header Info Banner */}
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Camera className="h-4 w-4" />
                    <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider">
                      Dokumentasi Lapangan &amp; Infrastruktur IT
                    </h3>
                  </div>
                  <p className="text-xs text-white/70 mt-1.5 leading-relaxed max-w-2xl">
                    Dokumentasi otentik pelaksanaan tugas IT Support &amp; Infrastructure di lingkungan industri: perakitan &amp; terminasi fiber optik, manajemen server rack, cluster NVR/CCTV, serta diagnostik hardware workstation.
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                  {itDocumentation.length} Dokumentasi Riil
                </span>
              </div>

              {/* Grid of Documentation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {itDocumentation.map((doc) => (
                  <div
                    key={doc.id}
                    className="group rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/[0.05] flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Thumbnail with Click-to-Zoom */}
                      <div
                        onClick={() => setSelectedDocImage(doc)}
                        className="relative w-full aspect-[16/10] overflow-hidden bg-black/60 cursor-pointer"
                      >
                        <img
                          src={doc.image}
                          alt={doc.title}
                          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-75 group-hover:opacity-50 transition-opacity" />

                        {/* Top Badge */}
                        <div className="absolute top-3 left-3 z-10">
                          <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/70 px-2.5 py-1 text-[10px] font-medium text-white/95 backdrop-blur-md shadow-sm">
                            {doc.badge}
                          </span>
                        </div>

                        {/* Bottom-Right Zoom Pill */}
                        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-medium text-white/80 backdrop-blur-md transition-colors group-hover:bg-cyan-400 group-hover:text-black shadow-md">
                          <Maximize2 className="h-3 w-3" />
                          <span>Klik Perbesar</span>
                        </div>
                      </div>

                      {/* Content Card Body */}
                      <div className="p-4 sm:p-5">
                        <div className="flex items-center gap-1.5 text-[11px] text-cyan-400/80 mb-1.5">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span>{doc.location}</span>
                        </div>

                        <h4 className="font-serif italic text-base sm:text-lg text-white group-hover:text-cyan-200 transition-colors leading-snug">
                          {doc.title}
                        </h4>

                        <p className="text-xs text-white/70 mt-2.5 leading-relaxed">
                          {doc.description}
                        </p>

                        {/* Equipment Badges */}
                        <div className="mt-3.5 pt-3 border-t border-white/10">
                          <span className="text-[10px] uppercase tracking-wider text-white/40 block mb-1.5 font-semibold">
                            Peralatan &amp; Cakupan:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {doc.equipment.map((eq, eqIdx) => (
                              <span
                                key={eqIdx}
                                className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/75"
                              >
                                {eq}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Highlights */}
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {doc.highlights.map((hl, hlIdx) => (
                          <span
                            key={hlIdx}
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2 py-0.5"
                          >
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            <span>{hl}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AWARDS & CERTIFICATIONS */}
          {activeTab === 'awards' && (
            <div className="space-y-4 animate-fadeIn">
              <p className="text-xs text-white/50">
                Sertifikasi keahlian profesional, partisipasi seminar internasional, dan pelatihan resmi yang telah diselesaikan.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {awardsList.map(award => (
                  <div
                    key={award.id}
                    className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:border-amber-400/40 hover:bg-white/[0.06]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="inline-block rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300">
                          {award.badge}
                        </span>
                        {award.date && (
                          <span className="text-[10px] text-white/40">{award.date}</span>
                        )}
                      </div>

                      {award.previewImage && (
                        <div className="relative mb-3.5 aspect-[16/11] w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
                          <img
                            src={award.previewImage}
                            alt={award.title}
                            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}

                      <h4 className="font-serif italic text-base sm:text-lg text-white group-hover:text-amber-200 transition-colors">
                        {award.title}
                      </h4>
                      <p className="text-xs text-white/50 mt-1 font-medium">{award.event}</p>
                      <p className="text-xs text-white/70 mt-2.5 leading-relaxed">{award.description}</p>
                      {award.credentialNo && (
                        <p className="text-[10px] font-mono text-cyan-400/80 mt-2">
                          ID: {award.credentialNo}
                        </p>
                      )}
                      {award.issuer && (
                        <p className="text-[10px] text-white/50 mt-2 font-mono">
                          {award.issuer}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-white/40">Verified Document</span>
                      <div className="flex items-center gap-3">
                        {award.verificationUrl && (
                          <a
                            href={award.verificationUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors"
                          >
                            <span>Verifikasi</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        )}
                        {award.certificateUrl && (
                          <a
                            href={award.certificateUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-300 hover:text-amber-200 underline underline-offset-4 transition-colors"
                          >
                            <span>Buka Dokumen</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TECH STACK & SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-6 animate-fadeIn">
              <p className="text-xs text-white/50">
                Core technologies, design toolkits, frameworks, and architectural principles.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {skillsData.map((skill, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-white/20 hover:bg-white/[0.06]"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-full shadow-[0_0_12px]"
                        style={{ backgroundColor: skill.color, boxShadow: `0 0 10px ${skill.color}` }}
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-white">{skill.name}</h4>
                        <p className="text-[11px] text-white/50">{skill.level}</p>
                      </div>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] text-white/60">
                      {skill.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* LIGHTBOX MODAL FOR IT DOCUMENTATION */}
      {selectedDocImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn"
          onClick={() => setSelectedDocImage(null)}
        >
          <div
            className="relative z-10 flex flex-col max-w-5xl w-full max-h-[92vh] rounded-3xl border border-white/20 bg-[#0a0a0e]/95 shadow-[0_0_100px_rgba(0,0,0,0.95)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
                  {selectedDocImage.badge}
                </span>
                <span className="text-xs text-white/50 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-cyan-400" />
                  {selectedDocImage.location}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDocImage(null)}
                aria-label="Tutup preview"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 hover:bg-white hover:text-black transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Lightbox Image Viewport */}
            <div className="relative flex-1 min-h-0 bg-black/80 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
              <img
                src={selectedDocImage.image}
                alt={selectedDocImage.title}
                className="max-h-[60vh] sm:max-h-[65vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Lightbox Details Footer */}
            <div className="p-4 sm:p-6 border-t border-white/10 bg-[#0c0d12] space-y-3">
              <h3 className="font-serif italic text-lg sm:text-xl text-white font-normal">
                {selectedDocImage.title}
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                {selectedDocImage.description}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {selectedDocImage.equipment.map((eq, i) => (
                    <span
                      key={i}
                      className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/70"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedDocImage.highlights.map((hl, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2.5 py-0.5"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{hl}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
