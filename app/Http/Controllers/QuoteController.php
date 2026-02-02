<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Quote;
use App\Models\QuoteItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;

class QuoteController extends Controller
{
    // The "Create Quote" Builder Page
    public function create()
    {
        return Inertia::render('Quotes/Create', [
            'products' => Product::with(['category', 'variants', 'taxRate'])->get(),
            'taxRates' => \App\Models\TaxRate::where('is_active', true)->get(),
            'taxSettings' => \App\Models\CompanySetting::getTaxConfiguration(),
        ]);
    }

    // Store the complete quote
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'nullable|email',
            'customer_phone' => 'nullable|string',
            'tax_mode' => 'required|in:global,item_level',
            'gst_rate' => 'nullable|numeric|min:0', // Used if Global mode
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.product_variant_id' => 'nullable|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.tax_rate' => 'nullable|numeric|min:0', // Used if Item Level
            'items.*.tax_rate_id' => 'nullable|exists:tax_rates,id',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
        ]);

        $taxSettings = \App\Models\CompanySetting::getTaxConfiguration();

        $quote = Quote::create([
            'user_id' => $request->user()->id,
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'] ?? null,
            'customer_phone' => $validated['customer_phone'] ?? null,
            'tax_mode' => $validated['tax_mode'],
            'tax_config_snapshot' => $taxSettings,
            'notes' => $validated['notes'] ?? null,
            'discount_percentage' => $validated['discount_percentage'] ?? 0,
            'reference_id' => 'Q-' . strtoupper(Str::random(8)),
            'status' => 'draft',
            'valid_until' => now()->addDays(30),
            // Legacy fields for backward compatibility or simple global mode display
            'gst_type' => ($taxSettings['strategy'] === 'split') ? 'cgst_sgst' : 'igst',
            'gst_rate' => ($validated['tax_mode'] === 'global') ? ($validated['gst_rate'] ?? 0) : 0,
        ]);

        $subtotal = 0;
        $totalTaxAmount = 0;

        foreach ($validated['items'] as $item) {
            $lineTotal = $item['price'] * $item['quantity'];
            $subtotal += $lineTotal;

            // Determine tax rate for this item
            $itemTaxRate = 0;
            if ($validated['tax_mode'] === 'global') {
                // In global mode, item tax is effectively 0 for row calculation, applied at end (or we can distribute it, but usually applied at end on subtotal)
                // However, user might want to see clean subtotal. 
                // Let's stick to: Global Tax applies to the (Subtotal - Discount).
                $itemTaxRate = 0;
            } else {
                // Item Level
                $itemTaxRate = $item['tax_rate'] ?? 0;
            }

            $itemTaxAmount = ($lineTotal * $itemTaxRate) / 100;
            if ($validated['tax_mode'] === 'item_level') {
                $totalTaxAmount += $itemTaxAmount;
            }

            QuoteItem::create([
                'quote_id' => $quote->id,
                'product_id' => $item['product_id'],
                'product_variant_id' => $item['product_variant_id'] ?? null,
                'quantity' => $item['quantity'],
                'price' => $item['price'],
                'tax_rate' => $itemTaxRate,
                'tax_amount' => $itemTaxAmount
            ]);
        }

        // Calculate Final Totals
        // Discount is usually on Subtotal before Tax
        $discountAmount = ($subtotal * $quote->discount_percentage) / 100;
        $taxableAmount = $subtotal - $discountAmount;

        if ($validated['tax_mode'] === 'global') {
            // Calculate Global Tax on Taxable Amount
            $globalRate = $validated['gst_rate'] ?? 0;
            $totalTaxAmount = ($taxableAmount * $globalRate) / 100;
        }

        $quote->subtotal = $subtotal;
        $quote->discount_amount = $discountAmount;
        $quote->tax_amount = $totalTaxAmount;
        $quote->total_amount = $taxableAmount + $totalTaxAmount;
        $quote->save();

        return redirect()->route('quotes.create')
            ->with('success', 'Quote created successfully.')
            ->with('pdf_url', route('quotes.pdf', $quote->id));
    }

    // Generate PDF
    public function pdf(Quote $quote)
    {
        // Security: Ensure user owns quote or has permission (skipping for this demo context, assuming staff)

        $quote->load(['items.product.category', 'items.variant']);

        $companyProfile = \App\Models\CompanySetting::where('group', 'company')->pluck('value', 'key')->all();

        $pdf = Pdf::loadView('pdf.quote', [
            'quote' => $quote,
            'companyProfile' => $companyProfile
        ]);

        return $pdf->stream('quote_' . $quote->reference_id . '.pdf');
    }
}
