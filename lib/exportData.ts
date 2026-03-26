export type ExportFormat = 'csv' | 'json';

const escapeCsvValue = (value: unknown) => {
    const normalized = value == null ? '' : String(value);
    if (!/[",\n]/.test(normalized)) return normalized;
    return `"${normalized.replace(/"/g, '""')}"`;
};

const buildCsv = (rows: Record<string, unknown>[]) => {
    const headers = Array.from(
        rows.reduce((set, row) => {
            Object.keys(row).forEach((key) => set.add(key));
            return set;
        }, new Set<string>())
    );

    if (headers.length === 0) return '';

    const lines = [
        headers.join(','),
        ...rows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(','))
    ];

    return lines.join('\n');
};

const triggerDownload = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
};

export const exportRecords = (
    filenameBase: string,
    rows: Record<string, unknown>[],
    format: ExportFormat
) => {
    const stamp = new Date().toISOString().slice(0, 10);
    const filename = `${filenameBase}-${stamp}.${format}`;

    if (format === 'json') {
        triggerDownload(filename, JSON.stringify(rows, null, 2), 'application/json;charset=utf-8');
        return;
    }

    triggerDownload(filename, buildCsv(rows), 'text/csv;charset=utf-8');
};
