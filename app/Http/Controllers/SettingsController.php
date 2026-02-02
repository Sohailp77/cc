<?php

namespace App\Http\Controllers;

use App\Models\CompanySetting;
use App\Models\TaxRate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('Settings/Index', [
            'taxRates' => TaxRate::orderBy('is_active', 'desc')->get(),
            'taxConfiguration' => CompanySetting::getTaxConfiguration(),
            'companyProfile' => CompanySetting::where('group', 'company')->pluck('value', 'key')->all(),
        ]);
    }

    public function updateTaxConfiguration(Request $request)
    {
        $validated = $request->validate([
            'strategy' => 'required|in:single,split',
            'primary_label' => 'required|string|max:50',
            'secondary_labels' => 'nullable|array',
            'secondary_labels.*' => 'string|max:50',
        ]);

        CompanySetting::updateOrCreate(
            ['group' => 'tax', 'key' => 'configuration'],
            ['value' => $validated]
        );

        return back()->with('success', 'Tax configuration updated successfully.');
    }

    public function storeTaxRate(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'rate' => 'required|numeric|min:0',
            'type' => 'required|in:percentage,fixed',
            'is_active' => 'boolean',
        ]);

        TaxRate::create($validated);

        return back()->with('success', 'Tax rate created successfully.');
    }

    public function updateTaxRate(Request $request, TaxRate $taxRate)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'rate' => 'required|numeric|min:0',
            'type' => 'required|in:percentage,fixed',
            'is_active' => 'boolean',
        ]);

        $taxRate->update($validated);

        return back()->with('success', 'Tax rate updated successfully.');
    }

    public function destroyTaxRate(TaxRate $taxRate)
    {
        $taxRate->delete();
        return back()->with('success', 'Tax rate deleted successfully.');
    }

    // Placeholder for Company Profile Update - can be expanded
    public function updateCompanyProfile(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'company_address' => 'nullable|string',
            'company_phone' => 'nullable|string',
            'company_email' => 'nullable|email',
            'gstin' => 'nullable|string',
        ]);

        foreach ($validated as $key => $value) {
            CompanySetting::updateOrCreate(
                ['group' => 'company', 'key' => $key],
                ['value' => $value]
            );
        }

        return back()->with('success', 'Company profile updated.');
    }
}
