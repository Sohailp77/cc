import { Link } from '@inertiajs/react';

/**
 * CancelLink — Twisty outline cancel button using Inertia Link.
 */
export default function CancelLink({ href, children = 'Cancel' }) {
    return (
        <Link
            href={href}
            className="inline-flex items-center px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 transition-all"
        >
            {children}
        </Link>
    );
}
