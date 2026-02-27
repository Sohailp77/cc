import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Plus, Edit, Trash2, Search, Package, Layers } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function Index({ auth, products }) {
    const { appSettings } = usePage().props;
    const currency = appSettings?.currency_symbol || '₹';
    return (
        <AuthenticatedLayout>
            <Head title="Products" />

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Product Types</h2>
                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Manage your product catalog (e.g. 60×60 Vitrified, Matt).</p>
                    </div>
                    <Link
                        href={route('products.create')}
                        className="inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-700 transition-all shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add Product
                    </Link>
                </div>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <Package className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
                    <h3 className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">No product types</h3>
                    <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Get started by creating a new product type (e.g. 60x60 Vitrified).</p>
                    <div className="mt-5">
                        <Link href={route('products.create')} className="inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-700 transition-all">
                            <Plus className="w-4 h-4" /> New Product Type
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {products.map((product) => (
                        <div key={product.id} className="group bg-white dark:bg-slate-900 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-0.5">
                            <div className="bg-slate-100 dark:bg-slate-950 relative overflow-hidden">
                                {product.image_path ? (
                                    <img src={product.image_path} alt={product.name} className="object-cover w-full h-44 group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="flex items-center justify-center h-44">
                                        <Package className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm">
                                    {currency}{Number(product.price).toFixed(2)}
                                </div>
                            </div>
                            <div className="p-5 flex flex-col">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <Link href={route('products.show', product.id)} className="text-base font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                                            {product.name}
                                        </Link>
                                        {product.category && (
                                            <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center mt-0.5">
                                                <Layers className="w-3 h-3 mr-1" />{product.category.name}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-1">
                                        <Link href={route('products.edit', product.id)} className="p-1.5 text-slate-300 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all">
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => { if (confirm('Delete this product?')) router.delete(route('products.destroy', product.id)); }}
                                            className="p-1.5 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-400 dark:text-slate-500 mb-4 line-clamp-2 min-h-[2.5rem]">{product.description || 'No description.'}</p>

                                <div className="mt-auto border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center text-sm">
                                    <div><span className="block text-slate-400 dark:text-slate-500 text-xs">Base Price</span><span className="font-semibold text-slate-900 dark:text-white">{currency}{Number(product.price).toFixed(2)}</span></div>
                                    {product.unit_size && (
                                        <div className="text-right">
                                            <span className="block text-slate-400 dark:text-slate-500 text-xs">{product.category?.metric_type === 'area' ? 'Coverage' : 'Unit Size'}</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">{product.unit_size} <span className="text-xs text-slate-400 dark:text-slate-500">{product.category?.unit_name}</span></span>
                                        </div>
                                    )}
                                </div>

                                <Link href={route('products.show', product.id)} className="mt-4 w-full text-center py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-sm transition-colors">
                                    Manage Variants
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AuthenticatedLayout>
    );
}
