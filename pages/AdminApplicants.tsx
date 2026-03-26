import React, { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Download, MoreHorizontal, RefreshCw, Search, Users } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { exportRecords, type ExportFormat } from '../lib/exportData';
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
    status: string | null;
    resume_path: string;
    created_at: string;
};

const applicantStatuses = ['New', 'Reviewing', 'Interview', 'Accepted', 'Rejected'] as const;
const applicantMenuButtonClass =
    'relative flex h-9 w-9 items-center justify-center rounded-full border border-[#dadce0] bg-white text-transparent transition hover:border-[#c7cacf] hover:bg-[#f8f9fa]';
const applicantMenuPanelClass =
    'absolute right-0 top-11 z-10 w-52 rounded-2xl border border-[#dadce0] bg-white p-2 shadow-[0_20px_40px_rgba(15,23,42,0.14)]';
const applicantMenuItemClass =
    'w-full rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-[#3c4043] transition hover:bg-[#f1f3f4] hover:text-[#202124]';

const statusClasses: Record<string, string> = {
    New: 'border-sky-200 bg-sky-50 text-sky-700',
    Reviewing: 'border-amber-200 bg-amber-50 text-amber-700',
    Interview: 'border-violet-200 bg-violet-50 text-violet-700',
    Accepted: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    Rejected: 'border-rose-200 bg-rose-50 text-rose-700'
};

const terminalStatuses = new Set(['Accepted', 'Rejected']);
type ApplicantStatus = (typeof applicantStatuses)[number];
const normalizeApplicantStatus = (status: string | null): ApplicantStatus =>
    applicantStatuses.includes(status as ApplicantStatus) ? (status as ApplicantStatus) : 'New';

const applicantPreview = (applicant: Applicant) => {
    const parts = [applicant.position, applicant.country ?? '', applicant.contact_number ?? ''].filter(Boolean);
    return parts.join(' • ');
};

