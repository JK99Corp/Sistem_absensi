<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\Absensi;
use Carbon\Carbon;

class ArchiveHistoricalData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'data:archive 
                            {--months=0 : Jumlah bulan data aktif dipertahankan (0 = simpan selamanya)} 
                            {--dry-run : Menampilkan pratinjau data tanpa menghapus apapun} 
                            {--force : Menjalankan proses arsip secara langsung}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Modul siaga untuk pengarsipan dan optimasi data historis absensi jika diperlukan di masa depan';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $months = (int) $this->option('months');
        $isDryRun = $this->option('dry-run');
        $isForce = $this->option('force');

        // Parameter default 0 = Simpan Selamanya (Tidak ada data yang dihapus)
        if ($months <= 0) {
            $this->info("=================================================================");
            $this->info("🛡️  KEBIJAKAN RETENSI: SIMPAN SELAMANYA (DEFAULT)");
            $this->info("Seluruh data historis absensi & upah dipertahankan 100% utuh.");
            $this->info("Tidak ada data yang dipindahkan atau dibersihkan.");
            $this->info("=================================================================");
            return Command::SUCCESS;
        }

        $cutoffDate = Carbon::now()->subMonths($months)->toDateString();
        $totalRecords = Absensi::where('tanggal', '<', $cutoffDate)->count();

        $this->warn("=================================================================");
        $this->warn("⚠️  MODUL PENGARSIPAN DATA HISTORIS");
        $this->warn("Ambang batas waktu: Sebelum {$cutoffDate} ({$months} bulan lalu)");
        $this->warn("Jumlah transaksi absensi historis terdeteksi: {$totalRecords} record");
        $this->warn("=================================================================");

        if ($totalRecords === 0) {
            $this->info("✅ Tidak ada data historis yang melebihi batas waktu.");
            return Command::SUCCESS;
        }

        if ($isDryRun || !$isForce) {
            $this->line("Mode simulasi (Dry Run): Data tidak diubah.");
            $this->line("Untuk mengeksekusi di masa depan, gunakan flag: --months={$months} --force");
            return Command::SUCCESS;
        }

        // Jika dijalankan dengan --force di masa depan:
        // Langkah 1: Ekspor ke file arsip SQL/JSON sebelum tindakan apapun
        $archivePath = storage_path('app/archives/absensi_' . date('Ymd_His') . '.json');
        @mkdir(dirname($archivePath), 0755, true);

        $records = Absensi::where('tanggal', '<', $cutoffDate)->get();
        file_put_contents($archivePath, $records->toJson(JSON_PRETTY_PRINT));
        $this->info("📦 Data berhasil diekspor ke arsip dingin: {$archivePath}");

        // Langkah 2: Tandai atau bersihkan data yang sudah terbackup jika disetujui manajemen
        $this->info("✅ Proses pengarsipan selesai dengan aman.");
        return Command::SUCCESS;
    }
}

