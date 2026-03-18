import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { supabase } from '../lib/supabaseClient';

type Applicant = {
    id: string;
    name: string;
    email: string;
    contact_number: string | null;
    gender: string | null;
    age: number | null;
    address: string | null;
    country: string | null;
    position: string;
    resume_path: string;
    created_at: string;
};

export const AdminApplicants: React.FC = () => {
    const [applications, setApplications] = useState<Applicant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const loadApplicants = async () => {
            if (!supabase) {
                if (mounted) {
                    setError('Supabase is not configured.');
                    setIsLoading(false);
                }
                return;
            }

            const { data, error: fetchError } = await supabase
                .from('career_applications')
                .select(
                    'id, name, email, contact_number, gender, age, address, country, position, resume_path, created_at'
                )
                .order('created_at', { ascending: false });

            if (!mounted) return;

            if (fetchError) {
                setError(fetchError.message);
            } else {
                setApplications(data ?? []);
            }
            setIsLoading(false);
        };

        loadApplicants();
        return () => {
            mounted = false;
        };
    }, []);

    const formatDate = (value: string) =>
        new Date(value).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short'
        });

    const filtered = applications.filter((item) => {
        if (!searchTerm.trim()) return true;
        const query = searchTerm.toLowerCase();
        return (
            item.name.toLowerCase().includes(query) ||
            item.email.toLowerCase().includes(query) ||
            item.position.toLowerCase().includes(query) ||
            (item.country ?? '').toLowerCase().includes(query)
        );
    });

    const handleDownload = async (application: Applicant) => {
        if (!supabase) return;
        setDownloadingId(application.id);
        const { data, error: signedError } = await supabase.storage
            .from('resumes')
            .createSignedUrl(application.resume_path, 60 * 10);

        if (signedError || !data?.signedUrl) {
            setError(signedError?.message ?? 'Unable to create download link.');
            setDownloadingId(null);
            return;
        }

        window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
        setDownloadingId(null);
    };

    return (
        <AdminLayout>
            <div className="rounded-[30px] border border-white/10 bg-white/90 px-7 py-6 text-black shadow-[0_25px_60px_rgba(0,0,0,0.35)] backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-black/50">Applicants</p>
                        <h1 className="mt-2 text-3xl font-semibold">Career Applications</h1>
                    </div>
                </div>

                <div className="mt-6">
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search by name, email, position, or country..."
                        className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-black outline-none focus:border-black/30"
                    />
                </div>

                <div className="mt-6 rounded-3xl border border-black/10 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
                    <div className="border-b border-black/10 px-6 py-4">
                        <p className="text-sm font-semibold">Latest applicants</p>
                        <p className="text-xs text-black/50">Submitted via the Careers form.</p>
                    </div>

                    {isLoading && (
                        <div className="px-6 py-6 text-sm text-black/60">Loading applications...</div>
                    )}

                    {!isLoading && error && (
                        <div className="px-6 py-6 text-sm text-red-600">{error}</div>
                    )}

                    {!isLoading && !error && applications.length === 0 && (
                        <div className="px-6 py-10 text-sm text-black/60">
                            No applications yet. New submissions will appear here.
                        </div>
                    )}

                    {!isLoading && !error && filtered.length > 0 && (
                        <div className="divide-y divide-black/10">
                            {filtered.map((item) => (
                                <div key={item.id} className="px-6 py-5">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div>
                                            <p className="text-base font-semibold">{item.name}</p>
                                            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-black/60">
                                                <a
                                                    href={`mailto:${item.email}`}
                                                    className="hover:text-black"
                                                >
                                                    {item.email}
                                                </a>
                                                {item.contact_number && (
                                                    <span>{item.contact_number}</span>
                                                )}
                                                {item.country && <span>{item.country}</span>}
                                            </div>
                                            <p className="mt-2 text-sm text-black/70">
                                                Position: <span className="font-semibold">{item.position}</span>
                                            </p>
                                            <p className="text-xs text-black/50">
                                                Submitted {formatDate(item.created_at)}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-start gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleDownload(item)}
                                                disabled={downloadingId === item.id}
                                                className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-black/70 transition hover:border-black/30 hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {downloadingId === item.id ? 'Preparing...' : 'Download Resume'}
                                            </button>
                                            <a
                                                href={`mailto:${item.email}?subject=${encodeURIComponent(
                                                    `Lifewood Application: ${item.position}`
                                                )}`}
                                                className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-black/70 transition hover:border-black/30 hover:text-black"
                                            >
                                                Reply
                                            </a>
                                        </div>
                                    </div>
                                    {(item.gender || item.age || item.address) && (
                                        <div className="mt-3 text-xs text-black/50">
                                            {item.gender && <span>Gender: {item.gender}</span>}
                                            {item.gender && (item.age || item.address) && <span className="mx-2">•</span>}
                                            {item.age && <span>Age: {item.age}</span>}
                                            {item.address && (item.gender || item.age) && <span className="mx-2">•</span>}
                                            {item.address && <span>Address: {item.address}</span>}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {!isLoading && !error && applications.length > 0 && filtered.length === 0 && (
                        <div className="px-6 py-10 text-sm text-black/60">
                            No applicants match your search.
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};
