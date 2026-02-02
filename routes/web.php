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

    // Settings Routes
    Route::get('/settings', [App\Http\Controllers\SettingsController::class, 'index'])->name('settings.index');
    Route::put('/settings/tax-configuration', [App\Http\Controllers\SettingsController::class, 'updateTaxConfiguration'])->name('settings.tax-configuration.update');
    Route::post('/settings/tax-rates', [App\Http\Controllers\SettingsController::class, 'storeTaxRate'])->name('settings.tax-rates.store');
    Route::put('/settings/tax-rates/{taxRate}', [App\Http\Controllers\SettingsController::class, 'updateTaxRate'])->name('settings.tax-rates.update');
    Route::delete('/settings/tax-rates/{taxRate}', [App\Http\Controllers\SettingsController::class, 'destroyTaxRate'])->name('settings.tax-rates.destroy');
    Route::put('/settings/company-profile', [App\Http\Controllers\SettingsController::class, 'updateCompanyProfile'])->name('settings.company-profile.update');
});

require __DIR__ . '/auth.php';
