/**
 * SlateButton — Twisty primary action button (slate-900 background).
 * Use for form submit actions.
 */
export default function SlateButton({ children, disabled, className = '', type = 'submit', onClick }) {
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-700 transition-all shadow-sm disabled:opacity-40 ${className}`}
        >
            {children}
        </button>
    );
}
