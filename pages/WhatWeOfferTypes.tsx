import React from 'react';
import { motion } from 'framer-motion';
import ScrollStack, { ScrollStackItem } from '../components/ScrollStack';
import FlyingPosters from '../components/FlyingPosters';
import { MagicBentoCard } from '../components/MagicBento';
import PianoText from '../components/PianoText';
import Antigravity from '../components/Antigravity';
import { ContactUsButton } from '../components/ContactUsButton';
import './WhatWeOfferTextEffects.css';

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
    showcaseMode?: 'stack' | 'flying';
    showcaseLayout?: 'stack' | 'bento-grid';
    magicBentoImages?: boolean;
    magicBentoWholePage?: boolean;
    showcaseItems?: {
        label: string;
        description: string;
        image: string;
        imageAlt: string;
    }[];
};

const TopMarker: React.FC = () => null;

const dragLimits = { left: -46, right: 46, top: -34, bottom: 34 };

const HeroArt: React.FC = () => {
    return (
    <div className="relative h-[250px] md:h-[320px]">
        <motion.img
            src="https://framerusercontent.com/images/LFAxsa4CpX7e4qBI72ijOV2sHg.png?scale-down-to=512&width=1600&height=1600"
            alt="Metallic shape one"
            drag
            dragConstraints={dragLimits}
            dragElastic={0.12}
            dragMomentum={false}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            whileTap={{ scale: 0.96 }}
            className="absolute z-20 left-[19%] top-[6%] w-28 md:w-36 h-auto object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.35)] cursor-grab active:cursor-grabbing select-none touch-none"
        />
        <motion.img
            src="https://framerusercontent.com/images/Es0UNVEZFUO6pTmc3NI38eovew.png?scale-down-to=512&width=1600&height=1600"
            alt="Metallic shape two"
            drag
            dragConstraints={dragLimits}
            dragElastic={0.12}
            dragMomentum={false}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            whileTap={{ scale: 0.96 }}
            className="absolute z-10 left-[35%] top-[22%] w-56 md:w-72 h-auto object-contain drop-shadow-[0_24px_34px_rgba(0,0,0,0.4)] cursor-grab active:cursor-grabbing select-none touch-none"
        />
        <motion.img
            src="https://framerusercontent.com/images/Tq3lgO9Qy66CFuDaYW99KQ5xoLM.png?scale-down-to=512&width=2040&height=2040"
            alt="Metallic shape three"
            drag
            dragConstraints={dragLimits}
            dragElastic={0.12}
            dragMomentum={false}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            whileTap={{ scale: 0.96 }}
            className="absolute z-30 right-[2%] top-[4%] w-28 md:w-40 h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.38)] cursor-grab active:cursor-grabbing select-none touch-none"
        />
    </div>
    );
};

const HeroArtShell: React.FC = () => {
    return (
        <div className="relative h-[250px] md:h-[320px]">
            <HeroArt />
        </div>
    );
};

const HeroBackgroundEffect: React.FC = () => (
    <div
        className="absolute inset-0 rounded-[2rem] overflow-hidden opacity-45 z-0"
        style={{ maskImage: 'linear-gradient(180deg, #000 0%, #000 68%, transparent 100%)' }}
    >
        <Antigravity
            count={300}
            magnetRadius={6}
            ringRadius={7}
            waveSpeed={0.4}
            waveAmplitude={1}
            particleSize={1.5}
            lerpSpeed={0.05}
            color="#046241"
            autoAnimate
            particleVariance={1}
            rotationSpeed={0}
            depthFactor={1}
            pulseSpeed={3}
            particleShape="capsule"
            fieldStrength={10}
        />
    </div>
);

type ShowcaseItem = NonNullable<OfferTypeConfig['showcaseItems']>[number];

