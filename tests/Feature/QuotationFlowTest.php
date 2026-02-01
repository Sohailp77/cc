<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Quote;
use App\Models\QuoteItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuotationFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_empty_cart()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('quotes.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Quotes/Cart')
            ->has('quote.items', 0)
        );
    }

    public function test_user_can_add_product_to_quote()
    {
        $user = User::factory()->create();
        $category = Category::create(['name' => 'Cat', 'unit_name' => 'Unit', 'metric_type' => 'fixed']);
        $product = Product::create(['category_id' => $category->id, 'name' => 'Prod', 'price' => 100]);

        $response = $this->actingAs($user)->post(route('quotes.add'), [
            'product_id' => $product->id,
            'quantity' => 2
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('quote_items', [
            'product_id' => $product->id,
            'quantity' => 2,
            'price' => 100
        ]);
    }

    public function test_user_can_add_variant_to_quote()
    {
        $user = User::factory()->create();
        $category = Category::create(['name' => 'Cat', 'unit_name' => 'Unit', 'metric_type' => 'fixed']);
        $product = Product::create(['category_id' => $category->id, 'name' => 'Prod', 'price' => 100]);
        $variant = ProductVariant::create(['product_id' => $product->id, 'name' => 'Var', 'stock_quantity' => 10, 'variant_price' => 150]);

        $response = $this->actingAs($user)->post(route('quotes.add'), [
            'product_id' => $product->id,
            'product_variant_id' => $variant->id,
            'quantity' => 1
        ]);

        $this->assertDatabaseHas('quote_items', [
            'product_id' => $product->id,
            'product_variant_id' => $variant->id,
            'price' => 150
        ]);
    }

    public function test_user_can_update_quote_item_quantity()
    {
        $user = User::factory()->create();
        $quote = Quote::create(['user_id' => $user->id]);
        $category = Category::create(['name' => 'Cat', 'unit_name' => 'Unit', 'metric_type' => 'fixed']);
        $product = Product::create(['category_id' => $category->id, 'name' => 'Prod', 'price' => 100]);
        $item = QuoteItem::create([
            'quote_id' => $quote->id,
            'product_id' => $product->id,
            'quantity' => 1,
            'price' => 100
        ]);

        $response = $this->actingAs($user)->patch(route('quotes.update_item', $item->id), [
            'quantity' => 5
        ]);

        $this->assertDatabaseHas('quote_items', [
            'id' => $item->id,
            'quantity' => 5
        ]);
    }

    public function test_user_can_remove_quote_item()
    {
        $user = User::factory()->create();
        $quote = Quote::create(['user_id' => $user->id]);
        $category = Category::create(['name' => 'Cat', 'unit_name' => 'Unit', 'metric_type' => 'fixed']);
        $product = Product::create(['category_id' => $category->id, 'name' => 'Prod', 'price' => 100]);
        $item = QuoteItem::create([
            'quote_id' => $quote->id,
            'product_id' => $product->id,
            'quantity' => 1,
            'price' => 100
        ]);

        $response = $this->actingAs($user)->delete(route('quotes.remove_item', $item->id));

        $this->assertDatabaseMissing('quote_items', ['id' => $item->id]);
    }

    public function test_user_can_export_quote_excel()
    {
        $user = User::factory()->create();
        $quote = Quote::create(['user_id' => $user->id, 'reference_id' => 'Q-TEST']);
        $category = Category::create(['name' => 'Cat', 'unit_name' => 'Unit', 'metric_type' => 'fixed']);
        $product = Product::create(['category_id' => $category->id, 'name' => 'Prod', 'price' => 100]);
        QuoteItem::create([
            'quote_id' => $quote->id,
            'product_id' => $product->id,
            'quantity' => 1,
            'price' => 100
        ]);

        // Attempt export
        try {
            $response = $this->actingAs($user)->get(route('quotes.export', $quote->id));
            
            // Check status. If 500, it might be the extension issue.
            // Excel download sets specific headers.
            $response->assertStatus(200);
            $response->assertHeader('content-disposition', 'attachment; filename=quote_Q-TEST.xlsx');
        } catch (\Throwable $e) {
            // Fail manually if exception occurs
            $this->fail('Export failed: ' . $e->getMessage());
        }
    }
}
