import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FileSpreadsheet, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Cart({ auth, quote }) {
    const { patch, delete: destroy, processing } = useForm();

    const updateQuantity = (item, newQuantity) => {
        if (newQuantity < 1) return;
        patch(route('quotes.update_item', item.id), {
            quantity: newQuantity
        });
    };

    const removeItem = (item) => {
        if (confirm('Are you sure you want to remove this item?')) {
            destroy(route('quotes.remove_item', item.id));
        }
    };

    const totalAmount = quote.items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-slate-200 leading-tight">My Quote</h2>}
        >
            <Head title="My Quote" />

            <div className="py-12 bg-gray-50 dark:bg-slate-900 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Current Draft: {quote.reference_id}</h3>
                            <p className="text-sm text-gray-500 dark:text-slate-400">Items: {quote.items.length}</p>
                        </div>
                        {quote.items.length > 0 && (
                            <a
                                href={route('quotes.export', quote.id)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 transition"
                            >
                                <FileSpreadsheet className="w-4 h-4 mr-2" />
                                Export Excel
                            </a>
                        )}
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                        {quote.items.length === 0 ? (
                            <div className="p-12 text-center">
                                <ShoppingCart className="mx-auto h-16 w-16 text-gray-200 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your quote is empty</h3>
                                <p className="text-gray-500 dark:text-slate-400 mb-6">Start adding products from the catalog.</p>
                                <Link
                                    href={route('products.index')}
                                    className="inline-flex items-center px-4 py-2 bg-brand-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-brand-700 transition"
                                >
                                    Browse Products <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 dark:bg-slate-900">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Unit Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Quantity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200">
                                    {quote.items.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-900 dark:bg-slate-900">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {item.product.name}
                                                        </div>
                                                        {item.variant && (
                                                            <div className="text-xs text-gray-500 dark:text-slate-400">
                                                                Variant: {item.variant.name}
                                                            </div>
                                                        )}
                                                        <div className="text-xs text-gray-400">
                                                            Cat: {item.product.category?.name} ({item.product.category?.unit_name})
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                                                ${Number(item.price).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => updateQuantity(item, item.quantity - 1)}
                                                        className="w-6 h-6 rounded bg-gray-100 dark:bg-slate-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-400"
                                                    >-</button>
                                                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item, item.quantity + 1)}
                                                        className="w-6 h-6 rounded bg-gray-100 dark:bg-slate-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-400"
                                                    >+</button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                                                ${(Number(item.price) * item.quantity).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => removeItem(item)}
                                                    className="text-red-400 hover:text-red-900 transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-50 dark:bg-slate-900">
                                        <td colSpan="3" className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">Total Estimation:</td>
                                        <td className="px-6 py-4 font-bold text-xl text-brand-600 dark:text-brand-400">${totalAmount.toFixed(2)}</td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
