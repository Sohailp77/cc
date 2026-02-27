import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Toast from '@/Components/Toast';
import ThemeProvider from '@/Components/ThemeProvider';
import { Settings, Bell, Search, LayoutDashboard, Package, Layers, FileText, ChevronDown, LogOut, User } from 'lucide-react';

export default function AuthenticatedLayout({ children }) {
    const { auth, appSettings } = usePage().props;
    const user = auth.user;
    const companyName = appSettings?.company_name || 'CatalogApp';
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const navItems = [
        { label: 'Dashboard', href: route('dashboard'), active: route().current('dashboard') },
        { label: 'Categories', href: route('categories.index'), active: route().current('categories.*') },
        { label: 'Products', href: route('products.index'), active: route().current('products.*') },
        { label: 'Quotes', href: route('quotes.create'), active: route().current('quotes.*') },
        { label: 'Settings', href: route('settings.index'), active: route().current('settings.*') },
    ];

    return (
        <ThemeProvider>
            <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500">

                {/* ── Header ─────────────────────────────────────── */}
                <header className="bg-slate-100 dark:bg-slate-950 px-4 sm:px-6 lg:px-10 pt-6 pb-2 transition-colors duration-500">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="bg-white dark:bg-slate-900 rounded-[28px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-none dark:border dark:border-slate-800 px-6 py-3 flex items-center justify-between gap-4 transition-colors duration-500">

                            {/* Logo */}
                            <Link href={route('dashboard')} className="flex items-center gap-2.5 flex-shrink-0">
                                <div className="w-9 h-9 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold text-base leading-none">
                                    {companyName.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white hidden sm:block truncate max-w-[140px] ">
                                    {companyName}
                                </span>
                            </Link>

                            {/* Desktop Nav */}
                            <nav className="hidden md:flex items-center gap-1">
                                {navItems.map(({ label, href, active }) => (
                                    <Link
                                        key={label}
                                        href={href}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${active
                                            ? 'bg-slate-900 dark:bg-brand-500 bg-brand-500 text-white shadow-sm'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white dark:text-white dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </nav>

                            {/* Right Actions */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {/* Search */}
                                <div className="relative hidden lg:block">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 dark:text-slate-300 placeholder-slate-400 rounded-full px-4 py-1.5 w-48 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-slate-900 dark:bg-slate-900 dark:focus:bg-slate-900 transition-all"
                                    />
                                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                </div>

                                {/* Bell */}
                                <Link
                                    href={route('settings.index')}
                                    className="w-9 h-9 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 dark:bg-slate-900 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white dark:text-white dark:hover:text-white transition-all relative"
                                >
                                    <Settings className="w-4 h-4" />
                                </Link>

                                {/* User Avatar */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 dark:border-slate-700 transition-all"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">{user.name.split(' ')[0]}</span>
                                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 hidden sm:block" />
                                    </button>

                                    {showUserMenu && (
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 dark:bg-slate-800 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-slate-100 dark:border-slate-800 dark:border-slate-700 overflow-hidden z-50">
                                            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 dark:border-slate-700">
                                                <p className="text-xs font-semibold text-slate-900 dark:text-white">{user.name}</p>
                                                <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user.email}</p>
                                            </div>
                                            <Link
                                                href={route('profile.edit')}
                                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 hover:text-slate-900 dark:hover:text-white dark:text-white transition-colors"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <User className="w-4 h-4" /> Profile
                                            </Link>
                                            <Link
                                                href={route('settings.index')}
                                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 hover:text-slate-900 dark:hover:text-white dark:text-white transition-colors"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <Settings className="w-4 h-4" /> Settings
                                            </Link>
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition-colors border-t border-slate-100 dark:border-slate-800"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <LogOut className="w-4 h-4" /> Log Out
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* Mobile hamburger */}
                                <button
                                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                                    className="md:hidden w-9 h-9 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {showMobileMenu
                                            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        }
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Mobile Nav Dropdown */}
                        {showMobileMenu && (
                            <div className="md:hidden mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden">
                                {navItems.map(({ label, href, active }) => (
                                    <Link
                                        key={label}
                                        href={href}
                                        className={`flex items-center px-5 py-3 text-sm font-medium transition-colors ${active ? 'bg-slate-900 dark:bg-brand-500 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-800'
                                            }`}
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        {label}
                                    </Link>
                                ))}
                                <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-3 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-900 dark:text-white">{user.name}</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500">{user.email}</p>
                                    </div>
                                    <Link href={route('logout')} method="post" as="button" className="text-xs text-red-500 dark:text-red-400 font-medium">
                                        Log Out
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* ── Main Content ───────────────────────────────── */}
                <main className="px-4 sm:px-6 lg:px-10 py-6">
                    <div className="max-w-[1400px] mx-auto">
                        {children}
                    </div>
                </main>

                <Toast />

                {/* Overlay for closing user menu */}
                {showUserMenu && (
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                )}
            </div>
        </ThemeProvider>
    );
}
