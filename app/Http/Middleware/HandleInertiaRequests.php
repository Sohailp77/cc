<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'flash' => [
                'message' => fn() => $request->session()->get('message'),
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
                'pdf_url' => fn() => $request->session()->get('pdf_url'),
                'stock_warning' => fn() => $request->session()->get('stock_warning'),
            ],
            // Shared company settings available on every page
            'appSettings' => fn() => array_merge(
                \App\Models\CompanySetting::where('group', 'company')
                    ->whereIn('key', ['company_name', 'currency_symbol'])
                    ->pluck('value', 'key')
                    ->all(),
                \App\Models\CompanySetting::where('group', 'theme')
                    ->pluck('value', 'key')
                    ->all()
            ),
        ];
    }
}
