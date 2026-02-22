import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, X, Send, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Sender = 'bot' | 'user';

type ChatMessage = {
    id: number;
    sender: Sender;
    text: string;
    quickReplies?: string[];
    ctaLabel?: string;
    ctaPath?: string;
};

const TERMS_KEY = 'lifewood_support_terms_accepted';

const DEFAULT_QUICK_REPLIES = ['AI Services', 'Pricing', 'Careers', 'Talk to support'];

const containsAny = (value: string, patterns: RegExp[]) => patterns.some((pattern) => pattern.test(value));

const buildReply = (rawInput: string): Omit<ChatMessage, 'id' | 'sender'> => {
    const input = rawInput.trim().toLowerCase();

    if (!input) {
        return {
            text: 'Please type a question so I can help.',
            quickReplies: DEFAULT_QUICK_REPLIES
        };
    }

    if (containsAny(input, [/^hi\b/, /^hello\b/, /^hey\b/, /good (morning|afternoon|evening)/])) {
        return {
            text: 'Hello. I can help with services, careers, locations, and contact support.',
            quickReplies: DEFAULT_QUICK_REPLIES
        };
    }

    if (containsAny(input, [/price/, /cost/, /quote/, /budget/, /pricing/])) {
        return {
            text: 'Pricing depends on scope, volume, and delivery model. I can direct you to our support team for a tailored quote.',
            ctaLabel: 'Contact Support',
            ctaPath: '/contact-us',
            quickReplies: ['Talk to support', 'AI Services']
        };
    }

    if (containsAny(input, [/service/, /annotation/, /dataset/, /\bai\b/, /llm/, /data collection/])) {
        return {
            text: 'Lifewood supports AI data services across text, image, audio, and video workflows.',
            ctaLabel: 'View AI Services',
            ctaPath: '/ai-services',
            quickReplies: ['Pricing', 'Talk to support']
        };
    }

    if (containsAny(input, [/career/, /job/, /hiring/, /vacanc/, /apply/])) {
        return {
            text: 'You can explore open roles and opportunities on our Careers page.',
            ctaLabel: 'Open Careers',
            ctaPath: '/careers',
            quickReplies: ['Talk to support']
        };
    }

    if (containsAny(input, [/office/, /location/, /country/, /where/])) {
        return {
            text: 'We operate globally across multiple countries and centers. You can view our footprint on the Offices page.',
            ctaLabel: 'Open Offices',
            ctaPath: '/offices',
            quickReplies: ['Talk to support']
        };
    }

    if (containsAny(input, [/support/, /human/, /agent/, /contact/, /help/])) {
        return {
            text: 'I can connect you with our customer support team.',
            ctaLabel: 'Go to Contact Us',
            ctaPath: '/contact-us',
            quickReplies: ['AI Services', 'Careers']
        };
    }

    return {
        text: 'I can help with services, pricing, careers, offices, and support routing.',
        quickReplies: DEFAULT_QUICK_REPLIES
    };
};

