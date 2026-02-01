<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$products = App\Models\Product::with('category')->get();

if ($products->isEmpty()) {
    echo "No products found in the database.\n";
    exit;
}

foreach ($products as $product) {
    echo "\nProduct ID: " . $product->id;
    echo "\nProduct Name: " . $product->name;
    echo "\nCategory: " . ($product->category ? $product->category->name : 'NULL');
    echo "\nMetric Type: " . ($product->category ? $product->category->metric_type : 'N/A');
    echo "\nUnit Size: " . $product->unit_size;
    echo "\n-------------------";
}
