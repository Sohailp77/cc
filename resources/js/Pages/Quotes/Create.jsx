import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Printer, Check, FileText, User, Phone, Mail, ShoppingCart, CreditCard, Package } from 'lucide-react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PageHeader from '@/Components/PageHeader';

const inputCls = 'block w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-slate-200 dark:focus:ring-slate-700 text-sm py-2.5 transition-all';
const selectCls = inputCls;

export default function Create({ auth, products, taxRates, taxSettings }) {
    const { props, appSettings } = usePage();
    const currency = appSettings?.currency_symbol || '₹';
    const { data, setData, post, processing, errors, reset } = useForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        tax_mode: 'item_level',
        gst_rate: 0,
        discount_percentage: 0,
        notes: '',
        items: [
            { id: Date.now(), product_id: '', product_variant_id: '', quantity: 1, price: 0, area: '', _search: '', tax_rate: 0, tax_rate_id: '' }
        ]
    });

    useEffect(() => {
        if (props.flash.pdf_url) window.open(props.flash.pdf_url, '_blank');
    }, [props.flash]);

    const getProduct = (id) => products.find(p => p.id === parseInt(id));
    const getVariant = (pId, vId) => getProduct(pId)?.variants?.find(v => v.id === parseInt(vId));

    const addItem = () => setData('items', [
        ...data.items,
        { id: Date.now(), product_id: '', product_variant_id: '', quantity: 1, price: 0, area: '', _search: '', tax_rate: 0, tax_rate_id: '' }
    ]);

    const removeItem = (index) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const updateItem = (index, field, value) => {
        const newItems = [...data.items];
        const item = { ...newItems[index], [field]: value };
        const product = getProduct(item.product_id);

        if (field === 'product_id') {
            const prod = getProduct(value);
            if (prod) {
                item.price = prod.price || 0;
                item.product_variant_id = '';
                item.area = '';
                if (prod.tax_rate) { item.tax_rate = parseFloat(prod.tax_rate.rate); item.tax_rate_id = prod.tax_rate.id; }
                else if (prod.tax_rate_id) {
                    const rateObj = taxRates.find(r => r.id === prod.tax_rate_id);
                    if (rateObj) { item.tax_rate = parseFloat(rateObj.rate); item.tax_rate_id = rateObj.id; }
                }
            }
        } else if (field === 'product_variant_id') {
            const variant = getVariant(item.product_id, value);
            if (variant) item.price = variant.variant_price || getProduct(item.product_id).price;
        } else if (field === 'area' && product?.unit_size && product?.category?.metric_type === 'area') {
            const area = parseFloat(value);
            if (area > 0) item.quantity = Math.ceil(area / parseFloat(product.unit_size));
        } else if (field === 'quantity' && product?.unit_size && product?.category?.metric_type === 'area') {
            const qty = parseInt(value);
            if (qty > 0) item.area = (qty * parseFloat(product.unit_size)).toFixed(2);
        }

        newItems[index] = item;
        setData('items', newItems);
    };

    const subtotal = data.items.reduce((s, i) => s + Number(i.price) * Number(i.quantity), 0);
    const discountAmount = (subtotal * Number(data.discount_percentage)) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = data.tax_mode === 'global'
        ? (taxableAmount * Number(data.gst_rate)) / 100
        : data.items.reduce((s, i) => s + Number(i.price) * Number(i.quantity) * (Number(i.tax_rate) || 0) / 100, 0);
    const totalAmount = taxableAmount + taxAmount;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('quotes.store'), { onSuccess: () => reset() });
    };

    return (
        <AuthenticatedLayout>
            <Head title="New Quote" />

            <PageHeader title="Create Quotation" subtitle="Build a professional quote for your customer." />

            <form onSubmit={handleSubmit} className="space-y-5 pb-28">

                {/* ═══ 1. Customer Details ═══ */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-brand-50 dark:bg-brand-900 border border-brand-100 dark:border-brand-800 text-brand-600 dark:text-brand-400 rounded-lg flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Customer Details</h3>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                            <InputLabel htmlFor="customer_name" value="Full Name" className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1" />
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                                <TextInput id="customer_name" value={data.customer_name}
                                    onChange={e => setData('customer_name', e.target.value)}
                                    className="block w-full pl-9 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-900 text-sm" placeholder="e.g. Acme Corp" required />
                            </div>
                            <InputError message={errors.customer_name} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="customer_phone" value="Phone Number" className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1" />
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                                <TextInput id="customer_phone" value={data.customer_phone}
                                    onChange={e => setData('customer_phone', e.target.value)}
                                    className="block w-full pl-9 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-900 text-sm" placeholder="+91 98765 43210" />
                            </div>
                            <InputError message={errors.customer_phone} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="customer_email" value="Email Address" className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1" />
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                                <TextInput id="customer_email" type="email" value={data.customer_email}
                                    onChange={e => setData('customer_email', e.target.value)}
                                    className="block w-full pl-9 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-900 text-sm" placeholder="contact@example.com" />
                            </div>
                            <InputError message={errors.customer_email} className="mt-1" />
                        </div>
                    </div>
                </div>

                {/* ═══ 2. Items ═══ */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-brand-50 dark:bg-brand-900 border border-brand-100 dark:border-brand-800 text-brand-600 dark:text-brand-400 rounded-lg flex items-center justify-center flex-shrink-0">
                                <ShoppingCart className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Items & Pricing</h3>
                            </div>
                        </div>
                        <button type="button" onClick={addItem}
                            className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-all shadow-sm">
                            <Plus className="w-3.5 h-3.5" /> Add Item
                        </button>
                    </div>

                    <div className="p-0">
                        {data.items.length > 0 && (
                            <div className="hidden lg:grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                <div className="col-span-4">Product Details</div>
                                <div className="col-span-8">
                                    <div className={`grid gap-3 ${data.tax_mode === 'item_level' ? 'grid-cols-6' : 'grid-cols-5'}`}>
                                        <div className="col-span-1">Area</div>
                                        <div className="col-span-1">Variant</div>
                                        <div className="col-span-1 text-center">Qty</div>
                                        <div className="col-span-1 text-right">Price</div>
                                        {data.tax_mode === 'item_level' && <div className="col-span-1">Tax</div>}
                                        <div className="col-span-1 text-right">Total</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="divide-y divide-slate-100">
                            {data.items.map((item, index) => {
                                const product = getProduct(item.product_id);
                                const variant = getVariant(item.product_id, item.product_variant_id);
                                const imagePath = variant?.image_path || product?.image_path || product?.category?.image_path;
                                const lineTotal = Number(item.price) * Number(item.quantity);

                                return (
                                    <div key={item.id} className="p-5 relative group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                                            {/* Product selector + image */}
                                            <div className="lg:col-span-4 flex gap-3">
                                                {/* Remove Button Mobile */}
                                                {data.items.length > 1 && (
                                                    <button type="button" onClick={() => removeItem(index)}
                                                        className="lg:hidden absolute top-4 right-4 p-1.5 text-slate-300 dark:text-slate-600 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-all z-10">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0 mt-0.5">
                                                    {imagePath
                                                        ? <img src={imagePath} alt="" className="w-full h-full object-cover" />
                                                        : <Package className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                                                    }
                                                </div>
                                                <div className="flex-1 min-w-0 pr-6 lg:pr-0">
                                                    <select className={`${selectCls} py-2`} value={item.product_id}
                                                        onChange={e => updateItem(index, 'product_id', e.target.value)} required>
                                                        <option value="">Search or Select Product...</option>
                                                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                                    </select>
                                                    {product?.description && (
                                                        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1 group-hover:line-clamp-none transition-all">
                                                            {product.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Input grid */}
                                            <div className="lg:col-span-8 flex items-center">
                                                <div className={`w-full grid gap-3 items-center ${data.tax_mode === 'item_level' ? 'grid-cols-2 sm:grid-cols-6' : 'grid-cols-2 sm:grid-cols-5'}`}>
                                                    {/* Area */}
                                                    <div className="col-span-1">
                                                        <label className="lg:hidden block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Area</label>
                                                        {product?.category?.metric_type === 'area' ? (
                                                            <div>
                                                                <input type="number" step="0.01" min="0" className={`${inputCls} py-2 text-sm`}
                                                                    value={item.area} onChange={e => updateItem(index, 'area', e.target.value)} />
                                                            </div>
                                                        ) : (
                                                            <div className="h-[38px] flex items-center justify-center bg-transparent border border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-slate-300 dark:text-slate-600 text-xs">N/A</div>
                                                        )}
                                                    </div>

                                                    {/* Variant */}
                                                    <div className="col-span-1">
                                                        <label className="lg:hidden block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Variant</label>
                                                        <select className={`${selectCls} py-2 disabled:opacity-40 text-sm`}
                                                            value={item.product_variant_id}
                                                            onChange={e => updateItem(index, 'product_variant_id', e.target.value)}
                                                            disabled={!item.product_id || !getProduct(item.product_id)?.variants?.length}>
                                                            <option value="">Base</option>
                                                            {getProduct(item.product_id)?.variants?.map(v => (
                                                                <option key={v.id} value={v.id}>{v.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {/* Qty */}
                                                    <div className="col-span-1">
                                                        <label className="lg:hidden block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Qty</label>
                                                        <input type="number" min="1" className={`${inputCls} py-2 text-center font-medium`}
                                                            value={item.quantity} onChange={e => updateItem(index, 'quantity', e.target.value)} required />
                                                    </div>

                                                    {/* Price */}
                                                    <div className="col-span-1">
                                                        <label className="lg:hidden block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Price</label>
                                                        <div className="relative">
                                                            <span className="absolute left-2.5 top-2 text-slate-400 dark:text-slate-500 text-sm">{currency}</span>
                                                            <input type="number" min="0" step="0.01" className={`${inputCls} py-2 pl-6 text-right font-medium`}
                                                                value={item.price} onChange={e => updateItem(index, 'price', e.target.value)} required />
                                                        </div>
                                                    </div>

                                                    {/* Tax (item level) */}
                                                    {data.tax_mode === 'item_level' && (
                                                        <div className="col-span-1">
                                                            <label className="lg:hidden block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Tax</label>
                                                            <select className={`${selectCls} py-2 text-sm`}
                                                                value={item.tax_rate_id || ''}
                                                                onChange={e => {
                                                                    const rateId = e.target.value;
                                                                    const rateObj = taxRates.find(r => r.id == rateId);
                                                                    const newItems = [...data.items];
                                                                    newItems[index] = { ...item, tax_rate_id: rateId, tax_rate: rateObj ? parseFloat(rateObj.rate) : 0 };
                                                                    setData('items', newItems);
                                                                }}>
                                                                <option value="">0%</option>
                                                                {taxRates.map(tr => <option key={tr.id} value={tr.id}>{tr.name}</option>)}
                                                            </select>
                                                        </div>
                                                    )}

                                                    {/* Line Total & Desktop Actions */}
                                                    <div className="col-span-1 flex items-center justify-end gap-3">
                                                        <label className="lg:hidden block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Total</label>
                                                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                            <span className="text-slate-400 dark:text-slate-500 font-medium mr-0.5">{currency}</span>
                                                            {lineTotal.toFixed(2)}
                                                        </span>
                                                        {data.items.length > 1 && (
                                                            <button type="button" onClick={() => removeItem(index)}
                                                                className="hidden lg:flex w-7 h-7 items-center justify-center text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-md transition-all opacity-0 group-hover:opacity-100">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {data.items.length === 0 && (
                            <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                                <ShoppingCart className="mx-auto w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
                                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">No items added</h3>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Select products to build your quote.</p>
                                <button type="button" onClick={addItem}
                                    className="inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-slate-700 transition-all">
                                    <Plus className="w-4 h-4" /> Add First Item
                                </button>
                            </div>
                        )}

                        {errors.items && (
                            <div className="p-3 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-400 text-sm text-center rounded-xl border border-red-100 dark:border-red-800">{errors.items}</div>
                        )}

                        {data.items.length > 0 && (
                            <div className="flex justify-center pt-2">
                                <button type="button" onClick={addItem}
                                    className="inline-flex items-center gap-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-600 dark:text-slate-400 px-5 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all">
                                    <Plus className="w-4 h-4" /> Add Another Item
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ═══ 3. Notes + Totals ═══ */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Notes */}
                    <div className="lg:col-span-7">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 h-full">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-brand-50 dark:bg-brand-900 border border-brand-100 dark:border-brand-800 text-brand-600 dark:text-brand-400 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Terms & Notes</h4>
                            </div>
                            <textarea
                                className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-900 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-slate-200 dark:focus:ring-slate-700 text-sm p-4 min-h-[160px] resize-none transition-all"
                                placeholder={"Payment terms: 50% advance, balance on delivery.\nDelivery within 3-5 days.\nInstallation charges extra."}
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                            ></textarea>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 flex items-center gap-1 font-medium">
                                <Check className="w-3 h-3 text-emerald-500 dark:text-emerald-400" /> Will appear on the final PDF
                            </p>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/50">
                                <div className="w-8 h-8 bg-brand-50 dark:bg-brand-900 border border-brand-100 dark:border-brand-800 text-brand-600 dark:text-brand-400 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <CreditCard className="w-4 h-4" />
                                </div>
                                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Payment Summary</h4>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">Subtotal</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{currency}{subtotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between items-center text-sm group">
                                    <div className="flex items-center gap-3">
                                        <span className="text-slate-500 dark:text-slate-400 font-medium">Discount</span>
                                        <div className="relative w-20 opacity-70 group-hover:opacity-100 transition-opacity">
                                            <input type="number" min="0" max="100" step="0.1"
                                                className="block w-full text-xs border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg focus:border-brand-400 focus:ring-brand-100 dark:focus:ring-brand-900 pr-6 py-1.5 transition-all text-right font-medium"
                                                value={data.discount_percentage}
                                                onChange={e => setData('discount_percentage', e.target.value)} />
                                            <span className="absolute right-2.5 top-1.5 text-slate-400 dark:text-slate-500 text-[10px] font-bold">%</span>
                                        </div>
                                    </div>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold tracking-tight">-{currency}{discountAmount.toFixed(2)}</span>
                                </div>

                                {/* Tax Mode Toggle */}
                                <div className="flex justify-between items-center text-sm pt-2">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">Tax Mode</span>
                                    <div className="bg-slate-100/80 dark:bg-slate-950/80 p-0.5 rounded-lg flex text-[11px] font-bold uppercase tracking-wider">
                                        {[['global', 'Global'], ['item_level', 'Per Item']].map(([val, label]) => (
                                            <button key={val} type="button" onClick={() => setData('tax_mode', val)}
                                                className={`px-3 py-1.5 rounded-md transition-all ${data.tax_mode === val ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-3">
                                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                                            {data.tax_mode === 'global' ? 'Global Tax Rate' : 'Total Tax'}
                                        </span>
                                        {data.tax_mode === 'global' && (
                                            <div className="relative w-20">
                                                <input type="number"
                                                    className="block w-full text-xs border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg focus:border-brand-400 focus:ring-brand-100 dark:focus:ring-brand-900 pr-6 py-1.5 transition-all text-right font-medium"
                                                    value={data.gst_rate}
                                                    onChange={e => setData('gst_rate', e.target.value)} />
                                                <span className="absolute right-2.5 top-1.5 text-slate-400 dark:text-slate-500 text-[10px] font-bold">%</span>
                                            </div>
                                        )}
                                    </div>
                                    <span className="font-bold text-slate-700 dark:text-slate-300">{currency}{taxAmount.toFixed(2)}</span>
                                </div>

                                {/* GST Split */}
                                {taxSettings?.strategy === 'split' && taxAmount > 0 && (
                                    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl p-3 space-y-2 mt-2">
                                        {taxSettings.secondary_labels?.map((label) => (
                                            <div key={label} className="flex justify-between items-center text-xs">
                                                <span className="text-slate-500 dark:text-slate-400 font-medium">{label} <span className="text-[10px] text-slate-400 dark:text-slate-500">(50%)</span></span>
                                                <span className="text-slate-700 dark:text-slate-300 font-semibold">{currency}{(taxAmount / taxSettings.secondary_labels.length).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="pt-6 mt-4 border-t border-dashed border-slate-200 dark:border-slate-700">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <span className="text-sm font-bold text-slate-900 dark:text-white block uppercase tracking-wider">Total Amount</span>
                                            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Including all taxes</span>
                                        </div>
                                        <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                                            {currency}{totalAmount.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/* Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-700 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.04)] z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="hidden sm:flex items-center gap-6">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <Package className="w-4 h-4" />
                            <span className="text-sm font-medium"><span className="text-slate-900 dark:text-white font-bold">{data.items.length}</span> Items</span>
                        </div>
                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
                        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            Total: <span className="font-extrabold text-slate-900 dark:text-white text-lg ml-1">{currency}{totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                    <button type="button" onClick={handleSubmit} disabled={processing}
                        className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-3.5 bg-brand-600 text-white font-bold text-sm rounded-xl hover:bg-brand-700 transition-all disabled:opacity-50 shadow-lg shadow-brand-600/20">
                        {processing ? (
                            <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        ) : <Printer className="w-4 h-4" />}
                        {processing ? 'Generating...' : 'Save & Download PDF'}
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
