import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
    const { scrollY } = useScroll();
    const smoothScrollY = useSpring(scrollY, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });
    const y = useTransform(smoothScrollY, [0, 500], [0, 200]);

    return (
        <section id="home" className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-48 lg:pb-32 overflow-hidden transition-colors duration-300">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    src="https://www.pexels.com/download/video/29607597/"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-black/20" />
            </div>

            <motion.div style={{ y }} className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 dark:bg-white/10 text-brand-green dark:text-white text-xs font-semibold mb-6 tracking-wide uppercase">
                        <span className="w-2 h-2 rounded-full bg-brand-green dark:bg-white animate-pulse" />
                        Powering the Future of AI
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-8">
                        The world's leading provider of <span className="text-brand-green dark:text-brand-gold">AI-powered</span> data solutions.
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-green-100/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                        We empower our partners to realize the transformative power of AI by connecting big data to life-launching new ways of thinking, learning, and doing.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/contact-us" className="px-8 py-4 rounded-full bg-brand-green dark:bg-white dark:text-brand-green text-white font-medium hover:bg-green-900 dark:hover:bg-gray-100 transition-all hover:scale-105 shadow-lg shadow-green-900/20 flex items-center gap-2 w-full sm:w-auto justify-center">
                            Contact Us
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </motion.div>

            <div className="hidden sm:block absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-gray-400 dark:text-green-100/50">
                <ArrowRight size={20} className="rotate-90" />
            </div>
        </section>
    );
};
