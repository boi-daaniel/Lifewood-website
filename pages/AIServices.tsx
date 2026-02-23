import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, FileText, Image as ImageIcon, Video, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContactUsButton } from '../components/ContactUsButton';

interface ServiceCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    features: string[];
}

const ServiceCard = ({ title, description, icon, features }: ServiceCardProps) => (
    <motion.div 
        whileHover={{ y: -8 }}
        className="group h-full min-h-[355px] md:min-h-[375px] bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-white/10 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
    >
        <div className="flex items-start mb-4">
            <div className="p-3 rounded-xl bg-brand-gold/10 group-hover:bg-brand-gold/20 transition-colors">
                {icon}
            </div>
        </div>
        <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed min-h-[3rem] mb-4">{description}</p>
        <div className="space-y-2 mt-auto">
            {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs md:text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-1 h-1 rounded-full bg-brand-gold flex-shrink-0"></div>
                    {feature}
                </div>
            ))}
        </div>
    </motion.div>
);

const ProcessSlideshow: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
    const orbitVideoRef = useRef<HTMLVideoElement | null>(null);
    const [viewportWidth, setViewportWidth] = useState<number>(
        typeof window !== 'undefined' ? window.innerWidth : 1280
    );
    const avatarItems = [
        {
            title: 'Text Services',
            description: 'Collection, labeling, sentiment analysis, and semantic annotation for NLP and LLM workflows.',
            image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1'
        },
        {
            title: 'Audio Services',
            description: 'Voice collection, transcription, dialect analysis, and quality verification at scale.',
            image: 'https://images.pexels.com/photos/6476589/pexels-photo-6476589.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1'
        },
        {
            title: 'Image Services',
            description: 'Object detection, classification, tagging, and visual data quality assurance.',
            image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1'
        },
        {
            title: 'Video Services',
            description: 'Scene labeling, action recognition, subtitle generation, and content auditing.',
            image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1'
        },
        {
            title: 'Lifewood Platform',
            description: 'Unified operations platform connecting global teams for secure, scalable, always-on AI data workflows.',
            image: 'https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png?width=1519&height=429'
        }
    ];

    const slides = [
        {
            title: 'Data Validation',
            description: 'The goal is to create data that is consistent, accurate and complete, preventing data loss or errors in transfer, code or configuration.',
            details: 'We verify that data conforms to predefined standards, rules or constraints, ensuring the information is trustworthy and fit for its intended purpose.'
        },
        {
            title: 'Data Collection',
            description: 'Lifewood delivers multi-modal data collection across text, audio, image, and video, supported by advanced workflows for categorization, labeling, transcription, sentiment analysis, and subtitle generation.'
        },
        {
            title: 'Data Acquisition',
            description: 'We provide end-to-end data acquisition solutionsâ€”capturing, processing, and managing large-scale, diverse datasets.'
        },
        {
            title: 'Data Curation',
            description: 'We sift, select and index data to ensure reliability, accessibility and ease of classification. Data can be curated to support business decisions, academic research, genealogies, scientific research and more.'
        },
        {
            title: 'Data Annotation',
            description: 'In the age of AI, data is the fuel for all analytic and machine learning. With our in-depth library of services, we\'re here to be an integral part of your digital strategy, accelerating your organization\'s cognitive systems development.'
        }
    ];

    useEffect(() => {
        if (isHovering) return undefined;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [isHovering]);

    useEffect(() => {
        const video = orbitVideoRef.current;
        if (!video) return;

        if (selectedAvatar !== null) {
            video.pause();
            return;
        }

        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {
                // Ignore autoplay interruptions from browser policies.
            });
        }
    }, [selectedAvatar]);

    useEffect(() => {
        const onResize = () => setViewportWidth(window.innerWidth);
        onResize();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const isSmallOrbit = viewportWidth < 640;
    const isMediumOrbit = viewportWidth < 1024;
    const hubSize = isSmallOrbit ? 92 : isMediumOrbit ? 112 : 128;
    const avatarSize = isSmallOrbit ? 50 : isMediumOrbit ? 58 : 64;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center"
        >
            {/* Slideshow */}
            <div className="bg-gradient-to-br from-[#133020] via-[#0a1f15] to-black text-white p-6 md:p-8 lg:p-12 rounded-3xl h-full min-h-[360px] md:min-h-[430px] flex flex-col justify-center relative overflow-hidden shadow-2xl">
                <div className="relative z-10">
                    <motion.div 
                        key={currentSlide}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h3 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                            {slides[currentSlide].title}
                        </h3>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            {slides[currentSlide].description}
                        </p>
                        {slides[currentSlide].details && (
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                {slides[currentSlide].details}
                            </p>
                        )}
                    </motion.div>
                    
                    {/* Pagination Dots - moved to bottom center */}
                </div>
                <div
                    className="absolute left-1/2 bottom-4 md:bottom-6 transform -translate-x-1/2 z-20"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <div className="flex items-center gap-2">
                        {slides.map((_, idx) => (
                            <motion.button
                                key={idx}
                                onMouseEnter={() => setCurrentSlide(idx)}
                                onFocus={() => setCurrentSlide(idx)}
                                onClick={() => setCurrentSlide(idx)}
                                className={`h-1 rounded-full transition-all ${
                                    idx === currentSlide ? 'bg-brand-gold w-8' : 'bg-gray-600 w-2'
                                }`}
                                whileHover={{ scale: 1.2 }}
                            />
                        ))}
                    </div>
                    </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            </div>
            
            {/* Orbiting Team */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="p-4 sm:p-8 md:p-10 lg:p-12 rounded-3xl h-full min-h-[360px] md:min-h-[430px] flex items-center justify-center relative overflow-hidden"
            >
                <style>{`
                    @keyframes orbit-spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
                {/* Video Background */}
                <video
                    ref={orbitVideoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover rounded-3xl"
                >
                    <source src="https://www.pexels.com/download/video/29077377/" type="video/mp4" />
                </video>
                
                {/* Dark Overlay for Contrast */}
                <div className="absolute inset-0 bg-black/30 rounded-3xl" />
                
                <div className="relative w-full max-w-[280px] sm:max-w-[420px] lg:max-w-lg aspect-square flex items-center justify-center z-10">
                    {/* Central Hub */}
                    <button
                        type="button"
                        onPointerDown={() => setSelectedAvatar(4)}
                        onClick={() => setSelectedAvatar(4)}
                        className="absolute bg-white rounded-full shadow-2xl flex items-center justify-center z-50 border-4 border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-black"
                        style={{ width: `${hubSize}px`, height: `${hubSize}px` }}
                        aria-label="Open Lifewood Platform details"
                    >
                        <img
                            src="https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png?width=1519&height=429"
                            alt="lifewood"
                            className="object-contain"
                            style={{
                                width: `${Math.round(hubSize * 0.75)}px`,
                                height: `${Math.round(hubSize * 0.75)}px`
                            }}
                        />
                    </button>
                    
                    {/* Orbiting Elements - concentric circular wrappers with fixed radii (px) */}
                    {/* Orbiting Elements: two rings with two avatars each, spaced to avoid collisions */}
                    {(() => {
                        const isOrbitPaused = selectedAvatar !== null;

                        // two rings with two avatars each, avatars placed opposite each other
                        const rings = isSmallOrbit
                            ? [
                                  { radius: 78, angles: [0, 180], items: [0, 1], offset: 0 },
                                  { radius: 124, angles: [90, 270], items: [2, 3], offset: 45 }
                              ]
                            : isMediumOrbit
                              ? [
                                    { radius: 105, angles: [0, 180], items: [0, 1], offset: 0 },
                                    { radius: 166, angles: [90, 270], items: [2, 3], offset: 45 }
                                ]
                              : [
                                    { radius: 130, angles: [0, 180], items: [0, 1], offset: 0 },
                                    { radius: 220, angles: [90, 270], items: [2, 3], offset: 45 }
                                ];

                        return rings.map((ring, ridx) => {
                            const duration = 20 + ridx * 6;
                            const direction = ridx % 2 === 0 ? 1 : -1;
                            const diameter = ring.radius * 2;
                            const offset = ring.offset || 0;

                            return (
                                <div
                                    key={`ring-${ridx}`}
                                    style={{
                                        position: 'absolute',
                                        left: '50%',
                                        top: '50%',
                                        zIndex: 30,
                                        width: `${diameter}px`,
                                        height: `${diameter}px`,
                                        marginLeft: `-${ring.radius}px`,
                                        marginTop: `-${ring.radius}px`,
                                        transformOrigin: '50% 50%',
                                        transform: `rotate(${offset}deg)`,
                                        animationName: 'orbit-spin',
                                        animationDuration: `${duration}s`,
                                        animationTimingFunction: 'linear',
                                        animationIterationCount: 'infinite',
                                        animationDirection: direction === 1 ? 'normal' : 'reverse',
                                        animationPlayState: isOrbitPaused ? 'paused' : 'running',
                                        pointerEvents: 'none'
                                    }}
                                >
                                    {ring.items.map((imgIdx, i) => {
                                        const angle = ring.angles[i] ?? (i * (360 / Math.max(1, ring.items.length)));
                                        return (
                                            <button
                                                key={`avatar-${imgIdx}`}
                                                type="button"
                                                onPointerDown={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedAvatar(imgIdx);
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedAvatar(imgIdx);
                                                }}
                                                aria-label={`Open ${avatarItems[imgIdx].title}`}
                                                style={{
                                                    position: 'absolute',
                                                    left: '50%',
                                                    top: '50%',
                                                    width: `${avatarSize}px`,
                                                    height: `${avatarSize}px`,
                                                    padding: 0,
                                                    border: '4px solid white',
                                                    borderRadius: '9999px',
                                                    background: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${ring.radius}px) rotate(${-angle}deg)`,
                                                    transformOrigin: '50% 50%',
                                                    zIndex: 40,
                                                    cursor: 'pointer',
                                                    touchAction: 'manipulation',
                                                    overflow: 'hidden',
                                                    boxShadow: '0 10px 18px rgba(0,0,0,0.25)',
                                                    pointerEvents: 'auto'
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        zIndex: 30,
                                                        animationName: 'orbit-spin',
                                                        animationDuration: `${duration}s`,
                                                        animationTimingFunction: 'linear',
                                                        animationIterationCount: 'infinite',
                                                        animationDirection: direction === 1 ? 'reverse' : 'normal',
                                                        animationPlayState: isOrbitPaused ? 'paused' : 'running',
                                                        pointerEvents: 'none',
                                                        width: '100%',
                                                        height: '100%'
                                                    }}
                                                >
                                                    <div className="w-full h-full rounded-full overflow-hidden hover:scale-110 transition-transform">
                                                        <img src={avatarItems[imgIdx].image} className="w-full h-full object-cover" alt={avatarItems[imgIdx].title} />
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            );
                        });
                    })()}
                    
                    {/* Connecting Circle */}
                    <svg className="absolute w-full h-full pointer-events-none opacity-20" style={{ zIndex: 5 }}>
                        <circle cx="50%" cy="50%" r="45%" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-brand-gold" />
                    </svg>

                    <AnimatePresence>
                        {selectedAvatar !== null && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-[70] flex items-center justify-center p-6"
                            >
                                <button
                                    type="button"
                                    aria-label="Close service details"
                                    onClick={() => setSelectedAvatar(null)}
                                    className="absolute inset-0 bg-transparent"
                                />
                                <motion.div
                                    initial={{ y: 14, scale: 0.96, opacity: 0 }}
                                    animate={{ y: 0, scale: 1, opacity: 1 }}
                                    exit={{ y: 10, scale: 0.98, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="relative max-w-sm w-full rounded-2xl bg-white/95 text-gray-900 shadow-2xl border border-white/70 p-5"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setSelectedAvatar(null)}
                                        className="absolute top-3 right-3 text-sm px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                                    >
                                        Close
                                    </button>
                                    <div className="flex items-center gap-3 mb-3 pr-14">
                                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-gold bg-white">
                                            <img
                                                src={avatarItems[selectedAvatar].image}
                                                className="w-full h-full object-cover"
                                                alt="Selected service"
                                            />
                                        </div>
                                        <h4 className="text-lg font-bold">{avatarItems[selectedAvatar].title}</h4>
                                    </div>
                                    <p className="text-sm leading-relaxed text-gray-700">{avatarItems[selectedAvatar].description}</p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

export const AIServices: React.FC = () => {
    const services = [
        {
            title: 'Text',
            description: 'Comprehensive text data solutions',
            icon: <FileText className="text-brand-gold" size={24} />,
            features: ['Collection & labeling', 'Transcription', 'Sentiment analysis', 'Semantic annotation']
        },
        {
            title: 'Video',
            description: 'Advanced video processing and analysis',
            icon: <Video className="text-brand-gold" size={24} />,
            features: ['Scene labeling', 'Action recognition', 'Subtitle generation', 'Quality auditing']
        },
        {
            title: 'Image',
            description: 'Intelligent image curation and labeling',
            icon: <ImageIcon className="text-brand-gold" size={24} />,
            features: ['Object detection', 'Classification', 'Tagging & annotation', 'Quality assurance']
        },
        {
            title: 'Audio',
            description: 'Speech and voice technology data',
            icon: <Mic className="text-brand-gold" size={24} />,
            features: ['Voice collection', 'Dialect analysis', 'Audio labeling', 'Quality verification']
        }
    ];

    return (
        <div className="bg-white dark:bg-brand-green min-h-screen pt-20 md:pt-24 transition-colors duration-300 dark:[&_h1]:text-white dark:[&_h2]:text-white dark:[&_h3]:text-white dark:[&_h4]:text-white dark:[&_p]:text-gray-200 dark:[&_blockquote]:text-gray-100">
            {/* Hero Section */}
            <section className="container mx-auto px-6 pt-2 md:pt-4 pb-12 md:pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8 text-gray-900 dark:text-white tracking-tight overflow-hidden">
                        <motion.span
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="inline-block"
                        >
                            AI Data Services
                        </motion.span>
                    </h1>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mb-8 leading-relaxed"
                    >
                        Lifewood delivers end-to-end AI data solutionsâ€”from multi-language data collection and annotation to model training and generative AI content. Leveraging our global workforce, industrialized methodology, and proprietary LIFT platform.
                    </motion.p>
                    
                    <ContactUsButton />
                </motion.div>
            </section>

            {/* Services Grid */}
            <section className="container mx-auto px-6 py-12 md:py-24">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <style>{`
                        @keyframes ai-services-marquee {
                            from { transform: translateX(0); }
                            to { transform: translateX(-50%); }
                        }
                    `}</style>
                    <div className="relative overflow-hidden mb-4 md:mb-6">
                        <div
                            className="flex gap-6 w-max"
                            style={{ animation: 'ai-services-marquee 28s linear infinite' }}
                        >
                            {[...services, ...services].map((service, index) => (
                                <motion.div
                                    key={`${service.title}-${index}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ margin: "-100px" }}
                                    transition={{ duration: 0.4, delay: (index % services.length) * 0.08 }}
                                    className="w-[280px] sm:w-[300px] md:w-[320px] shrink-0"
                                >
                                    <ServiceCard {...service} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Video Section */}
            <section className="container mx-auto px-6 pt-10 md:pt-14 pb-8 md:pb-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="relative mx-auto w-full max-w-4xl rounded-3xl overflow-hidden aspect-video bg-gray-900 shadow-2xl"
                >
                    <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/g_JvAVL0WY4?rel=0"
                        title="Lifewood video"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    />
                </motion.div>
            </section>

            {/* Why Choose Us */}
            <section className="container mx-auto px-6 py-12 md:py-24 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 block">Why brands trust us</span>
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                        Comprehensive<br />
                        <span className="font-light italic text-brand-gold dark:text-brand-gold">Data Solutions</span>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 text-lg">
                        We provide scalable, secure, and compliant data solutions that drive AI innovation across industries.
                    </p>
                    
                    <Link to="/contact-us" className="inline-flex items-center gap-2 text-gray-900 dark:text-white font-medium hover:gap-4 transition-all bg-gray-100 dark:bg-white/10 px-6 py-3 rounded-full">
                        Get started <div className="bg-black dark:bg-white text-white dark:text-black p-2 rounded-full"><ArrowRight size={16} /></div>
                    </Link>
                </motion.div>
            </section>

            {/* Process Section with Slideshow */}
            <section className="container mx-auto px-6 py-12 md:py-24">
                <ProcessSlideshow />
            </section>
        </div>
    );
};


