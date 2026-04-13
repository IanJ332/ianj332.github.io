import React from 'react';
import { motion } from 'framer-motion';
import TechTree from '../TechTree';

const ExpertiseSection = ({ data, stars }) => {
    const { title, categories } = data;

    return (
        <section id="expertise" className="py-20 md:py-32 relative">
            <div className="container mx-auto px-6 md:px-8">
                <div className="max-w-[90rem] mx-auto">
                    <SectionLabel number="01" title={title} />

                    <div className="grid md:grid-cols-[1fr_1fr] gap-12 md:gap-20">
                        {/* Left Column: Tech Tree Visualization */}
                        <div>
                            <h3 className="font-display text-3xl text-[var(--text-main)] mb-8 flex items-center gap-3">
                                <span className="text-xl font-mono text-[var(--text-dim)]/40 mr-2">root@ian:~#</span>
                                tree ./skills
                            </h3>
                            <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-dim)] py-8 pl-6 pr-8 hover:border-[var(--text-dim)]/20 transition-colors duration-500 shadow-2xl shadow-indigo/5">
                                <TechTree skills={data.techTree} />
                            </div>
                        </div>

                        {/* Right Column: Competencies */}
                        <div>
                            <div className="md:pl-12 border-l border-[var(--border-dim)] h-full">
                                <h3 className="font-display text-3xl text-[var(--text-main)] mb-8">Core Competencies</h3>
                                <div className="space-y-8">
                                    {categories.map((category, index) => (
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
                                                    {category.name}:
                                                </h4>
                                                <p className="text-[var(--text-dim)]/80 leading-relaxed font-light text-lg font-body pl-9 group-hover:text-[var(--text-main)] transition-colors">
                                                    {category.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
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

export default ExpertiseSection;
