<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductVariant>
 */
class ProductVariantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => \App\Models\Product::factory(),
            'name' => 'Variant ' . $this->faker->word(),
            'sku' => $this->faker->unique()->ean8(),
            'stock_quantity' => $this->faker->numberBetween(0, 100),
            'variant_price' => $this->faker->randomFloat(2, 10, 100),
        ];
    }
}
