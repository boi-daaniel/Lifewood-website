/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL?: string;
    readonly VITE_SUPABASE_ANON_KEY?: string;
    readonly VITE_ADMIN_EMAIL_DOMAIN?: string;
    readonly VITE_EMAILJS_SERVICE_ID?: string;
    readonly VITE_EMAILJS_PUBLIC_KEY?: string;
    readonly VITE_EMAILJS_TEMPLATE_ID?: string;
    readonly VITE_EMAILJS_ADMIN_EMAIL?: string;
    readonly VITE_PASSWORD_RESET_REDIRECT?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
