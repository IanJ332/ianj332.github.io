import React, { useEffect, useRef } from 'react';
import { animate, motion, useMotionValue } from 'framer-motion';

const DOT_TRANSITION = { duration: 0.1, ease: 'linear' };
const RING_TRANSITION = { duration: 0.15, ease: 'easeOut' };

const CustomCursor = () => {
    const ringRef = useRef(null);
    const animationsRef = useRef(new Map());
    const hoveringRef = useRef(false);
    const visibleRef = useRef(false);
    const dotX = useMotionValue(-5);
    const dotY = useMotionValue(-5);
    const dotOpacity = useMotionValue(0);
    const dotScale = useMotionValue(1);
    const ringX = useMotionValue(-20);
    const ringY = useMotionValue(-20);
    const ringOpacity = useMotionValue(0);
    const ringScale = useMotionValue(1);
    const isTouchDevice = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0;

    useEffect(() => {
        if (isTouchDevice) return undefined;

        const retarget = (key, value, target, transition) => {
            animationsRef.current.get(key)?.stop();
            animationsRef.current.set(key, animate(value, target, transition));
        };

        const setVisible = (visible) => {
            if (visible === visibleRef.current) return;
            visibleRef.current = visible;
            const opacity = visible ? 1 : 0;
            retarget('dotOpacity', dotOpacity, opacity, DOT_TRANSITION);
            retarget('ringOpacity', ringOpacity, opacity, RING_TRANSITION);
        };

        const updateMousePosition = (event) => {
            retarget('dotX', dotX, event.clientX - 5, DOT_TRANSITION);
            retarget('dotY', dotY, event.clientY - 5, DOT_TRANSITION);
            retarget('ringX', ringX, event.clientX - 20, RING_TRANSITION);
            retarget('ringY', ringY, event.clientY - 20, RING_TRANSITION);
            setVisible(true);
        };

        const handleMouseOver = (event) => {
            try {
                const target = event.target;
                if (!target) return;

                const isLink = target.tagName === 'A' || (target.closest && target.closest('a'));
                const isButton = target.tagName === 'BUTTON' || (target.closest && target.closest('button'));
                const isClickable =
                    (target.classList &&
                        typeof target.classList.contains === 'function' &&
                        target.classList.contains('cursor-pointer')) ||
                    (target.closest && target.closest('.cursor-pointer'));
                const nextHovering = Boolean(isLink || isButton || isClickable);
                if (nextHovering === hoveringRef.current) return;

                hoveringRef.current = nextHovering;
                retarget('dotScale', dotScale, nextHovering ? 0 : 1, DOT_TRANSITION);
                retarget('ringScale', ringScale, nextHovering ? 1.5 : 1, RING_TRANSITION);
                if (ringRef.current) {
                    ringRef.current.style.backgroundColor = nextHovering
                        ? 'var(--text-main)'
                        : 'transparent';
                }
            } catch {
                // Ignore DOM query errors on unusual SVG nodes.
            }
        };

        const handleMouseLeave = () => setVisible(false);
        const handleMouseEnter = () => setVisible(true);

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mouseover', handleMouseOver);
        document.body.addEventListener('mouseleave', handleMouseLeave);
        document.body.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            animationsRef.current.forEach((animation) => animation.stop());
            animationsRef.current.clear();
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseover', handleMouseOver);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
            document.body.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [dotOpacity, dotScale, dotX, dotY, isTouchDevice, ringOpacity, ringScale, ringX, ringY]);

    if (isTouchDevice) return null;

    return (
        <>
            <motion.div
                className="custom-cursor-dot fixed top-0 left-0 w-2.5 h-2.5 bg-[var(--text-main)] rounded-full pointer-events-none z-[9999] mix-blend-difference"
                style={{ x: dotX, y: dotY, opacity: dotOpacity, scale: dotScale }}
            />
            <motion.div
                ref={ringRef}
                className="custom-cursor-ring fixed top-0 left-0 w-10 h-10 border border-[var(--text-main)] rounded-full pointer-events-none z-[9998] mix-blend-difference"
                style={{
                    x: ringX,
                    y: ringY,
                    opacity: ringOpacity,
                    scale: ringScale,
                    backgroundColor: 'transparent',
                }}
            />
        </>
    );
};

export default CustomCursor;
