import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PianoTextProps {
    text: string;
    className?: string;
}

// Splits the provided text into individual letter spans and applies a smooth
// magnifying glass / expanding effect on hover with staggered animations.
// Creates a polished, professional text interaction effect across all Type pages.
export const PianoText: React.FC<PianoTextProps> = ({ text, className = '' }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const letters = text.split('');

    return (
        <span className={`inline-block whitespace-nowrap ${className}`.trim()}>
            {letters.map((ch, idx) => {
                const isHovered = hoveredIndex === idx;
                const distance = hoveredIndex !== null ? Math.abs(idx - hoveredIndex) : Infinity;
                const affectRadius = 2; // Number of letters affected by magnifying glass effect

                return (
                    <motion.span
                        key={idx}
                        className="inline-block"
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        animate={{
                            scale: isHovered 
                                ? 1.35 
                                : distance <= affectRadius && hoveredIndex !== null
                                ? 1 + (0.25 * (1 - distance / (affectRadius + 1)))
                                : 1,
                            y: isHovered 
                                ? -8 
                                : distance <= affectRadius && hoveredIndex !== null
                                ? -4 * (1 - distance / (affectRadius + 1))
                                : 0,
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 30,
                            mass: 0.8,
                        }}
                    >
                        {ch === ' ' ? '\u00A0' : ch}
                    </motion.span>
                );
            })}
        </span>
    );
};

export default PianoText;
