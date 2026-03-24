import React, { useEffect, useMemo, useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { supabase } from '../lib/supabaseClient';

type MetricState = {
    totalMessages: number;
    unreadMessages: number;
    totalApplicants: number;
    latestMessage: string;
    latestApplicant: string;
};

type VisitorBucket = {
    minute: Date;
    label: string;
    count: number;
};

const windowMinutes = 30;

const buildBuckets = (start: Date, minutes: number) =>
    Array.from({ length: minutes }, (_, index) => {
        const minute = new Date(start.getTime() + index * 60 * 1000);
        return {
            minute,
            label: minute.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
            count: 0
        };
    });

export const AdminAnalytics: React.FC = () => {
    const [metrics, setMetrics] = useState<MetricState>({
        totalMessages: 0,
        unreadMessages: 0,
        totalApplicants: 0,
        latestMessage: '--',
        latestApplicant: '--'
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [visitorBuckets, setVisitorBuckets] = useState<VisitorBucket[]>([]);
    const [visitorsLoading, setVisitorsLoading] = useState(true);

    const totalRecentVisitors = useMemo(
        () => visitorBuckets.reduce((sum, bucket) => sum + bucket.count, 0),
        [visitorBuckets]
    );
    const maxVisitors = Math.max(1, ...visitorBuckets.map((bucket) => bucket.count));

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
                    .select('id, name, created_at')
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
                unreadMessages: visibleMessages.filter((item) => !item.is_read).length,
                totalApplicants: visibleApplicants.length,
                latestMessage: latestMessageName,
                latestApplicant: latestApplicantName
            });
            setIsLoading(false);
        };

        const loadVisitors = async () => {
            if (!supabase) return;
            const startTime = new Date(Date.now() - windowMinutes * 60 * 1000);
            const { data, error: visitorError } = await supabase
                .from('page_views')
                .select('created_at')
                .gte('created_at', startTime.toISOString());

            if (!mounted) return;

            if (visitorError) {
                setError(visitorError.message);
                setVisitorsLoading(false);
                return;
            }

            const buckets = buildBuckets(startTime, windowMinutes);
            (data ?? []).forEach((row) => {
                const createdAt = new Date(row.created_at);
                const bucketIndex = Math.floor((createdAt.getTime() - startTime.getTime()) / 60000);
                if (bucketIndex >= 0 && bucketIndex < buckets.length) {
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
                        const start = prev[0].minute;
                        const index = Math.floor((createdAt.getTime() - start.getTime()) / 60000);
                        if (index < 0) return prev;
                        if (index >= prev.length) {
                            const shiftCount = index - prev.length + 1;
                            const shifted = prev.slice(shiftCount);
                            const lastMinute = shifted[shifted.length - 1]?.minute ?? start;
                            for (let i = 0; i < shiftCount; i += 1) {
                                const minute = new Date(lastMinute.getTime() + (i + 1) * 60 * 1000);
                                shifted.push({
                                    minute,
                                    label: minute.toLocaleTimeString(undefined, {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }),
                                    count: 0
                                });
                            }
                            shifted[shifted.length - 1].count += 1;
                            return [...shifted];
                        }
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
                const lastMinute = prev[prev.length - 1].minute;
                const nextMinute = new Date(lastMinute.getTime() + 60 * 1000);
                const next = prev.slice(1);
                next.push({
                    minute: nextMinute,
                    label: nextMinute.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
                    count: 0
                });
                return next;
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
                        <p className="text-xs uppercase tracking-[0.3em] text-black/50">Messages</p>
                        <p className="mt-3 text-3xl font-semibold">
                            {isLoading ? '--' : metrics.totalMessages}
                        </p>
                        <p className="mt-1 text-xs text-black/60">
                            Unread: {isLoading ? '--' : metrics.unreadMessages}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_16px_30px_rgba(0,0,0,0.12)]">
                        <p className="text-xs uppercase tracking-[0.3em] text-black/50">Applicants</p>
                        <p className="mt-3 text-3xl font-semibold">
                            {isLoading ? '--' : metrics.totalApplicants}
                        </p>
                        <p className="mt-1 text-xs text-black/60">Total applications</p>
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
                            <p className="text-xs uppercase tracking-[0.3em] text-black/50">Realtime Visitors</p>
                            <h2 className="mt-2 text-2xl font-semibold">Last 30 minutes</h2>
                        </div>
                        <div className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-black/70">
                            {visitorsLoading ? 'Loading...' : `${totalRecentVisitors} views`}
                        </div>
                    </div>

                    <div className="mt-6">
                        {visitorsLoading ? (
                            <div className="flex h-56 items-center justify-center text-sm text-black/50">
                                Loading realtime chart...
                            </div>
                        ) : (
                            <div className="rounded-[28px] border border-black/10 bg-[#f7f8fa] p-4">
                                <div className="relative h-56">
                                    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                                        {[0, 1, 2, 3].map((line) => (
                                            <div key={line} className="border-t border-dashed border-black/10" />
                                        ))}
                                    </div>

                                    <div className="absolute inset-0 flex items-end gap-2">
                                        {visitorBuckets.map((bucket, index) => (
                                            <div key={`${bucket.label}-${index}`} className="flex h-full flex-1 flex-col justify-end">
                                                <div
                                                    className="w-full rounded-t-[10px] bg-[#0a2f22] shadow-[0_8px_20px_rgba(10,47,34,0.18)] transition-all duration-300 hover:bg-[#0d3b2b]"
                                                    style={{ height: `${(bucket.count / maxVisitors) * 100}%` }}
                                                    title={`${bucket.label}: ${bucket.count} visits`}
                                                />
                                                {index % 5 === 0 && (
                                                    <p className="mt-2 text-center text-[10px] text-black/40">{bucket.label}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between text-[11px] text-black/45">
                                    <span>0</span>
                                    <span>{Math.max(1, Math.ceil(maxVisitors / 2))}</span>
                                    <span>{maxVisitors}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
};
