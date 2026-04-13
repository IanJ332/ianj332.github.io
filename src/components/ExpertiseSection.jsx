import React from 'react';
import { motion } from 'framer-motion';
import { skillsSection } from '../data/portfolio';

const ExpertiseSection = () => {
    return (
        <section id="expertise" className="py-8 md:py-12 relative border-t border-[var(--border-dim)] bg-[var(--bg-main)]">
            <div className="container mx-auto px-6 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-baseline gap-4 mb-8">
                        <span className="font-mono text-sm text-[var(--text-dim)]/30">03</span>
                        <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-[var(--text-dim)]/60">{skillsSection.title}</h2>
                    </div>

                    <p className="text-base md:text-lg text-[var(--text-dim)]/80 max-w-3xl mb-12 font-body leading-relaxed">
                        {skillsSection.introText}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
                        {skillsSection.softwareSkills.map((group, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex flex-col"
                            >
                                <h3 className="font-body font-semibold text-[var(--text-main)] mb-4 border-b border-[var(--border-dim)] pb-2 text-sm uppercase tracking-wide">
                                    {group.category}
                                </h3>
                                <ul className="flex flex-col gap-2">
                                    {group.skills.map((skill, i) => (
                                        <li key={i} className="text-[var(--text-dim)]/80 text-[15px] font-body flex items-center gap-2">
                                            <span className="w-1 h-1 bg-indigo-500/40 rounded-full"></span>
                                            {skill}
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

export default ExpertiseSection;
