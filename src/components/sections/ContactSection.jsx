import React from 'react';

const ContactSection = ({ data }) => {
    const { title, email, tagline, socials } = data;

    return (
        <footer id="contact" className="py-20 md:py-32 border-t border-[var(--border-dim)] bg-[var(--bg-main)]">
            <div className="container mx-auto px-6 md:px-8">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between md:items-end gap-12">
                    <div>
                        <h2 className="font-display text-5xl md:text-7xl text-[var(--text-main)] mb-10 tracking-tight">{title}</h2>
                        <a href={`mailto:${email}`} className="text-2xl md:text-3xl text-[var(--text-dim)]/60 hover:text-[var(--text-main)] transition-colors duration-300 border-b border-[var(--text-main)]/[0.1] hover:border-[var(--text-main)] pb-2 font-light font-serif italic">
                            {email}
                        </a>
                    </div>

                    <div className="flex flex-col md:items-end gap-8">
                        <div className="flex gap-10">
                            {socials.map((social, i) => (
                                <a key={i} href={social.url} className="text-xs font-mono uppercase tracking-widest text-[var(--text-dim)]/40 hover:text-[var(--text-main)] transition-colors">
                                    {social.name}
                                </a>
                            ))}
                        </div>
                        <p className="text-[11px] text-[var(--text-dim)]/20 font-mono uppercase tracking-widest">
                            &copy; {new Date().getFullYear()} {tagline}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default ContactSection;
