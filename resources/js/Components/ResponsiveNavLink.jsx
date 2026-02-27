import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${active
                    ? 'border-brand-400 bg-brand-50 dark:bg-brand-900 text-brand-700 dark:text-brand-300 focus:border-brand-700 focus:bg-brand-100 dark:focus:bg-brand-800 focus:text-brand-800 dark:focus:text-brand-300'
                    : 'border-transparent text-gray-600 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-900 dark:bg-slate-900 hover:text-gray-800 dark:hover:text-slate-200 focus:border-gray-300 dark:focus:border-slate-600 focus:bg-gray-50 dark:focus:bg-slate-900 dark:bg-slate-900 focus:text-gray-800 dark:focus:text-slate-200'
                } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
