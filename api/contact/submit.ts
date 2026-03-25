import { createClient } from '@supabase/supabase-js';

const CONTACT_MESSAGE_LIMIT = 2;
const CONTACT_RATE_WINDOW_MS = 60 * 60 * 1000;
const CONTACT_RATE_LIMIT_PER_SENDER = 3;
const MIN_FORM_FILL_MS = 2500;

type RequestBody = {
    name?: string;
    email?: string;
    message?: string;
    website?: string;
    formStartedAt?: number;
};

type BasicRequest = {
    method?: string;
    body?: any;
    headers?: Record<string, string | string[] | undefined>;
};

const globalRateStore = globalThis as typeof globalThis & {
    __lifewoodContactRateStore__?: Map<string, number[]>;
};

const getRateStore = () => {
    if (!globalRateStore.__lifewoodContactRateStore__) {
        globalRateStore.__lifewoodContactRateStore__ = new Map<string, number[]>();
    }
    return globalRateStore.__lifewoodContactRateStore__;
};

const getHeaderValue = (headers: BasicRequest['headers'], name: string) => {
    const value = headers?.[name];
    return Array.isArray(value) ? value[0] : value;
};

const getClientIp = (headers: BasicRequest['headers']) => {
    const forwardedFor = getHeaderValue(headers, 'x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0]?.trim() ?? 'unknown-ip';
    }

    return (
        getHeaderValue(headers, 'x-real-ip') ??
        getHeaderValue(headers, 'x-vercel-forwarded-for') ??
        'unknown-ip'
    );
};

const getSenderFingerprint = (headers: BasicRequest['headers']) => {
    const ip = getClientIp(headers);
    const userAgent = (getHeaderValue(headers, 'user-agent') ?? 'unknown-agent').slice(0, 120);
    return `${ip}::${userAgent}`;
};

const enforceSenderRateLimit = (fingerprint: string) => {
    const now = Date.now();
    const cutoff = now - CONTACT_RATE_WINDOW_MS;
    const store = getRateStore();
    const recentHits = (store.get(fingerprint) ?? []).filter((timestamp) => timestamp > cutoff);

    if (recentHits.length >= CONTACT_RATE_LIMIT_PER_SENDER) {
        store.set(fingerprint, recentHits);
        return false;
    }

    recentHits.push(now);
    store.set(fingerprint, recentHits);
    return true;
};

export default async function handler(req: BasicRequest, res: any) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed.' });
        return;
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
        res.status(500).json({ error: 'Server not configured.' });
        return;
    }

    const body: RequestBody = req.body ?? {};
    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim().toLowerCase();
    const message = String(body.message ?? '').trim();
    const website = String(body.website ?? '').trim();
    const formStartedAt =
        typeof body.formStartedAt === 'number' && Number.isFinite(body.formStartedAt)
            ? body.formStartedAt
            : null;

    if (!name || !email || !message) {
        res.status(400).json({ error: 'Name, email, and message are required.' });
        return;
    }

    if (website) {
        res.status(200).json({ success: true, filtered: true });
        return;
    }

    if (formStartedAt && Date.now() - formStartedAt < MIN_FORM_FILL_MS) {
        res.status(429).json({
            error: 'Please wait a moment before sending your message.'
        });
        return;
    }

    const senderFingerprint = getSenderFingerprint(req.headers);
    if (!enforceSenderRateLimit(senderFingerprint)) {
        res.status(429).json({
            error: 'Too many messages were sent from this connection. Please try again later.'
        });
        return;
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
        auth: { persistSession: false }
    });

    const { count, error: countError } = await supabaseAdmin
        .from('contact_messages')
        .select('id', { count: 'exact', head: true })
        .ilike('email', email);

    if (countError) {
        res.status(500).json({ error: countError.message });
        return;
    }

    if ((count ?? 0) >= CONTACT_MESSAGE_LIMIT) {
        res.status(429).json({
            error: 'This email has already reached the 2-message limit for contact requests.'
        });
        return;
    }

    const { error: insertError } = await supabaseAdmin.from('contact_messages').insert({
        name,
        email,
        message,
        record_status: 'Active'
    });

    if (insertError) {
        res.status(500).json({ error: insertError.message });
        return;
    }

    res.status(200).json({
        success: true,
        email,
        remainingMessages: Math.max(0, CONTACT_MESSAGE_LIMIT - ((count ?? 0) + 1))
    });
}
