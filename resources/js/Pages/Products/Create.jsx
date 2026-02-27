import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PageHeader from '@/Components/PageHeader';
import FormCard from '@/Components/FormCard';
import SlateButton from '@/Components/SlateButton';
import CancelLink from '@/Components/CancelLink';
import { Save, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function Create({ auth, categories }) {
    const { appSettings } = usePage().props;
    const currency = appSettings?.currency_symbol || '₹';

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category_id: '',
        sku: '',
        price: '',
        unit_size: '',
        specifications: [],
        description: '',
        image: null,
    });

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
        <AuthenticatedLayout>
            <Head title="Create Product" />

            <PageHeader
                title="Add New Product Type"
                subtitle="Fill in the details below to create a new product."
                backHref={route('products.index')}
            />

            <div className="max-w-2xl">
                <FormCard>
                    <form onSubmit={submit} className="space-y-6">

                        <div>
                            <InputLabel htmlFor="category_id" value="Category" />
                            <select
                                id="category_id"
                                name="category_id"
                                value={data.category_id}
                                className="mt-1 block w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-slate-200 dark:focus:ring-slate-700 rounded-xl shadow-sm"
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
                            <InputLabel htmlFor="name" value="Product Type Name" />
                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder={selectedCategory ? `e.g. 60x60 ${selectedCategory.name}` : 'e.g. 60x60 Premium Tiles'}
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel htmlFor="price" value={`Price per ${selectedCategory ? selectedCategory.unit_name : 'Unit'} (${currency})`} />
                                <TextInput
                                    id="price"
                                    type="number"
                                    name="price"
                                    step="0.01"
                                    value={data.price}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('price', e.target.value)}
                                    placeholder="0.00"
                                />
                                <InputError message={errors.price} className="mt-2" />
                            </div>

                            {selectedCategory && selectedCategory.metric_type !== 'fixed' && (
                                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-xl border border-blue-100">
                                    <div className="flex items-center mb-2 gap-2">
                                        <InputLabel
                                            htmlFor="unit_size"
                                            value={selectedCategory.metric_type === 'area' ? 'Coverage Area' : 'Weight'}
                                            className="text-blue-900 font-bold"
                                        />
                                        <Info className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <div className="flex items-center">
                                        <TextInput
                                            id="unit_size"
                                            type="number"
                                            name="unit_size"
                                            step="0.01"
                                            value={data.unit_size}
                                            className="block w-full bg-white dark:bg-slate-900 border-blue-200 focus:border-blue-400 focus:ring-blue-200 rounded-l-xl rounded-r-none"
                                            onChange={(e) => setData('unit_size', e.target.value)}
                                            placeholder={selectedCategory.metric_type === 'area' ? '1.44' : '50'}
                                        />
                                        <span className="inline-flex items-center px-3 py-2 border border-l-0 border-blue-200 bg-blue-100 text-blue-700 text-sm font-medium rounded-r-xl rounded-l-none">
                                            {selectedCategory.metric_type === 'area' ? `sq.m / ${selectedCategory.unit_name}` : `kg / ${selectedCategory.unit_name}`}
                                        </span>
                                    </div>
                                    <InputError message={errors.unit_size} className="mt-2" />
                                    <p className="text-xs text-blue-600 mt-1">
                                        Used to calculate total {selectedCategory.metric_type === 'area' ? 'area' : 'weight'} in quotations.
                                    </p>
                                </div>
                            )}

                            <div className={`${selectedCategory && selectedCategory.metric_type !== 'fixed' ? '' : 'md:col-span-2'}`}>
                                <InputLabel htmlFor="sku" value="SKU (Optional)" />
                                <TextInput
                                    id="sku"
                                    type="text"
                                    name="sku"
                                    value={data.sku}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('sku', e.target.value)}
                                    placeholder="e.g. TYP-001"
                                />
                                <InputError message={errors.sku} className="mt-2" />
                            </div>

                            <div className="md:col-span-2">
                                <InputLabel htmlFor="image" value="Product Image" />
                                <input
                                    type="file"
                                    id="image"
                                    className="mt-1 block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-slate-100 dark:bg-slate-950 file:text-slate-700 dark:text-slate-300 hover:file:bg-slate-200"
                                    onChange={(e) => setData('image', e.target.files[0])}
                                    accept="image/*"
                                />
                                <InputError message={errors.image} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value="Description" />
                            <textarea
                                id="description"
                                name="description"
                                className="mt-1 block w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-slate-200 dark:focus:ring-slate-700 rounded-xl shadow-sm"
                                rows="4"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Describe this product type..."
                            ></textarea>
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end border-t border-slate-100 dark:border-slate-800 pt-6 gap-3">
                            <CancelLink href={route('products.index')} />
                            <SlateButton disabled={processing}>
                                <Save className="w-4 h-4" /> Save Product Type
                            </SlateButton>
                        </div>
                    </form>
                </FormCard>
            </div>
        </AuthenticatedLayout>
    );
}
