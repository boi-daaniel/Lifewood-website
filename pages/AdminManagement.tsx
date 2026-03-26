import React, { useEffect, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { supabase } from '../lib/supabaseClient';
import { COUNTRY_OPTIONS, getCountryLabel, normalizeCountryValue } from '../lib/countries';

type AdminUser = {
    id: string;
    username: string | null;
    role: string | null;
    phone: string | null;
    department: string | null;
    location: string | null;
    avatar_url: string | null;
};

const adminMenuButtonClass =
    'relative flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-transparent transition hover:border-black/20 hover:bg-black/[0.03]';
const adminMenuPanelClass =
    'absolute right-0 top-11 z-10 w-48 rounded-2xl border border-black/10 bg-white p-2 shadow-[0_20px_40px_rgba(15,23,42,0.16)]';
const adminMenuItemClass =
    'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-black/72 transition hover:bg-black/[0.04] hover:text-black';

export const AdminManagement: React.FC = () => {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [createForm, setCreateForm] = useState({
        email: '',
        password: '',
        username: '',
        role: 'Admin',
        phone: '',
        department: '',
        location: ''
    });
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const [viewAdmin, setViewAdmin] = useState<AdminUser | null>(null);
    const [editAdmin, setEditAdmin] = useState<AdminUser | null>(null);
    const [editForm, setEditForm] = useState({
        username: '',
        role: 'Admin',
        phone: '',
        department: '',
        location: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const loadAdmins = async () => {
            if (!supabase) {
                if (mounted) {
                    setError('Supabase is not configured.');
                    setIsLoading(false);
                }
                return;
            }

            const { data: sessionData } = await supabase.auth.getSession();
            if (mounted) {
                setCurrentUserId(sessionData.session?.user?.id ?? null);
            }

            const { data, error: fetchError } = await supabase
                .from('admin_profiles')
                .select('id, username, role, phone, department, location, avatar_url')
                .eq('record_status', 'Active')
                .order('username', { ascending: true });

            if (!mounted) return;

            if (fetchError) {
                setError(fetchError.message);
            } else {
                setAdmins(data ?? []);
            }
            setIsLoading(false);
        };

        loadAdmins();
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        const handleWindowClick = () => setMenuOpenId(null);
        window.addEventListener('click', handleWindowClick);
        return () => window.removeEventListener('click', handleWindowClick);
    }, []);

    const handleCreateAdmin = async () => {
        if (!supabase) return;
        setError(null);

        setIsCreating(true);
        if (!createForm.email.trim() || !createForm.password.trim() || !createForm.username.trim()) {
            setError('Email, password, and name are required.');
            setIsCreating(false);
            return;
        }

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData.session?.access_token) {
            setError('You are not signed in.');
            setIsCreating(false);
            return;
        }

        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 12000);

        try {
            const response = await fetch('/api/admin/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionData.session.access_token}`
                },
                body: JSON.stringify({
                    email: createForm.email.trim(),
                    password: createForm.password.trim(),
                    username: createForm.username.trim(),
                    role: createForm.role,
                    phone: createForm.phone.trim() || null,
                    department: createForm.department.trim() || null,
                    location: createForm.location.trim() || null
                }),
                signal: controller.signal
            });

            const contentType = response.headers.get('content-type') ?? '';
            const result = contentType.includes('application/json')
                ? await response.json()
                : { error: await response.text() };

            if (!response.ok) {
                setError(result?.error ?? 'Failed to create admin.');
                setIsCreating(false);
                return;
            }

            if (result?.admin) {
                setAdmins((prev) => [result.admin, ...prev]);
            }
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                setError('Request timed out. Make sure the API is reachable (use Vercel dev or deploy).');
            } else {
                setError(error instanceof Error ? error.message : 'Failed to create admin.');
            }
            setIsCreating(false);
            return;
        } finally {
            window.clearTimeout(timeoutId);
        }

        setCreateForm({
            email: '',
            password: '',
            username: '',
            role: 'Admin',
            phone: '',
            department: '',
            location: ''
        });
        setCreateOpen(false);
        setIsCreating(false);
    };

    const handleRoleUpdate = async (admin: AdminUser, nextRole: string) => {
        if (!supabase) return;
        setUpdatingId(admin.id);
        setError(null);

        const { error: updateError } = await supabase
            .from('admin_profiles')
            .update({ role: nextRole })
            .eq('id', admin.id);

        if (updateError) {
            setError(updateError.message);
            setUpdatingId(null);
            return;
        }

        setAdmins((prev) =>
            prev.map((item) => (item.id === admin.id ? { ...item, role: nextRole } : item))
        );
        setUpdatingId(null);
    };

    const handleDelete = async (admin: AdminUser) => {
        if (admin.id === currentUserId) {
            setError('You cannot delete your own admin account.');
            return;
        }
        if (!supabase) return;
        const confirmed = window.confirm(`Mark admin ${admin.username ?? 'Admin'} as deleted? The account will remain in the database.`);
        if (!confirmed) return;

        setDeletingId(admin.id);
        setError(null);
        const { error: updateError } = await supabase
            .from('admin_profiles')
            .update({ record_status: 'Deleted' })
            .eq('id', admin.id);

        if (updateError) {
            setError(updateError.message);
            setDeletingId(null);
            return;
        }

        setAdmins((prev) => prev.filter((item) => item.id !== admin.id));
        setDeletingId(null);
    };

    const handleOpenEdit = (admin: AdminUser) => {
        setError(null);
        setEditAdmin(admin);
        setEditForm({
            username: admin.username ?? '',
            role: admin.role ?? 'Admin',
            phone: admin.phone ?? '',
            department: admin.department ?? '',
            location: normalizeCountryValue(admin.location)
        });
    };

    const handleSaveEdit = async () => {
        if (!supabase || !editAdmin) return;
        if (!editForm.username.trim()) {
            setError('Display name is required.');
            return;
        }

        setIsSaving(true);
        setError(null);

        const payload = {
            username: editForm.username.trim(),
            role: editForm.role,
            phone: editForm.phone.trim() || null,
            department: editForm.department.trim() || null,
            location: editForm.location.trim() || null
        };

        const { error: updateError } = await supabase
            .from('admin_profiles')
            .update(payload)
            .eq('id', editAdmin.id);

        if (updateError) {
            setError(updateError.message);
            setIsSaving(false);
            return;
        }

        setAdmins((prev) =>
            prev.map((item) => (item.id === editAdmin.id ? { ...item, ...payload } : item))
        );
        setEditAdmin(null);
        setIsSaving(false);
    };

    const filteredAdmins = admins.filter((admin) => {
        const matchesRole = roleFilter === 'All' || (admin.role ?? 'Admin') === roleFilter;
        if (!matchesRole) return false;
        if (!searchTerm.trim()) return true;
        const query = searchTerm.toLowerCase();
        return (
            (admin.username ?? '').toLowerCase().includes(query) ||
            (admin.role ?? '').toLowerCase().includes(query) ||
            (admin.department ?? '').toLowerCase().includes(query) ||
            (admin.location ?? '').toLowerCase().includes(query)
        );
    });

    return (
        <AdminLayout>
            <div className="flex h-[calc(100vh-4rem)] min-h-[720px] flex-col overflow-hidden rounded-[30px] border border-white/10 bg-white/90 px-7 py-6 text-black shadow-[0_25px_60px_rgba(0,0,0,0.35)] backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-black/50">Admin Management</p>
                        <h1 className="mt-2 text-3xl font-semibold">Admin Accounts</h1>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            setError(null);
                            setCreateOpen(true);
                        }}
                        className="rounded-full bg-[#0a2f22] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0d3b2b]"
                    >
                        Add Admin
                    </button>
                </div>

                <div className="mt-6">
                    <div className="flex flex-col gap-3 md:flex-row">
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Search by name, role, department, or location..."
                            className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-black outline-none focus:border-black/30"
                        />
                        <select
                            value={roleFilter}
                            onChange={(event) => setRoleFilter(event.target.value)}
                            className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-black outline-none focus:border-black/30 md:w-[220px]"
                        >
                            <option value="All">All Admin Types</option>
                            <option value="Super Admin">Super Admin</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
                    <div className="border-b border-black/10 px-6 py-4">
                        <p className="text-sm font-semibold">All admins</p>
                        <p className="text-xs text-black/50">Visible only to Super Admins.</p>
                    </div>

                    {isLoading && (
                        <div className="flex flex-1 items-center px-6 py-6 text-sm text-black/60">Loading admins...</div>
                    )}

                    {!isLoading && error && (
                        <div className="flex flex-1 items-center px-6 py-6 text-sm text-red-600">{error}</div>
                    )}

                    {!isLoading && !error && filteredAdmins.length === 0 && (
                        <div className="flex flex-1 items-center px-6 py-10 text-sm text-black/60">No admins found.</div>
                    )}

                    {!isLoading && !error && filteredAdmins.length > 0 && (
                        <div className="flex-1 overflow-y-auto divide-y divide-black/10">
                            {filteredAdmins.map((admin) => (
                                <div
                                    key={admin.id}
                                    className="cursor-pointer px-6 py-5 transition hover:bg-black/[0.02]"
                                    onClick={() => setViewAdmin(admin)}
                                >
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#c9ff3c] text-black font-semibold">
                                            {admin.avatar_url ? (
                                                <img
                                                    src={admin.avatar_url}
                                                    alt={admin.username ?? 'Admin'}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                (admin.username ?? 'A').slice(0, 1).toUpperCase()
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-base font-semibold">{admin.username ?? 'Admin'}</p>
                                        </div>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setMenuOpenId((prev) => (prev === admin.id ? null : admin.id));
                                                }}
                                                className={adminMenuButtonClass}
                                                aria-label="Open admin actions"
                                                aria-haspopup="menu"
                                                aria-expanded={menuOpenId === admin.id}
                                            >
                                                <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-black/55">
                                                    <MoreHorizontal size={16} />
                                                </span>
                                                ⋯
                                            </button>
                                            {menuOpenId === admin.id && (
                                                <div
                                                    className={adminMenuPanelClass}
                                                    onClick={(event) => event.stopPropagation()}
                                                    role="menu"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setMenuOpenId(null);
                                                            handleOpenEdit(admin);
                                                        }}
                                                        className={adminMenuItemClass}
                                                        role="menuitem"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setMenuOpenId(null);
                                                            handleDelete(admin);
                                                        }}
                                                        disabled={deletingId === admin.id || admin.id === currentUserId}
                                                        className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                        role="menuitem"
                                                    >
                                                        {deletingId === admin.id ? 'Deleting...' : 'Delete'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {createOpen && (
                <div
                    className="fixed inset-0 z-[250] flex items-end justify-center bg-black/60 px-4 pb-6 sm:items-center sm:pb-0"
                    onClick={() => setCreateOpen(false)}
                >
                    <div
                        className="w-full max-w-xl rounded-3xl bg-white text-black shadow-[0_35px_80px_rgba(0,0,0,0.55)]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-black/50">Create Admin</p>
                                <h2 className="mt-1 text-lg font-semibold">Add Admin Account</h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setCreateOpen(false)}
                                className="text-sm text-black/60 hover:text-black"
                            >
                                Close
                            </button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <p className="text-xs text-black/60">
                                We will create a Supabase Auth user and assign an admin profile.
                            </p>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-xs font-semibold text-black/60">Email *</label>
                                    <input
                                        type="email"
                                        value={createForm.email}
                                        onChange={(event) => setCreateForm({ ...createForm, email: event.target.value })}
                                        className="mt-2 h-11 w-full rounded-xl border border-black/10 px-3 text-sm"
                                        placeholder="admin@lifewood.com"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-black/60">Temporary password *</label>
                                    <input
                                        type="password"
                                        value={createForm.password}
                                        onChange={(event) => setCreateForm({ ...createForm, password: event.target.value })}
                                        className="mt-2 h-11 w-full rounded-xl border border-black/10 px-3 text-sm"
                                        placeholder="Set a temporary password"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-black/60">Display name *</label>
                                <input
                                    value={createForm.username}
                                    onChange={(event) => setCreateForm({ ...createForm, username: event.target.value })}
                                    className="mt-2 h-11 w-full rounded-xl border border-black/10 px-3 text-sm"
                                    placeholder="Admin name"
                                />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-xs font-semibold text-black/60">Role</label>
                                    <select
                                        value={createForm.role}
                                        onChange={(event) => setCreateForm({ ...createForm, role: event.target.value })}
                                        className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black"
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="Super Admin">Super Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-black/60">Phone</label>
                                    <input
                                        value={createForm.phone}
                                        onChange={(event) => setCreateForm({ ...createForm, phone: event.target.value })}
                                        className="mt-2 h-11 w-full rounded-xl border border-black/10 px-3 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-xs font-semibold text-black/60">Department</label>
                                    <input
                                        value={createForm.department}
                                        onChange={(event) => setCreateForm({ ...createForm, department: event.target.value })}
                                        className="mt-2 h-11 w-full rounded-xl border border-black/10 px-3 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-black/60">Location</label>
                                    <select
                                        value={createForm.location}
                                        onChange={(event) => setCreateForm({ ...createForm, location: event.target.value })}
                                        className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black"
                                    >
                                        {!createForm.location && <option value="">Select a region</option>}
                                        {COUNTRY_OPTIONS.map((country) => (
                                            <option key={country.code} value={country.code}>
                                                {country.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {error && (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                                    {error}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-end gap-3 border-t border-black/10 px-6 py-4">
                            <button
                                type="button"
                                onClick={() => setCreateOpen(false)}
                                className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-black/60 hover:text-black"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleCreateAdmin}
                                disabled={isCreating}
                                className="rounded-full bg-[#0a2f22] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0d3b2b] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isCreating ? 'Creating...' : 'Create Admin'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {viewAdmin && (
                <div
                    className="fixed inset-0 z-[260] flex items-end justify-center bg-black/60 px-4 pb-6 sm:items-center sm:pb-0"
                    onClick={() => setViewAdmin(null)}
                >
                    <div
                        className="w-full max-w-lg rounded-3xl bg-white text-black shadow-[0_35px_80px_rgba(0,0,0,0.55)]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-black/50">Admin Details</p>
                                <h2 className="mt-1 text-lg font-semibold">{viewAdmin.username ?? 'Admin'}</h2>
                            </div>
                        </div>
                        <div className="px-6 py-5 space-y-4 text-sm text-black/80">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[#c9ff3c] text-lg font-semibold text-black">
                                    {viewAdmin.avatar_url ? (
                                        <img
                                            src={viewAdmin.avatar_url}
                                            alt={viewAdmin.username ?? 'Admin'}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        (viewAdmin.username ?? 'A').slice(0, 1).toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <p className="text-base font-semibold text-black">{viewAdmin.username ?? 'Admin'}</p>
                                    <p className="text-xs text-black/50">{viewAdmin.role ?? 'Admin'}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-black/50">Role</span>
                                <span>{viewAdmin.role ?? 'Admin'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-black/50">Phone</span>
                                <span>{viewAdmin.phone ?? 'Not set'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-black/50">Department</span>
                                <span>{viewAdmin.department ?? 'Not set'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-black/50">Location</span>
                                <span>{getCountryLabel(viewAdmin.location) || 'Not set'}</span>
                            </div>
                            <div className="rounded-2xl bg-black/5 px-3 py-2 text-xs text-black/60">
                                Auth User ID: {viewAdmin.id}
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 border-t border-black/10 px-6 py-4">
                            <button
                                type="button"
                                onClick={() => setViewAdmin(null)}
                                className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-black/60 hover:text-black"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {editAdmin && (
                <div
                    className="fixed inset-0 z-[270] flex items-end justify-center bg-black/60 px-4 pb-6 sm:items-center sm:pb-0"
                    onClick={() => setEditAdmin(null)}
                >
                    <div
                        className="w-full max-w-lg rounded-3xl bg-white text-black shadow-[0_35px_80px_rgba(0,0,0,0.55)]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-black/50">Edit Admin</p>
                                <h2 className="mt-1 text-lg font-semibold">Update Admin Information</h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditAdmin(null)}
                                className="text-sm text-black/60 hover:text-black"
                            >
                                Close
                            </button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-black/60">Display name *</label>
                                <input
                                    value={editForm.username}
                                    onChange={(event) => setEditForm({ ...editForm, username: event.target.value })}
                                    className="mt-2 h-11 w-full rounded-xl border border-black/10 px-3 text-sm"
                                />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-xs font-semibold text-black/60">Role</label>
                                    <select
                                        value={editForm.role}
                                        onChange={(event) => setEditForm({ ...editForm, role: event.target.value })}
                                        className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black"
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="Super Admin">Super Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-black/60">Phone</label>
                                    <input
                                        value={editForm.phone}
                                        onChange={(event) => setEditForm({ ...editForm, phone: event.target.value })}
                                        className="mt-2 h-11 w-full rounded-xl border border-black/10 px-3 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-xs font-semibold text-black/60">Department</label>
                                    <input
                                        value={editForm.department}
                                        onChange={(event) => setEditForm({ ...editForm, department: event.target.value })}
                                        className="mt-2 h-11 w-full rounded-xl border border-black/10 px-3 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-black/60">Location</label>
                                    <select
                                        value={editForm.location}
                                        onChange={(event) => setEditForm({ ...editForm, location: event.target.value })}
                                        className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black"
                                    >
                                        {!editForm.location && <option value="">Select a region</option>}
                                        {editForm.location &&
                                            !COUNTRY_OPTIONS.some((item) => item.code === editForm.location) && (
                                                <option value={editForm.location}>
                                                    {getCountryLabel(editForm.location)}
                                                </option>
                                            )}
                                        {COUNTRY_OPTIONS.map((country) => (
                                            <option key={country.code} value={country.code}>
                                                {country.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {error && (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                                    {error}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-end gap-3 border-t border-black/10 px-6 py-4">
                            <button
                                type="button"
                                onClick={() => setEditAdmin(null)}
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
