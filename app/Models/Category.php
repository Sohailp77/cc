<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name', 'unit_name', 'metric_type', 'description', 'image_path'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
