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
        Schema::table('purchase_orders', function (Blueprint $table) {
            $table->decimal('unit_cost', 15, 2)->nullable()->after('quantity');
        });

        Schema::table('stock_adjustments', function (Blueprint $table) {
            $table->decimal('unit_cost', 15, 2)->nullable()->after('quantity_change');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('purchase_orders', function (Blueprint $table) {
            $table->dropColumn('unit_cost');
        });

        Schema::table('stock_adjustments', function (Blueprint $table) {
            $table->dropColumn('unit_cost');
        });
    }
};
