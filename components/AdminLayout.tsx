import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    CalendarDays,
    ChartLine,
    Gauge,
    Inbox,
    LogOut,
    Settings,
    ShieldCheck,
    Sparkles,
    Users
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

type AdminProfile = {
    name: string;
    role: string;
    email: string;
};

const navItems = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: Gauge },
    { label: 'Inbox', to: '/admin/inbox', icon: Inbox },
    { label: 'Applicants', to: '/admin/applicants', icon: Users },
    { label: 'Analytics', to: '/admin/analytics', icon: ChartLine, disabled: true },
    { label: 'Evaluation', to: '/admin/evaluation', icon: ShieldCheck, disabled: true },
    { label: 'Reports', to: '/admin/reports', icon: CalendarDays, disabled: true }
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
        email: 'admin'
    });
    const [isSigningOut, setIsSigningOut] = useState(false);
    const initials = useMemo(() => profile.name.trim().slice(0, 1).toUpperCase() || 'A', [profile.name]);

    useEffect(() => {
        let mounted = true;

        const loadProfile = async () => {
            if (!supabase) return;
            const { data: sessionData } = await supabase.auth.getSession();
            const user = sessionData.session?.user;
            if (!user || !mounted) return;

            const { data: adminProfile } = await supabase
                .from('admin_profiles')
                .select('username, role')
                .eq('id', user.id)
                .maybeSingle();

            const displayName = adminProfile?.username || user.email?.split('@')[0] || 'Admin';
            const displayRole = adminProfile?.role || 'Admin access';

            if (mounted) {
                setProfile({
                    name: displayName,
                    role: displayRole,
                    email: user.email ?? 'admin'
                });
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

    const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

    return (
        <div className="min-h-screen bg-[#0a0b0d] text-white">
            <div className="mx-auto flex min-h-screen w-[min(1440px,94%)] gap-6 py-8">
                <aside className="hidden w-[240px] flex-col rounded-[28px] border border-white/10 bg-[#0e1014] px-5 py-6 shadow-[0_20px_40px_rgba(0,0,0,0.5)] lg:flex">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b7f84f] text-black">
                            <Sparkles size={18} />
                        </div>
                        <div>
                            <p className="text-base font-semibold">Lifewood</p>
                            <span className="text-[11px] text-white/60">Admin Hub</span>
                        </div>
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

                    <div className="mt-8 text-[11px] uppercase tracking-[0.2em] text-white/40">
                        Settings
                    </div>
                    <button
                        type="button"
                        className="mt-3 flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-white/70 hover:bg-white/5 hover:text-white"
                    >
                        <Settings size={16} />
                        Settings
                    </button>

                    <div className="mt-auto rounded-3xl border border-white/10 bg-[#11141a] p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b7f84f] text-black text-sm font-semibold">
                                {initials}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold">{profile.name}</p>
                                <p className="text-xs text-white/50">{profile.role}</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleSignOut}
                                disabled={isSigningOut}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:text-white disabled:opacity-60"
                                aria-label="Sign out"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                        <p className="mt-3 text-[11px] text-white/40">{profile.email}</p>
                    </div>
                </aside>

                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
};