const ScrollStackShowcase: React.FC<{ items: ShowcaseItem[]; magicBentoImages?: boolean }> = ({ items, magicBentoImages = false }) => (
    <section className="mt-8">
        <ScrollStack
            className="offer-stack"
            useWindowScroll
            itemDistance={36}
            itemStackDistance={24}
            stackPosition="18%"
            scaleEndPosition="8%"
            baseScale={0.88}
            itemScale={0.04}
        >
            {items.map((item, idx) => (
                <ScrollStackItem key={`${item.label}-${idx}`} itemClassName="!h-auto !p-0 !rounded-none !shadow-none !bg-transparent">
                    <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6 lg:gap-8 items-center bg-[#f3f3f3] dark:bg-brand-green transition-colors duration-150 ease-linear">
                        <div className="lg:self-center">
                            <h4 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-150 ease-linear">{item.label}</h4>
                            <p className="text-[13px] md:text-[14px] leading-[1.5] text-[#41566b] dark:text-gray-200 max-w-[250px] transition-colors duration-150 ease-linear">{item.description}</p>
                        </div>

                        <div className="relative lg:pr-8">
                            {magicBentoImages ? (
                                <MagicBentoCard
                                    className="magic-bento-image-card shadow-lg"
                                    enableBorderGlow={true}
                                    enableTilt={true}
                                    enableMagnetism={false}
                                    clickEffect={true}
                                    spotlightRadius={520}
                                    particleCount={18}
                                    glowColor="255, 179, 71"
                                    disableAnimations={false}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.imageAlt}
                                        className="w-full h-[240px] sm:h-[300px] md:h-[460px] object-cover transition-transform duration-500 ease-out hover:scale-[1.04]"
                                    />
                                </MagicBentoCard>
                            ) : (
                                <div className="overflow-hidden rounded-[2.2rem] shadow-lg">
                                    <img
                                        src={item.image}
                                        alt={item.imageAlt}
                                        className="w-full h-[240px] sm:h-[300px] md:h-[460px] object-cover transition-transform duration-500 ease-out hover:scale-[1.04]"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </ScrollStackItem>
            ))}
        </ScrollStack>
    </section>
);

const BentoGridShowcase: React.FC<{ items: ShowcaseItem[] }> = ({ items }) => {
    const topItems = items.slice(0, 2);
    const bottomItem = items[2];

    const renderCard = (item: ShowcaseItem, extraClassName = '') => (
        <MagicBentoCard
            key={item.label}
            className={`magic-bento-image-card min-h-[300px] ${extraClassName}`.trim()}
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={false}
            clickEffect={true}
            spotlightRadius={520}
            particleCount={18}
            glowColor="255, 179, 71"
            disableAnimations={false}
        >
            <img
                src={item.image}
                alt={item.imageAlt}
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 bg-gradient-to-t from-black/80 via-black/35 to-transparent text-white z-10">
                <h4 className="text-3xl md:text-4xl font-semibold">{item.label}</h4>
                <p
                    className="mt-2 text-sm md:text-base text-white/90 max-w-3xl"
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                >
                    {item.description}
                </p>
            </div>
        </MagicBentoCard>
    );

    return (
        <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                {topItems.map((item) => renderCard(item))}
                {bottomItem ? renderCard(bottomItem, 'md:col-span-2 min-h-[340px] md:min-h-[360px]') : null}
            </div>
        </div>
    );
};

const FlyingPostersShowcase: React.FC<{ items: ShowcaseItem[] }> = ({ items }) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const activeItem = items[activeIndex] ?? items[0];

    return (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6 lg:gap-10 items-center">
            <div className="flex flex-col justify-center">
                <h4 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-gray-900 dark:text-white">{activeItem.label}</h4>
                <p className="mt-5 text-[15px] md:text-[17px] leading-[1.7] text-gray-700 dark:text-gray-200 max-w-[290px]">{activeItem.description}</p>
            </div>

            <div className="relative h-[420px] sm:h-[520px] md:h-[600px]">
                <div className="h-full w-full relative overflow-hidden rounded-[2.2rem] shadow-[0_22px_48px_rgba(15,23,42,0.22)]">
                    <FlyingPosters
                        className="h-full w-full"
                        items={items.map((item) => item.image)}
                        planeWidth={320}
                        planeHeight={320}
                        distortion={3}
                        scrollEase={0.01}
                        cameraFov={45}
                        cameraZ={20}
                        onActiveIndexChange={setActiveIndex}
                    />
                </div>
            </div>
        </div>
    );
};

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
    midSubtitle,
    showcaseMode = 'stack',
    showcaseLayout = 'stack',
    magicBentoImages = false,
    magicBentoWholePage = false,
    showcaseItems
}) => {
    const hasShowcase = Boolean(showcaseItems && showcaseItems.length > 1);
    const useBentoPanels = magicBentoWholePage;

    return (
    <div className="offer-textfx relative bg-[#f3f3f3] dark:bg-brand-green min-h-screen pt-20 md:pt-20 pb-20 transition-colors duration-300">
        <section className="container mx-auto px-6">
            <TopMarker />
            {useBentoPanels ? (
                <MagicBentoCard
                    variant="panel"
                    className="rounded-[2rem]"
                    enableBorderGlow={true}
                    enableTilt={false}
                    enableMagnetism={false}
                    clickEffect={true}
                    spotlightRadius={420}
                    particleCount={14}
                    glowColor="255, 179, 71"
                    disableAnimations={false}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45 }}
                        className="relative overflow-hidden bg-[#e7e1cf] rounded-[2rem] p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
                    >
                        <HeroBackgroundEffect />
                        <div className="relative z-10">
                            <h1 className="text-4xl sm:text-5xl md:text-7xl leading-[0.98] font-semibold text-black">
                                <PianoText text={heroTitle} />
                            </h1>
                            <p className="mt-5 text-xl leading-relaxed text-gray-800 max-w-2xl">
                                {heroDescription}
                            </p>
                            <div className="mt-7">
                                <ContactUsButton />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <HeroArtShell />
                        </div>
                    </motion.div>
                </MagicBentoCard>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45 }}
                    className="relative overflow-hidden bg-[#e7e1cf] rounded-[2rem] p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
                >
                    <HeroBackgroundEffect />
                    <div className="relative z-10">
                        <h1 className="text-4xl sm:text-5xl md:text-7xl leading-[0.98] font-semibold text-black">
                            <PianoText text={heroTitle} />
                        </h1>
                        <p className="mt-5 text-xl leading-relaxed text-gray-800 max-w-2xl">
                            {heroDescription}
                        </p>
                        <div className="mt-7">
                            <ContactUsButton />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <HeroArtShell />
                    </div>
                </motion.div>
            )}

            {useBentoPanels ? (
                <MagicBentoCard
                    variant="panel"
                    className="rounded-2xl mt-6"
                    enableBorderGlow={true}
                    enableTilt={false}
                    enableMagnetism={false}
                    clickEffect={true}
                    spotlightRadius={420}
                    particleCount={10}
                    glowColor="255, 179, 71"
                    disableAnimations={false}
                >
                    <div className="p-5 md:p-6 text-xl leading-relaxed text-gray-800 dark:text-gray-200 max-w-4xl">
                        {highlights.map((line) => (
                            <p key={line} className="mb-1 last:mb-0">{line}</p>
                        ))}
                    </div>
                </MagicBentoCard>
            ) : (
                <div className="mt-6 text-xl leading-relaxed text-gray-800 dark:text-gray-200 max-w-4xl">
                    {highlights.map((line) => (
                        <p key={line} className="mb-1 last:mb-0">{line}</p>
                    ))}
                </div>
            )}
        </section>

        {(midTitle || midSubtitle) && (
            <section className="container mx-auto px-6 mt-16">
                <div className="text-center">
                    {midTitle && (
                        <h2 className="text-4xl sm:text-5xl md:text-7xl font-medium text-gray-900 dark:text-white">
                            <PianoText text={midTitle} />
                        </h2>
                    )}
                    {midSubtitle && (
                        <p className="text-4xl sm:text-5xl md:text-7xl text-gray-400 dark:text-gray-300 leading-tight">
                            <PianoText text={midSubtitle} />
                        </p>
                    )}
                </div>
            </section>
        )}

        <section className="container mx-auto px-6 mt-20">
            {useBentoPanels ? (
                <MagicBentoCard
                    variant="panel"
                    className="rounded-2xl"
                    enableBorderGlow={true}
                    enableTilt={false}
                    enableMagnetism={false}
                    clickEffect={true}
                    spotlightRadius={480}
                    particleCount={16}
                    glowColor="255, 179, 71"
                    disableAnimations={false}
                >
                    <div className="p-4 md:p-6">
                        <h3 className="text-2xl md:text-3xl font-semibold text-black/70 dark:text-white/90 tracking-wide">{sectionTitle}</h3>

                        {hasShowcase && showcaseItems && showcaseLayout === 'bento-grid' ? (
                            <BentoGridShowcase items={showcaseItems} />
                        ) : hasShowcase && showcaseItems && showcaseMode === 'flying' ? (
                            <FlyingPostersShowcase items={showcaseItems} />
                        ) : hasShowcase && showcaseItems ? (
                            <ScrollStackShowcase items={showcaseItems} magicBentoImages={magicBentoImages} />
                        ) : (
                            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10 items-end">
                                <div>
                                    <h4 className="text-5xl md:text-6xl font-semibold text-gray-900 dark:text-white">{objectiveLabel}</h4>
                                    <p className="mt-5 text-2xl sm:text-[30px] md:text-[34px] leading-relaxed text-gray-600 dark:text-gray-200">{objectiveText}</p>
                                </div>

                                <div className="lg:col-span-2 relative">
                                    <img
                                        src={detailImage}
                                        alt={detailImageAlt}
                                        className="w-full h-[280px] sm:h-[360px] md:h-[560px] object-cover rounded-[2.2rem] shadow-lg"
                                    />
                                    <div className="absolute right-5 bottom-5 bg-white rounded-3xl px-5 py-3 shadow-md border border-gray-200">
                                        <div className="offer-textfx-node text-5xl font-medium text-gray-800">01</div>
                                        <div className="offer-textfx-node text-2xl text-gray-700">{objectiveLabel}</div>
                                    </div>
                                    <div className="hidden xl:flex absolute -right-28 top-1/2 -translate-y-1/2 flex-col gap-12 text-gray-400 dark:text-gray-300">
                                        <div style={{ writingMode: 'vertical-rl' }} className="offer-textfx-node text-6xl font-medium tracking-wide">{`02 SOLUTIONS`}</div>
                                        <div style={{ writingMode: 'vertical-rl' }} className="offer-textfx-node text-6xl font-medium tracking-wide">{`03 RESULTS`}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </MagicBentoCard>
            ) : (
                <>
                    <h3 className="text-2xl md:text-3xl font-semibold text-black/70 dark:text-white/90 tracking-wide">{sectionTitle}</h3>

                    {hasShowcase && showcaseItems && showcaseLayout === 'bento-grid' ? (
                        <BentoGridShowcase items={showcaseItems} />
                    ) : hasShowcase && showcaseItems && showcaseMode === 'flying' ? (
                        <FlyingPostersShowcase items={showcaseItems} />
                    ) : hasShowcase && showcaseItems ? (
                        <ScrollStackShowcase items={showcaseItems} magicBentoImages={magicBentoImages} />
                    ) : (
                        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10 items-end">
                            <div>
                                <h4 className="text-5xl md:text-6xl font-semibold text-gray-900 dark:text-white">{objectiveLabel}</h4>
                                <p className="mt-5 text-2xl sm:text-[30px] md:text-[34px] leading-relaxed text-gray-600 dark:text-gray-200">{objectiveText}</p>
                            </div>

                            <div className="lg:col-span-2 relative">
                                <img
                                    src={detailImage}
                                    alt={detailImageAlt}
                                    className="w-full h-[280px] sm:h-[360px] md:h-[560px] object-cover rounded-[2.2rem] shadow-lg"
                                />
                                <div className="absolute right-5 bottom-5 bg-white rounded-3xl px-5 py-3 shadow-md border border-gray-200">
                                    <div className="offer-textfx-node text-5xl font-medium text-gray-800">01</div>
                                    <div className="offer-textfx-node text-2xl text-gray-700">{objectiveLabel}</div>
                                </div>
                                <div className="hidden xl:flex absolute -right-28 top-1/2 -translate-y-1/2 flex-col gap-12 text-gray-400 dark:text-gray-300">
                                    <div style={{ writingMode: 'vertical-rl' }} className="offer-textfx-node text-6xl font-medium tracking-wide">{`02 SOLUTIONS`}</div>
                                    <div style={{ writingMode: 'vertical-rl' }} className="offer-textfx-node text-6xl font-medium tracking-wide">{`03 RESULTS`}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </section>

    </div>
    );
};

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
        showcaseItems={[
            {
                label: 'Objective',
                description: 'Scan document for preservation, extract data and structure into database.',
                image: 'https://framerusercontent.com/images/1edPwLJhGXCUhlh38ixQSMOTFA.png?width=1024&height=1024',
                imageAlt: 'Document scanning objective'
            },
            {
                label: 'Key Features',
                description: 'Features include Auto Crop, Auto De-skew, Blur Detection, Foreign Object Detection, and AI Data Extraction.',
                image: 'https://framerusercontent.com/images/m7OC7BU1eSVf04CkU0jmNPRkf8.png?width=1024&height=1024',
                imageAlt: 'Data servicing key features'
            },
            {
                label: 'Results',
                description: 'Accurate and precise data is ensured through validation and quality assurance. The system is efficient and scalable, enabling fast and adaptable data extraction. It supports multiple languages and formats, allowing the handling of diverse documents. Advanced features include auto-crop, de-skew, blur, and object detection. With AI integration, the solution provides structured data for AI tools and delivers clear, visual, and easy-to-understand results.',
                image: 'https://framerusercontent.com/images/iI5MBUQ9ctQdcDHjCLNvD4j4kxc.png?width=1024&height=1024',
                imageAlt: 'Data servicing results'
            }
        ]}
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
        showcaseItems={[
            {
                label: 'Target',
                description: 'Capture and transcribe recordings from native speakers from 23 different countries (Netherlands, Spain, Norway, France, Germany, Poland, Russia, Italy, Japan, South Korea, Mexico, UAE, Saudi Arabia, Egypt, etc.). Voice content involves 6 project types and 9 data domains. A total of 25,400 valid hours durations.',
                image: 'https://framerusercontent.com/images/2GAiSbiawE1R7sXuFDwNLfEovRM.jpg?width=711&height=400',
                imageAlt: 'Type B target poster'
            },
            {
                label: 'Solutions',
                description: '30,000+ native speaking human resources from more than 30 countries were mobilized. Use our flexible industrial processes and continuously optimize them. Use PBI to track progress of daily collection and transcription in real time, analyze, and improve results in real time.',
                image: 'https://framerusercontent.com/images/AtSZKyVin3X5lENphObnH6Puw.jpg?lossless=1&width=612&height=408',
                imageAlt: 'Type B solutions poster'
            },
            {
                label: 'Results',
                description: '5 months to complete the voice collection and annotation of 25,400 valid hours on time and with quality.',
                image: 'https://framerusercontent.com/images/prEubFztlVx6VnuokfOrkAs.jpg?width=612&height=353',
                imageAlt: 'Type B results poster'
            }
        ]}
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
        showcaseItems={[
            {
                label: 'Target',
                description: 'Annotate vehicles, pedestrians, and road objects with 2D & 3D techniques to enable accurate object detection for autonomous driving. Self-driving cars rely on precise visual training to detect, classify, and respond safely in real-world conditions.',
                image: 'https://framerusercontent.com/images/GhKqWw4urSIcFZGZ3kWTXG7c.png?scale-down-to=1024&width=1536&height=1024',
                imageAlt: 'Autonomous driving target'
            },
            {
                label: 'Solutions',
                description: 'Dedicated Process Engineering team for analysis and optimization AI-enhanced workflow with multi-level quality checks. Scalable global delivery through crowdsourced workforce management.',
                image: 'https://framerusercontent.com/images/9KyWAYBvYkUbASCckXa16Fgc.jpg?scale-down-to=1024&width=4032&height=3024',
                imageAlt: 'Process engineering solutions'
            },
            {
                label: 'Results',
                description: 'Achieved 25% production in Month 1 with 95% accuracy (Target: 90%) and 50% production in Month 2 with 99% accuracy (Target: 95%). Maintained an overall accuracy of 99% with on‑time delivery. Successfully expanded operations to Malaysia with 100 annotators and Indonesia with 150 annotators.',
                image: 'https://framerusercontent.com/images/mqqWNbBnY0EOUvSMgGlDain8M.jpg?width=1004&height=591',
                imageAlt: 'Project results'
            }
        ]}
    />
);
