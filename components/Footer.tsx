import React from 'react';
import { Linkedin, Facebook, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    const scrollToTopNow = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    };

    const companyLinks = [
        { label: 'About Us', to: '/about-us' },
        { label: 'Careers', to: '/careers' },
        { label: 'Philanthropy', to: '/philanthropy-impact' },
        { label: 'Contact', to: '/contact-us' }
    ];

    const serviceLinks = [
        { label: 'Audio Data', to: '/ai-services' },
        { label: 'Image Annotation', to: '/what-we-offer/type-a' },
        { label: 'Video Analytics', to: '/ai-projects' },
        { label: 'NLP & Text', to: '/what-we-offer/type-b' }
    ];

    const legalLinks = [{ label: 'Terms & Conditions', to: '/terms-and-conditions' }];

    return (
        <div className="relative z-[220] w-full bg-white dark:bg-brand-green transition-colors duration-300 ease-in-out">
        <footer id="contact" className="bg-gradient-to-r from-gray-900 via-brand-green to-gray-900 dark:from-black dark:via-brand-green dark:to-black text-white mx-4 md:mx-6 rounded-3xl shadow-2xl mb-6 mt-0 transition-colors duration-300 ease-in-out">
            {/* Main Footer Content */}
            <div className="container mx-auto px-6 py-7 md:py-8">
                <div className="flex flex-col md:flex-row md:justify-between gap-6 md:gap-4 mb-5 md:mb-6">
                    {/* Company Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="w-full md:w-auto md:max-w-[18rem]"
                    >
                        <div className="mb-3">
                            <Link to="/" aria-label="Go to home">
                                <img
                                    src="https://framerusercontent.com/images/Ca8ppNsvJIfTsWEuHr50gvkDow.png?scale-down-to=512&width=2624&height=474"
                                    alt="Lifewood"
                                    className="h-7 w-auto object-contain"
                                />
                            </Link>
                        </div>
                        <p className="text-gray-300 text-xs md:text-sm leading-[1.45]">
                            We provide global Data Engineering Services to enable AI Solutions. Transforming raw data into intelligence.
                        </p>
                    </motion.div>

                    {/* Links Grid - Right Side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 w-full md:w-auto md:ml-auto items-start content-start">
                        {/* Company Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <h5 className="font-bold mb-3 text-brand-gold text-xs md:text-sm uppercase tracking-wide">Company</h5>
                            <ul className="space-y-2">
                                {companyLinks.map((item) => (
                                    <li key={item.label}>
                                        <Link to={item.to} className="text-gray-300 hover:text-white transition-colors text-xs md:text-sm">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Services Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h5 className="font-bold mb-3 text-brand-gold text-xs md:text-sm uppercase tracking-wide">Services</h5>
                            <ul className="space-y-2">
                                {serviceLinks.map((item) => (
                                    <li key={item.label}>
                                        <Link to={item.to} className="text-gray-300 hover:text-white transition-colors text-xs md:text-sm">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Legal & Social */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="space-y-3"
                        >
                            <div>
                                <h5 className="font-bold mb-3 text-brand-gold text-xs md:text-sm uppercase tracking-wide">Legal</h5>
                                <ul className="space-y-2">
                                    {legalLinks.map((item) => (
                                        <li key={item.label}>
                                            <Link
                                                to={item.to}
                                                onClick={scrollToTopNow}
                                                className="text-gray-300 hover:text-white transition-colors text-xs md:text-sm"
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div>
                                <h5 className="font-bold mb-2 text-brand-gold text-xs md:text-sm uppercase tracking-wide">Follow Us</h5>
                                <div className="flex gap-2.5">
                                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 hover:bg-brand-gold hover:text-black flex items-center justify-center transition-all">
                                        <Linkedin size={15} />
                                    </a>
                                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 hover:bg-brand-gold hover:text-black flex items-center justify-center transition-all">
                                        <Facebook size={15} />
                                    </a>
                                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 hover:bg-brand-gold hover:text-black flex items-center justify-center transition-all">
                                        <Instagram size={15} />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-4 md:pt-5 flex flex-col md:flex-row justify-between items-center text-center md:text-left text-[11px] md:text-xs text-gray-400 space-y-2 md:space-y-0">
                    <p>&copy; 2026 Lifewood. All Rights Reserved.</p>
                    <p>Designed for Excellence. Powered by Data.</p>
                </div>
            </div>
        </footer>
        </div>
    );
};
