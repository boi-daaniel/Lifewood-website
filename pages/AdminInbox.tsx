import React, { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
import { AdminLayout } from '../components/AdminLayout';
import { supabase } from '../lib/supabaseClient';

type ContactMessage = {
    id: string;
    name: string;
    email: string;
    message: string;
    created_at: string;
    is_read: boolean;
};

export const AdminInbox: React.FC = () => {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
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
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
    const [batchAction, setBatchAction] = useState<'read' | 'unread' | 'delete' | null>(null);
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const loadMessages = async () => {
            if (!supabase) {
                if (mounted) {
                    setError('Supabase is not configured.');
                    setIsLoading(false);
                }
                return;
            }

            const { data, error: fetchError } = await supabase
                .from('contact_messages')
                .select('id, name, email, message, created_at, is_read')
                .eq('record_status', 'Active')
                .order('created_at', { ascending: false });

            if (!mounted) return;

            if (fetchError) {
                setError(fetchError.message);
            } else {
                setMessages(data ?? []);
            }
            setIsLoading(false);
        };

        loadMessages();
        return () => {
            mounted = false;
        };
    }, []);

    const formatDate = (value: string) =>
        new Date(value).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short'
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

    const handleToggleRead = async (message: ContactMessage) => {
        await handleSetReadState(message, !message.is_read);
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
        setSelectedMessageIds((prev) => prev.filter((id) => messages.some((item) => item.id === id)));
    }, [messages]);

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

    const handleDelete = async (message: ContactMessage) => {
        setDeletingId(message.id);
        try {
            await handleBatchDelete([message.id]);
        } finally {
            setDeletingId(null);
        }
    };

    const toggleMenu = (id: string) => {
        setMenuOpenId((prev) => (prev === id ? null : id));
    };

    return (
        <AdminLayout>
            <div className="rounded-[30px] border border-white/10 bg-white/90 px-7 py-6 text-black shadow-[0_25px_60px_rgba(0,0,0,0.35)] backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-black/50">Inbox</p>
                        <h1 className="mt-2 text-3xl font-semibold">Contact Messages</h1>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-black/70 shadow-sm">
                        {unreadCount} unread
                    </div>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-[1.2fr,0.7fr,0.7fr]">
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search name, email, or message..."
                        className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-black outline-none focus:border-black/30"
                    />
                    <select
                        value={filterStatus}
                        onChange={(event) => setFilterStatus(event.target.value as typeof filterStatus)}
                        className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-black outline-none focus:border-black/30"
                    >
                        <option value="all">All messages</option>
                        <option value="unread">Unread only</option>
                        <option value="read">Read only</option>
                    </select>
                    <select
                        value={sortOrder}
                        onChange={(event) => setSortOrder(event.target.value as typeof sortOrder)}
                        className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-black outline-none focus:border-black/30"
                    >
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                        <option value="unread">Unread first</option>
                    </select>
                </div>

                <div className="mt-6 rounded-3xl border border-black/10 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
                    <div className="border-b border-black/10 px-6 py-4">
                        <p className="text-sm font-semibold">Latest messages</p>
                        <p className="text-xs text-black/50">Direct from the contact form.</p>
                    </div>

                    {!isLoading && !error && sortedMessages.length > 0 && (
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 px-6 py-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <label className="flex items-center gap-3 text-sm font-medium text-black/70">
                                    <input
                                        type="checkbox"
                                        checked={allPageSelected}
                                        ref={(input) => {
                                            if (input) {
                                                input.indeterminate = !allPageSelected && somePageSelected;
                                            }
                                        }}
                                        onChange={toggleSelectCurrentPage}
                                        className="h-4 w-4 rounded border border-black/20 text-[#0a2f22] focus:ring-[#0a2f22]"
                                    />
                                    Select this page
                                </label>
                                <span className="text-xs text-black/50">
                                    {selectedCount > 0
                                        ? `${selectedCount} selected`
                                        : `${sortedMessages.length} total messages`}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleBatchSetReadState(selectedMessageIds, true)}
                                    disabled={selectedCount === 0 || batchAction !== null}
                                    className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-black/70 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {batchAction === 'read' ? 'Marking Read...' : 'Mark Read'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleBatchSetReadState(selectedMessageIds, false)}
                                    disabled={selectedCount === 0 || batchAction !== null}
                                    className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-black/70 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {batchAction === 'unread' ? 'Marking Unread...' : 'Mark Unread'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleBatchDelete(selectedMessageIds)}
                                    disabled={selectedCount === 0 || batchAction !== null}
                                    className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {batchAction === 'delete' ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    )}

                    {isLoading && (
                        <div className="px-6 py-6 text-sm text-black/60">Loading messages...</div>
                    )}

                    {!isLoading && error && (
                        <div className="px-6 py-6 text-sm text-red-600">{error}</div>
                    )}

                    {!isLoading && !error && messages.length === 0 && (
                        <div className="px-6 py-10 text-sm text-black/60">
                            No messages yet. New contact form submissions will appear here.
                        </div>
                    )}

                    {!isLoading && !error && sortedMessages.length > 0 && (
                        <div className="divide-y divide-black/10">
                            {pagedMessages.map((item) => (
                                <div key={item.id} className="px-6 py-5">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="flex min-w-0 flex-1 items-start gap-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedIdSet.has(item.id)}
                                                onChange={() => toggleMessageSelection(item.id)}
                                                className="mt-1 h-4 w-4 rounded border border-black/20 text-[#0a2f22] focus:ring-[#0a2f22]"
                                                aria-label={`Select message from ${item.name}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleOpenMessage(item)}
                                                className="min-w-0 flex-1 text-left"
                                            >
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                                            item.is_read
                                                                ? 'bg-black/5 text-black/50'
                                                                : 'bg-[#c9ff3c] text-black'
                                                        }`}
                                                    >
                                                        {item.is_read ? 'Read' : 'Unread'}
                                                    </span>
                                                    <p className="text-base font-semibold">{item.name}</p>
                                                </div>
                                                <p className="text-sm text-black/60">
                                                    {item.email}
                                                </p>
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-black/50">
                                            <span>{formatDate(item.created_at)}</span>
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleMenu(item.id)}
                                                    className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 text-black/60 transition hover:border-black/30 hover:text-black"
                                                    aria-haspopup="menu"
                                                    aria-expanded={menuOpenId === item.id}
                                                    aria-label="Message actions"
                                                >
                                                    •••
                                                </button>
                                                {menuOpenId === item.id && (
                                                    <div
                                                        className="absolute right-0 top-9 z-10 w-40 rounded-xl border border-black/10 bg-white p-1 shadow-[0_16px_30px_rgba(0,0,0,0.15)]"
                                                    role="menu"
                                                >
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                handleOpenMessage(item);
                                                                setMenuOpenId(null);
                                                            }}
                                                            className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-black/70 hover:bg-black/5"
                                                            role="menuitem"
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                openReply(item);
                                                                setMenuOpenId(null);
                                                            }}
                                                            className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-black/70 hover:bg-black/5"
                                                            role="menuitem"
                                                        >
                                                            Reply
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                handleToggleRead(item);
                                                                setMenuOpenId(null);
                                                            }}
                                                            className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-black/70 hover:bg-black/5"
                                                            role="menuitem"
                                                        >
                                                            Mark {item.is_read ? 'Unread' : 'Read'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                handleDelete(item);
                                                                setMenuOpenId(null);
                                                            }}
                                                            disabled={deletingId === item.id || batchAction !== null}
                                                            className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                            role="menuitem"
                                                        >
                                                            {deletingId === item.id ? 'Deleting...' : 'Delete'}
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

                    {!isLoading && !error && sortedMessages.length > 0 && totalPages > 1 && (
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 px-6 py-4 text-xs text-black/60">
                            <span>
                                Page {safePage} of {totalPages}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    disabled={safePage === 1}
                                    className="rounded-full border border-black/10 px-3 py-1 text-[11px] font-semibold text-black/70 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={safePage === totalPages}
                                    className="rounded-full border border-black/10 px-3 py-1 text-[11px] font-semibold text-black/70 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {!isLoading && !error && messages.length > 0 && sortedMessages.length === 0 && (
                        <div className="px-6 py-10 text-sm text-black/60">
                            No messages match your current search or filters.
                        </div>
                    )}
                </div>
            </div>

            {composeOpen && (
                <div
                    className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 px-4 pb-6 sm:items-center sm:pb-0"
                    onClick={() => setComposeOpen(false)}
                >
                    <div
                        className="w-full max-w-2xl rounded-3xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.45)] pointer-events-auto"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="border-b border-black/10 px-6 py-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-black/50">Compose</p>
                                <h2 className="text-lg font-semibold text-black">Reply to {composeName}</h2>
                            </div>
                        </div>
                        <div className="px-6 py-5">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-black/70">To</label>
                                    <input
                                        value={composeTo}
                                        readOnly
                                        className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black placeholder:text-black/40"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-black/70">Subject</label>
                                    <input
                                        value={composeSubject}
                                        onChange={(event) => setComposeSubject(event.target.value)}
                                        autoFocus
                                        className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black placeholder:text-black/40"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-black/70">Message</label>
                                    <textarea
                                        value={composeBody}
                                        onChange={(event) => setComposeBody(event.target.value)}
                                        rows={7}
                                        className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm text-black placeholder:text-black/40"
                                    />
                                </div>
                            </div>

                            {sendStatus && (
                                <div
                                    className={`mt-4 rounded-xl border px-3 py-2 text-xs ${
                                        sendStatus.type === 'success'
                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                            : 'border-red-200 bg-red-50 text-red-600'
                                    }`}
                                >
                                    {sendStatus.message}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-end gap-3 border-t border-black/10 px-6 py-4">
                            <button
                                type="button"
                                onClick={() => setComposeOpen(false)}
                                className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-black/60 hover:text-black"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSendReply}
                                disabled={isSending}
                                className="rounded-full bg-[#0a2f22] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0d3b2b] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isSending ? 'Sending...' : 'Send Reply'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedMessage && (
                <div
                    className="fixed inset-0 z-[210] flex items-end justify-center bg-black/50 px-4 pb-6 sm:items-center sm:pb-0"
                    onClick={() => setSelectedMessageId(null)}
                >
                    <div
                        className="w-full max-w-2xl rounded-3xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="border-b border-black/10 px-6 py-4">
                            <p className="text-xs uppercase tracking-[0.3em] text-black/50">Message</p>
                            <h2 className="mt-1 text-lg font-semibold text-black">{selectedMessage.name}</h2>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-black/50">
                                <span>{selectedMessage.email}</span>
                                <span>|</span>
                                <span>{formatDate(selectedMessage.created_at)}</span>
                                <span
                                    className={`inline-flex items-center rounded-full px-2 py-0.5 font-semibold ${
                                        selectedMessage.is_read
                                            ? 'bg-black/5 text-black/50'
                                            : 'bg-[#c9ff3c] text-black'
                                    }`}
                                >
                                    {selectedMessage.is_read ? 'Read' : 'Unread'}
                                </span>
                            </div>
                        </div>
                        <div className="px-6 py-5">
                            <div className="rounded-2xl border border-black/10 bg-black/[0.03] px-4 py-4 text-sm text-black/80 whitespace-pre-wrap">
                                {selectedMessage.message}
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 border-t border-black/10 px-6 py-4">
                            <button
                                type="button"
                                onClick={() => {
                                    openReply(selectedMessage);
                                    setSelectedMessageId(null);
                                }}
                                className="rounded-full bg-[#0a2f22] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0d3b2b]"
                            >
                                Reply
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedMessageId(null)}
                                className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-black/60 hover:text-black"
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
