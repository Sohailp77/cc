import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PageHeader from '@/Components/PageHeader';
import FormCard from '@/Components/FormCard';
import SlateButton from '@/Components/SlateButton';
import CancelLink from '@/Components/CancelLink';
import DangerButton from '@/Components/DangerButton';
import { Save, Trash2 } from 'lucide-react';

export default function Edit({ auth, category }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        name: category.name,
        unit_name: category.unit_name,
        metric_type: category.metric_type,
        description: category.description || '',
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('categories.update', category.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Category" />

            <PageHeader
                title={`Edit: ${category.name}`}
                subtitle="Update this category's name, unit or description."
                backHref={route('categories.index')}
            />

            <div className="max-w-2xl">
                <FormCard>
                    <form onSubmit={submit} className="space-y-6">

                        <div>
                            <InputLabel htmlFor="name" value="Category Name" />
                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel htmlFor="unit_name" value="Unit Name" />
                                <TextInput
                                    id="unit_name"
                                    type="text"
                                    name="unit_name"
                                    value={data.unit_name}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('unit_name', e.target.value)}
                                />
                                <InputError message={errors.unit_name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="metric_type" value="Metric Type" />
                                <select
                                    id="metric_type"
                                    name="metric_type"
                                    value={data.metric_type}
                                    className="mt-1 block w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-slate-200 dark:focus:ring-slate-700 rounded-xl shadow-sm"
                                    onChange={(e) => setData('metric_type', e.target.value)}
                                >
                                    <option value="fixed">Fixed (Quantity only)</option>
                                    <option value="area">Area (Sq.ft / Sq.m)</option>
                                    <option value="weight">Weight (Kg / Tons)</option>
                                </select>
                                <InputError message={errors.metric_type} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="image" value="Update Image (Optional)" />
                            {category.image_path && (
                                <div className="mb-3">
                                    <img src={category.image_path} alt="Current" className="w-16 h-16 object-cover rounded-xl shadow-sm" />
                                </div>
                            )}
                            <input
                                type="file"
                                id="image"
                                className="mt-1 block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-slate-100 dark:bg-slate-950 file:text-slate-700 dark:text-slate-300 hover:file:bg-slate-200"
                                onChange={(e) => setData('image', e.target.files[0])}
                                accept="image/*"
                            />
                            <InputError message={errors.image} className="mt-2" />
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
                            ></textarea>
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
                            <DangerButton href={route('categories.destroy', category.id)} method="delete" as="button">
                                <Trash2 className="w-4 h-4" /> Delete Category
                            </DangerButton>
                            <div className="flex items-center gap-3">
                                <CancelLink href={route('categories.index')} />
                                <SlateButton disabled={processing}>
                                    <Save className="w-4 h-4" /> Update Category
                                </SlateButton>
                            </div>
                        </div>
                    </form>
                </FormCard>
            </div>
        </AuthenticatedLayout>
    );
}
