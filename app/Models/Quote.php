<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'reference_id',
        'status',
        'subtotal',
        'gst_rate',
        'gst_type',
        'tax_amount',
        'total_amount',
        'valid_until',
        'notes',
        'discount_percentage',
        'discount_amount',
    ];

    protected $casts = [
        'valid_until' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(QuoteItem::class);
    }
}
