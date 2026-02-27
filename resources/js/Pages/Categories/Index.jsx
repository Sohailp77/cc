import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Plus, Edit, Trash2, Layers, Box, Ruler, CheckCircle } from 'lucide-react';

export default function Index({ auth, categories }) {

    const getIconForMetric = (type) => {
        switch (type) {
            case 'area': return <Ruler className="w-5 h-5 text-purple-500" />;
            case 'weight': return <Box className="w-5 h-5 text-brand-500 dark:text-brand-400" />;
            default: return <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Categories" />

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Product Categories</h2>
                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Define your product lines and their metrics.</p>
                    </div>
                    <Link
                        href={route('categories.create')}
                        className="inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-700 transition-all shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add Category
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {categories.map((category) => (
                    <div key={category.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-slate-800 p-6 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-0.5">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-950 flex items-center justify-center overflow-hidden">
                                {category.image_path ? (
                                    <img src={category.image_path} alt={category.name} className="h-full w-full object-cover" />
                                ) : (
                                    <Layers className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                                )}
                            </div>
                            <Link href={route('categories.edit', category.id)} className="p-2 text-slate-300 dark:text-slate-600 hover:text-slate-700 dark:hover:text-slate-300 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 rounded-xl transition-all">
                                <Edit className="w-4 h-4" />
                            </Link>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{category.name}</h3>
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400">
                                Unit: {category.unit_name}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900 text-blue-700">
                                {getIconForMetric(category.metric_type)}
                                <span className="capitalize">{category.metric_type}</span>
                            </span>
                        </div>
                        <p className="text-sm text-slate-400 dark:text-slate-500">{category.description || 'No description provided.'}</p>
                    </div>
                ))}

                {categories.length === 0 && (
                    <div className="col-span-full text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                        <Layers className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
                        <h3 className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">No categories yet</h3>
                        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Get started by creating a new product category.</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
