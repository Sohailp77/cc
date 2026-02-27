import { Link } from '@inertiajs/react';

/**
 * DangerButton — Twisty-style destructive action button.
 * Pass `href` + `method="delete"` + `as="button"` for Inertia delete links,
 * or use `onClick` for a regular button.
 */
export default function DangerButton({ href, method, as, onClick, children, className = '' }) {
    const baseClass = `inline-flex items-center gap-2 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-red-100 dark:hover:bg-red-800 transition-all ${className}`;

    if (href) {
        return (
            <Link href={href} method={method} as={as} className={baseClass}>
                {children}
            </Link>
        );
    }

    return (
        <button type="button" onClick={onClick} className={baseClass}>
            {children}
        </button>
    );
}
