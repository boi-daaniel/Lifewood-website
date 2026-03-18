import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

export default async function handler(req: { method?: string; body?: any }, res: any) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const name = String(req.body?.name ?? '').trim();
    const email = String(req.body?.email ?? '').trim();
    const message = String(req.body?.message ?? '').trim();

    if (!name || !email || !message) {
        res.status(400).json({ error: 'Name, email, and message are required.' });
        return;
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const resendFrom = process.env.RESEND_FROM;
    const resendTo = process.env.RESEND_TO;
    const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!resendApiKey || !resendFrom || !resendTo) {
        res.status(500).json({ error: 'Email service not configured.' });
        return;
    }

    const resend = new Resend(resendApiKey);
    const supabaseAdmin =
        supabaseUrl && supabaseServiceRoleKey
            ? createClient(supabaseUrl, supabaseServiceRoleKey, {
                  auth: { persistSession: false }
              })
            : null;
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);

    try {
        if (supabaseAdmin) {
            const { error: insertError } = await supabaseAdmin.from('contact_messages').insert({
                name,
                email,
                message
            });

            if (insertError) {
                throw insertError;
            }
        }

        await resend.emails.send({
            from: resendFrom,
            to: resendTo,
            subject: `New contact form submission from ${name}`,
            html: `
                <h2>New Contact Message</h2>
                <p><strong>Name:</strong> ${safeName}</p>
                <p><strong>Email:</strong> ${safeEmail}</p>
                <p><strong>Message:</strong></p>
                <p>${safeMessage.replace(/\n/g, '<br />')}</p>
            `
        });

        await resend.emails.send({
            from: resendFrom,
            to: email,
            subject: 'Thanks for contacting Lifewood',
            html: `
                <p>Hi ${safeName},</p>
                <p>Thanks for contacting us. We will get back to you as soon as possible.</p>
                <p>— Lifewood Team</p>
            `
        });

        res.status(200).json({ ok: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send email.' });
    }
}
