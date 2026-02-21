import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, FileText, Image as ImageIcon, Video, Mic } from 'lucide-react';

interface ServiceCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    features: string[];
}

const ServiceCard = ({ title, description, icon, features }: ServiceCardProps) => (
    <motion.div 
        whileHover={{ y: -8 }}
        className="group bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-white/10 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300"
    >
        <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-brand-gold/10 group-hover:bg-brand-gold/20 transition-colors">
                {icon}
            </div>
            <ArrowRight className="opacity-0 group-hover:opacity-100 text-brand-gold transition-opacity" size={20} />
        </div>
        <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">{description}</p>
        <div className="space-y-2">
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
            description: 'We provide end-to-end data acquisition solutions—capturing, processing, and managing large-scale, diverse datasets.'
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

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
            {/* Slideshow */}
            <div className="bg-gradient-to-br from-[#133020] via-[#0a1f15] to-black text-white p-12 rounded-3xl h-full flex flex-col justify-center relative overflow-hidden shadow-2xl">
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
                    className="absolute left-1/2 bottom-6 transform -translate-x-1/2 z-20"
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
                className="p-12 rounded-3xl h-full flex items-center justify-center relative overflow-hidden"
            >
                {/* Video Background */}
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover rounded-3xl"
                >
                    <source src="https://www.pexels.com/download/video/34124504/" type="video/mp4" />
                </video>
                
                {/* Dark Overlay for Contrast */}
                <div className="absolute inset-0 bg-black/30 rounded-3xl" />
                
                <div className="relative w-full max-w-md aspect-square flex items-center justify-center z-10">
                    {/* Central Hub */}
                    <div className="absolute w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center z-10 border-4 border-brand-gold">
                        <img src="https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png?width=1519&height=429" alt="lifewood" className="w-24 h-24 object-contain" />
                    </div>
                    
                    {/* Orbiting Elements - concentric circular wrappers with fixed radii (px) */}
                    {/* Orbiting Elements: two rings with two avatars each, spaced to avoid collisions */}
                    {(() => {
                        const imgs = [
                            'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150',
                            'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=150',
                            'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=150',
                            'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=150'
                        ];

                        // two rings with two avatars each, avatars placed opposite each other
                        const rings = [
                            { radius: 110, angles: [0, 180], items: [0, 1], offset: 0 },
                            { radius: 170, angles: [90, 270], items: [2, 3], offset: 45 }
                        ];

                        return rings.map((ring, ridx) => {
                            const duration = 20 + ridx * 6;
                            const direction = ridx % 2 === 0 ? 1 : -1;
                            const diameter = ring.radius * 2;
                            const offset = ring.offset || 0;

                            return (
                                <motion.div
                                    key={`ring-${ridx}`}
                                    initial={{ rotate: offset }}
                                    animate={{ rotate: offset + direction * 360 }}
                                    transition={{ duration, repeat: Infinity, ease: 'linear' }}
                                    style={{
                                        position: 'absolute',
                                        left: '50%',
                                        top: '50%',
                                        zIndex: 20,
                                        width: `${diameter}px`,
                                        height: `${diameter}px`,
                                        marginLeft: `-${ring.radius}px`,
                                        marginTop: `-${ring.radius}px`,
                                        transformOrigin: '50% 50%'
                                    }}
                                >
                                    {ring.items.map((imgIdx, i) => {
                                        const angle = ring.angles[i] ?? (i * (360 / Math.max(1, ring.items.length)));
                                        return (
                                            <div
                                                key={`avatar-${imgIdx}`}
                                                style={{
                                                    position: 'absolute',
                                                    left: '50%',
                                                    top: '50%',
                                                    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                                                    transformOrigin: '50% 50%'
                                                }}
                                            >
                                                {/* static wrapper handles the radial offset so motion doesn't overwrite it */}
                                                <div style={{ transform: `translateY(-${ring.radius}px)`, position: 'relative' }}>
                                                    <motion.div
                                                        animate={{ rotate: -direction * 360 }}
                                                        transition={{ duration, repeat: Infinity, ease: 'linear' }}
                                                        style={{ zIndex: 30 }}
                                                    >
                                                        <div className="w-12 h-12 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg bg-white">
                                                            <img src={imgs[imgIdx]} className="w-full h-full object-cover" alt={`Team ${imgIdx + 1}`} />
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </motion.div>
                            );
                        });
                    })()}
                    
                    {/* Connecting Circle */}
                    <svg className="absolute w-full h-full pointer-events-none opacity-20" style={{ zIndex: 5 }}>
                        <circle cx="50%" cy="50%" r="45%" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-brand-gold" />
                    </svg>
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
        <div className="bg-white dark:bg-brand-green min-h-screen pt-24 transition-colors duration-300">
            {/* Hero Section */}
            <section className="container mx-auto px-6 py-12 md:py-24">
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
                        Lifewood delivers end-to-end AI data solutions—from multi-language data collection and annotation to model training and generative AI content. Leveraging our global workforce, industrialized methodology, and proprietary LIFT platform.
                    </motion.p>
                    
                    <button className="bg-brand-gold hover:bg-yellow-500 text-black px-8 py-3 rounded-full font-medium flex items-center gap-2 transition-all hover:gap-4">
                        Contact Us <ArrowRight size={18} />
                    </button>
                </motion.div>
            </section>

            {/* Services Grid */}
            <section className="container mx-auto px-6 py-16 md:py-24">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ margin: "-100px" }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                <ServiceCard {...service} />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Video Section */}
            <section className="container mx-auto px-6 py-16 md:py-24">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="relative rounded-3xl overflow-hidden aspect-video bg-gray-900 group cursor-pointer shadow-2xl"
                >
                    <img 
                        src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                        alt="Global Data Collection" 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col items-center justify-center">
                        <motion.div 
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                            className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/40 transition-all"
                        >
                            <Play className="text-white fill-white ml-1" size={32} />
                        </motion.div>
                    </div>
                    <div className="absolute bottom-8 left-8 text-white">
                        <p className="text-xl font-medium">Lifewood enables scalable, always-on data collection</p>
                    </div>
                </motion.div>
            </section>

            {/* Why Choose Us */}
            <section className="container mx-auto px-6 py-16 md:py-24 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 block">Why brands trust us</span>
                    <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                        Comprehensive<br />
                        <span className="font-light italic text-brand-gold dark:text-brand-gold">Data Solutions</span>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 text-lg">
                        We provide scalable, secure, and compliant data solutions that drive AI innovation across industries.
                    </p>
                    
                    <button className="inline-flex items-center gap-2 text-gray-900 dark:text-white font-medium hover:gap-4 transition-all bg-gray-100 dark:bg-white/10 px-6 py-3 rounded-full">
                        Get started <div className="bg-black dark:bg-white text-white dark:text-black p-2 rounded-full"><ArrowRight size={16} /></div>
                    </button>
                </motion.div>
            </section>

            {/* Process Section with Slideshow */}
            <section className="container mx-auto px-6 py-16 md:py-24">
                <ProcessSlideshow />
            </section>
        </div>
    );
};
