import React, { useEffect, useState } from 'react';
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

    const handleToggleRead = async (message: ContactMessage) => {
        if (!supabase) return;
        const nextValue = !message.is_read;
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

    const unreadCount = messages.filter((item) => !item.is_read).length;

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
                            {sortedMessages.map((item) => (
                                <div key={item.id} className="px-6 py-5">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <p className="text-base font-semibold">{item.name}</p>
                                            <a
                                                href={`mailto:${item.email}`}
                                                className="text-sm text-black/60 hover:text-black"
                                            >
                                                {item.email}
                                            </a>
                                            <span
                                                className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                                    item.is_read
                                                        ? 'bg-black/5 text-black/50'
                                                        : 'bg-[#c9ff3c] text-black'
                                                }`}
                                            >
                                                {item.is_read ? 'Read' : 'Unread'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-black/50">
                                            <span>{formatDate(item.created_at)}</span>
                                            <a
                                                href={`mailto:${item.email}?subject=${encodeURIComponent(
                                                    'Re: Lifewood contact'
                                                )}&body=${encodeURIComponent(
                                                    `Hi ${item.name},\n\nThanks for reaching out.`
                                                )}`}
                                                className="rounded-full border border-black/10 px-3 py-1 text-[11px] font-semibold text-black/70 transition hover:border-black/30 hover:text-black"
                                            >
                                                Reply
                                            </a>
                                            <button
                                                type="button"
                                                onClick={() => handleToggleRead(item)}
                                                className="rounded-full border border-black/10 px-3 py-1 text-[11px] font-semibold text-black/70 transition hover:border-black/30 hover:text-black"
                                            >
                                                Mark {item.is_read ? 'Unread' : 'Read'}
                                            </button>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm text-black/70 whitespace-pre-wrap">{item.message}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {!isLoading && !error && messages.length > 0 && sortedMessages.length === 0 && (
                        <div className="px-6 py-10 text-sm text-black/60">
                            No messages match your current search or filters.
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};
