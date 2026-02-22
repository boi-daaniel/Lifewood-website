import React from 'react';
import { motion } from 'framer-motion';

type TermsSection = {
    title: string;
    paragraphs: string[];
};

const termsSections: TermsSection[] = [
    {
        title: '1. Acceptance of these Terms',
        paragraphs: [
            'These Terms and Conditions govern your access to and use of Lifewood websites, products, and services.',
            'By accessing or using the service, you agree to be bound by these Terms. If you do not agree, do not use the service.'
        ]
    },
    {
        title: '2. Who we are and how to contact us',
        paragraphs: [
            'This website is operated by Lifewood Data Technology Inc. and its related entities.',
            'You can contact us through our Contact Us page for support, account, or legal inquiries.'
        ]
    },
    {
        title: '3. Changes to these Terms and to the Service',
        paragraphs: [
            'We may update these Terms from time to time to reflect legal, operational, and service changes.',
            'Where required, we will notify users of material changes before they take effect.'
        ]
    },
    {
        title: '4. Eligibility',
        paragraphs: [
            'You must be at least the age of legal majority in your jurisdiction, or have valid legal authorization, to use this service.',
            'You represent that all information you provide is accurate and complete.'
        ]
    },
    {
        title: '5. Your account and responsibilities',
        paragraphs: [
            'You are responsible for safeguarding your credentials and all activity under your account.',
            'You must promptly notify us if you suspect unauthorized access or misuse of your account.'
        ]
    },
    {
        title: '6. Prohibited use and acceptable behavior',
        paragraphs: [
            'You must not misuse the service.',
            'You may not: violate laws or regulations; upload malicious code; attempt unauthorized access; interfere with service availability; scrape or reverse engineer restricted systems; or impersonate another person or entity.'
        ]
    },
    {
        title: '7. Intellectual property rights',
        paragraphs: [
            'All content, software, design, trademarks, and branding on this website are owned by Lifewood or our licensors unless otherwise stated.',
            'These Terms do not transfer ownership of any intellectual property rights to you.'
        ]
    },
    {
        title: '8. User content and submissions',
        paragraphs: [
            'If you submit content to us, you retain ownership of your content, but grant us rights needed to process and deliver the requested service.',
            'You are solely responsible for ensuring your submissions do not infringe third-party rights.'
        ]
    },
    {
        title: '9. Subscriptions, billing, and payments',
        paragraphs: [
            'If paid services apply, charges, billing cycles, and payment terms will be specified before checkout.',
            'All fees are due as stated, and late or failed payments may result in service suspension.'
        ]
    },
    {
        title: '10. Third-party links and resources',
        paragraphs: [
            'This website may contain links to third-party websites or resources for your convenience.',
            'We are not responsible for third-party content, security, privacy practices, or availability.'
        ]
    },
    {
        title: '11. Privacy and cookies',
        paragraphs: [
            'Our collection and use of personal information are handled in accordance with applicable data protection laws.',
            'By using the service, you acknowledge that technical and operational data may be processed to maintain and improve service quality.'
        ]
    },
    {
        title: '12. Disclaimer',
        paragraphs: [
            'The service is provided on an "as is" and "as available" basis to the maximum extent permitted by law.',
            'We do not guarantee uninterrupted, error-free, or completely secure operation at all times.'
        ]
    },
    {
        title: '13. Limitation of liability',
        paragraphs: [
            'To the extent permitted by law, Lifewood and its affiliates will not be liable for indirect, incidental, consequential, or special damages.',
            'Our total liability for any claim is limited to the amount paid by you, if any, for the specific service giving rise to the claim.'
        ]
    },
    {
        title: '14. Indemnity',
        paragraphs: [
            'You agree to indemnify and hold harmless Lifewood from claims arising from your misuse of the service, breach of these Terms, or violation of applicable law.'
        ]
    },
    {
        title: '15. Suspension and termination',
        paragraphs: [
            'We may suspend or terminate access where reasonably necessary to protect users, comply with law, or prevent abuse.',
            'You may stop using the service at any time.'
        ]
    },
    {
        title: '16. Governing law and jurisdiction',
        paragraphs: [
            'These Terms are governed by applicable laws of the relevant operating entity and jurisdiction.',
            'Any dispute will be handled in the courts or dispute forum specified by applicable law or contract.'
        ]
    },
    {
        title: '17. Force majeure',
        paragraphs: [
            'We are not liable for delays or failures caused by events beyond reasonable control, including natural disasters, internet outages, labor disruptions, or governmental actions.'
        ]
    },
    {
        title: '18. General terms',
        paragraphs: [
            'If any provision is held invalid or unenforceable, remaining provisions remain in effect.',
            'Our failure to enforce a right is not a waiver of that right.'
        ]
    },
    {
        title: '19. Contact',
        paragraphs: [
            'For legal questions regarding these Terms and Conditions, please contact us via the Contact Us page.'
        ]
    }
];

export const TermsAndConditions: React.FC = () => {
    return (
        <div className="bg-[#f3f3f3] dark:bg-brand-green min-h-screen pt-20 md:pt-24 pb-20 transition-colors duration-300">
            <section className="w-full">
                <div className="container mx-auto px-6 pb-6 md:pb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-4xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-5xl font-semibold text-black dark:text-white leading-tight">
                            Terms and
                            <br />
                            Conditions
                        </h1>
                    </motion.div>
                </div>
            </section>

            <section className="container mx-auto px-6 mt-8">
                <div className="max-w-4xl mx-auto p-0 md:p-0">
                    <div className="space-y-8 md:space-y-10 text-[13px] md:text-sm leading-[1.7] text-black/85 dark:text-gray-100">
                        {termsSections.map((section) => (
                            <div key={section.title}>
                                <h2 className="text-sm md:text-base font-semibold text-black dark:text-white mb-2">{section.title}</h2>
                                <div className="space-y-2">
                                    {section.paragraphs.map((paragraph, idx) => (
                                        <p key={`${section.title}-${idx}`}>{paragraph}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};
