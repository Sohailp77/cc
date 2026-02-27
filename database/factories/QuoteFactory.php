<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Quote>
 */
class QuoteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'customer_name' => $this->faker->name(),
            'customer_email' => $this->faker->unique()->safeEmail(),
            'customer_phone' => $this->faker->phoneNumber(),
            'reference_id' => 'Q-' . strtoupper($this->faker->lexify('????????')),
            'status' => 'draft',
            'subtotal' => 0,
            'tax_mode' => 'global',
            'tax_config_snapshot' => ['strategy' => 'igst'],
            'tax_amount' => 0,
            'total_amount' => 0,
            'valid_until' => now()->addDays(30),
            'notes' => $this->faker->sentence(),
            'discount_percentage' => 0,
            'discount_amount' => 0,
            'gst_type' => 'igst',
            'gst_rate' => 18,
        ];
    }
}
