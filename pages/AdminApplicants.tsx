import React, { useEffect, useMemo, useState } from 'react';
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

type EditForm = {
    name: string;
    email: string;
    contact_number: string;
    gender: string;
    age: string;
    address: string;
    country: string;
    position: string;
};

export const AdminApplicants: React.FC = () => {
    const [applications, setApplications] = useState<Applicant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [viewingId, setViewingId] = useState<string | null>(null);
    const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(null);
    const [editForm, setEditForm] = useState<EditForm | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

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

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const safePage = Math.min(currentPage, totalPages);
    const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    useEffect(() => {
        setMenuOpenId(null);
    }, [searchTerm, currentPage]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    useEffect(() => {
        const handleWindowClick = () => setMenuOpenId(null);
        window.addEventListener('click', handleWindowClick);
        return () => window.removeEventListener('click', handleWindowClick);
    }, []);

    const editInitial = useMemo<EditForm | null>(() => {
        if (!editingApplicant) return null;
        return {
            name: editingApplicant.name,
            email: editingApplicant.email,
            contact_number: editingApplicant.contact_number ?? '',
            gender: editingApplicant.gender ?? '',
            age: editingApplicant.age !== null ? String(editingApplicant.age) : '',
            address: editingApplicant.address ?? '',
            country: editingApplicant.country ?? '',
            position: editingApplicant.position
        };
    }, [editingApplicant]);

    useEffect(() => {
        if (editInitial) setEditForm(editInitial);
    }, [editInitial]);

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

    const handleViewResume = async (application: Applicant) => {
        if (!supabase) return;
        setViewingId(application.id);
        const { data, error: signedError } = await supabase.storage
            .from('resumes')
            .createSignedUrl(application.resume_path, 60 * 10);

        if (signedError || !data?.signedUrl) {
            setError(signedError?.message ?? 'Unable to open resume.');
            setViewingId(null);
            return;
        }

        window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
        setViewingId(null);
    };

    const handleEditChange = (field: keyof EditForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!editForm) return;
        setEditForm({ ...editForm, [field]: event.target.value });
    };

    const handleSaveEdit = async () => {
        if (!supabase || !editingApplicant || !editForm) return;
        setIsSaving(true);
        setError(null);

        const payload = {
            name: editForm.name.trim(),
            email: editForm.email.trim(),
            contact_number: editForm.contact_number.trim() || null,
            gender: editForm.gender.trim() || null,
            age: editForm.age ? Number(editForm.age) : null,
            address: editForm.address.trim() || null,
            country: editForm.country.trim() || null,
            position: editForm.position.trim()
        };

        const { error: updateError } = await supabase
            .from('career_applications')
            .update(payload)
            .eq('id', editingApplicant.id);

        if (updateError) {
            setError(updateError.message);
            setIsSaving(false);
            return;
        }

        setApplications((prev) =>
            prev.map((item) =>
                item.id === editingApplicant.id
                    ? {
                          ...item,
                          ...payload,
                          contact_number: payload.contact_number,
                          gender: payload.gender,
                          age: payload.age,
                          address: payload.address,
                          country: payload.country
                      }
                    : item
            )
        );
        setEditingApplicant(null);
        setEditForm(null);
        setIsSaving(false);
    };

    const handleDelete = async (application: Applicant) => {
        if (!supabase) return;
        const confirmed = window.confirm(`Delete application from ${application.name}? This cannot be undone.`);
        if (!confirmed) return;

        setDeletingId(application.id);
        setError(null);

        const { error: deleteError } = await supabase
            .from('career_applications')
            .delete()
            .eq('id', application.id);

        if (deleteError) {
            setError(deleteError.message);
            setDeletingId(null);
            return;
        }

        await supabase.storage.from('resumes').remove([application.resume_path]);
        setApplications((prev) => prev.filter((item) => item.id !== application.id));
        setDeletingId(null);
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

                    {!isLoading && !error && paginated.length > 0 && (
                        <div className="divide-y divide-black/10">
                            {paginated.map((item) => (
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
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setMenuOpenId((prev) => (prev === item.id ? null : item.id))
                                                }}
                                                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-lg text-black/60 transition hover:border-black/30 hover:text-black"
                                                aria-haspopup="menu"
                                                aria-expanded={menuOpenId === item.id}
                                                aria-label="Applicant actions"
                                            >
                                                ...
                                            </button>
                                            {menuOpenId === item.id && (
                                                <div
                                                    onClick={(event) => event.stopPropagation()}
                                                    className="absolute right-0 top-11 z-10 w-44 rounded-2xl border border-black/10 bg-white p-2 shadow-[0_20px_40px_rgba(0,0,0,0.16)]"
                                                    role="menu"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            handleDownload(item);
                                                            setMenuOpenId(null);
                                                        }}
                                                        disabled={downloadingId === item.id}
                                                        className="w-full rounded-xl px-3 py-2 text-left text-xs font-semibold text-black/70 transition hover:bg-black/5 hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
                                                        role="menuitem"
                                                    >
                                                        {downloadingId === item.id ? 'Preparing...' : 'Download Resume'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            handleViewResume(item);
                                                            setMenuOpenId(null);
                                                        }}
                                                        disabled={viewingId === item.id}
                                                        className="w-full rounded-xl px-3 py-2 text-left text-xs font-semibold text-black/70 transition hover:bg-black/5 hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
                                                        role="menuitem"
                                                    >
                                                        {viewingId === item.id ? 'Opening...' : 'View Resume'}
                                                    </button>
                                                    <a
                                                        href={`mailto:${item.email}?subject=${encodeURIComponent(
                                                            `Lifewood Application: ${item.position}`
                                                        )}`}
                                                        onClick={() => setMenuOpenId(null)}
                                                        className="block w-full rounded-xl px-3 py-2 text-left text-xs font-semibold text-black/70 transition hover:bg-black/5 hover:text-black"
                                                        role="menuitem"
                                                    >
                                                        Reply
                                                    </a>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingApplicant(item);
                                                            setMenuOpenId(null);
                                                        }}
                                                        className="w-full rounded-xl px-3 py-2 text-left text-xs font-semibold text-black/70 transition hover:bg-black/5 hover:text-black"
                                                        role="menuitem"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            handleDelete(item);
                                                            setMenuOpenId(null);
                                                        }}
                                                        disabled={deletingId === item.id}
                                                        className="w-full rounded-xl px-3 py-2 text-left text-xs font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                        role="menuitem"
                                                    >
                                                        {deletingId === item.id ? 'Deleting...' : 'Delete'}
                                                    </button>
                                                </div>
                                            )}
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

                    {!isLoading && !error && filtered.length > 0 && totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 text-sm text-black/60">
                            <span>
                                Page {safePage} of {totalPages}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    disabled={safePage === 1}
                                    className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-black/70 transition hover:border-black/30 hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Prev
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={safePage === totalPages}
                                    className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-black/70 transition hover:border-black/30 hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {editingApplicant && editForm && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4">
                    <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-black">Edit Applicant</h2>
                            <button
                                type="button"
                                onClick={() => setEditingApplicant(null)}
                                className="text-sm text-black/60 hover:text-black"
                            >
                                Close
                            </button>
                        </div>
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-xs font-semibold text-black/60">Name</label>
                                <input
                                    value={editForm.name}
                                    onChange={handleEditChange('name')}
                                    className="mt-2 w-full h-11 rounded-xl border border-black/10 px-3 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-black/60">Email</label>
                                <input
                                    value={editForm.email}
                                    onChange={handleEditChange('email')}
                                    className="mt-2 w-full h-11 rounded-xl border border-black/10 px-3 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-black/60">Contact</label>
                                <input
                                    value={editForm.contact_number}
                                    onChange={handleEditChange('contact_number')}
                                    className="mt-2 w-full h-11 rounded-xl border border-black/10 px-3 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-black/60">Gender</label>
                                <input
                                    value={editForm.gender}
                                    onChange={handleEditChange('gender')}
                                    className="mt-2 w-full h-11 rounded-xl border border-black/10 px-3 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-black/60">Age</label>
                                <input
                                    value={editForm.age}
                                    onChange={handleEditChange('age')}
                                    className="mt-2 w-full h-11 rounded-xl border border-black/10 px-3 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-black/60">Position</label>
                                <input
                                    value={editForm.position}
                                    onChange={handleEditChange('position')}
                                    className="mt-2 w-full h-11 rounded-xl border border-black/10 px-3 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-black/60">Country</label>
                                <input
                                    value={editForm.country}
                                    onChange={handleEditChange('country')}
                                    className="mt-2 w-full h-11 rounded-xl border border-black/10 px-3 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-black/60">Address</label>
                                <input
                                    value={editForm.address}
                                    onChange={handleEditChange('address')}
                                    className="mt-2 w-full h-11 rounded-xl border border-black/10 px-3 text-sm"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setEditingApplicant(null)}
                                className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-black/60 hover:text-black"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveEdit}
                                disabled={isSaving}
                                className="rounded-full bg-[#0a2f22] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0d3b2b] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};
