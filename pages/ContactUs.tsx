import React from 'react';

export const ContactUs: React.FC = () => {
    return (
        <div className="bg-[#f3f3f3] dark:bg-brand-green min-h-screen pt-20 md:pt-24 pb-24 transition-colors duration-300 dark:[&_h1]:text-white dark:[&_h2]:text-white dark:[&_h3]:text-white dark:[&_h4]:text-white dark:[&_p]:text-gray-200 dark:[&_blockquote]:text-gray-100">
            <section className="container mx-auto px-6 mt-8">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#e8ece8] text-[#7f8c8f] text-sm font-medium">
                    Contact us
                </span>

                <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-7 md:gap-10 items-stretch">
                    <div>
                        <div className="rounded-[1.4rem] overflow-hidden min-h-[260px] h-[360px] md:h-[520px] bg-white shadow-[0_18px_46px_rgba(15,23,42,0.14)] ring-1 ring-black/5">
                            <iframe
                                src="https://www.youtube.com/embed/Cdn9Q_Qo40E?rel=0"
                                title="Lifewood video"
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            />
                        </div>
                    </div>

                    <div className="rounded-[1.4rem] p-4 md:p-5 bg-[#0a1f17] shadow-[0_18px_46px_rgba(5,24,18,0.42)] overflow-hidden relative min-h-[360px] md:min-h-[520px]">
                        <div
                            className="absolute inset-0 opacity-70"
                            style={{
                                background:
                                    'radial-gradient(circle at 25% 20%, rgba(139,191,122,0.32), transparent 38%), radial-gradient(circle at 75% 80%, rgba(95,156,108,0.3), transparent 40%), linear-gradient(120deg, rgba(24,55,42,0.9), rgba(13,33,27,0.96))'
                            }}
                        />

                        <form className="relative z-10 rounded-[1rem] border border-white/10 bg-white/10 backdrop-blur-sm p-4 md:p-5 h-full min-h-[330px] flex flex-col">
                            <div className="space-y-4 flex-1 min-h-0">
                                <div className="space-y-1.5">
                                    <label htmlFor="contact-name" className="text-white/90 font-medium">Name</label>
                                    <input
                                        id="contact-name"
                                        type="text"
                                        className="w-full h-11 rounded-lg bg-black/20 text-white placeholder:text-white/45 px-4 outline-none border border-white/5 focus:border-white/20"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="contact-email" className="text-white/90 font-medium">Email</label>
                                    <input
                                        id="contact-email"
                                        type="email"
                                        className="w-full h-11 rounded-lg bg-black/20 text-white placeholder:text-white/45 px-4 outline-none border border-white/5 focus:border-white/20"
                                    />
                                </div>

                                <div className="space-y-1.5 flex-1 min-h-[120px]">
                                    <label htmlFor="contact-message" className="text-white/90 font-medium">Message</label>
                                    <textarea
                                        id="contact-message"
                                        placeholder="Message here..."
                                        className="w-full h-full min-h-[100px] rounded-lg bg-black/20 text-white placeholder:text-white/45 px-4 py-3 outline-none border border-white/5 focus:border-white/20 resize-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                className="w-full h-11 rounded-full bg-[#0a2f22] hover:bg-[#0d3b2b] text-white font-semibold transition-colors mt-4"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};
