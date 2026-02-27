import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import {
    Package, Plus, Clock, Truck, CheckCircle2, AlertTriangle,
    Calendar, ArrowLeft, ChevronRight, Hash, TrendingUp
} from 'lucide-react';
import { useState } from 'react';

const STATUS_MAP = {
    pending: { label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
    transit: { label: 'In Transit', color: 'text-sky-600', bg: 'bg-sky-50', icon: Truck },
    received: { label: 'Received', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900', icon: CheckCircle2 },
};

export default function Index({ orders, products }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        product_id: '',
        product_variant_id: null,
        quantity: '',
        unit_cost: '',
        estimated_arrival: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('purchase-orders.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    const updateStatus = (id, status) => {
        router.patch(route('purchase-orders.updateStatus', id), { status });
    };

    const confirmReceived = (id) => {
        router.post(route('purchase-orders.confirm-received', id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Reorders (Purchase Orders)" />

            <div className="bg-slate-50/50 dark:bg-slate-800/50 min-h-screen rounded-[40px] p-6 lg:p-8 font-sans text-slate-800 dark:text-slate-200">

                {/* Header */}
                <div className="flex items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <Link href={route('dashboard')} className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 transition shadow-sm">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Purchase Orders</h1>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Manage product reorders and stock arrivals</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition"
                    >
                        <Plus className="w-4 h-4" /> New Reorder
                    </button>
                </div>

                {/* Content Table */}
                <div className="bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Qty</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Cost</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Estimated Arrival</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {orders.map((order) => {
                                    const st = STATUS_MAP[order.status];
                                    const StatusIcon = st.icon;
                                    return (
                                        <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 dark:bg-slate-800/50 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-950 rounded-xl flex items-center justify-center p-1 overflow-hidden border border-slate-200 dark:border-slate-700">
                                                        {order.product?.image_path ? (
                                                            <img src={`/storage/${order.product.image_path}`} alt="" className="w-full h-full object-cover rounded-lg" />
                                                        ) : (
                                                            <Package className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                                            {order.product?.name} {order.variant && <span className="text-slate-500 dark:text-slate-400 font-medium">({order.variant.name})</span>}
                                                        </p>
                                                        <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                                            <Hash className="w-3 h-3" /> PI-{order.id.toString().padStart(4, '0')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-950 px-3 py-1 rounded-lg">
                                                    {order.quantity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-sm font-medium text-slate-600 dark:text-slate-400">
                                                {order.unit_cost ? `₹${Number(order.unit_cost).toLocaleString()}` : '—'}
                                            </td>
                                            <td className="px-6 py-5 text-sm font-black text-slate-900 dark:text-white">
                                                {order.unit_cost ? `₹${(order.unit_cost * order.quantity).toLocaleString()}` : '—'}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-tight ${st.bg} ${st.color}`}>
                                                    <StatusIcon className="w-3.5 h-3.5" />
                                                    {st.label}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                                    <Calendar className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                                                    {order.status === 'received'
                                                        ? new Date(order.received_at).toLocaleDateString()
                                                        : order.estimated_arrival ? new Date(order.estimated_arrival).toLocaleDateString() : 'N/A'
                                                    }
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {order.status === 'pending' && (
                                                        <button
                                                            onClick={() => updateStatus(order.id, 'transit')}
                                                            className="text-xs font-bold text-sky-700 bg-sky-50 border border-sky-100 px-4 py-2 rounded-xl hover:bg-sky-100 transition shadow-sm"
                                                        >
                                                            Mark in Transit
                                                        </button>
                                                    )}
                                                    {order.status === 'transit' && (
                                                        <button
                                                            onClick={() => confirmReceived(order.id)}
                                                            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900 border border-emerald-100 dark:border-emerald-800 px-4 py-2 rounded-xl hover:bg-emerald-100 transition shadow-sm flex items-center gap-1.5"
                                                        >
                                                            <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Receipt
                                                        </button>
                                                    )}
                                                    {order.status === 'received' && (
                                                        <div className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> Completed
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-2 opacity-20">
                                                <Package className="w-12 h-12" />
                                                <p className="text-sm font-bold tracking-tight">No reorders found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* KPI Sidebar Suggestions? */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[32px] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-24 h-24" />
                        </div>
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                            Stock Projection
                        </h3>
                        <p className="text-slate-400 dark:text-slate-500 text-sm mb-6 max-w-xs leading-relaxed">
                            Currently tracking {orders.filter(o => o.status !== 'received').length} incoming shipments. Total units in transit: {orders.filter(o => o.status === 'transit').reduce((acc, curr) => acc + curr.quantity, 0)}.
                        </p>
                        <div className="flex gap-4">
                            <div className="bg-white/10 dark:bg-slate-900/10 px-4 py-3 rounded-2xl backdrop-blur-md">
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest mb-1">Incoming</p>
                                <p className="text-2xl font-black">{orders.filter(o => o.status !== 'received').reduce((acc, curr) => acc + curr.quantity, 0)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-lg p-10 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
                                    <Package className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">New Reorder</h3>
                            </div>
                            <button onClick={() => setIsCreateModalOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 transition text-slate-400 dark:text-slate-500">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Select Product</label>
                                <select
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-slate-900 transition"
                                    value={data.product_id ? JSON.stringify({ product_id: data.product_id, variant_id: data.product_variant_id }) : ''}
                                    onChange={e => {
                                        if (!e.target.value) {
                                            setData((prev) => ({ ...prev, product_id: '', product_variant_id: null }));
                                            return;
                                        }
                                        const val = JSON.parse(e.target.value);
                                        setData((prev) => ({ ...prev, product_id: val.product_id, product_variant_id: val.variant_id }));
                                    }}
                                    required
                                >
                                    <option value="">Choose a product...</option>
                                    {products.map(p => {
                                        if (p.variants && p.variants.length > 0) {
                                            return (
                                                <optgroup key={`p-${p.id}`} label={p.name}>
                                                    <option value={JSON.stringify({ product_id: p.id, variant_id: null })}>
                                                        {p.name} (Base) (Stock: {p.stock_quantity})
                                                    </option>
                                                    {p.variants.map(v => (
                                                        <option key={`v-${v.id}`} value={JSON.stringify({ product_id: p.id, variant_id: v.id })}>
                                                            {p.name} - {v.name} (Stock: {v.stock_quantity})
                                                        </option>
                                                    ))}
                                                </optgroup>
                                            );
                                        }
                                        return (
                                            <option key={`p-${p.id}`} value={JSON.stringify({ product_id: p.id, variant_id: null })}>
                                                {p.name} (Stock: {p.stock_quantity})
                                            </option>
                                        );
                                    })}
                                </select>
                                {errors.product_id && <p className="text-red-500 dark:text-red-400 text-xs mt-2 font-bold ml-1">{errors.product_id}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Quantity</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-slate-900 transition"
                                        placeholder="0"
                                        value={data.quantity}
                                        onChange={e => setData('quantity', e.target.value)}
                                        required
                                    />
                                    {errors.quantity && <p className="text-red-500 dark:text-red-400 text-xs mt-2 font-bold ml-1">{errors.quantity}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Unit Cost (₹)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-slate-900 transition"
                                        placeholder="0.00"
                                        value={data.unit_cost}
                                        onChange={e => setData('unit_cost', e.target.value)}
                                    />
                                    {errors.unit_cost && <p className="text-red-500 dark:text-red-400 text-xs mt-2 font-bold ml-1">{errors.unit_cost}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Est. Arrival</label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-slate-900 transition"
                                    value={data.estimated_arrival}
                                    onChange={e => setData('estimated_arrival', e.target.value)}
                                />
                                {errors.estimated_arrival && <p className="text-red-500 dark:text-red-400 text-xs mt-2 font-bold ml-1">{errors.estimated_arrival}</p>}
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-slate-900 text-white font-black py-5 rounded-[24px] shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                                >
                                    {processing ? 'Processing...' : 'Place Reorder'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
