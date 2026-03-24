import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../components/AdminLayout';
import { supabase } from '../lib/supabaseClient';
import { getTimeZoneForCountry } from '../lib/countries';

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

            const [{ data: messageRows, error: messageError }, { data: applicantRows, error: appError }] =
                await Promise.all([
                    supabase
                        .from('contact_messages')
                        .select('id, name, created_at, is_read')
                        .eq('record_status', 'Active')
                        .order('created_at', { ascending: false }),
                    supabase
                        .from('career_applications')
                        .select('id')
                        .eq('record_status', 'Active')
                ]);

            if (!mounted) return;

            const visibleMessages = messageRows ?? [];
            const latestMessage = visibleMessages[0];
            const visibleApplicants = applicantRows ?? [];

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

    const unreadRatio = messageStats.total > 0 ? Math.round((messageStats.unread / messageStats.total) * 100) : 0;
    const inboxState = loadingStats
        ? 'Syncing activity'
        : messageStats.unread === 0
          ? 'Inbox is clear'
          : messageStats.unread <= 5
            ? 'A few replies are waiting'
            : 'Inbox needs attention';
    const applicantState = loadingStats
        ? 'Loading pipeline'
        : (applicationsTotal ?? 0) === 0
          ? 'No active applicants yet'
          : (applicationsTotal ?? 0) < 10
            ? 'Hiring flow is manageable'
            : 'Applicant volume is building';
    const latestActivity = loadingStats ? 'Loading latest activity...' : formatDate(messageStats.latestTimestamp);

    return (
        <AdminLayout>
            <div className="h-full w-full rounded-[32px] border border-black/8 bg-[linear-gradient(180deg,#ffffff_0%,#f7faf7_100%)] px-5 py-6 text-black shadow-[0_25px_60px_rgba(0,0,0,0.12)] sm:px-7">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.35em] text-black/45">Overview</p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-[2.5rem]">
                            Operations Dashboard
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
                            A cleaner control room for inbox activity, applicant flow, and the next actions your team should take today.
                        </p>
                    </div>
                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[280px]">
                        <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-black/70 shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-[#c9ff3c]" />
                            <span className="truncate">{currentDateTime}</span>
                        </div>
                        <div className="rounded-[22px] border border-[#d8e8d8] bg-[#eef7ee] px-4 py-3 text-sm text-[#1d412f]">
                            <span className="font-semibold">{inboxState}.</span> {applicantState}.
                        </div>
                    </div>
                </div>

                <section className="mt-7 overflow-hidden rounded-[30px] border border-[#d8e8d8] bg-[#0f1714] text-white shadow-[0_22px_50px_rgba(0,0,0,0.18)]">
                    <div className="grid gap-0 xl:grid-cols-[minmax(0,1.35fr)_380px]">
                        <div className="relative overflow-hidden px-6 py-7 sm:px-8 sm:py-9">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,255,60,0.22),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(4,98,65,0.55),transparent_36%)]" />
                            <div className="relative z-10">
                                <span className="inline-flex rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] uppercase tracking-[0.32em] text-[#d3ff6b]">
                                    Today&apos;s Pulse
                                </span>
                                <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.04em] sm:text-[2.7rem] sm:leading-[1.05]">
                                    Keep response time tight and hiring decisions visible.
                                </h2>
                                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/72">
                                    Use the dashboard as a daily handoff point: start with unread messages, then move through applicant decisions and follow-up actions.
                                </p>

                                <div className="mt-7 flex flex-wrap gap-3">
                                    <Link
                                        to="/admin/inbox"
                                        className="rounded-full bg-[#c9ff3c] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#d8ff70]"
                                    >
                                        Open Inbox
                                    </Link>
                                    <Link
                                        to="/admin/applicants"
                                        className="rounded-full border border-white/14 bg-white/8 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/12"
                                    >
                                        Review Applicants
                                    </Link>
                                    <Link
                                        to="/admin/analytics"
                                        className="rounded-full border border-white/14 bg-transparent px-5 py-2.5 text-sm font-semibold text-white/82 transition hover:bg-white/8 hover:text-white"
                                    >
                                        View Analytics
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-white/8 bg-white/[0.04] px-6 py-7 xl:border-l xl:border-t-0">
                            <p className="text-[11px] uppercase tracking-[0.3em] text-white/45">Latest Contact</p>
                            <p className="mt-4 break-words text-2xl font-semibold tracking-[-0.03em]">
                                {loadingStats ? '--' : messageStats.latestSender}
                            </p>
                            <p className="mt-2 text-sm text-white/65">{latestActivity}</p>

                            <div className="mt-8 space-y-4">
                                <div className="rounded-[22px] border border-white/10 bg-black/20 px-4 py-4">
                                    <p className="text-[11px] uppercase tracking-[0.3em] text-white/45">Unread Share</p>
                                    <div className="mt-3 flex items-end justify-between gap-3">
                                        <p className="text-3xl font-semibold">{loadingStats ? '--' : `${unreadRatio}%`}</p>
                                        <p className="text-xs text-white/55">{loadingStats ? 'Calculating' : `${messageStats.unread} unread`}</p>
                                    </div>
                                </div>
                                <div className="rounded-[22px] border border-white/10 bg-black/20 px-4 py-4">
                                    <p className="text-[11px] uppercase tracking-[0.3em] text-white/45">Applicants in Queue</p>
                                    <div className="mt-3 flex items-end justify-between gap-3">
                                        <p className="text-3xl font-semibold">{loadingStats ? '--' : applicationsTotal ?? '--'}</p>
                                        <p className="text-xs text-white/55">Active records</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-[24px] border border-black/10 bg-white px-5 py-5 shadow-[0_16px_30px_rgba(0,0,0,0.06)]">
                        <p className="text-[11px] uppercase tracking-[0.28em] text-black/45">Messages</p>
                        <p className="mt-4 text-4xl font-semibold tracking-[-0.04em]">{loadingStats ? '--' : messageStats.total}</p>
                        <p className="mt-2 text-sm text-black/55">Total active contact submissions.</p>
                    </div>
                    <div className="rounded-[24px] border border-black/10 bg-white px-5 py-5 shadow-[0_16px_30px_rgba(0,0,0,0.06)]">
                        <p className="text-[11px] uppercase tracking-[0.28em] text-black/45">Unread</p>
                        <p className="mt-4 text-4xl font-semibold tracking-[-0.04em]">{loadingStats ? '--' : messageStats.unread}</p>
                        <p className="mt-2 text-sm text-black/55">Messages still waiting for review.</p>
                    </div>
                    <div className="rounded-[24px] border border-black/10 bg-white px-5 py-5 shadow-[0_16px_30px_rgba(0,0,0,0.06)]">
                        <p className="text-[11px] uppercase tracking-[0.28em] text-black/45">Applicants</p>
                        <p className="mt-4 text-4xl font-semibold tracking-[-0.04em]">{loadingStats ? '--' : applicationsTotal ?? '--'}</p>
                        <p className="mt-2 text-sm text-black/55">Career applications currently active.</p>
                    </div>
                    <div className="rounded-[24px] border border-black/10 bg-[#eef7ee] px-5 py-5 shadow-[0_16px_30px_rgba(0,0,0,0.06)]">
                        <p className="text-[11px] uppercase tracking-[0.28em] text-[#234533]/55">Focus</p>
                        <p className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[#173526]">{inboxState}</p>
                        <p className="mt-2 text-sm text-[#234533]/72">Start here if you need the fastest operational win.</p>
                    </div>
                </section>

                <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                    <div className="rounded-[28px] border border-black/10 bg-white px-6 py-6 shadow-[0_18px_36px_rgba(0,0,0,0.08)]">
                        <div className="flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <p className="text-sm font-semibold">Inbox Readiness</p>
                                <p className="mt-1 text-sm text-black/50">A quick read on message load and triage pressure.</p>
                            </div>
                            <span className="rounded-full bg-[#f2f5f2] px-3 py-1 text-xs font-semibold text-black/55">
                                {loadingStats ? 'Syncing' : `${unreadRatio}% unread`}
                            </span>
                        </div>

                        <div className="mt-6 space-y-5">
                            <div>
                                <div className="flex items-center justify-between text-sm text-black/60">
                                    <span>Total messages</span>
                                    <span className="font-semibold text-black">{loadingStats ? '--' : messageStats.total}</span>
                                </div>
                                <div className="mt-2 h-2.5 w-full rounded-full bg-black/8">
                                    <div
                                        className="h-2.5 rounded-full bg-[#046241] transition-all"
                                        style={{ width: loadingStats ? '32%' : '100%' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between text-sm text-black/60">
                                    <span>Unread messages</span>
                                    <span className="font-semibold text-black">{loadingStats ? '--' : messageStats.unread}</span>
                                </div>
                                <div className="mt-2 h-2.5 w-full rounded-full bg-black/8">
                                    <div
                                        className="h-2.5 rounded-full bg-black transition-all"
                                        style={{ width: `${loadingStats ? 18 : Math.max(unreadRatio, messageStats.unread > 0 ? 8 : 0)}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 rounded-[22px] border border-[#dbe7db] bg-[#f7fbf7] px-4 py-4">
                            <p className="text-[11px] uppercase tracking-[0.28em] text-black/45">Recommended Next Step</p>
                            <p className="mt-3 text-base font-semibold text-black">
                                {loadingStats
                                    ? 'Checking queue...'
                                    : messageStats.unread > 0
                                      ? 'Open the inbox and clear unread messages first.'
                                      : 'Inbox is caught up. Move on to applicant review.'}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-black/10 bg-[#f3f7f3] px-6 py-6 shadow-[0_18px_36px_rgba(0,0,0,0.08)]">
                        <p className="text-sm font-semibold">Hiring Snapshot</p>
                        <p className="mt-1 text-sm text-black/50">The applicant pipeline at a glance.</p>

                        <div className="mt-6 space-y-4">
                            <div className="rounded-[22px] border border-black/8 bg-white px-4 py-4">
                                <p className="text-[11px] uppercase tracking-[0.28em] text-black/45">Applicant Volume</p>
                                <p className="mt-3 text-4xl font-semibold tracking-[-0.04em]">
                                    {loadingStats ? '--' : applicationsTotal ?? '--'}
                                </p>
                                <p className="mt-2 text-sm text-black/55">{applicantState}</p>
                            </div>
                            <div className="rounded-[22px] border border-black/8 bg-white px-4 py-4">
                                <p className="text-[11px] uppercase tracking-[0.28em] text-black/45">Latest Inbox Activity</p>
                                <p className="mt-3 text-lg font-semibold">{loadingStats ? '--' : messageStats.latestSender}</p>
                                <p className="mt-1 text-sm text-black/55">{latestActivity}</p>
                            </div>
                            <div className="rounded-[22px] bg-[#046241] px-4 py-4 text-white">
                                <p className="text-[11px] uppercase tracking-[0.28em] text-white/60">Workflow</p>
                                <p className="mt-3 text-base font-semibold">Review, decide, and follow up from one dashboard flow.</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <Link
                                        to="/admin/applicants"
                                        className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#046241] transition hover:bg-[#f2f7f2]"
                                    >
                                        Open Applicants
                                    </Link>
                                    <Link
                                        to="/admin/inbox"
                                        className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                                    >
                                        Open Inbox
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
};
