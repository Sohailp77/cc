<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Quote;
use App\Models\QuoteItem;
use App\Models\Revenue;
use App\Models\StockAdjustment;
use App\Models\User;
use App\Models\CompanySetting;
use App\Models\TaxRate;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuoteTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed necessary settings to prevent errors during quote creation/status updates
        CompanySetting::updateOrCreate(['group' => 'company', 'key' => 'company_name'], ['value' => 'Test Company']);
        CompanySetting::updateOrCreate(['group' => 'company', 'key' => 'currency_symbol'], ['value' => '₹']);
        CompanySetting::updateOrCreate(['group' => 'tax', 'key' => 'strategy'], ['value' => 'split']);
        CompanySetting::updateOrCreate(['group' => 'tax', 'key' => 'default_igst_rate'], ['value' => '18']);
    }

    public function test_accepting_quote_deducts_stock_and_creates_revenue()
    {
        $boss = User::factory()->create(['role' => 'boss']);
        $product = Product::factory()->create(['stock_quantity' => 10, 'price' => 100]);

        $quote = Quote::factory()->create([
            'user_id' => $boss->id,
            'status' => 'draft',
            'tax_mode' => 'global',
            'tax_config_snapshot' => ['strategy' => 'split'],
            'total_amount' => 100,
        ]);

        QuoteItem::factory()->create([
            'quote_id' => $quote->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'price' => 100,
        ]);

        $response = $this->actingAs($boss)->patch(route('quotes.updateStatus', $quote->id), [
            'status' => 'accepted',
        ]);

        $response->assertSessionHas('success');
        $this->assertEquals('accepted', $quote->fresh()->status);

        // Assert stock deducted
        $this->assertEquals(8, $product->fresh()->stock_quantity);
        $this->assertDatabaseHas('stock_adjustments', [
            'product_id' => $product->id,
            'quantity_change' => -2,
            'type' => 'quote',
            'quote_id' => $quote->id,
            'reverted_at' => null,
        ]);

        // Assert revenue created
        $this->assertDatabaseHas('revenues', [
            'quote_id' => $quote->id,
            'amount' => 100,
            'reverted_at' => null,
        ]);
    }

    public function test_rejecting_accepted_quote_reverts_stock_and_revenue()
    {
        $boss = User::factory()->create(['role' => 'boss']);
        $product = Product::factory()->create(['stock_quantity' => 8, 'price' => 100]);

        $quote = Quote::factory()->create([
            'user_id' => $boss->id,
            'status' => 'accepted',
            'tax_mode' => 'global',
            'tax_config_snapshot' => ['strategy' => 'split'],
            'total_amount' => 100,
        ]);

        QuoteItem::factory()->create([
            'quote_id' => $quote->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'price' => 100,
        ]);

        // Setup the initial stock deduction and revenue
        $adj = StockAdjustment::create([
            'product_id' => $product->id,
            'user_id' => $boss->id,
            'quantity_change' => -2,
            'stock_after' => 8,
            'type' => 'quote',
            'reason' => "Quote {$quote->reference_id} accepted",
            'quote_id' => $quote->id,
        ]);

        $rev = Revenue::create([
            'quote_id' => $quote->id,
            'amount' => $quote->total_amount,
            'currency' => 'INR',
            'recorded_at' => now(),
        ]);

        $response = $this->actingAs($boss)->patch(route('quotes.updateStatus', $quote->id), [
            'status' => 'rejected',
        ]);

        $response->assertSessionHas('success');
        $this->assertEquals('rejected', $quote->fresh()->status);

        // Assert original adjustment is marked reverted
        $this->assertNotNull($adj->fresh()->reverted_at);

        // Assert counter adjustment created and stock restored
        $this->assertEquals(10, $product->fresh()->stock_quantity);
        $this->assertDatabaseHas('stock_adjustments', [
            'product_id' => $product->id,
            'quantity_change' => 2,
            'type' => 'reversion',
            'quote_id' => $quote->id,
        ]);

        // Assert revenue marked reverted
        $this->assertNotNull($rev->fresh()->reverted_at);
    }
}
