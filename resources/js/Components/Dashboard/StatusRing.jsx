export default function StatusRing({ accepted = 0, sent = 0, draft = 0, rejected = 0, total = 0 }) {
    if (total === 0) return (
        <div className="flex items-center justify-center h-32 text-sm font-semibold text-slate-400 dark:text-slate-500 dark:text-slate-400 bg-slate-50/50/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">No quotes yet</div>
    );
    const segments = [
        { pct: (accepted / total) * 100, color: '#10b981' }, // emerald
        { pct: (sent / total) * 100, color: 'var(--color-brand-500, #6366f1)' },     // brand
        { pct: (draft / total) * 100, color: '#94a3b8' },    // slate
        { pct: (rejected / total) * 100, color: '#f43f5e' }, // rose
    ];
    let cum = 0;
    const r = 48, cx = 64, cy = 64, circ = 2 * Math.PI * r;
    return (
        <div className="flex items-center gap-6">
            <div className="relative flex-shrink-0">
                <svg width="128" height="128" viewBox="0 0 128 128" className="drop-shadow-sm">
                    {segments.map((seg, i) => {
                        const offset = circ * (1 - cum / 100);
                        const dash = circ * (seg.pct / 100);
                        cum += seg.pct;
                        return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth="12"
                            strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={offset} strokeLinecap="round"
                            transform="rotate(-90 64 64)" className="transition-all duration-1000 ease-out" />;
                    })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center mt-0.5">
                    <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{total}</span>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Total</span>
                </div>
            </div>
            <div className="flex flex-col gap-3 flex-1">
                {[
                    { label: 'Accepted', val: accepted, bg: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400' },
                    { label: 'Pending', val: sent, bg: 'bg-brand-500', text: 'text-brand-700 dark:text-brand-300' },
                    { label: 'Draft', val: draft, bg: 'bg-slate-400 dark:bg-slate-600', text: 'text-slate-700 dark:text-slate-300' },
                    { label: 'Rejected', val: rejected, bg: 'bg-rose-500', text: 'text-rose-700' },
                ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-default">
                        <div className="flex items-center gap-2.5">
                            <div className={`w-2.5 h-2.5 rounded-full ${s.bg} shadow-sm group-hover:scale-125 transition-transform`} />
                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 dark:text-slate-300 group-hover:text-slate-800 dark:text-slate-200 dark:group-hover:text-white transition-colors">{s.label}</span>
                        </div>
                        <span className={`text-sm font-bold ${s.text} dark:opacity-80`}>{s.val}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
