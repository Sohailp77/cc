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
        Schema::table('stock_adjustments', function (Blueprint $table) {
            $table->timestamp('reverted_at')->nullable()->after('reason');
        });

        Schema::table('revenues', function (Blueprint $table) {
            $table->timestamp('reverted_at')->nullable()->after('stock_adjustment_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stock_adjustments', function (Blueprint $table) {
            $table->dropColumn('reverted_at');
        });

        Schema::table('revenues', function (Blueprint $table) {
            $table->dropColumn('reverted_at');
        });
    }
};
