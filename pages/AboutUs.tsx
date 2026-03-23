import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ThreeDImageCarousel } from '../components/ThreeDImageCarousel';

export const AboutUs: React.FC = () => {
    const values = useMemo(
        () => [
            {
                short: 'D',
                title: 'Diversity',
                tone: 'bg-[#133020] text-white',
                accent: 'bg-[#d9f7d8] text-[#133020]',
                text: 'We welcome different beliefs, backgrounds, and ways of thinking because diverse perspectives lead to better outcomes.'
            },
            {
                short: 'C',
                title: 'Caring',
                tone: 'bg-[#046241] text-white',
                accent: 'bg-[#d6f6ea] text-[#046241]',
                text: 'We believe meaningful work only happens when people are treated with empathy, respect, and genuine support.'
            },
            {
                short: 'I',
                title: 'Innovation',
                tone: 'bg-[#ffb347] text-[#1c1c1c]',
                accent: 'bg-[#fff0d7] text-[#8a4a00]',
                text: 'We stay curious, challenge old patterns, and build practical solutions that keep people and businesses moving forward.'
            },
            {
                short: 'I',
                title: 'Integrity',
                tone: 'bg-[#ffd28c] text-[#1c1c1c]',
                accent: 'bg-[#fff4e2] text-[#8a4a00]',
                text: 'We act responsibly, communicate honestly, and hold ourselves to high standards in every decision we make.'
            }
        ],
        []
    );

    const highlights = useMemo(
        () => [
            { value: 'Global', label: 'AI data operations' },
            { value: 'Human', label: 'decision-making at scale' },
            { value: 'Trusted', label: 'delivery for client teams' }
        ],
        []
    );

    const galleryImages = useMemo(
        () => [
            { src: 'https://framerusercontent.com/images/4hASBG5DwObUZ6HSxm1j5gic.jpeg?scale-down-to=1024&width=853&height=1280', alt: 'Gallery image 1' },
            { src: 'https://framerusercontent.com/images/iCuv1hnq9hAalYZSbiXDKScy31M.jpg?scale-down-to=512&width=2560&height=1707', alt: 'Gallery image 2' },
            { src: 'https://framerusercontent.com/images/VDjJLyomenB1LFHPI6jBfB068.png?scale-down-to=1024&width=2268&height=3402', alt: 'Gallery image 3' },
            { src: 'https://framerusercontent.com/images/KNYITojpSxAW0RVdzBr8gV0gxg.jpg?scale-down-to=512&width=3000&height=3000', alt: 'Gallery image 4' },
            { src: 'https://framerusercontent.com/images/5W3fKf5FwyglyFVBHEXLuqopg.png?scale-down-to=1024&width=1536&height=1024', alt: 'Gallery image 5' }
        ],
        []
    );

    return (
        <div className="min-h-screen bg-[#f5f2ea] pb-20 pt-28 text-[#101820] md:pt-36">
            <section className="container mx-auto px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-8 xl:grid-cols-[1.15fr_0.95fr]">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55 }}
                            className="relative overflow-hidden rounded-[34px] border border-[#d9d3c4] bg-white px-6 py-8 shadow-[0_25px_60px_rgba(16,24,32,0.08)] sm:px-8 sm:py-10"
                        >
                            <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-[#ffb347]/20 blur-3xl" />
                            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-[#046241]/10 blur-3xl" />
                            <div className="relative z-10">
                                <span className="inline-flex rounded-full border border-[#133020]/15 bg-[#f5f2ea] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#133020]">
                                    About Lifewood
                                </span>
                                <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[0.92] tracking-[-0.04em] text-[#101820] md:text-7xl">
                                    Built for people,
                                    <span className="block text-[#046241]">driven by responsible AI.</span>
                                </h1>
                                <p className="mt-6 max-w-2xl text-base leading-8 text-[#3b4650] md:text-lg">
                                    Lifewood blends AI data work, human judgment, and operational discipline to help clients scale meaningful outcomes.
                                    We build with care, move with curiosity, and stay grounded in work that creates long-term value.
                                </p>

                                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <Link
                                        to="/careers?view=message"
                                        className="inline-flex items-center justify-center rounded-full bg-[#133020] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#046241]"
                                    >
                                        Contact Us
                                    </Link>
                                    <Link
                                        to="/careers"
                                        className="inline-flex items-center justify-center rounded-full border border-[#101820]/10 bg-white px-6 py-3 text-sm font-semibold text-[#101820] transition hover:border-[#133020]/30 hover:text-[#133020]"
                                    >
                                        Explore Careers
                                    </Link>
                                </div>

                                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                                    {highlights.map((item) => (
                                        <div
                                            key={item.label}
                                            className="rounded-[24px] border border-[#101820]/8 bg-[#f8f7f2] px-4 py-5"
                                        >
                                            <p className="text-lg font-semibold text-[#101820]">{item.value}</p>
                                            <p className="mt-1 text-sm leading-6 text-[#55606b]">{item.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 28 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.08 }}
                            className="grid gap-6"
                        >
                            <div className="relative overflow-hidden rounded-[34px] bg-[#133020] p-5 text-white shadow-[0_28px_60px_rgba(10,47,34,0.22)]">
                                <img
                                    src="https://framerusercontent.com/images/pqtsyQSdo9BC1b4HN1mpIHnwAA.png?scale-down-to=2048&width=2780&height=1552"
                                    alt="Lifewood leadership"
                                    className="h-[320px] w-full rounded-[26px] object-cover sm:h-[380px]"
                                />
                                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                    <div>
                                        <p className="text-[11px] uppercase tracking-[0.32em] text-white/55">How we work</p>
                                        <p className="mt-2 max-w-sm text-xl font-medium leading-snug">
                                            Human-centered systems, operational depth, and practical AI delivery.
                                        </p>
                                    </div>
                                    <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white/80">
                                        Global teams, grounded execution
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-[0.85fr_1.15fr]">
                                <div className="rounded-[30px] bg-[#ffb347] p-6 text-[#101820] shadow-[0_20px_50px_rgba(255,179,71,0.24)]">
                                    <p className="text-[11px] uppercase tracking-[0.32em] text-[#7d4a00]">Our Focus</p>
                                    <p className="mt-4 text-3xl font-semibold leading-tight">
                                        AI that strengthens work, not distance from it.
                                    </p>
                                </div>
                                <div className="rounded-[30px] border border-[#d9d3c4] bg-[#efe8d7] p-6">
                                    <p className="text-[11px] uppercase tracking-[0.32em] text-[#6b665d]">What makes us different</p>
                                    <p className="mt-4 text-base leading-8 text-[#2a3137]">
                                        Our teams combine technology, operations, and human review so projects stay rigorous, scalable, and accountable from start to finish.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto mt-16 px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
                        <div className="rounded-[34px] bg-[#101820] p-8 text-white shadow-[0_26px_60px_rgba(16,24,32,0.16)]">
                            <p className="text-[11px] uppercase tracking-[0.32em] text-white/45">Core Values</p>
                            <h2 className="mt-5 text-4xl font-semibold leading-tight md:text-5xl">
                                The standards behind every project, partnership, and decision.
                            </h2>
                            <p className="mt-6 text-sm leading-7 text-white/72">
                                These values shape how we collaborate internally, how we work with clients, and how we think about long-term impact.
                            </p>
                            <div className="mt-10 rounded-[28px] border border-white/10 bg-white/5 p-5">
                                <p className="text-[11px] uppercase tracking-[0.32em] text-white/45">Our principle</p>
                                <p className="mt-3 text-lg leading-8 text-white/85">
                                    Technology is most powerful when it is matched by accountability, empathy, and the courage to improve.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            {values.map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 0.45, delay: index * 0.08 }}
                                    className={`group rounded-[30px] p-[1px] shadow-[0_20px_50px_rgba(16,24,32,0.08)] ${
                                        index % 2 === 0 ? 'sm:translate-y-6' : ''
                                    }`}
                                >
                                    <div className="h-full rounded-[29px] bg-white p-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-semibold ${item.tone}`}>
                                                {item.short}
                                            </div>
                                            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${item.accent}`}>
                                                {item.title}
                                            </span>
                                        </div>
                                        <p className="mt-8 text-lg font-medium leading-8 text-[#1f2b33]">
                                            {item.text}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto mt-20 px-6">
                <div className="mx-auto max-w-7xl rounded-[38px] border border-[#d9d3c4] bg-white p-6 shadow-[0_25px_60px_rgba(16,24,32,0.08)] md:p-8">
                    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                        <div className="overflow-hidden rounded-[30px]">
                            <img
                                src="https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=1400"
                                alt="Team discussion"
                                className="h-full min-h-[320px] w-full object-cover"
                            />
                        </div>

                        <div className="grid gap-5">
                            <div className="rounded-[28px] bg-[#efe8d7] p-6">
                                <p className="text-[11px] uppercase tracking-[0.32em] text-[#6b665d]">Mission</p>
                                <h3 className="mt-4 text-3xl font-semibold text-[#133020]">Build useful AI systems for real work.</h3>
                                <p className="mt-4 text-sm leading-7 text-[#303941]">
                                    We design and deliver AI-enabled workflows that solve practical business needs while staying grounded in quality, responsibility, and human oversight.
                                </p>
                            </div>

                            <div className="rounded-[28px] bg-[#133020] p-6 text-white">
                                <p className="text-[11px] uppercase tracking-[0.32em] text-white/50">Vision</p>
                                <h3 className="mt-4 text-3xl font-semibold">Be the trusted global partner for responsible AI execution.</h3>
                                <p className="mt-4 text-sm leading-7 text-white/72">
                                    We aim to shape a future where AI is deployed with rigor, empathy, and measurable value for both organizations and communities.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto mt-20 px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.32em] text-[#6b665d]">Inside Lifewood</p>
                            <h2 className="mt-3 text-4xl font-semibold leading-tight text-[#101820] md:text-5xl">
                                People, places, and the energy behind the work.
                            </h2>
                        </div>
                        <p className="max-w-xl text-sm leading-7 text-[#4d5963]">
                            Beyond delivery and operations, we care about building an environment where collaboration feels active, ambitious, and deeply human.
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45 }}
                    >
                        <ThreeDImageCarousel
                            images={galleryImages}
                            autoRotateMs={7000}
                            centerOverlayClassName="text-center"
                            centerOverlay={
                                <>
                                    <div className="mx-auto h-14 w-[210px] md:w-[250px]">
                                        <img
                                            src="https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png?width=1519&height=429"
                                            alt="Lifewood"
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                    <p className="mt-1 text-sm text-gray-600">Life at Lifewood</p>
                                </>
                            }
                        />
                    </motion.div>
                </div>
            </section>
        </div>
    );
};
