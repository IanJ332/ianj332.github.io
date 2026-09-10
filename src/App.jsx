import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import {
    greeting,
    workExperiences,
    bigProjects,
    socialMediaLinks,
    contactInfo,
    educationInfo,
} from './data/portfolio';
import { Github, Linkedin, Mail, ArrowRight, ExternalLink, Sun, Moon, ArrowDown } from 'lucide-react';
import ExpertiseSection from './components/ExpertiseSection';
import FloatingBadges from './components/FloatingBadges';
import CustomCursor from './components/CustomCursor';
import TiltCard from './components/TiltCard';
import { formatText } from './utils/formatText';

/* Three.js + drei + postprocessing are ~850 kB of the bundle and none of it is
   needed to paint the first screen. Splitting the canvas behind React.lazy
   keeps the initial chunk to React + framer-motion, so the hero text and glass
   panels (the LCP candidates) render while the 3D scene streams in. */
const FullscreenAvatarCanvas = lazy(() => import('./components/AvatarCanvas'));

/* Painted immediately, with no JS dependencies, so the viewport is never blank
   while the WebGL chunk downloads. Must match --bg-main and the stage wash in
   AvatarCanvas.jsx exactly, or the swap-in is visible as a colour flash. */
const StageFallback = ({ theme }) => (
    <div
        className="avatar-stage"
        aria-hidden="true"
        style={{ backgroundColor: theme === 'dark' ? '#07070B' : '#F5F2EB' }}
    />
);

/* ═══════════════════════════════════════════════════════════
   MOTION PRESETS
   ═══════════════════════════════════════════════════════════ */
const EASE = [0.16, 1, 0.3, 1];
const VIEWPORT = { once: true, margin: '-60px' };

const riseIn = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, delay: i * 0.08, ease: EASE },
    }),
};

/* ═══════════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════════ */
const useTheme = () => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('portfolio-theme') || 'dark';
        }
        return 'dark';
    });

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle('dark', theme === 'dark');
        root.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }, []);

    return { theme, toggleTheme, isDark: theme === 'dark' };
};

const SECTION_IDS = ['about', 'trajectory', 'expertise', 'projects', 'academic'];

const useScrollSection = () => {
    const [currentSection, setCurrentSection] = useState('about');

    useEffect(() => {
        const ratios = new Map();

        const pickBest = () => {
            let best = null;
            let bestRatio = 0;
            ratios.forEach((ratio, id) => {
                if (ratio > bestRatio) {
                    bestRatio = ratio;
                    best = id;
                }
            });
            if (best && bestRatio > 0.12) setCurrentSection(best);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => ratios.set(entry.target.id, entry.intersectionRatio));
                pickBest();
            },
            { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1], rootMargin: '-15% 0px -25% 0px' }
        );

        SECTION_IDS.forEach((id) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    return currentSection;
};

/* ═══════════════════════════════════════════════════════════
   PRIMITIVES
   ═══════════════════════════════════════════════════════════ */

/* Entrance animation lives on the OUTER motion element; the glass surface and
   its pointer-driven tilt live on an INNER TiltCard. They must stay separate:
   framer writes an inline `transform` when an animation settles, so a single
   element cannot own both an entrance offset and a live tilt. */
const RevealCard = ({ children, className = '', index = 0, variants = riseIn, tilt = {}, ...rest }) => (
    <motion.div
        custom={index}
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        {...rest}
    >
        <TiltCard className={className} {...tilt}>
            {children}
        </TiltCard>
    </motion.div>
);

const LogoContainer = ({ src, alt, fallbackText, size = 'md' }) => {
    const [hasError, setHasError] = useState(false);
    const sizeClasses = size === 'sm' ? 'w-10 h-10' : 'w-12 h-12';

    return (
        <div
            className={`${sizeClasses} rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-sm ring-1 ring-black/5 overflow-hidden`}
        >
            {!src || hasError ? (
                <div className="w-full h-full flex items-center justify-center text-display text-sm text-indigo-600 bg-indigo-50 uppercase select-none rounded-lg">
                    {fallbackText}
                </div>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    className="w-full h-full object-contain"
                    onError={() => setHasError(true)}
                />
            )}
        </div>
    );
};

