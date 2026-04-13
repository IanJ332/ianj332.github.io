import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const Navbar = ({ data, theme, toggleTheme }) => {
    const [scrolled, setScrolled] = useState(false);
    const { logo, links } = data;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ease-out ${scrolled ? 'bg-[var(--bg-main)]/80 backdrop-blur-md border-b border-[var(--border-dim)] py-4' : 'bg-transparent py-8'}`}>
            <div className="container mx-auto px-8 md:px-12 flex justify-between items-center">
                <a href="#" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-full bg-[var(--text-main)]/[0.08] flex items-center justify-center border border-[var(--text-main)]/[0.05] group-hover:bg-[var(--text-main)]/[0.15] transition-colors duration-500">
                        <span className="font-display font-medium text-[var(--text-main)] text-sm">{logo.initial}</span>
                    </div>
                    <span className="font-mono text-[11px] text-[var(--text-dim)] tracking-widest uppercase group-hover:text-[var(--text-main)] transition-colors duration-300">{logo.name}</span>
                </a>

                <div className="flex items-center gap-8 md:gap-12">
                    <div className="hidden md:flex gap-12">
                        {links.map((link) => (
                            <a key={link.name} href={link.href} className="nav-link">
                                {link.name}
                            </a>
                        ))}
                    </div>

                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-[var(--text-main)]/[0.05] transition-colors text-[var(--text-dim)] hover:text-[var(--text-main)]"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
