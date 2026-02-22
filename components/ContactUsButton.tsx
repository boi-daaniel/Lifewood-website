import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

type ContactUsButtonProps = {
    className?: string;
    label?: string;
};

export const ContactUsButton: React.FC<ContactUsButtonProps> = ({ className = '', label = 'Contact us' }) => {
    return (
        <Link
            to="/contact-us"
            className={`inline-flex items-center gap-2.5 rounded-full bg-[#f2b142] text-[#0d3a2a] px-4 py-1.5 font-medium hover:brightness-95 transition ${className}`.trim()}
        >
            <span>{label}</span>
            <span className="w-5 h-5 rounded-full bg-[#0f6b49] text-[#f2b142] grid place-items-center">
                <Plus size={12} />
            </span>
        </Link>
    );
};
