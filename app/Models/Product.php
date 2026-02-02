<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = ['category_id', 'name', 'description', 'price', 'sku', 'image_path', 'unit_size', 'specifications', 'tax_rate_id'];

    protected $casts = [
        'specifications' => 'array',
        'unit_size' => 'decimal:2',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function taxRate()
    {
        return $this->belongsTo(TaxRate::class);
    }

    public function quotationItems()
    {
        return $this->hasMany(QuotationItem::class);
    }

    //also return category name
    public function getCategoryNameAttribute()
    {
        return $this->category->name;
    }
    //also productvariant details
    public function getProductVariantDetailsAttribute()
    {
        return $this->variants;
    }
    //also tax rate details
    public function getTaxRateDetailsAttribute()
    {
        return $this->taxRate;
    }

    //example to use in frontend
    // {{ product.category_name }}
    // {{ product.name }}
    // {{ product.description }}
    // {{ product.price }}
    // {{ product.sku }}
    // {{ product.image_path }}
    // {{ product.unit_size }}
    // {{ product.specifications }}

}
