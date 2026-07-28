import { useState, useEffect, useCallback } from 'react';

export function useScrollSection() {
  const [currentSection, setCurrentSection] = useState('about');
  const [sectionIndex, setSectionIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sectionProgress, setSectionProgress] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? currentScroll / scrollHeight : 0;
      setScrollProgress(Math.min(Math.max(progress, 0), 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initialize

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = ['about', 'trajectory', 'expertise', 'projects', 'academic'];
    const observers = new Map();

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        
        setSectionProgress((prev) => ({
          ...prev,
          [id]: entry.intersectionRatio
        }));
        
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          setCurrentSection(id);
          const index = sections.indexOf(id);
          if (index !== -1) {
            setSectionIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, options);

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
        observers.set(id, element);
      }
    });

    return () => {
      observers.forEach((element) => observer.unobserve(element));
      observer.disconnect();
    };
  }, []);

  return { currentSection, sectionIndex, scrollProgress, sectionProgress };
}
