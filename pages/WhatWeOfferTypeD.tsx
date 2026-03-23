import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clapperboard, Mic2, ScanText, Sparkles, Wand2, X } from 'lucide-react';
import { ContactUsButton } from '../components/ContactUsButton';
import './WhatWeOfferTextEffects.css';
import './ElegantTextEffects.css';

const ImageModal: React.FC<{ src: string; alt: string; isOpen: boolean; onClose: () => void }> = ({
    src,
    alt,
    isOpen,
    onClose
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
                >
                    <motion.button
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        onClick={onClose}
                        className="absolute right-6 top-6 z-[60] rounded-full bg-white p-2 text-black transition hover:bg-gray-100"
                    >
                        <X size={22} />
                    </motion.button>
                    <motion.img
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 240 }}
                        src={src}
                        alt={alt}
                        onClick={(event) => event.stopPropagation()}
                        className="max-h-[90vh] max-w-5xl rounded-2xl object-contain"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const WhatWeOfferTypeD: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

    const capabilityCards = useMemo(
        () => [
            {
                title: 'Text Generation',
                description: 'Scripts, storyboards, prompts, messaging frameworks, and narrative support built for brand communication.',
                icon: <ScanText className="h-5 w-5" />
            },
            {
                title: 'Voice & Audio',
                description: 'Voice styling, spoken content workflows, and audio-driven assets for immersive storytelling.',
                icon: <Mic2 className="h-5 w-5" />
            },
            {
                title: 'Image Creation',
                description: 'Visual ideation, concept generation, and polished brand imagery shaped with AI-assisted workflows.',
                icon: <Sparkles className="h-5 w-5" />
            },
            {
                title: 'Video Production',
                description: 'AIGC video direction, compositing, editing, and cinematic scene building for campaign-ready outputs.',
                icon: <Clapperboard className="h-5 w-5" />
            }
        ],
        []
    );

    const gallery = useMemo(
        () => [
            {
                src: 'https://framerusercontent.com/images/8USU1OFCcARiIIvcdJBJlzA8EA4.jpg?scale-down-to=512&width=5184&height=3456',
                alt: 'AIGC cinematic scene 1'
            },
            {
                src: 'https://framerusercontent.com/images/3CdZeNunHzqH9P7TcEFjG2Imb4.jpg?scale-down-to=1024&width=4000&height=6000',
                alt: 'AIGC cinematic scene 2'
            },
            {
                src: 'https://framerusercontent.com/images/pW4xMuxSlAXuophJZT96Q4LO0.jpeg?scale-down-to=512&width=800&height=386',
                alt: 'AIGC cinematic scene 3'
            },
            {
                src: 'https://framerusercontent.com/images/ifVOmevTJG4uimv3rRPBuoDvYM.jpg?scale-down-to=1024&width=5245&height=7867',
                alt: 'AIGC cinematic scene 4'
            },
            {
                src: 'https://framerusercontent.com/images/UZnPJgTru2Os9pqnz20ckvASCI8.jpg?scale-down-to=1024&width=4160&height=6240',
                alt: 'AIGC cinematic scene 5'
            }
        ],
        []
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="offer-textfx elegant-textfx min-h-screen bg-[#f5f2ea] pb-24 pt-28 text-[#101820] md:pt-36"
        >
            <section className="container mx-auto px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55 }}
                            className="relative overflow-hidden rounded-[36px] bg-[#101820] p-7 text-white shadow-[0_28px_70px_rgba(16,24,32,0.22)] sm:p-9"
                        >
                            <div className="absolute -right-10 top-0 h-44 w-44 rounded-full bg-[#ffb347]/20 blur-3xl" />
                            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#046241]/18 blur-3xl" />
                            <div className="relative z-10">
                                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/72">
                                    <Wand2 className="h-3.5 w-3.5" />
                                    Type D — AIGC
                                </span>
                                <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.04em] md:text-7xl">
                                    AI-generated content
                                    <span className="block text-[#ffb347]">with cinematic intent.</span>
                                </h1>
                                <p className="mt-6 max-w-3xl text-base leading-8 text-white/76 md:text-lg">
                                    Lifewood’s AIGC work combines text, voice, image, and video generation into a story-first
                                    production model. We help brands shape stronger visual identity, sharper messaging, and more
                                    memorable digital experiences.
                                </p>

                                <div className="mt-8">
                                    <ContactUsButton />
                                </div>

                                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                                    <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
                                        <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Built for</p>
                                        <p className="mt-2 text-lg font-semibold text-white">Brand storytelling</p>
                                    </div>
                                    <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
                                        <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Powered by</p>
                                        <p className="mt-2 text-lg font-semibold text-white">AI-assisted production</p>
                                    </div>
                                    <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
                                        <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Focused on</p>
                                        <p className="mt-2 text-lg font-semibold text-white">Original visual language</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 26 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.08 }}
                            className="grid gap-6"
                        >
                            <div className="overflow-hidden rounded-[36px] bg-[#ffb347] p-5 text-[#101820] shadow-[0_24px_60px_rgba(255,179,71,0.18)]">
                                <video
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="h-[320px] w-full rounded-[28px] object-cover sm:h-[380px]"
                                >
                                    <source src="https://framerusercontent.com/assets/OYykWaWrUmfZYDy3CJnT4GUNL8.mp4" type="video/mp4" />
                                </video>
                                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                    <div>
                                        <p className="text-[11px] uppercase tracking-[0.32em] text-[#7d4a00]">Creative Direction</p>
                                        <p className="mt-2 text-2xl font-semibold leading-tight">
                                            From generated assets to polished communication pieces.
                                        </p>
                                    </div>
                                    <div className="rounded-full bg-black/8 px-4 py-2 text-xs font-semibold text-[#4d2c04]">
                                        Motion, image, text, and voice in one pipeline
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[30px] border border-[#d7d0c2] bg-white p-6 shadow-[0_18px_40px_rgba(16,24,32,0.06)]">
                                <p className="text-[11px] uppercase tracking-[0.32em] text-[#6b665d]">Our approach</p>
                                <p className="mt-4 text-base leading-8 text-[#2d3740]">
                                    We develop AIGC outputs around the personality of your brand. Instead of relying on generic
                                    automation, we use AI as a creative engine to build distinctive, story-led content with a
                                    stronger visual and emotional signature.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto mt-20 px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.32em] text-[#6b665d]">Creative Surface</p>
                            <h2 className="mt-3 text-4xl font-semibold leading-tight text-[#101820] md:text-5xl">
                                Four ways we shape AI-generated content into actual communication.
                            </h2>
                        </div>
                        <p className="max-w-xl text-sm leading-7 text-[#4f5a63]">
                            Our workflows cover the full creative stack, from ideation and scripting to polished visual output and brand-ready content systems.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                        {capabilityCards.map((card, index) => (
                            <motion.div
                                key={card.title}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ duration: 0.4, delay: index * 0.06 }}
                                className="rounded-[30px] border border-[#d7d0c2] bg-white p-6 shadow-[0_18px_40px_rgba(16,24,32,0.05)]"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#101820] text-white">
                                    {card.icon}
                                </div>
                                <h3 className="mt-6 text-2xl font-semibold text-[#101820]">{card.title}</h3>
                                <p className="mt-4 text-sm leading-7 text-[#55606b]">{card.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="container mx-auto mt-20 px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
                        <div className="rounded-[34px] bg-[#efe8d7] p-7 shadow-[0_20px_50px_rgba(16,24,32,0.06)] sm:p-8">
                            <p className="text-[11px] uppercase tracking-[0.32em] text-[#6b665d]">Why it works</p>
                            <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#101820]">
                                Originality matters more when your audience lives on screens.
                            </h2>
                            <p className="mt-5 text-base leading-8 text-[#36424b]">
                                We focus on the one idea that should anchor the story, then translate it into images, motion,
                                words, and atmosphere that feel surprising without losing brand clarity.
                            </p>

                            <div className="mt-8 grid gap-4">
                                <div className="rounded-[24px] bg-white p-5">
                                    <p className="text-[11px] uppercase tracking-[0.28em] text-[#6b665d]">Story-led</p>
                                    <p className="mt-2 text-sm leading-7 text-[#33404a]">
                                        We begin with narrative and purpose, not just output generation.
                                    </p>
                                </div>
                                <div className="rounded-[24px] bg-white p-5">
                                    <p className="text-[11px] uppercase tracking-[0.28em] text-[#6b665d]">Brand-shaped</p>
                                    <p className="mt-2 text-sm leading-7 text-[#33404a]">
                                        The visuals and tone are built to express your identity, not flatten it.
                                    </p>
                                </div>
                                <div className="rounded-[24px] bg-white p-5">
                                    <p className="text-[11px] uppercase tracking-[0.28em] text-[#6b665d]">Production-aware</p>
                                    <p className="mt-2 text-sm leading-7 text-[#33404a]">
                                        We treat AIGC as part of a creative workflow, not a one-click shortcut.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            {gallery.slice(0, 4).map((item, index) => (
                                <motion.button
                                    key={item.src}
                                    type="button"
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 0.4, delay: index * 0.06 }}
                                    onClick={() => setSelectedImage(item)}
                                    className={`overflow-hidden rounded-[30px] bg-white shadow-[0_18px_42px_rgba(16,24,32,0.08)] ${
                                        index === 0 ? 'sm:translate-y-6' : ''
                                    } ${index === 3 ? 'sm:-translate-y-6' : ''}`}
                                >
                                    <img
                                        src={item.src}
                                        alt={item.alt}
                                        className="h-[260px] w-full object-cover transition duration-500 hover:scale-[1.04]"
                                    />
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto mt-20 px-6">
                <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <motion.button
                        type="button"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45 }}
                        onClick={() => setSelectedImage(gallery[4])}
                        className="overflow-hidden rounded-[34px] bg-[#101820] p-5 text-left text-white shadow-[0_24px_60px_rgba(16,24,32,0.16)]"
                    >
                        <img
                            src={gallery[4].src}
                            alt={gallery[4].alt}
                            className="h-[340px] w-full rounded-[26px] object-cover"
                        />
                        <div className="mt-5">
                            <p className="text-[11px] uppercase tracking-[0.32em] text-white/45">Visual range</p>
                            <p className="mt-2 text-2xl font-semibold leading-tight">
                                We create scenes that feel designed, not merely generated.
                            </p>
                        </div>
                    </motion.button>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: 0.08 }}
                        className="rounded-[34px] bg-[#ffb347] p-8 text-[#101820] shadow-[0_24px_60px_rgba(255,179,71,0.2)]"
                    >
                        <p className="text-[11px] uppercase tracking-[0.32em] text-[#7d4a00]">Lifewood principle</p>
                        <blockquote className="mt-6 text-2xl font-medium leading-snug md:text-3xl">
                            “The most effective content starts by identifying the one idea the audience should remember — then expressing it with surprise, clarity, and originality.”
                        </blockquote>
                        <p className="mt-8 text-sm leading-7 text-[#50330c]">
                            Our AIGC process is designed around that principle, blending creative direction, editing discipline,
                            and AI tools into communication that feels sharper and more alive.
                        </p>
                    </motion.div>
                </div>
            </section>

            {selectedImage && (
                <ImageModal
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    isOpen={Boolean(selectedImage)}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </motion.div>
    );
};
