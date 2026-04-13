import React from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '../ProjectCard';

const ProjectsSection = ({ data }) => {
    const { title, subtitle, projects } = data;

    return (
        <section id="projects" className="py-20 md:py-32 relative bg-[var(--bg-card)]/[0.01]">
            <div className="container mx-auto px-6 md:px-8">
                <div className="max-w-[90rem] mx-auto">
                    <SectionLabel number="03" title={title} />

                    {subtitle && (
                        <p className="text-sm font-mono text-[var(--text-dim)]/40 uppercase tracking-widest mb-12 -mt-12">
                            {subtitle}
                        </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
                        {projects.map((project, i) => (
                            <ProjectCard key={i} project={project} index={i} />
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

export default ProjectsSection;
