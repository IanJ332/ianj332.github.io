import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

const HeroSection = ({ data }) => {
    const { username, title, subTitle, resumeLink, socialLinks } = data;

    return (
        <section id="about" className="min-h-screen flex items-center pt-20 relative overflow-hidden bg-[var(--bg-main)]">
            <div className="rauno-grid" />

            <div className="container mx-auto px-6 md:px-8 relative z-10">
                <div className="max-w-[90rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-medium leading-[1.1] tracking-tight mb-8 text-[var(--text-main)]">
                            {title.main} <br />
                            <span className="text-[var(--text-accent)] italic font-serif">{title.accent}</span>
                        </h1>

                        <div className="flex flex-col gap-8">
                            <p className="text-lg md:text-xl text-[var(--text-dim)] max-w-2xl leading-relaxed font-light font-body">
                                {subTitle}
                            </p>

                            <div className="flex gap-6 items-center">
                                <div className="flex gap-6">
                                    {socialLinks.github && <SocialLink href={socialLinks.github} icon={<Github size={22} />} label="GitHub" />}
                                    {socialLinks.linkedin && <SocialLink href={socialLinks.linkedin} icon={<Linkedin size={22} />} label="LinkedIn" />}
                                    {socialLinks.gmail && <SocialLink href={`mailto:${socialLinks.gmail}`} icon={<Mail size={22} />} label="Email" />}
                                </div>

                                {resumeLink && (
                                    <a
                                        href={resumeLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-4 px-6 py-2 rounded-full border border-[var(--border-dim)] hover:border-[var(--text-main)] text-xs font-mono tracking-widest uppercase transition-all duration-300 hover:bg-[var(--text-main)] hover:text-[var(--bg-main)]"
                                    >
                                        Resume
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-sm overflow-hidden border border-[var(--border-dim)] group shadow-2xl shadow-black/5">
                            <div className="absolute inset-0 bg-[var(--text-accent)]/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />
                            <img
                                src={data.image || "/assets/images/placeholder.jpg"}
                                alt={username}
                                className="w-full h-full object-cover transition-all duration-1000 ease-out grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100"
                            />
                        </div>
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
        className="text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors duration-300 transform hover:scale-110"
        aria-label={label}
    >
        {icon}
    </a>
);

export default HeroSection;
