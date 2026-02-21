import React from 'react';
import { Linkedin, Facebook, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
    return (
        <div className="w-full bg-white dark:bg-brand-green transition-colors duration-300 ease-in-out">
        <footer id="contact" className="bg-gradient-to-r from-gray-900 via-brand-green to-gray-900 dark:from-black dark:via-brand-green dark:to-black text-white mx-4 md:mx-6 rounded-3xl shadow-2xl mb-6 mt-0 transition-colors duration-300 ease-in-out">
            {/* Main Footer Content */}
            <div className="container mx-auto px-6 py-12 md:py-16">
                <div className="flex flex-col md:flex-row md:justify-between gap-12 md:gap-8 mb-12">
                    {/* Company Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="w-full md:w-auto md:max-w-xs"
                    >
                        <div className="mb-4">
                            <img
                                src="https://framerusercontent.com/images/Ca8ppNsvJIfTsWEuHr50gvkDow.png?scale-down-to=512&width=2624&height=474"
                                alt="Lifewood"
                                className="h-8 w-auto object-contain"
                            />
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            We provide global Data Engineering Services to enable AI Solutions. Transforming raw data into intelligence.
                        </p>
                    </motion.div>

                    {/* Links Grid - Right Side */}
                    <div className="grid grid-cols-3 gap-8 md:gap-12 ml-auto">
                        {/* Company Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <h5 className="font-bold mb-4 text-brand-gold text-sm uppercase tracking-wide">Company</h5>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">About Us</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Careers</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Philanthropy</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Contact</a></li>
                            </ul>
                        </motion.div>

                        {/* Services Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h5 className="font-bold mb-4 text-brand-gold text-sm uppercase tracking-wide">Services</h5>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Audio Data</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Image Annotation</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Video Analytics</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">NLP & Text</a></li>
                            </ul>
                        </motion.div>

                        {/* Legal & Social */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="space-y-6"
                        >
                            <div>
                                <h5 className="font-bold mb-4 text-brand-gold text-sm uppercase tracking-wide">Legal</h5>
                                <ul className="space-y-3">
                                    <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                                    <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Cookie Policy</a></li>
                                    <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Terms & Conditions</a></li>
                                </ul>
                            </div>
                            
                            <div>
                                <h5 className="font-bold mb-3 text-brand-gold text-sm uppercase tracking-wide">Follow Us</h5>
                                <div className="flex gap-3">
                                    <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-gold hover:text-black flex items-center justify-center transition-all">
                                        <Linkedin size={16} />
                                    </a>
                                    <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-gold hover:text-black flex items-center justify-center transition-all">
                                        <Facebook size={16} />
                                    </a>
                                    <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-gold hover:text-black flex items-center justify-center transition-all">
                                        <Instagram size={16} />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 space-y-4 md:space-y-0">
                    <p>&copy; 2026 Lifewood. All Rights Reserved.</p>
                    <p>Designed for Excellence. Powered by Data.</p>
                </div>
            </div>
        </footer>
        </div>
    );
};