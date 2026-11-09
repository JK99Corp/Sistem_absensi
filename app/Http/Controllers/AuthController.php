<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * Tampilkan halaman login.
     */
    public function showLogin()
    {
        // Jika sudah login, redirect ke dashboard
        if (session('is_authenticated')) {
            return redirect()->route('dashboard');
        }

        return view('login');
    }

    /**
     * Proses login dengan kredensial hardcoded.
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        // Kredensial hardcoded untuk prototype
        $validUsername = 'admin';
        $validPassword = 'admin123';

        if ($request->username === $validUsername && $request->password === $validPassword) {
            session([
                'is_authenticated' => true,
                'username' => $validUsername,
                'user_role' => 'Administrator',
            ]);

            return redirect()->route('dashboard')->with('success', 'Login berhasil! Selamat datang.');
        }

        return back()->withErrors([
            'login' => 'Username atau password salah.',
        ])->withInput($request->only('username'));
    }

    /**
     * Proses logout.
     */
    public function logout(Request $request)
    {
        $request->session()->flush();

        return redirect()->route('login')->with('success', 'Anda telah berhasil keluar.');
    }
}
