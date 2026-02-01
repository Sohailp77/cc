import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Plus, Edit, Trash2, Layers, Box, Ruler, CheckCircle } from 'lucide-react';

export default function Index({ auth, categories }) {

    const getIconForMetric = (type) => {
        switch (type) {
            case 'area': return <Ruler className="w-5 h-5 text-purple-500" />;
            case 'weight': return <Box className="w-5 h-5 text-orange-500" />;
            default: return <CheckCircle className="w-5 h-5 text-green-500" />;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Product Categories</h2>}
        >
            <Head title="Categories" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-gray-600">
                            Define your product lines (e.g., Tiles, Sanitary, Cement) and their metrics.
                        </div>
                        <Link
                            href={route('categories.create')}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:from-indigo-700 hover:to-purple-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 shadow-lg"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Category
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-12 w-12 rounded-lg bg-indigo-50 flex items-center justify-center overflow-hidden">
                                        {category.image_path ? (
                                            <img src={category.image_path} alt={category.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <Layers className="h-6 w-6 text-indigo-600" />
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        <Link href={route('categories.edit', category.id)} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                                            <Edit className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-1">{category.name}</h3>
                                <div className="flex items-center space-x-2 mb-3">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        Unit: {category.unit_name}
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-100 flex items-center gap-1">
                                        {getIconForMetric(category.metric_type)}
                                        <span className="capitalize">{category.metric_type}</span>
                                    </span>
                                </div>

                                <p className="text-sm text-gray-500 flex-grow">
                                    {category.description || 'No description provided.'}
                                </p>
                            </div>
                        ))}

                        {categories.length === 0 && (
                            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                                <Layers className="mx-auto h-12 w-12 text-gray-300" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
                                <p className="mt-1 text-sm text-gray-500">Get started by creating a new product category.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
