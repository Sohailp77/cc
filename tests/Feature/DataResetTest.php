<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Quote;
use App\Models\QuoteItem;
use App\Models\Revenue;
use App\Models\StockAdjustment;
use App\Models\PurchaseOrder;
use App\Models\User;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DataResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_boss_can_reset_data()
    {
        $boss = User::factory()->create(['role' => 'boss']);

        // Create baseline data that MUST be kept
        $category = Category::factory()->create(['name' => 'Test Category']);
        $product = Product::factory()->create(['name' => 'Keep Me', 'stock_quantity' => 10, 'category_id' => $category->id]);
        $variant = ProductVariant::factory()->create(['product_id' => $product->id, 'name' => 'Keep Variant', 'stock_quantity' => 5]);

        // Create data that MUST be deleted
        $quote = Quote::factory()->create(['user_id' => $boss->id]);
        QuoteItem::factory()->create(['quote_id' => $quote->id, 'product_id' => $product->id]);
        Revenue::factory()->create(['quote_id' => $quote->id, 'amount' => 100]);
        StockAdjustment::create(['product_id' => $product->id, 'user_id' => $boss->id, 'quantity_change' => 10, 'stock_after' => 10, 'type' => 'manual', 'reason' => 'test']);
        PurchaseOrder::factory()->create(['product_id' => $product->id]);

        $response = $this->actingAs($boss)
            ->post(route('settings.start-fresh'), [
                'confirmation' => 'DELETE',
            ]);

        $response->assertRedirect(route('dashboard'));
        $response->assertSessionHas('success');

        // Check deleted tables
        $this->assertEquals(0, Quote::count());
        $this->assertEquals(0, QuoteItem::count());
        $this->assertEquals(0, Revenue::count());
        $this->assertEquals(0, StockAdjustment::count());
        $this->assertEquals(0, PurchaseOrder::count());

        // Check preserved tables
        $this->assertEquals(1, User::where('id', $boss->id)->count());
        $this->assertEquals(1, Category::count());
        $this->assertEquals(1, Product::count());
        $this->assertEquals(1, ProductVariant::count());

        // Check stock quantities are 0
        $this->assertEquals(0, $product->fresh()->stock_quantity);
        $this->assertEquals(0, $variant->fresh()->stock_quantity);
    }

    public function test_employee_cannot_reset_data()
    {
        $employee = User::factory()->create(['role' => 'employee']);

        $response = $this->actingAs($employee)
            ->post(route('settings.start-fresh'), [
                'confirmation' => 'DELETE',
            ]);

        $response->assertForbidden();
    }

    public function test_reset_requires_exact_confirmation_string()
    {
        $boss = User::factory()->create(['role' => 'boss']);

        $response = $this->actingAs($boss)
            ->post(route('settings.start-fresh'), [
                'confirmation' => 'delete', // lowercase
            ]);

        $response->assertSessionHasErrors('confirmation');
    }
}
