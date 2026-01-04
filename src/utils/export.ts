import type { SupportRequest } from '../types';

const escapeCsvField = (data: any): string => {
  if (data === null || data === undefined) return '';
  const str = String(data);

  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const downloadRequestsAsCSV = (data: SupportRequest[], filename: string = 'export.csv') => {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  const headers = ['ID', 'Title', 'Customer', 'Status', 'Priority', 'Tags', 'Created At'];

  const rows = data.map((req) => {
    return [
      req.id,
      escapeCsvField(req.title),
      escapeCsvField(req.customer),
      escapeCsvField(req.status),
      escapeCsvField(req.priority),
      escapeCsvField(req.tags.join('; ')),
      escapeCsvField(req.createdAt),
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
