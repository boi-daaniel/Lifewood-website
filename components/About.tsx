import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const About: React.FC = () => {
    return (
        <section id="about" className="py-24 bg-brand-cream dark:bg-brand-green transition-colors duration-300 relative">
            <div className="container mx-auto px-6">
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col lg:flex-row gap-16 items-start"
                >
                    {/* Header Side */}
                    <div className="lg:w-1/3">
                        <span className="text-sm font-bold tracking-widest text-brand-gold uppercase mb-3 block hover:translate-x-2 transition-transform duration-300 cursor-default inline-block">• About Us</span>
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 hover:text-brand-green dark:hover:text-brand-gold transition-colors duration-300 cursor-default">Empowering Intelligence.</h2>
                        <div className="flex gap-2 mb-8">
                            <div className="w-12 h-12 rounded-full bg-brand-dark dark:bg-white hover:scale-110 transition-transform duration-300"></div>
                            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/20 hover:scale-110 transition-transform duration-300 delay-75"></div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="lg:w-2/3">
                        <p className="text-2xl md:text-3xl font-light text-gray-800 dark:text-green-100 leading-normal mb-8 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 cursor-default">
                            At <span className="font-bold text-brand-green dark:text-white hover:text-brand-gold transition-colors duration-300">Lifewood</span>, we empower our company and our clients to realize the transformative power of AI: bringing big data to life, launching new ways of thinking, learning, and doing, for the good of humankind.
                        </p>
                        
                        <p className="text-gray-500 dark:text-green-100/70 mb-10 leading-relaxed max-w-xl">
                            By connecting local expertise with our global AI data infrastructure, we create opportunities, empower communities, and drive inclusive growth worldwide.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button className="px-6 py-3 rounded-full bg-brand-dark dark:bg-white dark:text-brand-dark text-white font-medium hover:bg-black dark:hover:bg-gray-100 transition-colors flex items-center gap-2">
                                Know Us Better
                                <ArrowRight size={16} />
                            </button>
                            <button className="px-6 py-3 rounded-full border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                                Explore Our Culture
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};