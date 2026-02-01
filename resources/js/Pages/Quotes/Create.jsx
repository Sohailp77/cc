import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react'; // Import router for manual visits if needed
import { useState, useEffect } from 'react';
import { Plus, Trash2, Printer, Check, FileText, Search, Calculator, User, Mail, Phone, ShoppingCart, CreditCard, Package, ChevronRight } from 'lucide-react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Create({ auth, products }) {
    const { props } = usePage();
    const { data, setData, post, processing, errors, reset } = useForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        gst_type: 'igst',
        gst_rate: 18.00,
        discount_percentage: 0,
        notes: '',
        items: [
            { id: Date.now(), product_id: '', product_variant_id: '', quantity: 1, price: 0, area: '', _search: '' }
        ]
    });

    // Listen for PDF URL in flash messages
    useEffect(() => {
        if (props.flash.pdf_url) {
            window.open(props.flash.pdf_url, '_blank');
        }
    }, [props.flash]);

    // Helper: Find product by ID
    const getProduct = (id) => products.find(p => p.id === parseInt(id));

    // Helper: Find variant by ID
    const getVariant = (pId, vId) => {
        const product = getProduct(pId);
        return product?.variants?.find(v => v.id === parseInt(vId));
    };

    const addItem = () => {
        setData('items', [
            ...data.items,
            { id: Date.now(), product_id: '', product_variant_id: '', quantity: 1, price: 0, area: '', _search: '' }
        ]);
    };

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
                // Default area based on quantity 1 if it has unit size? No, keep empty initially.
            }
        }
        else if (field === 'product_variant_id') {
            const variant = getVariant(item.product_id, value);
            if (variant) {
                item.price = variant.variant_price || getProduct(item.product_id).price;
            }
        }
        else if (field === 'area' && product?.unit_size && product?.category?.metric_type === 'area') {
            // Area Changed -> Calc Quantity
            const area = parseFloat(value);
            if (area > 0) {
                const unitSize = parseFloat(product.unit_size);
                item.quantity = Math.ceil(area / unitSize);
            }
        }
        else if (field === 'quantity' && product?.unit_size && product?.category?.metric_type === 'area') {
            // Quantity Changed -> Update Estimated Area
            const qty = parseInt(value);
            if (qty > 0) {
                const unitSize = parseFloat(product.unit_size);
                item.area = (qty * unitSize).toFixed(2);
            }
        }

        newItems[index] = item;
        setData('items', newItems);
    };

    // Calculate totals for preview
    const calculateSubtotal = () => {
        return data.items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
    };

    const subtotal = calculateSubtotal();
    const discountAmount = (subtotal * Number(data.discount_percentage)) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * Number(data.gst_rate)) / 100;
    const totalAmount = taxableAmount + taxAmount;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('quotes.store'), {
            onSuccess: () => {
                reset();
                // PDF will be handled by useEffect
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Quotation</h2>}
        >
            <Head title="New Quote" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* 1. Customer Details */}
                        <div className="bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-50 bg-gradient-to-r from-gray-50/80 to-white flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="bg-indigo-50 p-2 rounded-xl mr-4">
                                        <User className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 tracking-tight">Customer Information</h3>
                                        <p className="text-sm text-gray-500 font-medium tracking-wide">Who is this quote for?</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-2">
                                    <InputLabel htmlFor="customer_name" value="FULL NAME" className="text-xs font-bold text-gray-500 uppercase tracking-widest" />
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="h-4 w-4 text-gray-300 group-focus-within:text-indigo-400 transition-colors" />
                                        </div>
                                        <TextInput
                                            id="customer_name"
                                            value={data.customer_name}
                                            onChange={e => setData('customer_name', e.target.value)}
                                            className="block w-full pl-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl transition-all duration-200"
                                            placeholder="e.g. Acme Corp"
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.customer_name} />
                                </div>
                                <div className="space-y-2">
                                    <InputLabel htmlFor="customer_phone" value="PHONE NUMBER" className="text-xs font-bold text-gray-500 uppercase tracking-widest" />
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Phone className="h-4 w-4 text-gray-300 group-focus-within:text-indigo-400 transition-colors" />
                                        </div>
                                        <TextInput
                                            id="customer_phone"
                                            value={data.customer_phone}
                                            onChange={e => setData('customer_phone', e.target.value)}
                                            className="block w-full pl-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl transition-all duration-200"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                    <InputError message={errors.customer_phone} />
                                </div>
                                <div className="space-y-2">
                                    <InputLabel htmlFor="customer_email" value="EMAIL ADDRESS" className="text-xs font-bold text-gray-500 uppercase tracking-widest" />
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 text-gray-300 group-focus-within:text-indigo-400 transition-colors" />
                                        </div>
                                        <TextInput
                                            id="customer_email"
                                            type="email"
                                            value={data.customer_email}
                                            onChange={e => setData('customer_email', e.target.value)}
                                            className="block w-full pl-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl transition-all duration-200"
                                            placeholder="contact@example.com"
                                        />
                                    </div>
                                    <InputError message={errors.customer_email} />
                                </div>
                            </div>
                        </div>

                        {/* 2. Items Table */}
                        {/* <div className="bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-50 bg-white flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="bg-indigo-50 p-2 rounded-xl mr-4">
                                        <ShoppingCart className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">Items & Pricing</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-50 border border-transparent rounded-lg font-semibold text-xs text-indigo-700 uppercase tracking-widest hover:bg-indigo-100 active:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Item
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-16">Image</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-1/3">Product Details</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-32">Area</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Variant</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-24">Qty</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-32">Price</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider w-32">Total</th>
                                            <th className="px-6 py-4 text-right w-16"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {data.items.map((item, index) => {
                                            const product = getProduct(item.product_id);
                                            const variant = getVariant(item.product_id, item.product_variant_id);
                                            const imagePath = variant?.image_path || product?.image_path || product?.category?.image_path;

                                            return (
                                                <tr key={item.id} className="hover:bg-gray-50/80 transition-colors group">
                                                    <td className="px-6 py-4 align-top">
                                                        <div className="h-12 w-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden relative shadow-sm">
                                                            {imagePath ? (
                                                                <img
                                                                    src={imagePath}
                                                                    alt=""
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <Package className="h-5 w-5 text-gray-300" />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 align-top">
                                                        <select
                                                            className="block w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 transition-all"
                                                            value={item.product_id}
                                                            onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                                                            required
                                                        >
                                                            <option value="">Select Product...</option>
                                                            {products.map(p => (
                                                                <option key={p.id} value={p.id}>{p.name}</option>
                                                            ))}
                                                        </select>
                                                        {product?.description && (
                                                            <div className="mt-2 flex items-start">
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="text-xs text-gray-500 leading-relaxed bg-gray-50/80 p-2 rounded-lg border border-gray-100">
                                                                        {product.description}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 align-top">
                                                        {getProduct(item.product_id)?.category?.metric_type === 'area' ? (
                                                            <div className="relative">
                                                                <input
                                                                    type="number" step="0.01" min="0"
                                                                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 transition-all"
                                                                    placeholder="Sq.m"
                                                                    value={item.area}
                                                                    onChange={(e) => updateItem(index, 'area', e.target.value)}
                                                                />
                                                                {getProduct(item.product_id)?.unit_size && (
                                                                    <p className="mt-1 text-[10px] text-gray-400 font-medium">
                                                                        1 Box = {getProduct(item.product_id).unit_size}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-300 text-sm flex justify-center py-2">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 align-top">
                                                        <select
                                                            className="block w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 transition-all disabled:opacity-50"
                                                            value={item.product_variant_id}
                                                            onChange={(e) => updateItem(index, 'product_variant_id', e.target.value)}
                                                            disabled={!item.product_id || !getProduct(item.product_id)?.variants?.length}
                                                        >
                                                            <option value="">Base</option>
                                                            {getProduct(item.product_id)?.variants?.map(v => (
                                                                <option key={v.id} value={v.id}>{v.name}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4 align-top">
                                                        <input
                                                            type="number" min="1"
                                                            className="block w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 text-center transition-all"
                                                            value={item.quantity}
                                                            onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                            required
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 align-top">
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                                                            <input
                                                                type="number" min="0" step="0.01"
                                                                className="block w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 pl-6 transition-all"
                                                                value={item.price}
                                                                onChange={(e) => updateItem(index, 'price', e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 align-top text-right">
                                                        <span className="text-sm font-bold text-gray-900 block py-2.5">
                                                            ${(item.quantity * item.price).toFixed(2)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 align-top text-right">
                                                        {data.items.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeItem(index)}
                                                                className="text-gray-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {data.items.length === 0 && (
                                            <tr>
                                                <td colSpan="8" className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                                                        <div className="bg-gray-50 p-4 rounded-full mb-4">
                                                            <ShoppingCart className="w-8 h-8 text-gray-300" />
                                                        </div>
                                                        <h3 className="text-lg font-bold text-gray-900 mb-1">No items added</h3>
                                                        <p className="text-gray-500 text-sm mb-6">Select products from the catalog to build your quote.</p>
                                                        <button
                                                            type="button"
                                                            onClick={addItem}
                                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                        >
                                                            <Plus className="w-4 h-4 mr-2" />
                                                            Add First Item
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {data.items.length > 0 && (
                                <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="inline-flex items-center px-6 py-3 border border-gray-200 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-indigo-200 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Another Line Item
                                    </button>
                                </div>
                            )}

                            {errors.items && <div className="p-3 bg-red-50 text-red-600 text-sm text-center border-t border-red-100 font-medium">{errors.items}</div>}
                        </div> */}

                        <div className="bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
                            {/* Header Section */}
                            <div className="px-6 py-5 border-b border-gray-50 bg-white flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="bg-indigo-50 p-2 rounded-xl mr-4">
                                        <ShoppingCart className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">Items & Pricing</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-50 border border-transparent rounded-lg font-semibold text-xs text-indigo-700 uppercase tracking-widest hover:bg-indigo-100 active:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Item
                                </button>
                            </div>

                            {/* Body / List Section */}
                            <div className="p-6 bg-gray-50/30 space-y-4">
                                {data.items.map((item, index) => {
                                    const product = getProduct(item.product_id);
                                    const variant = getVariant(item.product_id, item.product_variant_id);
                                    const imagePath = variant?.image_path || product?.image_path || product?.category?.image_path;

                                    return (
                                        <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 relative group transition-all hover:border-indigo-200 hover:shadow-md">

                                            {/* Remove Button (Top Right) */}
                                            {data.items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    className="absolute top-2 right-4 text-gray-300 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-all mb-1"
                                                    title="Remove Item"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                                                {/* Column 1: Image & Product Selection (Takes up more space) */}
                                                <div className="md:col-span-12 lg:col-span-5 flex gap-4">
                                                    {/* Image */}
                                                    <div className="flex-shrink-0">
                                                        <div className="h-16 w-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden relative shadow-sm mt-1">
                                                            {imagePath ? (
                                                                <img src={imagePath} alt="" className="h-full w-full object-cover" />
                                                            ) : (
                                                                <Package className="h-6 w-6 text-gray-300" />
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Product Select & Description */}
                                                    <div className="flex-grow pr-8"> {/* Right padding to avoid hitting delete button */}
                                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                                            Product
                                                        </label>
                                                        <select
                                                            className="block w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 transition-all"
                                                            value={item.product_id}
                                                            onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                                                            required
                                                        >
                                                            <option value="">Select Product...</option>
                                                            {products.map(p => (
                                                                <option key={p.id} value={p.id}>{p.name}</option>
                                                            ))}
                                                        </select>
                                                        {product?.description && (
                                                            <p className="mt-2 text-xs text-gray-500 leading-relaxed bg-gray-50 p-2 rounded-lg border border-gray-100">
                                                                {product.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Column 2: Inputs Grid (Variant, Area, Qty, Price) */}
                                                <div className="md:col-span-12 lg:col-span-7">
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                                                        {/* Area Field */}
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                                                                Area (Sq.m)
                                                            </label>
                                                            {getProduct(item.product_id)?.category?.metric_type === 'area' ? (
                                                                <div className="relative">
                                                                    <input
                                                                        type="number" step="0.01" min="0"
                                                                        className="block w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 transition-all"
                                                                        value={item.area}
                                                                        onChange={(e) => updateItem(index, 'area', e.target.value)}
                                                                    />
                                                                    {getProduct(item.product_id)?.unit_size && (
                                                                        <p className="mt-1 text-[10px] text-gray-400 font-medium">
                                                                            1 Box = {getProduct(item.product_id).unit_size}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div className="h-[42px] flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100 text-gray-300">
                                                                    -
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Variant Field */}
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                                                                Variant
                                                            </label>
                                                            <select
                                                                className="block w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 transition-all disabled:opacity-50"
                                                                value={item.product_variant_id}
                                                                onChange={(e) => updateItem(index, 'product_variant_id', e.target.value)}
                                                                disabled={!item.product_id || !getProduct(item.product_id)?.variants?.length}
                                                            >
                                                                <option value="">Base</option>
                                                                {getProduct(item.product_id)?.variants?.map(v => (
                                                                    <option key={v.id} value={v.id}>{v.name}</option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        {/* Quantity Field */}
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                                                                Qty
                                                            </label>
                                                            <input
                                                                type="number" min="1"
                                                                className="block w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 text-center transition-all"
                                                                value={item.quantity}
                                                                onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                                required
                                                            />
                                                        </div>

                                                        {/* Price Field */}
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                                                                Unit Price
                                                            </label>
                                                            <div className="relative">
                                                                <span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                                                                <input
                                                                    type="number" min="0" step="0.01"
                                                                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 pl-6 transition-all"
                                                                    value={item.price}
                                                                    onChange={(e) => updateItem(index, 'price', e.target.value)}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                    </div>

                                                    {/* Row Footer: Total Display */}
                                                    <div className="mt-4 flex justify-end items-center pt-4 border-t border-gray-100">
                                                        <span className="text-xs font-medium text-gray-400 mr-3 uppercase tracking-wider">Line Total:</span>
                                                        <span className="text-lg font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                                                            ${(item.quantity * item.price).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Empty State */}
                                {data.items.length === 0 && (
                                    <div className="text-center py-12 px-6 bg-white rounded-xl border border-dashed border-gray-300">
                                        <div className="bg-gray-50 p-4 rounded-full mb-4 inline-flex">
                                            <ShoppingCart className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">No items added</h3>
                                        <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">Select products from the catalog to build your quote.</p>
                                        <button
                                            type="button"
                                            onClick={addItem}
                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add First Item
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Footer Action */}
                            {data.items.length > 0 && (
                                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="inline-flex items-center px-6 py-3 border border-gray-200 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-indigo-200 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Another Line Item
                                    </button>
                                </div>
                            )}

                            {errors.items && <div className="p-3 bg-red-50 text-red-600 text-sm text-center border-t border-red-100 font-medium">{errors.items}</div>}
                        </div>

                        {/* 3. Totals & Settings */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-32">
                            <div className="lg:col-span-7">
                                <div className="bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-gray-100 p-8 h-full">
                                    <h4 className="font-bold text-gray-900 mb-6 flex items-center tracking-tight">
                                        <div className="bg-indigo-50 p-1.5 rounded-lg mr-3">
                                            <FileText className="w-4 h-4 text-indigo-600" />
                                        </div>
                                        Terms & Notes
                                    </h4>
                                    <div className="relative">
                                        <textarea
                                            className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm p-4 min-h-[180px] resize-none transition-all duration-200 placeholder-gray-400"
                                            placeholder="Payment terms: 50% advance, balance on delivery.&#10;Delivery within 3-5 days.&#10;Installation charges extra."
                                            value={data.notes}
                                            onChange={e => setData('notes', e.target.value)}
                                        ></textarea>
                                        <p className="text-xs text-gray-400 mt-3 font-medium flex items-center justify-end">
                                            <Check className="w-3 h-3 mr-1" />
                                            Will appear on PDF
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-5">
                                <div className="bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
                                    <div className="p-6 border-b border-gray-50 bg-white">
                                        <h4 className="font-bold text-gray-900 flex items-center tracking-tight">
                                            <div className="bg-indigo-50 p-1.5 rounded-lg mr-3">
                                                <CreditCard className="w-4 h-4 text-indigo-600" />
                                            </div>
                                            Payment Details
                                        </h4>
                                    </div>
                                    <div className="p-8 space-y-6">
                                        <div className="flex justify-between items-center text-gray-600 group">
                                            <span className="text-sm font-medium">Subtotal</span>
                                            <span className="text-gray-900 font-bold group-hover:text-indigo-600 transition-colors">${subtotal.toFixed(2)}</span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-gray-600 text-sm font-medium">Discount</span>
                                                <div className="relative w-24 group">
                                                    <input
                                                        type="number" min="0" max="100" step="0.1"
                                                        className="block w-full text-sm border-gray-200 bg-gray-50 focus:bg-white rounded-lg focus:border-indigo-500 focus:ring-indigo-500 pr-8 py-1.5 transition-all text-right group-hover:border-gray-300"
                                                        value={data.discount_percentage}
                                                        onChange={e => setData('discount_percentage', e.target.value)}
                                                    />
                                                    <span className="absolute right-3 top-1.5 text-gray-400 text-xs font-bold">%</span>
                                                </div>
                                            </div>
                                            <span className="text-red-500 font-bold text-sm bg-red-50 px-2 py-1 rounded-md">-${discountAmount.toFixed(2)}</span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-gray-600 text-sm font-medium">Tax</span>
                                                <div className="flex space-x-2">
                                                    <select
                                                        className="text-xs border-gray-200 bg-gray-50 focus:bg-white rounded-lg focus:border-indigo-500 focus:ring-indigo-500 py-1.5 pl-2 pr-8 font-medium text-gray-600"
                                                        value={data.gst_type}
                                                        onChange={e => setData('gst_type', e.target.value)}
                                                    >
                                                        <option value="igst">IGST</option>
                                                        <option value="cgst_sgst">CGST/SGST</option>
                                                    </select>
                                                    <div className="relative w-20 group">
                                                        <input
                                                            type="number"
                                                            className="block w-full text-sm border-gray-200 bg-gray-50 focus:bg-white rounded-lg focus:border-indigo-500 focus:ring-indigo-500 pr-8 py-1.5 transition-all text-right group-hover:border-gray-300"
                                                            value={data.gst_rate}
                                                            onChange={e => setData('gst_rate', e.target.value)}
                                                        />
                                                        <span className="absolute right-3 top-1.5 text-gray-400 text-xs font-bold">%</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-gray-900 font-bold text-sm">${taxAmount.toFixed(2)}</span>
                                        </div>

                                        <div className="pt-6 border-t border-dashed border-gray-200">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <span className="text-base font-bold text-gray-900 block mb-1">Total Amount</span>
                                                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Including Taxes</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-4xl font-extrabold text-indigo-600 block tracking-tight">${totalAmount.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Action Bar */}
                        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200/60 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 transition-all duration-300">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                                <div className="hidden sm:flex items-center space-x-6">
                                    <div className="flex items-center space-x-2 text-gray-500">
                                        <div className="bg-gray-100 p-1.5 rounded-lg">
                                            <Package className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <span className="text-sm font-medium"><span className="text-gray-900 font-bold">{data.items.length}</span> Items</span>
                                    </div>
                                    <div className="h-8 w-px bg-gray-200"></div>
                                    <div className="text-gray-500 text-sm font-medium">
                                        Total Payable: <span className="font-bold text-indigo-600 text-xl ml-2">${totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="flex space-x-4 w-full sm:w-auto justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3.5 bg-indigo-600 border border-transparent rounded-xl font-bold text-white text-sm uppercase tracking-wider hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5"
                                    >
                                        {processing ? (
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <Printer className="w-5 h-5 mr-2.5" />
                                        )}
                                        {processing ? 'Processing...' : 'Save Quote & Download PDF'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div >
        </AuthenticatedLayout >
    );
}
