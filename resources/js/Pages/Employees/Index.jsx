import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { UserPlus, Trash2, FileText, DollarSign, Mail, Award, Users } from 'lucide-react';

function fmt(v) {
    const n = Number(v || 0);
    if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toFixed(0);
}

export default function Index({ employees }) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = (id) => {
        if (!confirm('Remove this employee? Their quotes will remain.')) return;
        destroy(route('employees.destroy', id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Employees" />

            <div className="bg-slate-50/50 dark:bg-slate-800/50 min-h-screen rounded-[40px] p-6 lg:p-8 font-sans">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-brand-500 dark:text-brand-400" /> Team
                        </h1>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{employees.length} employees</p>
                    </div>
                    <Link href={route('employees.create')}
                        className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow hover:bg-slate-700 transition">
                        <UserPlus className="w-4 h-4" /> Add Employee
                    </Link>
                </div>

                {/* Performance Table */}
                <div className="bg-white dark:bg-slate-900 rounded-[28px] shadow-[0_2px_16px_-2px_rgba(0,0,0,0.06)] overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <Award className="w-4 h-4 text-brand-500 dark:text-brand-400" />
                        <h2 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Performance Ranking</h2>
                    </div>

                    {employees.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-300 dark:text-slate-600">
                            <Users className="w-12 h-12 mb-3" />
                            <p className="text-sm text-slate-400 dark:text-slate-500">No employees yet.</p>
                            <Link href={route('employees.create')} className="mt-3 text-xs text-brand-500 dark:text-brand-400 font-semibold hover:underline">
                                Add your first employee →
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {employees.map((emp, i) => {
                                const convRate = emp.quotes_count > 0
                                    ? Math.round((emp.accepted_quotes_count / emp.quotes_count) * 100)
                                    : 0;
                                return (
                                    <div key={emp.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 dark:bg-slate-800/80 transition group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white flex-shrink-0 ${i === 0 ? 'bg-brand-500' : i === 1 ? 'bg-slate-400 dark:bg-slate-600' : i === 2 ? 'bg-amber-600' : 'bg-slate-200 dark:bg-slate-800 !text-slate-600 dark:text-slate-400'}`}>
                                                {i + 1}
                                            </div>
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-300 to-slate-200 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold text-sm flex-shrink-0">
                                                {emp.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{emp.name}</p>
                                                <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {emp.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8">
                                            <div className="text-center hidden md:block">
                                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                                    <FileText className="w-3 h-3 text-slate-400 dark:text-slate-500" /> {emp.quotes_count}
                                                </p>
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500">Quotes</p>
                                            </div>
                                            <div className="text-center hidden md:block">
                                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                                    <DollarSign className="w-3 h-3 text-slate-400 dark:text-slate-500" /> {fmt(emp.quotes_sum_total_amount)}
                                                </p>
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500">Revenue</p>
                                            </div>
                                            <div className="text-center hidden lg:block">
                                                <p className={`text-sm font-bold ${convRate >= 50 ? 'text-emerald-600 dark:text-emerald-400' : convRate > 0 ? 'text-amber-600' : 'text-slate-400 dark:text-slate-500'}`}>
                                                    {convRate}%
                                                </p>
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500">Conversion</p>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(emp.id)}
                                                disabled={processing}
                                                className="p-2 rounded-xl text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition opacity-0 group-hover:opacity-100"
                                                title="Remove employee"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
