import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { BarChart3, Package, Layers, Plus, ExternalLink, ArrowRight, Quote, TrendingUp, Users, Download, Activity, ChevronRight, Sparkles, Zap, TrendingDown } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Dashboard({ auth, stats }) {
    const [greeting, setGreeting] = useState('');
    const [timeOfDay, setTimeOfDay] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting('Good morning');
            setTimeOfDay('morning');
        } else if (hour < 18) {
            setGreeting('Good afternoon');
            setTimeOfDay('afternoon');
        } else {
            setGreeting('Good evening');
            setTimeOfDay('evening');
        }
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-8 bg-gradient-to-br from-gray-50 to-indigo-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Enhanced Welcome Banner with Animation */}
                    <div className="relative mb-8 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-3xl blur opacity-70 group-hover:opacity-100 transition duration-500 animate-gradient-x"></div>
                        <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-900 rounded-3xl p-8 text-white overflow-hidden shadow-2xl">
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                                        <span className="text-sm font-medium text-indigo-200 bg-indigo-900/50 px-3 py-1 rounded-full">
                                            {timeOfDay} vibes
                                        </span>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                        {greeting}, <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{auth.user.name}</span>
                                    </h1>
                                    <p className="text-gray-300 max-w-xl">
                                        Here's what's happening with your catalog today.
                                    </p>
                                </div>
                                <div className="mt-4 md:mt-0">
                                    <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-2xl">
                                        <Activity className="w-5 h-5 text-green-400" />
                                        <div>
                                            <p className="text-xs text-gray-300">Last Login</p>
                                            <p className="text-sm font-semibold">Just now</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Animated Background Elements */}
                            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-20 animate-pulse"></div>
                            <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-10"></div>
                            <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white rounded-full opacity-5 animate-bounce"></div>
                        </div>
                    </div>

                    {/* Stats Grid - Enhanced with Trends */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Products</p>
                                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.total_products}</h3>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <Package className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <Link
                                    href={route('products.index')}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center group/link"
                                >
                                    View All
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                                </Link>
                                <div className="flex items-center text-green-600 text-sm">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    <span>+12%</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Categories</p>
                                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.total_categories}</h3>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <Layers className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <Link
                                    href={route('categories.index')}
                                    className="text-sm font-medium text-emerald-600 hover:text-emerald-800 transition-colors inline-flex items-center group/link"
                                >
                                    Manage
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                                </Link>
                                <div className="flex items-center text-blue-600 text-sm">
                                    <Users className="w-4 h-4 mr-1" />
                                    <span>5 active</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Value</p>
                                    <h3 className="text-3xl font-bold text-gray-900 mt-1">${stats.total_value || '0.00'}</h3>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <BarChart3 className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">Inventory worth</span>
                                <div className="flex items-center text-amber-600 text-sm">
                                    <Zap className="w-4 h-4 mr-1" />
                                    <span>Updated</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-indigo-200 text-sm font-medium uppercase tracking-wider">Pending Quotes</p>
                                    <h3 className="text-3xl font-bold text-white mt-1">0</h3>
                                </div>
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <Quote className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-indigo-200">Coming Soon</span>
                                <div className="flex items-center text-green-400 text-sm">
                                    <Sparkles className="w-4 h-4 mr-1" />
                                    <span>Beta</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Products - Enhanced */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">Recent Products</h3>
                                        <p className="text-sm text-gray-500 mt-1">Latest additions to your catalog</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Link
                                            href={route('products.index')}
                                            className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                                        >
                                            View All
                                        </Link>
                                        <Link
                                            href={route('products.create')}
                                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 inline-flex items-center"
                                        >
                                            <Plus className="w-4 h-4 mr-2" /> Add New
                                        </Link>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {stats.recent_products.length > 0 ? (
                                        stats.recent_products.map((product, index) => (
                                            <div
                                                key={product.id}
                                                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-all duration-200 group"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="relative">
                                                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                                                            {product.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        {index < 3 && (
                                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-xs text-white">
                                                                {index + 1}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                            {product.name}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <p className="text-xs font-semibold text-gray-900">${Number(product.price).toFixed(2)}</p>
                                                            <span className="text-xs text-gray-500">•</span>
                                                            <span className="text-xs text-gray-500">
                                                                {product.category?.name}

                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                                        {product.stock || 0} in stock
                                                    </span>
                                                    <Link
                                                        href={route('products.show', product.id)}
                                                        className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors group/link"
                                                    >
                                                        <ExternalLink className="w-4 h-4 group-hover/link:rotate-12 transition-transform" />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center">
                                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                                <Package className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <h4 className="text-gray-900 font-medium mb-2">No products yet</h4>
                                            <p className="text-gray-500 text-sm mb-4">Start by adding your first product</p>
                                            <Link
                                                href={route('products.create')}
                                                className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
                                            >
                                                <Plus className="w-4 h-4 mr-2" /> Add Product
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-gray-900">Quick Actions</h3>
                                    <Zap className="w-5 h-5 text-amber-500" />
                                </div>
                                <div className="space-y-3">
                                    <Link
                                        href={route('products.create')}
                                        className="group block w-full text-left px-4 py-4 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 text-gray-900 font-medium transition-all duration-300 border border-transparent hover:border-indigo-200 flex items-center justify-between"
                                    >
                                        <div className="flex items-center">
                                            <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                                                <Plus className="w-4 h-4 text-white" />
                                            </div>
                                            <span>Add New Product</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                    </Link>

                                    <Link
                                        href={route('categories.create')}
                                        className="group block w-full text-left px-4 py-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 text-gray-900 font-medium transition-all duration-300 border border-transparent hover:border-emerald-200 flex items-center justify-between"
                                    >
                                        <div className="flex items-center">
                                            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                                                <Layers className="w-4 h-4 text-white" />
                                            </div>
                                            <span>New Category</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                                    </Link>

                                    <button className="group block w-full text-left px-4 py-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-gray-900 font-medium transition-all duration-300 border border-transparent hover:border-amber-200 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                                                <Download className="w-4 h-4 text-white" />
                                            </div>
                                            <span>Export Catalog</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                                    </button>
                                </div>
                            </div>

                            {/* Performance Metrics */}
                            <div className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-2xl p-6 text-white">
                                <h3 className="font-bold mb-6">Performance</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-300">Catalog Growth</span>
                                        <div className="flex items-center text-green-400">
                                            <TrendingUp className="w-4 h-4 mr-1" />
                                            <span className="text-sm font-semibold">+24%</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-300">Avg. Price</span>
                                        <span className="text-sm font-semibold">$89.99</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-300">Low Stock Items</span>
                                        <span className="text-sm font-semibold text-amber-400">3 items</span>
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-300">Last Updated</span>
                                        <span className="text-sm">Today, 10:30 AM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            Need help? Check out our{' '}
                            <Link href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                                documentation
                            </Link>
                            {' '}or{' '}
                            <Link href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                                contact support
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}