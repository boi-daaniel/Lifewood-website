import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Ban, Eye, EyeOff, Github, Sparkles } from 'lucide-react';
import DarkVeil from '../components/DarkVeil';

export const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [identifier, setIdentifier] = useState('test1');
    const [password, setPassword] = useState('secret');

    useEffect(() => {
        if (!isSubmitting) return;
        const timer = window.setTimeout(() => setIsSubmitting(false), 1600);
        return () => window.clearTimeout(timer);
    }, [isSubmitting]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!identifier.trim() || !password.trim()) return;
        setIsSubmitting(true);
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-white pt-24 pb-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_-8%,rgba(16,79,56,0.08),transparent_42%),radial-gradient(circle_at_90%_118%,rgba(117,79,255,0.08),transparent_38%)]" />

            <section className="relative mx-auto w-[min(1240px,95%)]">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="grid gap-3 rounded-[2rem] border border-black/10 bg-transparent p-3 lg:grid-cols-[420px,1fr]"
                >
                    <div className="rounded-[1.7rem] border border-white/10 bg-[#07090c] p-6 md:p-8">
                        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white">
                            <ArrowLeft size={16} />
                            Back
                        </Link>

                        <div className="mt-7 flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-[#facc15]" />
                            <span className="text-2xl font-bold text-white">lifewood</span>
                        </div>

                        <h1 className="mt-9 text-4xl font-bold tracking-tight text-white">Sign In</h1>
                        <p className="mt-2 text-sm text-gray-400">Enter your credentials to access your dashboard</p>

                        <div className="mt-8 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className="flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
                                aria-label="Sign in with Google"
                            >
                                <span className="text-lg font-semibold">G</span>
                            </button>
                            <button
                                type="button"
                                className="flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
                                aria-label="Sign in with Github"
                            >
                                <Github size={18} />
                            </button>
                        </div>

                        <div className="my-7 flex items-center gap-3 text-xs text-gray-500">
                            <span className="h-px flex-1 bg-white/10" />
                            or
                            <span className="h-px flex-1 bg-white/10" />
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="identifier" className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                                    Username or Email
                                </label>
                                <input
                                    id="identifier"
                                    type="text"
                                    value={identifier}
                                    onChange={(event) => setIdentifier(event.target.value)}
                                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-white/30"
                                />
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label htmlFor="password" className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                                        Password
                                    </label>
                                    <button type="button" className="text-[11px] text-gray-500 transition-colors hover:text-gray-300">
                                        Forgot?
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 pr-11 text-sm text-white outline-none transition focus:border-white/30"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-300"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#a8adb3] text-sm font-semibold text-[#0b0b0b] transition-colors enabled:hover:bg-[#b6bbc1] disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Signing In...' : 'Sign In'}
                                {isSubmitting && <Ban size={15} className="text-red-600" />}
                            </button>
                        </form>
                    </div>

                    <div className="relative min-h-[340px] overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#e7e7ea] p-4 md:p-5 lg:min-h-[700px]">
                        <div className="pointer-events-none absolute inset-0">
                            <DarkVeil
                                hueShift={0}
                                noiseIntensity={0}
                                scanlineIntensity={0}
                                speed={0.5}
                                scanlineFrequency={0}
                                warpAmount={0}
                            />
                            <div className="absolute inset-0 bg-white/12" />
                        </div>

                        <div className="relative z-10 grid h-full auto-rows-[minmax(90px,auto)] grid-cols-1 gap-3 md:grid-cols-6">
                            <div className="md:col-span-6 rounded-3xl border border-white/30 bg-black/25 p-4 backdrop-blur-xl">
                                <div className="h-14 w-full rounded-2xl bg-white/10" />
                            </div>

                            <div className="md:col-span-4 rounded-3xl bg-[#ececef]/85 p-5 shadow-[0_16px_30px_rgba(30,30,40,0.12)] backdrop-blur-sm">
                                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#b7f8d6] text-[#e69500] shadow-[0_8px_18px_rgba(18,18,18,0.2)]">
                                    <Sparkles size={18} />
                                </div>
                                <p className="mt-4 text-sm text-gray-500">Harness the power of AI for cutting-edge 3D creations.</p>
                            </div>

                            <div className="md:col-span-2 rounded-3xl bg-[#d7d7de]/85 p-5 shadow-[0_16px_30px_rgba(30,30,40,0.12)]">
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Secure Access</p>
                                <p className="mt-3 text-3xl font-bold text-[#11131a]">24/7</p>
                                <p className="mt-1 text-sm text-gray-600">Protected login flow</p>
                            </div>

                            <div className="md:col-span-3 rounded-3xl bg-[#c7e94a] px-5 py-6 shadow-[0_16px_30px_rgba(30,36,16,0.2)]">
                                <h2 className="text-3xl font-bold text-black">User-Friendly</h2>
                                <p className="mt-1 text-sm text-black/60">Intuitive platform for everyone.</p>
                            </div>

                            <div className="md:col-span-3 rounded-3xl bg-[#a1a1a4] px-5 py-6 text-white/80 shadow-[0_16px_30px_rgba(25,25,29,0.24)]">
                                <p className="text-xs uppercase tracking-wide text-white/70">Quick Start</p>
                                <p className="mt-3 text-lg font-semibold text-white">Launch in minutes</p>
                                <p className="mt-1 text-sm text-white/70">Simple setup and guided onboarding.</p>
                            </div>

                            <button
                                type="button"
                                className="group md:col-span-6 flex items-center justify-between rounded-3xl bg-[#8f8f93] px-5 py-5 text-left text-white/80 transition-colors hover:bg-[#848488]"
                            >
                                <span className="text-sm">Join the future</span>
                                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 transition-transform group-hover:translate-x-0.5">
                                    <ArrowRight size={16} />
                                </span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};
