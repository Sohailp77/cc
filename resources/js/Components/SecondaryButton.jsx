export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 dark:text-slate-300 shadow-sm transition duration-150 ease-in-out hover:bg-gray-50 dark:hover:bg-slate-900 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-25 ${disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
