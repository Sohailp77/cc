import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

export default function Edit({ auth, product }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        category_id: product.category_id,
        name: product.name,
        sku: product.sku || '',
        price: product.price,
        unit_size: product.unit_size,
        description: product.description || '',
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('products.update', product.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Product</h2>}
        >
            <Head title="Edit Product" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link href={route('products.index')} className="text-gray-500 hover:text-gray-700 flex items-center transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Products
                        </Link>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl overflow-hidden shadow-xl sm:rounded-2xl border border-gray-100">
                        <div className="p-8">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Product Name" className="text-gray-700 font-medium" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full bg-white/50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                                        isFocused={true}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. Premium Widget"
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="sku" value="SKU (Stock Keeping Unit)" className="text-gray-700 font-medium" />
                                        <TextInput
                                            id="sku"
                                            type="text"
                                            name="sku"
                                            value={data.sku}
                                            className="mt-1 block w-full bg-white/50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                                            onChange={(e) => setData('sku', e.target.value)}
                                            placeholder="e.g. WID-001"
                                        />
                                        <InputError message={errors.sku} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="price" value="Price ($)" className="text-gray-700 font-medium" />
                                        <TextInput
                                            id="price"
                                            type="number"
                                            name="price"
                                            step="0.01"
                                            value={data.price}
                                            className="mt-1 block w-full bg-white/50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                                            onChange={(e) => setData('price', e.target.value)}
                                            placeholder="0.00"
                                        />
                                        <InputError message={errors.price} className="mt-2" />
                                    </div>

                                    {data.unit_size && (
                                        <div>
                                            <InputLabel htmlFor="unit_size" value="Unit Size" className="text-gray-700 font-medium" />
                                            <TextInput
                                                id="unit_size"
                                                type="number"
                                                name="unit_size"
                                                step="0.01"
                                                value={data.unit_size}
                                                className="mt-1 block w-full bg-white/50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                                                onChange={(e) => setData('unit_size', e.target.value)}
                                                placeholder="0.00"
                                            />
                                            <InputError message={errors.unit_size} className="mt-2" />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <InputLabel htmlFor="description" value="Description" className="text-gray-700 font-medium" />
                                    <textarea
                                        id="description"
                                        name="description"
                                        className="mt-1 block w-full bg-white/50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm"
                                        rows="4"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Describe the product..."
                                    ></textarea>
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-between mt-8 border-t border-gray-100 pt-6">
                                    <Link
                                        href={route('products.destroy', product.id)}
                                        method="delete"
                                        as="button"
                                        className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 border border-transparent rounded-lg font-semibold text-xs uppercase tracking-widest hover:bg-red-100 active:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Product
                                    </Link>

                                    <div className="flex items-center">
                                        <Link
                                            href={route('products.index')}
                                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150 mr-3"
                                        >
                                            Cancel
                                        </Link>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:from-indigo-700 hover:to-purple-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 shadow-lg glow"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            Update Product
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
