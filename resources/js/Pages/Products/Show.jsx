import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2, Package, Layers, Save, Tag, ShoppingCart } from 'lucide-react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { useState } from 'react';

export default function Show({ auth, product }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: product.id,
        name: '',
        sku: '',
        stock_quantity: '',
        variant_price: '',
        image: null,
        _method: undefined,
    });

    const [showVariantForm, setShowVariantForm] = useState(false);
    const [editingVariant, setEditingVariant] = useState(null);

    const editVariant = (variant) => {
        setEditingVariant(variant);
        setData({
            product_id: product.id,
            name: variant.name,
            sku: variant.sku || '',
            stock_quantity: variant.stock_quantity,
            variant_price: variant.variant_price || '',
            image: null,
            _method: 'put',
        });
        setShowVariantForm(true);
    };

    const cancelEdit = () => {
        reset();
        setEditingVariant(null);
        setShowVariantForm(false);
    };



    const submitVariant = (e) => {
        e.preventDefault();

        if (editingVariant) {
            post(route('product-variants.update', editingVariant.id), {
                forceFormData: true, // Important for file uploads with PUT in Inertia
                onSuccess: () => {
                    cancelEdit();
                },
            });
        } else {
            post(route('product-variants.store'), {
                onSuccess: () => {
                    cancelEdit();
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Product Details</h2>}
        >
            <Head title={`${product.name} - Details`} />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <Link href={route('products.index')} className="text-gray-500 hover:text-gray-700 flex items-center transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Products
                        </Link>
                        <div className="flex space-x-3">
                            <Link
                                href={route('products.edit', product.id)}
                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
                            >
                                Edit Product Type
                            </Link>
                        </div>
                    </div>

                    {/* Product Type Header */}
                    <div className="bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl border border-gray-100 p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div>
                                <div className="flex items-center space-x-3 mb-2">
                                    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                                    {product.category && (
                                        <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium flex items-center">
                                            <Layers className="w-3 h-3 mr-1" />
                                            {product.category.name}
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-500 max-w-2xl">{product.description || 'No description provided.'}</p>
                            </div>
                            <div className="mt-4 md:mt-0 text-right">
                                <div className="text-sm text-gray-500 uppercase tracking-widest font-semibold">Base Price</div>
                                <div className="text-3xl font-bold text-gray-900">${Number(product.price).toFixed(2)}</div>
                                <div className="text-sm text-gray-500">per {product.category?.unit_name || 'unit'}</div>
                            </div>
                        </div>

                        {product.unit_size && (
                            <div className="mt-6 p-4 bg-gray-50 rounded-xl inline-flex items-center border border-gray-200">
                                <Package className="w-5 h-5 text-gray-400 mr-3" />
                                <div>
                                    <span className="block text-xs text-gray-500 font-medium uppercase">{product.category?.metric_type === 'area' ? 'Coverage' : 'Metric'}</span>
                                    <span className="text-lg font-semibold text-gray-900">
                                        {product.unit_size} {product.category?.metric_type === 'area' ? 'sq.m' : ''} <span className="text-gray-500 text-sm font-normal">per {product.category?.unit_name}</span>
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Variants Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                <Tag className="w-5 h-5 mr-2 text-indigo-500" />
                                Model Variants / Items
                            </h3>
                            <button
                                onClick={() => setShowVariantForm(!showVariantForm)}
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 shadow-md"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Item
                            </button>
                        </div>

                        {showVariantForm && (
                            <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-6 animate-fade-in-down">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-md font-medium text-gray-900">
                                        {editingVariant ? 'Edit Variant' : 'Add New Variant'}
                                    </h4>
                                    <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
                                        <ArrowLeft className="w-4 h-4" />
                                    </button>
                                </div>

                                <form onSubmit={submitVariant} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                                    <div className="md:col-span-2 lg:col-span-1">
                                        <InputLabel htmlFor="variant_name" value="Name (e.g. Alpine White)" />
                                        <TextInput
                                            id="variant_name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="Variant/Color Name"
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>
                                    <div className="md:col-span-2 lg:col-span-1">
                                        <InputLabel htmlFor="image" value="Item Image" />
                                        <input
                                            type="file"
                                            id="image"
                                            className="mt-1 block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                            onChange={(e) => setData('image', e.target.files[0])}
                                            accept="image/*"
                                        />
                                        <InputError message={errors.image} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="variant_sku" value="SKU (Optional)" />
                                        <TextInput
                                            id="variant_sku"
                                            value={data.sku}
                                            onChange={(e) => setData('sku', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="Specific SKU"
                                        />
                                        <InputError message={errors.sku} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="stock_quantity" value="Initial Stock" />
                                        <TextInput
                                            id="stock_quantity"
                                            type="number"
                                            value={data.stock_quantity}
                                            onChange={(e) => setData('stock_quantity', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="0"
                                        />
                                        <InputError message={errors.stock_quantity} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="variant_price" value="Price Override ($)" />
                                        <TextInput
                                            id="variant_price"
                                            type="number"
                                            step="0.01"
                                            value={data.variant_price}
                                            onChange={(e) => setData('variant_price', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="Leave empty if same"
                                        />
                                        <InputError message={errors.variant_price} className="mt-2" />
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-gray-900 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {editingVariant ? 'Update' : 'Save Item'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="bg-white/80 backdrop-blur-xl shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                            {product.variants.length === 0 ? (
                                <div className="text-center py-12">
                                    <Tag className="mx-auto h-12 w-12 text-gray-300" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No variants added</h3>
                                    <p className="mt-1 text-sm text-gray-500">Add specific items (colors, designs) for this product type.</p>
                                </div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Override</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {product.variants.map((variant) => (
                                            <tr key={variant.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {variant.image_path ? (
                                                        <img src={variant.image_path} alt={variant.name} className="h-10 w-10 rounded-md object-cover" />
                                                    ) : (
                                                        <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                                                            <Package className="h-5 w-5 text-gray-300" />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{variant.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{variant.sku || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${variant.stock_quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {variant.stock_quantity}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {variant.variant_price ? (
                                                        <span className="font-bold text-indigo-600">${Number(variant.variant_price).toFixed(2)}</span>
                                                    ) : (
                                                        <span className="text-gray-400 italic">Base</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => editVariant(variant)}
                                                        className="text-indigo-600 hover:text-indigo-900 transition-colors bg-indigo-50 p-1.5 rounded-md hover:bg-indigo-100"
                                                    >
                                                        <Layers className="w-4 h-4" /> {/* Reusing icon for Edit */}
                                                    </button>
                                                    <Link
                                                        href={route('product-variants.destroy', variant.id)}
                                                        method="delete"
                                                        as="button"
                                                        className="text-red-400 hover:text-red-900 transition-colors bg-red-50 p-1.5 rounded-md hover:bg-red-100"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
