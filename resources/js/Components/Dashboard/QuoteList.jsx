import { useState, useMemo } from 'react';
import { FileText, ChevronRight, Printer, ArrowRight, Send } from 'lucide-react';
import { fmt, timeAgo, STATUS } from '@/utils';

const FILTERS = ['all', 'accepted', 'sent', 'draft', 'rejected'];

export default function QuoteList({ quotes, currency, isBoss = false, expandedId, setExpandedId, updateStatus }) {
    const [filter, setFilter] = useState('all');

    const filtered = useMemo(() =>
        filter === 'all' ? quotes : quotes.filter(q => q.status === filter),
        [filter, quotes]
    );

    const bossStatuses = ['sent', 'accepted', 'rejected', 'expired'];

    return (
        <div>
            <div className="flex gap-1.5 mb-4 flex-wrap">
                {FILTERS.map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition ${filter === f ? 'bg-slate-900 dark:bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                        {f === 'all' ? `All (${quotes.length})` : f}
                    </button>
                ))}
            </div>

            <div className="space-y-2.5">
                {filtered.slice(0, 6).map((q) => {
                    const st = STATUS[q.status] || STATUS.draft;
                    const isExpanded = expandedId === q.id;
                    return (
                        <div key={q.id} className={`rounded-2xl border transition-[background,border-color,box-shadow] duration-200 overflow-hidden ${isExpanded ? 'bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-sm' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)] dark:hover:shadow-none'}`}>
                            <button onClick={() => setExpandedId(isExpanded ? null : q.id)}
                                className="w-full flex items-center justify-between p-4 text-left">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${st.iconBg} ${st.iconColor}`}>
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{q.customer_name}</p>
                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                                            {q.reference_id} <span className="text-slate-300 dark:text-slate-600 mx-1">•</span> {timeAgo(q.created_at)}
                                            {isBoss && q.user && <><span className="text-slate-300 dark:text-slate-600 mx-1">•</span><span className="text-slate-600 dark:text-slate-400">{q.user.name}</span></>}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 flex-shrink-0">
                                    <div className="text-right flex flex-col items-end">
                                        <p className="text-[15px] font-black text-slate-900 dark:text-white">{fmt(q.total_amount, currency)}</p>
                                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md mt-1 ${st.bg} dark:bg-opacity-20`}>{st.label}</span>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isExpanded ? 'bg-white dark:bg-slate-800 shadow-sm' : 'bg-slate-50/50 dark:bg-slate-800/50'}`}>
                                        <ChevronRight className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                                    </div>
                                </div>
                            </button>

                            {isExpanded && (
                                <div className="px-4 pb-4 pt-2 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-200/50/50 dark:border-slate-700/50">
                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                        <a href={route('quotes.pdf', q.id)} target="_blank" rel="noreferrer"
                                            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm">
                                            <Printer className="w-3.5 h-3.5" /> View PDF
                                        </a>

                                        {isBoss && bossStatuses.filter(s => s !== q.status).map(s => {
                                            const btnSt = STATUS[s];
                                            return (
                                                <button key={s} onClick={() => updateStatus(q.id, s)}
                                                    className={`text-xs font-bold px-3.5 py-2 rounded-xl border border-transparent shadow-sm transition-all capitalize flex items-center gap-1.5
                                                        ${s === 'accepted' ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border-emerald-200/50/50 dark:border-emerald-800/50 hover:border-emerald-300 dark:hover:border-emerald-700'
                                                            : s === 'rejected' ? 'text-rose-700 dark:text-rose-400 bg-rose-50/20 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 border-rose-200/50/50 dark:border-rose-800/50 hover:border-rose-300 dark:hover:border-rose-700'
                                                                : 'text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 shadow-sm'}`}>
                                                    <ArrowRight className="w-3 h-3 opacity-50" /> Mark as {s}
                                                </button>
                                            );
                                        })}
                                        {!isBoss && q.status === 'draft' && (
                                            <button onClick={() => updateStatus(q.id, 'sent')}
                                                className="flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-brand-300 dark:text-brand-400 bg-brand-50/20 dark:bg-brand-900/20 border border-brand-200/50/50 dark:border-brand-800/50 px-3.5 py-2 rounded-xl hover:bg-brand-100 dark:hover:bg-brand-800 dark:hover:bg-brand-900/40 transition-all shadow-sm">
                                                <Send className="w-3.5 h-3.5" /> Mark as Sent
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {filtered.length === 0 && (
                    <div className="text-center py-10 text-slate-400 dark:text-slate-500">
                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No {filter === 'all' ? '' : filter} quotes yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
