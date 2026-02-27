import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    TrendingUp, TrendingDown, DollarSign, BarChart3,
    Target, ArrowLeft, Calendar, Package, ArrowUpRight,
    ArrowDownRight, Zap, Award, Briefcase, Activity,
    ChevronRight
} from 'lucide-react';

// Helper to format currency
function fmt(value, currency = '₹') {
    const n = Number(value || 0);
    if (n >= 10000000) return `${currency}${(n / 10000000).toFixed(1)}Cr`;
    if (n >= 100000) return `${currency}${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `${currency}${(n / 1000).toFixed(1)}K`;
    return `${currency}${n.toLocaleString()}`;
}

export default function Index({ stats, recentLedger }) {
    const {
        total_revenue, total_costs, net_profit, monthly_revenue, projections,
        growth_rate, top_products, goals
    } = stats;

    const currency = '₹';

    return (
        <AuthenticatedLayout>
            <Head title="Business Analytics" />

            <div className="bg-slate-50/50 dark:bg-slate-800/50 min-h-screen rounded-[40px] p-6 lg:p-8 font-sans text-slate-800 dark:text-slate-200">

                {/* Header */}
                <div className="flex items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <Link href={route('dashboard')} className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 transition shadow-sm">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Business Analytics</h1>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Performance, trends and projections</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className={`w-2 h-2 rounded-full ${growth_rate >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                            {growth_rate >= 0 ? '+' : ''}{growth_rate}% this month
                        </span>
                    </div>
                </div>

                {/* KPI Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-slate-900 p-6 lg:p-8 rounded-[32px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                        <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">{fmt(total_revenue, currency)}</p>
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Total Revenue</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 lg:p-8 rounded-[32px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                        <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                            <ArrowDownRight className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">{fmt(total_costs, currency)}</p>
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Total Costs</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 lg:p-8 rounded-[32px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                            <ArrowUpRight className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">{fmt(net_profit, currency)}</p>
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Net Profit</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 lg:p-8 rounded-[32px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                        <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">{fmt(projections.next_month, currency)}</p>
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Forecast (Mo)</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Monthly Trends */}
                    <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Revenue Trends</h3>
                                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Last 6 Months</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-slate-800 dark:text-slate-200">Avg: {fmt(projections.avg_monthly, currency)}</p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Per Month</p>
                            </div>
                        </div>

                        <div className="h-64 flex items-end gap-3">
                            {[...monthly_revenue].reverse().map((data, i) => {
                                const maxVal = Math.max(...monthly_revenue.map(m => m.total), 1);
                                const hPct = Math.max(8, (data.total / maxVal) * 100);
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-4 h-full justify-end group">
                                        <div className="text-[10px] font-black text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition translate-y-2 group-hover:translate-y-0">
                                            {fmt(data.total, currency)}
                                        </div>
                                        <div
                                            className="w-full bg-slate-100 dark:bg-slate-950 rounded-2xl group-hover:bg-brand-500 transition-all duration-500"
                                            style={{ height: `${hPct}%` }}
                                        />
                                        <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                                            {new Date(data.month + '-01').toLocaleDateString('default', { month: 'short', year: '2-digit' })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Award className="w-20 h-20" />
                            </div>
                            <h3 className="text-base font-bold mb-6 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-brand-400" /> Best Sellers
                            </h3>
                            <div className="space-y-6 relative z-10">
                                {top_products.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white/10 dark:bg-slate-900/10 rounded-xl flex items-center justify-center text-xs font-black">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold truncate max-w-[120px]">{item.product?.name}</p>
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">{item.total_sold} units sold</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-black text-brand-400 text-right">
                                            {fmt(item.revenue, currency)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800">
                            <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Target className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Monthly Targets
                            </h3>
                            <div className="space-y-6">
                                {/* Revenue Goal */}
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Revenue</p>
                                        <p className="text-sm font-black text-slate-900 dark:text-white">{goals.revenue.percent}%</p>
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-brand-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${goals.revenue.percent}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-1 text-[9px] font-bold text-slate-400 dark:text-slate-500">
                                        <span>Current: {fmt(goals.revenue.current, currency)}</span>
                                        <span>Goal: {fmt(goals.revenue.target, currency)}</span>
                                    </div>
                                </div>

                                {/* Stock Budget */}
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Stock Spend</p>
                                        <p className="text-sm font-black text-slate-900 dark:text-white">{goals.budget.percent}%</p>
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${goals.budget.percent > 90 ? 'bg-red-500' : 'bg-sky-500'}`}
                                            style={{ width: `${goals.budget.percent}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-1 text-[9px] font-bold text-slate-400 dark:text-slate-500">
                                        <span>Spent: {fmt(goals.budget.current, currency)}</span>
                                        <span>Limit: {fmt(goals.budget.target, currency)}</span>
                                    </div>
                                </div>

                                {/* Conversion Goal */}
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Conversion</p>
                                        <p className="text-sm font-black text-slate-900 dark:text-white">{goals.conversion.percent}%</p>
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${goals.conversion.percent}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-1 text-[9px] font-bold text-slate-400 dark:text-slate-500">
                                        <span>Avg: {goals.conversion.current}%</span>
                                        <span>Goal: {goals.conversion.target}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Teaser Section */}
                <div className="mt-12 mb-20">
                    <div className="flex items-center justify-between gap-4 mb-8">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
                                    <Activity className="w-5 h-5" />
                                </div>
                                Recent Activity
                            </h3>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-2 ml-[52px]">Snapshot of latest business events</p>
                        </div>

                        <Link
                            href={route('analytics.ledger')}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-3 flex items-center gap-3 text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest hover:border-slate-900 hover:shadow-sm transition-all group"
                        >
                            View Business Ledger
                            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:text-white transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                                    <tr>
                                        {['Date', 'Type', 'Target Item', 'Description', 'Amount'].map((h, i) => (
                                            <th key={h} className="px-8 py-5 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recentLedger && recentLedger.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-20 text-center">
                                                <p className="text-slate-400 dark:text-slate-500 font-bold">No recent activity recorded.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        recentLedger && recentLedger.map((entry, idx) => (
                                            <tr key={idx} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 dark:bg-slate-800/50 transition-colors">
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <div className="text-sm font-black text-slate-700 dark:text-slate-300">{new Date(entry.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</div>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <span className={`inline-flex px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border ${entry.is_revenue
                                                        ? 'bg-emerald-50 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800'
                                                        : 'bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800'
                                                        }`}>
                                                        {entry.type}
                                                    </span>
                                                    {entry.reverted_at && (
                                                        <span className="ml-2 inline-flex px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700">
                                                            Reverted
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <div className="text-sm font-black text-slate-700 dark:text-slate-300">{entry.target_item}</div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-[340px] truncate">
                                                        {entry.description}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <div className={`text-base font-black ${entry.is_revenue ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white underline decoration-red-500/30'}`}>
                                                        {entry.is_revenue ? '+' : '-'}{fmt(entry.amount, currency)}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div >
        </AuthenticatedLayout >
    );
}
