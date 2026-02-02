<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanySetting extends Model
{
    protected $fillable = ['key', 'value', 'group'];

    protected $casts = [
        'value' => 'array',
    ];

    public static function getTaxConfiguration()
    {
        $setting = self::where('group', 'tax')->where('key', 'configuration')->first();
        return $setting ? $setting->value : [
            'strategy' => 'single',
            'primary_label' => 'Tax',
            'secondary_labels' => [],
        ];
    }
}
