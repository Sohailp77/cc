import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    Plus, Trash2, Package, Save, Tag, Edit, AlertTriangle,
    TrendingUp, TrendingDown, DollarSign, BarChart3,
    Target, ArrowLeft, Calendar, ArrowUpRight,
    ArrowDownRight, Zap, Award, Briefcase, History,
    RefreshCcw, Activity, Search, Filter, X, ChevronRight,
    MoreHorizontal, Download, LayoutGrid
} from 'lucide-react';
import { useMemo, useState } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SlateButton from '@/Components/SlateButton';
import DangerButton from '@/Components/DangerButton';

// Helper to format currency
const fmt = (num, currency = '₹') => {
    return currency + new Intl.NumberFormat().format(num);
};

export default function Ledger({ ledger }) {
    const currency = '₹';
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, revenue, cost
    const [editingItem, setEditingItem] = useState(null);

    const editForm = useForm({
        amount: '',
        reason: '',
        unit_cost: '',
    });

    const filteredLedger = useMemo(() => {
        let items = ledger;

        if (filterType === 'revenue') {
            items = items.filter(i => i.is_revenue);
        } else if (filterType === 'cost') {
            items = items.filter(i => !i.is_revenue);
        }

        if (!searchQuery) return items;
        const q = searchQuery.toLowerCase();
        return items.filter(entry =>
            entry.target_item.toLowerCase().includes(q) ||
            entry.description.toLowerCase().includes(q) ||
            entry.type.toLowerCase().includes(q)
        );
    }, [ledger, searchQuery, filterType]);

    const handleRevert = (id) => {
        if (confirm('Are you sure you want to revert this adjustment? This will undo the stock change and associated records.')) {
            router.post(route('stock.revert', id));
        }
    };

    const handleDeleteRevenue = (id) => {
        if (confirm('Are you sure you want to delete this revenue record?')) {
            router.delete(route('revenues.destroy', id));
        }
    };

    const openEdit = (item) => {
        setEditingItem(item);
        editForm.setData({
            amount: item.amount || '',
            reason: item.description || '',
            unit_cost: item.unit_cost || '',
        });
        editForm.clearErrors();
    };

    const submitEdit = (e) => {
        e.preventDefault();
        const url = editingItem.is_revenue
            ? route('revenues.update', editingItem.id)
            : route('stock.adjustments.update', editingItem.id);

        editForm.patch(url, {
            onSuccess: () => setEditingItem(null),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Business Ledger" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="mb-10">
                    <Link
                        href={route('analytics.index')}
                        className="inline-flex items-center gap-2 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] hover:text-slate-900 dark:hover:text-white dark:text-white transition-colors mb-6 group"
                    >
                        <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" /> Back to Analytics
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white flex items-center gap-4">
                                <div className="w-14 h-14 bg-slate-900 rounded-[22px] flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
                                    <Briefcase className="w-7 h-7" />
                                </div>
                                Business Ledger
                            </h2>
                            <p className="text-slate-400 dark:text-slate-500 font-bold mt-3 text-sm max-w-lg">
                                Deep audit trail of all financial events, stock movements, and revenue generations.
                                <span className="text-slate-900 dark:text-white"> Precision is power.</span>
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl flex p-1 shadow-sm">
                                {['all', 'revenue', 'cost'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setFilterType(t)}
                                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filterType === t ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 dark:text-slate-400'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Stats Bar */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    <div className="lg:col-span-3 relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-slate-900 dark:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by product, ID, reference, or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-3xl pl-14 pr-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-slate-900 focus:ring-0 transition-all shadow-sm group-hover:shadow-md"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 dark:hover:bg-slate-950 dark:bg-slate-950 rounded-xl text-slate-400 dark:text-slate-500 transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl px-6 py-4 flex items-center justify-center gap-3 text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest hover:border-slate-900 transition-all shadow-sm group">
                        <Download className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:text-white" />
                        Export Data
                    </button>
                </div>

                {/* Ledger Table */}
                <div className="bg-white dark:bg-slate-900 rounded-[44px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                                <tr>
                                    {['Transaction ID', 'Status', 'Entity / Action', 'Details', 'Value', ''].map((h, i) => (
                                        <th key={h} className={`px-10 py-7 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ${i === 5 ? 'text-right' : ''}`}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredLedger.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-10 py-32 text-center text-slate-300 dark:text-slate-600">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[30px] flex items-center justify-center text-slate-200">
                                                    <LayoutGrid className="w-10 h-10" />
                                                </div>
                                                <p className="font-bold text-slate-400 dark:text-slate-500">No transactions recorded for this filter.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLedger.map((entry, idx) => (
                                        <tr key={idx} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 dark:bg-slate-800/50 transition-all">
                                            <td className="px-10 py-8 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 group-hover:bg-slate-900 transition-colors"></div>
                                                    <div>
                                                        <div className="text-xs font-black text-slate-900 dark:text-white tabular-nums">#{(1000 + entry.id).toString()}</div>
                                                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">
                                                            {new Date(entry.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 whitespace-nowrap">
                                                <span className={`inline-flex px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border ${entry.is_revenue
                                                    ? 'bg-emerald-50 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800'
                                                    : 'bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800'
                                                    }`}>
                                                    {entry.type}
                                                </span>
                                                {entry.reverted_at && (
                                                    <span className="ml-2 inline-flex px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                        Reverted
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-10 py-8 whitespace-nowrap">
                                                <div className="text-sm font-black text-slate-900 dark:text-white">{entry.target_item}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="w-4 h-4 bg-slate-100 dark:bg-slate-950 rounded-md flex items-center justify-center text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase">B</div>
                                                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">{entry.user || 'System'}</div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-sm leading-relaxed">
                                                    {entry.description}
                                                </p>
                                            </td>
                                            <td className="px-10 py-8 whitespace-nowrap">
                                                <div className={`text-lg font-black ${entry.is_revenue ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                                    {entry.is_revenue ? '+' : '-'}{fmt(entry.amount, currency)}
                                                </div>
                                                {entry.quantity && (
                                                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1">
                                                        {Math.abs(entry.quantity)} units @ {fmt(entry.unit_cost, currency)}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-10 py-8 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                                    {!entry.reverted_at && (
                                                        <>
                                                            {/* Edit Button */}
                                                            <button
                                                                onClick={() => openEdit(entry)}
                                                                className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white dark:text-white hover:border-slate-900 rounded-xl transition-all shadow-sm flex items-center justify-center p-0"
                                                                title="Edit Entry"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>

                                                            {/* Revert/Delete Button */}
                                                            {!entry.is_revenue ? (
                                                                entry.type === 'Reversion' ? null : (
                                                                    <button
                                                                        onClick={() => handleRevert(entry.id)}
                                                                        className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-200 dark:hover:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-900 rounded-xl transition-all shadow-sm flex items-center justify-center"
                                                                        title="Revert Change"
                                                                    >
                                                                        <RefreshCcw className="w-4 h-4" />
                                                                    </button>
                                                                )
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleDeleteRevenue(entry.id)}
                                                                    className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-900 rounded-xl transition-all shadow-sm flex items-center justify-center"
                                                                    title="Delete Record"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
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

            {/* Edit Modal */}
            {editingItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setEditingItem(null)}></div>

                    <div className="relative bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 dark:border-slate-800 transform transition-all animate-in fade-in zoom-in duration-300">
                        <div className="px-10 pt-10 pb-6 border-b border-slate-50">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <Edit className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                                Edit Ledger Entry
                            </h3>
                            <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Adjusting transaction details for audit accuracy</p>
                        </div>

                        <form onSubmit={submitEdit} className="p-10">
                            {editingItem.is_revenue ? (
                                <div className="mb-6">
                                    <InputLabel htmlFor="amount" value="Revenue Amount (₹)" className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2" />
                                    <TextInput
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-slate-900/10"
                                        value={editForm.data.amount}
                                        onChange={(e) => editForm.setData('amount', e.target.value)}
                                        required
                                    />
                                    <InputError message={editForm.errors.amount} className="mt-2" />
                                </div>
                            ) : (
                                <>
                                    <div className="mb-6">
                                        <InputLabel htmlFor="reason" value="Adjustment Reason" className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2" />
                                        <TextInput
                                            id="reason"
                                            type="text"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-slate-900/10"
                                            value={editForm.data.reason}
                                            onChange={(e) => editForm.setData('reason', e.target.value)}
                                            required
                                        />
                                        <InputError message={editForm.errors.reason} className="mt-2" />
                                    </div>
                                    <div className="mb-6">
                                        <InputLabel htmlFor="unit_cost" value="Unit Cost (₹)" className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2" />
                                        <TextInput
                                            id="unit_cost"
                                            type="number"
                                            step="0.01"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-slate-900/10"
                                            value={editForm.data.unit_cost}
                                            onChange={(e) => editForm.setData('unit_cost', e.target.value)}
                                        />
                                        <InputError message={editForm.errors.unit_cost} className="mt-2" />
                                    </div>
                                </>
                            )}

                            <div className="flex gap-4 mt-10">
                                <button
                                    type="button"
                                    onClick={() => setEditingItem(null)}
                                    className="flex-1 bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="flex-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 disabled:opacity-50"
                                >
                                    {editForm.processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>
                {`
                    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes zoom-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                    .animate-in { animation: fade-in 0.3s ease-out; }
                    .zoom-in { animation: zoom-in 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                `}
            </style>
        </AuthenticatedLayout>
    );
}
