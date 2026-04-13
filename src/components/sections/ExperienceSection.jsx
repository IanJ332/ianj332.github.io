import React from 'react';
import { motion } from 'framer-motion';

const ExperienceSection = ({ data }) => {
    const { experience } = data;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <section id="work" className="py-20 md:py-32 relative">
            <div className="container mx-auto px-6 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <SectionLabel number="02" title="Trajectory" />

                    <motion.div
                        className="relative border-l border-[var(--border-dim)] pl-8 md:pl-12 space-y-20"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-10%" }}
                    >
                        {experience.map((exp, i) => (
                            <motion.div
                                key={i}
                                className="relative group"
                                variants={itemVariants}
                            >
                                <div className="absolute -left-[37px] md:-left-[53px] top-2.5 w-3 h-3 rounded-full bg-[var(--bg-main)] border border-[var(--text-dim)]/40 group-hover:bg-[var(--text-accent)] group-hover:border-[var(--text-accent)] group-hover:scale-125 transition-all duration-500" />

                                <span className="font-mono text-xs text-[var(--text-dim)] uppercase tracking-widest mb-3 block opacity-70">{exp.date}</span>

                                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-6">
                                    <h3 className="font-display text-2xl md:text-4xl text-[var(--text-main)] group-hover:text-[var(--text-accent)] transition-colors duration-300">{exp.role}</h3>
                                    {exp.url ? (
                                        <a href={exp.url} target="_blank" rel="noopener noreferrer" className="text-lg md:text-xl text-[var(--text-dim)] font-serif italic hover:text-[var(--text-main)] hover:underline decoration-[var(--text-dim)]/30 underline-offset-4 transition-all">
                                            @ {exp.company}
                                        </a>
                                    ) : (
                                        <span className="text-lg md:text-xl text-[var(--text-dim)] font-serif italic">@ {exp.company}</span>
                                    )}
                                </div>

                                <p className="text-[var(--text-dim)] leading-relaxed max-w-3xl mb-8 text-lg font-light">
                                    {exp.desc}
                                </p>

                                <ul className="space-y-3">
                                    {/* Handle both descBullets and direct bullets array if structure differs */}
                                    {(exp.bullets || exp.descBullets || []).map((bullet, bi) => (
                                        <li key={bi} className="text-base text-[var(--text-dim)]/80 pl-6 border-l border-[var(--border-dim)] leading-relaxed group-hover:border-[var(--text-accent)]/30 transition-colors duration-500">
                                            {bullet}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const SectionLabel = ({ number, title }) => (
    <div className="flex items-baseline gap-4 mb-16">
        <span className="font-mono text-sm text-[var(--text-dim)]/40">{number}</span>
        <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-[var(--text-dim)]/60">{title}</h2>
    </div>
);

export default ExperienceSection;
