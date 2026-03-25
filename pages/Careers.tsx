import React, { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import './Careers.css';
import './ElegantTextEffects.css';
import { submitContactMessage } from '../lib/contactMessages';
import { supabase } from '../lib/supabaseClient';
import DarkVeil from '../components/DarkVeil';

const positions = [
    'Casual Video Models (Video Data Collection)',
    'Moderator & Voice Participants (Voice Data Collection)',
    'Data Annotator (Iphone User)',
    'Image Data Collector (Capturing Text - Rich Items)',
    'Data Curation (Genealogy Project)',
    'Voice Recording Participants (Short Sentences Recording)',
    'Text Data Collector (Gemini User)',
    'Voice Recording Participants (FaceTime Audio Recording Session)',
    'Image Data Collector (Capturing Home Dishes and Menu)',
    'Al Video Creator/Editor',
    'Genealogy Project Team Leader',
    "Data Scraper/Crawler (Int'l Text)",
    'Social Media Content Marketing',
    'Admin Accounting',
    'HR/Admin Assistant',
    'Marketing & Sales Executive',
    'Operation Manager',
    'Intern (Applicable PH Only)'
];

type CareerView = 'apply' | 'message';

const NAME_SANITIZE_REGEX = /[^A-Za-z\s.'-]/g;
const CONTACT_SANITIZE_REGEX = /[^0-9()+\-\s]/g;
const ADDRESS_SANITIZE_REGEX = /[^A-Za-z0-9\s.,#'/-]/g;
const COUNTRY_SANITIZE_REGEX = /[^A-Za-z\s.'-]/g;
const MESSAGE_SANITIZE_REGEX = /[^A-Za-z0-9\s.,!?'"()&:/@#%+-]/g;

const NAME_REGEX = /^[A-Za-z][A-Za-z\s.'-]{1,79}$/;
const CONTACT_REGEX = /^[0-9()+\-\s]{7,20}$/;
const ADDRESS_REGEX = /^[A-Za-z0-9\s.,#'/-]{5,160}$/;
const COUNTRY_REGEX = /^[A-Za-z][A-Za-z\s.'-]{1,79}$/;
const MESSAGE_REGEX = /^[A-Za-z0-9\s.,!?'"()&:/@#%+-]{10,1000}$/;

const sanitizeApplicationField = (field: string, value: string) => {
    switch (field) {
        case 'name':
            return value.replace(NAME_SANITIZE_REGEX, '');
        case 'contactNumber':
            return value.replace(CONTACT_SANITIZE_REGEX, '');
        case 'address':
            return value.replace(ADDRESS_SANITIZE_REGEX, '');
        case 'country':
            return value.replace(COUNTRY_SANITIZE_REGEX, '');
        default:
            return value;
    }
};

const sanitizeMessageField = (field: string, value: string) => {
    switch (field) {
        case 'name':
            return value.replace(NAME_SANITIZE_REGEX, '');
        case 'message':
            return value.replace(MESSAGE_SANITIZE_REGEX, '');
        default:
            return value;
    }
};

export const Careers: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeView, setActiveView] = useState<CareerView>('apply');

    const [applyForm, setApplyForm] = useState({
        name: '',
        contactNumber: '',
        gender: '',
        age: '',
        email: '',
        address: '',
        country: '',
        position: '',
        resumeFile: null as File | null
    });
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [contactWebsite, setContactWebsite] = useState('');
    const [contactFormStartedAt, setContactFormStartedAt] = useState(() => Date.now());

    const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
    const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);
    const [applyStatus, setApplyStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [messageStatus, setMessageStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const handleApplyChange =
        (field: keyof typeof applyForm) =>
        (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
            const nextValue = sanitizeApplicationField(field, event.target.value);
            setApplyForm((prev) => ({ ...prev, [field]: nextValue }));
        };

    const handleMessageChange =
        (field: keyof typeof contactForm) =>
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const nextValue = sanitizeMessageField(field, event.target.value);
            setContactForm((prev) => ({ ...prev, [field]: nextValue }));
        };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setApplyForm((prev) => ({ ...prev, resumeFile: file }));
    };

    const getApplicationValidationError = () => {
        if (!NAME_REGEX.test(applyForm.name.trim())) {
            return 'Please enter a valid full name using letters and basic punctuation only.';
        }
        if (!CONTACT_REGEX.test(applyForm.contactNumber.trim())) {
            return 'Please enter a valid contact number using numbers and phone symbols only.';
        }
        if (applyForm.address.trim() && !ADDRESS_REGEX.test(applyForm.address.trim())) {
            return 'Please enter a valid address using letters, numbers, and basic punctuation only.';
        }
        if (applyForm.country.trim() && !COUNTRY_REGEX.test(applyForm.country.trim())) {
            return 'Please enter a valid country using letters and basic punctuation only.';
        }
        return null;
    };

    const getContactValidationError = () => {
        if (!NAME_REGEX.test(contactForm.name.trim())) {
            return 'Please enter a valid name using letters and basic punctuation only.';
        }
        if (!MESSAGE_REGEX.test(contactForm.message.trim())) {
            return 'Please enter a valid message using letters, numbers, and basic punctuation only.';
        }
        return null;
    };

    const handleApplicationSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setApplyStatus(null);

        if (!supabase) {
            setApplyStatus({ type: 'error', message: 'Supabase is not configured yet.' });
            return;
        }

        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
        const adminEmail = import.meta.env.VITE_EMAILJS_ADMIN_EMAIL as string | undefined;

        if (!serviceId || !publicKey || !templateId || !adminEmail) {
            setApplyStatus({ type: 'error', message: 'EmailJS is not configured yet.' });
            return;
        }

        if (!applyForm.name || !applyForm.email || !applyForm.position || !applyForm.resumeFile) {
            setApplyStatus({ type: 'error', message: 'Please fill out the required fields and attach your resume.' });
            return;
        }

        const validationError = getApplicationValidationError();
        if (validationError) {
            setApplyStatus({ type: 'error', message: validationError });
            return;
        }

        setIsSubmittingApplication(true);
        try {
            const file = applyForm.resumeFile;
            const extension = file.name.split('.').pop() || 'pdf';
            const safeName = applyForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24);
            const uniqueId =
                typeof crypto !== 'undefined' && 'randomUUID' in crypto
                    ? crypto.randomUUID()
                    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
            const fileName = `${safeName}-${uniqueId}.${extension}`;

            const { error: uploadError } = await supabase.storage
                .from('resumes')
                .upload(fileName, file, { cacheControl: '3600', upsert: false });

            if (uploadError) throw uploadError;

            const { error: insertError } = await supabase.from('career_applications').insert({
                name: applyForm.name,
                contact_number: applyForm.contactNumber,
                gender: applyForm.gender,
                age: applyForm.age ? Number(applyForm.age) : null,
                email: applyForm.email,
                address: applyForm.address,
                country: applyForm.country,
                position: applyForm.position,
                status: 'New',
                record_status: 'Active',
                resume_path: fileName
            });

            if (insertError) throw insertError;

            await emailjs.send(
                serviceId,
                templateId,
                {
                    to_email: adminEmail,
                    to_name: 'Admin',
                    subject: `New application: ${applyForm.position}`,
                    applicant_name: applyForm.name,
                    applicant_email: applyForm.email,
                    applicant_contact: applyForm.contactNumber,
                    applicant_country: applyForm.country,
                    position: applyForm.position,
                    email_type: 'apply_admin'
                },
                publicKey
            );

            await emailjs.send(
                serviceId,
                templateId,
                {
                    to_email: applyForm.email,
                    to_name: applyForm.name,
                    subject: 'Thanks for applying to Lifewood',
                    message: `Thanks for applying for the ${applyForm.position} role. Our team will review your application and get back to you soon.`,
                    position: applyForm.position,
                    email_type: 'apply_user'
                },
                publicKey
            );

            setApplyStatus({
                type: 'success',
                message: 'Application submitted successfully. We will contact you soon.'
            });

            setApplyForm({
                name: '',
                contactNumber: '',
                gender: '',
                age: '',
                email: '',
                address: '',
                country: '',
                position: '',
                resumeFile: null
            });
        } catch (error) {
            setApplyStatus({
                type: 'error',
                message: error instanceof Error ? error.message : 'Failed to submit application.'
            });
        } finally {
            setIsSubmittingApplication(false);
        }
    };

    const handleMessageSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessageStatus(null);

        if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
            setMessageStatus({ type: 'error', message: 'Please fill out all fields before sending.' });
            return;
        }

        const validationError = getContactValidationError();
        if (validationError) {
            setMessageStatus({ type: 'error', message: validationError });
            return;
        }

        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
        const adminEmail = import.meta.env.VITE_EMAILJS_ADMIN_EMAIL as string | undefined;

        if (!serviceId || !publicKey || !templateId || !adminEmail) {
            setMessageStatus({ type: 'error', message: 'EmailJS is not configured yet.' });
            return;
        }

        setIsSubmittingMessage(true);
        try {
            const controller = new AbortController();
            const timeoutId = window.setTimeout(() => controller.abort(), 12000);
            const normalizedEmail = contactForm.email.trim().toLowerCase();

            try {
                const submission = await submitContactMessage(
                    {
                        name: contactForm.name,
                        email: normalizedEmail,
                        message: contactForm.message,
                        website: contactWebsite,
                        formStartedAt: contactFormStartedAt
                    },
                    controller.signal
                );

                if (submission.filtered) {
                    setMessageStatus({
                        type: 'success',
                        message: 'Thanks for contacting us. We will get back to you as soon as possible.'
                    });
                    setContactForm({
                        name: '',
                        email: '',
                        message: ''
                    });
                    setContactWebsite('');
                    setContactFormStartedAt(Date.now());
                    return;
                }
            } finally {
                window.clearTimeout(timeoutId);
            }

            await emailjs.send(
                serviceId,
                templateId,
                {
                    to_email: adminEmail,
                    to_name: 'Admin',
                    subject: `New contact message from ${contactForm.name}`,
                    message: contactForm.message,
                    from_name: contactForm.name,
                    from_email: normalizedEmail,
                    email_type: 'contact_admin'
                },
                publicKey
            );

            await emailjs.send(
                serviceId,
                templateId,
                {
                    to_email: normalizedEmail,
                    to_name: contactForm.name,
                    subject: 'Thanks for contacting Lifewood',
                    message: 'Thanks for contacting us. We will get back to you as soon as possible.',
                    from_name: 'Lifewood',
                    email_type: 'contact_user'
                },
                publicKey
            );

            setMessageStatus({
                type: 'success',
                message: 'Thanks for contacting us. We will get back to you as soon as possible.'
            });

            setContactForm({
                name: '',
                email: '',
                message: ''
            });
            setContactWebsite('');
            setContactFormStartedAt(Date.now());
        } catch (error) {
            setMessageStatus({
                type: 'error',
                message:
                    error instanceof DOMException && error.name === 'AbortError'
                        ? 'Request timed out. Please try again.'
                        : error instanceof Error
                          ? error.message
                          : 'Something went wrong. Please try again.'
            });
        } finally {
            setIsSubmittingMessage(false);
        }
    };

    const switchTo = (view: CareerView) => {
        if (view === activeView) return;
        if (view === 'message') {
            setSearchParams({ view: 'message' });
        } else {
            setSearchParams({});
        }
        setActiveView(view);
    };

    useEffect(() => {
        const requestedView = searchParams.get('view');
        setActiveView(requestedView === 'message' ? 'message' : 'apply');
    }, [searchParams]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="elegant-textfx min-h-screen bg-[#f3f3f3] pb-24 pt-20 transition-colors duration-300 dark:bg-brand-green dark:[&_blockquote]:text-gray-100 dark:[&_h1]:text-white dark:[&_h2]:text-white dark:[&_h3]:text-white dark:[&_h4]:text-white dark:[&_p]:text-gray-200 md:pt-24"
        >
            <section className="container mx-auto px-6">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-8">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#6b665d]">
                                Careers Hub
                            </p>
                            <h1 className="mt-3 text-4xl font-semibold leading-tight text-[#101820] sm:text-5xl">
                                {activeView === 'apply' ? 'Apply to Lifewood' : 'Message Us'}
                            </h1>
                            <p className="mt-3 max-w-2xl text-base leading-7 text-[#4f5a63]">
                                {activeView === 'apply'
                                    ? 'Join a global team delivering impactful AI data solutions. Submit your application and our team will reach out shortly.'
                                    : 'Have a question before applying? Send us a message and our team will get back to you as soon as possible.'}
                            </p>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-[2rem] bg-black p-6 shadow-[0_18px_46px_rgba(5,24,18,0.42)] md:p-8">
                        <div className="pointer-events-none absolute inset-0">
                            <DarkVeil
                                hueShift={30}
                                noiseIntensity={0.05}
                                scanlineIntensity={0.04}
                                speed={0.45}
                                scanlineFrequency={1.3}
                                warpAmount={0.16}
                            />
                            <div className="absolute inset-0 bg-black/55" />
                        </div>

                        <div className="relative z-10 mb-6 flex items-center justify-center">
                            <div className="inline-flex rounded-full border border-white/10 bg-white/6 p-1">
                                <button
                                    type="button"
                                    onClick={() => switchTo('apply')}
                                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition ${
                                        activeView === 'apply'
                                            ? 'bg-[#ffb347] text-black'
                                            : 'text-white/70 hover:text-white'
                                    }`}
                                >
                                    Application Form
                                </button>
                                <button
                                    type="button"
                                    onClick={() => switchTo('message')}
                                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition ${
                                        activeView === 'message'
                                            ? 'bg-[#ffb347] text-black'
                                            : 'text-white/70 hover:text-white'
                                    }`}
                                >
                                    Message Us
                                </button>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <AnimatePresence mode="wait">
                                {activeView === 'apply' ? (
                                    <motion.form
                                        key="application-form"
                                        initial={{ opacity: 0, x: 24 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -24 }}
                                        transition={{ duration: 0.28 }}
                                        onSubmit={handleApplicationSubmit}
                                        className="relative z-10"
                                    >
                                    <h2 className="text-2xl font-semibold text-white">Application Form</h2>
                                    <p className="mt-2 text-sm text-white/70">Fields marked with * are required.</p>

                                    <div className="mt-6 grid gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-white/90">Full name *</label>
                                            <input
                                                type="text"
                                                value={applyForm.name}
                                                onChange={handleApplyChange('name')}
                                                maxLength={80}
                                                required
                                                className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/20 px-4 text-white outline-none focus:border-white/30"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-white/90">Contact number *</label>
                                            <input
                                                type="tel"
                                                value={applyForm.contactNumber}
                                                onChange={handleApplyChange('contactNumber')}
                                                maxLength={20}
                                                required
                                                className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/20 px-4 text-white outline-none focus:border-white/30"
                                            />
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="text-sm font-medium text-white/90">Gender</label>
                                                <select
                                                    value={applyForm.gender}
                                                    onChange={handleApplyChange('gender')}
                                                    className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/20 px-4 text-white outline-none focus:border-white/30"
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Non-binary">Non-binary</option>
                                                    <option value="Prefer not to say">Prefer not to say</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-white/90">Age</label>
                                                <input
                                                    type="number"
                                                    min="18"
                                                    value={applyForm.age}
                                                    onChange={handleApplyChange('age')}
                                                    className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/20 px-4 text-white outline-none focus:border-white/30"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-white/90">Email address *</label>
                                            <input
                                                type="email"
                                                value={applyForm.email}
                                                onChange={handleApplyChange('email')}
                                                required
                                                className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/20 px-4 text-white outline-none focus:border-white/30"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-white/90">Address</label>
                                            <input
                                                type="text"
                                                value={applyForm.address}
                                                onChange={handleApplyChange('address')}
                                                maxLength={160}
                                                className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/20 px-4 text-white outline-none focus:border-white/30"
                                            />
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="text-sm font-medium text-white/90">Country</label>
                                            <input
                                                type="text"
                                                value={applyForm.country}
                                                onChange={handleApplyChange('country')}
                                                maxLength={80}
                                                className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/20 px-4 text-white outline-none focus:border-white/30"
                                            />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-white/90">Position *</label>
                                                <select
                                                    value={applyForm.position}
                                                    onChange={handleApplyChange('position')}
                                                    required
                                                    className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-white px-4 text-black outline-none focus:border-white/30"
                                                >
                                                    <option value="">Select a role</option>
                                                    {positions.map((role) => (
                                                        <option key={role} value={role}>
                                                            {role}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-white/90">Resume / CV *</label>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={handleFileChange}
                                                required
                                                className="mt-2 w-full text-sm text-white/80 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-white/20"
                                            />
                                        </div>
                                    </div>

                                    {applyStatus && (
                                        <div
                                            className={`mt-4 rounded-lg border px-3 py-2 text-xs ${
                                                applyStatus.type === 'success'
                                                    ? 'border-emerald-300/40 bg-emerald-200/10 text-emerald-100'
                                                    : 'border-red-300/40 bg-red-200/10 text-red-100'
                                            }`}
                                        >
                                            {applyStatus.message}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmittingApplication}
                                        className="mt-5 h-11 w-full rounded-full bg-[#0a2f22] font-semibold text-white transition-colors hover:bg-[#0d3b2b] disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {isSubmittingApplication ? 'Submitting...' : 'Submit Application'}
                                    </button>
                                    </motion.form>
                                ) : (
                                    <motion.form
                                        key="message-form"
                                        initial={{ opacity: 0, x: -24 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 24 }}
                                        transition={{ duration: 0.28 }}
                                        onSubmit={handleMessageSubmit}
                                        className="relative z-10"
                                    >
                                    <h2 className="text-2xl font-semibold text-white">Message Us</h2>
                                    <p className="mt-2 text-sm text-white/70">
                                        Need help before applying? Send us your question here.
                                    </p>

                                    <div className="mt-6 space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-white/90">Name</label>
                                            <input
                                                type="text"
                                                value={contactForm.name}
                                                onChange={handleMessageChange('name')}
                                                maxLength={80}
                                                required
                                                className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/20 px-4 text-white outline-none focus:border-white/30"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-white/90">Email</label>
                                            <input
                                                type="email"
                                                value={contactForm.email}
                                                onChange={handleMessageChange('email')}
                                                required
                                                className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/20 px-4 text-white outline-none focus:border-white/30"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-white/90">Message</label>
                                            <textarea
                                                value={contactForm.message}
                                                onChange={handleMessageChange('message')}
                                                required
                                                maxLength={1000}
                                                placeholder="Message here..."
                                                className="mt-2 min-h-[190px] w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/45 focus:border-white/30 resize-none"
                                            />
                                        </div>
                                        <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden opacity-0">
                                            <label htmlFor="careers-contact-website">Website</label>
                                            <input
                                                id="careers-contact-website"
                                                type="text"
                                                tabIndex={-1}
                                                autoComplete="off"
                                                value={contactWebsite}
                                                onChange={(event) => setContactWebsite(event.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {messageStatus && (
                                        <div
                                            className={`mt-4 rounded-lg border px-3 py-2 text-xs ${
                                                messageStatus.type === 'success'
                                                    ? 'border-emerald-300/40 bg-emerald-200/10 text-emerald-100'
                                                    : 'border-red-300/40 bg-red-200/10 text-red-100'
                                            }`}
                                        >
                                            {messageStatus.message}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmittingMessage}
                                        className="mt-5 h-11 w-full rounded-full bg-[#0a2f22] font-semibold text-white transition-colors hover:bg-[#0d3b2b] disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {isSubmittingMessage ? 'Sending...' : 'Send Message'}
                                    </button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    );
};
