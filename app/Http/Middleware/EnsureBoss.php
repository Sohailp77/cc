<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureBoss
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->isBoss()) {
            abort(403, 'Access restricted to administrators.');
        }

        return $next($request);
    }
}
