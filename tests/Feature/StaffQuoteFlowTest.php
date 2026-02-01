<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Quote;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StaffQuoteFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_can_view_create_quote_page()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('quotes.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Quotes/Create')
            ->has('products')
        );
    }

    public function test_staff_can_store_quote_and_get_pdf()
    {
        $user = User::factory()->create();
        $category = Category::create(['name' => 'Cat', 'unit_name' => 'Unit', 'metric_type' => 'fixed']);
        $product = Product::create(['category_id' => $category->id, 'name' => 'Prod', 'price' => 100]);

        $data = [
            'customer_name' => 'John Doe',
            'customer_email' => 'john@example.com',
            'customer_phone' => '1234567890',
            'gst_type' => 'igst',
            'gst_rate' => 18,
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 2,
                    'price' => 100 // Staff override or default
                ]
            ]
        ];

        $response = $this->actingAs($user)->post(route('quotes.store'), $data);

        // Should redirect back to create page (or previous)
        $response->assertRedirect();
        
        $quote = Quote::first();
        $this->assertNotNull($quote);
        $this->assertEquals('John Doe', $quote->customer_name);
        $this->assertEquals(236, $quote->total_amount); // 200 + 18% tax = 236

        // Assert session has pdf_url
        $response->assertSessionHas('pdf_url', route('quotes.pdf', $quote->id));

        // Test PDF generation
        $pdfResponse = $this->actingAs($user)->get(route('quotes.pdf', $quote->id));
        $pdfResponse->assertStatus(200);
        $pdfResponse->assertHeader('Content-Type', 'application/pdf');
    }
}
