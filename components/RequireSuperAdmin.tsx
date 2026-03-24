import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

type SuperAdminGateState = {
    status: 'checking' | 'allowed' | 'denied';
    message?: string;
};

export const RequireSuperAdmin: React.FC = () => {
    const location = useLocation();
    const [state, setState] = useState<SuperAdminGateState>({ status: 'checking' });

    useEffect(() => {
        let mounted = true;

        const verifySuperAdmin = async () => {
            if (!supabase) {
                if (mounted) {
                    setState({
                        status: 'denied',
                        message: 'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
                    });
                }
                return;
            }

            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !sessionData.session?.user) {
                if (mounted) setState({ status: 'denied' });
                return;
            }

            const { data: adminProfile, error: adminError } = await supabase
                .from('admin_profiles')
                .select('role')
                .eq('id', sessionData.session.user.id)
                .eq('record_status', 'Active')
                .maybeSingle();

            if (adminError || !adminProfile) {
                if (mounted) {
                    setState({
                        status: 'denied',
                        message: adminError?.message ?? 'Super Admin access required.'
                    });
                }
                return;
            }

            if (adminProfile.role !== 'Super Admin') {
                if (mounted) {
                    setState({ status: 'denied', message: 'Super Admin access required.' });
                }
                return;
            }

            if (mounted) setState({ status: 'allowed' });
        };

        verifySuperAdmin();

        const authListener = supabase?.auth.onAuthStateChange(() => {
            verifySuperAdmin();
        });

        return () => {
            mounted = false;
            authListener?.data?.subscription?.unsubscribe();
        };
    }, []);

    if (state.status === 'checking') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white text-gray-700">
                Checking permissions...
            </div>
        );
    }

    if (state.status === 'denied') {
        return <Navigate to="/admin/dashboard" state={{ from: location }} replace />;
    }

    return <Outlet />;
};
