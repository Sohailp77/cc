<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('quotes', function (Blueprint $table) {
            $table->string('tax_mode')->default('item_level'); // 'global' or 'item_level'
            $table->json('tax_config_snapshot')->nullable(); // Stores logic used at creation time
        });

        Schema::table('quote_items', function (Blueprint $table) {
            $table->decimal('tax_rate', 5, 2)->default(0);
            $table->decimal('tax_amount', 15, 2)->default(0);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('tax_rate_id')->nullable()->constrained('tax_rates')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quotes', function (Blueprint $table) {
            $table->dropColumn(['tax_mode', 'tax_config_snapshot']);
        });

        Schema::table('quote_items', function (Blueprint $table) {
            $table->dropColumn(['tax_rate', 'tax_amount']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['tax_rate_id']);
            $table->dropColumn('tax_rate_id');
        });
    }
};
