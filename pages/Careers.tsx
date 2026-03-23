import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import './Careers.css';
import './ElegantTextEffects.css';
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

export const Careers: React.FC = () => {
    const [form, setForm] = useState({
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const handleChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setForm((prev) => ({ ...prev, resumeFile: file }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus(null);

        if (!supabase) {
            setStatus({ type: 'error', message: 'Supabase is not configured yet.' });
            return;
        }

        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
        const adminEmail = import.meta.env.VITE_EMAILJS_ADMIN_EMAIL as string | undefined;

        if (!serviceId || !publicKey || !templateId || !adminEmail) {
            setStatus({ type: 'error', message: 'EmailJS is not configured yet.' });
            return;
        }

        if (!form.name || !form.email || !form.position || !form.resumeFile) {
            setStatus({ type: 'error', message: 'Please fill out the required fields and attach your resume.' });
            return;
        }

        setIsSubmitting(true);
        try {
            const file = form.resumeFile;
            const extension = file.name.split('.').pop() || 'pdf';
            const safeName = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24);
            const uniqueId =
                typeof crypto !== 'undefined' && 'randomUUID' in crypto
                    ? crypto.randomUUID()
                    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
            const fileName = `${safeName}-${uniqueId}.${extension}`;

            const { error: uploadError } = await supabase.storage
                .from('resumes')
                .upload(fileName, file, { cacheControl: '3600', upsert: false });

            if (uploadError) {
                throw uploadError;
            }

            const { error: insertError } = await supabase.from('career_applications').insert({
                name: form.name,
                contact_number: form.contactNumber,
                gender: form.gender,
                age: form.age ? Number(form.age) : null,
                email: form.email,
                address: form.address,
                country: form.country,
                position: form.position,
                status: 'New',
                resume_path: fileName
            });

            if (insertError) {
                throw insertError;
            }

            await emailjs.send(
                serviceId,
                templateId,
                {
                    to_email: adminEmail,
                    to_name: 'Admin',
                    subject: `New application: ${form.position}`,
                    applicant_name: form.name,
                    applicant_email: form.email,
                    applicant_contact: form.contactNumber,
                    applicant_country: form.country,
                    position: form.position,
                    email_type: 'apply_admin'
                },
                publicKey
            );

            await emailjs.send(
                serviceId,
                templateId,
                {
                    to_email: form.email,
                    to_name: form.name,
                    subject: 'Thanks for applying to Lifewood',
                    message: `Thanks for applying for the ${form.position} role. Our team will review your application and get back to you soon.`,
                    position: form.position,
                    email_type: 'apply_user'
                },
                publicKey
            );

            setStatus({
                type: 'success',
                message: 'Application submitted successfully. We will contact you soon.'
            });
            setForm({
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
            setStatus({
                type: 'error',
                message: error instanceof Error ? error.message : 'Failed to submit application.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="elegant-textfx bg-[#f3f3f3] dark:bg-brand-green min-h-screen pt-20 md:pt-24 pb-24 transition-colors duration-300 dark:[&_h1]:text-white dark:[&_h2]:text-white dark:[&_h3]:text-white dark:[&_h4]:text-white dark:[&_p]:text-gray-200 dark:[&_blockquote]:text-gray-100"
        >
            <section className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr,1fr] gap-10 items-stretch">
                    <div className="bg-[#e7e1cf] rounded-[2rem] p-8 md:p-12 h-full flex flex-col">
                        <h1 className="text-5xl md:text-6xl font-semibold text-black leading-[0.96]">
                            Apply to Lifewood
                        </h1>
                        <p className="mt-6 text-lg md:text-xl text-gray-700 leading-relaxed max-w-xl">
                            Join a global team delivering impactful AI data solutions. Submit your application and our
                            team will reach out shortly.
                        </p>
                        <div className="mt-8 rounded-[1.5rem] overflow-hidden shadow-[0_18px_40px_rgba(15,23,42,0.16)] flex-1">
                            <img
                                src="https://framerusercontent.com/images/DF2gzPqqVW8QGp7Jxwp1y5257xk.jpg?scale-down-to=2048&width=6000&height=4000"
                                alt="Lifewood team"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="relative overflow-hidden rounded-[2rem] bg-black p-6 md:p-8 shadow-[0_18px_46px_rgba(5,24,18,0.42)] h-full"
                    >
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
                        <div className="relative z-10">
                            <h2 className="text-2xl font-semibold text-white">Application Form</h2>
                            <p className="mt-2 text-sm text-white/70">
                                Fields marked with * are required.
                            </p>

                            <div className="mt-6 grid gap-4">
                            <div>
                                <label className="text-white/90 text-sm font-medium">Full name *</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={handleChange('name')}
                                    required
                                    className="mt-2 w-full h-11 rounded-lg bg-black/20 text-white px-4 outline-none border border-white/10 focus:border-white/30"
                                />
                            </div>
                            <div>
                                <label className="text-white/90 text-sm font-medium">Contact number *</label>
                                <input
                                    type="tel"
                                    value={form.contactNumber}
                                    onChange={handleChange('contactNumber')}
                                    required
                                    className="mt-2 w-full h-11 rounded-lg bg-black/20 text-white px-4 outline-none border border-white/10 focus:border-white/30"
                                />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-white/90 text-sm font-medium">Gender</label>
                                    <select
                                        value={form.gender}
                                        onChange={handleChange('gender')}
                                        className="mt-2 w-full h-11 rounded-lg bg-black/20 text-white px-4 outline-none border border-white/10 focus:border-white/30"
                                    >
                                        <option value="">Select</option>
                                        <option value="Female">Female</option>
                                        <option value="Male">Male</option>
                                        <option value="Non-binary">Non-binary</option>
                                        <option value="Prefer not to say">Prefer not to say</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-white/90 text-sm font-medium">Age</label>
                                    <input
                                        type="number"
                                        min="18"
                                        value={form.age}
                                        onChange={handleChange('age')}
                                        className="mt-2 w-full h-11 rounded-lg bg-black/20 text-white px-4 outline-none border border-white/10 focus:border-white/30"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-white/90 text-sm font-medium">Email address *</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange('email')}
                                    required
                                    className="mt-2 w-full h-11 rounded-lg bg-black/20 text-white px-4 outline-none border border-white/10 focus:border-white/30"
                                />
                            </div>
                            <div>
                                <label className="text-white/90 text-sm font-medium">Address</label>
                                <input
                                    type="text"
                                    value={form.address}
                                    onChange={handleChange('address')}
                                    className="mt-2 w-full h-11 rounded-lg bg-black/20 text-white px-4 outline-none border border-white/10 focus:border-white/30"
                                />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-white/90 text-sm font-medium">Country</label>
                                    <input
                                        type="text"
                                        value={form.country}
                                        onChange={handleChange('country')}
                                        className="mt-2 w-full h-11 rounded-lg bg-black/20 text-white px-4 outline-none border border-white/10 focus:border-white/30"
                                    />
                                </div>
                                <div>
                                    <label className="text-white/90 text-sm font-medium">Position *</label>
                                    <select
                                        value={form.position}
                                        onChange={handleChange('position')}
                                        required
                                        className="mt-2 w-full h-11 rounded-lg bg-white text-black px-4 outline-none border border-white/10 focus:border-white/30"
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
                                <label className="text-white/90 text-sm font-medium">Resume / CV *</label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    required
                                    className="mt-2 w-full text-sm text-white/80 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-white file:font-semibold hover:file:bg-white/20"
                                />
                            </div>
                        </div>

                            {status && (
                                <div
                                    className={`mt-4 rounded-lg border px-3 py-2 text-xs ${
                                        status.type === 'success'
                                            ? 'border-emerald-300/40 bg-emerald-200/10 text-emerald-100'
                                            : 'border-red-300/40 bg-red-200/10 text-red-100'
                                    }`}
                                >
                                    {status.message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="mt-5 w-full h-11 rounded-full bg-[#0a2f22] hover:bg-[#0d3b2b] text-white font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </motion.div>
    );
};
