/**
 * View Layout & Authentication Views
 * PT. Jaya Kedhaton Enterprise System
 */

const { escapeHtml } = require('../utils/helpers');

function renderLayout(title, activeMenu, content, currentUser = null) {
    const user = currentUser || { username: 'guest', nama: 'Tamu', role: 'guest', roleLabel: 'Tamu' };
    const isSuperAdmin = (user.username === 'superadmin' || user.username === 'admin.utama');

    const menus = [
        { id: 'dashboard', href: '/dashboard', icon: 'fa-chart-bar', label: 'Dashboard' },
        { id: 'riwayat', href: '/riwayat', icon: 'fa-clipboard-list', label: 'Riwayat Absensi' },
        { id: 'rekap', href: '/rekap', icon: 'fa-calendar-week', label: 'Rekap Mingguan' },
        { id: 'upah', href: '/upah', icon: 'fa-money-bill-wave', label: 'Form Transaksi' },
        { id: 'karyawan', href: '/karyawan', icon: 'fa-users', label: 'Karyawan' },
        { id: 'kartu-rfid', href: '/kartu-rfid', icon: 'fa-id-card-clip', label: 'Kartu RFID' },
        { id: 'device', href: '/device', icon: 'fa-desktop', label: 'Device' }
    ];

    // HANYA 2 AKUN SUPER ADMIN YANG BISA MELIHAT MENU LOG AKTIVITAS (AUDIT)
    if (isSuperAdmin) {
        menus.push({
            id: 'audit-log',
            href: '/audit-log',
            icon: 'fa-shield-halved',
            label: 'Log Aktivitas (Audit)',
            badge: 'Admin'
        });
    }

    const menuHtml = menus.map(m => {
        const isActive = activeMenu === m.id;
        const cls = isActive
            ? 'bg-teal-600 text-white shadow-md'
            : 'text-slate-300 hover:bg-slate-700 hover:text-white';
        const badge = m.badge ? `<span class="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ml-auto tracking-wider">${m.badge}</span>` : '';
        return `
            <a href="${m.href}" class="flex items-center gap-3 px-4 py-3.5 rounded-lg text-base font-medium transition-colors duration-200 ${cls}">
                <i class="fas ${m.icon} w-6 text-center text-lg"></i>
                <span>${m.label}</span>
                ${badge}
            </a>
        `;
    }).join('');

    return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistem Absensi Jaya Kedhaton - ${title}</title>
    <link rel="icon" type="image/png" href="/images/logo.png">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    </style>
</head>
<body class="bg-gray-100 min-h-screen">

    <!-- SIDEBAR -->
    <aside class="fixed top-0 left-0 w-64 h-full bg-slate-800 text-white flex flex-col z-50 shadow-xl">
        <div class="px-5 py-5 border-b border-slate-700 flex items-center gap-3">
            <img src="/images/logo.png?v=2" alt="Logo Jaya Kedhaton" 
                 class="w-12 h-12 object-contain shrink-0">
            <div class="overflow-hidden">
                <h1 class="text-base font-bold tracking-wide text-white leading-tight truncate">Jaya Kedhaton</h1>
                <p class="text-xs text-slate-400 mt-0.5 truncate">Sistem Absensi Digital</p>
            </div>
        </div>

        <nav class="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
            ${menuHtml}
        </nav>

        <div class="px-6 py-4 border-t border-slate-700 text-xs text-slate-400">
            &copy; 2026 Sistem Absensi Jaya Kedhaton — Dual-ESP32
        </div>
    </aside>

    <!-- MAIN CONTENT -->
    <div class="ml-64 min-h-screen flex flex-col">
        <!-- Top Bar -->
        <header class="bg-white shadow-sm px-8 py-3.5 flex items-center justify-between sticky top-0 z-40">
            <div class="flex items-center gap-3 text-sm text-slate-600">
                <div class="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    ${user.nama.charAt(0)}
                </div>
                <div>
                    <div class="font-bold text-slate-800 leading-tight">${user.nama}</div>
                    <div class="text-xs text-slate-500">${user.roleLabel} &bull; <span class="font-mono text-slate-400">@${user.username}</span></div>
                </div>
                ${isSuperAdmin
            ? '<span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-200"><i class="fas fa-lock-open mr-1"></i> Izin Audit Penuh</span>'
            : '<span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200"><i class="fas fa-lock mr-1"></i> Staf Operasional</span>'}
            </div>
            <div class="flex items-center gap-3">
                <a href="javascript:location.reload()"
                   class="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                    <i class="fas fa-sync-alt"></i> Refresh
                </a>
                <a href="/logout"
                   class="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 p-8">
            ${content}
        </main>
    </div>

</body>
</html>`;
}

function renderLogin(errorMsg = '') {
    return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistem Absensi Jaya Kedhaton - Login Portal</title>
    <link rel="icon" type="image/png" href="/images/logo.png">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }</style>
</head>
<body class="bg-slate-100 min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-lg">
        <div class="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-slate-200">
            <div class="text-center mb-6">
                <img src="/images/logo.png?v=2" alt="Logo Jaya Kedhaton" 
                     class="w-20 h-20 mx-auto object-contain mb-3 drop-shadow-sm">
                <h1 class="text-2xl font-extrabold text-slate-800">PT Jaya Kedhaton</h1>
                <p class="text-slate-500 text-sm mt-0.5">Portal Masuk Sistem Presensi & Penggajian</p>
            </div>

            ${errorMsg ? `
                <div class="bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-xl p-3.5 mb-5 flex items-center gap-2">
                    <i class="fas fa-circle-exclamation text-rose-600 text-lg"></i>
                    <span>${errorMsg}</span>
                </div>
            ` : ''}

            <form action="/login" method="POST">
                <div class="mb-4">
                    <label class="block text-sm font-bold text-slate-700 mb-1">Username Akun</label>
                    <input type="text" name="username" id="inputUsername" required value="superadmin"
                           class="w-full border border-slate-300 rounded-lg px-4 py-3 text-base text-slate-800 font-medium focus:outline-none focus:border-teal-500">
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-bold text-slate-700 mb-1">Password</label>
                    <input type="password" name="password" id="inputPassword" required value="kedhaton2026!"
                           class="w-full border border-slate-300 rounded-lg px-4 py-3 text-base text-slate-800 font-medium focus:outline-none focus:border-teal-500">
                </div>

                <button type="submit"
                        class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-6 rounded-lg text-base transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer">
                    <i class="fas fa-sign-in-alt"></i> Masuk ke Sistem
                </button>
            </form>

            <!-- Akun Cepat untuk Uji Coba Presentasi -->
            <div class="mt-6 pt-5 border-t border-slate-200">
                <p class="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2.5 flex items-center justify-between">
                    <span>Pilihan Akun Uji Coba:</span>
                    <span class="text-[11px] text-teal-700 font-semibold">(Klik untuk Isi Otomatis)</span>
                </p>

                <div class="space-y-2 text-xs">
                    <div class="p-2.5 rounded-lg border border-teal-200 bg-teal-50/70 hover:bg-teal-100 transition-colors cursor-pointer flex items-center justify-between"
                         onclick="pilihAkun('superadmin', 'kedhaton2026!')">
                        <div>
                            <span class="font-bold text-teal-950">👑 1. Direktur Utama (Super Admin 1)</span>
                            <p class="text-[11px] text-teal-800 mt-0.5">Akses penuh ke seluruh sistem & Log Audit</p>
                        </div>
                        <span class="font-mono text-teal-900 bg-teal-200/80 px-2 py-0.5 rounded text-[10px]">superadmin</span>
                    </div>

                    <div class="p-2.5 rounded-lg border border-blue-200 bg-blue-50/70 hover:bg-blue-100 transition-colors cursor-pointer flex items-center justify-between"
                         onclick="pilihAkun('admin.utama', 'adminutama123')">
                        <div>
                            <span class="font-bold text-blue-950">🛡️ 2. Admin Utama (Super Admin 2 - Auditor)</span>
                            <p class="text-[11px] text-blue-800 mt-0.5">Akses pengawasan penuh & Log Audit</p>
                        </div>
                        <span class="font-mono text-blue-900 bg-blue-200/80 px-2 py-0.5 rounded text-[10px]">admin.utama</span>
                    </div>

                    <div class="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-between"
                         onclick="pilihAkun('staf.keuangan', 'keuangan123')">
                        <div>
                            <span class="font-bold text-slate-800">💼 3. Siti Aminah (Staf Keuangan)</span>
                            <p class="text-[11px] text-slate-500 mt-0.5">Operasional upah & absensi (Log Audit Terkunci)</p>
                        </div>
                        <span class="font-mono text-slate-600 bg-slate-200 px-2 py-0.5 rounded text-[10px]">staf.keuangan</span>
                    </div>

                    <div class="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-between"
                         onclick="pilihAkun('staf.hrd', 'hrd123')">
                        <div>
                            <span class="font-bold text-slate-800">📋 4. Rendra Bagus (Staf HRD)</span>
                            <p class="text-[11px] text-slate-500 mt-0.5">Operasional karyawan & kartu (Log Audit Terkunci)</p>
                        </div>
                        <span class="font-mono text-slate-600 bg-slate-200 px-2 py-0.5 rounded text-[10px]">staf.hrd</span>
                    </div>
                </div>
            </div>
        </div>

        <p class="text-center text-slate-500 text-xs mt-5">
            &copy; 2026 PT Jaya Kedhaton &bull; Hak Cipta Dilindungi
        </p>
    </div>

    <script>
        function pilihAkun(u, p) {
            document.getElementById('inputUsername').value = u;
            document.getElementById('inputPassword').value = p;
        }
    </script>
</body>
</html>`;
}

module.exports = {
    renderLayout,
    renderLogin
};
