import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Plus, Edit, Trash2, Search, Package, Layers } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function Index({ auth, products }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Product Types</h2>}
        >
            <Head title="Products" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search product types..."
                                className="pl-10 pr-4 py-2 border-none rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 bg-white/50 backdrop-blur-md"
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                        <Link
                            href={route('products.create')}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:from-indigo-700 hover:to-purple-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 shadow-lg"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Product Type
                        </Link>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl overflow-hidden shadow-xl sm:rounded-2xl border border-gray-100">
                        <div className="p-6">
                            {products.length === 0 ? (
                                <div className="text-center py-12">
                                    <Package className="mx-auto h-12 w-12 text-gray-300" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No product types</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new product type (e.g. 60x60 Vitrified).</p>
                                    <div className="mt-6">
                                        <Link
                                            href={route('products.create')}
                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                            New Product Type
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map((product) => (
                                        <div key={product.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                                            <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative overflow-hidden">
                                                {product.image_path ? (
                                                    <img src={product.image_path} alt={product.name} className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-500" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-48">
                                                        <Package className="w-12 h-12 text-gray-300" />
                                                    </div>
                                                )}
                                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm">
                                                    ${Number(product.price).toFixed(2)}
                                                </div>
                                            </div>
                                            <div className="p-6 pt-4 flex flex-col">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center">
                                                        <div className="ml-3">
                                                            <Link href={route('products.show', product.id)} className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                                                                {product.name}
                                                            </Link>
                                                            {product.category && (
                                                                <div className="text-xs text-gray-500 flex items-center">
                                                                    <Layers className="w-3 h-3 mr-1" />
                                                                    {product.category.name}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-1">
                                                        <Link href={route('products.edit', product.id)} className="p-1 text-gray-400 hover:text-indigo-600">
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                        {/* delete with confirmation using js  */}


                                                        {/* <Link href={route('products.destroy', product.id)} method="delete" as="button" className="p-1 text-gray-400 hover:text-red-600">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Link> */}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
                                                                    router.delete(route('products.destroy', product.id));
                                                                }
                                                            }}
                                                            className="p-1 text-gray-400 hover:text-red-600"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[2.5rem]">
                                                    {product.description || 'No description.'}
                                                </p>

                                                <div className="mt-auto border-t border-gray-100 pt-4 flex justify-between items-center text-sm">
                                                    <div>
                                                        <span className="block text-gray-400 text-xs">Base Price</span>
                                                        <span className="font-medium text-gray-900">${Number(product.price).toFixed(2)}</span>
                                                    </div>
                                                    {product.unit_size && (
                                                        <div className="text-right">
                                                            <span className="block text-gray-400 text-xs">
                                                                {product.category?.metric_type === 'area' ? 'Coverage' : 'Unit Size'}
                                                            </span>
                                                            <span className="font-medium text-gray-900 flex items-center">
                                                                {product.unit_size}
                                                                <span className="ml-1 text-xs text-gray-500">{product.category?.unit_name}</span>
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <Link
                                                    href={route('products.show', product.id)}
                                                    className="mt-4 w-full text-center py-2 bg-gray-50 hover:bg-indigo-50 text-indigo-600 font-medium rounded-lg text-sm transition-colors border border-gray-200 hover:border-indigo-100"
                                                >
                                                    Manage Variants
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
