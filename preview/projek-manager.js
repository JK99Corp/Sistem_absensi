/**
 * Sistem Absensi Jaya Kedhaton - Dynamic Project Manager
 * Mengelola daftar bagian projek secara dinamis (Tambah, Rename, Hapus)
 * Tersimpan persisten di localStorage browser.
 */

const STORAGE_KEY_PROJEK = 'jk_daftar_projek';
const DEFAULT_PROJEK = ['Projek A', 'Projek B', 'Projek C'];

function getDaftarProjek() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY_PROJEK);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {
        console.error('Error membaca jk_daftar_projek:', e);
    }
    return [...DEFAULT_PROJEK];
}

function simpanDaftarProjek(list) {
    try {
        localStorage.setItem(STORAGE_KEY_PROJEK, JSON.stringify(list));
    } catch (e) {
        console.error('Error menyimpan jk_daftar_projek:', e);
    }
}

function tambahProjekBaru(nama) {
    nama = (nama || '').trim();
    if (!nama) return { success: false, message: 'Nama projek tidak boleh kosong!' };
    
    let list = getDaftarProjek();
    if (list.some(p => p.toLowerCase() === nama.toLowerCase())) {
        return { success: false, message: `Projek "${nama}" sudah terdaftar!` };
    }

    list.push(nama);
    simpanDaftarProjek(list);
    sinkronkanSemuaKomponenProjek();
    return { success: true, message: `Projek "${nama}" berhasil ditambahkan!` };
}

function renameProjek(namaLama, namaBaru) {
    namaBaru = (namaBaru || '').trim();
    if (!namaBaru) return { success: false, message: 'Nama baru tidak boleh kosong!' };
    if (namaLama.toLowerCase() === namaBaru.toLowerCase()) return { success: true };

    let list = getDaftarProjek();
    const idx = list.indexOf(namaLama);
    if (idx === -1) return { success: false, message: `Projek "${namaLama}" tidak ditemukan!` };

    if (list.some((p, i) => i !== idx && p.toLowerCase() === namaBaru.toLowerCase())) {
        return { success: false, message: `Nama "${namaBaru}" sudah digunakan oleh projek lain!` };
    }

    list[idx] = namaBaru;
    simpanDaftarProjek(list);

    // Update semua elemen DOM yang menggunakan data-projek lama
    document.querySelectorAll(`[data-projek="${namaLama}"]`).forEach(el => {
        el.setAttribute('data-projek', namaBaru);
        // Cari elemen badge teks di dalam baris
        el.querySelectorAll('*').forEach(child => {
            if (child.childNodes.length === 1 && child.childNodes[0].nodeType === 3 && child.innerText.trim() === namaLama) {
                child.innerText = namaBaru;
            } else if (child.innerHTML.includes(namaLama)) {
                child.innerHTML = child.innerHTML.replace(new RegExp(namaLama, 'g'), namaBaru);
            }
        });
    });

    sinkronkanSemuaKomponenProjek();
    return { success: true, message: `Projek berhasil diubah menjadi "${namaBaru}"!` };
}

function hapusProjek(nama) {
    let list = getDaftarProjek();
    if (list.length <= 1) {
        return { success: false, message: 'Minimal harus ada 1 projek aktif!' };
    }

    list = list.filter(p => p !== nama);
    simpanDaftarProjek(list);

    // Tandai data-projek lama menjadi '-' atau projek pertama
    document.querySelectorAll(`[data-projek="${nama}"]`).forEach(el => {
        el.setAttribute('data-projek', '-');
    });

    sinkronkanSemuaKomponenProjek();
    return { success: true, message: `Projek "${nama}" berhasil dihapus.` };
}

/**
 * Render tombol-tombol filter projek secara dinamis di dalam container
 */
function renderFilterProjekButtons(containerSelector, activeProjek, onClickFnName) {
    const box = document.querySelector(containerSelector);
    if (!box) return;

    const list = getDaftarProjek();
    
    // Hitung kemunculan per projek di tabel jika ada
    const rows = document.querySelectorAll('tr[data-projek]');
    const counts = {};
    let totalPekerja = 0;
    rows.forEach(r => {
        const prj = r.getAttribute('data-projek');
        if (prj && prj !== '-') {
            counts[prj] = (counts[prj] || 0) + 1;
            totalPekerja++;
        }
    });

    let buttonsHtml = `
        <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs font-bold uppercase text-amber-900 mr-2 flex items-center gap-1.5">
                <i class="fas fa-hard-hat text-amber-600"></i>
                <span>2. Filter Bagian Projek (Harian):</span>
            </span>
            <button onclick="${onClickFnName}('')" id="btnPrjAll"
                    class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${!activeProjek ? 'bg-amber-700 text-white shadow' : 'bg-white text-amber-900 border border-amber-300 hover:bg-amber-100'}">
                Semua Projek (${totalPekerja})
            </button>
    `;

    list.forEach(prj => {
        const isActive = (activeProjek === prj);
        const cnt = counts[prj] || 0;
        const cls = isActive
            ? 'bg-amber-600 text-white shadow'
            : 'bg-white text-amber-900 border border-amber-300 hover:bg-amber-100';
        buttonsHtml += `
            <button onclick="${onClickFnName}('${prj.replace(/'/g, "\\'")}')" 
                    class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${cls}">
                ${prj} (${cnt})
            </button>
        `;
    });

    buttonsHtml += `
        </div>
        <div class="flex items-center gap-3">
            <div class="text-xs font-semibold text-amber-900" id="infoProjekAktif">
                ${activeProjek ? 'Hanya Bagian: ' + activeProjek : 'Semua Bagian Projek Aktif'}
            </div>
            <button onclick="bukaModalKelolaProjek()" 
                    class="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm">
                <i class="fas fa-cog text-amber-700"></i>
                <span>Kelola Projek</span>
            </button>
        </div>
    `;

    box.innerHTML = buttonsHtml;
}