export const SupportChatbot: React.FC = () => {
    const navigate = useNavigate();
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
    const [isTermsChecked, setIsTermsChecked] = useState(false);
    const [draft, setDraft] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const nextIdRef = useRef(1);
    const endRef = useRef<HTMLDivElement | null>(null);

    const welcomeMessage = useMemo<ChatMessage>(
        () => ({
            id: 0,
            sender: 'bot',
            text: 'How can I help today? You can ask about AI services, pricing, careers, or contact support.',
            quickReplies: DEFAULT_QUICK_REPLIES
        }),
        []
    );

    useEffect(() => {
        const persisted = window.localStorage.getItem(TERMS_KEY) === 'true';
        setHasAcceptedTerms(persisted);
    }, []);

    useEffect(() => {
        if (isChatOpen && messages.length === 0) {
            setMessages([welcomeMessage]);
        }
    }, [isChatOpen, messages.length, welcomeMessage]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isChatOpen]);

    const nextId = () => {
        const id = nextIdRef.current;
        nextIdRef.current += 1;
        return id;
    };

    const launchSupport = () => {
        if (!hasAcceptedTerms) {
            setIsTermsOpen(true);
            return;
        }
        setIsChatOpen((prev) => !prev);
    };

    const acceptTerms = () => {
        setHasAcceptedTerms(true);
        window.localStorage.setItem(TERMS_KEY, 'true');
        setIsTermsOpen(false);
        setIsTermsChecked(false);
        setIsChatOpen(true);
    };

    const submitMessage = (text: string) => {
        const userText = text.trim();
        if (!userText) return;

        const reply = buildReply(userText);
        const userMessage: ChatMessage = { id: nextId(), sender: 'user', text: userText };
        const botMessage: ChatMessage = { id: nextId(), sender: 'bot', ...reply };

        setMessages((prev) => [...prev, userMessage, botMessage]);
        setDraft('');
    };

    return (
        <>
            <button
                type="button"
                onClick={launchSupport}
                className="fixed bottom-2 md:bottom-3 right-4 md:right-6 z-[12000] rounded-full bg-white shadow-[0_12px_28px_rgba(15,23,42,0.2)] px-3 py-2 ring-1 ring-black/5 hover:shadow-[0_14px_32px_rgba(15,23,42,0.26)] transition"
                aria-label="Open customer support"
                style={{ bottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
            >
                <span className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-[#f2b142] text-[#0f6b49] grid place-items-center">
                        <MessageCircle size={14} />
                    </span>
                    <span className="rounded-full bg-black text-white text-[11px] md:text-xs font-medium px-3 py-1">How can I help?</span>
                </span>
            </button>

            {isTermsOpen && (
                <div className="fixed inset-0 z-[12020] bg-black/45 backdrop-blur-[1px] flex items-center justify-center px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
                        <h2 className="text-xl font-semibold text-gray-900">Terms and Conditions</h2>
                        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                            This support assistant is rule-based and provides guidance only. Do not share confidential or sensitive
                            personal information in chat messages.
                        </p>
                        <ul className="mt-4 space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2"><ShieldCheck size={15} className="mt-0.5 text-[#0f6b49]" />Responses are informational and may require human follow-up.</li>
                            <li className="flex items-start gap-2"><ShieldCheck size={15} className="mt-0.5 text-[#0f6b49]" />For account-specific help, use the Contact Us page.</li>
                            <li className="flex items-start gap-2"><ShieldCheck size={15} className="mt-0.5 text-[#0f6b49]" />By continuing, you agree to use this support channel responsibly.</li>
                        </ul>

                        <label className="mt-5 inline-flex items-center gap-2 text-sm text-gray-800">
                            <input
                                type="checkbox"
                                checked={isTermsChecked}
                                onChange={(e) => setIsTermsChecked(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            I accept the terms and conditions.
                        </label>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsTermsOpen(false);
                                    setIsTermsChecked(false);
                                }}
                                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={acceptTerms}
                                disabled={!isTermsChecked}
                                className="px-4 py-2 rounded-lg bg-[#0f6b49] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0d5f41] transition"
                            >
                                Accept and Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isChatOpen && (
                <div
                    className="fixed bottom-16 md:bottom-20 right-4 md:right-6 z-[12010] w-[min(92vw,360px)] rounded-2xl bg-white shadow-[0_16px_40px_rgba(15,23,42,0.28)] ring-1 ring-black/5 overflow-hidden"
                    style={{ bottom: 'max(4rem, calc(env(safe-area-inset-bottom) + 3.5rem))' }}
                >
                    <div className="flex items-center justify-between px-4 py-3 bg-[#0f6b49] text-white">
                        <div>
                            <p className="text-sm font-semibold">Customer Support</p>
                            <p className="text-[11px] text-white/80">Rule-based assistant</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsChatOpen(false)}
                            className="h-8 w-8 rounded-full hover:bg-white/15 grid place-items-center transition"
                            aria-label="Close support chat"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div className="h-80 overflow-y-auto px-3 py-3 bg-[#f7f8fa]">
                        <div className="space-y-3">
                            {messages.map((message) => (
                                <div key={message.id}>
                                    <div className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                                        message.sender === 'user'
                                            ? 'ml-auto bg-[#0f6b49] text-white'
                                            : 'mr-auto bg-white text-gray-800 shadow-sm'
                                    }`}>
                                        {message.text}
                                    </div>

                                    {message.sender === 'bot' && message.quickReplies && message.quickReplies.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {message.quickReplies.map((quickReply) => (
                                                <button
                                                    key={`${message.id}-${quickReply}`}
                                                    type="button"
                                                    onClick={() => submitMessage(quickReply)}
                                                    className="text-xs px-2.5 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-[#0f6b49]/40 hover:text-[#0f6b49] transition"
                                                >
                                                    {quickReply}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {message.sender === 'bot' && message.ctaPath && message.ctaLabel && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigate(message.ctaPath as string);
                                                setIsChatOpen(false);
                                            }}
                                            className="mt-2 text-xs px-3 py-1.5 rounded-full bg-[#f2b142] text-[#0d3a2a] font-medium hover:brightness-95 transition"
                                        >
                                            {message.ctaLabel}
                                        </button>
                                    )}
                                </div>
                            ))}
                            <div ref={endRef} />
                        </div>
                    </div>

                    <form
                        className="flex items-center gap-2 p-3 border-t border-gray-100 bg-white"
                        onSubmit={(e) => {
                            e.preventDefault();
                            submitMessage(draft);
                        }}
                    >
                        <input
                            type="text"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            placeholder="Ask a support question..."
                            className="flex-1 h-10 rounded-full border border-gray-200 px-4 text-sm outline-none focus:border-[#0f6b49]/50"
                        />
                        <button
                            type="submit"
                            className="h-10 w-10 rounded-full bg-[#0f6b49] text-white grid place-items-center hover:bg-[#0d5f41] transition"
                            aria-label="Send message"
                        >
                            <Send size={15} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};
