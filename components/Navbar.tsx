import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { NavItem } from '../types';
import GlassSurface from './GlassSurface';

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
            { label: 'About Us', href: '/about-us' },
            { label: 'Offices', href: '/offices' }
        ]
    },
    { 
        label: 'What We Offer', 
        href: '#services',
        children: [
            { label: 'Type A-Data Servicing', href: '/what-we-offer/type-a' },
            { label: 'Type B-Horizontal LLM Data', href: '/what-we-offer/type-b' },
            { label: 'Type C-Vertical LLM Data', href: '/what-we-offer/type-c' },
            { label: 'Type D-AIGC', href: '/what-we-offer/type-d' }
        ]
    },
    { label: 'Philanthropy & Impact', href: '/philanthropy-impact' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact Us', href: '/contact-us' },
    { label: 'Internal News', href: '/internal-news' },
];

export const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isGreenMode, setIsGreenMode] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            const shouldCollapse = currentY > 8;
            setIsCollapsed(shouldCollapse);
            if (shouldCollapse) setIsOpen(false);
        };
        
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const normalizePath = (path: string) => {
        const normalized = path.replace(/\/+$/, '');
        return normalized === '' ? '/' : normalized;
    };

    const isPathActive = (href: string) => {
        if (!href.startsWith('/')) return false;
        return normalizePath(location.pathname) === normalizePath(href);
    };

    const isActive = (item: NavItem) => {
        if (isPathActive(item.href)) return true;
        return item.children?.some((child) => isPathActive(child.href)) ?? false;
    };

    const toggleTheme = () => {
        setIsGreenMode(!isGreenMode);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <nav 
            className={`
                fixed z-50 transition-[top,padding,width,max-width,border-radius,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                ${
                    isCollapsed
                        ? 'top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[88%] md:max-w-[60rem] rounded-full'
                        : 'top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[90%] md:max-w-6xl rounded-full'
                }
            `}
        >
            <GlassSurface
                width="100%"
                height="auto"
                borderRadius={999}
                borderWidth={0.05}
                displace={0.22}
                distortionScale={-90}
                redOffset={0}
                greenOffset={4}
                blueOffset={8}
                brightness={64}
                opacity={0.98}
                blur={10}
                saturation={1.06}
                backgroundOpacity={0.74}
                mixBlendMode="normal"
                className="w-full border border-white/90 bg-white/85 ring-1 ring-black/8 shadow-[0_14px_30px_-18px_rgba(8,20,18,0.42)]"
                style={{ overflow: 'visible' }}
            >
                <div className={`w-full flex items-center ${isCollapsed ? 'justify-between px-3 md:px-2 py-1.5' : 'justify-between px-3 md:px-5 py-1.5'}`}>
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 shrink-0">
                        <img 
                            src="https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png?width=1519&height=429" 
                            alt="Lifewood" 
                            className="w-auto object-contain transition-all duration-300 h-7"
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center flex-nowrap transition-all duration-300 gap-1.5 flex-1 justify-center">
                        {navItems.map((item) => {
                            const active = isActive(item);
                            return (
                                <div key={item.label} className="relative group">
                                    <button 
                                        className={`relative transition-colors flex items-center gap-1 ${
                                            `px-0.5 py-0 text-[11px] font-medium whitespace-nowrap ${active ? 'text-brand-green font-semibold' : 'text-gray-700 hover:text-black'}`
                                        }`}
                                    >
                                        {active && (
                                            <motion.div
                                                layoutId="activeSection"
                                                className="absolute inset-0 bg-brand-green/10 rounded-lg"
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                        <span className="relative z-10 flex items-center gap-1 whitespace-nowrap">
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
                                        <div className="absolute z-[120] top-full left-1/2 -translate-x-1/2 mt-1.5 min-w-[11rem] w-max opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                                            <GlassSurface
                                                width="100%"
                                                height="auto"
                                                borderRadius={14}
                                                borderWidth={0.06}
                                                preferFallback
                                                displace={0.12}
                                                distortionScale={-40}
                                                redOffset={0}
                                                greenOffset={2}
                                                blueOffset={4}
                                                brightness={70}
                                                opacity={1}
                                                blur={10}
                                                saturation={1.02}
                                                backgroundOpacity={0.9}
                                                mixBlendMode="normal"
                                                className="rounded-[14px] border border-white bg-white/95 backdrop-blur-xl ring-1 ring-black/12 shadow-[0_18px_35px_-20px_rgba(15,23,42,0.6)]"
                                                style={{
                                                    background: 'rgba(255,255,255,0.95)',
                                                    backdropFilter: 'blur(14px) saturate(1.05)',
                                                    WebkitBackdropFilter: 'blur(14px) saturate(1.05)'
                                                }}
                                            >
                                                <div className="py-1">
                                                    {item.children.map((child) => (
                                                        child.href.startsWith('/') ? (
                                                            <Link
                                                                key={child.label}
                                                                to={child.href}
                                                                className={`block whitespace-nowrap px-3 py-1.5 text-[11px] font-medium ${
                                                                    isPathActive(child.href) ? 'text-brand-green' : 'text-gray-900 hover:text-brand-green'
                                                                }`}
                                                            >
                                                                {child.label}
                                                            </Link>
                                                        ) : (
                                                            <a
                                                                key={child.label}
                                                                href={child.href}
                                                                className="block whitespace-nowrap px-3 py-1.5 text-[11px] font-medium text-gray-900 hover:text-brand-green"
                                                            >
                                                                {child.label}
                                                            </a>
                                                        )
                                                    ))}
                                                </div>
                                            </GlassSurface>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Desktop Theme Toggle */}
                    <div className="hidden lg:flex items-center shrink-0">
                        <button
                            onClick={toggleTheme}
                            className="rounded-full text-brand-green hover:bg-green-50 transition-colors p-1"
                            aria-label="Toggle Theme"
                            title="Switch Theme"
                        >
                            {isGreenMode ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-brand-green"
                            aria-label="Toggle Theme"
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
            </GlassSurface>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl border border-white/20 p-6 flex flex-col gap-4 shadow-xl rounded-3xl lg:hidden ring-1 ring-black/5 max-h-[80vh] overflow-y-auto">
                    {navItems.map((item) => (
                        <div key={item.label}>
                            {item.href.startsWith('/') ? (
                                <Link
                                    to={item.href}
                                    className={`text-lg font-medium py-2 border-b border-gray-100 last:border-0 flex justify-between items-center ${
                                        isPathActive(item.href) ? 'text-brand-green' : 'text-gray-800'
                                    }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <a 
                                    href={item.href}
                                    className={`text-lg font-medium py-2 border-b border-gray-100 last:border-0 flex justify-between items-center ${
                                        isActive(item) ? 'text-brand-green' : 'text-gray-800'
                                    }`}
                                    onClick={() => !item.children && setIsOpen(false)}
                                >
                                    {item.label}
                                    {item.children && <ChevronDown size={16} />}
                                </a>
                            )}
                            {item.children && (
                                <div className="pl-4 flex flex-col gap-2 mt-2">
                                    {item.children.map((child) => (
                                        child.href.startsWith('/') ? (
                                            <Link
                                                key={child.label}
                                                to={child.href}
                                                className={`text-base py-1 ${
                                                    isPathActive(child.href) ? 'text-brand-green font-medium' : 'text-gray-600'
                                                }`}
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {child.label}
                                            </Link>
                                        ) : (
                                            <a
                                                key={child.label}
                                                href={child.href}
                                                className="text-base text-gray-600 py-1"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {child.label}
                                            </a>
                                        )
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