/**
 * Sinkronkan dropdown pilihan projek di formulir modal
 */
function populateSemuaSelectProjek() {
    const list = getDaftarProjek();
    const selects = document.querySelectorAll('select[name="projek"], #selectProjekPekerja, #filterProjekRiwayat, #editProjekPekerja');
    selects.forEach(sel => {
        const currentVal = sel.value;
        const isFilter = sel.id === 'filterProjekRiwayat';
        
        let optHtml = isFilter ? '<option value="">Semua Projek</option>' : '';
        list.forEach(p => {
            const selected = (p === currentVal) ? 'selected' : '';
            optHtml += `<option value="${p}" ${selected}>${p}</option>`;
        });
        sel.innerHTML = optHtml;
    });
}

/**
 * Tampilkan modal kelola projek
 */
function injectModalKelolaProjek() {
    if (document.getElementById('modalKelolaProjekContainer')) return;

    const modalDiv = document.createElement('div');
    modalDiv.id = 'modalKelolaProjekContainer';
    modalDiv.innerHTML = `
        <div id="modalKelolaProjek" class="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-7 text-slate-800 relative max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
                    <div class="flex items-center gap-2.5">
                        <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-lg font-bold">
                            <i class="fas fa-hard-hat"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-slate-900">Kelola Bagian Projek</h3>
                            <p class="text-xs text-slate-500">Ubah nama (rename) atau tambahkan bagian projek pekerja harian</p>
                        </div>
                    </div>
                    <button onclick="tutupModalKelolaProjek()" class="text-slate-400 hover:text-slate-600 text-2xl font-bold cursor-pointer">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Form Tambah Projek Baru -->
                <div class="bg-amber-50/70 border border-amber-200 rounded-xl p-4 mb-6">
                    <label class="block text-xs font-bold uppercase text-amber-950 mb-2 flex items-center gap-1.5">
                        <i class="fas fa-plus-circle text-amber-600"></i>
                        <span>Tambah Bagian Projek Baru</span>
                    </label>
                    <div class="flex gap-2">
                        <input type="text" id="inputNamaProjekBaru" placeholder="Contoh: Projek Pembangunan Gudang" 
                               class="flex-1 border-2 border-amber-300 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-amber-600 bg-white">
                        <button onclick="handleTambahProjek()" class="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors shadow cursor-pointer whitespace-nowrap flex items-center gap-1">
                            <i class="fas fa-plus"></i> Tambah
                        </button>
                    </div>
                </div>

                <!-- Daftar Projek Saat Ini -->
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-bold uppercase text-slate-500">Daftar Bagian Projek Terdaftar</span>
                        <span class="text-xs text-slate-400" id="totalProjekBadge">3 Projek</span>
                    </div>
                    <div id="listProjekContainer" class="space-y-2">
                        <!-- Dimuat lewat JS -->
                    </div>
                </div>

                <div class="mt-6 pt-4 border-t border-slate-200 flex justify-end">
                    <button onclick="tutupModalKelolaProjek()" class="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors cursor-pointer shadow">
                        Selesai
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modalDiv);
}

function bukaModalKelolaProjek() {
    injectModalKelolaProjek();
    refreshListProjekModal();
    document.getElementById('modalKelolaProjek').classList.remove('hidden');
}

function tutupModalKelolaProjek() {
    const modal = document.getElementById('modalKelolaProjek');
    if (modal) modal.classList.add('hidden');
}

function refreshListProjekModal() {
    const container = document.getElementById('listProjekContainer');
    if (!container) return;

    const list = getDaftarProjek();
    document.getElementById('totalProjekBadge').innerText = list.length + ' Projek';

    container.innerHTML = list.map((prj, i) => `
        <div class="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white transition-colors" id="itemProjek_${i}">
            <div class="flex items-center gap-3 flex-1 mr-2" id="viewArea_${i}">
                <span class="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">${i + 1}</span>
                <span class="font-bold text-slate-800 text-sm" id="labelProjek_${i}">${prj}</span>
            </div>

            <!-- Mode Edit Inline (Hidden Default) -->
            <div class="hidden flex-1 flex items-center gap-2 mr-2" id="editArea_${i}">
                <input type="text" id="inputRename_${i}" value="${prj}" class="w-full border-2 border-teal-500 rounded-lg px-2.5 py-1 text-sm font-bold text-slate-800 bg-white">
                <button onclick="handleSimpanRename('${prj.replace(/'/g, "\\'")}', ${i})" class="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow cursor-pointer">
                    Simpan
                </button>
                <button onclick="batalEditInline(${i})" class="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-2.5 py-1.5 rounded-lg cursor-pointer">
                    Batal
                </button>
            </div>

            <div class="flex items-center gap-1.5" id="actionArea_${i}">
                <button onclick="bukaEditInline(${i})" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1 rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer">
                    <i class="fas fa-edit text-slate-500 text-[11px]"></i> Rename
                </button>
                <button onclick="handleHapusProjek('${prj.replace(/'/g, "\\'")}')" class="bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold px-2.5 py-1 rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer">
                    <i class="fas fa-trash text-rose-500 text-[11px]"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function bukaEditInline(idx) {
    document.getElementById(`viewArea_${idx}`).classList.add('hidden');
    document.getElementById(`actionArea_${idx}`).classList.add('hidden');
    document.getElementById(`editArea_${idx}`).classList.remove('hidden');
    document.getElementById(`inputRename_${idx}`).focus();
}

