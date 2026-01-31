import React from 'react';
import { motion } from 'framer-motion';
import { Github, ArrowUpRight, Terminal, Minimize, Maximize, X } from 'lucide-react';

const WindowHeader = ({ title, rightContent }) => (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-dim)] bg-[var(--bg-card)]/[0.02]">
        <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] opacity-80" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] opacity-80" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] opacity-80" />
            </div>
            <span className="ml-3 font-mono text-[10px] text-[var(--text-dim)]/60 uppercase tracking-widest truncate max-w-[150px]">
                {title}
            </span>
        </div>
        <div className="flex items-center gap-3">
            {rightContent}
            <div className="flex gap-2 opacity-20">
                <Minimize size={10} />
                <Maximize size={10} />
                <X size={10} />
            </div>
        </div>
    </div>
);

const TerminalView = ({ project }) => {
    return (
        <div className="p-6 font-mono text-sm h-full flex flex-col">
            <div className="space-y-2 text-[var(--text-dim)]/80">
                <div className="flex gap-2">
                    <span className="text-emerald-500">➜</span>
                    <span className="text-blue-400">~</span>
                    <span className="text-[var(--text-dim)]/60">cd</span>
                    <span className="text-indigo-400">projects/{project.projectName.split(":")[0].toLowerCase().replace(/\s+/g, '-')}</span>
                </div>
                <div className="flex gap-2">
                    <span className="text-emerald-500">➜</span>
                    <span className="text-blue-400">/app</span>
                    <span className="text-[var(--text-dim)]/60">cat</span>
                    <span className="text-indigo-400">README.md</span>
                </div>
                <div className="pt-4 pl-4 border-l-2 border-[var(--border-dim)] text-[var(--text-dim)]/70 leading-relaxed text-[13px]">
                    {project.projectDesc}
                </div>

                <div className="pt-6">
                    <span className="text-[var(--text-dim)]/40 comment">// Tech Stack Initialization</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {project.stack?.map((tech, i) => (
                            <span key={i} className="text-xs text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const MediaView = ({ project }) => {
    const isLogo = project.objFit === 'object-contain';
    // Check if it's the Kimi.ai project to apply special lighting
    const isKimi = project.projectName.toLowerCase().includes('kimi.ai');
    const isBakeWise = project.projectName.toLowerCase().includes('bakewise');
    const isHelperBob = project.projectName.toLowerCase().includes('helper bob');
    const isSignLanguage = project.projectName.toLowerCase().includes('sign language');
    const isAntigravity = project.projectName.toLowerCase().includes('antigravity');

    // Get the primary link for the clickable area
    const primaryLink = project.footerLink?.[0]?.url;

    const Content = () => (
        <div className="relative flex-grow min-h-[240px] bg-[var(--bg-main)] overflow-hidden border-b border-[var(--border-dim)] group cursor-pointer">
            {/* Grid Background in visual area */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-50" />

            {/* If it's a logo or letter logo, add a glow */}
            {(isLogo || project.letterLogo) && (
                <div className="absolute inset-0">
                    {/* Custom glow colors based on project */}
                    {/* Custom glow colors based on project - Dark mode only for heavy gradients */}
                    <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] opacity-0 dark:opacity-100 transition-opacity duration-300
                        ${isKimi ? 'from-indigo-400/20 via-[#1a1a2e] to-[#050505]' :
                            isBakeWise ? 'from-orange-400/20 via-[#1a1305] to-[#050505]' :
                                isHelperBob ? 'from-amber-500/15 via-[#1a0f05] to-[#050505]' :
                                    isAntigravity ? 'from-indigo-500/20 via-[#05051a] to-[#050505]' :
                                        'from-indigo-500/10 via-[#050505] to-[#050505]'
                        }`} />

                    {/* Light mode subtle glow */}
                    <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] opacity-100 dark:opacity-0 transition-opacity duration-300
                            ${isKimi ? 'from-indigo-400/10 to-transparent' :
                            isBakeWise ? 'from-orange-400/10 to-transparent' :
                                isHelperBob ? 'from-amber-500/10 to-transparent' :
                                    isAntigravity ? 'from-indigo-500/10 to-transparent' :
                                        'from-indigo-500/5 to-transparent'
                        }`} />
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 ${isKimi ? 'bg-indigo-400/30' :
                        isBakeWise ? 'bg-orange-400/25' :
                            isAntigravity ? 'bg-indigo-500/30' :
                                'bg-indigo-500/20'
                        } blur-[75px] rounded-full`} />
                </div>
            )}

            <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                {project.letterLogo ? (
                    <div className="relative z-10 flex flex-col items-center justify-center w-full px-2">
                        <div className="flex flex-col gap-0 uppercase w-full">
                            {project.letterLogo.map((line, i) => (
                                <h2
                                    key={i}
                                    className={`font-display font-bold leading-[0.8] transition-all duration-700 group-hover:scale-105 break-words w-full ${project.letterLogo.length > 2 ? 'text-3xl md:text-3xl lg:text-4xl' :
                                        project.letterLogo.length > 1 ? 'text-4xl md:text-5xl lg:text-6xl' :
                                            'text-5xl md:text-6xl lg:text-7xl'
                                        } ${isAntigravity ? 'text-indigo-500/90' : 'text-[var(--text-main)]/90'}`}
                                    style={{
                                        textShadow: '0 0 40px rgba(100,100,255,0.1)',
                                        letterSpacing: '-2px'
                                    }}
                                >
                                    {line}
                                </h2>
                            ))}
                        </div>
                    </div>
                ) : (
                    <img
                        src={project.image}
                        alt={project.projectName}
                        className={`
                            relative z-10 transition-all duration-700 ease-out
                            ${isLogo
                                ? 'w-full h-full object-contain group-hover:scale-110 drop-shadow-2xl'
                                : 'absolute inset-0 w-full h-full object-cover group-hover:scale-105 opacity-90 group-hover:opacity-100'
                            }
                            ${isSignLanguage ? 'dark:invert contrast-[1.2] brightness-[1.2] scale-[1.5]' : ''}
                            ${isHelperBob ? 'scale-[1.4]' : ''}
                            ${isBakeWise ? 'scale-[1.1] rounded-full overflow-hidden' : ''}
                            ${isKimi ? 'brightness-150 contrast-[1.3]' : ''}
                        `}
                    />
                )}
            </div>
        </div>
    );

    return (
        <div className="relative h-full flex flex-col">
            {primaryLink ? (
                <a href={primaryLink} target="_blank" rel="noopener noreferrer" className="contents">
                    <Content />
                </a>
            ) : (
                <Content />
            )}  {/* Compact Details Area */}
            <div className="p-5 bg-[var(--bg-card)]/[0.01]">
                <p className="font-body text-xs md:text-sm text-[var(--text-dim)]/70 leading-relaxed line-clamp-3 mb-4">
                    {project.projectDesc}
                </p>
                <div className="flex flex-wrap gap-2">
                    {project.stack?.slice(0, 3).map((tech, i) => (
                        <span key={i} className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-dim)]/50 border border-[var(--border-dim)] px-2 py-1 rounded">
                            {tech}
                        </span>
                    ))}
                    {project.stack?.length > 3 && (
                        <span className="text-[10px] font-mono text-[var(--text-dim)]/40 py-1 px-1">+{project.stack.length - 3}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProjectCard = ({ project, index }) => {
    const isVisual = !!project.image || !!project.letterLogo;
    const [title, subtitle] = project.projectName.split(':').map(s => s?.trim());
    const isAntigravity = project.projectName.toLowerCase().includes('antigravity');
    const [stars, setStars] = React.useState(null);

    React.useEffect(() => {
        if (isAntigravity && project.githubRepo) {
            fetch(`https://api.github.com/repos/${project.githubRepo}`)
                .then(res => res.json())
                .then(data => {
                    if (data.stargazers_count) {
                        setStars((data.stargazers_count / 1000).toFixed(1) + 'k');
                    }
                })
                .catch(err => console.error("Error fetching stars:", err));
        }
    }, [isAntigravity, project.githubRepo]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="flex flex-col h-full bg-[var(--bg-card)] border border-[var(--border-dim)] rounded-lg overflow-hidden hover:border-[var(--text-main)]/[0.15] transition-colors duration-300 shadow-2xl shadow-black/5"
        >
            <WindowHeader title={title} />

            <div className="flex-grow flex flex-col">
                {isVisual ? (
                    <MediaView project={project} />
                ) : (
                    <TerminalView project={project} />
                )}
            </div>

            {/* Footer / Action Bar */}
            <div className="px-4 py-3 border-t border-[var(--border-dim)] bg-[var(--bg-card)]/[0.01] flex items-center justify-between">
                <span className="font-mono text-[9px] text-[var(--text-dim)]/30 uppercase tracking-widest">
                    {subtitle || "Application"}
                </span>

                <div className="flex gap-4 items-center">
                    {/* Star Badge moved here */}
                    {stars && (
                        <a
                            href={`https://github.com/${project.githubRepo}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 bg-amber-500/10 dark:bg-[#FFD700]/10 border border-amber-500/20 dark:border-[#FFD700]/20 px-2 py-0.5 rounded-full hover:bg-amber-500/20 dark:hover:bg-[#FFD700]/20 transition-all mr-2"
                        >
                            <span className="text-[10px] text-amber-600 dark:text-[#FFD700] whitespace-nowrap font-medium">{stars} ⭐</span>
                        </a>
                    )}

                    {project.footerLink?.map((link, i) => (
                        <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[var(--text-dim)]/60 hover:text-[var(--text-main)] transition-colors"
                        >
                            {link.url.includes('github') ? <Github size={12} /> : <ArrowUpRight size={12} />}
                            <span className="hidden sm:inline">{link.name}</span>
                        </a>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCard;
