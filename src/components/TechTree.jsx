import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skillsSection } from '../data/portfolio';
import { Terminal, Cpu, Database, LayoutTemplate, Briefcase } from 'lucide-react';

const CATEGORY_ICONS = {
    "Languages": <Terminal size={14} />,
    "Web Frameworks": <LayoutTemplate size={14} />,
    "Tools & Databases": <Database size={14} />,
    "AI/ML Frameworks": <Cpu size={14} />,
};

const LeafNode = ({ label, isLast, delay }) => (
    <div className="relative pl-6 group">
        {/* Vertical Guide */}
        {!isLast && (
            <div className="absolute left-[11px] top-0 bottom-0 w-[1px] bg-indigo-500/10 group-hover:bg-indigo-500/30 transition-colors" />
        )}
        {/* Connector */}
        <div className="absolute left-[11px] top-[14px] w-[12px] h-[1px] bg-indigo-500/20 group-hover:bg-indigo-500/50 transition-colors" />
        {isLast && (
            <div className="absolute left-[11px] top-0 h-[14px] w-[1px] bg-indigo-500/20 group-hover:bg-indigo-500/50 transition-colors" />
        )}

        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay }}
            className="py-1.5 flex items-center gap-3 pl-1"
        >
            <span className="font-mono text-[15px] text-[var(--text-dim)]/60 hover:text-[var(--text-main)] transition-colors cursor-crosshair">
                <span className="opacity-0 group-hover:opacity-100 mr-2 text-indigo-500 transition-opacity">&gt;</span>
                {label}
            </span>
        </motion.div>
    </div>
);

const TreeBranch = ({ label, children, isLast, icon, delay = 0 }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="relative pl-6">
            {/* Vertical Line from parent */}
            {!isLast && (
                <div className="absolute left-[11px] top-0 bottom-0 w-[1px] bg-indigo-500/10" />
            )}
            {/* Corner connector for this node */}
            <div className="absolute left-[11px] top-[12px] w-[14px] h-[1px] bg-indigo-500/20" />

            {/* If it's the last child, the vertical line shouldn't extend down, but we need correct connector */}
            {isLast && (
                <div className="absolute left-[11px] top-0 h-[12px] w-[1px] bg-indigo-500/20" />
            )}

            <div className="py-1">
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay }}
                    className="flex items-center gap-3 group cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {/* Node Indicator */}
                    <div className={`relative flex items-center justify-center w-5 h-5 rounded border ${isOpen ? 'border-indigo-500/40 bg-indigo-500/5 text-indigo-300' : 'border-[var(--text-dim)]/10 bg-[var(--text-dim)]/5 text-[var(--text-dim)]/50'} transition-all duration-300`}>
                        {icon || <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                    </div>

                    <span className={`font-mono text-base tracking-wide ${isOpen ? 'text-[var(--text-main)]' : 'text-[var(--text-dim)]/60'} group-hover:text-indigo-300 transition-colors`}>
                        {label}
                    </span>

                    {/* Dashed line extension */}
                    <div className="flex-grow h-[1px] border-t border-dashed border-[var(--text-dim)]/5 group-hover:border-indigo-500/10 transition-colors ml-2" />
                </motion.div>

                <AnimatePresence>
                    {isOpen && children && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-1">
                                {children}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const TechTree = () => {
    return (
        <div className="font-mono text-sm select-none">
            {/* Root Node */}
            <div className="flex items-center gap-2 mb-4 text-[var(--text-dim)]/40 pl-2">
                <Briefcase size={16} />
                <span className="text-sm uppercase tracking-widest">./expertise</span>
            </div>

            {/* Tree Structure */}
            <div className="border-l border-[var(--border-dim)] ml-3.5 pl-0.5">
                {skillsSection.softwareSkills.map((category, idx) => {
                    const isLastCategory = idx === skillsSection.softwareSkills.length - 1;
                    return (
                        <TreeBranch
                            key={idx}
                            label={category.category}
                            isLast={isLastCategory}
                            icon={CATEGORY_ICONS[category.category]}
                            delay={idx * 0.1}
                        >
                            {category.skills.map((skill, sIdx) => (
                                <LeafNode
                                    key={sIdx}
                                    label={skill}
                                    isLast={sIdx === category.skills.length - 1}
                                    delay={(idx * 0.1) + (sIdx * 0.05)}
                                />
                            ))}
                        </TreeBranch>
                    );
                })}
            </div>
        </div>
    );
};

export default TechTree;
