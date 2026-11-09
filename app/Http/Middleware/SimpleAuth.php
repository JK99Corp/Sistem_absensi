<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SimpleAuth
{
    /**
     * Middleware autentikasi sederhana berbasis session.
     * Mengecek apakah user sudah login via session.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!session('is_authenticated')) {
            return redirect()->route('login')->with('error', 'Silakan login terlebih dahulu.');
        }

        return $next($request);
    }
}
