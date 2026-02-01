import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { ArrowLeft, Save, Info } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Create({ auth, categories }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category_id: '',
        sku: '',
        price: '',
        unit_size: '',
        specifications: [],
        description: '',
        image: null,
    }); // specifications handled separately

    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        if (data.category_id) {
            const category = categories.find(c => c.id === parseInt(data.category_id));
            setSelectedCategory(category);
        } else {
            setSelectedCategory(null);
        }
    }, [data.category_id, categories]);

    const submit = (e) => {
        e.preventDefault();
        post(route('products.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Add New Product Type</h2>}
        >
            <Head title="Create Product" />

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
                                    <InputLabel htmlFor="category_id" value="Category" className="text-gray-700 font-medium" />
                                    <select
                                        id="category_id"
                                        name="category_id"
                                        value={data.category_id}
                                        className="mt-1 block w-full bg-white/50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm"
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        autoFocus
                                    >
                                        <option value="">Select a Category...</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name} ({category.unit_name})
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.category_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="name" value="Product Type Name" className="text-gray-700 font-medium" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full bg-white/50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder={selectedCategory ? `e.g. 60x60 ${selectedCategory.name}` : 'e.g. 60x60 Premium Tiles'}
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="price" value={`Price per ${selectedCategory ? selectedCategory.unit_name : 'Unit'} ($)`} className="text-gray-700 font-medium" />
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

                                    {selectedCategory && selectedCategory.metric_type !== 'fixed' && (
                                        <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
                                            <div className="flex items-center mb-2">
                                                <InputLabel
                                                    htmlFor="unit_size"
                                                    value={selectedCategory.metric_type === 'area' ? 'Coverage Area' : 'Weight'}
                                                    className="text-indigo-900 font-bold"
                                                />
                                                <Info className="w-4 h-4 text-indigo-400 ml-2" />
                                            </div>
                                            <div className="flex items-center">
                                                <TextInput
                                                    id="unit_size"
                                                    type="number"
                                                    name="unit_size"
                                                    step="0.01"
                                                    value={data.unit_size}
                                                    className="block w-full bg-white border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-l-lg"
                                                    onChange={(e) => setData('unit_size', e.target.value)}
                                                    placeholder={selectedCategory.metric_type === 'area' ? '1.44' : '50'}
                                                />
                                                <span className="inline-flex items-center px-4 py-2 border border-l-0 border-indigo-200 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-r-lg">
                                                    {selectedCategory.metric_type === 'area' ? `sq.m / ${selectedCategory.unit_name}` : `kg / ${selectedCategory.unit_name}`}
                                                </span>
                                            </div>
                                            <InputError message={errors.unit_size} className="mt-2" />
                                            <p className="text-xs text-indigo-600 mt-1">
                                                Used effectively to calculate total {selectedCategory.metric_type === 'area' ? 'area' : 'weight'} in quotations.
                                            </p>
                                        </div>
                                    )}

                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="image" value="Product Image" />
                                        <input
                                            type="file"
                                            id="image"
                                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                            onChange={(e) => setData('image', e.target.files[0])}
                                            accept="image/*"
                                        />
                                        <InputError message={errors.image} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="sku" value="SKU (Optional)" className="text-gray-700 font-medium" />
                                        <TextInput
                                            id="sku"
                                            type="text"
                                            name="sku"
                                            value={data.sku}
                                            className="mt-1 block w-full bg-white/50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                                            onChange={(e) => setData('sku', e.target.value)}
                                            placeholder="e.g. TYP-001"
                                        />
                                        <InputError message={errors.sku} className="mt-2" />
                                    </div>
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
                                        placeholder="Describe this product type..."
                                    ></textarea>
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end mt-8 border-t border-gray-100 pt-6">
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
                                        Save Product Type
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
