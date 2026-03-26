import React, { useEffect, useMemo, useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { supabase } from '../lib/supabaseClient';

type MetricState = {
    totalMessages: number;
    readMessages: number;
    unreadMessages: number;
    totalApplicants: number;
    acceptedApplicants: number;
    rejectedApplicants: number;
    latestMessage: string;
    latestApplicant: string;
};

type VisitorBucket = {
    date: Date;
    label: string;
    count: number;
};

const visitorHistoryDays = 14;

const createBucket = (date: Date): VisitorBucket => ({
    date,
    label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    count: 0
});

const buildBuckets = (start: Date, days: number) =>
    Array.from({ length: days }, (_, index) => {
        const date = new Date(start);
        date.setDate(start.getDate() + index);
        return createBucket(date);
    });

const getStartOfDay = (value = new Date()) => new Date(value.getFullYear(), value.getMonth(), value.getDate());

const addDays = (value: Date, days: number) => {
    const next = new Date(value);
    next.setDate(value.getDate() + days);
    return next;
};

const getDateKey = (value: Date) =>
    `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;

type MessageFilter = 'all' | 'read' | 'unread';
type ApplicantFilter = 'all' | 'accepted' | 'rejected';

export const AdminAnalytics: React.FC = () => {
    const [metrics, setMetrics] = useState<MetricState>({
        totalMessages: 0,
        readMessages: 0,
        unreadMessages: 0,
        totalApplicants: 0,
        acceptedApplicants: 0,
        rejectedApplicants: 0,
        latestMessage: '--',
        latestApplicant: '--'
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [visitorBuckets, setVisitorBuckets] = useState<VisitorBucket[]>([]);
    const [visitorsLoading, setVisitorsLoading] = useState(true);
    const [hoveredVisitorLabel, setHoveredVisitorLabel] = useState<string | null>(null);
    const [messageFilter, setMessageFilter] = useState<MessageFilter>('all');
    const [applicantFilter, setApplicantFilter] = useState<ApplicantFilter>('all');

    const totalVisitors = useMemo(
        () => visitorBuckets.reduce((sum, bucket) => sum + bucket.count, 0),
        [visitorBuckets]
    );
    const maxVisitors = Math.max(1, ...visitorBuckets.map((bucket) => bucket.count));
    const hoveredBucket =
        visitorBuckets.find((bucket) => bucket.label === hoveredVisitorLabel) ?? null;
    const busiestBucket =
        visitorBuckets.reduce<VisitorBucket | null>(
            (top, bucket) => (top == null || bucket.count > top.count ? bucket : top),
            null
        ) ?? createBucket(getStartOfDay());
    const averageVisitors = visitorBuckets.length > 0 ? Math.round(totalVisitors / visitorBuckets.length) : 0;
    const filteredMessageCount =
        messageFilter === 'read'
            ? metrics.readMessages
            : messageFilter === 'unread'
              ? metrics.unreadMessages
              : metrics.totalMessages;
    const filteredApplicantCount =
        applicantFilter === 'accepted'
            ? metrics.acceptedApplicants
            : applicantFilter === 'rejected'
              ? metrics.rejectedApplicants
              : metrics.totalApplicants;

    useEffect(() => {
        let mounted = true;

        const loadMetrics = async () => {
            if (!supabase) {
                if (mounted) {
                    setError('Supabase is not configured.');
                    setIsLoading(false);
                    setVisitorsLoading(false);
                }
                return;
            }

            const [messageResult, applicantResult] = await Promise.all([
                supabase
                    .from('contact_messages')
                    .select('id, name, created_at, is_read')
                    .eq('record_status', 'Active')
                    .order('created_at', { ascending: false }),
                supabase
                    .from('career_applications')
                    .select('id, name, created_at, status')
                    .eq('record_status', 'Active')
                    .order('created_at', { ascending: false })
            ]);

            if (!mounted) return;

            if (messageResult.error || applicantResult.error) {
                setError(messageResult.error?.message ?? applicantResult.error?.message ?? null);
            }

            const visibleMessages = messageResult.data ?? [];
            const visibleApplicants = applicantResult.data ?? [];
            const latestMessageName = visibleMessages[0]?.name ?? '--';
            const latestApplicantName = visibleApplicants[0]?.name ?? '--';

            setMetrics({
                totalMessages: visibleMessages.length,
                readMessages: visibleMessages.filter((item) => item.is_read).length,
                unreadMessages: visibleMessages.filter((item) => !item.is_read).length,
                totalApplicants: visibleApplicants.length,
                acceptedApplicants: visibleApplicants.filter((item) => item.status === 'Accepted').length,
                rejectedApplicants: visibleApplicants.filter((item) => item.status === 'Rejected').length,
                latestMessage: latestMessageName,
                latestApplicant: latestApplicantName
            });
            setIsLoading(false);
        };

        const loadVisitors = async () => {
            if (!supabase) return;
            const endTime = addDays(getStartOfDay(), 1);
            const startTime = addDays(getStartOfDay(), -(visitorHistoryDays - 1));
            const { data, error: visitorError } = await supabase
                .from('page_views')
                .select('created_at')
                .gte('created_at', startTime.toISOString())
                .lt('created_at', endTime.toISOString());

            if (!mounted) return;

            if (visitorError) {
                setError(visitorError.message);
                setVisitorsLoading(false);
                return;
            }

            const buckets = buildBuckets(startTime, visitorHistoryDays);
            const bucketIndexByKey = new Map(buckets.map((bucket, index) => [getDateKey(bucket.date), index]));
            (data ?? []).forEach((row) => {
                const createdAt = new Date(row.created_at);
                const bucketIndex = bucketIndexByKey.get(getDateKey(createdAt));
                if (bucketIndex !== undefined) {
                    buckets[bucketIndex].count += 1;
                }
            });

            setVisitorBuckets(buckets);
            setVisitorsLoading(false);
        };

        loadMetrics();
        loadVisitors();

        const channel = supabase
            ?.channel('page-views-realtime')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'page_views' },
                (payload) => {
                    const createdAt = new Date(payload.new.created_at);
                    setVisitorBuckets((prev) => {
                        if (prev.length === 0) return prev;
                        const index = prev.findIndex((bucket) => getDateKey(bucket.date) === getDateKey(createdAt));
                        if (index === -1) return prev;
                        const updated = [...prev];
                        updated[index] = {
                            ...updated[index],
                            count: updated[index].count + 1
                        };
                        return updated;
                    });
                }
            )
            .subscribe();

        return () => {
            mounted = false;
            channel?.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (visitorBuckets.length === 0) return undefined;
        const interval = window.setInterval(() => {
            setVisitorBuckets((prev) => {
                if (prev.length === 0) return prev;
                const expectedStart = addDays(getStartOfDay(), -(visitorHistoryDays - 1));
                if (getDateKey(prev[0].date) === getDateKey(expectedStart)) return prev;

                const shifted = [...prev];
                while (shifted.length > 0 && getDateKey(shifted[0].date) !== getDateKey(expectedStart)) {
                    shifted.shift();
                    const lastDate = shifted[shifted.length - 1]?.date ?? addDays(expectedStart, -1);
                    shifted.push(createBucket(addDays(lastDate, 1)));
                }

                return shifted.length === visitorHistoryDays ? shifted : buildBuckets(expectedStart, visitorHistoryDays);
            });
        }, 60000);
        return () => window.clearInterval(interval);
    }, [visitorBuckets.length]);

    return (
        <AdminLayout>
            <div className="rounded-[30px] border border-white/10 bg-white/90 px-7 py-6 text-black shadow-[0_25px_60px_rgba(0,0,0,0.35)] backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-black/50">Analytics</p>
                        <h1 className="mt-2 text-3xl font-semibold">Engagement Overview</h1>
                    </div>
                </div>

                {error && (
                    <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <section className="mt-6 grid gap-6 md:grid-cols-3">
                    <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_16px_30px_rgba(0,0,0,0.12)]">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-black/50">Messages</p>
                                <p className="mt-1 text-xs text-black/55">Filter by message status</p>
                            </div>
                            <select
                                value={messageFilter}
                                onChange={(event) => setMessageFilter(event.target.value as MessageFilter)}
                                className="h-10 rounded-full border border-black/10 bg-white px-3 text-xs font-semibold text-black outline-none transition hover:border-black/20 focus:border-[#0a2f22]"
                            >
                                <option value="all">All</option>
                                <option value="read">Read</option>
                                <option value="unread">Unread</option>
                            </select>
                        </div>
                        <p className="mt-4 text-3xl font-semibold">
                            {isLoading ? '--' : filteredMessageCount}
                        </p>
                        <p className="mt-1 text-xs text-black/60">
                            {messageFilter === 'all'
                                ? 'All active contact messages'
                                : messageFilter === 'read'
                                  ? 'Messages already opened by admins'
                                  : 'Messages still waiting to be read'}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full bg-black/5 px-3 py-1.5 text-black/70">
                                Read: {isLoading ? '--' : metrics.readMessages}
                            </span>
                            <span className="rounded-full bg-black/5 px-3 py-1.5 text-black/70">
                                Unread: {isLoading ? '--' : metrics.unreadMessages}
                            </span>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_16px_30px_rgba(0,0,0,0.12)]">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-black/50">Applicants</p>
                                <p className="mt-1 text-xs text-black/55">Filter by applicant outcome</p>
                            </div>
                            <select
                                value={applicantFilter}
                                onChange={(event) => setApplicantFilter(event.target.value as ApplicantFilter)}
                                className="h-10 rounded-full border border-black/10 bg-white px-3 text-xs font-semibold text-black outline-none transition hover:border-black/20 focus:border-[#0a2f22]"
                            >
                                <option value="all">All</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <p className="mt-4 text-3xl font-semibold">
                            {isLoading ? '--' : filteredApplicantCount}
                        </p>
                        <p className="mt-1 text-xs text-black/60">
                            {applicantFilter === 'all'
                                ? 'All active applications'
                                : applicantFilter === 'accepted'
                                  ? 'Applicants marked as accepted'
                                  : 'Applicants marked as rejected'}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">
                                Accepted: {isLoading ? '--' : metrics.acceptedApplicants}
                            </span>
                            <span className="rounded-full bg-rose-50 px-3 py-1.5 text-rose-700">
                                Rejected: {isLoading ? '--' : metrics.rejectedApplicants}
                            </span>
                        </div>
                    </div>

                    <div className="rounded-3xl bg-[#c9ff3c] p-5 text-black shadow-[0_16px_30px_rgba(0,0,0,0.18)]">
                        <p className="text-xs uppercase tracking-[0.3em] text-black/50">Latest Activity</p>
                        <p className="mt-3 text-xl font-semibold">{metrics.latestMessage}</p>
                        <p className="text-xs text-black/70">Latest message sender</p>
                        <p className="mt-3 text-xl font-semibold">{metrics.latestApplicant}</p>
                        <p className="text-xs text-black/70">Latest applicant</p>
                    </div>
                </section>

                <section className="mt-8 rounded-3xl border border-black/10 bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-black/50">Visitors By Day</p>
                            <h2 className="mt-2 text-2xl font-semibold">Last 14 days</h2>
                        </div>
                        <div className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-black/70">
                            {visitorsLoading ? 'Loading...' : `${totalVisitors} views`}
                        </div>
                    </div>

                    <div className="mt-6">
                        {visitorsLoading ? (
                            <div className="flex h-56 items-center justify-center text-sm text-black/50">
                                Loading visitors by day...
                            </div>
                        ) : (
                            <div className="grid gap-4 xl:grid-cols-[240px_minmax(0,1fr)]">
                                <div className="rounded-[28px] border border-black/10 bg-[#f7f9f8] p-5">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-black/45">
                                        Hover Detail
                                    </p>
                                    <p className="mt-4 text-sm font-medium text-black/55">
                                        {hoveredBucket ? hoveredBucket.label : busiestBucket.label}
                                    </p>
                                    <p className="mt-2 text-4xl font-semibold text-[#0a2f22]">
                                        {hoveredBucket ? hoveredBucket.count : busiestBucket.count}
                                    </p>
                                    <p className="mt-2 text-sm text-black/55">
                                        {hoveredBucket ? 'Visitors on the selected day' : 'Highest daily visitors in this range'}
                                    </p>

                                    <div className="mt-6 space-y-3 rounded-2xl bg-white/80 p-4">
                                        <div className="flex items-center justify-between text-sm text-black/60">
                                            <span>Total</span>
                                            <span className="font-semibold text-black">{totalVisitors}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-black/60">
                                            <span>Daily average</span>
                                            <span className="font-semibold text-black">{averageVisitors}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-black/60">
                                            <span>Peak day</span>
                                            <span className="font-semibold text-black">{busiestBucket.label}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-[28px] border border-black/10 bg-[#f7f8fa] p-4">
                                    <div className="mb-4 flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">
                                                Daily Traffic
                                            </p>
                                            <p className="mt-1 text-sm text-black/55">
                                                Hover a bar to inspect that date's visitor count.
                                            </p>
                                        </div>
                                        <div className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-black/60 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
                                            Peak {maxVisitors}
                                        </div>
                                    </div>

                                    <div className="relative h-64">
                                        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                                            {[0, 1, 2, 3].map((line) => (
                                                <div key={line} className="border-t border-dashed border-black/10" />
                                            ))}
                                        </div>

                                        <div className="absolute inset-0 flex items-end gap-3">
                                            {visitorBuckets.map((bucket, index) => {
                                                const isHovered = hoveredBucket?.label === bucket.label;
                                                const height =
                                                    bucket.count === 0
                                                        ? 6
                                                        : Math.max((bucket.count / maxVisitors) * 100, 14);

                                                return (
                                                    <div
                                                        key={`${bucket.label}-${index}`}
                                                        className="relative flex h-full flex-1 flex-col justify-end"
                                                    >
                                                        {isHovered && (
                                                            <div className="pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2 rounded-2xl bg-[#0f1720] px-3 py-2 text-center text-xs text-white shadow-[0_18px_35px_rgba(15,23,42,0.3)]">
                                                                <p className="whitespace-nowrap font-semibold">{bucket.label}</p>
                                                                <p className="mt-1 whitespace-nowrap text-white/80">
                                                                    {bucket.count} visitors
                                                                </p>
                                                            </div>
                                                        )}

                                                        <button
                                                            type="button"
                                                            onMouseEnter={() => setHoveredVisitorLabel(bucket.label)}
                                                            onMouseLeave={() => setHoveredVisitorLabel(null)}
                                                            onFocus={() => setHoveredVisitorLabel(bucket.label)}
                                                            onBlur={() => setHoveredVisitorLabel(null)}
                                                            className="group flex h-full w-full flex-col justify-end outline-none"
                                                            aria-label={`${bucket.label}: ${bucket.count} visitors`}
                                                        >
                                                            <div className="flex h-full items-end rounded-[22px] bg-white/65 px-1.5 pb-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition group-hover:bg-white group-focus:bg-white">
                                                                <div
                                                                    className={`w-full rounded-[16px] bg-gradient-to-t from-[#0a2f22] via-[#1f6a49] to-[#88c79f] shadow-[0_14px_26px_rgba(10,47,34,0.18)] transition-all duration-200 ${
                                                                        isHovered ? 'opacity-100 saturate-125' : 'opacity-90'
                                                                    }`}
                                                                    style={{ height: `${height}%` }}
                                                                />
                                                            </div>
                                                        </button>

                                                        <p className="mt-3 text-center text-[10px] font-medium text-black/45">
                                                            {bucket.label}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between text-[11px] text-black/45">
                                        <span>0</span>
                                        <span>{Math.max(1, Math.ceil(maxVisitors / 2))}</span>
                                        <span>{maxVisitors}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
};
