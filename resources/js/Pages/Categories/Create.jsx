import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { ArrowLeft, Save, Ruler, Box, CheckCircle } from 'lucide-react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        unit_name: '',
        metric_type: 'area',
        description: '',
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('categories.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Category</h2>}
        >
            <Head title="Create Category" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link href={route('categories.index')} className="text-gray-500 hover:text-gray-700 flex items-center transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Categories
                        </Link>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl overflow-hidden shadow-xl sm:rounded-2xl border border-gray-100">
                        <div className="p-8">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Category Name" className="text-gray-700 font-medium" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full bg-white/50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                                        isFocused={true}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. Premium Tiles"
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="unit_name" value="Unit Name" className="text-gray-700 font-medium" />
                                        <TextInput
                                            id="unit_name"
                                            type="text"
                                            name="unit_name"
                                            value={data.unit_name}
                                            className="mt-1 block w-full bg-white/50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                                            onChange={(e) => setData('unit_name', e.target.value)}
                                            placeholder="e.g. Box, Bag, Pcs"
                                        />
                                        <InputError message={errors.unit_name} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="metric_type" value="Metric Type" className="text-gray-700 font-medium" />
                                        <select
                                            id="metric_type"
                                            name="metric_type"
                                            value={data.metric_type}
                                            className="mt-1 block w-full bg-white/50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm"
                                            onChange={(e) => setData('metric_type', e.target.value)}
                                        >
                                            <option value="fixed">Fixed (Quantity only)</option>
                                            <option value="area">Area (Sq.ft / Sq.m)</option>
                                            <option value="weight">Weight (Kg / Tons)</option>
                                        </select>
                                        <InputError message={errors.metric_type} className="mt-2" />
                                        <p className="mt-1 text-xs text-gray-500">
                                            {data.metric_type === 'area' && 'For items like Tiles (Coverage per Box)'}
                                            {data.metric_type === 'weight' && 'For items like Cement (Weight per Bag)'}
                                            {data.metric_type === 'fixed' && 'For standard items like Basins'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="image" value="Category Image (Optional)" className="text-gray-700 font-medium" />
                                    <input
                                        type="file"
                                        id="image"
                                        className="mt-1 block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-indigo-50 file:text-indigo-700
                                        hover:file:bg-indigo-100"
                                        onChange={(e) => setData('image', e.target.files[0])}
                                        accept="image/*"
                                    />
                                    <InputError message={errors.image} className="mt-2" />
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
                                        placeholder="Describe what this category contains..."
                                    ></textarea>
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end mt-8 border-t border-gray-100 pt-6">
                                    <Link
                                        href={route('categories.index')}
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
                                        Save Category
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
