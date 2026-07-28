import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Brain, FlaskConical } from 'lucide-react';
import TiltCard from './TiltCard';

/* Positioned in the outer thirds only — the hero avatar occupies roughly the
   middle third of the viewport, so badges never land on the face. */
const badges = [
    {
        label: 'Agentic AI Infra',
        detail: 'Multi-agent orchestration · tool routing',
        icon: Cpu,
        accent: '#6366f1',
        status: 'building',
        position: { top: '20%', left: '5%' },
        delay: 0,
    },
    {
        label: 'UIUC AI Alignment',
        detail: 'Reasoning reliability & guardrails',
        icon: Brain,
        accent: '#059669',
        status: 'active',
        position: { top: '31%', right: '5%' },
        delay: 0.28,
        alignRight: true,
    },
    {
        label: 'LLM Research',
        detail: 'Multi-agent debate · critic-actor loops',
        icon: FlaskConical,
        accent: '#0891b2',
        status: 'publishing',
        position: { top: '38%', left: '7%' },
        delay: 0.56,
        // Opens upward so its popover can never cover the hero bio panel.
        openUp: true,
    },
];

const Badge = ({ badge }) => {
    const Icon = badge.icon;

    return (
        <motion.div
            className="absolute pointer-events-auto"
            style={badge.position}
            initial={{ opacity: 0, y: 18, scale: 0.9 }}
            animate={{
                opacity: 1,
                y: [0, -7, 0],
                scale: 1,
                transition: {
                    opacity: { duration: 0.6, delay: badge.delay },
                    scale: { duration: 0.6, delay: badge.delay },
                    y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: badge.delay },
                },
            }}
            exit={{ opacity: 0, y: -16, scale: 0.9, transition: { duration: 0.35 } }}
        >
            <TiltCard
                max={11}
                lift={-3}
                scaleOnHover={1.02}
                perspective={620}
                className={`badge-chip group/badge ${badge.alignRight ? 'items-end text-right' : ''} ${
                    badge.openUp ? 'badge-up' : ''
                }`}
                style={{
                    '--badge-accent': badge.accent,
                }}
            >
                <div className="flex items-center gap-2">
                    {/* Live status dot: solid core + expanding echo ring. */}
                    <span className="status-dot" aria-hidden="true">
                        <span className="status-dot__ping" />
                        <span className="status-dot__core" />
                    </span>

                    <Icon size={13} strokeWidth={2.1} style={{ color: badge.accent }} />

                    <span className="text-code text-[11px] font-medium" style={{ color: badge.accent }}>
                        {badge.label}
                    </span>
                </div>

                {/* Hover-expanded detail — floats out of flow so the resting
                    chip stays a compact pill (see .badge-detail in index.css). */}
                <div className="badge-detail">
                    <span
                        className="text-code text-[9.5px] uppercase tracking-[0.16em]"
                        style={{ color: badge.accent }}
                    >
                        {badge.status}
                    </span>
                    <p className="text-code text-[10.5px] text-[var(--text-dim)] leading-snug mt-1">
                        {badge.detail}
                    </p>
                </div>
            </TiltCard>
        </motion.div>
    );
};

/* z-30 sits ABOVE <main> (z-10) and below the nav pill (z-40). At z-5 the
   full-viewport hero <section> covered this layer, so the chips rendered but
   could never receive hover at all. The container stays pointer-events-none;
   only the chips themselves opt back in. */
const FloatingBadges = ({ currentSection }) => (
    <AnimatePresence>
        {currentSection === 'about' && (
            <div className="fixed inset-0 z-30 pointer-events-none hidden lg:block">
                {badges.map((badge) => (
                    <Badge key={badge.label} badge={badge} />
                ))}
            </div>
        )}
    </AnimatePresence>
);

export default FloatingBadges;
