<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PurchaseOrder>
 */
class PurchaseOrderFactory extends Factory
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
            'quantity' => $this->faker->numberBetween(10, 500),
            'unit_cost' => $this->faker->randomFloat(2, 5, 50),
            'status' => 'pending',
            'estimated_arrival' => now()->addDays(5)->toDateString(),
        ];
    }
}
