<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProductFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_category_with_image()
    {
        Storage::fake('public');

        $user = User::factory()->create();
        // Use a generic file to bypass GD requirement in CI/Test
        $file = UploadedFile::fake()->create('category.jpg', 100);

        $response = $this->actingAs($user)->post('/categories', [
            'name' => 'Tiles',
            'unit_name' => 'Box',
            'metric_type' => 'area',
            'image' => $file,
        ]);

        $response->assertRedirect('/categories');
        $this->assertDatabaseHas('categories', ['name' => 'Tiles']);
        Storage::disk('public')->assertExists('uploads/categories/' . $file->hashName());
    }

    public function test_user_can_create_product_under_category()
    {
        $user = User::factory()->create();
        $category = Category::create([
            'name' => 'Tiles',
            'unit_name' => 'Box',
            'metric_type' => 'area'
        ]);

        $response = $this->actingAs($user)->post('/products', [
            'category_id' => $category->id,
            'name' => '60x60 GVT',
            'price' => 200, // $20.00
            'unit_size' => 1.44,
        ]);

        $response->assertRedirect('/products');
        $this->assertDatabaseHas('products', [
            'name' => '60x60 GVT',
            'unit_size' => 1.44
        ]);
    }

    public function test_user_can_add_variant_with_price_override()
    {
        $user = User::factory()->create();
        $category = Category::create(['name' => 'Faucets', 'unit_name' => 'Pcs', 'metric_type' => 'fixed']);
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Basin Mixer',
            'price' => 100
        ]);

        $response = $this->actingAs($user)->post('/product-variants', [
            'product_id' => $product->id,
            'name' => 'Gold Finish',
            'stock_quantity' => 10,
            'variant_price' => 150, // Override
        ]);

        $response->assertRedirect(); // Back
        $this->assertDatabaseHas('product_variants', [
            'product_id' => $product->id,
            'name' => 'Gold Finish',
            'variant_price' => 150
        ]);
    }

    public function test_dashboard_stats_load()
    {
        $user = User::factory()->create();
        Category::create(['name' => 'Cat1', 'unit_name' => 'U', 'metric_type' => 'fixed']);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertOk();
        $response->assertInertia(
            fn($page) => $page
                ->component('Dashboard')
                ->has('stats')
        );
    }

    /**
     * VIGOROUS TESTS
     */

    public function test_category_validation_fails_on_invalid_data()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/categories', [
            'name' => '', // Required
            'unit_name' => '', // Required
            'metric_type' => 'invalid_type', // Must be area, weight, or fixed
        ]);

        $response->assertSessionHasErrors(['name', 'unit_name', 'metric_type']);
    }

    public function test_product_price_must_be_positive()
    {
        $user = User::factory()->create();
        $category = Category::create(['name' => 'Tiles', 'unit_name' => 'Box', 'metric_type' => 'area']);

        $response = $this->actingAs($user)->post('/products', [
            'category_id' => $category->id,
            'name' => 'Negative Price Item',
            'price' => -100, // Invalid
        ]);

        $response->assertSessionHasErrors(['price']);
    }

    public function test_variant_price_override_can_be_null()
    {
        $user = User::factory()->create();
        $category = Category::create(['name' => 'Parts', 'unit_name' => 'Pc', 'metric_type' => 'fixed']);
        $product = Product::create(['category_id' => $category->id, 'name' => 'Valve', 'price' => 50]);

        // Scenario: No override (standard price)
        $this->actingAs($user)->post('/product-variants', [
            'product_id' => $product->id,
            'name' => 'Standard Valve',
            'stock_quantity' => 20,
            'variant_price' => null,
        ]);

        $this->assertDatabaseHas('product_variants', [
            'name' => 'Standard Valve',
            'variant_price' => null
        ]);
    }

    public function test_deleting_product_deletes_variants()
    {
        $user = User::factory()->create();
        $category = Category::create(['name' => 'Temp', 'unit_name' => 'X', 'metric_type' => 'fixed']);
        $product = Product::create(['category_id' => $category->id, 'name' => 'To Delete', 'price' => 10]);

        ProductVariant::create([
            'product_id' => $product->id,
            'name' => 'Variant 1',
            'stock_quantity' => 5
        ]);

        $this->actingAs($user)->delete("/products/{$product->id}");

        $this->assertDatabaseMissing('products', ['id' => $product->id]);
        $this->assertDatabaseMissing('product_variants', ['name' => 'Variant 1']);
    }

    public function test_cannot_create_variant_for_non_existent_product()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/product-variants', [
            'product_id' => 99999, // Non-existent
            'name' => 'Ghost Variant',
            'stock_quantity' => 1
        ]);

        $response->assertSessionHasErrors(['product_id']);
    }

    public function test_user_can_update_variant()
    {
        $user = User::factory()->create();
        $category = Category::create(['name' => 'Temp', 'unit_name' => 'X', 'metric_type' => 'fixed']);
        $product = Product::create(['category_id' => $category->id, 'name' => 'Item', 'price' => 10]);
        $variant = ProductVariant::create([
            'product_id' => $product->id,
            'name' => 'Old Name',
            'stock_quantity' => 5,
            'variant_price' => 12
        ]);

        $response = $this->actingAs($user)->put("/product-variants/{$variant->id}", [
            'name' => 'New Name',
            'stock_quantity' => 10,
            'variant_price' => 15,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('product_variants', [
            'id' => $variant->id,
            'name' => 'New Name',
            'stock_quantity' => 10,
            'variant_price' => 15
        ]);
    }
}
