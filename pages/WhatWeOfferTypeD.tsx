import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ContactUsButton } from '../components/ContactUsButton';
import './WhatWeOfferTextEffects.css';
import './ElegantTextEffects.css';

const ImageModal: React.FC<{ src: string; alt: string; isOpen: boolean; onClose: () => void }> = ({ src, alt, isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                >
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={onClose}
                        className="absolute top-6 right-6 z-60 bg-white rounded-full p-2 hover:bg-gray-100 transition"
                    >
                        <X size={24} className="text-black" />
                    </motion.button>
                    <motion.img
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        src={src}
                        alt={alt}
                        onClick={(e) => e.stopPropagation()}
                        className="max-w-4xl max-h-[90vh] object-contain rounded-xl"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const WhatWeOfferTypeD: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="offer-textfx elegant-textfx bg-[#f3f3f3] dark:bg-brand-green min-h-screen pt-28 md:pt-36 pb-24 transition-colors duration-300 dark:[&_h1]:text-white dark:[&_h2]:text-white dark:[&_h3]:text-white dark:[&_h4]:text-white dark:[&_p]:text-gray-200 dark:[&_blockquote]:text-gray-100"
        >
            <section className="container mx-auto px-6">
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold text-black">AI Generated Content (AIGC)</h1>
                <p className="mt-5 text-xl leading-relaxed text-gray-700 max-w-5xl">
                    Lifewood's early adoption of AI tools has seen the company rapidly evolve the use of AI generated content.
                    This has been integrated into video production for communication requirements and now includes text, voice,
                    image and video skills that comprise AIGC production.
                </p>
                <div className="mt-7">
                    <ContactUsButton />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45 }}
                    className="mt-8 rounded-[2.2rem] overflow-hidden shadow-xl"
                >
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-[300px] sm:h-[360px] md:h-[520px] object-cover"
                    >
                        <source src="https://framerusercontent.com/assets/OYykWaWrUmfZYDy3CJnT4GUNL8.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </motion.div>
            </section>

            <section className="container mx-auto px-6 mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl sm:text-6xl md:text-7xl font-medium text-black">Our Approach</h2>
                        <p className="mt-5 text-xl text-gray-700 leading-relaxed max-w-2xl">
                            Our motivation is to express the personality of your brand in a compelling and distinctive way.
                            We specialize in story-driven content for companies looking to join the communication revolution.
                        </p>
                    </motion.div>
                    <div className="relative h-[320px] sm:h-[360px] md:h-[460px]">
                        <motion.img
                            initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 6 }}
                            whileHover={{ scale: 1.05, rotate: 8 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
                            onClick={() => setSelectedImage({
                                src: 'https://framerusercontent.com/images/4hASBG5DwObUZ6HSxm1j5gic.jpeg?scale-down-to=1024&width=853&height=1280',
                                alt: 'AIGC stack 1'
                            })}
                            src="https://framerusercontent.com/images/4hASBG5DwObUZ6HSxm1j5gic.jpeg?scale-down-to=1024&width=853&height=1280"
                            alt="AIGC stack 1"
                            className="absolute right-2 sm:right-6 top-3 sm:top-4 w-[62%] sm:w-[56%] rounded-xl shadow-xl rotate-6 cursor-pointer transition-all hover:shadow-2xl"
                        />
                        <motion.img
                            initial={{ opacity: 0, scale: 0.8, rotate: 20 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: -3 }}
                            whileHover={{ scale: 1.05, rotate: -4 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1, type: 'spring', stiffness: 200 }}
                            onClick={() => setSelectedImage({
                                src: 'https://framerusercontent.com/images/KNYITojpSxAW0RVdzBr8gV0gxg.jpg?scale-down-to=512&width=3000&height=3000',
                                alt: 'AIGC stack 2'
                            })}
                            src="https://framerusercontent.com/images/KNYITojpSxAW0RVdzBr8gV0gxg.jpg?scale-down-to=512&width=3000&height=3000"
                            alt="AIGC stack 2"
                            className="absolute right-9 sm:right-16 top-14 sm:top-20 w-[62%] sm:w-[56%] rounded-xl shadow-xl -rotate-3 cursor-pointer transition-all hover:shadow-2xl"
                        />
                        <motion.img
                            initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
                            whileHover={{ scale: 1.05, rotate: -10 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 200 }}
                            onClick={() => setSelectedImage({
                                src: 'https://framerusercontent.com/images/iCuv1hnq9hAalYZSbiXDKScy31M.jpg?scale-down-to=512&width=2560&height=1707',
                                alt: 'AIGC stack 3'
                            })}
                            src="https://framerusercontent.com/images/iCuv1hnq9hAalYZSbiXDKScy31M.jpg?scale-down-to=512&width=2560&height=1707"
                            alt="AIGC stack 3"
                            className="absolute right-16 sm:right-28 top-24 sm:top-32 w-[62%] sm:w-[56%] rounded-xl shadow-xl rotate-[-8deg] cursor-pointer transition-all hover:shadow-2xl"
                        />
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-6 mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-1 text-gray-400"
                    >
                        <p className="text-2xl md:text-3xl leading-snug">
                            We use advanced film, video and editing techniques, combined with generative AI, to create cinematic worlds.
                        </p>
                    </motion.div>
                    <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.08, y: -5 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
                            onClick={() => setSelectedImage({
                                src: 'https://framerusercontent.com/images/8USU1OFCcARiIIvcdJBJlzA8EA4.jpg?scale-down-to=512&width=5184&height=3456',
                                alt: 'AIGC card 1'
                            })}
                        >
                            <img
                                src="https://framerusercontent.com/images/8USU1OFCcARiIIvcdJBJlzA8EA4.jpg?scale-down-to=512&width=5184&height=3456"
                                alt="AIGC card 1"
                                className="w-full h-36 sm:h-44 object-cover rounded-lg opacity-80 hover:opacity-100 cursor-pointer transition-all shadow-lg"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.08, y: -5 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1, type: 'spring', stiffness: 200 }}
                            onClick={() => setSelectedImage({
                                src: 'https://framerusercontent.com/images/3CdZeNunHzqH9P7TcEFjG2Imb4.jpg?scale-down-to=1024&width=4000&height=6000',
                                alt: 'AIGC card 2'
                            })}
                        >
                            <img
                                src="https://framerusercontent.com/images/3CdZeNunHzqH9P7TcEFjG2Imb4.jpg?scale-down-to=1024&width=4000&height=6000"
                                alt="AIGC card 2"
                                className="w-full h-36 sm:h-44 object-cover rounded-lg opacity-80 hover:opacity-100 cursor-pointer transition-all shadow-lg"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.08, y: -5 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 200 }}
                            onClick={() => setSelectedImage({
                                src: 'https://framerusercontent.com/images/pW4xMuxSlAXuophJZT96Q4LO0.jpeg?scale-down-to=512&width=800&height=386',
                                alt: 'AIGC card 3'
                            })}
                        >
                            <img
                                src="https://framerusercontent.com/images/pW4xMuxSlAXuophJZT96Q4LO0.jpeg?scale-down-to=512&width=800&height=386"
                                alt="AIGC card 3"
                                className="w-full h-36 sm:h-44 object-cover rounded-lg opacity-80 hover:opacity-100 cursor-pointer transition-all shadow-lg"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.08, y: -5 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3, type: 'spring', stiffness: 200 }}
                            onClick={() => setSelectedImage({
                                src: 'https://framerusercontent.com/images/ifVOmevTJG4uimv3rRPBuoDvYM.jpg?scale-down-to=1024&width=5245&height=7867',
                                alt: 'AIGC card 4'
                            })}
                        >
                            <img
                                src="https://framerusercontent.com/images/ifVOmevTJG4uimv3rRPBuoDvYM.jpg?scale-down-to=1024&width=5245&height=7867"
                                alt="AIGC card 4"
                                className="w-full h-36 sm:h-44 object-cover rounded-lg opacity-80 hover:opacity-100 cursor-pointer transition-all shadow-lg"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4, type: 'spring', stiffness: 200 }}
                            onClick={() => setSelectedImage({
                                src: 'https://framerusercontent.com/images/UZnPJgTru2Os9pqnz20ckvASCI8.jpg?scale-down-to=1024&width=4160&height=6240',
                                alt: 'AIGC card 5'
                            })}
                        >
                            <img
                                src="https://framerusercontent.com/images/UZnPJgTru2Os9pqnz20ckvASCI8.jpg?scale-down-to=1024&width=4160&height=6240"
                                alt="AIGC card 5"
                                className="w-full h-36 sm:h-44 object-cover rounded-lg opacity-80 hover:opacity-100 cursor-pointer transition-all shadow-lg"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.5, type: 'spring', stiffness: 200 }}
                            className="rounded-lg h-36 sm:h-44 bg-white text-gray-500 p-4 flex flex-col justify-center text-center border border-gray-200 shadow-lg hover:shadow-2xl transition-all"
                        >
                            <div className="offer-textfx-node text-5xl font-bold text-gray-600 leading-none">100+</div>
                            <div className="offer-textfx-node text-lg mt-1">Countries</div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-6 mt-24 text-center">
                <motion.blockquote
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-2xl md:text-3xl text-black max-w-6xl mx-auto leading-snug"
                >
                    We understand that your customers spend hours looking at screens: so finding the one, most important thing,
                    on which to build your message is integral to our approach, as we seek to deliver surprise and originality.
                </motion.blockquote>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-gray-500 text-lg mt-6"
                >
                    - Lifewood -
                </motion.p>
            </section>

            {selectedImage && (
                <ImageModal
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    isOpen={!!selectedImage}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </motion.div>
    );
};
