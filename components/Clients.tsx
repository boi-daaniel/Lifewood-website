import React from 'react';
import { motion } from 'framer-motion';

const clients = [
    { name: 'Google', scale: 1 },
    { name: 'Moore Foundation', scale: 0.8 },
    { name: 'BYU', scale: 0.9 },
    { name: 'Pathway', scale: 0.9 },
    { name: 'Microsoft', scale: 1 },
    { name: 'Meta', scale: 1 },
];

export const Clients: React.FC = () => {
    return (
        <section className="py-20 border-y border-gray-100 dark:border-white/5 bg-brand-cream dark:bg-brand-green transition-colors duration-300 overflow-hidden">
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-100%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ margin: "-100px" }}
                transition={{ duration: 1 }}
            >
                <div className="container mx-auto px-6 text-center mb-16">
                    <h3 className="text-2xl font-medium text-gray-500 dark:text-green-100/50">Our Clients And Partners</h3>
                </div>
                
                <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                    {/* First Marquee Set */}
                    <ul className="flex items-center justify-center md:justify-start [&_li]:mx-12 [&_img]:max-w-none animate-marquee min-w-full flex-shrink-0">
                        {clients.map((client, index) => (
                            <li key={`client-1-${index}`}>
                                 <span className="text-4xl md:text-5xl font-bold text-gray-300 dark:text-green-100/30 hover:text-gray-800 dark:hover:text-white transition-colors whitespace-nowrap cursor-default">
                                    {client.name}
                                </span>
                            </li>
                        ))}
                    </ul>
                    
                    {/* Second Marquee Set (Duplicate for infinite scroll) */}
                    <ul className="flex items-center justify-center md:justify-start [&_li]:mx-12 [&_img]:max-w-none animate-marquee min-w-full flex-shrink-0" aria-hidden="true">
                        {clients.map((client, index) => (
                            <li key={`client-2-${index}`}>
                                <span className="text-4xl md:text-5xl font-bold text-gray-300 dark:text-green-100/30 hover:text-gray-800 dark:hover:text-white transition-colors whitespace-nowrap cursor-default">
                                    {client.name}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="mt-16 max-w-3xl mx-auto text-center px-6">
                    <p className="text-sm text-gray-500 dark:text-green-100/50 leading-relaxed">
                        We are proud to partner and work with leading organizations worldwide in transforming data into meaningful solutions. Lifewood's commitment to innovation and excellence has earned the trust of global brands across industries.
                    </p>
                </div>
            </motion.div>
        </section>
    );
};