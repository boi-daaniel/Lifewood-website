import { Resend } from 'resend';

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
    const position = String(req.body?.position ?? '').trim();
    const contactNumber = String(req.body?.contactNumber ?? '').trim();
    const country = String(req.body?.country ?? '').trim();

    if (!name || !email || !position) {
        res.status(400).json({ error: 'Name, email, and position are required.' });
        return;
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const resendFrom = process.env.RESEND_FROM;
    const resendTo = process.env.RESEND_TO;

    if (!resendApiKey || !resendFrom || !resendTo) {
        res.status(500).json({ error: 'Email service not configured.' });
        return;
    }

    const resend = new Resend(resendApiKey);
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePosition = escapeHtml(position);
    const safeContact = escapeHtml(contactNumber);
    const safeCountry = escapeHtml(country);

    try {
        await resend.emails.send({
            from: resendFrom,
            to: resendTo,
            subject: `New application: ${position} (${name})`,
            html: `
                <h2>New Career Application</h2>
                <p><strong>Name:</strong> ${safeName}</p>
                <p><strong>Email:</strong> ${safeEmail}</p>
                <p><strong>Position:</strong> ${safePosition}</p>
                ${safeContact ? `<p><strong>Contact:</strong> ${safeContact}</p>` : ''}
                ${safeCountry ? `<p><strong>Country:</strong> ${safeCountry}</p>` : ''}
            `
        });

        const thankYouHtml = `
            <div style="font-family: Arial, sans-serif; color: #1f2b2a; background: #ffffff; padding: 24px;">
                <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 28px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <img src="https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png?width=600&height=170" alt="Lifewood" style="height: 38px;" />
                    </div>
                    <p style="margin-top: 24px; font-size: 14px;">Dear ${safeName},</p>
                    <p style="font-size: 14px; line-height: 1.6;">
                        Thank you for applying to Lifewood. We have received your application for
                        <strong>${safePosition}</strong>.
                    </p>
                    <p style="font-size: 14px; line-height: 1.6;">
                        Our team will review your submission and get back to you as soon as possible.
                        If we need additional information, we will reach out using this email address.
                    </p>
                    <div style="margin-top: 20px;">
                        <p style="font-size: 14px; margin-bottom: 0;">Best regards,</p>
                        <p style="font-size: 14px; font-weight: 600; margin-top: 6px;">Lifewood</p>
                    </div>
                    <div style="margin-top: 22px; font-size: 11px; color: #6b7280;">
                        Copyright © Lifewood. All rights reserved.
                    </div>
                </div>
            </div>
        `;

        await resend.emails.send({
            from: resendFrom,
            to: email,
            subject: 'Thanks for applying to Lifewood',
            html: thankYouHtml,
            text: `Dear ${name},\n\nThank you for applying to Lifewood. We have received your application for ${position}.\n\nOur team will review your submission and get back to you as soon as possible.\n\nBest regards,\nLifewood`
        });

        res.status(200).json({ ok: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send application email.' });
    }
}
