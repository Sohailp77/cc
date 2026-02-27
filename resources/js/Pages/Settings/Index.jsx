import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import { Building2, Percent, Settings as SettingsIcon, Plus, Trash2, Edit2, Landmark, Target, AlertTriangle, Palette } from 'lucide-react';

export default function Settings({ auth, taxRates, taxConfiguration, companyProfile, businessGoals, themeSettings }) {
    const [activeTab, setActiveTab] = useState('general');
    const [showRateModal, setShowRateModal] = useState(false);
    const [editingRate, setEditingRate] = useState(null);
    const [showResetModal, setShowResetModal] = useState(false);

    // Forms
    const companyForm = useForm({
        company_name: companyProfile?.company_name || '',
        company_address: companyProfile?.company_address || '',
        company_phone: companyProfile?.company_phone || '',
        company_email: companyProfile?.company_email || '',
        gstin: companyProfile?.gstin || '',
        currency_symbol: companyProfile?.currency_symbol || '₹',
    });

    const bankForm = useForm({
        company_name: companyProfile?.company_name || '',       // required field – carry over
        company_address: companyProfile?.company_address || '',
        company_phone: companyProfile?.company_phone || '',
        company_email: companyProfile?.company_email || '',
        gstin: companyProfile?.gstin || '',
        currency_symbol: companyProfile?.currency_symbol || '₹',
        bank_name: companyProfile?.bank_name || '',
        bank_account_name: companyProfile?.bank_account_name || '',
        bank_account_number: companyProfile?.bank_account_number || '',
        bank_ifsc: companyProfile?.bank_ifsc || '',
        bank_branch: companyProfile?.bank_branch || '',
        bank_qr_code: null,
    });

    const configForm = useForm({
        strategy: taxConfiguration?.strategy || 'single',
        primary_label: taxConfiguration?.primary_label || 'Tax',
        secondary_labels: taxConfiguration?.secondary_labels || ['CGST', 'SGST'],
    });

    const goalsForm = useForm({
        monthly_revenue_goal: businessGoals?.monthly_revenue_goal || '',
        conversion_rate_goal: businessGoals?.conversion_rate_goal || '',
        monthly_stock_cost_budget: businessGoals?.monthly_stock_cost_budget || '',
    });

    const rateForm = useForm({
        name: '',
        rate: '',
        type: 'percentage',
        is_active: true,
    });

    const resetForm = useForm({
        confirmation: '',
    });

    const themeForm = useForm({
        theme_mode: themeSettings?.theme_mode || 'system',
        brand_color_primary: themeSettings?.brand_color_primary || '#6366f1',
    });

    // Handlers
    const submitTheme = (e) => {
        e.preventDefault();
        themeForm.put(route('settings.theme.update'));
    };
    const submitCompany = (e) => {
        e.preventDefault();
        companyForm.post(route('settings.company-profile.update'));
    };

    const submitBank = (e) => {
        e.preventDefault();
        bankForm.post(route('settings.company-profile.update'));
    };

    const submitConfig = (e) => {
        e.preventDefault();
        configForm.put(route('settings.tax-configuration.update'));
    };

    const submitGoals = (e) => {
        e.preventDefault();
        goalsForm.put(route('settings.business-goals.update'));
    };

    const openRateModal = (rate = null) => {
        setEditingRate(rate);
        if (rate) {
            rateForm.setData({
                name: rate.name,
                rate: rate.rate,
                type: rate.type,
                is_active: !!rate.is_active,
            });
        } else {
            rateForm.reset();
        }
        setShowRateModal(true);
    };

    const submitRate = (e) => {
        e.preventDefault();
        if (editingRate) {
            rateForm.put(route('settings.tax-rates.update', editingRate.id), {
                onSuccess: () => setShowRateModal(false),
            });
        } else {
            rateForm.post(route('settings.tax-rates.store'), {
                onSuccess: () => setShowRateModal(false),
            });
        }
    };

    const deleteRate = (rate) => {
        if (confirm('Are you sure you want to delete this tax rate?')) {
            router.delete(route('settings.tax-rates.destroy', rate.id));
        }
    };

    const submitReset = (e) => {
        e.preventDefault();
        resetForm.post(route('settings.start-fresh'), {
            onSuccess: () => {
                setShowResetModal(false);
                resetForm.reset();
            },
        });
    };

    const navItems = [
        { id: 'general', label: 'General Profile', icon: Building2 },
        { id: 'bank', label: 'Bank Details', icon: Landmark },
        { id: 'theme', label: 'Brand & Appearance', icon: Palette },
        { id: 'tax_config', label: 'Tax Configuration', icon: SettingsIcon },
        { id: 'tax_rates', label: 'Tax Rates', icon: Percent },
        { id: 'goals', label: 'Business Goals', icon: Target },
        { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, danger: true },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Settings" />

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-56 flex-shrink-0">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-3 space-y-1">
                        {navItems.map((navItem) => {
                            const { id, label, icon: Icon } = navItem;
                            return (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`flex items-center w-full px-4 py-3 text-sm font-semibold rounded-2xl transition-all ${activeTab === id
                                        ? (navItem.danger ? 'bg-red-600 text-white shadow-sm' : 'bg-slate-900 text-white shadow-sm')
                                        : (navItem.danger ? 'text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 hover:text-red-700 dark:hover:text-red-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-950 dark:bg-slate-950 hover:text-slate-800 dark:hover:text-slate-200 dark:text-slate-200')
                                        }`}
                                >
                                    <Icon className="w-4 h-4 mr-3" />
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6 min-h-[500px]">

                        {/* GENERAL TAB */}
                        {activeTab === 'general' && (
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">Company Profile</h3>
                                <form onSubmit={submitCompany} className="space-y-6 max-w-xl">
                                    <div>
                                        <InputLabel htmlFor="company_name" value="Company Name" />
                                        <TextInput
                                            id="company_name"
                                            value={companyForm.data.company_name}
                                            onChange={(e) => companyForm.setData('company_name', e.target.value)}
                                            className="mt-1 block w-full"
                                            required
                                        />
                                        <InputError message={companyForm.errors.company_name} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="contact_email" value="Official Email" />
                                        <TextInput
                                            id="contact_email"
                                            type="email"
                                            value={companyForm.data.company_email}
                                            onChange={(e) => companyForm.setData('company_email', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="contact_phone" value="Phone Number" />
                                        <TextInput
                                            id="contact_phone"
                                            value={companyForm.data.company_phone}
                                            onChange={(e) => companyForm.setData('company_phone', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="gstin" value="GSTIN / Tax ID" />
                                        <TextInput
                                            id="gstin"
                                            value={companyForm.data.gstin}
                                            onChange={(e) => companyForm.setData('gstin', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                    </div>
                                    {/* <div>
                                        <InputLabel htmlFor="currency_symbol" value="Currency Symbol" />
                                        <TextInput
                                            id="currency_symbol"
                                            value={companyForm.data.currency_symbol}
                                            onChange={(e) => companyForm.setData('currency_symbol', e.target.value)}
                                            className="mt-1 block w-full max-w-[120px]"
                                            placeholder="e.g. ₹ $ € £"
                                        />
                                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Used on invoices, dashboard, and quotes.</p>
                                    </div> */}
                                    <div>
                                        <InputLabel htmlFor="currency_symbol" value="Currency Symbol" />

                                        <select
                                            id="currency_symbol"
                                            value={companyForm.data.currency_symbol}
                                            onChange={(e) => companyForm.setData('currency_symbol', e.target.value)}
                                            className="mt-1 block w-full max-w-[120px] border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                        >
                                            <option value="">Select</option>
                                            <option value="$">$ (USD)</option>
                                            <option value="€">€ (EUR)</option>
                                            <option value="£">£ (GBP)</option>
                                            <option value="₹">₹ (INR)</option>
                                            <option value="﷼">﷼ (SAR)</option>
                                            <option value="د.إ">د.إ (AED)</option>
                                        </select>

                                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                                            Used on invoices, dashboard, and quotes.
                                        </p>
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="address" value="Address" />
                                        <textarea
                                            id="address"
                                            className="mt-1 block w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-slate-200 dark:focus:ring-slate-700 rounded-xl shadow-sm"
                                            rows="3"
                                            value={companyForm.data.company_address}
                                            onChange={(e) => companyForm.setData('company_address', e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <PrimaryButton disabled={companyForm.processing}>Save Profile</PrimaryButton>
                                        {companyForm.recentlySuccessful && <span className="text-sm text-green-600 dark:text-green-400">Saved.</span>}
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* BANK DETAILS TAB */}
                        {activeTab === 'bank' && (
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">Bank Details</h3>
                                <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">These details appear on the bottom of every PDF quotation.</p>
                                <form onSubmit={submitBank} className="space-y-6 max-w-xl">
                                    <div>
                                        <InputLabel htmlFor="bank_name" value="Bank Name" />
                                        <TextInput
                                            id="bank_name"
                                            value={bankForm.data.bank_name}
                                            onChange={(e) => bankForm.setData('bank_name', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="e.g. HDFC Bank"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="bank_account_name" value="Account Name" />
                                        <TextInput
                                            id="bank_account_name"
                                            value={bankForm.data.bank_account_name}
                                            onChange={(e) => bankForm.setData('bank_account_name', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="As per bank records"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="bank_account_number" value="Account Number" />
                                        <TextInput
                                            id="bank_account_number"
                                            value={bankForm.data.bank_account_number}
                                            onChange={(e) => bankForm.setData('bank_account_number', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="e.g. 50200012345678"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="bank_ifsc" value="IFSC / SWIFT Code" />
                                        <TextInput
                                            id="bank_ifsc"
                                            value={bankForm.data.bank_ifsc}
                                            onChange={(e) => bankForm.setData('bank_ifsc', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="e.g. HDFC0001234"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="bank_branch" value="Branch" />
                                        <TextInput
                                            id="bank_branch"
                                            value={bankForm.data.bank_branch}
                                            onChange={(e) => bankForm.setData('bank_branch', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="e.g. Main Branch, New Delhi"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="bank_qr_code" value="Payment QR Code Image (Optional)" />
                                        <input
                                            id="bank_qr_code"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => bankForm.setData('bank_qr_code', e.target.files[0])}
                                            className="mt-1 block w-full text-sm text-slate-500 dark:text-slate-400
                                              file:mr-4 file:py-2 file:px-4
                                              file:rounded-full file:border-0
                                              file:text-sm file:font-semibold
                                              file:bg-brand-50 file:text-brand-700
                                              hover:file:bg-brand-100"
                                        />
                                        {companyProfile?.bank_qr_code && (
                                            <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                                                A QR code is currently uploaded. <a href={'/storage/' + companyProfile.bank_qr_code} target="_blank" rel="noreferrer" className="underline">View QR Code</a>
                                            </div>
                                        )}
                                        <InputError message={bankForm.errors.bank_qr_code} className="mt-2" />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <PrimaryButton disabled={bankForm.processing}>Save Bank Details</PrimaryButton>
                                        {bankForm.recentlySuccessful && <span className="text-sm text-green-600 dark:text-green-400">Saved.</span>}
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* THEME TAB */}
                        {activeTab === 'theme' && (
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">Brand & Appearance</h3>
                                <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">Customize the look and feel of your application and PDF quotes.</p>
                                <form onSubmit={submitTheme} className="space-y-6 max-w-xl">
                                    <div>
                                        <InputLabel value="Theme Mode" />
                                        <div className="mt-2 flex gap-4">
                                            {['light', 'dark', 'system'].map((mode) => (
                                                <div key={mode} className="flex items-center">
                                                    <input
                                                        id={`theme_${mode}`}
                                                        type="radio"
                                                        name="theme_mode"
                                                        value={mode}
                                                        checked={themeForm.data.theme_mode === mode}
                                                        onChange={(e) => themeForm.setData('theme_mode', e.target.value)}
                                                        className="focus:ring-brand-500 h-4 w-4 text-brand-600 dark:text-brand-400 border-slate-300 dark:border-slate-600"
                                                    />
                                                    <label htmlFor={`theme_${mode}`} className="ml-2 block text-sm font-medium text-gray-700 dark:text-slate-300 capitalize">
                                                        {mode}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="brand_color_primary" value="Primary Brand Color" />
                                        <div className="flex items-center gap-3 mt-2">
                                            <input
                                                type="color"
                                                id="brand_color_primary"
                                                value={themeForm.data.brand_color_primary}
                                                onChange={(e) => themeForm.setData('brand_color_primary', e.target.value)}
                                                className="h-10 w-10 border-0 p-0 rounded-lg cursor-pointer flex-shrink-0"
                                            />
                                            <TextInput
                                                type="text"
                                                value={themeForm.data.brand_color_primary}
                                                onChange={(e) => themeForm.setData('brand_color_primary', e.target.value)}
                                                className="w-32 uppercase font-mono text-sm uppercase"
                                                placeholder="#6366F1"
                                                pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">Pick a custom color or enter a HEX code.</p>

                                        <div className="mt-4">
                                            <InputLabel value="Predefined Combos" className="mb-3" />
                                            <div className="flex gap-3">
                                                {[
                                                    { name: 'Default Indigo', hex: '#6366f1' },
                                                    { name: 'Calm Emerald', hex: '#10b981' },
                                                    { name: 'Vibrant Rose', hex: '#f43f5e' },
                                                    { name: 'Warm Amber', hex: '#f59e0b' },
                                                    { name: 'Ocean Sky', hex: '#0ea5e9' },
                                                    { name: 'Professional Slate', hex: '#475569' }
                                                ].map((c) => (
                                                    <button
                                                        key={c.hex}
                                                        type="button"
                                                        onClick={() => themeForm.setData('brand_color_primary', c.hex)}
                                                        className={`w-8 h-8 rounded-full border-2 transition-all shadow-sm ${themeForm.data.brand_color_primary.toLowerCase() === c.hex.toLowerCase() ? 'border-slate-900 scale-110 ring-2 ring-slate-400 ring-offset-2' : 'border-transparent hover:scale-110 hover:shadow-md'}`}
                                                        style={{ backgroundColor: c.hex }}
                                                        title={c.name}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <PrimaryButton disabled={themeForm.processing}>Save Theme Attributes</PrimaryButton>
                                        {themeForm.recentlySuccessful && <span className="text-sm text-green-600 dark:text-green-400">Theme updated perfectly.</span>}
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* TAX CONFIG TAB */}
                        {activeTab === 'tax_config' && (
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">Tax Configuration</h3>
                                <form onSubmit={submitConfig} className="space-y-6 max-w-xl">
                                    <div>
                                        <InputLabel value="Tax Strategy" />
                                        <div className="mt-2 space-y-4">
                                            <div className="flex items-center">
                                                <input
                                                    id="strategy_single"
                                                    type="radio"
                                                    name="strategy"
                                                    value="single"
                                                    checked={configForm.data.strategy === 'single'}
                                                    onChange={(e) => configForm.setData('strategy', e.target.value)}
                                                    className="focus:ring-slate-500 h-4 w-4 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600"
                                                />
                                                <label htmlFor="strategy_single" className="ml-3 block text-sm font-medium text-gray-700 dark:text-slate-300">
                                                    Single Rate (Standard)
                                                    <p className="text-gray-500 dark:text-slate-400 text-xs font-normal">Apply a single tax percentage (e.g. VAT 10%)</p>
                                                </label>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    id="strategy_split"
                                                    type="radio"
                                                    name="strategy"
                                                    value="split"
                                                    checked={configForm.data.strategy === 'split'}
                                                    onChange={(e) => configForm.setData('strategy', e.target.value)}
                                                    className="focus:ring-slate-500 h-4 w-4 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600"
                                                />
                                                <label htmlFor="strategy_split" className="ml-3 block text-sm font-medium text-gray-700 dark:text-slate-300">
                                                    Split Tax (Dual GST/HST)
                                                    <p className="text-gray-500 dark:text-slate-400 text-xs font-normal">Split tax into components (e.g. CGST + SGST)</p>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="primary_label" value="Primary Tax Label" />
                                        <TextInput
                                            id="primary_label"
                                            value={configForm.data.primary_label}
                                            onChange={(e) => configForm.setData('primary_label', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="e.g. GST"
                                        />
                                    </div>

                                    {configForm.data.strategy === 'split' && (
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Split Components Labels</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <TextInput
                                                    value={configForm.data.secondary_labels[0]}
                                                    onChange={(e) => {
                                                        const labels = [...configForm.data.secondary_labels];
                                                        labels[0] = e.target.value;
                                                        configForm.setData('secondary_labels', labels);
                                                    }}
                                                    placeholder="Component 1 (e.g. CGST)"
                                                />
                                                <TextInput
                                                    value={configForm.data.secondary_labels[1]}
                                                    onChange={(e) => {
                                                        const labels = [...configForm.data.secondary_labels];
                                                        labels[1] = e.target.value;
                                                        configForm.setData('secondary_labels', labels);
                                                    }}
                                                    placeholder="Component 2 (e.g. SGST)"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">Currently supports 2-way split (50/50) only.</p>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 pt-4">
                                        <PrimaryButton disabled={configForm.processing}>Update Configuration</PrimaryButton>
                                        {configForm.recentlySuccessful && <span className="text-sm text-green-600 dark:text-green-400">Updated.</span>}
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* TAX RATES TAB */}
                        {activeTab === 'tax_rates' && (
                            <div>
                                <div className="flex justify-between items-center border-b pb-4 mb-6">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Tax Rates Table</h3>
                                    <PrimaryButton onClick={() => openRateModal()}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add New Rate
                                    </PrimaryButton>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-slate-50 dark:bg-slate-800">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Rate (%)</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100">
                                            {taxRates.map((rate) => (
                                                <tr key={rate.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{rate.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{rate.rate}%</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${rate.is_active ? 'bg-green-100 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-300'}`}>
                                                            {rate.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button onClick={() => openRateModal(rate)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-950 dark:bg-slate-950 rounded-lg transition-all mr-2">
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => deleteRate(rate)} className="text-red-600 dark:text-red-400 hover:text-red-900">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {taxRates.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-slate-400">No tax rates found. Create one to get started.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* BUSINESS GOALS TAB */}
                        {activeTab === 'goals' && (
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">Business Goals & Targets</h3>
                                <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">Set performance targets to track your progress on the analytics dashboard.</p>
                                <form onSubmit={submitGoals} className="space-y-6 max-w-xl">
                                    <div>
                                        <InputLabel htmlFor="monthly_revenue_goal" value="Monthly Revenue Goal (₹)" />
                                        <TextInput
                                            id="monthly_revenue_goal"
                                            type="number"
                                            value={goalsForm.data.monthly_revenue_goal}
                                            onChange={(e) => goalsForm.setData('monthly_revenue_goal', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="e.g. 500000"
                                        />
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Total revenue target from accepted quotes per month.</p>
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="conversion_rate_goal" value="Conversion Rate Target (%)" />
                                        <TextInput
                                            id="conversion_rate_goal"
                                            type="number"
                                            step="0.1"
                                            value={goalsForm.data.conversion_rate_goal}
                                            onChange={(e) => goalsForm.setData('conversion_rate_goal', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="e.g. 25"
                                        />
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Percentage of quotations that turn into accepted orders.</p>
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="monthly_stock_cost_budget" value="Monthly Stock Budget (₹)" />
                                        <TextInput
                                            id="monthly_stock_cost_budget"
                                            type="number"
                                            value={goalsForm.data.monthly_stock_cost_budget}
                                            onChange={(e) => goalsForm.setData('monthly_stock_cost_budget', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="e.g. 200000"
                                        />
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Maximum spending limit for restocking/purchase orders per month.</p>
                                    </div>
                                    <div className="flex items-center gap-4 pt-4">
                                        <PrimaryButton disabled={goalsForm.processing}>Save Goals</PrimaryButton>
                                        {goalsForm.recentlySuccessful && <span className="text-sm text-green-600 dark:text-green-400">Goals saved.</span>}
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* DANGER ZONE TAB */}
                        {activeTab === 'danger' && (
                            <div>
                                <h3 className="text-xl font-bold text-red-600 dark:text-red-400 border-b border-red-100 dark:border-red-800 pb-4 mb-6">Danger Zone</h3>
                                <div className="p-6 bg-red-50 dark:bg-red-900 rounded-2xl border border-red-200 dark:border-red-700">
                                    <h4 className="text-lg font-semibold text-red-900 mb-2">Start Fresh (Delete All Data)</h4>
                                    <p className="text-sm text-red-800 dark:text-red-300 mb-4 max-w-2xl leading-relaxed">
                                        This sequence will <strong>permanently delete</strong> all quotes, revenues, stock adjustments, and purchase orders. It will also reset all stock quantities to zero.
                                        <br /><br />
                                        Your user accounts, products, and categorization structures will be preserved. This action is irreversible.
                                    </p>
                                    <DangerButton onClick={() => setShowResetModal(true)} className="shadow-sm">
                                        <AlertTriangle className="w-4 h-4 mr-2" />
                                        Start Fresh
                                    </DangerButton>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tax Rate Modal */}
            <Modal show={showRateModal} onClose={() => setShowRateModal(false)}>
                <form onSubmit={submitRate} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        {editingRate ? 'Edit Tax Rate' : 'Create New Tax Rate'}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="rate_name" value="Display Name" />
                            <TextInput
                                id="rate_name"
                                value={rateForm.data.name}
                                onChange={(e) => rateForm.setData('name', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="e.g. GST 18%"
                            />
                            <InputError message={rateForm.errors.name} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="rate_value" value="Rate Percentage" />
                            <div className="relative">
                                <TextInput
                                    id="rate_value"
                                    type="number"
                                    step="0.01"
                                    value={rateForm.data.rate}
                                    onChange={(e) => rateForm.setData('rate', e.target.value)}
                                    className="mt-1 block w-full pr-8"
                                />
                                <span className="absolute right-3 top-2.5 text-gray-500 dark:text-slate-400 font-bold text-sm">%</span>
                            </div>
                            <InputError message={rateForm.errors.rate} className="mt-2" />
                        </div>
                        <div className="flex items-center">
                            <input
                                id="is_active"
                                type="checkbox"
                                checked={rateForm.data.is_active}
                                onChange={(e) => rateForm.setData('is_active', e.target.checked)}
                                className="rounded border-gray-300 dark:border-slate-600 text-brand-600 dark:text-brand-400 shadow-sm focus:ring-brand-500"
                            />
                            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900 dark:text-white">
                                Active
                            </label>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setShowRateModal(false)}>Cancel</SecondaryButton>
                        <PrimaryButton disabled={rateForm.processing}>
                            {editingRate ? 'Update Rate' : 'Create Rate'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Start Fresh Modal */}
            <Modal show={showResetModal} onClose={() => setShowResetModal(false)} maxWidth="md">
                <form onSubmit={submitReset} className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-red-900">Confirm Data Wipe</h2>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-slate-400 mb-6 leading-relaxed">
                        Are you absolutely sure? This will permanently wipe all financial transactions, historical stock logs, and quotes. Product inventory numbers will be reset to 0.
                        <br /><br />
                        To confirm, type <strong>DELETE</strong> below:
                    </p>

                    <div className="mb-6">
                        <TextInput
                            id="confirmation"
                            value={resetForm.data.confirmation}
                            onChange={(e) => resetForm.setData('confirmation', e.target.value)}
                            className="mt-1 block w-full border-red-300 focus:border-red-500 focus:ring-red-500 text-red-900 font-mono"
                            placeholder="Type DELETE"
                            required
                        />
                        <InputError message={resetForm.errors.confirmation} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <SecondaryButton onClick={() => {
                            setShowResetModal(false);
                            resetForm.reset();
                            resetForm.clearErrors();
                        }}>Cancel</SecondaryButton>
                        <DangerButton type="submit" disabled={resetForm.processing || resetForm.data.confirmation !== 'DELETE'}>
                            {resetForm.processing ? 'Deleting...' : 'Permanently Wipe Data'}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout >
    );
}
