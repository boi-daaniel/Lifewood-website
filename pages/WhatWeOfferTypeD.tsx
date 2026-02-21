import React from 'react';
import { motion } from 'framer-motion';

const TopMarker: React.FC = () => (
    <div className="flex items-center gap-1.5 mb-6 text-black">
        <span className="w-4 h-4 rounded-full bg-black inline-block" />
        <span className="w-4 h-4 rounded-full border border-black inline-block" />
        <span className="text-gray-500 tracking-[0.3em] text-sm ml-1">-----------</span>
    </div>
);

const ContactButton: React.FC = () => (
    <button className="inline-flex items-center gap-3 rounded-xl bg-[#f2b142] text-black font-semibold px-5 py-2.5 shadow-sm hover:brightness-95 transition">
        Contact Us
        <span className="w-9 h-9 rounded-lg bg-[#0f6b49] text-white grid place-items-center">+</span>
    </button>
);

export const WhatWeOfferTypeD: React.FC = () => {
    return (
        <div className="bg-[#f3f3f3] min-h-screen pt-28 md:pt-36 pb-24">
            <section className="container mx-auto px-6">
                <TopMarker />
                <h1 className="text-6xl md:text-7xl font-semibold text-black">AI Generated Content (AIGC)</h1>
                <p className="mt-5 text-xl leading-relaxed text-gray-700 max-w-5xl">
                    Lifewood's early adoption of AI tools has seen the company rapidly evolve the use of AI generated content.
                    This has been integrated into video production for communication requirements and now includes text, voice,
                    image and video skills that comprise AIGC production.
                </p>
                <div className="mt-7">
                    <ContactButton />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45 }}
                    className="mt-8 rounded-[2.2rem] overflow-hidden"
                >
                    <img
                        src="https://framerusercontent.com/images/pqtsyQSdo9BC1b4HN1mpIHnwAA.png?scale-down-to=2048&width=2780&height=1552"
                        alt="AIGC hero"
                        className="w-full h-[360px] md:h-[520px] object-cover"
                    />
                </motion.div>
            </section>

            <section className="container mx-auto px-6 mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-6xl md:text-7xl font-medium text-black">Our Approach</h2>
                        <p className="mt-5 text-xl text-gray-700 leading-relaxed max-w-2xl">
                            Our motivation is to express the personality of your brand in a compelling and distinctive way.
                            We specialize in story-driven content for companies looking to join the communication revolution.
                        </p>
                    </div>
                    <div className="relative h-[360px] md:h-[460px]">
                        <img
                            src="https://framerusercontent.com/images/4hASBG5DwObUZ6HSxm1j5gic.jpeg?scale-down-to=1024&width=853&height=1280"
                            alt="AIGC stack 1"
                            className="absolute right-6 top-4 w-[56%] rounded-xl shadow-xl rotate-6"
                        />
                        <img
                            src="https://framerusercontent.com/images/KNYITojpSxAW0RVdzBr8gV0gxg.jpg?scale-down-to=512&width=3000&height=3000"
                            alt="AIGC stack 2"
                            className="absolute right-16 top-20 w-[56%] rounded-xl shadow-xl -rotate-3"
                        />
                        <img
                            src="https://framerusercontent.com/images/iCuv1hnq9hAalYZSbiXDKScy31M.jpg?scale-down-to=512&width=2560&height=1707"
                            alt="AIGC stack 3"
                            className="absolute right-28 top-32 w-[56%] rounded-xl shadow-xl rotate-[-8deg]"
                        />
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-6 mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="lg:col-span-1 text-gray-400">
                        <p className="text-5xl md:text-6xl leading-tight">
                            We use advanced film, video and editing techniques, combined with generative AI, to create cinematic worlds.
                        </p>
                    </div>
                    <div className="lg:col-span-2 grid grid-cols-3 gap-4">
                        <img src="https://framerusercontent.com/images/VDjJLyomenB1LFHPI6jBfB068.png?scale-down-to=1024&width=2268&height=3402" alt="timeline" className="w-full h-44 object-cover rounded-lg opacity-80" />
                        <img src="https://framerusercontent.com/images/5W3fKf5FwyglyFVBHEXLuqopg.png?scale-down-to=1024&width=1536&height=1024" alt="storyboard" className="w-full h-44 object-cover rounded-lg opacity-80" />
                        <img src="https://framerusercontent.com/images/iCuv1hnq9hAalYZSbiXDKScy31M.jpg?scale-down-to=512&width=2560&height=1707" alt="editing" className="w-full h-44 object-cover rounded-lg opacity-80" />
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-6 mt-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <img
                        src="https://framerusercontent.com/images/KNYITojpSxAW0RVdzBr8gV0gxg.jpg?scale-down-to=512&width=3000&height=3000"
                        alt="People"
                        className="md:col-span-2 rounded-xl h-64 object-cover w-full"
                    />
                    <div className="rounded-xl h-64 bg-[#474747] text-white p-6 flex flex-col justify-between">
                        <div className="text-sm">Multiple</div>
                        <div className="text-4xl font-semibold">Languages</div>
                    </div>
                    <div className="rounded-xl h-64 bg-white text-gray-500 p-6 flex flex-col justify-center text-center border border-gray-200">
                        <div className="text-7xl font-bold text-gray-600">100+</div>
                        <div className="text-xl mt-1">Countries</div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-6 mt-24 text-center">
                <blockquote className="text-5xl md:text-6xl text-black max-w-6xl mx-auto leading-tight">
                    We understand that your customers spend hours looking at screens: so finding the one, most important thing,
                    on which to build your message is integral to our approach, as we seek to deliver surprise and originality.
                </blockquote>
                <p className="text-gray-500 text-lg mt-6">- Lifewood -</p>
            </section>
        </div>
    );
};

