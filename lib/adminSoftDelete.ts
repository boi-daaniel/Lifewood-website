const readIds = (storageKey: string): string[] => {
    if (typeof window === 'undefined') return [];

    try {
        const raw = window.localStorage.getItem(storageKey);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
    } catch {
        return [];
    }
};

const writeIds = (storageKey: string, ids: string[]) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(storageKey, JSON.stringify(ids));
};

export const getSoftDeletedIds = (storageKey: string) => readIds(storageKey);

export const addSoftDeletedId = (storageKey: string, id: string) => {
    const ids = readIds(storageKey);
    if (ids.includes(id)) return ids;
    const next = [...ids, id];
    writeIds(storageKey, next);
    return next;
};

export const removeSoftDeletedId = (storageKey: string, id: string) => {
    const next = readIds(storageKey).filter((item) => item !== id);
    writeIds(storageKey, next);
    return next;
};

export const isSoftDeleted = (storageKey: string, id: string) => readIds(storageKey).includes(id);

export const SOFT_DELETE_KEYS = {
    contactMessages: 'lifewood_soft_deleted_contact_messages',
    applicants: 'lifewood_soft_deleted_applicants',
    admins: 'lifewood_soft_deleted_admins'
} as const;
