<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\TaxRate;
use App\Models\CompanySetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SettingsTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        // Disable logging to avoid permission issues
        config(['logging.default' => 'emergency']);

        $this->user = User::factory()->create();
    }

    public function test_settings_page_rendering()
    {
        $response = $this->actingAs($this->user)->get(route('settings.index'));

        $response->assertStatus(200);
        $response->assertInertia(
            fn($page) => $page
                ->component('Settings/Index')
                ->has('taxRates')
                ->has('taxConfiguration')
                ->has('companyProfile')
        );
    }

    public function test_update_company_profile()
    {
        $data = [
            'company_name' => 'Tech Corp',
            'company_email' => 'tech@example.com',
            'company_phone' => '1234567890',
            'company_address' => 'Silicon Valley',
            'gstin' => 'TAX123',
        ];

        $response = $this->actingAs($this->user)->put(route('settings.company-profile.update'), $data);

        $response->assertSessionHasNoErrors();
        $response->assertSessionHasNoErrors();

        $settingName = CompanySetting::where('group', 'company')->where('key', 'company_name')->first();
        $this->assertEquals('Tech Corp', $settingName->value);

        $settingGstin = CompanySetting::where('group', 'company')->where('key', 'gstin')->first();
        $this->assertEquals('TAX123', $settingGstin->value);
    }

    public function test_update_tax_configuration()
    {
        $data = [
            'strategy' => 'split',
            'primary_label' => 'GST',
            'secondary_labels' => ['CGST', 'SGST'],
        ];

        $response = $this->actingAs($this->user)->put(route('settings.tax-configuration.update'), $data);

        $response->assertSessionHasNoErrors();

        // Database stores value as JSON string for array/objects? 
        // Our update logic in Controller creates ONE record for 'configuration' with JSON value cast in model?
        // Let's check CompanySetting model. But controller uses ['value' => $validated].
        // If CompanySetting::$casts has 'value' => 'array', it stores as text/json.

        $setting = CompanySetting::where('group', 'tax')->where('key', 'configuration')->first();
        $this->assertNotNull($setting);
        $this->assertEquals('split', $setting->value['strategy']);

        // Verify Model Helper
        $config = CompanySetting::getTaxConfiguration();
        $this->assertEquals('split', $config['strategy']);
    }

    public function test_create_and_delete_tax_rate()
    {
        $data = [
            'name' => 'Luxury Tax',
            'rate' => 28,
            'type' => 'percentage',
            'is_active' => true
        ];

        // Create
        $response = $this->actingAs($this->user)->post(route('settings.tax-rates.store'), $data);
        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('tax_rates', ['name' => 'Luxury Tax']);

        $rate = TaxRate::where('name', 'Luxury Tax')->first();

        // Delete
        $response = $this->actingAs($this->user)->delete(route('settings.tax-rates.destroy', $rate->id));
        $response->assertSessionHasNoErrors();
        $this->assertDatabaseMissing('tax_rates', ['id' => $rate->id]);
    }
}
