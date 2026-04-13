import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { greeting, skillsSection, workExperiences, bigProjects, socialMediaLinks, contactInfo, educationInfo, blogSection } from './data/portfolio';
import { Github, Linkedin, Mail, ArrowRight, Code2, ExternalLink, Sun, Moon, FolderGit2, Terminal, BookOpen } from 'lucide-react';
import ProjectCard from './components/ProjectCard';
import ExpertiseSection from './components/ExpertiseSection';
import { formatText } from './utils/formatText';

/* --- Components --- */

const Navbar = ({ theme, toggleTheme }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ease-out ${scrolled ? 'bg-[var(--bg-main)]/80 backdrop-blur-md border-b border-[var(--border-dim)] py-4' : 'bg-transparent py-8'}`}>
            <div className="container mx-auto px-8 md:px-12 flex justify-between items-center">
                <a href="#" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-full bg-[var(--text-main)]/[0.08] flex items-center justify-center border border-[var(--text-main)]/[0.05] group-hover:bg-[var(--text-main)]/[0.15] transition-colors duration-500">
                        <span className="font-display font-medium text-[var(--text-main)] text-sm">I</span>
                    </div>
                    <span className="font-mono text-[11px] text-[var(--text-dim)] tracking-widest uppercase group-hover:text-[var(--text-main)] transition-colors duration-300">Ian Jiang</span>
                </a>

                <div className="flex items-center gap-8 md:gap-12">
                    <div className="hidden md:flex gap-12">
                        {['About', 'Expertise', 'Work', 'Writing', 'Contact'].map((item) => (
                            <a key={item} href={`#${item.toLowerCase()}`} className="nav-link">
                                {item}
                            </a>
                        ))}
                    </div>

                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-[var(--text-main)]/[0.05] transition-colors text-[var(--text-dim)] hover:text-[var(--text-main)]"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

const TerminalIdentityPanel = ({ stars }) => {
    // Explicit light-on-dark terminal colors that ignore global theme text classes
    const TerminalRow = ({ prompt, children }) => (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-mono text-xs select-none">$</span>
                <span className="text-gray-500 font-mono text-[11px] uppercase tracking-wider">{prompt}</span>
            </div>
            <div className="pl-5 text-gray-100 font-body text-[13px] font-medium leading-relaxed">
                {children}
            </div>
        </div>
    );

    return (
        <div className="relative w-full max-w-sm ml-auto rounded-xl shadow-2xl border border-white/10 bg-[#0A0A0A] overflow-hidden flex flex-col">
            {/* Terminal Header */}
            <div className="bg-[#1A1A1A] px-4 py-2.5 flex items-center justify-between border-b border-white/[0.05]">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>
                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">zsh</span>
                <div className="w-12" />
            </div>

            {/* Terminal Body */}
            <div className="p-5 space-y-5">
                <TerminalRow prompt="iam whoami">
                    Software Engineer / ML Engineer
                </TerminalRow>

                <TerminalRow prompt="iam focus">
                    LLM infra · RAG · multimodal · microservices · AI guardrails
                </TerminalRow>

                <TerminalRow prompt="iam current">
                    UIUC AI Alignment Lab
                </TerminalRow>

                <TerminalRow prompt="iam proof">
                    <div className="flex items-center gap-3">
                        {stars && stars !== 'GitHub stars unavailable' ? (
                            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 font-body font-medium text-[13px] h-[26px] px-2.5 rounded-full shadow-sm">
                                <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path></svg>
                                {stars} stars
                            </span>
                        ) : (
                            <span className="text-gray-500 italic">{stars || 'Loading...'}</span>
                        )}
                        <span className="text-gray-500 tracking-tight">GitHub contributor</span>
                    </div>
                </TerminalRow>

                <TerminalRow prompt="iam practice">
                    development · deployment · optimization
                </TerminalRow>

                <TerminalRow prompt="iam stack">
                    Python · Java · TypeScript · distributed systems
                </TerminalRow>
            </div>
        </div>
    );
};

