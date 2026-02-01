<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Product;

class DebugProductDataTest extends TestCase
{
    public function test_dump_product_data()
    {
        $products = Product::with('category')->get();
        dump($products->toArray());
        
        foreach ($products as $product) {
            echo "\nProduct: " . $product->name;
            echo "\nCategory: " . ($product->category ? $product->category->name : 'NULL');
            echo "\nMetric Type: " . ($product->category ? $product->category->metric_type : 'N/A');
            echo "\nUnit Size: " . $product->unit_size;
            echo "\n-------------------";
        }
        
        $this->assertTrue(true);
    }
}
