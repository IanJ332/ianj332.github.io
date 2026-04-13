import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseOver = (e) => {
            const target = e.target;
            const isLink = target.tagName === 'A' || target.closest('a');
            const isButton = target.tagName === 'BUTTON' || target.closest('button');
            const isClickable = target.classList.contains('cursor-pointer') || target.closest('.cursor-pointer');

            if (isLink || isButton || isClickable) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mouseover', handleMouseOver);
        document.body.addEventListener('mouseleave', handleMouseLeave);
        document.body.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseover', handleMouseOver);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
            document.body.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [isVisible]);

    // Don't render on touch devices to avoid annoyance
    if (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) return null;

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 w-2.5 h-2.5 bg-[var(--text-main)] rounded-full pointer-events-none z-[9999] mix-blend-difference"
                animate={{
                    x: mousePosition.x - 5,
                    y: mousePosition.y - 5,
                    opacity: isVisible ? 1 : 0,
                    scale: isHovering ? 0 : 1
                }}
                transition={{ type: "tween", ease: "linear", duration: 0.1 }}
            />
            <motion.div
                className="fixed top-0 left-0 w-10 h-10 border border-[var(--text-main)] rounded-full pointer-events-none z-[9998] mix-blend-difference"
                animate={{
                    x: mousePosition.x - 20,
                    y: mousePosition.y - 20,
                    opacity: isVisible ? 1 : 0,
                    scale: isHovering ? 1.5 : 1,
                    backgroundColor: isHovering ? 'var(--text-main)' : 'transparent',
                    borderColor: 'var(--text-main)'
                }}
                transition={{ type: "tween", ease: "easeOut", duration: 0.15 }}
            />
        </>
    );
};

export default CustomCursor;
