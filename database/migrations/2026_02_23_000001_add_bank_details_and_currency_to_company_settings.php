<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $fields = [
            'currency_symbol' => '₹',
            'bank_name' => null,
            'bank_account_name' => null,
            'bank_account_number' => null,
            'bank_ifsc' => null,
            'bank_branch' => null,
        ];

        foreach ($fields as $key => $default) {
            // Only insert if not already present
            if (!DB::table('company_settings')->where('group', 'company')->where('key', $key)->exists()) {
                DB::table('company_settings')->insert([
                    'key' => $key,
                    'value' => $default !== null ? json_encode($default) : null,
                    'group' => 'company',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('company_settings')
            ->where('group', 'company')
            ->whereIn('key', ['currency_symbol', 'bank_name', 'bank_account_name', 'bank_account_number', 'bank_ifsc', 'bank_branch'])
            ->delete();
    }
};
