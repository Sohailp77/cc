export function fmt(value, currency = '₹') {
    const n = Number(value || 0);
    if (n >= 10000000) return `${currency}${(n / 10000000).toFixed(1)}Cr`;
    if (n >= 100000) return `${currency}${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `${currency}${(n / 1000).toFixed(1)}K`;
    return `${currency}${n.toFixed(0)}`;
}

export function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}

export const STATUS = {
    draft: { label: 'Draft', bg: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400', iconBg: 'bg-slate-100', iconColor: 'text-slate-500' },
    sent: { label: 'Sent', bg: 'bg-brand-50 text-brand-700', dot: 'bg-brand-500', iconBg: 'bg-brand-100', iconColor: 'text-brand-600' },
    accepted: { label: 'Accepted', bg: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
    rejected: { label: 'Rejected', bg: 'bg-rose-50 text-rose-700', dot: 'bg-rose-500', iconBg: 'bg-rose-100', iconColor: 'text-rose-600' },
    expired: { label: 'Expired', bg: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
};
