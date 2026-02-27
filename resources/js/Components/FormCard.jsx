/**
 * FormCard — Twisty-style white rounded card used as a form container.
 * Wraps form content with consistent padding and shadow.
 */
export default function FormCard({ children, className = '' }) {
    return (
        <div className={`bg-white dark:bg-slate-900 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-slate-800 p-8 ${className}`}>
            {children}
        </div>
    );
}
