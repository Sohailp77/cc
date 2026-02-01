<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$product = App\Models\Product::where('name', 'like', '%Kajaria%')->first();
if ($product) {
    $product->unit_size = 1.44; // Standard coverage for testing
    $product->save();
    echo "Updated " . $product->name . " unit_size to 1.44\n";
} else {
    echo "Product not found\n";
}
