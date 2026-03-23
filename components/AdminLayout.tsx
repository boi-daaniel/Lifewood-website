import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    ChartLine,
    Gauge,
    Inbox,
    type LucideIcon,
    LogOut,
    Settings,
    Users
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

    return (
        <div className="min-h-screen bg-white px-3 text-[#0a0b0d] sm:px-4 lg:px-5">
            <div className="mx-auto grid min-h-screen w-full max-w-[1480px] gap-6 py-8 lg:grid-cols-[300px_minmax(0,1fr)]">
                <aside className="hidden w-full flex-col rounded-[28px] border border-white/10 bg-[#046241] px-5 py-6 shadow-[0_20px_40px_rgba(0,0,0,0.5)] lg:flex">
                    <div className="flex flex-col items-center text-center">
                        <img
                            src="https://framerusercontent.com/images/Ca8ppNsvJIfTsWEuHr50gvkDow.png?scale-down-to=512&width=2624&height=474"
                            alt="Lifewood"
                            className="h-7 w-auto object-contain"
                        />
                        <span className="text-[11px] text-white/60">Admin Hub</span>
                    </div>

                    <div className="mt-8 text-[11px] uppercase tracking-[0.2em] text-white/40">
                        Main Menu
                    </div>
                    <nav className="mt-4 flex flex-col gap-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.to);
                            const baseClass =
                                'flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition';

                            if (item.disabled) {
                                return (
                                    <div
                                        key={item.label}
                                        className={`${baseClass} text-white/30 cursor-not-allowed`}
                                    >
                                        <Icon size={16} />
                                        {item.label}
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={item.label}
                                    to={item.to}
                                    className={`${baseClass} ${
                                        active
                                            ? 'bg-[#1b1e25] text-[#c9ff3c] shadow-[0_0_0_1px_rgba(201,255,60,0.25)]'
                                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <Icon size={16} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {canEditRole && (
                        <>
                            <div className="mt-8 text-[11px] uppercase tracking-[0.2em] text-white/40">
                                Administration
                            </div>
                            <Link
                                to="/admin/management"
                                className="mt-3 flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-white/70 hover:bg-white/5 hover:text-white"
                            >
                                <Settings size={16} />
                                Admin Management
                            </Link>
                        </>
                    )}

                    <div className="mt-auto rounded-3xl border border-white/10 bg-[#046241] p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#b7f84f] text-black text-sm font-semibold">
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
                            <button
                                type="button"
                                onClick={() => setProfileOpen(true)}
                                className="flex-1 text-left"
                            >
                                <p className="text-sm font-semibold text-white">{profile.name}</p>
                                <p className="text-xs text-white">{profile.role}</p>
                            </button>
                            <button
                                type="button"
                                onClick={handleSignOut}
                                disabled={isSigningOut}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white transition hover:text-white/80 disabled:opacity-60"
                                aria-label="Sign out"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                        <p className="mt-3 text-[11px] text-white">{profile.email}</p>
                    </div>
                </aside>

                <main className="min-w-0 w-full max-w-[1140px] justify-self-stretch [&>*]:min-h-full xl:max-w-[1180px] 2xl:max-w-[1220px]">
                    {children}
                </main>
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
                                <label className="text-xs font-semibold text-[#c9ff3c] hover:text-[#d8ff70] cursor-pointer">
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
                                        {!profileDraft.location && (
                                            <option value="">Select a region</option>
                                        )}
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
