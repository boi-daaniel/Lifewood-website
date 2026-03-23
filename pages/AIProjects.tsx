import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowUpRight,
    BookOpen,
    Brain,
    Database,
    Globe,
    MessageSquare,
    Sparkles,
    Zap
} from 'lucide-react';
import { ContactUsButton } from '../components/ContactUsButton';

interface ProjectItem {
    id: number;
    title: string;
    icon: React.ReactNode;
    description: string;
    details: string[];
    image: string;
    category: string;
    accent: string;
}

export const AIProjects: React.FC = () => {
    const projects: ProjectItem[] = useMemo(
        () => [
            {
                id: 1,
                title: 'Data Extraction',
                category: 'Document Intelligence',
                icon: <Database className="h-5 w-5" />,
                description: 'Structured data extraction from complex files, documents, and operational sources.',
                details: [
                    'Multi-format document ingestion',
                    'OCR-assisted field mapping',
                    'Validation pipelines for extracted content',
                    'Human review for high-accuracy delivery'
                ],
                image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=1200',
                accent: 'from-[#133020] to-[#046241]'
            },
            {
                id: 2,
                title: 'Machine Learning Enablement',
                category: 'Model Readiness',
                icon: <Brain className="h-5 w-5" />,
                description: 'Training datasets, annotation systems, and evaluation workflows for production-ready ML.',
                details: [
                    'Dataset preparation and QA',
                    'Labeling operations at scale',
                    'Benchmarking and error analysis',
                    'Iterative optimization support'
                ],
                image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200',
                accent: 'from-[#101820] to-[#2f3945]'
            },
            {
                id: 3,
                title: 'Autonomous Driving Technology',
                category: 'Computer Vision',
                icon: <Zap className="h-5 w-5" />,
                description: 'Scenario-rich datasets and sensor interpretation support for mobility and driving systems.',
                details: [
                    'Edge-case scenario annotation',
                    'Sensor-aligned frame review',
                    'Safety-first validation workflows',
                    'Large-scale visual dataset support'
                ],
                image: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=1200',
                accent: 'from-[#5a3100] to-[#ffb347]'
            },
            {
                id: 4,
                title: 'AI-Enabled Customer Service',
                category: 'Conversation Systems',
                icon: <MessageSquare className="h-5 w-5" />,
                description: 'Datasets and quality programs that improve support automation and customer understanding.',
                details: [
                    'Intent and resolution mapping',
                    'Conversation curation and scoring',
                    'Sentiment-aligned training data',
                    'Response quality benchmarking'
                ],
                image: 'https://images.pexels.com/photos/8867431/pexels-photo-8867431.jpeg?auto=compress&cs=tinysrgb&w=1200',
                accent: 'from-[#046241] to-[#0c8d61]'
            },
            {
                id: 5,
                title: 'NLP and Speech Acquisition',
                category: 'Language Data',
                icon: <BookOpen className="h-5 w-5" />,
                description: 'Text and voice datasets built for multilingual, domain-specific, and speech-enabled AI.',
                details: [
                    'Multi-language corpora creation',
                    'Speech and accent diversity collection',
                    'Transcription and normalization',
                    'Domain vocabulary support'
                ],
                image: 'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg?auto=compress&cs=tinysrgb&w=1200',
                accent: 'from-[#223148] to-[#5d6f8c]'
            },
            {
                id: 6,
                title: 'Genealogy Research',
                category: 'Historical Intelligence',
                icon: <Globe className="h-5 w-5" />,
                description: 'Genealogical data verification, relationship mapping, and record-based research support.',
                details: [
                    'Historical source verification',
                    'Relationship and lineage mapping',
                    'Citation and reference validation',
                    'Large archive review workflows'
                ],
                image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1200',
                accent: 'from-[#5d4727] to-[#c7a266]'
            }
        ],
        []
    );

    const [activeId, setActiveId] = useState<number>(projects[0].id);
    const activeProject = projects.find((project) => project.id === activeId) ?? projects[0];

    return (
        <div className="min-h-screen bg-[#f5f2ea] pb-20 pt-20 text-[#101820] md:pt-24">
            <section className="container mx-auto px-6 py-10 md:py-16">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55 }}
                            className="relative overflow-hidden rounded-[34px] border border-[#d7d0c2] bg-white p-7 shadow-[0_25px_60px_rgba(16,24,32,0.08)] sm:p-9"
                        >
                            <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-[#ffb347]/25 blur-3xl" />
                            <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-[#046241]/12 blur-3xl" />
                            <div className="relative z-10">
                                <span className="inline-flex items-center gap-2 rounded-full border border-[#133020]/10 bg-[#f6f2e7] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#133020]">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    AI Projects
                                </span>
                                <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.04em] md:text-7xl">
                                    Where Lifewood turns
                                    <span className="block text-[#046241]">complex AI work into real execution.</span>
                                </h1>
                                <p className="mt-6 max-w-3xl text-base leading-8 text-[#42505b] md:text-lg">
                                    Our project portfolio spans document intelligence, language data, model enablement,
                                    customer experience systems, and high-precision research operations. Each initiative is
                                    built around scale, review discipline, and practical business impact.
                                </p>

                                <div className="mt-8">
                                    <ContactUsButton />
                                </div>

                                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                                    <div className="rounded-[24px] border border-[#101820]/8 bg-[#f8f6f0] p-5">
                                        <p className="text-[11px] uppercase tracking-[0.28em] text-[#6b665d]">Focus</p>
                                        <p className="mt-2 text-lg font-semibold">Human-reviewed AI delivery</p>
                                    </div>
                                    <div className="rounded-[24px] border border-[#101820]/8 bg-[#f8f6f0] p-5">
                                        <p className="text-[11px] uppercase tracking-[0.28em] text-[#6b665d]">Coverage</p>
                                        <p className="mt-2 text-lg font-semibold">Multi-modal, multi-market datasets</p>
                                    </div>
                                    <div className="rounded-[24px] border border-[#101820]/8 bg-[#f8f6f0] p-5">
                                        <p className="text-[11px] uppercase tracking-[0.28em] text-[#6b665d]">Approach</p>
                                        <p className="mt-2 text-lg font-semibold">Operationally rigorous execution</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.08 }}
                            className="grid gap-6"
                        >
                            <div className={`overflow-hidden rounded-[34px] bg-gradient-to-br ${activeProject.accent} p-5 text-white shadow-[0_28px_60px_rgba(16,24,32,0.14)]`}>
                                <img
                                    src={activeProject.image}
                                    alt={activeProject.title}
                                    className="h-[310px] w-full rounded-[26px] object-cover sm:h-[360px]"
                                />
                                <div className="mt-5 flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-[11px] uppercase tracking-[0.32em] text-white/60">{activeProject.category}</p>
                                        <h2 className="mt-2 text-2xl font-semibold leading-tight">{activeProject.title}</h2>
                                    </div>
                                    <div className="rounded-full border border-white/15 bg-white/10 p-3">
                                        {activeProject.icon}
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[30px] border border-[#d7d0c2] bg-[#efe8d7] p-6">
                                <p className="text-[11px] uppercase tracking-[0.32em] text-[#6b665d]">Featured Project Lens</p>
                                <p className="mt-4 text-base leading-8 text-[#2d3740]">
                                    {activeProject.description}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.32em] text-[#6b665d]">Project Catalog</p>
                            <h2 className="mt-3 text-4xl font-semibold leading-tight text-[#101820] md:text-5xl">
                                Select a project focus to explore how we deliver.
                            </h2>
                        </div>
                        <p className="max-w-xl text-sm leading-7 text-[#4f5a63]">
                            Instead of a static project list, this view highlights one active capability at a time while still letting the rest of the portfolio stay visible and easy to scan.
                        </p>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                        <div className="grid gap-4">
                            {projects.map((project, index) => {
                                const isActive = project.id === activeId;
                                return (
                                    <motion.button
                                        key={project.id}
                                        type="button"
                                        initial={{ opacity: 0, y: 12 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: '-80px' }}
                                        transition={{ duration: 0.35, delay: index * 0.05 }}
                                        onClick={() => setActiveId(project.id)}
                                        className={`w-full rounded-[28px] border p-5 text-left transition-all duration-300 ${
                                            isActive
                                                ? 'border-[#133020]/30 bg-white shadow-[0_20px_50px_rgba(16,24,32,0.08)]'
                                                : 'border-[#d7d0c2] bg-[#fbfaf6] hover:border-[#133020]/20 hover:bg-white'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className={`mt-1 flex h-12 w-12 items-center justify-center rounded-2xl ${
                                                    isActive ? 'bg-[#133020] text-white' : 'bg-[#ece5d5] text-[#133020]'
                                                }`}>
                                                    {project.icon}
                                                </div>
                                                <div>
                                                    <p className="text-[11px] uppercase tracking-[0.28em] text-[#6b665d]">{project.category}</p>
                                                    <h3 className="mt-2 text-xl font-semibold text-[#101820]">{project.title}</h3>
                                                    <p className="mt-2 text-sm leading-7 text-[#52606a]">
                                                        {project.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`rounded-full p-2 transition ${
                                                isActive ? 'bg-[#ffb347] text-[#101820]' : 'bg-[#ece5d5] text-[#6b665d]'
                                            }`}>
                                                <ArrowUpRight className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>

                        <motion.div
                            key={activeProject.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35 }}
                            className="overflow-hidden rounded-[34px] border border-[#d7d0c2] bg-white shadow-[0_24px_60px_rgba(16,24,32,0.08)]"
                        >
                            <div className={`bg-gradient-to-br ${activeProject.accent} p-6 text-white sm:p-7`}>
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <p className="text-[11px] uppercase tracking-[0.32em] text-white/60">{activeProject.category}</p>
                                        <h3 className="mt-2 text-3xl font-semibold leading-tight">{activeProject.title}</h3>
                                    </div>
                                    <div className="rounded-full border border-white/15 bg-white/10 p-3">
                                        {activeProject.icon}
                                    </div>
                                </div>
                                <p className="mt-5 max-w-2xl text-sm leading-8 text-white/80">
                                    {activeProject.description}
                                </p>
                            </div>

                            <div className="grid gap-0 border-t border-[#ece7db] md:grid-cols-2">
                                {activeProject.details.map((detail, index) => (
                                    <div
                                        key={detail}
                                        className={`p-6 ${index % 2 === 0 ? 'md:border-r md:border-[#ece7db]' : ''} ${
                                            index < activeProject.details.length - 2 ? 'border-b border-[#ece7db]' : ''
                                        }`}
                                    >
                                        <p className="text-[11px] uppercase tracking-[0.28em] text-[#6b665d]">
                                            Capability {index + 1}
                                        </p>
                                        <p className="mt-3 text-base leading-8 text-[#1e2930]">{detail}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto mt-20 px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="rounded-[30px] bg-[#101820] p-6 text-white shadow-[0_20px_50px_rgba(16,24,32,0.14)]">
                            <p className="text-[11px] uppercase tracking-[0.3em] text-white/45">Project Strength</p>
                            <h3 className="mt-4 text-3xl font-semibold">Scalable delivery</h3>
                            <p className="mt-3 text-sm leading-7 text-white/72">
                                Built to support high-volume workflows without losing quality control.
                            </p>
                        </div>
                        <div className="rounded-[30px] bg-[#ffb347] p-6 text-[#101820] shadow-[0_20px_50px_rgba(255,179,71,0.2)]">
                            <p className="text-[11px] uppercase tracking-[0.3em] text-[#7d4a00]">Project Strength</p>
                            <h3 className="mt-4 text-3xl font-semibold">Human review layers</h3>
                            <p className="mt-3 text-sm leading-7 text-[#3d2a12]">
                                Every workflow can be shaped with reviewer checkpoints, QA, and accuracy control.
                            </p>
                        </div>
                        <div className="rounded-[30px] bg-[#046241] p-6 text-white shadow-[0_20px_50px_rgba(4,98,65,0.18)]">
                            <p className="text-[11px] uppercase tracking-[0.3em] text-white/45">Project Strength</p>
                            <h3 className="mt-4 text-3xl font-semibold">Cross-market adaptability</h3>
                            <p className="mt-3 text-sm leading-7 text-white/72">
                                Project structures can flex across languages, industries, and regional requirements.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
