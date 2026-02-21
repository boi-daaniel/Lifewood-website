import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus, Minus, Database, Brain, Zap, MessageSquare, BookOpen, Globe } from 'lucide-react';

interface ProjectItem {
    id: number;
    title: string;
    icon: React.ReactNode;
    description: string;
    details: string[];
    image: string;
}

export const AIProjects: React.FC = () => {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const projects: ProjectItem[] = [
        {
            id: 1,
            title: 'Data Extract on',
            icon: <Database className="w-6 h-6" />,
            description: 'Extract structured data from complex documents and sources',
            details: [
                'Multi-format document processing',
                'Intelligent field mapping',
                'OCR integration',
                'Quality assurance workflows'
            ],
            image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=1'
        },
        {
            id: 2,
            title: 'Machine learning Enablement',
            icon: <Brain className="w-6 h-6" />,
            description: 'Build and train ML models with enterprise-grade data',
            details: [
                'Dataset preparation and labeling',
                'Model training pipelines',
                'Performance optimization',
                'Model evaluation frameworks'
            ],
            image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=1'
        },
        {
            id: 3,
            title: 'Autonomous Driving Technology',
            icon: <Zap className="w-6 h-6" />,
            description: 'Data solutions for autonomous vehicle development',
            details: [
                'Sensor data collection',
                'Scenario annotation',
                'Edge case identification',
                'Safety validation datasets'
            ],
            image: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=1'
        },
        {
            id: 4,
            title: 'AI-Enabled Customer Service',
            icon: <MessageSquare className="w-6 h-6" />,
            description: 'Enhance customer interactions with intelligent systems',
            details: [
                'Conversation dataset curation',
                'Intent classification',
                'Sentiment analysis training',
                'Response quality benchmarking'
            ],
            image: 'https://images.pexels.com/photos/8867431/pexels-photo-8867431.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=1'
        },
        {
            id: 5,
            title: 'Natural Language Processing and Speech Acquisition on',
            icon: <BookOpen className="w-6 h-6" />,
            description: 'Advanced NLP and speech data solutions',
            details: [
                'Multi-language text corpora',
                'Speech audio collection',
                'Dialect and accent diversity',
                'Domain-specific terminology'
            ],
            image: 'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=1'
        },
        {
            id: 6,
            title: 'Genealogy',
            icon: <Globe className="w-6 h-6" />,
            description: 'Genealogical data research and verification',
            details: [
                'Family tree data validation',
                'Historical record matching',
                'Relationship mapping',
                'Citation verification'
            ],
            image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=1'
        }
    ];

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const activeProject = projects.find((project) => project.id === expandedId) ?? projects[0];

    return (
        <div className="bg-white dark:bg-brand-green min-h-screen pt-24 transition-colors duration-300">
            {/* Hero Section */}
            <section className="container mx-auto px-6 py-12 md:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 text-gray-900 dark:text-white tracking-tight overflow-hidden">
                        <motion.span
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="inline-block"
                        >
                            AI Projects
                        </motion.span>
                    </h1>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mb-12 leading-relaxed"
                    >
                        From building AI datasets to enterprise language and error-unit to developing custom AI phenomenal production and open new opportunities in under-resourced economics, you'll see how Lifewood is bringing the future with innovation, integrity, and a focus on people.
                    </motion.p>
                    
                    <button className="bg-brand-gold hover:bg-yellow-500 text-black px-8 py-3 rounded-full font-medium flex items-center gap-2 transition-colors">
                        Contact us <ArrowRight size={18} />
                    </button>
                </motion.div>
            </section>

            {/* Main Content - Grid Layout */}
            <section className="container mx-auto px-6 py-16 mb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="mb-12">
                        <span className="inline-block bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">Projects</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            What we currently handle
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Left Side - Image */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="hidden lg:block"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-square">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={activeProject.id}
                                        initial={{ opacity: 0.35, scale: 1.03 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ duration: 0.28, ease: 'easeOut' }}
                                        src={activeProject.image}
                                        alt={activeProject.title}
                                        className="w-full h-full object-cover absolute inset-0"
                                    />
                                </AnimatePresence>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="inline-flex bg-black/45 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                                        {activeProject.title}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Side - Accordion Items */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="space-y-4"
                        >
                            {projects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ margin: "-100px" }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                >
                                    <button
                                        onClick={() => toggleExpand(project.id)}
                                        className="w-full"
                                    >
                                        <motion.div
                                            className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                                                expandedId === project.id
                                                    ? 'bg-brand-gold/10 border-brand-gold dark:bg-brand-gold/20'
                                                    : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-brand-gold/50'
                                            }`}
                                            layout
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-4 flex-1">
                                                    <div className={`p-3 rounded-lg transition-colors ${
                                                        expandedId === project.id
                                                            ? 'bg-brand-gold text-black'
                                                            : 'bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white'
                                                    }`}>
                                                        {project.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white text-left">
                                                            {project.id}. {project.title}
                                                        </h3>
                                                        {expandedId !== project.id && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                {project.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                                                    expandedId === project.id
                                                        ? 'bg-brand-gold text-black'
                                                        : 'bg-gray-200 dark:bg-white/10'
                                                }`}>
                                                    {expandedId === project.id ? (
                                                        <Minus size={20} />
                                                    ) : (
                                                        <Plus size={20} />
                                                    )}
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                {expandedId === project.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="mt-6 pt-6 border-t-2 border-gray-200 dark:border-white/10"
                                                    >
                                                        <p className="text-gray-700 dark:text-gray-300 mb-4 font-medium">
                                                            {project.description}
                                                        </p>
                                                        <ul className="space-y-2">
                                                            {project.details.map((detail, idx) => (
                                                                <motion.li
                                                                    key={idx}
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: idx * 0.05 }}
                                                                    className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400"
                                                                >
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold flex-shrink-0"></div>
                                                                    {detail}
                                                                </motion.li>
                                                            ))}
                                                        </ul>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    </button>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};
