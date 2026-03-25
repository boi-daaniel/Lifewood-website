import { supabase } from './supabaseClient';

export const CONTACT_MESSAGE_LIMIT = 2;
const BROWSER_CONTACT_LIMIT = 2;
const BROWSER_CONTACT_WINDOW_MS = 24 * 60 * 60 * 1000;
const CONTACT_STORAGE_KEY = 'lifewood_contact_submission_timestamps';

type ContactMessagePayload = {
    name: string;
    email: string;
    message: string;
    website?: string;
    formStartedAt?: number;
};

type ContactMessageResult = {
    email: string;
    remainingMessages: number;
    filtered?: boolean;
};

const getBrowserSubmissionTimestamps = () => {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const storedValue = window.localStorage.getItem(CONTACT_STORAGE_KEY);
        const parsedValue = storedValue ? JSON.parse(storedValue) : [];
        if (!Array.isArray(parsedValue)) {
            return [];
        }

        const cutoff = Date.now() - BROWSER_CONTACT_WINDOW_MS;
        return parsedValue.filter((value): value is number => typeof value === 'number' && value > cutoff);
    } catch {
        return [];
    }
};

const saveBrowserSubmissionTimestamp = () => {
    if (typeof window === 'undefined') {
        return;
    }

    const nextTimestamps = [...getBrowserSubmissionTimestamps(), Date.now()];
    window.localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(nextTimestamps));
};

const enforceBrowserSubmissionLimit = () => {
    const timestamps = getBrowserSubmissionTimestamps();
    if (timestamps.length >= BROWSER_CONTACT_LIMIT) {
        throw new Error('This browser has reached the contact message limit. Please try again later.');
    }
};

export const submitContactMessage = async (
    payload: ContactMessagePayload,
    signal?: AbortSignal
): Promise<ContactMessageResult> => {
    enforceBrowserSubmissionLimit();

    const normalizedPayload = {
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        message: payload.message.trim(),
        website: payload.website?.trim() ?? '',
        formStartedAt: payload.formStartedAt
    };

    try {
        const response = await fetch('/api/contact/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(normalizedPayload),
            signal
        });

        const contentType = response.headers.get('content-type') ?? '';
        const result = contentType.includes('application/json')
            ? await response.json()
            : { error: await response.text() };

        if (!response.ok) {
            if (response.status === 400 || response.status === 429) {
                throw new Error(result?.error ?? 'Failed to submit contact message.');
            }

            throw new Error('__CONTACT_API_FALLBACK__');
        }

        const submissionResult = {
            email: typeof result?.email === 'string' ? result.email : normalizedPayload.email,
            remainingMessages:
                typeof result?.remainingMessages === 'number' ? result.remainingMessages : CONTACT_MESSAGE_LIMIT - 1,
            filtered: Boolean(result?.filtered)
        };

        if (!submissionResult.filtered) {
            saveBrowserSubmissionTimestamp();
        }

        return submissionResult;
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw error;
        }
        if (error instanceof Error && error.message !== '__CONTACT_API_FALLBACK__') {
            throw error;
        }
        if (!supabase) {
            throw new Error('Contact submission is not configured yet.');
        }
    }

    const { count, error: countError } = await supabase
        .from('contact_messages')
        .select('id', { count: 'exact', head: true })
        .ilike('email', normalizedPayload.email);

    if (countError) {
        throw countError;
    }

    if ((count ?? 0) >= CONTACT_MESSAGE_LIMIT) {
        throw new Error('This email has already reached the 2-message limit for contact requests.');
    }

    const { error: insertError } = await supabase.from('contact_messages').insert({
        name: normalizedPayload.name,
        email: normalizedPayload.email,
        message: normalizedPayload.message,
        record_status: 'Active'
    });

    if (insertError) {
        throw insertError;
    }

    const submissionResult = {
        email: normalizedPayload.email,
        remainingMessages: Math.max(0, CONTACT_MESSAGE_LIMIT - ((count ?? 0) + 1)),
        filtered: false
    };

    saveBrowserSubmissionTimestamp();
    return submissionResult;
};
