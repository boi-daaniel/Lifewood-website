import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import './Careers.css';
import './ElegantTextEffects.css';

const marqueeRows = [
    ['Innovative', 'Flexible', 'Supportive', 'Collaborative', 'Diverse', 'Purpose-driven', 'Transparent'],
    ['Trustworthy', 'Professional', 'Reliable', 'Balanced (work-life balance)', 'Engaging', 'Growth-oriented'],
    ['Creative', 'Respectful', 'Adaptive', 'Empowering', 'Accountable', 'Team-first', 'Inclusive']
];

export const Careers: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="elegant-textfx bg-[#f3f3f3] dark:bg-brand-green min-h-screen pt-20 md:pt-24 pb-24 transition-colors duration-300 dark:[&_h1]:text-white dark:[&_h2]:text-white dark:[&_h3]:text-white dark:[&_h4]:text-white dark:[&_p]:text-gray-200 dark:[&_blockquote]:text-gray-100"
        >
            <section className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-[#e7e1cf] rounded-[2rem] p-8 md:p-12">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-semibold text-black leading-[0.96]">
                            Build Your Future
                            <br />
                            With Lifewood
                        </h1>
                        <p className="mt-6 text-lg md:text-xl text-gray-700 leading-relaxed max-w-xl">
                            Join a global team delivering impactful AI data solutions. Grow your career while helping shape
                            the next generation of intelligent systems.
                        </p>
                        <a
                            href="https://application-form-ph.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-[#f2b142] text-black font-semibold px-5 py-2.5 shadow-sm hover:brightness-95 transition"
                        >
                            Join Us
                            <span className="w-9 h-9 rounded-lg bg-[#0f6b49] text-white grid place-items-center">
                                <ArrowRight size={18} />
                            </span>
                        </a>
                    </div>

                    <div className="overflow-hidden rounded-[1.5rem] shadow-[0_18px_40px_rgba(15,23,42,0.16)]">
                        <img
                            src="https://framerusercontent.com/images/DF2gzPqqVW8QGp7Jxwp1y5257xk.jpg?scale-down-to=2048&width=6000&height=4000"
                            alt="Lifewood team"
                            className="w-full h-[320px] md:h-[460px] object-cover"
                        />
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-6 mt-14">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-6xl font-semibold text-[#0d3349] leading-[1.05]">
                        It means motivating
                        <br />
                        and growing teams
                    </h2>
                    <p className="mt-5 text-base md:text-xl text-[#0d3349] leading-relaxed max-w-3xl mx-auto">
                        Teams that can initiate and learn on the run in order to deliver evolving technologies and targets.
                        It&apos;s a big challenge, but innovation, especially across borders, has never been the easy path.
                    </p>

                    <div className="mt-8 space-y-3 overflow-hidden careers-marquee-mask">
                        {marqueeRows.map((row, idx) => (
                            <div key={`row-${idx}`} className="careers-marquee">
                                <div className={`careers-marquee-track ${idx % 2 === 1 ? 'careers-marquee-track-reverse' : ''}`}>
                                    {[...row, ...row].map((item, itemIdx) => (
                                        <span key={`${item}-${itemIdx}`} className="careers-chip">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="mt-14 text-lg md:text-2xl leading-relaxed text-black/85">
                        If you&apos;re looking to turn the page on a new chapter in your career make contact with us today. At
                        Lifewood, the adventure is always before you, it&apos;s why we&apos;ve been described as{' '}
                        <span className="text-[#2e6a5e]">&quot;always on, never off.&quot;</span>
                    </p>
                </div>
            </section>
        </motion.div>
    );
};
