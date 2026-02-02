<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Quote;
use App\Models\TaxRate;
use App\Models\CompanySetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class QuoteTaxTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Disable logging to avoid permission issues
        config(['logging.default' => 'emergency']);

        // Seed Tax Rates
        TaxRate::create(['name' => 'GST 18%', 'rate' => 18.00, 'type' => 'percentage', 'is_active' => true]);
        TaxRate::create(['name' => 'GST 12%', 'rate' => 12.00, 'type' => 'percentage', 'is_active' => true]);

        // Seed Company Settings
        CompanySetting::create([
            'group' => 'tax',
            'key' => 'configuration',
            'value' => [
                'strategy' => 'split',
                'primary_label' => 'GST',
                'secondary_labels' => ['CGST', 'SGST']
            ]
        ]);

        // Create User
        $this->user = User::factory()->create();
    }

    public function test_global_tax_calculation()
    {
        // Create Category first
        $category = \App\Models\Category::create(['name' => 'Tiles', 'metric_type' => 'area', 'unit_name' => 'box']);

        $product = Product::create([
            'name' => 'Test Tile',
            'price' => 100,
            'category_id' => $category->id,
            'tax_rate_id' => null
        ]);

        $response = $this->actingAs($this->user)->post(route('quotes.store'), [
            'customer_name' => 'John Doe',
            'tax_mode' => 'global',
            'gst_rate' => 18,
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 2,
                    'price' => 100, // Total 200
                ]
            ],
            'discount_percentage' => 10 // 20 Discount
        ]);

        $response->assertRedirect();

        $quote = Quote::first();
        $this->assertEquals(200, $quote->subtotal);
        $this->assertEquals(20, $quote->discount_amount);

        // Taxable = 180. Tax = 18% of 180 = 32.4
        $this->assertEquals(32.4, $quote->tax_amount);
        $this->assertEquals(212.4, $quote->total_amount);
        $this->assertEquals('global', $quote->tax_mode);
    }

    public function test_item_level_tax_calculation()
    {
        $category = \App\Models\Category::create(['name' => 'Tiles', 'metric_type' => 'area', 'unit_name' => 'box']);
        $product1 = Product::create(['name' => 'P1', 'price' => 100, 'category_id' => $category->id]);
        $product2 = Product::create(['name' => 'P2', 'price' => 200, 'category_id' => $category->id]);

        $response = $this->actingAs($this->user)->post(route('quotes.store'), [
            'customer_name' => 'Jane Doe',
            'tax_mode' => 'item_level',
            'items' => [
                [
                    'product_id' => $product1->id,
                    'quantity' => 1,
                    'price' => 100,
                    'tax_rate' => 18 // 18 Tax
                ],
                [
                    'product_id' => $product2->id,
                    'quantity' => 1,
                    'price' => 200,
                    'tax_rate' => 12 // 24 Tax
                ]
            ],
            'discount_percentage' => 0
        ]);

        $response->assertRedirect();

        $quote = Quote::first();
        $this->assertEquals(300, $quote->subtotal);

        // Items Tax: 18 + 24 = 42
        $this->assertEquals(42, $quote->tax_amount);
        $this->assertEquals(342, $quote->total_amount);
        $this->assertEquals('item_level', $quote->tax_mode);

        // Check Items
        $this->assertEquals(18, $quote->items[0]->tax_amount);
        $this->assertEquals(24, $quote->items[1]->tax_amount);
    }
}
