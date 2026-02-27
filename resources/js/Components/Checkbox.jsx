export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 dark:border-slate-600 text-brand-600 dark:text-brand-400 shadow-sm focus:ring-brand-500 ' +
                className
            }
        />
    );
}
