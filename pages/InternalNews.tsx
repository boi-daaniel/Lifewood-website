import React from 'react';
import { motion } from 'framer-motion';

export const InternalNews: React.FC = () => {
    return (
        <div className="bg-[#f3f3f3] dark:bg-brand-green min-h-screen pt-20 md:pt-24 pb-24 transition-colors duration-300 dark:[&_h1]:text-white dark:[&_h2]:text-white dark:[&_h3]:text-white dark:[&_h4]:text-white dark:[&_p]:text-gray-200 dark:[&_blockquote]:text-gray-100">
            <section className="container mx-auto px-6 mt-8">
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-5xl mx-auto"
                >
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#e8ece8] text-[#7f8c8f] text-sm font-medium">
                        Internal News
                    </span>

                    <h1 className="mt-4 text-5xl md:text-6xl font-semibold text-black tracking-tight">Rootstech 2026</h1>
                    <p className="mt-2 text-base md:text-lg text-gray-500">Coming Soon</p>

                    <div className="mt-8 rounded-[1.6rem] overflow-hidden bg-white shadow-[0_18px_46px_rgba(15,23,42,0.14)] ring-1 ring-black/5">
                        <div className="relative pt-[56.25%]">
                            <iframe
                                src="https://www.youtube.com/embed/ccyrQ87EJag?rel=0"
                                title="Internal news video"
                                className="absolute inset-0 w-full h-full"
                                loading="lazy"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};
