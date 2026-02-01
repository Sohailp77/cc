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
            'products' => Product::with(['category', 'variants'])->get(), // Load all for client-side search (optimize later if slow)
        ]);
    }

    // Store the complete quote
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'nullable|email',
            'customer_phone' => 'nullable|string',
            'gst_type' => 'required|in:igst,cgst_sgst',
            'gst_rate' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.product_variant_id' => 'nullable|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0', // Staff can override price
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
        ]);

        $quote = Quote::create([
            'user_id' => $request->user()->id,
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'customer_phone' => $validated['customer_phone'] ?? null,
            'gst_type' => $validated['gst_type'],
            'gst_rate' => $validated['gst_rate'],
            'notes' => $validated['notes'] ?? null,
            'discount_percentage' => $validated['discount_percentage'] ?? 0,
            'reference_id' => 'Q-' . strtoupper(Str::random(8)),
            'status' => 'draft',
            'valid_until' => now()->addDays(30),
        ]);

        $subtotal = 0;

        foreach ($validated['items'] as $item) {
            $lineTotal = $item['price'] * $item['quantity'];
            $subtotal += $lineTotal;

            QuoteItem::create([
                'quote_id' => $quote->id,
                'product_id' => $item['product_id'],
                'product_variant_id' => $item['product_variant_id'] ?? null,
                'quantity' => $item['quantity'],
                'price' => $item['price']
            ]);
        }

        // Calculate Totals with Discount
        $discountAmount = ($subtotal * $quote->discount_percentage) / 100;
        $taxableAmount = $subtotal - $discountAmount;
        $taxAmount = ($taxableAmount * $quote->gst_rate) / 100;
        
        $quote->subtotal = $subtotal;
        $quote->discount_amount = $discountAmount;
        $quote->tax_amount = $taxAmount;
        $quote->total_amount = $taxableAmount + $taxAmount;
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

        $pdf = Pdf::loadView('pdf.quote', [
            'quote' => $quote
        ]);

        return $pdf->stream('quote_' . $quote->reference_id . '.pdf');
    }
}