const Hero = ({ stars }) => {
    return (
        <section id="about" className="min-h-[75vh] flex items-center pt-24 pb-12 relative overflow-hidden">
            {/* Rauno Grid Background */}
            <div className="absolute inset-0 rauno-grid z-0 opacity-40 pointer-events-none" />

            <div className="container mx-auto px-6 md:px-8 relative z-10">
                <div className="max-w-[82rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-medium leading-[1.1] tracking-tight mb-6 text-[var(--text-main)]">
                            ML Engineer & Software Engineer
                        </h1>

                        <div className="flex flex-col gap-8">
                            <p className="text-lg md:text-xl text-[var(--text-dim)]/90 max-w-2xl leading-relaxed font-body">
                                Building AI systems, backend infrastructure, and production-facing applications. Focused on LLM infrastructure, retrieval systems, multimodal inference, and practical guardrails for safer AI use. Currently researching reasoning reliability at UIUC AI Alignment Lab.
                            </p>

                            <div className="flex gap-6">
                                <SocialLink href={socialMediaLinks.github} icon={<Github size={24} />} label="GitHub" />
                                <SocialLink href={socialMediaLinks.linkedin} icon={<Linkedin size={24} />} label="LinkedIn" />
                                <SocialLink href={`mailto:${contactInfo.email_address}`} icon={<Mail size={24} />} label="Email" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Terminal Identity Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                        className="relative hidden lg:flex justify-end pr-8"
                    >
                        <TerminalIdentityPanel stars={stars} />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const SocialLink = ({ href, icon, label }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--text-dim)]/50 hover:text-[var(--text-main)] transition-colors duration-300 transform hover:scale-110"
        aria-label={label}
    >
        {icon}
    </a>
);

// Replaced generic Skills with specialized ExpertiseSection
const Skills = ExpertiseSection;

