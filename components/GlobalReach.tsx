import React, { useState, useEffect, useRef } from 'react';
import { Globe, Users, MessageCircle, Database, ArrowUpRight } from 'lucide-react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { StatItem } from '../types';

const Counter = ({ value, className }: { value: string, className?: string }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-20px" });
    
    const numberMatch = value.match(/\d+/);
    const numericValue = numberMatch ? parseInt(numberMatch[0]) : 0;
    const suffix = value.replace(/\d+/, '');
    
    const spring = useSpring(0, { mass: 1, stiffness: 50, damping: 20 });
    const display = useTransform(spring, (current) => Math.round(current) + suffix);

    useEffect(() => {
        if (isInView) {
            spring.set(numericValue);
        } else {
            spring.set(0);
        }
    }, [isInView, numericValue, spring]);

    return <motion.span ref={ref} className={className}>{display}</motion.span>;
};

const stats: StatItem[] = [
    {
        id: '1',
        label: 'Global Delivery Centers',
        value: '40+',
        description: 'Strategically located centers ensuring 24/7 operational excellence.',
        bgColor: 'bg-white dark:bg-white/10 shadow-lg dark:shadow-none',
        textColor: 'text-gray-900 dark:text-white',
        iconBgColor: 'bg-gray-100 dark:bg-white/20',
        descriptionColor: 'text-gray-600 dark:text-gray-300'
    },
    {
        id: '2',
        label: 'Countries Across All Continents',
        value: '30+',
        description: 'Extensive operations in Africa, Asia, Europe, and the Americas reflecting diverse datasets.',
        bgColor: 'bg-brand-orange',
        textColor: 'text-gray-900',
        iconBgColor: 'bg-black/10',
        descriptionColor: 'text-gray-800'
    },
    {
        id: '3',
        label: 'Language Capabilities',
        value: '50+',
        description: 'Covering major dialects and rare languages to train truly global models.',
        bgColor: 'bg-brand-green dark:bg-white',
        textColor: 'text-white dark:text-brand-green',
        iconBgColor: 'bg-white/20 dark:bg-brand-green/10',
        descriptionColor: 'text-green-100 dark:text-brand-green/80'
    },
    {
        id: '4',
        label: 'Global Online Resources',
        value: '56k+',
        description: 'A massive crowd-sourced workforce ready to scale at a moment\'s notice.',
        bgColor: 'bg-black',
        textColor: 'text-white',
        iconBgColor: 'bg-white/20',
        descriptionColor: 'text-gray-400'
    }
];

export const GlobalReach: React.FC = () => {
    const [activeId, setActiveId] = useState<string>('2');

    return (
        <section id="impact" className="py-20 bg-brand-cream dark:bg-brand-green transition-colors duration-300">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Global Footprint</h2>
                        <p className="text-gray-500 dark:text-green-100/70 mt-2">Scale your AI with our worldwide infrastructure.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[400px]">
                    {stats.map((stat) => (
                        <div
                            key={stat.id}
                            onMouseEnter={() => setActiveId(stat.id)}
                            className={`
                                relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-out
                                ${activeId === stat.id ? 'lg:flex-[3] flex-[3]' : 'lg:flex-[1] flex-[1]'}
                                ${activeId === stat.id ? 'h-[300px] lg:h-auto' : 'h-[100px] lg:h-auto'}
                                ${stat.bgColor}
                            `}
                        >
                            <div className="absolute top-6 right-6 z-10">
                                <div className={`p-2 rounded-full ${stat.iconBgColor || (stat.textColor === 'text-white' ? 'bg-white/20' : 'bg-black/10')}`}>
                                    <ArrowUpRight className={stat.textColor} />
                                </div>
                            </div>
                            
                            <div className="absolute inset-0 p-8 flex flex-col justify-center h-full">
                                <h3 className={`text-4xl lg:text-5xl font-bold mb-4 ${stat.textColor}`}>
                                    <Counter value={stat.value} />
                                </h3>

                                {/* Main Content - Only visible when active */}
                                <div className={`transition-opacity duration-300 ${activeId === stat.id ? 'opacity-100 delay-200' : 'opacity-0 pointer-events-none absolute'}`}>
                                    <h4 className={`text-xl font-semibold mb-2 ${stat.textColor}`}>
                                        {stat.label}
                                    </h4>
                                    
                                    <p className={`text-sm lg:text-base leading-relaxed ${stat.descriptionColor || (stat.textColor === 'text-white' ? 'text-gray-300' : 'text-gray-700')}`}>
                                        {stat.description}
                                    </p>
                                </div>
                                
                                {/* Collapsed Label for inactive states on desktop */}
                                {activeId !== stat.id && (
                                    <div className="hidden lg:block absolute bottom-8 left-8 transform origin-left w-full pr-16">
                                         <span className={`text-lg font-bold leading-tight block ${stat.textColor}`}>
                                            {stat.label}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                </motion.div>
            </div>
        </section>
    );
};