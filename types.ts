import { ReactNode } from "react";

export interface NavItem {
    label: string;
    href: string;
    children?: NavItem[];
}

export interface StatItem {
    id: string;
    value: string;
    label: string;
    description: string;
    bgColor: string;
    textColor: string;
    iconBgColor?: string;
    descriptionColor?: string;
}

export interface ServiceItem {
    id: string;
    title: string;
    description: string;
    image: string;
    colSpan?: string;
    rowSpan?: string;
}

export interface PartnerLogo {
    name: string;
    url: string; 
}