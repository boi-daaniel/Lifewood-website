import React from 'react';
import { motion } from 'framer-motion';

const clients = [
    { name: 'Google', logo: 'https://framerusercontent.com/images/cjJDncfOy71yWizT3ZRdsZB4W0.png?scale-down-to=1024&width=1920&height=1080', zoom: 1.45 },
    { name: 'Moore Foundation', logo: 'https://framerusercontent.com/images/HWbvpkExIBUbdXEGILLSX4PTcEE.png?scale-down-to=512&width=1920&height=551', zoom: 1.35 },
    { name: 'BYU Pathway Worldwide', logo: 'https://framerusercontent.com/images/m37jhLfPRl449iXOe8op7cY68c.png?scale-down-to=1024&width=1920&height=1080', zoom: 1.45 },
    { name: 'Ancestry', logo: 'https://framerusercontent.com/images/Yq2A1QFJLXgGQ3b7NZPthsD9RBk.png?scale-down-to=1024&width=1920&height=1080', zoom: 1.45 },
    { name: 'FamilySearch', logo: 'https://framerusercontent.com/images/5mxPuoDvu4IebUtQtNowrZOfWSg.png?scale-down-to=1024&width=1920&height=1080', zoom: 1.45 },
    { name: 'Microsoft', logo: 'https://framerusercontent.com/images/2rRd2Mk1HzeDgPbL0e8wwkUPo.png?scale-down-to=1024&width=1920&height=1080', zoom: 1.45 },
    { name: 'Apple', logo: 'https://framerusercontent.com/images/RyIkooWlUn6nQYbljETePWzd2Ac.png?scale-down-to=1024&width=1243&height=713', zoom: 1.35 },
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
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1 }}
            >
                <div className="container mx-auto px-6 text-center mb-16">
                    <h3 className="text-2xl font-medium text-gray-500 dark:text-green-100/50">Our Clients And Partners</h3>
                </div>
                
                <div className="w-full inline-flex flex-nowrap overflow-hidden py-4 [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                    {/* First Marquee Set */}
                    <ul className="flex items-center justify-center md:justify-start [&_li]:mx-16 md:[&_li]:mx-20 [&_img]:max-w-none animate-marquee min-w-full flex-shrink-0">
                        {clients.map((client, index) => (
                            <li key={`client-1-${index}`}>
                                {client.logo ? (
                                    <img
                                        src={client.logo}
                                        alt={client.name}
                                        className="h-[100px] md:h-[116px] w-auto object-contain bg-transparent opacity-65 grayscale contrast-75 brightness-90 hover:opacity-100 hover:grayscale-0 hover:contrast-100 hover:brightness-100 transition-all duration-300"
                                        style={{ transform: `scale(${client.zoom ?? 1})`, transformOrigin: 'center' }}
                                    />
                                ) : (
                                    <span className="text-4xl md:text-5xl font-bold text-gray-300 dark:text-green-100/30 hover:text-gray-800 dark:hover:text-white transition-colors whitespace-nowrap cursor-default">
                                        {client.name}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                    
                    {/* Second Marquee Set (Duplicate for infinite scroll) */}
                    <ul className="flex items-center justify-center md:justify-start [&_li]:mx-16 md:[&_li]:mx-20 [&_img]:max-w-none animate-marquee min-w-full flex-shrink-0" aria-hidden="true">
                        {clients.map((client, index) => (
                            <li key={`client-2-${index}`}>
                                {client.logo ? (
                                    <img
                                        src={client.logo}
                                        alt={client.name}
                                        className="h-[100px] md:h-[116px] w-auto object-contain bg-transparent opacity-65 grayscale contrast-75 brightness-90 hover:opacity-100 hover:grayscale-0 hover:contrast-100 hover:brightness-100 transition-all duration-300"
                                        style={{ transform: `scale(${client.zoom ?? 1})`, transformOrigin: 'center' }}
                                    />
                                ) : (
                                    <span className="text-4xl md:text-5xl font-bold text-gray-300 dark:text-green-100/30 hover:text-gray-800 dark:hover:text-white transition-colors whitespace-nowrap cursor-default">
                                        {client.name}
                                    </span>
                                )}
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
