<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $fillable = ['product_id', 'name', 'sku', 'image_path', 'stock_quantity', 'variant_price'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
