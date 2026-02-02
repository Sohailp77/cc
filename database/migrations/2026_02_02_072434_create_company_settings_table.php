<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('company_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->json('value')->nullable();
            $table->string('group')->index()->default('general');
            $table->timestamps();
        });

        // Seed default tax settings
        DB::table('company_settings')->insert([
            [
                'key' => 'tax_configuration',
                'value' => json_encode([
                    'strategy' => 'split', // 'single' or 'split'
                    'primary_label' => 'GST',
                    'secondary_labels' => ['CGST', 'SGST'], // Used if strategy is split
                ]),
                'group' => 'tax',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_settings');
    }
};
