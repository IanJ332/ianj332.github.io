import React from 'react';
import { motion } from 'framer-motion';
import { skillsSection } from '../data/portfolio';
import { Cpu, Server, Database, Layout } from 'lucide-react';
import TiltCard from './TiltCard';

const EASE = [0.16, 1, 0.3, 1];
const VIEWPORT = { once: true, margin: '-60px' };

const categoryConfig = {
    'AI Systems & Infrastructure': { icon: Cpu, accent: '#6366f1' },
    'Backend & Cloud Architecture': { icon: Server, accent: '#0891b2' },
    'Data Engineering & Storage': { icon: Database, accent: '#059669' },
    'Frontend & Interactive 3D': { icon: Layout, accent: '#d97706' },
};

const FALLBACK = { icon: Cpu, accent: '#6366f1' };

/* Left column slides in from the left, right column from the right, on an
   under-damped spring — the two lanes converging is the section's entrance
   signature. Opacity stays a tween; fades should not bounce. */
const cardVariants = {
    hidden: (i) => ({ opacity: 0, y: 26, x: i % 2 === 0 ? -24 : 24, scale: 0.98 }),
    visible: (i) => ({
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        transition: {
            opacity: { duration: 0.5, delay: i * 0.09, ease: 'easeOut' },
            default: { type: 'spring', stiffness: 140, damping: 18, mass: 0.85, delay: i * 0.09 },
        },
    }),
};

const ExpertiseSection = () => (
    <section id="expertise" className="py-24 md:py-36 relative">
        <div className="container mx-auto px-6 md:px-12">
            {/* Content sits RIGHT — the avatar takes the left half in this section. */}
            <div className="lg:ml-auto lg:max-w-[56%]">
                <motion.div
                    className="flex items-end gap-5 mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VIEWPORT}
                    transition={{ duration: 0.7, ease: EASE }}
                >
                    <span className="section-number">03</span>
                    <div className="pb-2 flex-1">
                        <span className="section-label">{skillsSection.title}</span>
                        <div className="section-rule mt-3" />
                    </div>
                </motion.div>

                <motion.p
                    className="text-body text-[var(--text-dim)] max-w-lg mb-10"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VIEWPORT}
                    transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
                >
                    {skillsSection.introText}
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skillsSection.softwareSkills.map((group, index) => {
                        const config = categoryConfig[group.category] || FALLBACK;
                        const Icon = config.icon;

                        return (
                            <motion.div
                                key={index}
                                custom={index}
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={VIEWPORT}
                            >
                                {/* Inner TiltCard owns the transform — framer's
                                    settled inline transform on the outer element
                                    would otherwise fight a live tilt. */}
                                {/* Content flows top-down with NO mt-auto on the tag row:
                                    equal-height grid cards + bottom-anchored tags opened a
                                    hole of whitespace mid-card under the shorter headers. */}
                                <TiltCard
                                    className="glass-panel accent-hover p-5 md:p-6 h-full flex flex-col"
                                    max={7}
                                    style={{ '--card-accent': config.accent }}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <span
                                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                                            style={{
                                                background: `color-mix(in srgb, ${config.accent} 12%, transparent)`,
                                                borderColor: `color-mix(in srgb, ${config.accent} 30%, transparent)`,
                                            }}
                                        >
                                            <Icon size={15} style={{ color: config.accent }} />
                                        </span>
                                        <h3 className="text-display-light text-[14.5px] text-[var(--text-main)] leading-snug">
                                            {group.category}
                                        </h3>
                                    </div>

                                    <p className="text-body text-[12px] text-[var(--text-faint)] mb-4 leading-[1.6] border-b border-[var(--border-dim)] pb-4">
                                        {group.description}
                                    </p>

                                    <div className="flex flex-wrap gap-1.5">
                                        {group.skills.map((skill, i) => {
                                            const name = typeof skill === 'string' ? skill : skill.name;
                                            return (
                                                <span key={i} className="skill-tag">
                                                    {name}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </TiltCard>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    </section>
);

export default ExpertiseSection;
