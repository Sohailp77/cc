import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { Plus, Trash2, Package, Layers, Save, Tag, Edit, AlertTriangle, TrendingUp, TrendingDown, History } from 'lucide-react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PageHeader from '@/Components/PageHeader';
import SlateButton from '@/Components/SlateButton';
import DangerButton from '@/Components/DangerButton';
import { useState } from 'react';

function StockPanel({ product, currency, isBoss }) {
    const stockForm = useForm({
        quantity: '',
        direction: 'add',
        reason: '',
        product_variant_id: '',
        unit_cost: '',
        transaction_type: 'adjustment',
        amount: '',
    });

    const submitAdjustment = (e) => {
        e.preventDefault();
        stockForm.post(route('stock.adjust', product.id), {
            onSuccess: () => stockForm.reset(),
        });
    };

    const revertAdjustment = (id) => {
        if (confirm('Are you sure you want to revert this adjustment? This will undo the stock change and associated revenue/costs.')) {
            router.post(route('stock.revert', id));
        }
    };

    const baseStock = product.stock_quantity ?? 0;
    const variantsStock = product.variants?.reduce((sum, v) => sum + (v.stock_quantity || 0), 0) || 0;
    const totalStock = baseStock + variantsStock;
    const hasVariants = product.variants && product.variants.length > 0;

    const isLow = totalStock <= 5;
    const isOut = totalStock === 0;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6 mb-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-slate-400 dark:text-slate-500" /> Stock Management
                </h3>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${isOut ? 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-400' : isLow ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700 dark:text-emerald-400'
                    }`}>
                    {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                </span>
            </div>

            {/* Current stock display */}
            <div className="flex items-end gap-2 mb-2">
                <div className="text-5xl font-black text-slate-900 dark:text-white">{totalStock}</div>
                <div className="text-slate-400 dark:text-slate-500 text-sm mb-2">total units in stock</div>
            </div>

            {hasVariants && (
                <div className="flex gap-4 mb-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    <div className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                        Base: <span className="font-bold text-slate-700 dark:text-slate-300">{baseStock}</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                        Variants: <span className="font-bold text-slate-700 dark:text-slate-300">{variantsStock}</span>
                    </div>
                </div>
            )}
            {!hasVariants && <div className="mb-6"></div>}

            {isLow && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-5 text-sm text-amber-700">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    {isOut ? 'This product is out of stock. Restock immediately.' : `Low stock warning — only ${totalStock} units remaining.`}
                </div>
            )}

            {/* Adjustment form — boss only */}
            {isBoss && (
                <form onSubmit={submitAdjustment} className="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Manual Adjustment</h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Transaction Type</label>
                            <select
                                value={stockForm.data.transaction_type}
                                onChange={e => {
                                    stockForm.setData(prev => ({
                                        ...prev,
                                        transaction_type: e.target.value,
                                        // Auto-set signs based on type
                                        quantity_change: e.target.value === 'purchase' ? '' : e.target.value === 'sale' || e.target.value === 'loss' ? '-' : '',
                                    }));
                                }}
                                className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                            >
                                <option value="adjustment">Standard Adjustment</option>
                                <option value="sale">External Sale (Revenue)</option>
                                <option value="loss">Damage/Loss (Cost)</option>
                                <option value="purchase">External Purchase (Cost)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Target Item</label>
                            <select
                                value={stockForm.data.product_variant_id}
                                onChange={e => stockForm.setData('product_variant_id', e.target.value)}
                                className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                            >
                                <option value="">Base Product</option>
                                {product.variants?.map(v => (
                                    <option key={v.id} value={v.id}>{v.name}</option>
                                ))}
                            </select>
                        </div>
                        {stockForm.data.transaction_type === 'sale' ? (
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Total Revenue (₹)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={stockForm.data.amount}
                                    onChange={e => stockForm.setData('amount', e.target.value)}
                                    placeholder="Total sale amount"
                                    className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                                    required
                                />
                            </div>
                        ) : (
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                                    {stockForm.data.transaction_type === 'adjustment' ? 'Unit Cost (₹) (Optional)' : 'Unit Cost (₹)'}
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={stockForm.data.unit_cost}
                                    onChange={e => stockForm.setData('unit_cost', e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                                    required={stockForm.data.transaction_type !== 'adjustment'}
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                        <div className="lg:col-span-1">
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Quantity</label>
                            <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-slate-900/20 transition">
                                <button
                                    type="button"
                                    onClick={() => stockForm.setData('direction', 'add')}
                                    className={`px-3 py-2 text-xs font-bold transition ${stockForm.data.direction === 'add' ? 'bg-emerald-500 text-white' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    Add (+)
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    value={stockForm.data.quantity}
                                    onChange={e => stockForm.setData('quantity', e.target.value)}
                                    placeholder="Qty"
                                    className="w-full border-none px-3 py-2 text-sm focus:ring-0 text-center font-bold"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => stockForm.setData('direction', 'deduct')}
                                    className={`px-3 py-2 text-xs font-bold transition ${stockForm.data.direction === 'deduct' ? 'bg-red-500 text-white' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    Less (-)
                                </button>
                            </div>
                            {stockForm.errors.quantity && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{stockForm.errors.quantity}</p>}
                        </div>
                        <div className="lg:col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Reason / Comment</label>
                            <input
                                type="text"
                                value={stockForm.data.reason}
                                onChange={e => stockForm.setData('reason', e.target.value)}
                                placeholder="e.g. Received shipment, Manual count"
                                className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                                required
                            />
                            {stockForm.errors.reason && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{stockForm.errors.reason}</p>}
                        </div>
                        <button type="submit" disabled={stockForm.processing}
                            className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-700 transition disabled:opacity-60 h-[42px]">
                            Apply
                        </button>
                    </div>
                </form>
            )}

            {/* Adjustment History */}
            {product.stock_adjustments?.length > 0 && (
                <div className="mt-5">
                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5" /> Adjustment History
                    </h4>
                    <div className="space-y-4">
                        {product.stock_adjustments.slice(0, 10).map(adj => {
                            const isReversion = adj.type === 'reversion';
                            return (
                                <div key={adj.id} className={`flex items-center justify-between p-3 rounded-2xl border transition ${isReversion ? 'bg-slate-50/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 opacity-60' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${adj.quantity_change > 0 ? 'bg-emerald-50 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-400'}`}>
                                            {adj.quantity_change > 0 ? <Plus className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-900 dark:text-white">{adj.quantity_change > 0 ? '+' : ''}{adj.quantity_change}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                                                    {adj.type}
                                                </span>
                                                {adj.variant && <span className="text-[10px] font-bold text-sky-600">({adj.variant.name})</span>}
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px] leading-relaxed">{adj.reason}</p>
                                            {adj.reverted_at && (
                                                <span className="inline-flex mt-1 text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                                    Reverted
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="font-bold text-slate-700 dark:text-slate-300">{new Date(adj.created_at).toLocaleDateString()}</p>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500">By {adj.user?.name}</p>
                                        </div>
                                        {isBoss && !isReversion && !adj.reverted_at && (
                                            <button
                                                onClick={() => revertAdjustment(adj.id)}
                                                className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900 px-2 py-1 rounded transition border border-transparent hover:border-red-100 dark:hover:border-red-800"
                                            >
                                                Revert
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Show({ auth, product, isBoss }) {
    const { appSettings } = usePage().props;
    const currency = appSettings?.currency_symbol || '₹';

    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: product.id,
        name: '',
        sku: '',
        stock_quantity: '',
        variant_price: '',
        image: null,
        _method: undefined,
    });

    const [showVariantForm, setShowVariantForm] = useState(false);
    const [editingVariant, setEditingVariant] = useState(null);

    const editVariant = (variant) => {
        setEditingVariant(variant);
        setData({
            product_id: product.id,
            name: variant.name,
            sku: variant.sku || '',
            stock_quantity: variant.stock_quantity,
            variant_price: variant.variant_price || '',
            image: null,
            _method: 'put',
        });
        setShowVariantForm(true);
    };

    const cancelEdit = () => {
        reset();
        setEditingVariant(null);
        setShowVariantForm(false);
    };

    const submitVariant = (e) => {
        e.preventDefault();
        if (editingVariant) {
            post(route('product-variants.update', editingVariant.id), { forceFormData: true, onSuccess: cancelEdit });
        } else {
            post(route('product-variants.store'), { onSuccess: cancelEdit });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${product.name} - Details`} />

            <PageHeader
                title={product.name}
                subtitle={product.category?.name || 'Product Details'}
                backHref={route('products.index')}
                action={
                    <Link href={route('products.edit', product.id)}
                        className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all">
                        <Edit className="w-4 h-4" /> Edit Product
                    </Link>
                }
            />

            {/* Stock Panel */}
            <StockPanel product={product} currency={currency} isBoss={isBoss} />

            {/* Product Summary Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6 mb-5">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex items-start gap-5">
                        {product.image_path ? (
                            <img src={product.image_path} alt={product.name}
                                className="w-20 h-20 object-cover rounded-2xl shadow-sm flex-shrink-0" />
                        ) : (
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-950 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <Package className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{product.name}</h1>
                            {product.category && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs font-medium mr-2">
                                    <Layers className="w-3 h-3" /> {product.category.name}
                                </span>
                            )}
                            {product.sku && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900 text-blue-700 text-xs font-medium">
                                    SKU: {product.sku}
                                </span>
                            )}
                            <p className="text-sm text-slate-400 dark:text-slate-500 mt-3 max-w-lg">{product.description || 'No description provided.'}</p>
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <div className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold mb-1">Base Price</div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">{currency}{Number(product.price).toFixed(2)}</div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">per {product.category?.unit_name || 'unit'}</div>
                        {product.unit_size && (
                            <div className="mt-3 inline-flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
                                <Package className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                <div className="text-left">
                                    <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                        {product.category?.metric_type === 'area' ? 'Coverage' : 'Unit Size'}
                                    </span>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {product.unit_size} {product.category?.metric_type === 'area' ? 'sq.m' : ''} / {product.category?.unit_name}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Variants Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6">
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Tag className="w-5 h-5 text-slate-400 dark:text-slate-500" /> Model Variants / Items
                        </h3>
                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">Add specific colors or designs for this product type.</p>
                    </div>
                    <button
                        onClick={() => { setShowVariantForm(!showVariantForm); if (showVariantForm) cancelEdit(); }}
                        className="inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-700 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Add Item
                    </button>
                </div>

                {/* Variant Form */}
                {showVariantForm && (
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 mb-5">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {editingVariant ? 'Edit Variant' : 'Add New Variant'}
                            </h4>
                            <button onClick={cancelEdit} className="text-sm text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                                Cancel
                            </button>
                        </div>
                        <form onSubmit={submitVariant} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                            <div className="md:col-span-2 lg:col-span-1">
                                <InputLabel htmlFor="variant_name" value="Name" />
                                <TextInput id="variant_name" value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full" placeholder="e.g. Alpine White" />
                                <InputError message={errors.name} className="mt-1" />
                            </div>
                            <div>
                                <InputLabel htmlFor="image" value="Image" />
                                <input type="file" id="image"
                                    className="mt-1 block w-full text-xs text-slate-500 dark:text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700 dark:text-slate-300 hover:file:bg-slate-300"
                                    onChange={(e) => setData('image', e.target.files[0])} accept="image/*" />
                                <InputError message={errors.image} className="mt-1" />
                            </div>
                            <div>
                                <InputLabel htmlFor="variant_sku" value="SKU (Optional)" />
                                <TextInput id="variant_sku" value={data.sku}
                                    onChange={(e) => setData('sku', e.target.value)}
                                    className="mt-1 block w-full" placeholder="e.g. V-001" />
                                <InputError message={errors.sku} className="mt-1" />
                            </div>
                            <div>
                                <InputLabel htmlFor="stock_quantity" value="Initial Stock" />
                                <TextInput id="stock_quantity" type="number" value={data.stock_quantity}
                                    onChange={(e) => setData('stock_quantity', e.target.value)}
                                    className="mt-1 block w-full" placeholder="0" />
                                <InputError message={errors.stock_quantity} className="mt-1" />
                            </div>
                            <div>
                                <InputLabel htmlFor="variant_price" value={`Price Override (${currency})`} />
                                <TextInput id="variant_price" type="number" step="0.01" value={data.variant_price}
                                    onChange={(e) => setData('variant_price', e.target.value)}
                                    className="mt-1 block w-full" placeholder="Leave empty if same" />
                                <InputError message={errors.variant_price} className="mt-1" />
                            </div>
                            <div>
                                <SlateButton disabled={processing} className="w-full justify-center">
                                    <Save className="w-4 h-4" />
                                    {editingVariant ? 'Update' : 'Save'}
                                </SlateButton>
                            </div>
                        </form>
                    </div>
                )}

                {/* Variants Table */}
                {product.variants.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                        <Tag className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
                        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">No variants yet</h3>
                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Add specific items (colors, designs) for this product type.</p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50 dark:bg-slate-800">
                                <tr>
                                    {['Image', 'Item Name', 'SKU', 'Stock', 'Price Override', ''].map(h => (
                                        <th key={h} className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${h === '' ? 'text-right' : ''}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100">
                                {product.variants.map((variant) => (
                                    <tr key={variant.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 transition-colors">
                                        <td className="px-4 py-3">
                                            {variant.image_path ? (
                                                <img src={variant.image_path} alt={variant.name} className="w-10 h-10 rounded-xl object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-950 rounded-xl flex items-center justify-center">
                                                    <Package className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white">{variant.name}</td>
                                        <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{variant.sku || '—'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${variant.stock_quantity > 0 ? 'bg-green-100 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-400'}`}>
                                                {variant.stock_quantity}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {variant.variant_price ? (
                                                <span className="font-bold text-slate-900 dark:text-white">{currency}{Number(variant.variant_price).toFixed(2)}</span>
                                            ) : (
                                                <span className="text-slate-400 dark:text-slate-500 italic">Base</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => editVariant(variant)}
                                                    className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <Link href={route('product-variants.destroy', variant.id)} method="delete" as="button"
                                                    className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