export const AdminApplicants: React.FC = () => {
    const [applications, setApplications] = useState<Applicant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [viewingId, setViewingId] = useState<string | null>(null);
    const [statusUpdateAction, setStatusUpdateAction] = useState<{
        ids: string[];
        status: ApplicantStatus;
    } | null>(null);
    const [deletingIds, setDeletingIds] = useState<string[]>([]);
    const [selectedApplicantIds, setSelectedApplicantIds] = useState<string[]>([]);
    const [batchMenuOpen, setBatchMenuOpen] = useState(false);
    const [exportMenuOpen, setExportMenuOpen] = useState(false);
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const [viewApplicant, setViewApplicant] = useState<Applicant | null>(null);
    const [viewApplicantStatus, setViewApplicantStatus] = useState<ApplicantStatus>('New');
    const [resumePreview, setResumePreview] = useState<{ applicant: Applicant; url: string } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const loadApplicants = async (mode: 'initial' | 'refresh' = 'initial') => {
        if (!supabase) {
            setError('Supabase is not configured.');
            setIsLoading(false);
            setIsRefreshing(false);
            return;
        }

        if (mode === 'initial') {
            setIsLoading(true);
        } else {
            setIsRefreshing(true);
        }

        const { data, error: fetchError } = await supabase
            .from('career_applications')
            .select(
                'id, name, email, contact_number, gender, age, address, country, position, status, resume_path, created_at'
            )
            .eq('record_status', 'Active')
            .order('created_at', { ascending: false });

        if (fetchError) {
            setError(fetchError.message);
        } else {
            setError(null);
            setApplications(data ?? []);
        }

        setIsLoading(false);
        setIsRefreshing(false);
    };

    useEffect(() => {
        loadApplicants();
    }, []);

    const formatDate = (value: string) =>
        new Date(value).toLocaleString(undefined, {
            dateStyle: 'medium',
        timeStyle: 'short'
    });

    const filtered = applications.filter((item) => {
        const matchesStatus = statusFilter === 'All' || (item.status ?? 'New') === statusFilter;
        if (!matchesStatus) return false;
        if (!searchTerm.trim()) return true;
        const query = searchTerm.toLowerCase();
        return (
            item.name.toLowerCase().includes(query) ||
            item.email.toLowerCase().includes(query) ||
            item.position.toLowerCase().includes(query) ||
            (item.country ?? '').toLowerCase().includes(query) ||
            (item.status ?? '').toLowerCase().includes(query)
        );
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const safePage = Math.min(currentPage, totalPages);
    const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
    const selectedCount = selectedApplicantIds.length;
    const selectedApplicantIdSet = new Set(selectedApplicantIds);
    const pageApplicantIds = paginated.map((item) => item.id);
    const allPageSelected =
        pageApplicantIds.length > 0 && pageApplicantIds.every((id) => selectedApplicantIdSet.has(id));
    const somePageSelected = pageApplicantIds.some((id) => selectedApplicantIdSet.has(id));

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    useEffect(() => {
        setSelectedApplicantIds((prev) => prev.filter((id) => applications.some((item) => item.id === id)));
    }, [applications]);

    useEffect(() => {
        setMenuOpenId(null);
        setBatchMenuOpen(false);
        setExportMenuOpen(false);
    }, [searchTerm, statusFilter, currentPage]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    useEffect(() => {
        if (!viewApplicant) return;
        setViewApplicantStatus(normalizeApplicantStatus(viewApplicant.status));
    }, [viewApplicant]);

    useEffect(() => {
        const handleWindowClick = () => {
            setMenuOpenId(null);
            setBatchMenuOpen(false);
            setExportMenuOpen(false);
        };
        window.addEventListener('click', handleWindowClick);
        return () => window.removeEventListener('click', handleWindowClick);
    }, []);

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

        setResumePreview({ applicant: application, url: data.signedUrl });
        setViewingId(null);
    };

    const toggleApplicantSelection = (id: string) => {
        setSelectedApplicantIds((prev) =>
            prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
        );
    };

    const toggleSelectCurrentPage = () => {
        setSelectedApplicantIds((prev) => {
            if (allPageSelected) {
                return prev.filter((id) => !pageApplicantIds.includes(id));
            }

            return Array.from(new Set([...prev, ...pageApplicantIds]));
        });
    };

    const syncApplicantStatus = (applicationId: string, nextStatus: string) => {
        setApplications((prev) =>
            prev.map((item) => (item.id === applicationId ? { ...item, status: nextStatus } : item))
        );
        setViewApplicant((prev) => (prev?.id === applicationId ? { ...prev, status: nextStatus } : prev));
    };

    const sendDecisionEmail = async (
        payload: Pick<Applicant, 'name' | 'email' | 'position'>,
        previousStatus: string,
        nextStatus: string
    ) => {
        if (previousStatus === nextStatus || !terminalStatuses.has(nextStatus)) return;

        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;

        if (!serviceId || !publicKey || !templateId) {
            setError(
                'Applicant status was updated, but EmailJS is not fully configured so no notification email was sent.'
            );
            return;
        }

        const decisionMessage =
            nextStatus === 'Accepted'
                ? `Hi ${payload.name},\n\nThank you for applying for the ${payload.position} role at Lifewood. We are pleased to let you know that your application has been accepted. Our team will contact you soon with the next steps.\n\nBest regards,\nLifewood`
                : `Hi ${payload.name},\n\nThank you for applying for the ${payload.position} role at Lifewood. After reviewing your application, we regret to inform you that you were not selected for this opportunity.\n\nWe appreciate your time and interest in Lifewood, and we encourage you to apply again for future openings that match your experience.\n\nBest regards,\nLifewood`;

        try {
            await emailjs.send(
                serviceId,
                templateId,
                {
                    to_email: payload.email,
                    to_name: payload.name,
                    subject: `Lifewood Application Update: ${nextStatus}`,
                    message: decisionMessage,
                    applicant_name: payload.name,
                    applicant_email: payload.email,
                    position: payload.position,
                    application_status: nextStatus,
                    from_name: 'Lifewood',
                    email_type: nextStatus === 'Accepted' ? 'application_accepted' : 'application_rejected'
                },
                publicKey
            );
        } catch (sendError) {
            setError(
                `Applicant status was updated, but the email notification could not be sent: ${
                    sendError instanceof Error ? sendError.message : 'Unknown error'
                }`
            );
        }
    };

    const handleBatchStatusUpdate = async (ids: string[], nextStatus: ApplicantStatus) => {
        if (!supabase || ids.length === 0) return;

        const targetApplications = applications.filter((item) => ids.includes(item.id));
        const applicationsToUpdate = targetApplications.filter((item) => (item.status ?? 'New') !== nextStatus);
        if (applicationsToUpdate.length === 0) return;

        const idsToUpdate = applicationsToUpdate.map((item) => item.id);
        setStatusUpdateAction({ ids: idsToUpdate, status: nextStatus });
        setError(null);

        const { error: updateError } = await supabase
            .from('career_applications')
            .update({ status: nextStatus })
            .in('id', idsToUpdate);

        if (updateError) {
            setError(updateError.message);
            setStatusUpdateAction(null);
            return;
        }

        applicationsToUpdate.forEach((item) => {
            syncApplicantStatus(item.id, nextStatus);
        });

        for (const application of applicationsToUpdate) {
            await sendDecisionEmail(application, application.status ?? 'New', nextStatus);
        }

        setSelectedApplicantIds([]);
        setBatchMenuOpen(false);
        setStatusUpdateAction(null);
    };

    const handleQuickStatusUpdate = async (
        application: Applicant,
        nextStatus: 'Accepted' | 'Rejected'
    ) => {
        await handleBatchStatusUpdate([application.id], nextStatus);
    };

    const handleBatchDelete = async (ids: string[]) => {
        if (!supabase || ids.length === 0) return;

        const confirmed = window.confirm(
            `Mark ${ids.length} selected ${ids.length === 1 ? 'application' : 'applications'} as deleted? It will remain in the database.`
        );
        if (!confirmed) return;

        setDeletingIds(ids);
        setError(null);
        const { error: updateError } = await supabase
            .from('career_applications')
            .update({ record_status: 'Deleted' })
            .in('id', ids);

        if (updateError) {
            setError(updateError.message);
            setDeletingIds([]);
            return;
        }

        setApplications((prev) => prev.filter((item) => !ids.includes(item.id)));
        if (viewApplicant && ids.includes(viewApplicant.id)) {
            setViewApplicant(null);
        }
        if (resumePreview && ids.includes(resumePreview.applicant.id)) {
            setResumePreview(null);
        }
        setSelectedApplicantIds((prev) => prev.filter((id) => !ids.includes(id)));
        setBatchMenuOpen(false);
        setDeletingIds([]);
    };

    const handleDelete = async (application: Applicant) => {
        await handleBatchDelete([application.id]);
    };

    const getStatusClasses = (status: string | null) => statusClasses[status ?? 'New'] ?? 'border-black/10 bg-black/5 text-black/70';

    const handleExportApplicants = (format: ExportFormat) => {
        const rows = filtered.map((item) => ({
            id: item.id,
            name: item.name,
            email: item.email,
            contact_number: item.contact_number,
            gender: item.gender,
            age: item.age,
            address: item.address,
            country: item.country,
            position: item.position,
            status: normalizeApplicantStatus(item.status),
            resume_path: item.resume_path,
            created_at: item.created_at
        }));
        exportRecords('career-applications', rows, format);
        setExportMenuOpen(false);
    };

    return (
        <AdminLayout>
            <div className="min-h-[calc(100vh-7rem)] rounded-[34px] border border-[#dadce0] bg-[#f6f8fc] p-3 text-[#202124] shadow-[0_22px_60px_rgba(15,23,42,0.16)]">
                <div className="flex h-[calc(100vh-8.5rem)] min-h-[680px] flex-col overflow-hidden rounded-[28px] border border-[#e0e3e7] bg-white shadow-[0_10px_30px_rgba(60,64,67,0.08)]">
                    <div className="border-b border-[#edf1f4] px-4 py-4 md:px-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#5f6368]">Applicants</p>
                                <h1 className="mt-2 text-2xl font-semibold text-[#202124] md:text-3xl">Career Applications</h1>
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#e8f0fe] px-4 py-2 text-xs font-semibold text-[#174ea6]">
                                <Users size={14} />
                                {applications.length} total
                            </div>
                        </div>

                        <div className="mt-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                            <div className="relative flex-1 max-w-3xl">
                                <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5f6368]" />
                                <input
                                    type="search"
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    placeholder="Search applicants"
                                    className="h-12 w-full rounded-full border border-transparent bg-[#f1f3f4] pl-11 pr-4 text-sm text-[#202124] outline-none transition focus:border-[#d2e3fc] focus:bg-white focus:shadow-[0_0_0_3px_rgba(26,115,232,0.12)]"
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <select
                                    value={statusFilter}
                                    onChange={(event) => setStatusFilter(event.target.value)}
                                    className="h-11 rounded-full border border-[#dadce0] bg-white px-4 text-sm text-[#202124] outline-none transition hover:border-[#c7cacf] focus:border-[#1a73e8]"
                                >
                                    <option value="All">All statuses</option>
                                    {applicantStatuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => loadApplicants('refresh')}
                                    disabled={isRefreshing || isLoading}
                                    className="inline-flex h-11 items-center gap-2 rounded-full border border-[#dadce0] bg-white px-4 text-sm font-medium text-[#3c4043] transition hover:bg-[#f8f9fa] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                                    Refresh
                                </button>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setExportMenuOpen((prev) => !prev);
                                        }}
                                        disabled={filtered.length === 0 || isLoading}
                                        className="inline-flex h-11 items-center gap-2 rounded-full border border-[#dadce0] bg-white px-4 text-sm font-medium text-[#3c4043] transition hover:bg-[#f8f9fa] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Download size={16} />
                                        Export
                                    </button>
                                    {exportMenuOpen && (
                                        <div
                                            onClick={(event) => event.stopPropagation()}
                                            className="absolute right-0 top-12 z-10 w-40 rounded-2xl border border-[#dadce0] bg-white p-2 shadow-[0_20px_40px_rgba(0,0,0,0.16)]"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => handleExportApplicants('csv')}
                                                className="w-full rounded-xl px-3 py-2 text-left text-xs font-semibold text-[#3c4043] transition hover:bg-[#f1f3f4]"
                                            >
                                                Export CSV
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleExportApplicants('json')}
                                                className="w-full rounded-xl px-3 py-2 text-left text-xs font-semibold text-[#3c4043] transition hover:bg-[#f1f3f4]"
                                            >
                                                Export JSON
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex min-h-0 flex-1 flex-col">

                    {!isLoading && !error && paginated.length > 0 && (
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf1f4] px-4 py-3 md:px-6">
                            <div className="flex flex-wrap items-center gap-3">
                                <label className="flex items-center gap-3 text-sm font-medium text-[#3c4043]">
                                    <input
                                        type="checkbox"
                                        checked={allPageSelected}
                                        ref={(input) => {
                                            if (input) {
                                                input.indeterminate = !allPageSelected && somePageSelected;
                                            }
                                        }}
                                        onChange={toggleSelectCurrentPage}
                                        className="h-4 w-4 rounded border border-[#c4c7c5] text-[#1a73e8] focus:ring-[#1a73e8]"
                                    />
                                    Select this page
                                </label>
                                <span className="text-xs text-[#5f6368]">
                                    {selectedCount > 0
                                        ? `${selectedCount} selected`
                                        : `${filtered.length} applicants`}
                                </span>
                            </div>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setBatchMenuOpen((prev) => !prev);
                                    }}
                                    disabled={selectedCount === 0 || statusUpdateAction !== null || deletingIds.length > 0}
                                    className={`${applicantMenuButtonClass} disabled:cursor-not-allowed disabled:opacity-50`}
                                    aria-haspopup="menu"
                                    aria-expanded={batchMenuOpen}
                                    aria-label="Batch applicant actions"
                                >
                                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[#5f6368]">
                                        <MoreHorizontal size={16} />
                                    </span>
                                    ...
                                </button>

                                {batchMenuOpen && (
                                    <div
                                        onClick={(event) => event.stopPropagation()}
                                        className={applicantMenuPanelClass}
                                        role="menu"
                                    >
                                        {applicantStatuses.map((status) => (
                                            <button
                                                key={status}
                                                type="button"
                                                onClick={() => handleBatchStatusUpdate(selectedApplicantIds, status)}
                                                className={applicantMenuItemClass}
                                                role="menuitem"
                                            >
                                                {statusUpdateAction?.status === status ? 'Saving...' : `Mark as ${status}`}
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => handleBatchDelete(selectedApplicantIds)}
                                            className="w-full rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-[#b3261e] transition hover:bg-[#fce8e6] hover:text-[#b3261e]"
                                            role="menuitem"
                                        >
                                            {deletingIds.length > 0 ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {isLoading && (
                        <div className="px-6 py-16 text-center text-sm text-[#5f6368]">Loading applications...</div>
                    )}

                    {!isLoading && error && (
                        <div className="px-6 py-16 text-center text-sm text-red-600">{error}</div>
                    )}

                    {!isLoading && !error && applications.length === 0 && (
                        <div className="px-6 py-16 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f1f3f4] text-[#5f6368]">
                                <Users size={28} />
                            </div>
                            <p className="mt-4 text-base font-semibold text-[#202124]">No applications yet</p>
                            <p className="mt-1 text-sm text-[#5f6368]">New submissions will appear here.</p>
                        </div>
                    )}

                    {!isLoading && !error && paginated.length > 0 && (
                        <div className="flex-1 overflow-y-auto divide-y divide-[#edf1f4]">
                            {paginated.map((item) => (
                                <div key={item.id} className={`px-4 py-3 transition md:px-6 ${selectedApplicantIdSet.has(item.id) ? 'bg-[#eef3fd]' : item.status === 'New' ? 'bg-[#fbfcff]' : 'bg-white hover:bg-[#f8f9fa]'}`}>
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div className="flex min-w-0 flex-1 items-start gap-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedApplicantIdSet.has(item.id)}
                                                onChange={() => toggleApplicantSelection(item.id)}
                                                className="mt-1 h-4 w-4 rounded border border-[#c4c7c5] text-[#1a73e8] focus:ring-[#1a73e8]"
                                                aria-label={`Select applicant ${item.name}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setViewApplicant(item)}
                                                className="min-w-0 flex-1 text-left"
                                            >
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="truncate text-sm font-semibold text-[#202124]">{item.name}</p>
                                                    <span
                                                        className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${getStatusClasses(item.status)}`}
                                                    >
                                                        {item.status ?? 'New'}
                                                    </span>
                                                </div>
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleQuickStatusUpdate(item, 'Accepted')}
                                                disabled={
                                                    statusUpdateAction !== null ||
                                                    deletingIds.length > 0 ||
                                                    item.status === 'Accepted'
                                                }
                                                className="rounded-full bg-emerald-600 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {statusUpdateAction?.ids.includes(item.id) && statusUpdateAction.status === 'Accepted'
                                                    ? 'Saving...'
                                                    : 'Accept'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleQuickStatusUpdate(item, 'Rejected')}
                                                disabled={
                                                    statusUpdateAction !== null ||
                                                    deletingIds.length > 0 ||
                                                    item.status === 'Rejected'
                                                }
                                                className="rounded-full bg-rose-600 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {statusUpdateAction?.ids.includes(item.id) && statusUpdateAction.status === 'Rejected'
                                                    ? 'Saving...'
                                                    : 'Reject'}
                                            </button>
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        setMenuOpenId((prev) => (prev === item.id ? null : item.id))
                                                    }}
                                                    className={applicantMenuButtonClass}
                                                    aria-haspopup="menu"
                                                    aria-expanded={menuOpenId === item.id}
                                                    aria-label="Applicant actions"
                                                >
                                                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[#5f6368]">
                                                        <MoreHorizontal size={16} />
                                                    </span>
                                                    ...
                                                </button>
                                                {menuOpenId === item.id && (
                                                    <div
                                                        onClick={(event) => event.stopPropagation()}
                                                        className={applicantMenuPanelClass}
                                                        role="menu"
                                                    >
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            handleDownload(item);
                                                            setMenuOpenId(null);
                                                        }}
                                                        disabled={downloadingId === item.id}
                                                        className={`${applicantMenuItemClass} disabled:cursor-not-allowed disabled:opacity-60`}
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
                                                        className={`${applicantMenuItemClass} disabled:cursor-not-allowed disabled:opacity-60`}
                                                        role="menuitem"
                                                    >
                                                        {viewingId === item.id ? 'Opening...' : 'View Resume'}
                                                    </button>
                                                    <a
                                                        href={`mailto:${item.email}?subject=${encodeURIComponent(
                                                            `Lifewood Application: ${item.position}`
                                                        )}`}
                                                        onClick={() => setMenuOpenId(null)}
                                                        className={`block ${applicantMenuItemClass}`}
                                                        role="menuitem"
                                                    >
                                                        Reply
                                                    </a>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            handleDelete(item);
                                                            setMenuOpenId(null);
                                                        }}
                                                        disabled={deletingIds.length > 0 || statusUpdateAction !== null}
                                                        className="w-full rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-[#b3261e] transition hover:bg-[#fce8e6] hover:text-[#b3261e] disabled:cursor-not-allowed disabled:opacity-60"
                                                        role="menuitem"
                                                        >
                                                            {deletingIds.includes(item.id) ? 'Deleting...' : 'Delete'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!isLoading && !error && applications.length > 0 && filtered.length === 0 && (
                        <div className="px-6 py-16 text-center text-sm text-[#5f6368]">
                            No applicants match your search.
                        </div>
                    )}

                    {!isLoading && !error && filtered.length > 0 && totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-[#edf1f4] px-4 py-3 text-xs text-[#5f6368] md:px-6">
                            <span>Page {safePage} of {totalPages}</span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    disabled={safePage === 1}
                                    className="rounded-full px-3 py-1.5 font-semibold transition hover:bg-[#f1f3f4] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Prev
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={safePage === totalPages}
                                    className="rounded-full px-3 py-1.5 font-semibold transition hover:bg-[#f1f3f4] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                    </div>
                </div>
            </div>

            {viewApplicant && (
                <div className="fixed inset-0 z-[190] flex items-center justify-center bg-black/60 px-4">
                    <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-black/50">Applicant</p>
                                <h2 className="mt-1 text-xl font-semibold text-black">{viewApplicant.name}</h2>
                                <p className="mt-2 text-xs text-black/50">Review the application details and update the status here when needed.</p>
                            </div>
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                            <div className="rounded-2xl border border-black/10 bg-black/[0.03] px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">Email</p>
                                <p className="mt-2 text-sm text-black">{viewApplicant.email}</p>
                            </div>
                            <div className="rounded-2xl border border-black/10 bg-black/[0.03] px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">Contact</p>
                                <p className="mt-2 text-sm text-black">{viewApplicant.contact_number ?? 'Not provided'}</p>
                            </div>
                            <div className="rounded-2xl border border-black/10 bg-black/[0.03] px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">Status</p>
                                <div className="mt-2 flex flex-col gap-3">
                                    <span className={`inline-flex w-fit rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${getStatusClasses(viewApplicant.status)}`}>
                                        {normalizeApplicantStatus(viewApplicant.status)}
                                    </span>
                                    <select
                                        value={viewApplicantStatus}
                                        onChange={(event) => setViewApplicantStatus(event.target.value as ApplicantStatus)}
                                        disabled={statusUpdateAction?.ids.includes(viewApplicant.id) || deletingIds.length > 0}
                                        className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm text-black outline-none transition focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/15 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {applicantStatuses.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => handleBatchStatusUpdate([viewApplicant.id], viewApplicantStatus)}
                                        disabled={
                                            statusUpdateAction?.ids.includes(viewApplicant.id) ||
                                            deletingIds.length > 0 ||
                                            viewApplicantStatus === normalizeApplicantStatus(viewApplicant.status)
                                        }
                                        className="w-fit rounded-full bg-[#1a73e8] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1558b0] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {statusUpdateAction?.ids.includes(viewApplicant.id) ? 'Saving...' : 'Save status'}
                                    </button>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-black/10 bg-black/[0.03] px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">Position</p>
                                <p className="mt-2 text-sm text-black">{viewApplicant.position}</p>
                            </div>
                            <div className="rounded-2xl border border-black/10 bg-black/[0.03] px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">Country</p>
                                <p className="mt-2 text-sm text-black">{viewApplicant.country ?? 'Not provided'}</p>
                            </div>
                            <div className="rounded-2xl border border-black/10 bg-black/[0.03] px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">Gender</p>
                                <p className="mt-2 text-sm text-black">{viewApplicant.gender ?? 'Not provided'}</p>
                            </div>
                            <div className="rounded-2xl border border-black/10 bg-black/[0.03] px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">Age</p>
                                <p className="mt-2 text-sm text-black">{viewApplicant.age ?? 'Not provided'}</p>
                            </div>
                            <div className="rounded-2xl border border-black/10 bg-black/[0.03] px-4 py-3 md:col-span-2">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">Address</p>
                                <p className="mt-2 text-sm text-black">{viewApplicant.address ?? 'Not provided'}</p>
                            </div>
                            <div className="rounded-2xl border border-black/10 bg-black/[0.03] px-4 py-3 md:col-span-2">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">Submitted</p>
                                <p className="mt-2 text-sm text-black">{formatDate(viewApplicant.created_at)}</p>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setViewApplicant(null)}
                                className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-black/60 hover:text-black"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {resumePreview && (
                <div className="fixed inset-0 z-[195] flex items-center justify-center bg-black/70 px-4 py-6">
                    <div className="flex h-full max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-black/50">Resume Preview</p>
                                <h2 className="mt-1 text-lg font-semibold text-black">{resumePreview.applicant.name}</h2>
                            </div>
                        </div>
                        <div className="flex-1 bg-black/[0.03] p-4">
                            <iframe
                                src={resumePreview.url}
                                title={`Resume preview for ${resumePreview.applicant.name}`}
                                className="h-full min-h-[60vh] w-full rounded-2xl border border-black/10 bg-white"
                            />
                        </div>
                        <div className="flex items-center justify-between border-t border-black/10 px-6 py-4">
                            <a
                                href={resumePreview.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-semibold text-black/60 hover:text-black"
                            >
                                Open in new tab
                            </a>
                            <button
                                type="button"
                                onClick={() => setResumePreview(null)}
                                className="rounded-full bg-[#0a2f22] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0d3b2b]"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};