function batalEditInline(idx) {
    document.getElementById(`viewArea_${idx}`).classList.remove('hidden');
    document.getElementById(`actionArea_${idx}`).classList.remove('hidden');
    document.getElementById(`editArea_${idx}`).classList.add('hidden');
}

function handleTambahProjek() {
    const input = document.getElementById('inputNamaProjekBaru');
    const nama = input.value.trim();
    if (!nama) {
        alert('Mohon masukkan nama projek baru!');
        return;
    }
    const res = tambahProjekBaru(nama);
    if (res.success) {
        input.value = '';
        refreshListProjekModal();
        if (typeof tampilkanToast === 'function') tampilkanToast(res.message);
    } else {
        alert(res.message);
    }
}

function handleSimpanRename(namaLama, idx) {
    const namaBaru = document.getElementById(`inputRename_${idx}`).value.trim();
    if (!namaBaru) {
        alert('Nama projek tidak boleh kosong!');
        return;
    }
    const res = renameProjek(namaLama, namaBaru);
    if (res.success) {
        refreshListProjekModal();
        if (typeof tampilkanToast === 'function') tampilkanToast(res.message);
    } else {
        alert(res.message);
    }
}

function handleHapusProjek(nama) {
    if (!confirm(`Apakah Anda yakin ingin menghapus "${nama}"?\n\nKaryawan pada projek ini akan dialihkan.`)) return;
    const res = hapusProjek(nama);
    if (res.success) {
        refreshListProjekModal();
        if (typeof tampilkanToast === 'function') tampilkanToast(res.message);
    } else {
        alert(res.message);
    }
}

function sinkronkanSemuaKomponenProjek() {
    // 1. Re-render filter buttons pada halaman Dashboard jika ada
    if (typeof setFilterProjek === 'function' && document.getElementById('boxFilterProjek')) {
        renderFilterProjekButtons('#boxFilterProjek', window.filterAktif ? window.filterAktif.projek : '', 'setFilterProjek');
        if (typeof jalankanFilter === 'function') jalankanFilter();
    }

    // 2. Re-render filter buttons pada halaman Upah jika ada
    if (typeof setFilterUpahProjek === 'function' && document.getElementById('boxFilterProjek')) {
        renderFilterProjekButtons('#boxFilterProjek', window.filterUpahProjekAktif || '', 'setFilterUpahProjek');
        if (typeof jalankanFilterUpah === 'function') jalankanFilterUpah();
    }

    // 3. Re-render filter buttons pada halaman Rekap jika ada
    if (typeof setFilterRekapProjek === 'function' && document.getElementById('boxFilterProjek')) {
        renderFilterProjekButtons('#boxFilterProjek', window.filterRekapProjekAktif || '', 'setFilterRekapProjek');
        if (typeof jalankanFilterRekap === 'function') jalankanFilterRekap();
    }

    // 4. Re-render filter buttons pada halaman Kartu RFID jika ada
    if (typeof setFilterKartuProjek === 'function' && document.getElementById('boxFilterProjek')) {
        renderFilterProjekButtons('#boxFilterProjek', window.filterKartuProjekAktif || '', 'setFilterKartuProjek');
        if (typeof jalankanFilterKartu === 'function') jalankanFilterKartu();
    }

    // 5. Populate select dropdowns
    populateSemuaSelectProjek();

    // 6. Trigger custom event jika dibutuhkan
    window.dispatchEvent(new CustomEvent('projekUpdated'));
}

// Inisialisasi otomatis saat script dimuat
document.addEventListener('DOMContentLoaded', () => {
    injectModalKelolaProjek();
    populateSemuaSelectProjek();
});
