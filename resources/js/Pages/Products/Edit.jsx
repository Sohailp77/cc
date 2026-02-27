import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PageHeader from '@/Components/PageHeader';
import FormCard from '@/Components/FormCard';
import SlateButton from '@/Components/SlateButton';
import CancelLink from '@/Components/CancelLink';
import DangerButton from '@/Components/DangerButton';
import { Save, Trash2 } from 'lucide-react';

export default function Edit({ auth, product }) {
    const { appSettings } = usePage().props;
    const currency = appSettings?.currency_symbol || '₹';

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
        <AuthenticatedLayout>
            <Head title="Edit Product" />

            <PageHeader
                title={`Edit: ${product.name}`}
                subtitle="Update this product's details, price or image."
                backHref={route('products.index')}
            />

            <div className="max-w-2xl">
                <FormCard>
                    <form onSubmit={submit} className="space-y-6">

                        <div>
                            <InputLabel htmlFor="name" value="Product Name" />
                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g. 60x60 Vitrified Tile"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
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

                            <div>
                                <InputLabel htmlFor="price" value={`Price per unit (${currency})`} />
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

                            {data.unit_size && (
                                <div>
                                    <InputLabel htmlFor="unit_size" value="Unit Size / Coverage" />
                                    <TextInput
                                        id="unit_size"
                                        type="number"
                                        name="unit_size"
                                        step="0.01"
                                        value={data.unit_size}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('unit_size', e.target.value)}
                                        placeholder="0.00"
                                    />
                                    <InputError message={errors.unit_size} className="mt-2" />
                                </div>
                            )}
                        </div>

                        <div>
                            <InputLabel htmlFor="image" value="Product Image (Optional)" />
                            {product.image_path && (
                                <div className="mb-3">
                                    <img src={product.image_path} alt="Current" className="w-24 h-24 object-cover rounded-xl shadow-sm" />
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
                                placeholder="Describe the product..."
                            ></textarea>
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
                            <DangerButton href={route('products.destroy', product.id)} method="delete" as="button">
                                <Trash2 className="w-4 h-4" /> Delete Product
                            </DangerButton>
                            <div className="flex items-center gap-3">
                                <CancelLink href={route('products.index')} />
                                <SlateButton disabled={processing}>
                                    <Save className="w-4 h-4" /> Update Product
                                </SlateButton>
                            </div>
                        </div>
                    </form>
                </FormCard>
            </div>
        </AuthenticatedLayout>
    );
}
