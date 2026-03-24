import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { supabase } from '../lib/supabaseClient';
import DarkVeil from '../components/DarkVeil';

export const ContactUs: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus(null);

        if (!name.trim() || !email.trim() || !message.trim()) {
            setStatus({ type: 'error', message: 'Please fill out all fields before sending.' });
            return;
        }

        if (!supabase) {
            setStatus({ type: 'error', message: 'Supabase is not configured yet.' });
            return;
        }

        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
        const adminEmail = import.meta.env.VITE_EMAILJS_ADMIN_EMAIL as string | undefined;

        if (!serviceId || !publicKey || !templateId || !adminEmail) {
            setStatus({ type: 'error', message: 'EmailJS is not configured yet.' });
            return;
        }

        setIsSubmitting(true);
        try {
            const { error: insertError } = await supabase.from('contact_messages').insert({
                name,
                email,
                message,
                record_status: 'Active'
            });

            if (insertError) {
                throw insertError;
            }

            await emailjs.send(
                serviceId,
                templateId,
                {
                    to_email: adminEmail,
                    to_name: 'Admin',
                    subject: `New contact message from ${name}`,
                    message,
                    from_name: name,
                    from_email: email,
                    email_type: 'contact_admin'
                },
                publicKey
            );

            await emailjs.send(
                serviceId,
                templateId,
                {
                    to_email: email,
                    to_name: name,
                    subject: 'Thanks for contacting Lifewood',
                    message: 'Thanks for contacting us. We will get back to you as soon as possible.',
                    from_name: 'Lifewood',
                    email_type: 'contact_user'
                },
                publicKey
            );

            setStatus({ type: 'success', message: 'Thanks for contacting us. We will get back to you as soon as possible.' });
            setName('');
            setEmail('');
            setMessage('');
        } catch (error) {
            setStatus({
                type: 'error',
                message: error instanceof Error ? error.message : 'Something went wrong. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

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

                    <div className="rounded-[1.4rem] p-4 md:p-5 bg-black shadow-[0_18px_46px_rgba(5,24,18,0.42)] overflow-hidden relative min-h-[360px] md:min-h-[520px]">
                        <div className="pointer-events-none absolute inset-0">
                            <DarkVeil
                                hueShift={30}
                                noiseIntensity={0.05}
                                scanlineIntensity={0.04}
                                speed={0.45}
                                scanlineFrequency={1.3}
                                warpAmount={0.16}
                            />
                            <div className="absolute inset-0 bg-black/55" />
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="relative z-10 rounded-[1rem] border border-white/10 bg-white/10 backdrop-blur-sm p-4 md:p-5 h-full min-h-[330px] flex flex-col"
                        >
                            <div className="space-y-4 flex-1 min-h-0">
                                <div className="space-y-1.5">
                                    <label htmlFor="contact-name" className="text-white/90 font-medium">Name</label>
                                    <input
                                        id="contact-name"
                                        type="text"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        required
                                        className="w-full h-11 rounded-lg bg-black/20 text-white placeholder:text-white/45 px-4 outline-none border border-white/5 focus:border-white/20"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="contact-email" className="text-white/90 font-medium">Email</label>
                                    <input
                                        id="contact-email"
                                        type="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        required
                                        className="w-full h-11 rounded-lg bg-black/20 text-white placeholder:text-white/45 px-4 outline-none border border-white/5 focus:border-white/20"
                                    />
                                </div>

                                <div className="space-y-1.5 flex-1 min-h-[120px]">
                                    <label htmlFor="contact-message" className="text-white/90 font-medium">Message</label>
                                    <textarea
                                        id="contact-message"
                                        placeholder="Message here..."
                                        value={message}
                                        onChange={(event) => setMessage(event.target.value)}
                                        required
                                        className="w-full h-full min-h-[100px] rounded-lg bg-black/20 text-white placeholder:text-white/45 px-4 py-3 outline-none border border-white/5 focus:border-white/20 resize-none"
                                    />
                                </div>
                            </div>

                            {status && (
                                <div
                                    className={`mt-3 rounded-lg border px-3 py-2 text-xs ${
                                        status.type === 'success'
                                            ? 'border-emerald-300/40 bg-emerald-200/10 text-emerald-100'
                                            : 'border-red-300/40 bg-red-200/10 text-red-100'
                                    }`}
                                >
                                    {status.message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-11 rounded-full bg-[#0a2f22] hover:bg-[#0d3b2b] text-white font-semibold transition-colors mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};
