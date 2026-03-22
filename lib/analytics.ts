import { supabase } from './supabaseClient';

const SESSION_KEY = 'lifewood_session_id';
const PAGE_THROTTLE_MS = 30_000;

const getSessionId = () => {
    if (typeof window === 'undefined') return null;
    try {
        const existing = window.localStorage.getItem(SESSION_KEY);
        if (existing) return existing;
        const generated =
            typeof crypto !== 'undefined' && 'randomUUID' in crypto
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        window.localStorage.setItem(SESSION_KEY, generated);
        return generated;
    } catch {
        return null;
    }
};

export const trackPageView = async (path: string) => {
    if (!supabase || typeof window === 'undefined') return;

    try {
        const now = Date.now();
        const throttleKey = `lifewood_last_view_${path}`;
        const lastValue = window.sessionStorage.getItem(throttleKey);
        if (lastValue && now - Number(lastValue) < PAGE_THROTTLE_MS) return;
        window.sessionStorage.setItem(throttleKey, String(now));

        const sessionId = getSessionId();
        await supabase.from('page_views').insert({
            path,
            session_id: sessionId,
            referrer: document.referrer || null,
            user_agent: navigator.userAgent
        });
    } catch {
        // Fail silently to avoid blocking navigation.
    }
};
