import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Ban, Eye, EyeOff, Sparkles } from 'lucide-react';
import DarkVeil from '../components/DarkVeil';
import { supabase } from '../lib/supabaseClient';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isResetting, setIsResetting] = useState(false);
    const [resetMode, setResetMode] = useState(false);
    const [resetStage, setResetStage] = useState<'request' | 'update'>('request');
    const [resetEmail, setResetEmail] = useState('');
    const [resetStatus, setResetStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    useEffect(() => {
        if (!supabase) return;
        const handleRecoveryFromUrl = async () => {
            try {
                const url = new URL(window.location.href);
                const code = url.searchParams.get('code');
                const hash = window.location.hash || '';
                const hasRecoveryType = url.searchParams.get('type') === 'recovery' || hash.includes('type=recovery');

                if (code) {
                    const { error } = await supabase.auth.exchangeCodeForSession(code);
                    if (error) {
                        setResetStatus({ type: 'error', message: error.message });
                        return;
                    }
                }

                if (code || hasRecoveryType) {
                    setResetMode(true);
                    setResetStage('update');
                    setResetStatus(null);
                    setNewPassword('');
                    setConfirmPassword('');
                }
            } catch (error) {
                setResetStatus({
                    type: 'error',
                    message: error instanceof Error ? error.message : 'Unable to process reset link.'
                });
            }
        };

        handleRecoveryFromUrl();
        const { data } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') {
                setResetMode(true);
                setResetStage('update');
                setResetStatus(null);
                setNewPassword('');
                setConfirmPassword('');
            }
        });

        return () => {
            data?.subscription?.unsubscribe();
        };
    }, []);

    const normalizeEmail = (value: string) => {
        const trimmed = value.trim();
        if (trimmed.includes('@')) return trimmed;
        const adminDomain = (import.meta.env.VITE_ADMIN_EMAIL_DOMAIN as string | undefined) ?? 'lifewood.local';
        return `${trimmed}@${adminDomain}`;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);
        const from =
            (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ??
            '/admin/dashboard';

        if (!supabase) {
            setErrorMessage('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
            return;
        }

        if (!identifier.trim() || !password.trim()) {
            setErrorMessage('Please enter your username (or email) and password.');
            return;
        }

        setIsSubmitting(true);
        try {
            const email = normalizeEmail(identifier);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                setErrorMessage(error.message);
            } else {
                const userId = data.user?.id;
                if (!userId) {
                    setErrorMessage('Unable to verify admin session.');
                    return;
                }

                const { data: adminProfile, error: adminError } = await supabase
                    .from('admin_profiles')
                    .select('id')
                    .eq('id', userId)
                    .maybeSingle();

                if (adminError || !adminProfile) {
                    await supabase.auth.signOut();
                    const debugMessage = adminError?.message
                        ? ` Admin profile lookup failed: ${adminError.message}`
                        : ' Admin profile lookup returned no rows.';
                    console.warn('Admin login debug', { adminError, adminProfile, userId });
                    setErrorMessage(`This account is not granted admin access yet.${debugMessage}`);
                    return;
                }

                setSuccessMessage('Signed in successfully.');
                navigate(from, { replace: true });
            }
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Failed to sign in.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openResetPanel = () => {
        setResetStatus(null);
        setResetEmail(identifier.trim());
        setResetStage('request');
        setResetMode(true);
    };

    const handleForgotPassword = async () => {
        setResetStatus(null);

        if (!supabase) {
            setResetStatus({
                type: 'error',
                message: 'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
            });
            return;
        }

        if (!resetEmail.trim()) {
            setResetStatus({ type: 'error', message: 'Please enter your email first.' });
            return;
        }

        setIsResetting(true);
        try {
            const email = normalizeEmail(resetEmail);
            const redirectTo =
                (import.meta.env.VITE_PASSWORD_RESET_REDIRECT as string | undefined) ??
                `${window.location.origin}/admin/login`;

            const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

            if (error) {
                setResetStatus({ type: 'error', message: error.message });
            } else {
                setResetStatus({
                    type: 'success',
                    message: 'Password reset email sent. Please check your inbox.'
                });
            }
        } catch (error) {
            setResetStatus({
                type: 'error',
                message: error instanceof Error ? error.message : 'Failed to send reset email.'
            });
        } finally {
            setIsResetting(false);
        }
    };

    const handleUpdatePassword = async () => {
        setResetStatus(null);

        if (!supabase) {
            setResetStatus({
                type: 'error',
                message: 'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
            });
            return;
        }

        if (newPassword.length < 8) {
            setResetStatus({ type: 'error', message: 'Password must be at least 8 characters.' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setResetStatus({ type: 'error', message: 'Passwords do not match.' });
            return;
        }

        setIsUpdatingPassword(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) {
                setResetStatus({ type: 'error', message: error.message });
            } else {
                setResetStatus({ type: 'success', message: 'Password updated successfully. You can sign in now.' });
                setResetStage('request');
                setResetMode(false);
            }
        } catch (error) {
            setResetStatus({
                type: 'error',
                message: error instanceof Error ? error.message : 'Failed to update password.'
            });
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-white pt-24 pb-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_-8%,rgba(16,79,56,0.08),transparent_42%),radial-gradient(circle_at_90%_118%,rgba(117,79,255,0.08),transparent_38%)]" />

            <section className="relative mx-auto w-full max-w-[560px] px-4">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="grid gap-3 rounded-[2rem] border border-black/10 bg-transparent p-2"
                >
                    <div className="relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-black p-6 md:p-8">
                        <div className="pointer-events-none absolute inset-0 opacity-80">
                            <DarkVeil
                                hueShift={30}
                                noiseIntensity={0.08}
                                scanlineIntensity={0.06}
                                speed={0.6}
                                scanlineFrequency={1.6}
                                warpAmount={0.2}
                            />
                            <div className="absolute inset-0 bg-black/40" />
                        </div>
                        <div className="relative z-10">
                        <Link to="/" className="inline-flex items-center gap-2 text-sm text-white transition-colors hover:text-white">
                            <ArrowLeft size={16} />
                            Back
                        </Link>

                        <div className="mt-7 flex items-center">
                            <img
                                src="https://framerusercontent.com/images/Ca8ppNsvJIfTsWEuHr50gvkDow.png?scale-down-to=512&width=2624&height=474"
                                alt="Lifewood"
                                className="h-7 w-auto"
                            />
                        </div>

                        <h1 className="mt-9 text-4xl font-bold tracking-tight text-white">
                            {resetMode ? 'Forgot Password' : 'Sign In'}
                        </h1>
                        <p className="mt-2 text-sm text-white">
                            {resetMode
                                ? 'Enter your email to receive a reset link'
                                : 'Enter your credentials to access your dashboard'}
                        </p>

                        <div className="relative overflow-hidden">
                            <motion.div
                                className="flex w-[200%]"
                                animate={{ x: resetMode ? '-50%' : '0%' }}
                                transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                            >
                                <form className="w-1/2 pr-3 space-y-4" onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="identifier" className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-white">
                                            Username or Email
                                        </label>
                                        <input
                                            id="identifier"
                                            type="text"
                                            value={identifier}
                                            onChange={(event) => setIdentifier(event.target.value)}
                                            autoComplete="username"
                                            className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-white/30"
                                        />
                                    </div>

                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <label htmlFor="password" className="block text-[11px] font-semibold uppercase tracking-wide text-white">
                                                Password
                                            </label>
                                        </div>
                                        <div className="relative">
                                            <input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(event) => setPassword(event.target.value)}
                                                autoComplete="current-password"
                                                className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 pr-11 text-sm text-white outline-none transition focus:border-white/30"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 transition-colors hover:text-white"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        <div className="mt-2 flex justify-end">
                                            <button
                                                type="button"
                                                onClick={openResetPanel}
                                                disabled={isResetting}
                                                className="text-[11px] text-white transition-colors hover:text-white/80 disabled:cursor-not-allowed disabled:opacity-70"
                                            >
                                                Forgot password?
                                            </button>
                                        </div>
                                    </div>

                                    {(errorMessage || successMessage) && (
                                        <div
                                            role="status"
                                            className={`rounded-xl border px-3 py-2 text-xs ${
                                                errorMessage
                                                    ? 'border-red-500/40 bg-red-500/10 text-red-200'
                                                    : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
                                            }`}
                                        >
                                            {errorMessage ?? successMessage}
                                        </div>
                                    )}

                                    {!supabase && !errorMessage && (
                                        <div className="rounded-xl border border-amber-300/40 bg-amber-200/10 px-3 py-2 text-xs text-amber-100">
                                            Supabase is not configured yet. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` then refresh.
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#133020] text-sm font-semibold text-white transition-colors enabled:hover:bg-[#19422b] disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                                        {isSubmitting && <Ban size={15} className="text-red-600" />}
                                    </button>
                                </form>

                                <div className="w-1/2 pl-3 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-white">
                                                {resetStage === 'update' ? 'Set New Password' : 'Reset Password'}
                                            </h2>
                                            <p className="mt-1 text-xs text-white">
                                                {resetStage === 'update'
                                                    ? 'Create a new password to finish the reset.'
                                                    : 'We will send a reset link to your email.'}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setResetMode(false)}
                                            className="text-[11px] text-white hover:text-white/80"
                                        >
                                            Back
                                        </button>
                                    </div>

                                    {resetStage === 'request' ? (
                                        <>
                                            <div>
                                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-white">
                                                    Email
                                                </label>
                                                <input
                                                    value={resetEmail}
                                                    onChange={(event) => setResetEmail(event.target.value)}
                                                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-white/30"
                                                    placeholder="you@company.com"
                                                />
                                            </div>

                                            {resetStatus && (
                                                <div
                                                    className={`rounded-xl border px-3 py-2 text-xs ${
                                                        resetStatus.type === 'success'
                                                            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
                                                            : 'border-red-500/40 bg-red-500/10 text-red-200'
                                                    }`}
                                                >
                                                    {resetStatus.message}
                                                </div>
                                            )}

                                            <button
                                                type="button"
                                                onClick={handleForgotPassword}
                                                disabled={isResetting}
                                                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#133020] text-sm font-semibold text-white transition-colors enabled:hover:bg-[#19422b] disabled:cursor-not-allowed disabled:opacity-70"
                                            >
                                                {isResetting ? 'Sending...' : 'Send Reset Link'}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-white">
                                                    New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(event) => setNewPassword(event.target.value)}
                                                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-white/30"
                                                    placeholder="At least 8 characters"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-white">
                                                    Confirm Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-white/30"
                                                    placeholder="Re-enter password"
                                                />
                                            </div>

                                            {resetStatus && (
                                                <div
                                                    className={`rounded-xl border px-3 py-2 text-xs ${
                                                        resetStatus.type === 'success'
                                                            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
                                                            : 'border-red-500/40 bg-red-500/10 text-red-200'
                                                    }`}
                                                >
                                                    {resetStatus.message}
                                                </div>
                                            )}

                                            <button
                                                type="button"
                                                onClick={handleUpdatePassword}
                                                disabled={isUpdatingPassword}
                                                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#c9ff3c] text-sm font-semibold text-black transition-colors enabled:hover:bg-[#d8ff70] disabled:cursor-not-allowed disabled:opacity-70"
                                            >
                                                {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                        </div>
                    </div>

                    
                </motion.div>
            </section>
        </div>
    );
};
