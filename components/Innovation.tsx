import React from 'react';
import { motion } from 'framer-motion';

const SmoothWaveText = ({ text, className }: { text: string, className?: string }) => {
  return (
    <motion.span 
      className={`inline-block cursor-default ${className}`}
      initial="initial"
      whileHover="hover"
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          className="inline-block"
          variants={{
            initial: { y: 0, scale: 1 },
            hover: { y: -4, scale: 1.05 }
          }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: index * 0.015
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export const Innovation: React.FC = () => {
    return (
        <section id="innovation" className="py-20 md:py-24 bg-brand-cream dark:bg-brand-green transition-colors duration-300 overflow-hidden">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        <SmoothWaveText text="Constant Innovation:" /> <br />
                        <span className="font-light text-brand-green dark:text-brand-gold">
                            <SmoothWaveText text="Unlimited Possibilities" />
                        </span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Card 1 */}
                    <div className="relative group rounded-3xl overflow-hidden min-h-[300px] md:h-[400px] cursor-pointer hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(16,79,56,0.3)] hover:ring-1 hover:ring-white/20 transition-all duration-300 ease-out">
                        <img 
                            src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                            alt="Global Innovation" 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                        />
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 md:p-8 flex flex-col justify-between">
                            <div></div>
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Global +</h3>
                                <p className="text-gray-300 text-sm translate-y-0 md:translate-y-4 opacity-100 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300">
                                    AI Data Projects at Scale - Delivering enterprise solutions across borders with precision and excellence.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="relative group rounded-3xl overflow-hidden min-h-[300px] md:h-[400px] mt-6 md:mt-0 cursor-pointer hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(16,79,56,0.3)] hover:ring-1 hover:ring-white/20 transition-all duration-300 ease-out">
                         <img 
                            src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                            alt="Team Collaboration" 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                        />
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 md:p-8 flex flex-col justify-between">
                            <div></div>
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Expertise +</h3>
                                <p className="text-gray-300 text-sm translate-y-0 md:translate-y-4 opacity-100 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300">
                                    Team Collaboration - Industry-leading talent working together to solve your most complex data challenges.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center border-t border-gray-200 dark:border-white/10 pt-8">
                    <p className="text-gray-600 dark:text-green-100/70">
                        No matter the industry, size or the type of data involved, our solutions are <span className="font-bold text-gray-900 dark:text-white">capable</span> of satisfying any AI-data processing requirement.
                    </p>
                </div>
                </motion.div>
            </div>
        </section>
    );
};
