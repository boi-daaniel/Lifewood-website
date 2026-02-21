import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { NavItem } from '../types';

const navItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { 
        label: 'AI Initiatives', 
        href: '#innovation',
        children: [
            { label: 'AI Services', href: '/ai-services' },
            { label: 'AI Projects', href: '/ai-projects' }
        ]
    },
    { 
        label: 'Our Company', 
        href: '#about',
        children: [
            { label: 'About Us', href: '#about-us' },
            { label: 'Offices', href: '#offices' }
        ]
    },
    { 
        label: 'What We Offer', 
        href: '#services',
        children: [
            { label: 'Type A-Data Servicing', href: '#type-a' },
            { label: 'Type B-Horizontal LLM Data', href: '#type-b' },
            { label: 'Type C-Vertical LLM Data', href: '#type-c' },
            { label: 'Type D-AIGC', href: '#type-d' }
        ]
    },
    { label: 'Philanthropy & Impact', href: '#impact' },
    { label: 'Careers', href: '#contact' },
    { label: 'Contact Us', href: '#contact' },
    { label: 'Internal News', href: '#' },
];

export const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isGreenMode, setIsGreenMode] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTheme = () => {
        setIsGreenMode(!isGreenMode);
        document.documentElement.classList.toggle('dark');
    };

    const isActive = (href: string) => {
        if (href === '/') return location.pathname === '/';
        return location.pathname === href;
    };

    const renderLink = (item: NavItem) => {
        if (item.href.startsWith('/')) {
            return <Link to={item.href}>{item.label}</Link>;
        }
        return <a href={item.href}>{item.label}</a>;
    };

    return (
        <nav 
            className={`
                fixed z-50 transition-all duration-300 
                left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[95%] md:max-w-7xl 
                rounded-full border border-white/40 shadow-xl backdrop-blur-xl
                ${scrolled ? 'top-3 py-3 bg-white/95' : 'top-6 py-4 bg-white/90'}
            `}
        >
            <div className="w-full px-4 md:px-8 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <img 
                        src="https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png?width=1519&height=429" 
                        alt="Lifewood" 
                        className="h-8 md:h-10 w-auto object-contain" 
                    />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-1">
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <div key={item.label} className="relative group">
                                <button 
                                    className={`relative px-3 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                                        active 
                                            ? 'text-brand-green font-bold' 
                                            : 'text-gray-600 hover:text-brand-green'
                                    }`}
                                >
                                    {active && (
                                        <motion.div
                                            layoutId="activeSection"
                                            className="absolute inset-0 bg-brand-green/10 rounded-full"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-1">
                                        {item.href.startsWith('/') ? (
                                            <Link to={item.href}>{item.label}</Link>
                                        ) : (
                                            item.label
                                        )}
                                        {item.children && (
                                            <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                                        )}
                                    </span>
                                </button>
                                
                                {item.children && (
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                        <div className="py-2">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.label}
                                                    to={child.href}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-green"
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* CTA & Theme Toggle */}
                <div className="hidden lg:flex items-center gap-4">
                     <button 
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-brand-green hover:bg-green-50 transition-colors"
                        aria-label="Toggle Theme"
                        title="Switch Theme"
                    >
                        {isGreenMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden flex items-center gap-4">
                     <button 
                        onClick={toggleTheme}
                        className="p-2 text-brand-green"
                    >
                        {isGreenMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 text-gray-800"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl border border-white/20 p-6 flex flex-col gap-4 shadow-xl rounded-3xl lg:hidden ring-1 ring-black/5 max-h-[80vh] overflow-y-auto">
                    {navItems.map((item) => (
                        <div key={item.label}>
                            {item.href.startsWith('/') ? (
                                <Link
                                    to={item.href}
                                    className="text-lg font-medium text-gray-800 py-2 border-b border-gray-100 last:border-0 flex justify-between items-center"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <a 
                                    href={item.href}
                                    className="text-lg font-medium text-gray-800 py-2 border-b border-gray-100 last:border-0 flex justify-between items-center"
                                    onClick={() => !item.children && setIsOpen(false)}
                                >
                                    {item.label}
                                    {item.children && <ChevronDown size={16} />}
                                </a>
                            )}
                            {item.children && (
                                <div className="pl-4 flex flex-col gap-2 mt-2">
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.label}
                                            to={child.href}
                                            className="text-base text-gray-600 py-1"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {child.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </nav>
    );
};