import React from 'react';
import { Mic, Image as ImageIcon, FileText, Video } from 'lucide-react';
import { motion } from 'framer-motion';

export const Services: React.FC = () => {
    return (
        <section className="py-20 md:py-24 bg-brand-cream dark:bg-brand-green transition-colors duration-300" id="services">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="mb-12">
                    <span className="text-brand-green dark:text-brand-gold font-bold tracking-widest uppercase text-sm mb-2 block">Our Capabilities</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">AI Data Services</h2>
                    <p className="mt-4 text-gray-600 dark:text-green-100/70 max-w-2xl">
                        Lifewood offers AI and IT services that enhance decision-making, reduce costs, and improve productivity to optimize organizational performance.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:min-h-[600px]">
                    
                    {/* Audio - Wide Top Left */}
                    <div className="md:col-span-2 relative group rounded-3xl overflow-hidden min-h-[260px] md:min-h-0 bg-gray-900 cursor-pointer hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(16,79,56,0.3)] hover:ring-1 hover:ring-white/20 transition-all duration-300 ease-out">
                        <img src="https://images.pexels.com/photos/63703/pexels-photo-63703.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700" alt="Audio" />
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/80 to-transparent p-6 md:p-8 flex flex-col justify-between">
                            <div className="bg-white/10 w-fit p-3 rounded-xl backdrop-blur-sm group-hover:bg-brand-green/80 group-hover:scale-110 transition-all duration-300">
                                <Mic className="text-white" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Audio Intelligence</h3>
                                <p className="text-gray-300 text-sm max-w-sm translate-y-0 md:translate-y-4 opacity-100 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300">
                                    Speech collection, transcription, and dialect analysis for next-gen voice assistants.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Text - Tall Right Column */}
                    <div className="md:col-span-1 md:row-span-2 relative group rounded-3xl overflow-hidden min-h-[320px] md:min-h-0 bg-gray-900 cursor-pointer hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(16,79,56,0.3)] hover:ring-1 hover:ring-white/20 transition-all duration-300 ease-out">
                        <img src="https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700" alt="Text" />
                         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 md:p-8 flex flex-col justify-between">
                             <div className="bg-white/10 w-fit p-3 rounded-xl backdrop-blur-sm group-hover:bg-brand-green/80 group-hover:scale-110 transition-all duration-300">
                                <FileText className="text-white" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">NLP & Text</h3>
                                <p className="text-gray-300 text-sm translate-y-0 md:translate-y-4 opacity-100 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300">
                                    Large language model training data, sentiment analysis, and semantic annotation.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Image - Bottom Left */}
                    <div className="relative group rounded-3xl overflow-hidden min-h-[260px] md:min-h-0 bg-gray-900 cursor-pointer hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(16,79,56,0.3)] hover:ring-1 hover:ring-white/20 transition-all duration-300 ease-out">
                        <img src="https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700" alt="Image" />
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/80 to-transparent p-6 md:p-8 flex flex-col justify-between">
                             <div className="bg-white/10 w-fit p-3 rounded-xl backdrop-blur-sm group-hover:bg-brand-green/80 group-hover:scale-110 transition-all duration-300">
                                <ImageIcon className="text-white" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Computer Vision</h3>
                                <p className="text-gray-300 text-sm translate-y-0 md:translate-y-4 opacity-100 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300">
                                    Object detection, image classification, and visual understanding for intelligent automation.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Video - Bottom Middle */}
                    <div className="relative group rounded-3xl overflow-hidden min-h-[260px] md:min-h-0 bg-gray-900 cursor-pointer hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(16,79,56,0.3)] hover:ring-1 hover:ring-white/20 transition-all duration-300 ease-out">
                        <img src="https://images.pexels.com/photos/3036405/pexels-photo-3036405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700" alt="Video" />
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/80 to-transparent p-6 md:p-8 flex flex-col justify-between">
                             <div className="bg-white/10 w-fit p-3 rounded-xl backdrop-blur-sm group-hover:bg-brand-green/80 group-hover:scale-110 transition-all duration-300">
                                <Video className="text-white" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Video Analytics</h3>
                                <p className="text-gray-300 text-sm translate-y-0 md:translate-y-4 opacity-100 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300">
                                    Motion tracking, action recognition, and event detection for comprehensive video understanding.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
                </motion.div>
            </div>
        </section>
    );
};
