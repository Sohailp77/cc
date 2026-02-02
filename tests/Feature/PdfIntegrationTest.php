<?php

namespace Tests\Feature;

use App\Models\CompanySetting;
use App\Models\Product;
use App\Models\Quote;
use App\Models\User;
use App\Models\TaxRate;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PdfIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        config(['logging.default' => 'emergency']);
        config(['view.compiled' => sys_get_temp_dir()]);
        $this->user = User::factory()->create();
    }

    public function test_pdf_view_renders_with_company_settings()
    {
        // 1. Seed Company Settings
        CompanySetting::create(['group' => 'company', 'key' => 'company_name', 'value' => 'Dynamic Tech Ltd']);
        CompanySetting::create(['group' => 'company', 'key' => 'gstin', 'value' => 'DYN12345']);

        // 2. Create Quote
        $quote = Quote::create([
            'user_id' => $this->user->id,
            'customer_name' => 'Client X',
            'tax_mode' => 'global',
            'tax_config_snapshot' => ['strategy' => 'single', 'primary_label' => 'VAT'],
            'reference_id' => 'REF-001',
            'status' => 'draft',
            'subtotal' => 100,
            'total_amount' => 110,
            'tax_amount' => 10,
            'gst_rate' => 10
        ]);

        // 3. Render View
        $companyProfile = CompanySetting::where('group', 'company')->pluck('value', 'key')->all();

        $view = view('pdf.quote', [
            'quote' => $quote,
            'companyProfile' => $companyProfile
        ]);
        $rendered = $view->render();

        // 4. Assert Content
        $this->assertStringContainsString('Dynamic Tech Ltd', $rendered);
        $this->assertStringContainsString('DYN12345', $rendered);
        $this->assertStringContainsString('VAT', $rendered); // Tax Label
    }
}
