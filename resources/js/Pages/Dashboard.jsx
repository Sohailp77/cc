import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import {
    Package, FileText, Plus, ArrowRight, TrendingUp, TrendingDown,
    Settings, ChevronRight, Printer, CheckCircle2, Clock, XCircle,
    DollarSign, BarChart3, Target, Zap, Send, Users, AlertTriangle,
    Award, ShieldCheck, Truck, Coins
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

import KpiCard from '@/Components/Dashboard/KpiCard';
import StatusRing from '@/Components/Dashboard/StatusRing';
import RevenueChart from '@/Components/Dashboard/RevenueChart';
import QuoteList from '@/Components/Dashboard/QuoteList';
import { fmt } from '@/utils';

// ─── Main Integrated Dashboard ─────────────────────────────────────────────
export default function Dashboard({ auth, quoteStats, userRole, employeePerformance, lowStockProducts }) {
    const { appSettings, flash } = usePage().props;
    const currency = appSettings?.currency_symbol || '₹';
    const qs = quoteStats || {};
    const isBoss = userRole === 'boss';
    const firstName = auth.user.name.split(' ')[0];

    const [expandedId, setExpandedId] = useState(null);
    const [stockWarning, setStockWarning] = useState(null);

    const growth = qs.monthly_growth;
    const growthPositive = growth !== null && growth !== undefined && Number(growth) >= 0;

    useEffect(() => {
        if (flash?.stock_warning) {
            setStockWarning(flash.stock_warning);
        } else {
            setStockWarning(null);
        }
    }, [flash]);

    const updateStatus = (quoteId, status, force = false) => {
        router.patch(route('quotes.updateStatus', quoteId), { status, force }, {
            onSuccess: (page) => {
                if (!page.props.flash?.stock_warning) {
                    setExpandedId(null);
                }
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="bg-[#f8fafc] dark:bg-slate-950 min-h-screen rounded-[40px] p-6 lg:p-10 font-sans text-slate-800 dark:text-slate-200 relative xl:overflow-hidden transition-colors duration-500">
                <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-indigo-200/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-emerald-200/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="relative z-10">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-gradient-to-br from-brand-600 to-brand-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-500/25">
                                {isBoss ? <ShieldCheck className="w-5 h-5" /> : <span className="font-black text-base">{firstName.charAt(0)}</span>}
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 dark:text-white">{isBoss ? 'Boss Dashboard' : 'My Dashboard'}</h1>
                                <p className="text-xs text-slate-400 dark:text-slate-500">{isBoss ? 'Full business overview' : 'Your personal performance overview'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isBoss && (
                                <Link href={route('employees.create')}
                                    className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-full text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                                    <Users className="w-4 h-4" /> Team
                                </Link>
                            )}
                            <Link href={route('quotes.create')}
                                className="flex items-center gap-2 bg-slate-900 dark:bg-brand-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow hover:bg-slate-700 dark:hover:bg-brand-600 transition">
                                <Plus className="w-4 h-4" /> New Quote
                            </Link>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <KpiCard label={isBoss ? "Total Revenue" : "My Revenue"} value={fmt(qs.total_revenue, currency)} sub="All time" icon={Coins} accent="bg-brand-500" />
                        <KpiCard label="This Month" value={fmt(qs.monthly_revenue, currency)}
                            sub={isBoss ? (growth !== null && growth !== undefined ? `${growthPositive ? '+' : ''}${growth}% vs last month` : 'First month') : "My earnings"}
                            subPositive={isBoss ? (growth !== null && growth !== undefined ? growthPositive : undefined) : undefined}
                            icon={TrendingUp} accent="bg-brand-500" />
                        <KpiCard label={isBoss ? "Conversion Rate" : "My Conversion"} value={`${qs.conversion_rate ?? 0}%`}
                            sub={`${qs.accepted_count ?? 0} of ${qs.total_quotes ?? 0} accepted`}
                            subPositive={(qs.conversion_rate || 0) >= 50 ? true : undefined}
                            icon={Target} accent="bg-brand-500" />
                        <KpiCard label={isBoss ? "Avg Deal Size" : "My Quotes"} value={isBoss ? fmt(qs.avg_deal_size, currency) : (qs.total_quotes ?? 0)}
                            sub={isBoss ? `${qs.total_quotes ?? 0} quotes total` : `${qs.sent_count ?? 0} pending`}
                            icon={isBoss ? BarChart3 : FileText} accent="bg-brand-500" />
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* Left (7 cols) */}
                        <div className="lg:col-span-7 flex flex-col gap-8">
                            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/50 dark:border-slate-800 rounded-[32px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-brand-500 dark:text-brand-400" /> {isBoss ? 'Revenue' : 'My Revenue'} — Last 7 Days
                                        </h2>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{isBoss ? 'Daily totals from all quotes' : 'Your daily quote totals'}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-black text-slate-900 dark:text-white">{fmt(qs.weekly_revenue, currency)}</div>
                                        <p className="text-xs text-slate-400 dark:text-slate-500">this week</p>
                                    </div>
                                </div>
                                <RevenueChart dailyBars={qs.daily_revenue || Array(7).fill(0)} currency={currency} />
                            </div>

                            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/50 dark:border-slate-800 rounded-[32px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                                <div className="flex justify-between items-center mb-5">
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{isBoss ? 'All Quotes' : 'My Quotes'}</h3>
                                    <span className="text-xs text-slate-400 dark:text-slate-500">{isBoss ? 'Click to expand & change status' : 'Expand to mark as sent or print'}</span>
                                </div>
                                <QuoteList
                                    quotes={qs.recent_quotes || []}
                                    currency={currency}
                                    isBoss={isBoss}
                                    expandedId={expandedId}
                                    setExpandedId={setExpandedId}
                                    updateStatus={updateStatus}
                                />
                            </div>
                        </div>

                        {/* Right (5 cols) */}
                        <div className="lg:col-span-5 flex flex-col gap-8">
                            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/50 dark:border-slate-800 rounded-[32px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{isBoss ? 'Quote Breakdown' : 'My Stats'}</h3>
                                    <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">All Time</span>
                                </div>
                                <StatusRing
                                    accepted={qs.accepted_count || 0} sent={qs.sent_count || 0}
                                    draft={qs.draft_count || 0} rejected={qs.rejected_count || 0}
                                    total={qs.total_quotes || 0} />
                                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                                    <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-xl p-3">
                                        <p className="text-base font-black text-slate-900 dark:text-white">{isBoss ? (qs.weekly_quotes || 0) : (qs.total_quotes || 0)}</p>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500">{isBoss ? 'This week' : 'All quotes'}</p>
                                    </div>
                                    <div className="bg-emerald-50/20 dark:bg-emerald-900/20 rounded-xl p-3">
                                        <p className="text-base font-black text-emerald-700 dark:text-emerald-400">{qs.accepted_count || 0}</p>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500">{isBoss ? 'Accepted' : 'Won'}</p>
                                    </div>
                                    <div className="bg-sky-50/20 dark:bg-sky-900/20 rounded-xl p-3">
                                        <p className="text-base font-black text-sky-700 dark:text-sky-400">{qs.sent_count || 0}</p>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500">Pending</p>
                                    </div>
                                </div>
                            </div>

                            {isBoss ? (
                                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/50 dark:border-slate-800 rounded-[32px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <Award className="w-4 h-4 text-brand-500 dark:text-brand-400" /> Team Performance
                                        </h3>
                                        <Link href={route('employees.index')} className="text-xs text-slate-400 dark:text-slate-500 hover:text-brand-500 dark:hover:text-brand-400 transition">Manage</Link>
                                    </div>
                                    {employeePerformance?.length > 0 ? (
                                        <div className="space-y-3">
                                            {employeePerformance.map((emp, i) => {
                                                const maxRev = Number(employeePerformance[0]?.quotes_sum_total_amount || 1);
                                                const pct = Math.max(8, (Number(emp.quotes_sum_total_amount || 0) / maxRev) * 100);
                                                return (
                                                    <div key={emp.id}>
                                                        <div className="flex items-center justify-between mb-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black text-white ${i === 0 ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'}`}>{i + 1}</span>
                                                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{emp.name}</span>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{fmt(emp.quotes_sum_total_amount, currency)}</span>
                                                                <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1">({emp.quotes_count})</span>
                                                            </div>
                                                        </div>
                                                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                            <div className={`h-full rounded-full ${i === 0 ? 'bg-brand-400' : 'bg-slate-300 dark:bg-slate-600'}`} style={{ width: `${pct}%` }} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 text-slate-300 dark:text-slate-600 text-xs">
                                            <Users className="w-8 h-8 mx-auto mb-2" />
                                            No employees yet.
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/50 dark:border-slate-800 rounded-[32px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">My Top Products</h3>
                                    <div className="space-y-3">
                                        {(qs.top_products || []).slice(0, 4).map((tp, i) => {
                                            const maxCount = qs.top_products[0]?.quote_count || 1;
                                            const barPct = Math.round((tp.quote_count / maxCount) * 100);
                                            return (
                                                <div key={tp.product_id}>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-[10px] font-black w-5 h-5 rounded-md flex items-center justify-center text-white ${i === 0 ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700 !text-slate-600 dark:!text-slate-300'}`}>{i + 1}</span>
                                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[140px]">{tp.product?.name || 'Unknown'}</span>
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{tp.quote_count}×</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full ${i === 0 ? 'bg-brand-400' : 'bg-slate-300 dark:bg-slate-600'}`} style={{ width: `${barPct}%` }} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {isBoss && lowStockProducts?.length > 0 && (
                                <div className="bg-amber-50/80/20 dark:bg-amber-900/20 border border-amber-200/50/50 dark:border-amber-800/50 rounded-[32px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                                    <h3 className="text-sm font-bold text-amber-800 dark:text-amber-500 flex items-center gap-2 mb-4">
                                        <AlertTriangle className="w-4 h-4" /> Low Stock Alerts
                                    </h3>
                                    <div className="space-y-2">
                                        {lowStockProducts.slice(0, 6).map(p => (
                                            <div key={p.id} className="flex items-center justify-between">
                                                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{p.name}</p>
                                                <span className={`text-xs font-black px-2 py-0.5 rounded-full ${p.stock_quantity === 0 ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400'}`}>
                                                    {p.stock_quantity === 0 ? 'Out of Stock' : `${p.stock_quantity} left`}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="bg-gradient-to-br from-brand-900 via-slate-900 to-slate-800 rounded-[32px] p-7 relative overflow-hidden shadow-[0_8px_30px_var(--color-brand-900)]">
                                <div className="absolute right-0 top-0 w-32 h-full opacity-10"
                                    style={{ backgroundImage: 'radial-gradient(white 1.5px, transparent 1.5px)', backgroundSize: '12px 12px' }} />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Zap className="w-4 h-4 text-brand-400" />
                                        <h3 className="font-bold text-white text-sm">Quick Actions</h3>
                                    </div>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Jump to frequent tasks</p>
                                    <div className="flex flex-col gap-2">
                                        {[
                                            { href: route('quotes.create'), label: isBoss ? 'New Quote' : 'Create New Quote', icon: FileText, color: 'text-brand-400' },
                                            isBoss ? { href: route('purchase-orders.index'), label: 'Stock Reorders', icon: Truck, color: 'text-sky-400' } : { href: route('products.index'), label: 'Browse Products', icon: Package, color: 'text-sky-400' },
                                            isBoss ? { href: route('analytics.index'), label: 'Business Analytics', icon: BarChart3, color: 'text-emerald-400' } : null,
                                            isBoss ? { href: route('settings.index'), label: 'Settings', icon: Settings, color: 'text-slate-400 dark:text-slate-500' } : null,
                                        ].filter(Boolean).map(({ href, label, icon: Icon, color }) => (
                                            <Link key={label} href={href}
                                                className="flex items-center justify-between bg-white/10 dark:bg-slate-950/30 hover:bg-white/20 dark:hover:bg-slate-950/50 text-white px-4 py-2.5 rounded-2xl text-sm font-semibold transition group">
                                                <div className="flex items-center gap-2">
                                                    <Icon className={`w-4 h-4 ${color}`} />
                                                    {label}
                                                </div>
                                                <ArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stock Warning Modal */}
            {stockWarning && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] w-full max-w-md p-8 shadow-2xl border border-slate-100 dark:border-slate-800">
                        <div className="w-16 h-16 bg-amber-100/30 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-6">
                            <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Stock Warning</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{stockWarning.message}</p>
                        <div className="space-y-3 mb-8 bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 dark:border-slate-700">
                            {stockWarning.items.map((item, i) => (
                                <div key={i} className="flex justify-between items-center text-sm">
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">{item.name}</span>
                                    <span className="text-red-500 dark:text-red-400 font-bold">{item.available} available / {item.requested} needed</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setStockWarning(null)}
                                className="flex-1 px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-950 dark:bg-slate-800 text-slate-600 dark:text-slate-400 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-800 dark:hover:bg-slate-700 transition">
                                Cancel
                            </button>
                            <button onClick={() => {
                                updateStatus(expandedId, 'accepted', true);
                                setStockWarning(null);
                            }}
                                className="flex-1 px-6 py-3 rounded-2xl bg-slate-900 dark:bg-brand-500 text-white font-bold hover:bg-slate-800 dark:hover:bg-brand-600 transition">
                                Continue Anyway
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}