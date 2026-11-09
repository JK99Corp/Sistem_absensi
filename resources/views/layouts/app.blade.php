<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistem Absensi Jaya Kedhaton - @yield('title', 'Dashboard')</title>
    <link rel="icon" type="image/png" href="{{ asset('images/logo.png') }}">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        [x-cloak] { display: none !important; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    </style>
</head>
<body class="bg-gray-100 min-h-screen">

    {{-- ===== SIDEBAR ===== --}}
    <aside class="fixed top-0 left-0 w-64 h-full bg-slate-800 text-white flex flex-col z-50 shadow-xl">
        {{-- Sidebar Header --}}
        <div class="px-5 py-5 border-b border-slate-700 flex items-center gap-3">
            <img src="{{ asset('images/logo.png') }}" alt="Logo Jaya Kedhaton" 
                 class="w-12 h-12 object-contain shrink-0">
            <div class="overflow-hidden">
                <h1 class="text-base font-bold tracking-wide text-white leading-tight truncate">Jaya Kedhaton</h1>
                <p class="text-xs text-slate-400 mt-0.5 truncate">Sistem Absensi Digital</p>
            </div>
        </div>

        {{-- Navigation Menu --}}
        <nav class="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
            @php
                $menuItems = [
                    ['route' => 'dashboard', 'icon' => 'fa-chart-bar', 'label' => 'Dashboard'],
                    ['route' => 'riwayat', 'icon' => 'fa-clipboard-list', 'label' => 'Riwayat Absensi'],
                    ['route' => 'rekap', 'icon' => 'fa-calendar-week', 'label' => 'Rekap Mingguan'],
                    ['route' => 'upah', 'icon' => 'fa-money-bill-wave', 'label' => 'Upah & Lembur'],
                    ['route' => 'karyawan', 'icon' => 'fa-users', 'label' => 'Karyawan'],
                    ['route' => 'kartu-rfid', 'icon' => 'fa-id-card-clip', 'label' => 'Kartu RFID'],
                    ['route' => 'device', 'icon' => 'fa-desktop', 'label' => 'Device'],
                ];
                $activeMenu = View::getSection('active_menu', '');
            @endphp

            @foreach ($menuItems as $item)
                <a href="{{ url('/' . $item['route']) }}"
                   class="flex items-center justify-between px-4 py-3.5 rounded-lg text-base font-medium transition-colors duration-200
                          {{ $activeMenu === $item['route']
                              ? 'bg-teal-600 text-white shadow-md'
                              : 'text-slate-300 hover:bg-slate-700 hover:text-white' }}">
                    <div class="flex items-center gap-3">
                        <i class="fas {{ $item['icon'] }} w-6 text-center text-lg"></i>
                        <span>{{ $item['label'] }}</span>
                    </div>
                    @if (isset($item['badge']))
                        <span class="bg-amber-400 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                            {{ $item['badge'] }}
                        </span>
                    @endif
                </a>
            @endforeach

            {{-- Menu Log Aktivitas: HANYA untuk 2 Akun Pimpinan (Super Admin) --}}
            @if (auth()->check() && (auth()->user()->username === 'superadmin' || auth()->user()->username === 'admin.utama'))
                <a href="{{ url('/audit-log') }}"
                   class="flex items-center justify-between px-4 py-3.5 rounded-lg text-base font-medium transition-colors duration-200
                          {{ $activeMenu === 'audit-log'
                              ? 'bg-teal-600 text-white shadow-md'
                              : 'text-slate-300 hover:bg-slate-700 hover:text-white' }}">
                    <div class="flex items-center gap-3">
                        <i class="fas fa-shield-halved w-6 text-center text-lg"></i>
                        <span>Log Aktivitas (Audit)</span>
                    </div>
                    <span class="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
                </a>
            @endif
        </nav>

        {{-- Sidebar Footer --}}
        <div class="px-6 py-4 border-t border-slate-700 text-xs text-slate-400">
            &copy; {{ date('Y') }} Sistem Absensi Jaya Kedhaton — Dual-ESP32
        </div>
    </aside>

    {{-- ===== MAIN CONTENT ===== --}}
    <div class="ml-64 min-h-screen flex flex-col">

        {{-- Top Bar --}}
        <header class="bg-white shadow-sm px-8 py-4 flex items-center justify-between sticky top-0 z-40">
            <div class="text-base text-slate-600">
                Login sebagai <span class="font-semibold text-slate-800">Admin Keuangan & Absensi</span> - admin
            </div>
            <div class="flex items-center gap-3">
                <a href="{{ url()->current() }}"
                   class="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                    <i class="fas fa-sync-alt"></i> Refresh
                </a>
                <a href="{{ url('/login') }}"
                   class="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            </div>
        </header>

        {{-- Page Content --}}
        <main class="flex-1 p-8">
            @yield('content')
        </main>
    </div>

</body>
</html>
