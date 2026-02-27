import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

/**
 * PageHeader — Twisty-style white rounded card shown at the top of every page.
 *
 * @param {string}      title      - Bold heading text
 * @param {string}      subtitle   - Soft description line below title
 * @param {string}      backHref   - If provided, shows a back-arrow link
 * @param {ReactNode}   action     - Optional right-side element (e.g. a button or link)
 */
export default function PageHeader({ title, subtitle, backHref, action }) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6 mb-5">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                    {backHref && (
                        <Link href={backHref} className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 dark:text-slate-300 transition-colors flex-shrink-0">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    )}
                    <div className="min-w-0">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white truncate">{title}</h2>
                        {subtitle && <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>}
                    </div>
                </div>
                {action && <div className="flex-shrink-0">{action}</div>}
            </div>
        </div>
    );
}
