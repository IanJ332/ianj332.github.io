import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const WritingSection = ({ data }) => {
    const { title, blogs } = data;

    return (
        <section id="writing" className="py-20 md:py-32 relative border-t border-[var(--border-dim)]">
            <div className="container mx-auto px-6 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <SectionLabel number="05" title={title} />

                    <div className="space-y-20">
                        {blogs.map((blog, i) => (
                            <a
                                key={i}
                                href={blog.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block group cursor-none-target"
                            >
                                <h3 className="font-display text-4xl md:text-6xl text-[var(--text-main)] mb-6 group-hover:text-[var(--text-dim)] transition-colors duration-500">
                                    {blog.title}
                                </h3>
                                <p className="text-[var(--text-dim)]/60 text-xl font-light leading-relaxed max-w-3xl mb-8">
                                    {blog.summary}
                                </p>
                                <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-[var(--text-dim)]/40 group-hover:text-[var(--text-main)] transition-colors">
                                    <span>Read Article</span>
                                    <ArrowRight size={16} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                                </div>
                            </a>
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

export default WritingSection;
