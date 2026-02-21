import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

type TabType = 'mission' | 'vision';

export const AboutUs: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('mission');
    const headingWords = useMemo(() => ['About', 'our', 'company'], []);
    const coreValues = useMemo(
        () => [
            { char: 'D', title: 'DIVERSITY', color: '#133020', text: 'We celebrate differences in belief, philosophy and ways of life.' },
            { char: 'C', title: 'CARING', color: '#046241', text: 'We care for every person deeply and equally, because without care work becomes meaningless.' },
            { char: 'I', title: 'INNOVATION', color: '#FBB347', text: 'Innovation is at the heart of all we do, enriching our lives and challenging us to improve.' },
            { char: 'I', title: 'INTEGRITY', color: '#FFC370', text: 'We are dedicated to ethical standards in everything we do.' }
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
    const [carouselIndex, setCarouselIndex] = useState<number>(Math.floor(galleryImages.length / 2));

    const getRelativeIndex = (idx: number) => {
        const total = galleryImages.length;
        let diff = idx - carouselIndex;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;
        return diff;
    };

    const shiftCarousel = (delta: number) => {
        setCarouselIndex((prev) => (prev + delta + galleryImages.length) % galleryImages.length);
    };

    return (
        <div className="bg-[#f3f3f3] min-h-screen pt-28 md:pt-36 pb-20 scroll-smooth">
            <style>{`
                .about-gallery-album-shell {
                    position: relative;
                    width: 100%;
                    max-width: 1060px;
                    margin: 0 auto;
                    height: 300px;
                    overflow: visible;
                    perspective: 1400px;
                }
                @media (min-width: 768px) {
                    .about-gallery-album-shell {
                        height: 460px;
                    }
                }
                .about-gallery-album {
                    position: absolute;
                    inset: 0;
                    display: grid;
                    place-items: center;
                    transform-style: preserve-3d;
                }
                .about-gallery-album-card {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    width: clamp(170px, 24vw, 340px);
                    aspect-ratio: 4 / 3;
                    border-radius: 14px;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.32);
                    box-shadow: 0 12px 18px rgba(8, 22, 38, 0.26);
                    transform-style: preserve-3d;
                    transition: transform 680ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 420ms ease, opacity 360ms ease, filter 420ms ease;
                    will-change: transform, opacity;
                }
                .about-gallery-album-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 520ms cubic-bezier(0.2, 0.8, 0.2, 1), filter 420ms ease;
                }
                .about-gallery-album-card-btn {
                    all: unset;
                    display: block;
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                }
                .about-gallery-album-card.is-center .about-gallery-album-img {
                    transform: scale(1.03);
                }
                .about-gallery-album-card.is-side .about-gallery-album-img {
                    filter: saturate(0.92) brightness(0.9);
                }
            `}</style>
            <section className="container mx-auto px-6" id="about-top">
                <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-4xl md:text-6xl font-semibold text-gray-900 mb-6 overflow-hidden">
                        {headingWords.map((word, idx) => (
                            <motion.span
                                key={word}
                                initial={{ opacity: 0, y: 32 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ duration: 0.45, delay: idx * 0.08 }}
                                className="inline-block mr-3"
                            >
                                {word}
                            </motion.span>
                        ))}
                    </h1>
                    <p className="max-w-4xl text-sm md:text-base text-gray-700 leading-relaxed mb-8">
                        While we are motivated by business and economic objectives, we remain committed to our core business beliefs
                        that shape our corporate and individual behaviour around the world.
                    </p>
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f2b142] text-xs font-medium text-[#0b3f2f]">
                        Contact us <span className="w-4 h-4 rounded-full bg-[#0b3f2f] text-white grid place-items-center text-[10px]">+</span>
                    </span>
                </motion.div>
            </section>

            <section className="container mx-auto px-6 mt-10" id="about-values">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    <div className="lg:self-center group cursor-default">
                        <h2 className="text-5xl font-light text-gray-900 mb-6 transition-transform duration-300 group-hover:-translate-y-0.5">
                            <span className="inline-block transition-colors duration-300 group-hover:text-[#133020]">CORE</span>{' '}
                            <span className="inline-block bg-[#f2b142] px-2 transition-all duration-300 group-hover:bg-[#ffc370] group-hover:shadow-[0_10px_20px_-14px_rgba(19,48,32,0.6)] group-hover:scale-[1.03]">VALUE</span>
                        </h2>
                        <p className="text-gray-800 leading-relaxed transition-all duration-300 group-hover:text-[#1f2a34] group-hover:translate-x-1">
                            At Lifewood we empower our company and our clients to realise the transformative power of AI.
                            Bringing big data to life, launching new ways of thinking, innovating, learning, and doing.
                        </p>
                    </div>

                    <div className="lg:col-span-2 rounded-3xl p-1 md:p-2">
                        <div className="space-y-3">
                            {coreValues.map((item, idx) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 14 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    whileHover={{ y: -4, scale: 1.01 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                                    className="group grid grid-cols-1 md:grid-cols-[170px_minmax(0,1fr)] rounded-2xl overflow-hidden border border-[#d7ddd9] bg-[#fbfcfb] transition-all duration-300 hover:border-[#9eb5ac] hover:shadow-[0_16px_30px_-22px_rgba(4,98,65,0.45)]"
                                >
                                    <div
                                        className="h-24 md:h-full md:min-h-[110px] text-white text-5xl font-light grid place-items-center transition-transform duration-300 group-hover:scale-[1.03]"
                                        style={{ backgroundColor: item.color }}
                                    >
                                        {item.char}
                                    </div>
                                    <div className="p-4 md:p-5">
                                        <p className="text-xs tracking-[0.18em] font-bold text-[#0d3a2a] mb-2 transition-colors duration-300 group-hover:text-[#046241]">{item.title}</p>
                                        <p className="text-sm text-gray-800 leading-relaxed transition-colors duration-300 group-hover:text-[#1f2a34]">{item.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-6 mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
                    <motion.div
                        initial={{ opacity: 0, x: -28 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.55 }}
                        className="lg:col-span-3 rounded-[28px] overflow-hidden h-[360px] md:h-[460px]"
                    >
                        <img
                            src="https://framerusercontent.com/images/pqtsyQSdo9BC1b4HN1mpIHnwAA.png?scale-down-to=2048&width=2780&height=1552"
                            alt="Team leadership"
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 28 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.55, delay: 0.05 }}
                        className="rounded-[28px] overflow-hidden bg-white flex flex-col"
                    >
                        <img
                            src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600"
                            alt="Team collaboration"
                            className="h-[72%] w-full object-cover"
                        />
                        <div className="p-6">
                            <motion.p
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.45, delay: 0.2 }}
                                className="text-4xl text-[#7a6e00]"
                            >
                                Lets collaborate
                            </motion.p>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="container mx-auto px-6 mt-24" id="about-drive">
                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl md:text-5xl text-center text-gray-900 mb-10"
                >
                    What drives us today, and what inspires us for tomorrow
                </motion.h2>

                <div className="bg-white rounded-[28px] overflow-hidden">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('mission')}
                            className={`flex-1 py-4 text-lg font-medium ${activeTab === 'mission' ? 'bg-[#0d3a2a] text-white' : 'bg-white text-gray-700'}`}
                        >
                            Mission
                        </button>
                        <button
                            onClick={() => setActiveTab('vision')}
                            className={`flex-1 py-4 text-lg font-medium ${activeTab === 'vision' ? 'bg-[#0d3a2a] text-white' : 'bg-white text-gray-700'}`}
                        >
                            Vision
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <motion.img
                            key={activeTab}
                            initial={{ opacity: 0.45, scale: 1.04 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.35 }}
                            src={activeTab === 'mission'
                                ? 'https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=1200'
                                : 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200'}
                            alt={activeTab === 'mission' ? 'Mission' : 'Vision'}
                            className="w-full h-[330px] object-cover"
                        />
                        <div className="p-8 md:p-10 bg-[#eee7d5]">
                            <motion.h3
                                key={`${activeTab}-title`}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-4xl text-[#0d3a2a] mb-4"
                            >
                                {activeTab === 'mission' ? 'Our Mission' : 'Our Vision'}
                            </motion.h3>
                            <p className="text-gray-800 leading-relaxed">
                                {activeTab === 'mission'
                                    ? 'To develop and deploy cutting edge AI technologies that solve real-world problems, empower communities, and advance sustainable practices.'
                                    : 'To be the most trusted global partner for responsible AI data and innovation, creating measurable impact for business and society.'}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-6 mt-24" id="about-gallery">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45 }}
                    className="about-gallery-album-shell"
                >
                    <div className="about-gallery-album">
                        {galleryImages.map((item, idx) => {
                            const diff = getRelativeIndex(idx);
                            const abs = Math.abs(diff);
                            const isCenter = diff === 0;
                            const isVisible = abs <= 3;
                            const offset = diff * -142;
                            const rotate = diff * 30;
                            const z = 230 - abs * 64;
                            const scale = 1 - abs * 0.08;
                            const transform = `translate(-50%, -50%) translateX(${offset}px) rotateY(${rotate}deg) translateZ(${z}px) scale(${Math.max(0.72, scale)})`;
                            return (
                                <div
                                    key={item.src}
                                    className={`about-gallery-album-card${isCenter ? ' is-center' : ' is-side'}`}
                                    style={
                                        {
                                            transform,
                                            opacity: isVisible ? 1 - Math.max(0, abs - 1) * 0.25 : 0,
                                            pointerEvents: isVisible ? 'auto' : 'none',
                                            zIndex: 300 - abs * 20
                                        } as React.CSSProperties
                                    }
                                >
                                    <button
                                        type="button"
                                        className="about-gallery-album-card-btn"
                                        onClick={() => {
                                            if (!isCenter) {
                                                setCarouselIndex(idx);
                                                return;
                                            }
                                            shiftCarousel(1);
                                        }}
                                        aria-label={!isCenter ? `Show ${item.alt}` : `Next image`}
                                    >
                                        <img className="about-gallery-album-img" src={item.src} alt={item.alt} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                <div className="text-center mt-10">
                    <img
                        src="https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png?width=1519&height=429"
                        alt="Lifewood"
                        className="h-16 w-auto mx-auto"
                    />
                    <p className="text-sm text-gray-600 mt-2">Be Amazed</p>
                </div>
            </section>
        </div>
    );
};