const Experience = () => {
    return (
        <section id="work" className="py-10 md:py-16 relative">
            <div className="container mx-auto px-6 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <SectionLabel number="02" title="Trajectory" />

                    <div className="relative border-l border-[var(--border-dim)] pl-8 md:pl-12 space-y-16">
                        {/* Gradient Line Overlay */}
                        <div className="absolute left-[-1px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-indigo/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                        {workExperiences.experience.map((exp, i) => (
                            <motion.div
                                key={i}
                                className="relative group"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="absolute -left-[37px] md:-left-[53px] top-3 w-3 h-3 rounded-full bg-[var(--bg-main)] border border-[var(--text-dim)]/[0.2] group-hover:bg-[var(--text-main)] group-hover:scale-125 transition-all duration-500" />

                                <span className="font-mono text-sm text-[var(--text-dim)]/50 uppercase tracking-widest mb-4 block">{exp.date}</span>

                                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 mb-6">
                                    <h3 className="font-display text-3xl md:text-4xl text-[var(--text-main)]">{exp.role}</h3>
                                    {exp.url ? (
                                        <a href={exp.url} target="_blank" rel="noopener noreferrer" className="text-xl md:text-2xl text-[var(--text-dim)]/60 font-serif italic hover:text-[var(--text-main)] hover:underline decoration-[var(--text-dim)]/30 underline-offset-4 transition-all">
                                            @ {exp.company}
                                        </a>
                                    ) : (
                                        <span className="text-xl md:text-2xl text-[var(--text-dim)]/60 font-serif italic">@ {exp.company}</span>
                                    )}
                                </div>

                                {exp.desc && (
                                    <p className="text-[var(--text-dim)]/80 leading-relaxed max-w-4xl mb-6 text-xl font-light">
                                        {formatText(exp.desc)}
                                    </p>
                                )}

                                <ul className="space-y-4">
                                    {exp.descBullets.map((bullet, bi) => (
                                        <li key={bi} className="text-[21px] text-[var(--text-dim)]/80 flex gap-3 items-start leading-relaxed group-hover:text-[var(--text-main)] transition-colors duration-500">
                                            <span className="text-indigo-500/60 mt-2 text-sm select-none">•</span>
                                            <span>{formatText(bullet)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// Featured Project Case Study Row
const FeaturedProject = ({ project, stars }) => {
    const isAntigravity = project.projectName === "Antigravity Awesome Skills";
    
    return (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 py-10 border-b border-[var(--border-dim)] last:border-0 group flex-1">
            <div className="lg:w-1/3 flex flex-col gap-4">
                <div className="flex items-center gap-4 mb-1">
                    <div className="w-[60px] h-[60px] rounded-xl bg-[var(--bg-main)] border border-[var(--border-dim)] flex items-center justify-center shrink-0 shadow-sm">
                        {project.image ? (
                            <img src={project.image} alt="" loading="lazy" className="w-[42px] h-[42px] object-contain" />
                        ) : (
                            <FolderGit2 size={32} className="text-[var(--text-dim)]" strokeWidth={1.5} />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-2xl md:text-3xl font-display font-semibold text-[var(--text-main)] group-hover:text-indigo-500 transition-colors duration-300">
                            {project.projectName}
                        </h3>
                        {isAntigravity && stars && stars !== 'GitHub stars unavailable' && (
                            <div className="mt-1">
                                <span className="inline-flex items-center gap-1 bg-amber-500/5 text-amber-600/80 border border-amber-500/10 text-[11px] px-2 py-0.5 rounded-full font-mono font-medium">
                                    <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path></svg>
                                    {stars}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                    {project.stack.map((tech, i) => (
                        <span key={i} className="px-2.5 py-1 text-[11px] font-mono tracking-widest uppercase border border-[var(--border-dim)] rounded-full text-[var(--text-dim)] bg-[var(--bg-card)]">
                            {tech}
                        </span>
                    ))}
                </div>
                {project.footerLink && project.footerLink.length > 0 && (
                    <div className="mt-auto pt-4 flex flex-col items-start gap-3">
                        {project.footerLink.map((link, i) => (
                            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-[var(--text-main)] hover:text-indigo-500 transition-colors">
                                {link.name} <ArrowRight size={14} className="-rotate-45" />
                            </a>
                        ))}
                    </div>
                )}
            </div>

            <div className="lg:w-2/3 flex flex-col gap-4">
                <p className="text-[21px] md:text-2xl text-[var(--text-main)] font-light leading-relaxed">
                    {formatText(project.featuredSummary)}
                </p>
                {project.descBullets && (
                    <ul className="mt-4 space-y-3">
                        {project.descBullets.map((bullet, bi) => (
                            <li key={bi} className="text-[17px] text-[var(--text-dim)]/90 flex gap-3 leading-relaxed">
                                <span className="text-indigo-500 mt-1.5">•</span>
                                <span>{formatText(bullet)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

// Compact Project List Row (Text-First)
const ProjectListItem = ({ project }) => {
    return (
        <div className="group flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 border-b border-[var(--border-dim)]/50 hover:bg-[var(--text-main)]/[0.02] transition-colors -mx-4 px-4 rounded-xl">
            <div className="flex flex-col gap-1.5 md:w-1/2">
                <h4 className="text-lg font-body font-semibold text-[var(--text-main)]">{project.projectName}</h4>
                <p className="text-sm text-[var(--text-dim)]/90 leading-relaxed font-body">
                    {project.description}
                </p>
            </div>

            <div className="flex flex-col md:items-end gap-3 md:w-1/2">
                <div className="flex flex-wrap gap-2 justify-end">
                    {project.stack.map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase text-[var(--text-dim)]/80 bg-[var(--border-dim)]/30 rounded">
                            {tech}
                        </span>
                    ))}
                </div>
                <div className="flex gap-4">
                    {project.footerLink && project.footerLink.map((link, i) => (
                        <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-[var(--text-main)]/70 hover:text-indigo-500 transition-colors">
                            ↗ {link.name}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Projects = ({ stars }) => {
    return (
        <section id="projects" className="py-12 md:py-20 relative bg-[var(--bg-main)]">
            <div className="container mx-auto px-6 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <SectionLabel number="04" title="Selected Works" />

                    <div className="mb-20">
                        {bigProjects.featuredProjects.map((project, i) => (
                            <FeaturedProject key={i} project={project} stars={stars} />
                        ))}
                    </div>

                    <div className="mt-16 pt-16 border-t border-[var(--border-dim)]">
                        <SectionLabel number="" title="More Projects" />
                        <div className="flex flex-col mt-8">
                            {bigProjects.otherProjects.map((project, i) => (
                                <ProjectListItem key={i} project={project} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Education = () => {
    return (
        <section id="education" className="py-8 md:py-12 relative">
            <div className="container mx-auto px-6 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <SectionLabel number="05" title="Academic" />

                    <div className="grid md:grid-cols-2 gap-12">
                        {educationInfo.schools.map((school, i) => (
                            <div key={i} className="group">
                                <div className="flex flex-row items-center gap-3.5 mb-3">
                                    <div className="w-[52px] h-[52px] rounded-xl bg-[var(--bg-card)] border border-[var(--border-dim)] flex items-center justify-center shrink-0 shadow-sm">
                                        {school.logo ? (
                                            <img src={school.logo} alt={school.schoolName} loading="lazy" className="w-[32px] h-[32px] object-contain" />
                                        ) : (
                                            <BookOpen size={28} className="text-[var(--text-dim)]" strokeWidth={1.5} />
                                        )}
                                    </div>
                                    <h3 className="font-body font-semibold text-xl lg:text-2xl text-[var(--text-main)] leading-tight">{school.schoolName}</h3>
                                </div>
                                <p className="text-[var(--text-main)]/80 font-body mb-2 text-base">{school.subHeader}</p>
                                <p className="text-[11px] font-mono text-[var(--text-dim)]/60 uppercase tracking-widest mb-6">{school.duration}</p>

                                <div className="space-y-2">
                                    {school.descBullets.map((bullet, bi) => (
                                        <p key={bi} className="text-sm text-[var(--text-dim)]/80 font-body">{bullet}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const Blogs = () => {
    if (!blogSection.display) return null;

    return (
        <section id="writing" className="py-8 md:py-12 relative border-t border-[var(--border-dim)]">
            <div className="container mx-auto px-6 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <SectionLabel number="06" title="Writing" />

                    <div className="space-y-12">
                        {blogSection.blogs.map((blog, i) => (
                            <a
                                key={i}
                                href={blog.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block group cursor-none-target"
                            >
                                <h3 className="font-display text-2xl md:text-3xl text-[var(--text-main)] mb-4 group-hover:text-indigo-500 transition-colors duration-300">
                                    {blog.title}
                                </h3>
                                <p className="text-[var(--text-dim)]/90 text-base font-body leading-relaxed max-w-3xl mb-6">
                                    {blog.description}
                                </p>
                                <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[var(--text-main)]/70 group-hover:text-indigo-500 transition-colors">
                                    <span>Read the article on Medium</span>
                                    <ArrowRight size={14} className="-rotate-45" />
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const SectionLabel = ({ number, title }) => (
    <div className="flex items-baseline gap-4 mb-20">
        <span className="font-mono text-sm text-[var(--text-dim)]/30">{number}</span>
        <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-[var(--text-dim)]/60">{title}</h2>
    </div>
);

const Footer = () => (
    <footer id="contact" className="py-8 md:py-12 border-t border-[var(--border-dim)] bg-[var(--bg-main)]">
        <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between md:items-end gap-12">
                <div>
                    <h2 className="font-body font-semibold text-2xl md:text-3xl text-[var(--text-main)] mb-6 tracking-tight">Contact</h2>
                    <a href={`mailto:${contactInfo.email_address}`} className="text-xl md:text-2xl text-[var(--text-main)] hover:text-indigo-500 transition-colors duration-300 font-body border-b border-[var(--text-main)]/20 pb-1 hover:border-indigo-500">
                        {contactInfo.email_address}
                    </a>
                </div>

                <div className="flex flex-col md:items-end gap-6">
                    <div className="flex gap-8">
                        <a href={socialMediaLinks.github} target="_blank" rel="noopener noreferrer" className="text-xs font-mono uppercase tracking-widest text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors">GitHub Profile</a>
                        <a href={socialMediaLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs font-mono uppercase tracking-widest text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors">LinkedIn Profile</a>
                    </div>
                    <p className="text-[11px] text-[var(--text-dim)] font-mono uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} Ian Jiang
                    </p>
                </div>
            </div>
        </div>
    </footer>
);

const App = () => {
    // Theme state with local storage persistence
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        }
        return 'dark';
    });

    const [stars, setStars] = useState(null);

    useEffect(() => {
        // Fetch from the local tracking API (original implementation)
        fetch('/stars.json')
            .then(res => res.json())
            .then(data => {
                if (data.message) {
                    setStars(data.message);
                }
            })
            .catch(() => {
                // Neutral fallback if tracking API fails
                setStars('GitHub stars unavailable');
            });
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="bg-[var(--bg-main)] text-[var(--text-main)] min-h-screen selection:bg-indigo-500/30 selection:text-indigo-900 dark:selection:bg-white/20 dark:selection:text-white antialiased transition-colors duration-500">
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <main>
                <Hero stars={stars} />
                <Experience />
                <ExpertiseSection />
                <Projects stars={stars} />
                <Education />
                <Blogs />
            </main>
            <Footer />
        </div>
    );
};

export default App;
