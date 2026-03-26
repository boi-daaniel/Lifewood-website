import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    ChartLine,
    Gauge,
    Inbox,
    LogOut,
    Menu,
    PanelLeftClose,
    PanelLeftOpen,
    Settings,
    type LucideIcon,
    Users,
    X
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { COUNTRY_OPTIONS, getCountryLabel, normalizeCountryValue } from '../lib/countries';

type AdminProfile = {
    name: string;
    role: string;
    email: string;
    phone?: string | null;
    department?: string | null;
    location?: string | null;
    avatarUrl?: string | null;
};

type NavItem = {
    label: string;
    to: string;
    icon: LucideIcon;
    disabled?: boolean;
};

const navItems: NavItem[] = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: Gauge },
    { label: 'Inbox', to: '/admin/inbox', icon: Inbox },
    { label: 'Applicants', to: '/admin/applicants', icon: Users },
    { label: 'Analytics', to: '/admin/analytics', icon: ChartLine }
];

type AdminLayoutProps = {
    children: React.ReactNode;
};

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [profile, setProfile] = useState<AdminProfile>({
        name: 'Admin',
        role: 'Admin access',
        email: 'admin',
        phone: '',
        department: '',
        location: '',
        avatarUrl: ''
    });
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [profileDraft, setProfileDraft] = useState<AdminProfile>(profile);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const initials = useMemo(() => profile.name.trim().slice(0, 1).toUpperCase() || 'A', [profile.name]);
    const canEditRole = profile.role.toLowerCase().includes('super');

    useEffect(() => {
        let mounted = true;

        const loadProfile = async () => {
            if (!supabase) return;
            const { data: sessionData } = await supabase.auth.getSession();
            const user = sessionData.session?.user;
            if (!user || !mounted) return;

            const { data: adminProfile } = await supabase
                .from('admin_profiles')
                .select('username, role, phone, department, location, avatar_url')
                .eq('id', user.id)
                .eq('record_status', 'Active')
                .maybeSingle();

            const displayName = adminProfile?.username || user.email?.split('@')[0] || 'Admin';
            const displayRole = adminProfile?.role || 'Admin access';
            const displayPhone = adminProfile?.phone ?? '';
            const displayDepartment = adminProfile?.department ?? '';
            const displayLocation = normalizeCountryValue(adminProfile?.location ?? '');
            const displayAvatar = adminProfile?.avatar_url ?? '';

            if (mounted) {
                setProfile({
                    name: displayName,
                    role: displayRole,
                    email: user.email ?? 'admin',
                    phone: displayPhone,
                    department: displayDepartment,
                    location: displayLocation,
                    avatarUrl: displayAvatar
                });
                setProfileDraft({
                    name: displayName,
                    role: displayRole,
                    email: user.email ?? 'admin',
                    phone: displayPhone,
                    department: displayDepartment,
                    location: displayLocation,
                    avatarUrl: displayAvatar
                });
                setAvatarPreview(displayAvatar || null);
            }
        };

        loadProfile();
        const authListener = supabase?.auth.onAuthStateChange(() => {
            loadProfile();
        });

        return () => {
            mounted = false;
            authListener?.data?.subscription?.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const storedValue = window.localStorage.getItem('admin-sidebar-collapsed');
        if (storedValue === 'true') {
            setSidebarCollapsed(true);
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem('admin-sidebar-collapsed', String(sidebarCollapsed));
    }, [sidebarCollapsed]);

    useEffect(() => {
        setMobileSidebarOpen(false);
    }, [location.pathname]);

    const handleSignOut = async () => {
        if (!supabase) return;
        setIsSigningOut(true);
        await supabase.auth.signOut();
        setIsSigningOut(false);
        navigate('/admin/login', { replace: true });
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        if (!file) return;
        setAvatarFile(file);
        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);
    };

    const handleRemoveAvatar = async () => {
        if (!supabase) return;
        setProfileError(null);
        setIsSavingProfile(true);

        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user?.id;
        if (!userId) {
            setProfileError('Session expired. Please log in again.');
            setIsSavingProfile(false);
            return;
        }

        const currentUrl = profileDraft.avatarUrl || profile.avatarUrl;
        if (currentUrl && currentUrl.includes('/avatars/')) {
            const path = currentUrl.split('/avatars/')[1];
            if (path) {
                await supabase.storage.from('avatars').remove([path]);
            }
        }

        const { error: updateError } = await supabase
            .from('admin_profiles')
            .update({ avatar_url: null })
            .eq('id', userId);

        if (updateError) {
            setProfileError(updateError.message);
            setIsSavingProfile(false);
            return;
        }

        setAvatarFile(null);
        setAvatarPreview(null);
        setProfile({ ...profile, avatarUrl: null });
        setProfileDraft({ ...profileDraft, avatarUrl: null });
        setIsSavingProfile(false);
    };

    const handleSaveProfile = async () => {
        if (!supabase) return;
        setProfileError(null);
        setIsSavingProfile(true);
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user?.id;

        if (!userId) {
            setProfileError('Session expired. Please log in again.');
            setIsSavingProfile(false);
            return;
        }

        let avatarUrl = profileDraft.avatarUrl ?? null;
        if (avatarFile) {
            const extension = avatarFile.name.split('.').pop() || 'png';
            const fileName = `admin-${userId}-${Date.now()}.${extension}`;
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, avatarFile, { upsert: true });

            if (uploadError) {
                setProfileError(uploadError.message);
                setIsSavingProfile(false);
                return;
            }

            const { data: publicUrl } = supabase.storage.from('avatars').getPublicUrl(fileName);
            avatarUrl = publicUrl?.publicUrl ?? null;
        }

        const { error: updateError } = await supabase
            .from('admin_profiles')
            .update({
                username: profileDraft.name.trim(),
                role: canEditRole ? profileDraft.role.trim() : profile.role,
                phone: profileDraft.phone?.trim() || null,
                department: profileDraft.department?.trim() || null,
                location: profileDraft.location?.trim() || null,
                avatar_url: avatarUrl
            })
            .eq('id', userId);

        if (updateError) {
            setProfileError(updateError.message);
            setIsSavingProfile(false);
            return;
        }

        setProfile({ ...profileDraft, avatarUrl });
        setProfileOpen(false);
        setIsSavingProfile(false);
    };

    const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

    const navLinkClass = (collapsed: boolean, active: boolean) =>
        `group flex items-center rounded-2xl text-sm font-medium transition-colors duration-200 ${
            collapsed ? 'mx-auto h-11 w-11 justify-center' : 'gap-3 px-3.5 py-3'
        } ${
            active
                ? 'bg-white/[0.1] text-white'
                : 'text-white/62 hover:bg-white/[0.06] hover:text-white'
        }`;

    const renderNavLinks = (collapsed: boolean) => (
        <nav className="mt-4 flex flex-col gap-1.5">
            {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.to);

                if (item.disabled) {
                    return (
                        <div
                            key={item.label}
                            className={`flex cursor-not-allowed items-center rounded-2xl text-sm text-white/30 ${
                                collapsed ? 'mx-auto h-11 w-11 justify-center' : 'gap-3 px-3.5 py-3'
                            }`}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon size={18} />
                            {!collapsed && item.label}
                        </div>
                    );
                }

                return (
                    <Link
                        key={item.label}
                        to={item.to}
                        title={collapsed ? item.label : undefined}
                        className={navLinkClass(collapsed, active)}
                    >
                        <Icon size={18} />
                        {!collapsed && item.label}
                    </Link>
                );
            })}
        </nav>
    );

    const renderManagementLink = (collapsed: boolean) => {
        if (!canEditRole) return null;

        return (
            <>
                <div className={`mt-8 px-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/32 ${collapsed ? 'text-center' : ''}`}>
                    {collapsed ? 'Admin' : 'Administration'}
                </div>
                <Link
                    to="/admin/management"
                    title={collapsed ? 'Admin Management' : undefined}
                    className={navLinkClass(collapsed, isActive('/admin/management'))}
                >
                    <Settings size={18} />
                    {!collapsed && 'Admin Management'}
                </Link>
            </>
        );
    };

    const renderProfileCard = (collapsed: boolean) => (
        <div className={`mt-auto rounded-[22px] border border-white/8 bg-white/[0.03] ${collapsed ? 'p-2.5' : 'p-3.5'}`}>
            <div className={`flex ${collapsed ? 'flex-col items-center gap-3' : 'items-center gap-3'}`}>
                {collapsed ? (
                    <button
                        type="button"
                        onClick={() => setProfileOpen(true)}
                        className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/12 bg-white/95 text-sm font-semibold text-[#0f2f24] transition hover:scale-[1.03]"
                        aria-label="Open profile"
                    >
                        {profile.avatarUrl ? (
                            <img
                                src={profile.avatarUrl}
                                alt={profile.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            initials
                        )}
                    </button>
                ) : (
                    <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/12 bg-white/95 text-sm font-semibold text-[#0f2f24]">
                        {profile.avatarUrl ? (
                            <img
                                src={profile.avatarUrl}
                                alt={profile.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            initials
                        )}
                    </div>
                )}
                {collapsed ? (
                    null
                ) : (
                    <>
                        <button
                            type="button"
                            onClick={() => setProfileOpen(true)}
                            className="flex-1 text-left"
                        >
                            <p className="text-sm font-semibold text-white">{profile.name}</p>
                            <p className="mt-0.5 text-xs text-white/50">{profile.role}</p>
                        </button>
                        <button
                            type="button"
                            onClick={handleSignOut}
                            disabled={isSigningOut}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/8 text-white/72 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-60"
                            aria-label="Sign out"
                        >
                            <LogOut size={16} />
                        </button>
                    </>
                )}
            </div>
            {!collapsed && <p className="mt-3 truncate text-[11px] text-white/44">{profile.email}</p>}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f6f8f6] text-[#0a0b0d]">
            <header className="sticky top-0 z-[120] border-b border-black/5 bg-white/85 backdrop-blur lg:hidden">
                <div className="flex items-center justify-between px-4 py-3">
                    <button
                        type="button"
                        onClick={() => setMobileSidebarOpen(true)}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/8 bg-white text-black/80 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                        aria-label="Open navigation"
                    >
                        <Menu size={18} />
                    </button>
                    <div className="flex items-center gap-3">
                        <img
                            src="https://framerusercontent.com/images/Ca8ppNsvJIfTsWEuHr50gvkDow.png?scale-down-to=512&width=2624&height=474"
                            alt="Lifewood"
                            className="h-7 w-auto object-contain"
                        />
                        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-black/45">Admin</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setProfileOpen(true)}
                        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-black/8 bg-white text-sm font-semibold text-black shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                        aria-label="Open profile"
                    >
                        {profile.avatarUrl ? (
                            <img
                                src={profile.avatarUrl}
                                alt={profile.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            initials
                        )}
                    </button>
                </div>
            </header>

            <aside
                className={`fixed inset-y-0 left-0 z-[140] hidden border-r border-[#ffffff14] bg-[#0a2f22] text-white transition-all duration-300 lg:flex ${
                    sidebarCollapsed ? 'w-[92px]' : 'w-[304px]'
                }`}
            >
                <div className={`flex h-full w-full flex-col ${sidebarCollapsed ? 'px-3 py-5' : 'px-4 py-5'}`}>
                    <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between gap-3'}`}>
                        {sidebarCollapsed ? (
                            <div className="group relative flex h-10 w-10 items-center justify-center">
                                <img
                                    src="https://framerusercontent.com/images/Ca8ppNsvJIfTsWEuHr50gvkDow.png?scale-down-to=512&width=2624&height=474"
                                    alt="Lifewood"
                                    className="h-5 w-auto object-contain opacity-88 transition-opacity duration-200 group-hover:opacity-0 group-focus-within:opacity-0"
                                />
                                <button
                                    type="button"
                                    onClick={() => setSidebarCollapsed(false)}
                                    className="absolute inset-0 flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white opacity-0 transition-all duration-200 hover:bg-white/[0.1] group-hover:opacity-100 group-focus-within:opacity-100"
                                    aria-label="Expand sidebar"
                                >
                                    <PanelLeftOpen size={18} />
                                </button>
                            </div>
                        ) : (
                            <img
                                src="https://framerusercontent.com/images/Ca8ppNsvJIfTsWEuHr50gvkDow.png?scale-down-to=512&width=2624&height=474"
                                alt="Lifewood"
                                className="h-6 w-auto object-contain"
                            />
                        )}
                        {!sidebarCollapsed && (
                            <button
                                type="button"
                                onClick={() => setSidebarCollapsed(true)}
                                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/8 text-white/68 transition hover:bg-white/[0.06] hover:text-white"
                                aria-label="Collapse sidebar"
                            >
                                <PanelLeftClose size={18} />
                            </button>
                        )}
                    </div>

                    <div className={`mt-8 px-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/28 ${sidebarCollapsed ? 'text-center' : ''}`}>
                        {sidebarCollapsed ? 'Menu' : 'Main Menu'}
                    </div>
                    {renderNavLinks(sidebarCollapsed)}
                    {renderManagementLink(sidebarCollapsed)}
                    {renderProfileCard(sidebarCollapsed)}
                </div>
            </aside>

            {mobileSidebarOpen && (
                <div className="fixed inset-0 z-[170] bg-black/45 lg:hidden" onClick={() => setMobileSidebarOpen(false)}>
                    <aside
                        className="h-full w-[88vw] max-w-[320px] border-r border-[#ffffff14] bg-[#0a2f22] px-4 py-5 text-white shadow-[24px_0_60px_rgba(0,0,0,0.3)]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between gap-3">
                            <img
                                src="https://framerusercontent.com/images/Ca8ppNsvJIfTsWEuHr50gvkDow.png?scale-down-to=512&width=2624&height=474"
                                alt="Lifewood"
                                className="h-6 w-auto object-contain"
                            />
                            <button
                                type="button"
                                onClick={() => setMobileSidebarOpen(false)}
                                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/8 text-white/72 transition hover:bg-white/[0.06] hover:text-white"
                                aria-label="Close navigation"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="mt-8 px-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/28">Main Menu</div>
                        {renderNavLinks(false)}
                        {renderManagementLink(false)}
                        {renderProfileCard(false)}
                    </aside>
                </div>
            )}

            <div
                className={
                    sidebarCollapsed
                        ? 'transition-all duration-300 lg:pl-[92px]'
                        : 'transition-all duration-300 lg:pl-[304px]'
                }
            >
                <div className="mx-auto min-h-screen w-full max-w-[1600px] px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-8">
                    <main className="min-w-0 w-full [&>*]:min-h-full">{children}</main>
                </div>
            </div>

            {profileOpen && (
                <div
                    className="fixed inset-0 z-[250] flex items-end justify-center bg-black/60 px-4 pb-6 sm:items-center sm:pb-0"
                    onClick={() => setProfileOpen(false)}
                >
                    <div
                        className="w-full max-w-xl rounded-3xl bg-[#0d0f12] text-white shadow-[0_35px_80px_rgba(0,0,0,0.55)]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-white/40">Edit Profile</p>
                                <h2 className="mt-1 text-lg font-semibold">Customize Profile</h2>
                            </div>
                        </div>
                        <div className="px-6 py-5">
                            <div className="flex flex-wrap gap-6">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-[#c9ff3c]/60 bg-[#11141a] text-2xl font-semibold text-[#c9ff3c]">
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
                                        ) : (
                                            initials
                                        )}
                                    </div>
                                    <label className="cursor-pointer text-xs font-semibold text-[#c9ff3c] hover:text-[#d8ff70]">
                                        Tap to change
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleAvatarChange}
                                        />
                                    </label>
                                    {(avatarPreview || profile.avatarUrl) && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveAvatar}
                                            className="text-[11px] font-semibold text-white/60 hover:text-white"
                                        >
                                            Remove avatar
                                        </button>
                                    )}
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-white/50">Display name</label>
                                        <input
                                            value={profileDraft.name}
                                            onChange={(event) =>
                                                setProfileDraft({ ...profileDraft, name: event.target.value })
                                            }
                                            className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-white/50">Role</label>
                                        <select
                                            value={profileDraft.role}
                                            onChange={(event) =>
                                                setProfileDraft({ ...profileDraft, role: event.target.value })
                                            }
                                            disabled={!canEditRole}
                                            className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white px-3 text-sm text-black disabled:cursor-not-allowed disabled:opacity-70"
                                        >
                                            <option value="Admin">Admin</option>
                                            <option value="Super Admin">Super Admin</option>
                                        </select>
                                        {!canEditRole && (
                                            <p className="mt-1 text-[11px] text-white/40">
                                                Only Super Admins can change roles.
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-white/50">Phone</label>
                                        <input
                                            value={profileDraft.phone ?? ''}
                                            onChange={(event) =>
                                                setProfileDraft({ ...profileDraft, phone: event.target.value })
                                            }
                                            className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-white/50">Department</label>
                                        <input
                                            value={profileDraft.department ?? ''}
                                            onChange={(event) =>
                                                setProfileDraft({ ...profileDraft, department: event.target.value })
                                            }
                                            className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-white/50">Location</label>
                                        <select
                                            value={profileDraft.location ?? ''}
                                            onChange={(event) =>
                                                setProfileDraft({ ...profileDraft, location: event.target.value })
                                            }
                                            className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white px-3 text-sm text-black"
                                        >
                                            {!profileDraft.location && <option value="">Select a region</option>}
                                            {profileDraft.location &&
                                                !COUNTRY_OPTIONS.some((item) => item.code === profileDraft.location) && (
                                                    <option value={profileDraft.location}>
                                                        {getCountryLabel(profileDraft.location)}
                                                    </option>
                                                )}
                                            {COUNTRY_OPTIONS.map((country) => (
                                                <option key={country.code} value={country.code}>
                                                    {country.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-white/50">Email</label>
                                        <input
                                            value={profileDraft.email}
                                            readOnly
                                            className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white/70"
                                        />
                                    </div>
                                </div>
                            </div>
                            {profileError && (
                                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                                    {profileError}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
                            <button
                                type="button"
                                onClick={() => setProfileOpen(false)}
                                className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/60 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveProfile}
                                disabled={isSavingProfile}
                                className="rounded-full bg-[#c9ff3c] px-4 py-2 text-xs font-semibold text-black hover:bg-[#d8ff70] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isSavingProfile ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
