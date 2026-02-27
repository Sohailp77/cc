import { TrendingUp, TrendingDown } from 'lucide-react';

export default function KpiCard({ label, value, sub, subPositive, icon: Icon, accent }) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 border border-slate-100/80 dark:border-slate-800/80 dark:border-slate-800 flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50/50 dark:from-slate-800/50 to-transparent rounded-full opacity-50 -mr-10 -mt-10 pointer-events-none" />
            <div className="relative z-10 flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center ${accent} shadow-inner`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                {sub !== undefined && (
                    <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${subPositive === true ? 'bg-emerald-50/30 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : subPositive === false ? 'bg-rose-50/30 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                        {subPositive === true && <TrendingUp className="w-3 h-3" />}
                        {subPositive === false && <TrendingDown className="w-3 h-3" />}
                        {sub}
                    </div>
                )}
            </div>
            <div className="relative z-10">
                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{value}</p>
                <p className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 mt-1">{label}</p>
            </div>
        </div>
    );
}
