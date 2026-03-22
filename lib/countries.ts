type CountryOption = {
    code: string;
    label: string;
};

const FALLBACK_COUNTRIES: CountryOption[] = [
    { code: 'ASIA', label: 'Asia' },
    { code: 'EUROPE', label: 'Europe' },
    { code: 'AFRICA', label: 'Africa' },
    { code: 'NORTH_AMERICA', label: 'North America (US/Canada)' },
    { code: 'SOUTH_AMERICA', label: 'South America' },
    { code: 'OCEANIA', label: 'Oceania (AU/NZ)' },
    { code: 'MIDDLE_EAST', label: 'Middle East' }
];

const buildCountryOptions = (): CountryOption[] => {
    return FALLBACK_COUNTRIES;
};

export const COUNTRY_OPTIONS: CountryOption[] = buildCountryOptions();

const COUNTRY_LABEL_BY_CODE = new Map(COUNTRY_OPTIONS.map((item) => [item.code, item.label]));
const COUNTRY_CODE_BY_LABEL = new Map(
    COUNTRY_OPTIONS.map((item) => [item.label.toLowerCase(), item.code])
);

const COUNTRY_TIMEZONES: Record<string, string> = {
    ASIA: 'Asia/Manila',
    EUROPE: 'Europe/London',
    AFRICA: 'Africa/Johannesburg',
    NORTH_AMERICA: 'America/New_York',
    SOUTH_AMERICA: 'America/Sao_Paulo',
    OCEANIA: 'Australia/Sydney',
    MIDDLE_EAST: 'Asia/Dubai'
};

export const normalizeCountryValue = (value?: string | null) => {
    if (!value) return '';
    const trimmed = value.trim();
    if (!trimmed) return '';
    const upper = trimmed.toUpperCase();
    if (COUNTRY_LABEL_BY_CODE.has(upper)) return upper;
    const fromLabel = COUNTRY_CODE_BY_LABEL.get(trimmed.toLowerCase());
    return fromLabel ?? trimmed;
};

export const getCountryLabel = (value?: string | null) => {
    if (!value) return '';
    const normalized = normalizeCountryValue(value);
    return COUNTRY_LABEL_BY_CODE.get(normalized) ?? value;
};

export const getTimeZoneForCountry = (value?: string | null) => {
    const normalized = normalizeCountryValue(value);
    if (normalized && COUNTRY_TIMEZONES[normalized]) return COUNTRY_TIMEZONES[normalized];
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
};
