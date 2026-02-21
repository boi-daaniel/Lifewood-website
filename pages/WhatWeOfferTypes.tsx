import React from 'react';
import { motion } from 'framer-motion';

type OfferTypeConfig = {
    heroTitle: string;
    heroDescription: string;
    highlights: string[];
    sectionTitle: string;
    objectiveLabel: string;
    objectiveText: string;
    detailImage: string;
    detailImageAlt: string;
    midTitle?: string;
    midSubtitle?: string;
};

const TopMarker: React.FC = () => (
    <div className="flex items-center gap-1.5 mb-5 text-black">
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

const HeroArt: React.FC = () => (
    <div className="relative h-[250px] md:h-[320px]">
        <div className="absolute left-[20%] top-[6%] w-28 h-28 rounded-full bg-gradient-to-br from-gray-200 via-[#5b5b60] to-black shadow-2xl rotate-12" />
        <div className="absolute left-[38%] top-[24%] w-56 h-56 rounded-[38%] bg-gradient-to-br from-[#4f4f56] via-black to-[#1f1f23] shadow-2xl -rotate-12" />
        <div className="absolute right-[4%] top-[4%] w-28 h-28 rounded-[36%] bg-gradient-to-br from-gray-200 via-[#46464e] to-black shadow-2xl rotate-12" />
    </div>
);

const OfferTypePage: React.FC<OfferTypeConfig> = ({
    heroTitle,
    heroDescription,
    highlights,
    sectionTitle,
    objectiveLabel,
    objectiveText,
    detailImage,
    detailImageAlt,
    midTitle,
    midSubtitle
}) => (
    <div className="bg-[#f3f3f3] min-h-screen pt-28 md:pt-36 pb-20">
        <section className="container mx-auto px-6">
            <TopMarker />
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="bg-[#e7e1cf] rounded-[2rem] p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
            >
                <div>
                    <h1 className="text-5xl md:text-7xl leading-[0.98] font-semibold text-black">{heroTitle}</h1>
                    <p className="mt-5 text-xl leading-relaxed text-gray-800 max-w-2xl">{heroDescription}</p>
                    <div className="mt-7">
                        <ContactButton />
                    </div>
                </div>
                <div className="relative">
                    <HeroArt />
                    <div className="absolute right-0 bottom-0 rounded-full bg-white px-3 py-2 shadow border border-gray-200 text-sm">
                        How can I help?
                    </div>
                </div>
            </motion.div>

            <div className="mt-5 text-[40px] leading-tight text-gray-800">
                {highlights.map((line) => (
                    <p key={line}>{line}</p>
                ))}
            </div>
        </section>

        {(midTitle || midSubtitle) && (
            <section className="container mx-auto px-6 mt-16">
                <div className="text-center">
                    {midTitle && <h2 className="text-6xl md:text-7xl font-medium text-gray-900">{midTitle}</h2>}
                    {midSubtitle && <p className="text-6xl md:text-7xl text-gray-400 leading-tight">{midSubtitle}</p>}
                </div>
            </section>
        )}

        <section className="container mx-auto px-6 mt-20">
            <h3 className="text-6xl md:text-7xl font-semibold text-black/70 tracking-wide">{sectionTitle}</h3>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10 items-end">
                <div>
                    <h4 className="text-5xl md:text-6xl font-semibold text-gray-900">{objectiveLabel}</h4>
                    <p className="mt-5 text-[34px] leading-relaxed text-gray-600">{objectiveText}</p>
                </div>

                <div className="lg:col-span-2 relative">
                    <img
                        src={detailImage}
                        alt={detailImageAlt}
                        className="w-full h-[360px] md:h-[560px] object-cover rounded-[2.2rem] shadow-lg"
                    />
                    <div className="absolute right-5 bottom-5 bg-white rounded-3xl px-5 py-3 shadow-md border border-gray-200">
                        <div className="text-5xl font-medium text-gray-800">01</div>
                        <div className="text-2xl text-gray-700">{objectiveLabel}</div>
                    </div>
                    <div className="hidden xl:flex absolute -right-28 top-1/2 -translate-y-1/2 flex-col gap-12 text-gray-400">
                        <div style={{ writingMode: 'vertical-rl' }} className="text-6xl font-medium tracking-wide">{`02 SOLUTIONS`}</div>
                        <div style={{ writingMode: 'vertical-rl' }} className="text-6xl font-medium tracking-wide">{`03 RESULTS`}</div>
                    </div>
                </div>
            </div>
        </section>
    </div>
);

export const WhatWeOfferTypeA: React.FC = () => (
    <OfferTypePage
        heroTitle="Type A - Data Servicing"
        heroDescription="End-to-end data services specializing in multi-language datasets, including document capture, data collection and preparation, extraction, cleaning, labeling, annotation, quality assurance, and formatting."
        highlights={[
            'Multi-language genealogy documents, newspapers, and archives to facilitate global ancestry research',
            'QQ Music of over millions non-Chinese songs and lyrics'
        ]}
        sectionTitle="TYPE A - DATA SERVICING"
        objectiveLabel="Objective"
        objectiveText="Scan document for preservation, extract data and structure into database."
        detailImage="https://framerusercontent.com/images/5W3fKf5FwyglyFVBHEXLuqopg.png?scale-down-to=1024&width=1536&height=1024"
        detailImageAlt="Document servicing"
    />
);

export const WhatWeOfferTypeB: React.FC = () => (
    <OfferTypePage
        heroTitle="Type B - Horizontal LLM Data"
        heroDescription="Comprehensive AI data solutions that cover the entire spectrum from data collection and annotation to model testing. Creating multimodal datasets for deep learning, large language models."
        highlights={[
            'Voice, image and text for Apple Intelligence',
            'Provided over 50 language sets'
        ]}
        sectionTitle="TYPE B: AI DATA PROJECT (AUDIO)"
        objectiveLabel="Target"
        objectiveText="Capture and transcribe recordings from native speakers across global markets. Voice content involves multiple project types and diverse data domains."
        detailImage="https://framerusercontent.com/images/iCuv1hnq9hAalYZSbiXDKScy31M.jpg?scale-down-to=512&width=2560&height=1707"
        detailImageAlt="Audio data project"
    />
);

export const WhatWeOfferTypeC: React.FC = () => (
    <OfferTypePage
        heroTitle="Type C - Vertical LLM Data"
        heroDescription="AI data solutions across specific industry verticals including autonomous driving data annotation, in-vehicle data collection and specialized data services for industry, enterprise or private LLM."
        highlights={[
            'Autonomous driving and Smart cockpit datasets for Driver Monitoring System',
            'China Merchants Group: Enterprise-grade dataset for building "ShipGPT"'
        ]}
        midTitle="2D, 3D & 4D Data for Autonomous Driving"
        midSubtitle="The leading AI company in autonomous vehicle development"
        sectionTitle="TYPE C - VERTICAL LLM DATA"
        objectiveLabel="Target"
        objectiveText="Annotate vehicles, pedestrians, and road objects with 2D & 3D techniques to support accurate object detection for autonomous driving."
        detailImage="https://framerusercontent.com/images/VDjJLyomenB1LFHPI6jBfB068.png?scale-down-to=1024&width=2268&height=3402"
        detailImageAlt="Autonomous driving cockpit"
    />
);

