import React from 'react';

const EducationSection = ({ data }) => {
    const { title, schools } = data;

    return (
        <section id="education" className="py-20 md:py-32 relative">
            <div className="container mx-auto px-6 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <SectionLabel number="04" title={title} />

                    <div className="grid md:grid-cols-2 gap-20">
                        {schools.map((school, i) => (
                            <div key={i} className="group">
                                <div className="w-20 h-20 mb-8 opacity-80 group-hover:opacity-100 transition-all duration-500 bg-[var(--bg-main)]/[0.02] p-3 rounded-2xl border border-[var(--border-dim)] hover:border-[var(--text-dim)]/20">
                                    <img src={school.logo} alt={school.name} className="w-full h-full object-contain" />
                                </div>
                                <h3 className="font-display text-4xl text-[var(--text-main)] mb-3">{school.name}</h3>
                                <p className="text-[var(--text-dim)]/60 font-serif italic mb-6 text-xl">{school.degree}</p>
                                <p className="text-sm font-mono text-[var(--text-dim)]/40 uppercase tracking-widest mb-8">{school.period}</p>

                                <div className="space-y-3 pl-6 border-l border-[var(--border-dim)]">
                                    {school.bullets.map((bullet, bi) => (
                                        <p key={bi} className="text-base text-[var(--text-dim)]/60">{bullet}</p>
                                    ))}
                                </div>
                            </div>
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

export default EducationSection;
