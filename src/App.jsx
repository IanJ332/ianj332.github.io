import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { greeting, skillsSection, workExperiences, bigProjects, socialMediaLinks, contactInfo, educationInfo, blogSection } from './data/portfolio';
import { Github, Linkedin, Mail, ArrowRight, Code2, ExternalLink, Sun, Moon } from 'lucide-react';
import ProjectCard from './components/ProjectCard';
import ExpertiseSection from './components/ExpertiseSection';

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

const Hero = () => {
    return (
        <section id="about" className="min-h-screen flex items-center pt-20 relative overflow-hidden">
            {/* Rauno Grid Background */}
            <div className="absolute inset-0 rauno-grid z-0 opacity-40 pointer-events-none" />

            <div className="container mx-auto px-6 md:px-8 relative z-10">
                <div className="max-w-[90rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-medium leading-[1.0] tracking-tight mb-8 text-[var(--text-main)]">
                            Designing <br />
                            <span className="text-indigo-400 italic font-serif">Intelligence_</span>
                        </h1>

                        <div className="flex flex-col gap-8">
                            <p className="text-xl md:text-2xl text-[var(--text-dim)]/80 max-w-2xl leading-relaxed font-light font-body">
                                I build high-precision software systems and AI infrastructure. Currently architecting distributed reasoning engines and optimizing large language models.
                            </p>

                            <div className="flex gap-6">
                                <SocialLink href={socialMediaLinks.github} icon={<Github size={24} />} label="GitHub" />
                                <SocialLink href={socialMediaLinks.linkedin} icon={<Linkedin size={24} />} label="LinkedIn" />
                                <SocialLink href={`mailto:${contactInfo.email_address}`} icon={<Mail size={24} />} label="Email" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Hero Image / Illustration */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-[var(--border-dim)] group">
                            <div className="absolute inset-0 bg-indigo-500/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <img
                                src="/assets/images/Sailor.jpg"
                                alt="Ian Jiang"
                                className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-105 group-hover:brightness-110"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1.5 }}
                className="absolute bottom-8 left-8 md:left-12 text-[10px] font-mono text-[var(--text-dim)]/30 tracking-widest uppercase"
            >
                Scroll for Log
            </motion.div>
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
        <section id="work" className="py-20 md:py-32 relative">
            <div className="container mx-auto px-6 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <SectionLabel number="02" title="Trajectory" />

                    <div className="relative border-l border-[var(--border-dim)] pl-8 md:pl-12 space-y-24">
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

                                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 mb-8">
                                    <h3 className="font-display text-4xl md:text-5xl text-[var(--text-main)]">{exp.role}</h3>
                                    {exp.url ? (
                                        <a href={exp.url} target="_blank" rel="noopener noreferrer" className="text-2xl text-[var(--text-dim)]/60 font-serif italic hover:text-[var(--text-main)] hover:underline decoration-[var(--text-dim)]/30 underline-offset-4 transition-all">
                                            @ {exp.company}
                                        </a>
                                    ) : (
                                        <span className="text-2xl text-[var(--text-dim)]/60 font-serif italic">@ {exp.company}</span>
                                    )}
                                </div>

                                <p className="text-[var(--text-dim)]/80 leading-relaxed max-w-4xl mb-10 text-2xl font-light">
                                    {exp.desc}
                                </p>

                                <ul className="space-y-4">
                                    {exp.descBullets.map((bullet, bi) => (
                                        <li key={bi} className="text-lg text-[var(--text-dim)]/60 pl-6 border-l border-[var(--border-dim)] leading-relaxed group-hover:border-[var(--text-main)]/[0.2] transition-colors duration-500">
                                            {bullet}
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

// Replaced legacy Projects with new implementation using ProjectCard
const Projects = () => {
    return (
        <section id="projects" className="py-20 md:py-32 relative bg-[var(--bg-card)]/[0.01]">
            <div className="container mx-auto px-6 md:px-8">
                <div className="max-w-[90rem] mx-auto">
                    <SectionLabel number="03" title="Selected Works" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
                        {bigProjects.projects.map((project, i) => (
                            <ProjectCard key={i} project={project} index={i} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const Education = () => {
    return (
        <section id="education" className="py-20 md:py-32 relative">
            <div className="container mx-auto px-6 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <SectionLabel number="04" title="Academic" />

                    <div className="grid md:grid-cols-2 gap-20">
                        {educationInfo.schools.map((school, i) => (
                            <div key={i} className="group">
                                <div className="w-20 h-20 mb-8 opacity-80 group-hover:opacity-100 transition-all duration-500 bg-[var(--bg-main)]/[0.02] p-3 rounded-2xl border border-[var(--border-dim)] hover:border-[var(--text-dim)]/20">
                                    <img src={school.logo} alt={school.schoolName} className="w-full h-full object-contain" />
                                </div>
                                <h3 className="font-display text-4xl text-[var(--text-main)] mb-3">{school.schoolName}</h3>
                                <p className="text-[var(--text-dim)]/60 font-serif italic mb-6 text-xl">{school.subHeader}</p>
                                <p className="text-sm font-mono text-[var(--text-dim)]/40 uppercase tracking-widest mb-8">{school.duration}</p>

                                <div className="space-y-3 pl-6 border-l border-[var(--border-dim)]">
                                    {school.descBullets.map((bullet, bi) => (
                                        <p key={bi} className="text-base text-[var(--text-dim)]/60">{bullet}</p>
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
        <section id="writing" className="py-20 md:py-32 relative border-t border-[var(--border-dim)]">
            <div className="container mx-auto px-6 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <SectionLabel number="05" title="Writing" />

                    <div className="space-y-20">
                        {blogSection.blogs.map((blog, i) => (
                            <a
                                key={i}
                                href={blog.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block group cursor-none-target"
                            >
                                <h3 className="font-display text-4xl md:text-6xl text-[var(--text-main)] mb-6 group-hover:text-[var(--text-dim)] transition-colors duration-500">
                                    {blog.title}
                                </h3>
                                <p className="text-[var(--text-dim)]/60 text-xl font-light leading-relaxed max-w-3xl mb-8">
                                    {blog.description}
                                </p>
                                <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-[var(--text-dim)]/40 group-hover:text-[var(--text-main)] transition-colors">
                                    <span>Read Article</span>
                                    <ArrowRight size={16} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
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
    <footer id="contact" className="py-20 md:py-32 border-t border-[var(--border-dim)] bg-[var(--bg-main)]">
        <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between md:items-end gap-12">
                <div>
                    <h2 className="font-display text-5xl md:text-7xl text-[var(--text-main)] mb-10 tracking-tight">Let's Connect</h2>
                    <a href={`mailto:${contactInfo.email_address}`} className="text-2xl md:text-3xl text-[var(--text-dim)]/60 hover:text-[var(--text-main)] transition-colors duration-300 border-b border-[var(--text-main)]/[0.1] hover:border-[var(--text-main)] pb-2 font-light font-serif italic">
                        {contactInfo.email_address}
                    </a>
                </div>

                <div className="flex flex-col md:items-end gap-8">
                    <div className="flex gap-10">
                        <a href={socialMediaLinks.github} className="text-xs font-mono uppercase tracking-widest text-[var(--text-dim)]/40 hover:text-[var(--text-main)] transition-colors">Github</a>
                        <a href={socialMediaLinks.linkedin} className="text-xs font-mono uppercase tracking-widest text-[var(--text-dim)]/40 hover:text-[var(--text-main)] transition-colors">Linkedin</a>
                    </div>
                    <p className="text-[11px] text-[var(--text-dim)]/20 font-mono uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} Ian Jiang / Crafted with Reason
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
                <Hero />
                <ExpertiseSection />
                <Experience />
                <Projects />
                <Education />
                <Blogs />
            </main>
            <Footer />
        </div>
    );
};

export default App;
