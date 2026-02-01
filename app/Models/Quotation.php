<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quotation extends Model
{
    protected $fillable = ['customer_name', 'customer_email', 'total_amount', 'status'];

    public function items()
    {
        return $this->hasMany(QuotationItem::class);
    }
}
