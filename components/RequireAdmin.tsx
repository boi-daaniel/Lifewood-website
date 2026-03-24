import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

type AdminGateState = {
    status: 'checking' | 'allowed' | 'denied';
    message?: string;
};

export const RequireAdmin: React.FC = () => {
    const location = useLocation();
    const [state, setState] = useState<AdminGateState>({ status: 'checking' });

    useEffect(() => {
        let mounted = true;

        const verifyAdmin = async () => {
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
                .select('id, role')
                .eq('id', sessionData.session.user.id)
                .eq('record_status', 'Active')
                .maybeSingle();

            if (adminError || !adminProfile) {
                if (mounted) {
                    setState({
                        status: 'denied',
                        message: adminError?.message ?? 'Admin access not granted for this account.'
                    });
                }
                return;
            }

            if (mounted) setState({ status: 'allowed' });
        };

        verifyAdmin();

        const authListener = supabase?.auth.onAuthStateChange(() => {
            verifyAdmin();
        });

        return () => {
            mounted = false;
            authListener?.data?.subscription?.unsubscribe();
        };
    }, []);

    if (state.status === 'checking') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white text-gray-700">
                Checking admin access...
            </div>
        );
    }

    if (state.status === 'denied') {
        if (state.message) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-white px-6 text-center text-sm text-gray-700">
                    {state.message}
                </div>
            );
        }

        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};
