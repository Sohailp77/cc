<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductVariantController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

use App\Models\Category;
use App\Models\Product;

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'stats' => [
            'total_categories' => Category::count(),
            'total_products' => Product::count(),
            'recent_products' => Product::with('category')
                ->latest()
                ->take(5)
                ->get(),
        ]
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    Route::resource('categories', CategoryController::class);
    Route::resource('products', ProductController::class);
    Route::resource('product-variants', ProductVariantController::class)->only(['store', 'update', 'destroy']);

    // Staff Quotation System Routes
    Route::get('/quotes/create', [App\Http\Controllers\QuoteController::class, 'create'])->name('quotes.create');
    Route::post('/quotes', [App\Http\Controllers\QuoteController::class, 'store'])->name('quotes.store');
    Route::get('/quotes/{quote}/pdf', [App\Http\Controllers\QuoteController::class, 'pdf'])->name('quotes.pdf');
});

require __DIR__.'/auth.php';