const SectionHeading = ({ number, label, align = 'left' }) => (
    <motion.div
        className={`flex items-end gap-5 mb-10 ${align === 'right' ? 'lg:justify-start' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.7, ease: EASE }}
    >
        <span className="section-number">{number}</span>
        <div className="pb-2 flex-1">
            <span className="section-label">{label}</span>
            <div className="section-rule mt-3" />
        </div>
    </motion.div>
);

/* ═══════════════════════════════════════════════════════════
   NAVIGATION — floating pill
   ═══════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Trajectory', href: '#trajectory', id: 'trajectory' },
    { label: 'Skills', href: '#expertise', id: 'expertise' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Academic', href: '#academic', id: 'academic' },
];

const Navbar = ({ theme, toggleTheme, currentSection }) => (
    <motion.nav
        className="fixed top-4 left-0 w-full z-40 px-4 md:px-8 pointer-events-none"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
    >
        <div className="nav-pill pointer-events-auto mx-auto max-w-5xl flex items-center justify-between gap-4 pl-4 pr-2 py-2">
            <a href="#about" className="flex items-center gap-2.5 group shrink-0 cursor-pointer">
                <span className="w-7 h-7 rounded-lg bg-[var(--text-accent)]/12 ring-1 ring-[var(--text-accent)]/25 flex items-center justify-center group-hover:bg-[var(--text-accent)]/20 transition-colors">
                    <span className="text-display text-[11px] text-[var(--text-accent)]">IJ</span>
                </span>
                <span className="text-code text-[11px] text-[var(--text-main)] tracking-[0.18em] uppercase font-medium">
                    Ian Jiang
                </span>
            </a>

            <div className="hidden md:flex items-center gap-7">
                {NAV_ITEMS.map((item) => (
                    <a
                        key={item.id}
                        href={item.href}
                        data-active={currentSection === item.id}
                        className="nav-link cursor-pointer"
                    >
                        {item.label}
                    </a>
                ))}
            </div>

            <button
                onClick={toggleTheme}
                className="btn-icon !w-9 !h-9 !rounded-full shrink-0 cursor-pointer"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
        </div>
    </motion.nav>
);

/* ═══════════════════════════════════════════════════════════
   TERMINAL IDENTITY CARD
   ═══════════════════════════════════════════════════════════ */
const TerminalRow = ({ prompt, children }) => (
    <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
            <span className="text-emerald-500 dark:text-emerald-400 text-code text-[11px] select-none">$</span>
            <span className="text-[var(--text-faint)] text-code text-[10px] uppercase tracking-[0.16em]">
                {prompt}
            </span>
        </div>
        <div className="pl-5 text-[var(--text-main)] text-code text-[12px] leading-[1.55]">{children}</div>
    </div>
);

const TerminalIdentityPanel = ({ stars }) => (
    <TiltCard className="terminal-window max-w-sm w-full" max={6}>
        <div className="terminal-header">
            <div className="flex gap-2">
                <span className="terminal-dot bg-[#FF5F56]" />
                <span className="terminal-dot bg-[#FFBD2E]" />
                <span className="terminal-dot bg-[#27C93F]" />
            </div>
            <span className="text-code text-[10px] text-[var(--text-faint)] uppercase tracking-[0.2em]">
                zsh — identity.sh
            </span>
            <span className="w-8" />
        </div>

        <div className="p-5 space-y-3.5">
            <TerminalRow prompt="iam whoami">Student / Software Engineer / ML Engineer</TerminalRow>
            <TerminalRow prompt="iam focus">GAN · LLM infra · RAG · multimodal · AI guardrails</TerminalRow>
            <TerminalRow prompt="iam current">UIUC AI Alignment Lab</TerminalRow>
            <TerminalRow prompt="iam github contributor">
                {stars && stars !== 'GitHub stars unavailable' ? (
                    <a
                        href={socialMediaLinks.agenticSkillsRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-code text-[11px] px-2 py-0.5 rounded-full text-amber-600 dark:text-amber-300 bg-amber-500/10 border border-amber-500/25 hover:border-amber-500/60 transition-colors cursor-pointer"
                    >
                        ★ {stars} stars
                    </a>
                ) : (
                    <span className="text-[var(--text-faint)] italic text-code text-[11px]">
                        {stars || 'Loading…'}
                    </span>
                )}
            </TerminalRow>
            <TerminalRow prompt="iam practice">development · deployment · optimization</TerminalRow>
            <TerminalRow prompt="iam stack">Python · Java · JavaScript · and more</TerminalRow>
        </div>
    </TiltCard>
);

/* ═══════════════════════════════════════════════════════════
   01 — HERO
   ═══════════════════════════════════════════════════════════ */
const HeroSection = ({ stars }) => (
    <section id="about" className="min-h-svh relative flex flex-col justify-end pb-14 pt-32">
        <motion.div
            className="absolute top-[18vh] left-6 md:left-12 pointer-events-none select-none"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, ease: EASE }}
        >
            <h1 className="text-display text-[length:var(--fs-hero)] text-[var(--text-main)] opacity-[0.06] leading-[0.86]">
                ML
                <br />
                Engineer
            </h1>
        </motion.div>

        <div className="container mx-auto px-6 md:px-12 relative">
            <div className="flex flex-col lg:flex-row items-end justify-between gap-8">
                <motion.div
                    className="w-full max-w-md lg:w-auto"
                    initial={{ opacity: 0, y: 36 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
                >
                    <TiltCard className="glass-panel glass-panel-solid p-7 md:p-8" max={5}>
                        <div className="eyebrow mb-5">
                            <span className="text-[var(--text-accent)] font-semibold">01</span>
                            <span className="w-6 h-px bg-[var(--border-strong)]" />
                            <span>Hero / Introduction</span>
                        </div>

                        <h2 className="text-display text-[length:var(--fs-h1)] text-[var(--text-main)] mb-4">
                            ML Engineer &<br />Software Engineer
                        </h2>

                        <p className="text-body text-[var(--text-dim)] mb-7 max-w-sm">
                            Building AI systems, backend infrastructure, and production-facing applications.
                            Focused on LLM infrastructure, retrieval systems, and practical guardrails for
                            safer AI.
                        </p>

                        <div className="flex flex-wrap items-center gap-3">
                            {greeting.resumeLink && (
                                <a
                                    href={greeting.resumeLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary cursor-pointer"
                                >
                                    Resume <ExternalLink size={12} />
                                </a>
                            )}
                            <div className="flex items-center gap-2">
                                {[
                                    { href: socialMediaLinks.github, icon: Github, label: 'GitHub' },
                                    { href: socialMediaLinks.linkedin, icon: Linkedin, label: 'LinkedIn' },
                                    { href: `mailto:${contactInfo.email_address}`, icon: Mail, label: 'Email' },
                                ].map(({ href, icon: Icon, label }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target={label !== 'Email' ? '_blank' : undefined}
                                        rel={label !== 'Email' ? 'noopener noreferrer' : undefined}
                                        className="btn-icon cursor-pointer"
                                        aria-label={label}
                                    >
                                        <Icon size={15} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </TiltCard>
                </motion.div>

                <motion.div
                    className="hidden lg:block"
                    initial={{ opacity: 0, y: 36 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.32, ease: EASE }}
                >
                    <TerminalIdentityPanel stars={stars} />
                </motion.div>
            </div>

            <motion.div
                className="flex flex-col items-center gap-2 mt-14"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
            >
                <span className="text-code text-[9px] uppercase tracking-[0.32em] text-[var(--text-faint)]">
                    Scroll to explore
                </span>
                <ArrowDown size={12} className="text-[var(--text-accent)] animate-bounce" />
            </motion.div>
        </div>
    </section>
);

/* ═══════════════════════════════════════════════════════════
   02 — TRAJECTORY
   ═══════════════════════════════════════════════════════════ */
const ExperienceSection = () => (
    <section id="trajectory" className="py-24 md:py-36 relative">
        <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-2xl lg:max-w-[56%]">
                <SectionHeading number="02" label="Trajectory & Work Experience" />

                <div className="relative pl-7 md:pl-11 ml-2 space-y-6">
                    <div className="timeline-rail absolute left-0 top-2 bottom-2 w-px" />

                    {workExperiences.experience.map((exp, i) => {
                        const initial = exp.company ? exp.company.charAt(0).toUpperCase() : 'C';
                        return (
                            <RevealCard key={i} index={i} className="glass-panel p-6 md:p-7 group">
                                <span className="timeline-node absolute -left-[33px] md:-left-[49px] top-7 w-3 h-3 rounded-full" />

                                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                                    <span className="meta-pill meta-pill-accent">{exp.date}</span>
                                    {exp.location && (
                                        <span className="text-code text-[10px] text-[var(--text-faint)]">
                                            {exp.location}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3.5 mb-4">
                                    <LogoContainer
                                        src={exp.companylogo}
                                        alt={exp.company}
                                        fallbackText={initial}
                                        size="sm"
                                    />
                                    <div className="min-w-0">
                                        <h3 className="text-display-light text-[length:var(--fs-h3)] text-[var(--text-main)]">
                                            {exp.role}
                                        </h3>
                                        {exp.url ? (
                                            <a
                                                href={exp.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="link-underline text-code text-[12px] cursor-pointer"
                                            >
                                                @ {exp.company}
                                            </a>
                                        ) : (
                                            <span className="text-code text-[12px] text-[var(--text-dim)]">
                                                @ {exp.company}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {exp.descBullets && (
                                    <ul className="space-y-2.5 pt-4 border-t border-[var(--border-dim)]">
                                        {exp.descBullets.map((bullet, bi) => (
                                            <li
                                                key={bi}
                                                className="text-body text-[13.5px] text-[var(--text-dim)] flex gap-2.5 items-start"
                                            >
                                                <span className="mt-[0.6em] w-1 h-1 rounded-full bg-[var(--text-accent)] shrink-0" />
                                                <span>{formatText(bullet)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </RevealCard>
                        );
                    })}
                </div>
            </div>
        </div>
    </section>
);

/* ═══════════════════════════════════════════════════════════
   04 — SELECTED WORKS
   ═══════════════════════════════════════════════════════════ */
const ProjectsSection = ({ stars }) => (
    <section id="projects" className="py-24 md:py-36 relative">
        <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-2xl lg:max-w-[58%]">
                <SectionHeading number="04" label="Selected Works & Research" />

                <div className="space-y-5 mb-14">
                    {bigProjects.featuredProjects.map((project, i) => {
                        const isAgenticSkills = project.projectName === 'Agentic Awesome Skills';
                        const initial = project.projectName
                            ? project.projectName.charAt(0).toUpperCase()
                            : 'P';

                        return (
                            <RevealCard key={i} index={i} className="glass-panel p-6 md:p-8">
                                <div className="flex items-center gap-3.5 mb-4">
                                    <LogoContainer
                                        src={project.image}
                                        alt={project.projectName}
                                        fallbackText={initial}
                                        size="sm"
                                    />
                                    <div className="min-w-0">
                                        <h3 className="text-display-light text-[length:var(--fs-h3)] text-[var(--text-main)]">
                                            {project.projectName}
                                        </h3>
                                        {isAgenticSkills && stars && stars !== 'GitHub stars unavailable' && (
                                            <span className="inline-flex items-center gap-1 mt-1 text-code text-[10px] px-2 py-0.5 rounded-full text-amber-600 dark:text-amber-300 bg-amber-500/10 border border-amber-500/25">
                                                ★ {stars} stars
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <p className="text-body text-[13.5px] text-[var(--text-dim)] mb-5">
                                    {formatText(project.featuredSummary)}
                                </p>

                                <div className="flex flex-wrap gap-1.5 mb-5">
                                    {project.stack.map((tech, ti) => (
                                        <span key={ti} className="skill-tag">
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                {project.footerLink &&
                                    project.footerLink.map((link, li) => (
                                        <a
                                            key={li}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group/link inline-flex items-center gap-2 pt-4 border-t border-[var(--border-dim)] w-full text-code text-[11px] uppercase tracking-[0.18em] text-[var(--text-accent)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                                        >
                                            {link.name}
                                            <ArrowRight
                                                size={12}
                                                className="-rotate-45 transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
                                            />
                                        </a>
                                    ))}
                            </RevealCard>
                        );
                    })}
                </div>

                <div className="pt-8 border-t border-[var(--border-dim)]">
                    <h3 className="section-label mb-6">More Open Source & Research</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {bigProjects.otherProjects.map((project, i) => (
                            <RevealCard
                                key={i}
                                index={i}
                                className="glass-panel-subtle p-5 h-full flex flex-col justify-between"
                            >
                                <div>
                                    <h4 className="text-display-light text-[15px] text-[var(--text-main)] mb-2">
                                        {project.projectName}
                                    </h4>
                                    <p className="text-body text-[12.5px] text-[var(--text-dim)] mb-4">
                                        {project.description}
                                    </p>
                                </div>
                                <div className="flex justify-between items-center gap-3 pt-3 border-t border-[var(--border-dim)]">
                                    <span className="text-code text-[10px] text-[var(--text-faint)] uppercase tracking-[0.12em]">
                                        {project.stack[0]}
                                    </span>
                                    {project.footerLink && (
                                        <a
                                            href={project.footerLink[0].url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="link-underline text-code text-[11px] cursor-pointer"
                                        >
                                            ↗ Code
                                        </a>
                                    )}
                                </div>
                            </RevealCard>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </section>
);

/* ═══════════════════════════════════════════════════════════
   05 — ACADEMIC
   ═══════════════════════════════════════════════════════════ */
const AcademicSection = () => (
    <section id="academic" className="py-24 md:py-36 relative">
        <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-2xl lg:max-w-[58%]">
                <SectionHeading number="05" label="Academic Credentials" />

                <div className="grid grid-cols-1 gap-5">
                    {educationInfo.schools.map((school, i) => {
                        const initial = school.schoolName ? school.schoolName.charAt(0).toUpperCase() : 'E';
                        return (
                            <RevealCard key={i} index={i} className="glass-panel p-6 md:p-7">
                                <div className="flex items-start justify-between gap-4 mb-5">
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <LogoContainer
                                            src={school.logo}
                                            alt={school.schoolName}
                                            fallbackText={initial}
                                            size="sm"
                                        />
                                        <div className="min-w-0">
                                            <h3 className="text-display-light text-[length:var(--fs-h3)] text-[var(--text-main)]">
                                                {school.schoolName}
                                            </h3>
                                            <p className="text-code text-[11px] uppercase tracking-[0.14em] text-[var(--text-accent)] mt-0.5">
                                                {school.subHeader}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="meta-pill hidden sm:inline-flex">{school.duration}</span>
                                </div>

                                <div className="space-y-2.5 pt-4 border-t border-[var(--border-dim)]">
                                    {school.descBullets.map((bullet, bi) => (
                                        <p
                                            key={bi}
                                            className="text-body text-[13.5px] text-[var(--text-dim)] flex items-start gap-2.5"
                                        >
                                            <span className="mt-[0.6em] w-1 h-1 rounded-full bg-[var(--text-accent)] shrink-0" />
                                            {bullet}
                                        </p>
                                    ))}
                                </div>
                            </RevealCard>
                        );
                    })}
                </div>
            </div>
        </div>
    </section>
);

/* ═══════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */
/* No `border-t` on the <footer> itself: a full-width rule on a section that
   spans the viewport draws a hard horizontal line straight across the fixed 3D
   canvas — that was the line cutting through the avatar's chest. Any rule has
   to live inside the constrained content column instead. */
const Footer = () => (
    <footer id="contact" className="relative py-20 mt-8">
        <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-2xl lg:max-w-[58%]">
                <div className="section-rule mb-12" />
                <TiltCard className="glass-panel glass-panel-solid p-7 md:p-9 flex flex-col md:flex-row justify-between md:items-end gap-8" max={4}>
                    <div>
                        <span className="section-label">Get in touch</span>
                        <h2 className="text-display text-[length:var(--fs-h2)] text-[var(--text-main)] mt-3 mb-3">
                            Let's build something.
                        </h2>
                        <a
                            href={`mailto:${contactInfo.email_address}`}
                            className="link-underline text-code text-[15px] cursor-pointer"
                        >
                            {contactInfo.email_address}
                        </a>
                    </div>

                    <div className="flex flex-col md:items-end gap-4">
                        <div className="flex items-center gap-5">
                            {[
                                { label: 'GitHub', href: socialMediaLinks.github },
                                { label: 'LinkedIn', href: socialMediaLinks.linkedin },
                                { label: 'Medium', href: socialMediaLinks.medium },
                            ].map(({ label, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="nav-link cursor-pointer"
                                >
                                    {label}
                                </a>
                            ))}
                        </div>
                        <p className="text-code text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
                            © {new Date().getFullYear()} Ian Jiang · React &amp; Three.js
                        </p>
                    </div>
                </TiltCard>
            </div>
        </div>
    </footer>
);

/* Theme and section changes only affect the fixed UI layers. Keeping the long,
   static content tree memoized avoids reconciling every card during those
   interactions; CSS variables still update its appearance exactly as before. */
const PageContent = React.memo(({ stars }) => (
    <main className="relative z-10">
        <HeroSection stars={stars} />
        <ExperienceSection />
        <ExpertiseSection />
        <ProjectsSection stars={stars} />
        <AcademicSection />
        <Footer />
    </main>
));

/* ═══════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════ */
const App = () => {
    const { theme, toggleTheme } = useTheme();
    const currentSection = useScrollSection();
    const [stars, setStars] = useState(null);

    useEffect(() => {
        fetch('/stars.json')
            .then((res) => res.json())
            .then((data) => {
                if (data.message) setStars(data.message);
            })
            .catch(() => setStars('GitHub stars unavailable'));
    }, []);

    return (
        <div className="min-h-svh relative noise-overlay">
            <CustomCursor />

            <Suspense fallback={<StageFallback theme={theme} />}>
                <FullscreenAvatarCanvas currentSection={currentSection} theme={theme} />
            </Suspense>

            <FloatingBadges currentSection={currentSection} />

            <Navbar theme={theme} toggleTheme={toggleTheme} currentSection={currentSection} />

            {/* z-10 keeps content above the WebGL stage. Critically, <main> has
                no opacity / filter / isolation of its own — any of those would
                turn it into a backdrop root and blank out every glass panel. */}
            <PageContent stars={stars} />
        </div>
    );
};

export default App;
