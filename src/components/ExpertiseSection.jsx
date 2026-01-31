import React from 'react';
import { motion } from 'framer-motion';
import { skillsSection } from '../data/portfolio';
import TechTree from './TechTree';

const ExpertiseSection = () => {
    const [stars, setStars] = React.useState('5.9k');

    React.useEffect(() => {
        fetch('https://api.github.com/repos/sickn33/antigravity-awesome-skills')
            .then(res => res.json())
            .then(data => {
                if (data.stargazers_count) {
                    setStars((data.stargazers_count / 1000).toFixed(1) + 'k');
                }
            })
            .catch(e => console.error("Error fetching stars:", e));
    }, []);

    const renderDescription = (description) => {
        // Check for the specific static string to replace
        if (description.includes('5.9K stars')) {
            const parts = description.split('5.9K stars');
            return (
                <span>
                    {parts[0]}
                    <motion.a
                        href="https://github.com/sickn33/antigravity-awesome-skills"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-1.5 bg-amber-500/10 dark:bg-[#FFD700]/10 border border-amber-500/20 dark:border-[#FFD700]/20 px-2 py-0.5 rounded-full mx-1 align-bottom transform translate-y-[-2px]"
                    >
                        <span className="text-xs font-medium text-amber-600 dark:text-[#FFD700] whitespace-nowrap">{stars} ⭐</span>
                    </motion.a>
                    {parts[1]}
                </span>
            );
        }
        return description;
    };

    return (
        <section id="expertise" className="py-20 md:py-32 relative">
            <div className="container mx-auto px-6 md:px-8">
                <div className="max-w-[90rem] mx-auto">
                    <div className="flex items-baseline gap-4 mb-16">
                        <span className="font-mono text-sm text-dim/30">01</span>
                        <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-dim/60">Technical Expertise</h2>
                    </div>

                    <div className="grid md:grid-cols-[1fr_1fr] gap-12 md:gap-20">
                        {/* Left Column: Tech Tree Visualization */}
                        <div>
                            <h3 className="font-display text-3xl text-[var(--text-main)] mb-8 flex items-center gap-3">
                                <span className="text-xl font-mono text-[var(--text-dim)]/40 mr-2">root@ian:~#</span>
                                tree ./skills
                            </h3>
                            <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-dim)] py-8 pl-6 pr-8 hover:border-[var(--text-dim)]/20 transition-colors duration-500 shadow-2xl shadow-indigo/5">
                                <TechTree />
                            </div>
                        </div>

                        {/* Right Column: Competencies (moved from bottom) */}
                        <div>
                            <div className="md:pl-12 border-l border-[var(--border-dim)] h-full">
                                <h3 className="font-display text-3xl text-[var(--text-main)] mb-8">Core Competencies</h3>
                                <div className="space-y-8">
                                    {skillsSection.skills.map((skill, index) => {
                                        const [title, description] = skill.split(':');
                                        return (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: 10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: index * 0.1 }}
                                                className="group"
                                            >
                                                <div className="flex flex-col gap-2">
                                                    <h4 className="flex items-center gap-4 text-xl font-display font-medium text-[var(--text-main)]">
                                                        <span className="text-indigo-500/40 font-mono text-base group-hover:text-indigo-500 transition-colors">0{index + 1}</span>
                                                        {title}:
                                                    </h4>
                                                    <p className="text-[var(--text-dim)]/80 leading-relaxed font-light text-lg font-body pl-9 group-hover:text-[var(--text-main)] transition-colors">
                                                        {renderDescription(description)}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExpertiseSection;
