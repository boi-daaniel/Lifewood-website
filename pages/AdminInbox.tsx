import React, { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
import {
    Download,
    Inbox as InboxIcon,
    Mail,
    MailOpen,
    RefreshCw,
    Reply,
    Search,
    Trash2
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { exportRecords, type ExportFormat } from '../lib/exportData';
import { supabase } from '../lib/supabaseClient';

type ContactMessage = {
    id: string;
    name: string;
    email: string;
    message: string;
    created_at: string;
    is_read: boolean;
};

const previewMessage = (message: string) =>
    message.replace(/\s+/g, ' ').trim().slice(0, 110) + (message.trim().length > 110 ? '...' : '');

export const AdminInbox: React.FC = () => {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'unread'>('newest');
    const [composeOpen, setComposeOpen] = useState(false);
    const [composeTo, setComposeTo] = useState('');
    const [composeName, setComposeName] = useState('');
    const [composeSubject, setComposeSubject] = useState('');
    const [composeBody, setComposeBody] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [sendStatus, setSendStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
    const [batchAction, setBatchAction] = useState<'read' | 'unread' | 'delete' | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
    const [exportMenuOpen, setExportMenuOpen] = useState(false);

    const loadMessages = async (mode: 'initial' | 'refresh' = 'initial') => {
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
            .from('contact_messages')
            .select('id, name, email, message, created_at, is_read')
            .eq('record_status', 'Active')
            .order('created_at', { ascending: false });

        if (fetchError) {
            setError(fetchError.message);
        } else {
            setError(null);
            setMessages(data ?? []);
        }

        setIsLoading(false);
        setIsRefreshing(false);
    };

    useEffect(() => {
        loadMessages();
    }, []);

    const formatDate = (value: string) =>
        new Date(value).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short'
        });

    const formatRowDate = (value: string) =>
        new Date(value).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
        });

    const handleSetReadState = async (message: ContactMessage, nextValue: boolean) => {
        if (!supabase) return;
        if (message.is_read === nextValue) return;
        setMessages((prev) =>
            prev.map((item) => (item.id === message.id ? { ...item, is_read: nextValue } : item))
        );

        const { error: updateError } = await supabase
            .from('contact_messages')
            .update({ is_read: nextValue })
            .eq('id', message.id);

        if (updateError) {
            setMessages((prev) =>
                prev.map((item) =>
                    item.id === message.id ? { ...item, is_read: message.is_read } : item
                )
            );
            setError(updateError.message);
        }
    };

    const toggleMessageSelection = (id: string) => {
        setSelectedMessageIds((prev) =>
            prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
        );
    };

    const toggleSelectCurrentPage = () => {
        setSelectedMessageIds((prev) => {
            if (allPageSelected) {
                return prev.filter((id) => !pageMessageIds.includes(id));
            }

            return Array.from(new Set([...prev, ...pageMessageIds]));
        });
    };

    const filteredMessages = messages.filter((item) => {
        if (filterStatus === 'unread' && item.is_read) return false;
        if (filterStatus === 'read' && !item.is_read) return false;
        if (!searchTerm.trim()) return true;
        const query = searchTerm.toLowerCase();
        return (
            item.name.toLowerCase().includes(query) ||
            item.email.toLowerCase().includes(query) ||
            item.message.toLowerCase().includes(query)
        );
    });

    const sortedMessages = [...filteredMessages].sort((a, b) => {
        if (sortOrder === 'oldest') {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        if (sortOrder === 'unread') {
            if (a.is_read !== b.is_read) return a.is_read ? 1 : -1;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterStatus, sortOrder]);

    useEffect(() => {
        setExportMenuOpen(false);
    }, [searchTerm, filterStatus, sortOrder, currentPage]);

    useEffect(() => {
        setSelectedMessageIds((prev) => prev.filter((id) => messages.some((item) => item.id === id)));
        if (selectedMessageId && !messages.some((item) => item.id === selectedMessageId)) {
            setSelectedMessageId(null);
        }
    }, [messages, selectedMessageId]);

    useEffect(() => {
        const handleWindowClick = () => setExportMenuOpen(false);
        window.addEventListener('click', handleWindowClick);
        return () => window.removeEventListener('click', handleWindowClick);
    }, []);

    const unreadCount = messages.filter((item) => !item.is_read).length;
    const pageSize = 10;
    const totalPages = Math.max(1, Math.ceil(sortedMessages.length / pageSize));
    const safePage = Math.min(currentPage, totalPages);
    const pagedMessages = sortedMessages.slice((safePage - 1) * pageSize, safePage * pageSize);
    const selectedMessage = messages.find((item) => item.id === selectedMessageId) ?? null;
    const selectedCount = selectedMessageIds.length;
    const selectedIdSet = new Set(selectedMessageIds);
    const pageMessageIds = pagedMessages.map((item) => item.id);
    const allPageSelected = pageMessageIds.length > 0 && pageMessageIds.every((id) => selectedIdSet.has(id));
    const somePageSelected = pageMessageIds.some((id) => selectedIdSet.has(id));

    const openReply = (item: ContactMessage) => {
        setComposeTo(item.email);
        setComposeName(item.name);
        setComposeSubject(`Re: Lifewood contact from ${item.name}`);
        setComposeBody(
            `Hi ${item.name},\n\nThanks for reaching out. We received your message and will follow up shortly.\n\n---\nOriginal message:\n${item.message}`
        );
        setSendStatus(null);
        setComposeOpen(true);
    };

    const handleExportMessages = (format: ExportFormat) => {
        const rows = sortedMessages.map((item) => ({
            id: item.id,
            name: item.name,
            email: item.email,
            message: item.message,
            status: item.is_read ? 'Read' : 'Unread',
            created_at: item.created_at
        }));
        exportRecords('contact-messages', rows, format);
        setExportMenuOpen(false);
    };

    const handleOpenMessage = async (item: ContactMessage) => {
        setSelectedMessageId(item.id);
        if (!item.is_read) {
            await handleSetReadState(item, true);
        }
    };

    const handleSendReply = async () => {
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;

        if (!serviceId || !publicKey || !templateId) {
            setSendStatus({ type: 'error', message: 'EmailJS is not configured yet.' });
            return;
        }

        if (!composeTo.trim() || !composeBody.trim()) {
            setSendStatus({ type: 'error', message: 'Please enter a message before sending.' });
            return;
        }

        setIsSending(true);
        setSendStatus(null);
        try {
            await emailjs.send(
                serviceId,
                templateId,
                {
                    to_email: composeTo,
                    email: composeTo,
                    to_name: composeName || 'there',
                    name: composeName || 'there',
                    subject: composeSubject || 'Re: Lifewood contact',
                    message: composeBody,
                    title: composeBody,
                    from_name: 'Lifewood Admin',
                    email_type: 'reply'
                },
                publicKey
            );
            setSendStatus({ type: 'success', message: 'Reply sent successfully.' });
            setComposeOpen(false);
        } catch (sendError) {
            setSendStatus({
                type: 'error',
                message: sendError instanceof Error ? sendError.message : 'Failed to send reply.'
            });
        } finally {
            setIsSending(false);
        }
    };

    const handleBatchSetReadState = async (ids: string[], nextValue: boolean) => {
        if (!supabase || ids.length === 0) return;

        const previousReadState = new Map(
            messages.filter((item) => ids.includes(item.id)).map((item) => [item.id, item.is_read])
        );

        setBatchAction(nextValue ? 'read' : 'unread');
        setError(null);
        setMessages((prev) =>
            prev.map((item) => (ids.includes(item.id) ? { ...item, is_read: nextValue } : item))
        );

        const { error: updateError } = await supabase
            .from('contact_messages')
            .update({ is_read: nextValue })
            .in('id', ids);

        if (updateError) {
            setMessages((prev) =>
                prev.map((item) =>
                    previousReadState.has(item.id)
                        ? { ...item, is_read: previousReadState.get(item.id) ?? item.is_read }
                        : item
                )
            );
            setError(updateError.message);
        } else {
            setSelectedMessageIds([]);
        }

        setBatchAction(null);
    };

    const handleBatchDelete = async (ids: string[]) => {
        if (!supabase || ids.length === 0) return;

        const confirmed = window.confirm(
            `Mark ${ids.length} selected ${ids.length === 1 ? 'message' : 'messages'} as deleted? They will remain in the database.`
        );
        if (!confirmed) return;

        setBatchAction('delete');
        setError(null);
        const { error: updateError } = await supabase
            .from('contact_messages')
            .update({ record_status: 'Deleted' })
            .in('id', ids);

        if (updateError) {
            setError(updateError.message);
            setBatchAction(null);
            return;
        }

        setMessages((prev) => prev.filter((item) => !ids.includes(item.id)));
        setSelectedMessageIds((prev) => prev.filter((id) => !ids.includes(id)));
        if (selectedMessageId && ids.includes(selectedMessageId)) {
            setSelectedMessageId(null);
        }
        setBatchAction(null);
    };

    return (
        <AdminLayout>
            <div className="min-h-[calc(100vh-7rem)] rounded-[34px] border border-[#dadce0] bg-[#f6f8fc] p-3 text-[#202124] shadow-[0_22px_60px_rgba(15,23,42,0.16)]">
                <div className="flex h-[calc(100vh-8.5rem)] min-h-[680px] flex-col overflow-hidden rounded-[28px] border border-[#e0e3e7] bg-white shadow-[0_10px_30px_rgba(60,64,67,0.08)]">
                    <div className="border-b border-[#edf1f4] px-4 py-4 md:px-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#5f6368]">Inbox</p>
                                <h1 className="mt-2 text-2xl font-semibold text-[#202124] md:text-3xl">Contact Messages</h1>
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#e8f0fe] px-4 py-2 text-xs font-semibold text-[#174ea6]">
                                <InboxIcon size={14} />
                                {unreadCount} unread
                            </div>
                        </div>

                        <div className="mt-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                            <div className="relative flex-1 max-w-3xl">
                                <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5f6368]" />
                                <input
                                    type="search"
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    placeholder="Search mail"
                                    className="h-12 w-full rounded-full border border-transparent bg-[#f1f3f4] pl-11 pr-4 text-sm text-[#202124] outline-none transition focus:border-[#d2e3fc] focus:bg-white focus:shadow-[0_0_0_3px_rgba(26,115,232,0.12)]"
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <select
                                    value={filterStatus}
                                    onChange={(event) => setFilterStatus(event.target.value as typeof filterStatus)}
                                    className="h-11 rounded-full border border-[#dadce0] bg-white px-4 text-sm text-[#202124] outline-none transition hover:border-[#c7cacf] focus:border-[#1a73e8]"
                                >
                                    <option value="all">All mail</option>
                                    <option value="unread">Unread</option>
                                    <option value="read">Read</option>
                                </select>
                                <select
                                    value={sortOrder}
                                    onChange={(event) => setSortOrder(event.target.value as typeof sortOrder)}
                                    className="h-11 rounded-full border border-[#dadce0] bg-white px-4 text-sm text-[#202124] outline-none transition hover:border-[#c7cacf] focus:border-[#1a73e8]"
                                >
                                    <option value="newest">Newest</option>
                                    <option value="oldest">Oldest</option>
                                    <option value="unread">Unread first</option>
                                </select>
                                <button
                                    type="button"
                                    onClick={() => loadMessages('refresh')}
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
                                        disabled={sortedMessages.length === 0 || isLoading}
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
                                                onClick={() => handleExportMessages('csv')}
                                                className="w-full rounded-xl px-3 py-2 text-left text-xs font-semibold text-[#3c4043] transition hover:bg-[#f1f3f4]"
                                            >
                                                Export CSV
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleExportMessages('json')}
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
                    {!isLoading && !error && sortedMessages.length > 0 && (
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
                                <span className="text-xs text-[#5f6368]">{selectedCount > 0 ? `${selectedCount} selected` : `${sortedMessages.length} messages`}</span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleBatchSetReadState(selectedMessageIds, true)}
                                    disabled={selectedCount === 0 || batchAction !== null}
                                    className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-[#3c4043] transition hover:bg-[#f1f3f4] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <MailOpen size={16} />
                                    {batchAction === 'read' ? 'Marking...' : 'Read'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleBatchSetReadState(selectedMessageIds, false)}
                                    disabled={selectedCount === 0 || batchAction !== null}
                                    className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-[#3c4043] transition hover:bg-[#f1f3f4] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Mail size={16} />
                                    {batchAction === 'unread' ? 'Marking...' : 'Unread'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleBatchDelete(selectedMessageIds)}
                                    disabled={selectedCount === 0 || batchAction !== null}
                                    className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-[#b3261e] transition hover:bg-[#fce8e6] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Trash2 size={16} />
                                    {batchAction === 'delete' ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    )}

                    {isLoading && (
                        <div className="px-6 py-16 text-center text-sm text-[#5f6368]">Loading messages...</div>
                    )}

                    {!isLoading && error && (
                        <div className="px-6 py-16 text-center text-sm text-red-600">{error}</div>
                    )}

                    {!isLoading && !error && messages.length === 0 && (
                        <div className="px-6 py-16 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f1f3f4] text-[#5f6368]">
                                <InboxIcon size={28} />
                            </div>
                            <p className="mt-4 text-base font-semibold text-[#202124]">No messages yet</p>
                            <p className="mt-1 text-sm text-[#5f6368]">
                                New contact form submissions will appear here.
                            </p>
                        </div>
                    )}

                    {!isLoading && !error && sortedMessages.length > 0 && (
                        <div className="flex-1 overflow-y-auto divide-y divide-[#edf1f4]">
                            {pagedMessages.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleOpenMessage(item)}
                                    className={`grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 text-left transition md:px-6 ${
                                        selectedMessage?.id === item.id
                                            ? 'bg-[#e8f0fe]'
                                            : item.is_read
                                              ? 'bg-white hover:bg-[#f8f9fa]'
                                              : 'bg-[#f2f6fc] hover:bg-[#eef3fd]'
                                    }`}
                                >
                                    <div className="flex items-center gap-3" onClick={(event) => event.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={selectedIdSet.has(item.id)}
                                            onChange={() => toggleMessageSelection(item.id)}
                                            className="h-4 w-4 rounded border border-[#c4c7c5] text-[#1a73e8] focus:ring-[#1a73e8]"
                                            aria-label={`Select message from ${item.name}`}
                                        />
                                        <div className={`h-2.5 w-2.5 rounded-full ${item.is_read ? 'bg-transparent' : 'bg-[#1a73e8]'}`} />
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 md:grid md:grid-cols-[180px_minmax(0,1fr)] md:gap-4">
                                            <p className={`truncate text-sm ${item.is_read ? 'font-medium text-[#3c4043]' : 'font-semibold text-[#202124]'}`}>
                                                {item.name}
                                            </p>
                                            <div className="min-w-0 text-sm text-[#5f6368]">
                                                <span className="font-medium text-[#3c4043]">{item.email}</span>
                                                <span className="mx-2 hidden md:inline">-</span>
                                                <span>{previewMessage(item.message)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right text-xs font-medium text-[#5f6368]">
                                        {formatRowDate(item.created_at)}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {!isLoading && !error && sortedMessages.length > 0 && totalPages > 1 && (
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf1f4] px-4 py-3 text-xs text-[#5f6368] md:px-6">
                            <span>Page {safePage} of {totalPages}</span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    disabled={safePage === 1}
                                    className="rounded-full px-3 py-1.5 font-semibold transition hover:bg-[#f1f3f4] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={safePage === totalPages}
                                    className="rounded-full px-3 py-1.5 font-semibold transition hover:bg-[#f1f3f4] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {!isLoading && !error && messages.length > 0 && sortedMessages.length === 0 && (
                        <div className="px-6 py-16 text-center text-sm text-[#5f6368]">
                            No messages match your current search or filters.
                        </div>
                    )}
                    </div>
                </div>
            </div>

            {composeOpen && (
                <div
                    className="fixed inset-0 z-[200] flex items-end justify-center bg-black/45 px-4 pb-6 sm:items-center sm:pb-0"
                    onClick={() => setComposeOpen(false)}
                >
                    <div
                        className="w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.35)] pointer-events-auto"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="border-b border-[#edf1f4] bg-[#f8f9fa] px-6 py-4">
                            <p className="text-sm font-semibold text-[#202124]">Reply to {composeName}</p>
                        </div>
                        <div className="px-6 py-5">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f6368]">To</label>
                                    <input
                                        value={composeTo}
                                        readOnly
                                        className="mt-2 h-11 w-full rounded-2xl border border-[#dadce0] bg-white px-3 text-sm text-[#202124]"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f6368]">Subject</label>
                                    <input
                                        value={composeSubject}
                                        onChange={(event) => setComposeSubject(event.target.value)}
                                        autoFocus
                                        className="mt-2 h-11 w-full rounded-2xl border border-[#dadce0] bg-white px-3 text-sm text-[#202124] outline-none focus:border-[#1a73e8]"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f6368]">Message</label>
                                    <textarea
                                        value={composeBody}
                                        onChange={(event) => setComposeBody(event.target.value)}
                                        rows={7}
                                        className="mt-2 w-full rounded-2xl border border-[#dadce0] bg-white px-3 py-3 text-sm text-[#202124] outline-none focus:border-[#1a73e8]"
                                    />
                                </div>
                            </div>

                            {sendStatus && (
                                <div
                                    className={`mt-4 rounded-2xl border px-3 py-2 text-xs ${
                                        sendStatus.type === 'success'
                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                            : 'border-red-200 bg-red-50 text-red-600'
                                    }`}
                                >
                                    {sendStatus.message}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-end gap-3 border-t border-[#edf1f4] px-6 py-4">
                            <button
                                type="button"
                                onClick={() => setComposeOpen(false)}
                                className="rounded-full px-4 py-2 text-sm font-medium text-[#5f6368] transition hover:bg-[#f1f3f4] hover:text-[#202124]"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSendReply}
                                disabled={isSending}
                                className="rounded-full bg-[#1a73e8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1765cc] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isSending ? 'Sending...' : 'Send Reply'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedMessage && (
                <div
                    className="fixed inset-0 z-[210] flex items-end justify-center bg-black/45 px-4 pb-6 sm:items-center sm:pb-0"
                    onClick={() => setSelectedMessageId(null)}
                >
                    <div
                        className="w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="border-b border-[#edf1f4] px-6 py-4">
                            <p className="text-xs uppercase tracking-[0.22em] text-[#5f6368]">Message</p>
                            <h2 className="mt-2 text-lg font-semibold text-[#202124]">{selectedMessage.name}</h2>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#5f6368]">
                                <span>{selectedMessage.email}</span>
                                <span>|</span>
                                <span>{formatDate(selectedMessage.created_at)}</span>
                                <span
                                    className={`inline-flex items-center rounded-full px-2 py-0.5 font-semibold ${
                                        selectedMessage.is_read
                                            ? 'bg-[#f1f3f4] text-[#5f6368]'
                                            : 'bg-[#e8f0fe] text-[#174ea6]'
                                    }`}
                                >
                                    {selectedMessage.is_read ? 'Read' : 'Unread'}
                                </span>
                            </div>
                        </div>
                        <div className="px-6 py-5">
                            <div className="rounded-2xl border border-[#edf1f4] bg-[#fbfcff] px-4 py-4 text-sm text-[#202124] whitespace-pre-wrap">
                                {selectedMessage.message}
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 border-t border-[#edf1f4] px-6 py-4">
                            <button
                                type="button"
                                onClick={() => {
                                    openReply(selectedMessage);
                                    setSelectedMessageId(null);
                                }}
                                className="rounded-full bg-[#1a73e8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1765cc]"
                            >
                                Reply
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedMessageId(null)}
                                className="rounded-full px-4 py-2 text-sm font-medium text-[#5f6368] transition hover:bg-[#f1f3f4] hover:text-[#202124]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};
