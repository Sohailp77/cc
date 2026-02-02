import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import { Building2, Percent, Settings as SettingsIcon, Plus, Trash2, Edit2 } from 'lucide-react';

export default function Settings({ auth, taxRates, taxConfiguration, companyProfile }) {
    const [activeTab, setActiveTab] = useState('general');
    const [showRateModal, setShowRateModal] = useState(false);
    const [editingRate, setEditingRate] = useState(null);

    // Forms
    const companyForm = useForm({
        company_name: companyProfile?.company_name || '',
        company_address: companyProfile?.company_address || '',
        company_phone: companyProfile?.company_phone || '',
        company_email: companyProfile?.company_email || '',
        gstin: companyProfile?.gstin || '',
    });

    const configForm = useForm({
        strategy: taxConfiguration?.strategy || 'single',
        primary_label: taxConfiguration?.primary_label || 'Tax',
        secondary_labels: taxConfiguration?.secondary_labels || ['CGST', 'SGST'],
    });

    const rateForm = useForm({
        name: '',
        rate: '',
        type: 'percentage',
        is_active: true,
    });

    // Handlers
    const submitCompany = (e) => {
        e.preventDefault();
        companyForm.put(route('settings.company-profile.update'));
    };

    const submitConfig = (e) => {
        e.preventDefault();
        configForm.put(route('settings.tax-configuration.update'));
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Settings</h2>}
        >
            <Head title="Settings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Sidebar Navigation */}
                        <div className="w-full md:w-64 flex-shrink-0">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-4 space-y-2">
                                    <button
                                        onClick={() => setActiveTab('general')}
                                        className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'general' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Building2 className="w-5 h-5 mr-3" />
                                        General Profile
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('tax_config')}
                                        className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'tax_config' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <SettingsIcon className="w-5 h-5 mr-3" />
                                        Tax Configuration
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('tax_rates')}
                                        className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'tax_rates' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Percent className="w-5 h-5 mr-3" />
                                        Tax Rates
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 min-h-[500px]">

                                {/* GENERAL TAB */}
                                {activeTab === 'general' && (
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 border-b pb-4 mb-6">Company Profile</h3>
                                        <form onSubmit={submitCompany} className="space-y-6 max-w-xl">
                                            <div>
                                                <InputLabel htmlFor="company_name" value="Company Name" />
                                                <TextInput
                                                    id="company_name"
                                                    value={companyForm.data.company_name}
                                                    onChange={(e) => companyForm.setData('company_name', e.target.value)}
                                                    className="mt-1 block w-full"
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
                                            <div>
                                                <InputLabel htmlFor="address" value="Address" />
                                                <textarea
                                                    id="address"
                                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                    rows="3"
                                                    value={companyForm.data.company_address}
                                                    onChange={(e) => companyForm.setData('company_address', e.target.value)}
                                                ></textarea>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <PrimaryButton disabled={companyForm.processing}>Save Profile</PrimaryButton>
                                                {companyForm.recentlySuccessful && <span className="text-sm text-green-600">Saved.</span>}
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* TAX CONFIG TAB */}
                                {activeTab === 'tax_config' && (
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 border-b pb-4 mb-6">Tax Configuration</h3>
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
                                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                                        />
                                                        <label htmlFor="strategy_single" className="ml-3 block text-sm font-medium text-gray-700">
                                                            Single Rate (Standard)
                                                            <p className="text-gray-500 text-xs font-normal">Apply a single tax percentage (e.g. VAT 10%)</p>
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
                                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                                        />
                                                        <label htmlFor="strategy_split" className="ml-3 block text-sm font-medium text-gray-700">
                                                            Split Tax (Dual GST/HST)
                                                            <p className="text-gray-500 text-xs font-normal">Split tax into components (e.g. CGST + SGST)</p>
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
                                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Split Components Labels</h4>
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
                                                    <p className="text-xs text-gray-500 mt-2">Currently supports 2-way split (50/50) only.</p>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-4 pt-4">
                                                <PrimaryButton disabled={configForm.processing}>Update Configuration</PrimaryButton>
                                                {configForm.recentlySuccessful && <span className="text-sm text-green-600">Updated.</span>}
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* TAX RATES TAB */}
                                {activeTab === 'tax_rates' && (
                                    <div>
                                        <div className="flex justify-between items-center border-b pb-4 mb-6">
                                            <h3 className="text-lg font-medium text-gray-900">Tax Rates Table</h3>
                                            <PrimaryButton onClick={() => openRateModal()}>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add New Rate
                                            </PrimaryButton>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate (%)</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {taxRates.map((rate) => (
                                                        <tr key={rate.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rate.name}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rate.rate}%</td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${rate.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                    {rate.is_active ? 'Active' : 'Inactive'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <button onClick={() => openRateModal(rate)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button onClick={() => deleteRate(rate)} className="text-red-600 hover:text-red-900">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {taxRates.length === 0 && (
                                                        <tr>
                                                            <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No tax rates found. Create one to get started.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tax Rate Modal */}
            <Modal show={showRateModal} onClose={() => setShowRateModal(false)}>
                <form onSubmit={submitRate} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
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
                                <span className="absolute right-3 top-2.5 text-gray-500 font-bold text-sm">%</span>
                            </div>
                            <InputError message={rateForm.errors.rate} className="mt-2" />
                        </div>
                        <div className="flex items-center">
                            <input
                                id="is_active"
                                type="checkbox"
                                checked={rateForm.data.is_active}
                                onChange={(e) => rateForm.setData('is_active', e.target.checked)}
                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                            />
                            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
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
        </AuthenticatedLayout>
    );
}
