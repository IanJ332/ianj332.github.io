import React, { useRef, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════════
   TILT CARD — Vision-Pro style pointer-driven 3D tilt + specular sweep

   Two motion values (normalised pointer position inside the element) feed a
   spring-damped rotateX / rotateY pair and a radial "sheen" whose centre
   tracks the cursor. Springs are under-damped just enough to overshoot
   slightly on entry and settle — that overshoot is what separates this from
   a linear `transform` and makes the surface read as physical.

   IMPORTANT: this component owns the element's `transform`. Framer writes
   transforms inline, and inline beats a stylesheet `:hover { transform }`,
   so `.glass-panel` must NOT declare a hover transform of its own.
   ═══════════════════════════════════════════════════════════════════════ */

const TILT_SPRING = { stiffness: 220, damping: 22, mass: 0.7 };
const LIFT_SPRING = { stiffness: 300, damping: 30, mass: 0.6 };

const TiltCard = ({
    children,
    className = '',
    max = 6,          // peak rotation in degrees at the card's corners
    lift = -5,        // hover translateY, px
    scaleOnHover = 1.008,
    perspective = 1100,
    sheen = true,
    style,
    ...rest
}) => {
    const ref = useRef(null);

    const reducedMotion = useMemo(
        () =>
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        []
    );

    /* Normalised pointer position, 0..1, relative to the element box. */
    const px = useMotionValue(0.5);
    const py = useMotionValue(0.5);
    const hover = useMotionValue(0);

    const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), TILT_SPRING);
    const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), TILT_SPRING);
    const y = useSpring(useTransform(hover, [0, 1], [0, lift]), LIFT_SPRING);
    const scale = useSpring(useTransform(hover, [0, 1], [1, scaleOnHover]), LIFT_SPRING);
    const sheenOpacity = useSpring(hover, LIFT_SPRING);

    const sheenX = useTransform(px, (v) => `${(v * 100).toFixed(2)}%`);
    const sheenY = useTransform(py, (v) => `${(v * 100).toFixed(2)}%`);
    const sheenBackground = useMotionTemplate`radial-gradient(circle 260px at ${sheenX} ${sheenY}, var(--sheen-hot), var(--sheen-cool) 45%, transparent 72%)`;

    const handleMove = useCallback(
        (e) => {
            const el = ref.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            px.set((e.clientX - rect.left) / rect.width);
            py.set((e.clientY - rect.top) / rect.height);
        },
        [px, py]
    );

    const handleEnter = useCallback(() => hover.set(1), [hover]);

    const handleLeave = useCallback(() => {
        hover.set(0);
        // Return to a flat resting pose rather than freezing at the exit angle.
        px.set(0.5);
        py.set(0.5);
    }, [hover, px, py]);

    if (reducedMotion) {
        return (
            <div ref={ref} className={className} style={style} {...rest}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            ref={ref}
            className={`tilt-card ${className}`}
            style={{ rotateX, rotateY, y, scale, transformPerspective: perspective, ...style }}
            onPointerMove={handleMove}
            onPointerEnter={handleEnter}
            onPointerLeave={handleLeave}
            {...rest}
        >
            {children}
            {sheen && (
                <motion.span
                    className="card-sheen"
                    aria-hidden="true"
                    style={{ background: sheenBackground, opacity: sheenOpacity }}
                />
            )}
        </motion.div>
    );
};

export default TiltCard;
