import { fmt } from '@/utils';

export default function RevenueChart({ dailyBars, currency }) {
    const maxBar = Math.max(...dailyBars, 1);
    const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const last7Labels = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return dayLabels[d.getDay()];
    });
    return (
        <div className="flex items-end justify-between h-40 gap-2 mt-4">
            {dailyBars.map((val, i) => {
                const hPct = Math.max(8, (val / maxBar) * 100);
                const isToday = i === 6;
                return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-crosshair">
                        <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 bg-white dark:bg-slate-800 shadow-[0_4px_12px_rgb(0,0,0,0.08)] px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-700 z-10 whitespace-nowrap">
                            {fmt(val, currency)}
                        </div>
                        <div className="w-full relative flex justify-center items-end h-full">
                            <div className={`w-full max-w-[36px] rounded-t-xl transition-all duration-300 ease-out origin-bottom group-hover:scale-y-105 ${isToday
                                ? 'bg-gradient-to-t from-brand-500 to-brand-400 shadow-[0_6px_20px_var(--color-brand-300)]'
                                : val > 0 ? 'bg-slate-200 dark:bg-slate-700 group-hover:bg-brand-300 dark:group-hover:bg-brand-500' : 'bg-slate-100 dark:bg-slate-800'}`}
                                style={{ height: `${hPct}%` }} />
                        </div>
                        <div className={`text-xs font-bold transition-colors ${isToday ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`}>
                            {last7Labels[i]}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
