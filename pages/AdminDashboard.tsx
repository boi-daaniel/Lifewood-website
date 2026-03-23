import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../components/AdminLayout';
import DarkVeil from '../components/DarkVeil';
import { supabase } from '../lib/supabaseClient';
import { getTimeZoneForCountry } from '../lib/countries';
import { getSoftDeletedIds, SOFT_DELETE_KEYS } from '../lib/adminSoftDelete';

export const AdminDashboard: React.FC = () => {
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [messageStats, setMessageStats] = useState({
        total: 0,
        unread: 0,
        latestSender: 'No messages yet',
        latestTimestamp: ''
    });
    const [applicationsTotal, setApplicationsTotal] = useState<number | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [adminTimeZone, setAdminTimeZone] = useState<string | null>(null);

    const formatNow = (timeZone?: string | null) => {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        };
        const timeOptions: Intl.DateTimeFormatOptions = {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };

        if (timeZone) {
            options.timeZone = timeZone;
            timeOptions.timeZone = timeZone;
        }

        const date = now.toLocaleDateString(undefined, options);
        const time = now
            .toLocaleTimeString(undefined, timeOptions)
            .replace('AM', 'am')
            .replace('PM', 'pm');

        return `${date} | ${time}`;
    };

    useEffect(() => {
        let mounted = true;

        const loadStats = async () => {
            if (!supabase) {
                if (mounted) setLoadingStats(false);
                return;
            }

            const { data: sessionData } = await supabase.auth.getSession();
            const userId = sessionData.session?.user?.id;

            if (userId) {
                const { data: profile } = await supabase
                    .from('admin_profiles')
                    .select('location')
                    .eq('id', userId)
                    .maybeSingle();

                const tz = getTimeZoneForCountry(profile?.location);
                setAdminTimeZone(tz);
            }

            const hiddenMessageIds = getSoftDeletedIds(SOFT_DELETE_KEYS.contactMessages);
            const hiddenApplicantIds = getSoftDeletedIds(SOFT_DELETE_KEYS.applicants);

            const [{ data: messageRows, error: messageError }, { data: applicantRows, error: appError }] =
                await Promise.all([
                    supabase
                        .from('contact_messages')
                        .select('id, name, created_at, is_read')
                        .order('created_at', { ascending: false }),
                    supabase
                        .from('career_applications')
                        .select('id')
                ]);

            if (!mounted) return;

            const visibleMessages = (messageRows ?? []).filter((item) => !hiddenMessageIds.includes(item.id));
            const latestMessage = visibleMessages[0];
            const visibleApplicants = (applicantRows ?? []).filter((item) => !hiddenApplicantIds.includes(item.id));

            setMessageStats({
                total: messageError ? 0 : visibleMessages.length,
                unread: messageError ? 0 : visibleMessages.filter((item) => !item.is_read).length,
                latestSender: latestMessage?.name || 'No messages yet',
                latestTimestamp: latestMessage?.created_at || ''
            });

            setApplicationsTotal(appError ? null : visibleApplicants.length);
            setLoadingStats(false);
        };

        loadStats();
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        setCurrentDateTime(formatNow(adminTimeZone));
        const clock = window.setInterval(() => {
            setCurrentDateTime(formatNow(adminTimeZone));
        }, 60000);

        return () => window.clearInterval(clock);
    }, [adminTimeZone]);

    const formatDate = (value: string) =>
        value
            ? new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
            : '--';

    return (
        <AdminLayout>
            <div className="h-full w-full rounded-[30px] border border-white/10 bg-white/90 px-5 py-6 text-black shadow-[0_25px_60px_rgba(0,0,0,0.35)] backdrop-blur sm:px-7">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.35em] text-black/50">Overview</p>
                        <h1 className="mt-2 text-3xl font-semibold">Admin Dashboard</h1>
                    </div>
                    <div className="flex w-full items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-black/70 shadow-sm sm:w-fit lg:shrink-0">
                        <span className="h-2 w-2 rounded-full bg-[#c9ff3c]" />
                        <span className="truncate">{currentDateTime}</span>
                    </div>
                </div>

                <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(320px,0.9fr)] 2xl:grid-cols-[minmax(0,2fr)_380px]">
                    <div className="relative min-w-0 overflow-hidden rounded-[28px] bg-[#0e1014] text-white shadow-[0_30px_60px_rgba(0,0,0,0.55)]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(197,255,77,0.25),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(120,120,120,0.2),transparent_50%)]" />
                        <div className="relative z-10 p-6 sm:p-8">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-[#c9ff3c]">
                                Admin Overview
                            </span>
                            <h2 className="mt-6 text-3xl font-semibold leading-tight sm:text-4xl">
                                Contact Messages &amp;
                                <br />
                                Career Applications
                            </h2>
                            <p className="mt-4 max-w-2xl text-sm text-white/70">
                                Track incoming inquiries and applicants from a single dashboard.
                            </p>

                            <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                                <Link
                                    to="/admin/inbox"
                                    className="rounded-full bg-[#c9ff3c] px-5 py-2 text-sm font-semibold text-black transition hover:bg-[#d8ff70]"
                                >
                                    View Inbox
                                </Link>
                                <span className="text-xs text-white/60">
                                    {loadingStats ? 'Loading stats...' : `Unread: ${messageStats.unread}`}
                                </span>
                            </div>

                            <div className="mt-10 grid gap-4 sm:grid-cols-3">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:border-0 sm:bg-transparent sm:p-0">
                                    <p className="text-2xl font-semibold">{loadingStats ? '--' : messageStats.total}</p>
                                    <p className="text-[11px] uppercase tracking-[0.3em] text-white/50">Total Messages</p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:border-0 sm:bg-transparent sm:p-0">
                                    <p className="text-2xl font-semibold">{loadingStats ? '--' : messageStats.unread}</p>
                                    <p className="text-[11px] uppercase tracking-[0.3em] text-white/50">Unread</p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:border-0 sm:bg-transparent sm:p-0">
                                    <p className="text-2xl font-semibold">
                                        {loadingStats ? '--' : applicationsTotal ?? '--'}
                                    </p>
                                    <p className="text-[11px] uppercase tracking-[0.3em] text-white/50">Applications</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative min-w-0 overflow-hidden rounded-[28px] border border-black/10 bg-black p-5 text-white shadow-[0_30px_50px_rgba(0,0,0,0.5)] xl:h-full">
                        <div className="pointer-events-none absolute inset-0 opacity-85">
                            <DarkVeil
                                hueShift={30}
                                noiseIntensity={0.06}
                                scanlineIntensity={0.05}
                                speed={0.5}
                                scanlineFrequency={1.45}
                                warpAmount={0.18}
                            />
                            <div className="absolute inset-0 bg-black/45" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-xs text-white/50">Latest Contact</p>
                            <p className="mt-2 break-words text-xl font-semibold">{messageStats.latestSender}</p>
                            <p className="mt-1 text-sm text-white/70">
                                {loadingStats ? 'Loading timestamp...' : formatDate(messageStats.latestTimestamp)}
                            </p>

                            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Applications</p>
                                <p className="mt-3 text-3xl font-semibold text-white">
                                    {loadingStats ? '--' : applicationsTotal ?? '--'}
                                </p>
                                <p className="mt-1 text-xs text-white/60">
                                    {applicationsTotal === null ? 'Connect applications feed' : 'Tracked applicants'}
                                </p>
                            </div>

                            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                                <p className="text-xs uppercase tracking-[0.3em] text-white/70">Contact Messages</p>
                                <p className="mt-3 text-3xl font-semibold text-white">
                                    {loadingStats ? '--' : messageStats.total}
                                </p>
                                <p className="mt-1 text-xs text-white/70">Total submissions</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] 2xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,1fr)_320px]">
                    <div className="min-w-0 rounded-[26px] border border-black/10 bg-white p-5 shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
                        <p className="text-sm font-semibold">Message Overview</p>
                        <p className="text-xs text-black/50">Latest contact volume</p>
                        <div className="mt-5 rounded-2xl border border-black/10 bg-[#f6f7f9] p-4">
                            <div className="flex items-center justify-between text-xs text-black/60">
                                <span>Total messages</span>
                                <span className="text-black">{loadingStats ? '--' : messageStats.total}</span>
                            </div>
                            <div className="mt-2 h-2 w-full rounded-full bg-black/10">
                                <div className="h-2 w-[72%] rounded-full bg-[#c9ff3c]" />
                            </div>
                        </div>
                        <div className="mt-4 rounded-2xl border border-black/10 bg-[#f6f7f9] p-4">
                            <div className="flex items-center justify-between text-xs text-black/60">
                                <span>Unread messages</span>
                                <span className="text-black">{loadingStats ? '--' : messageStats.unread}</span>
                            </div>
                            <div className="mt-2 h-2 w-full rounded-full bg-black/10">
                                <div className="h-2 w-[48%] rounded-full bg-black" />
                            </div>
                        </div>
                    </div>

                    <div className="min-w-0 rounded-[26px] bg-[#c9ff3c] p-6 text-black shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                        <p className="text-xs uppercase tracking-[0.3em] text-black/60">Inbox Health</p>
                        <p className="mt-3 text-4xl font-semibold">
                            {loadingStats ? '--' : messageStats.unread === 0 ? 'Clear' : 'Pending'}
                        </p>
                        <p className="mt-2 text-sm text-black/70">
                            {loadingStats ? 'Checking status' : `${messageStats.unread} unread messages`}
                        </p>
                        <div className="mt-6 rounded-full bg-black/10 px-3 py-2 text-xs font-semibold text-black/70">
                            Track and respond quickly
                        </div>
                    </div>

                    <div className="min-w-0 rounded-[26px] border border-black/10 bg-[#046241] p-6 text-white shadow-[0_20px_40px_rgba(0,0,0,0.35)] lg:col-span-2 2xl:col-span-1">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Applications</p>
                        <p className="mt-4 text-3xl font-semibold text-white">
                            {loadingStats ? '--' : applicationsTotal ?? '--'}
                        </p>
                        <p className="mt-1 text-sm text-white/70">
                            {applicationsTotal === null ? 'Not connected' : 'Total applicants'}
                        </p>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
};
