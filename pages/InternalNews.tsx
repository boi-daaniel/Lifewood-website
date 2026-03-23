import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { BellRing, Mail, Newspaper } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export const InternalNews: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus(null);

        if (!email.trim()) {
            setStatus({ type: 'error', message: 'Please enter your email address.' });
            return;
        }

        if (!supabase) {
            setStatus({ type: 'error', message: 'Supabase is not configured yet.' });
            return;
        }

        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
        const subscriberEmail = email.trim().toLowerCase();

        setIsSubmitting(true);

        try {
            const { error } = await supabase.from('newsletter_subscribers').insert({
                email: subscriberEmail
            });

            if (error) {
                if (error.message.toLowerCase().includes('duplicate') || error.message.toLowerCase().includes('unique')) {
                    setStatus({ type: 'success', message: 'This email is already subscribed to Lifewood updates.' });
                } else {
                    throw error;
                }
            } else {
                if (serviceId && publicKey && templateId) {
                    await emailjs.send(
                        serviceId,
                        templateId,
                        {
                            to_email: subscriberEmail,
                            to_name: subscriberEmail,
                            subject: 'Thanks for subscribing to Lifewood Internal News',
                            message:
                                'Thanks for subscribing to Lifewood Internal News. You will now receive the latest news, updates, and announcements in your inbox.',
                            from_name: 'Lifewood',
                            email_type: 'newsletter_subscriber'
                        },
                        publicKey
                    );
                }

                setStatus({
                    type: 'success',
                    message: "Thanks for subscribing. You'll receive Lifewood updates in your inbox."
                });
                setEmail('');
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message: error instanceof Error ? error.message : 'Unable to subscribe right now.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f2ea] pb-24 pt-20 text-[#101820] transition-colors duration-300 md:pt-24">
            <section className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto max-w-6xl"
                >
                    <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
                        <div className="relative overflow-hidden rounded-[34px] bg-[#101820] p-8 text-white shadow-[0_25px_60px_rgba(16,24,32,0.18)] md:p-10">
                            <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-[#ffb347]/20 blur-3xl" />
                            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#046241]/18 blur-3xl" />
                            <div className="relative z-10">
                                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/75">
                                    Internal News
                                </span>

                                <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white md:text-6xl">
                                    Stay in the loop with Lifewood.
                                </h1>

                                <p className="mt-5 max-w-2xl text-base leading-8 text-white/72 md:text-lg">
                                    Subscribe to receive daily updates, announcements, company highlights, and the latest
                                    news about Lifewood straight to your inbox.
                                </p>

                                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                                    <div className="rounded-[24px] border border-white/10 bg-white/6 p-5">
                                        <Newspaper className="h-5 w-5 text-[#ffb347]" />
                                        <p className="mt-4 text-lg font-semibold">Company updates</p>
                                        <p className="mt-2 text-sm leading-7 text-white/68">
                                            Follow recent developments, internal announcements, and business milestones.
                                        </p>
                                    </div>
                                    <div className="rounded-[24px] border border-white/10 bg-white/6 p-5">
                                        <BellRing className="h-5 w-5 text-[#ffb347]" />
                                        <p className="mt-4 text-lg font-semibold">Daily news digest</p>
                                        <p className="mt-2 text-sm leading-7 text-white/68">
                                            Get a regular stream of updates without needing to keep checking back manually.
                                        </p>
                                    </div>
                                    <div className="rounded-[24px] border border-white/10 bg-white/6 p-5">
                                        <Mail className="h-5 w-5 text-[#ffb347]" />
                                        <p className="mt-4 text-lg font-semibold">Direct to inbox</p>
                                        <p className="mt-2 text-sm leading-7 text-white/68">
                                            Receive relevant Lifewood content where it is easiest to catch and revisit.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[34px] border border-[#d9d2c3] bg-white p-8 shadow-[0_24px_60px_rgba(16,24,32,0.08)] md:p-10">
                            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#6b665d]">
                                Subscribe
                            </p>
                            <h2 className="mt-4 text-3xl font-semibold leading-tight text-[#101820] md:text-4xl">
                                Get daily Lifewood email updates
                            </h2>
                            <p className="mt-4 text-sm leading-7 text-[#51606a]">
                                Enter your email address below to join our internal news mailing list.
                            </p>

                            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                                <div>
                                    <label htmlFor="newsletter-email" className="text-sm font-medium text-[#101820]">
                                        Email address
                                    </label>
                                    <input
                                        id="newsletter-email"
                                        type="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        placeholder="you@example.com"
                                        required
                                        className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-[#f8f6f0] px-4 text-sm text-[#101820] outline-none transition focus:border-[#046241]/40"
                                    />
                                </div>

                                {status && (
                                    <div
                                        className={`rounded-2xl border px-4 py-3 text-sm ${
                                            status.type === 'success'
                                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                : 'border-red-200 bg-red-50 text-red-600'
                                        }`}
                                    >
                                        {status.message}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#0a2f22] px-6 text-sm font-semibold text-white transition hover:bg-[#0d3b2b] disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
                                </button>
                            </form>

                            <div className="mt-8 rounded-[24px] bg-[#efe8d7] p-5">
                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6b665d]">
                                    What to expect
                                </p>
                                <p className="mt-3 text-sm leading-7 text-[#33404a]">
                                    A simple subscription list for Lifewood-focused updates. You can expand this later into
                                    a fuller newsletter workflow once the mailing content pipeline is ready.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};
