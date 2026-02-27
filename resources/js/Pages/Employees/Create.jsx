import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { UserPlus, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function Create() {
    const [showPwd, setShowPwd] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('employees.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Employee" />

            <div className="bg-slate-50/50 dark:bg-slate-800/50 min-h-screen rounded-[40px] p-6 lg:p-8 font-sans">

                <div className="max-w-lg mx-auto">
                    <Link href={route('employees.index')}
                        className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 dark:text-slate-200 mb-6 transition">
                        <ArrowLeft className="w-4 h-4" /> Back to Team
                    </Link>

                    <div className="bg-white dark:bg-slate-900 rounded-[28px] p-8 shadow-[0_2px_16px_-2px_rgba(0,0,0,0.06)]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center">
                                <UserPlus className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-900 dark:text-white">Add Employee</h1>
                                <p className="text-xs text-slate-400 dark:text-slate-500">They will log in with these credentials</p>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            {/* Name */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="e.g. Ravi Kumar"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 dark:focus:border-slate-500"
                                    required
                                />
                                {errors.name && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="ravi@yourcompany.com"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 dark:focus:border-slate-500"
                                    required
                                />
                                {errors.email && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPwd ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        placeholder="Min. 8 characters"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 dark:focus:border-slate-500"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPwd(!showPwd)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 dark:text-slate-300">
                                        {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.password}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Confirm Password</label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    placeholder="Repeat password"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 dark:focus:border-slate-500"
                                    required
                                />
                            </div>

                            <div className="pt-2">
                                <button type="submit" disabled={processing}
                                    className="w-full bg-slate-900 text-white py-3 rounded-2xl text-sm font-bold hover:bg-slate-700 transition disabled:opacity-60">
                                    {processing ? 'Creating...' : 'Create Employee Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
