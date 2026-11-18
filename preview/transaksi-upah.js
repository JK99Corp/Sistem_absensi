        // Master Data Pekerja, Standar Upah & 30 Proyek PT. Jaya Kedhaton
        // Dimuat secara modular dari master-data.js atau disuntikkan dari backend SERVER_DATA
        const DAFTAR_PEKERJA = (typeof window !== 'undefined' && window.SERVER_DATA && window.SERVER_DATA.daftarPekerja && window.SERVER_DATA.daftarPekerja.length > 0)
            ? window.SERVER_DATA.daftarPekerja
            : (typeof window !== 'undefined' && window.MASTER_PEKERJA) || [];

        const STANDAR_UPAH = (typeof window !== 'undefined' && window.MASTER_STANDAR_UPAH) || {
            'STAFF KANTOR': 150000,
            'MANDOR': 200000,
            'MANDOR INTERIOR': 200000,
            'WAKIL MANDOR': 150000,
            'TUKANG': 140000,
            'MEP': 140000,
            'CAT': 140000,
            'SEMI TUKANG': 130000,
            'PEMBANTU TUKANG': 120000,
            'RKS': 120000
        };

        const DAFTAR_PROJEK = (typeof window !== 'undefined' && window.SERVER_DATA && window.SERVER_DATA.daftarProjek && window.SERVER_DATA.daftarProjek.length > 0)
            ? window.SERVER_DATA.daftarProjek
            : (typeof window !== 'undefined' && window.MASTER_PROJEK) || [];

        // State Form Saat Ini
        let editingTrxId = null;
        let selectedPekerjaKode = '';
        let selectedPekerjaNama = '';
        let currentProjekList = [
            { projek: '', hari: 0, lembur: 0, makan: 0, transport: 0, insentif: 0 }
        ];

        // Daftar Transaksi Awal
        let transaksiList = (typeof window !== 'undefined' && window.SERVER_DATA && window.SERVER_DATA.transaksiList && window.SERVER_DATA.transaksiList.length > 0)
            ? window.SERVER_DATA.transaksiList
            : [
            {
                id: 1,
                kode: 'KANCIL-013',
                nama: 'MUSTOFA',
                posisi: 'TUKANG',
                upahPerHari: 140000,
                projekList: [
                    { projek: 'FELISA ESTATE', hari: 6, lembur: 6, makan: 30000, transport: 20000, insentif: 0 },
                    { projek: 'RUKO PAK DEDI', hari: 2, lembur: 0, makan: 10000, transport: 0, insentif: 0 }
                ],
                kasbon: 100000,
                kasbonKet: 'Pinjam keperluan keluarga',
                transfer: 1000000,
                cash: 345000
            },
            {
                id: 2,
                kode: 'SUDIRO-001',
                nama: 'IMAM MUHAMMAD SUDIRO',
                posisi: 'TUKANG',
                upahPerHari: 140000,
                projekList: [
                    { projek: 'FELISA ESTATE', hari: 6, lembur: 4, makan: 30000, transport: 15000, insentif: 0 }
                ],
                kasbon: 0,
                kasbonKet: '',
                transfer: 900000,
                cash: 55000
            },
            {
                id: 3,
                kode: 'NARDI-036',
                nama: 'ACHMAD HUDA',
                posisi: 'PEMBANTU TUKANG',
                upahPerHari: 120000,
                projekList: [
                    { projek: 'PAGAR RING ROAD', hari: 6, lembur: 2, makan: 25000, transport: 0, insentif: 0 }
                ],
                kasbon: 50000,
                kasbonKet: 'Beli pulsa & token',
                transfer: 700000,
                cash: 25000
            }
        ];

        // Load storage lokal terlebih dahulu
        try {
            const savedTrx = localStorage.getItem('jaya_transaksi_upah_v3');
            if (savedTrx) {
                const parsed = JSON.parse(savedTrx);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    transaksiList = parsed;
                }
            }
        } catch (_) {}

        // Sinkronisasi otomatis dari database server (jika online lewat HTTP/HTTPS)
        if (typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http')) {
            fetch('/api/transaksi')
                .then(r => r.json())
                .then(res => {
                    if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
                        transaksiList = res.data;
                        try {
                            localStorage.setItem('jaya_transaksi_upah_v3', JSON.stringify(transaksiList));
                        } catch (_) {}
                        renderDaftarTransaksi();
                    }
                })
                .catch(() => {});
        }

        function simpanKeStorage() {
            // 1. Simpan di LocalStorage browser (akses offline)
            try {
                localStorage.setItem('jaya_transaksi_upah_v3', JSON.stringify(transaksiList));
            } catch (_) {}

            // 2. Sinkronkan permanen ke Database Backend Server (jika online)
            if (typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http')) {
                fetch('/api/transaksi', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ transaksiSemua: transaksiList })
                }).catch(() => {});
            }
        }

        function formatRp(val) {
            return 'Rp ' + Math.round(Number(val) || 0).toLocaleString('id-ID');
        }

        function escapeHtml(text) {
            if (!text) return '';
            return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }

        // =========================================================================
        // A. AUTOCOMPLETE & DROPDOWN PENCARIAN PEKERJA (BEBAS BUG)
        // =========================================================================
        let currentHasilPekerja = [];
        let focusedPekerjaIndex = -1;

        function onFocusInputPekerja() {
            const val = document.getElementById('inputPekerja').value.trim();
            handlePencarianPekerja(val);
        }

        function handleInputPekerja(e) {
            const val = e.target.value.trim();
            handlePencarianPekerja(val);
        }

        function handlePencarianPekerja(keyword) {
            const q = (keyword || '').trim().toUpperCase();
            const btnClear = document.getElementById('btnClearPekerja');
            if (btnClear) btnClear.style.display = q ? 'inline-block' : 'none';

            if (!q) {
                // Tampilkan seluruh 252 pekerja resmi
                currentHasilPekerja = [...DAFTAR_PEKERJA];
            } else {
                currentHasilPekerja = DAFTAR_PEKERJA.filter(p => {
                    const k = (p.k || '').toUpperCase();
                    const n = (p.n || '').toUpperCase();
                    const pos = (p.p || '').toUpperCase();
                    return k.includes(q) || n.includes(q) || pos.includes(q);
                });
            }

            renderDropdownPekerjaPopup(q);
        }

        function renderDropdownPekerjaPopup(keyword) {
            const popup = document.getElementById('dropdownPekerjaPopup');
            const container = document.getElementById('listPekerjaItems');
            const labelTotal = document.getElementById('labelTotalHasilPekerja');
            if (!popup || !container) return;

            focusedPekerjaIndex = -1;

            if (currentHasilPekerja.length === 0) {
                container.innerHTML = `
                    <div class="p-4 text-center text-slate-400 text-xs">
                        <i class="fas fa-search text-2xl mb-1.5 block text-slate-300"></i>
                        Tidak ditemukan pekerja dengan kata kunci "<strong>${escapeHtml(keyword)}</strong>".
                        <p class="text-[11px] text-slate-500 mt-1 italic">Anda tetap bisa menyimpan dengan nama ini sebagai pekerja baru.</p>
                    </div>
                `;
                labelTotal.innerText = '0 Pekerja';
                popup.classList.remove('hidden');
                return;
            }

            labelTotal.innerText = `${currentHasilPekerja.length} Pekerja`;
            container.innerHTML = currentHasilPekerja.map((p, idx) => {
                let badgeColor = 'bg-blue-100 text-blue-800';
                if (p.p.includes('MANDOR')) badgeColor = 'bg-emerald-100 text-emerald-800';
                else if (p.p.includes('PEMBANTU')) badgeColor = 'bg-slate-200 text-slate-800';
                else if (p.p.includes('SEMI')) badgeColor = 'bg-amber-100 text-amber-800';
                else if (p.p.includes('STAFF')) badgeColor = 'bg-indigo-100 text-indigo-800';

                const upahStd = STANDAR_UPAH[p.p] || 0;

                return `
                    <div class="px-3.5 py-2 hover:bg-teal-50 cursor-pointer transition-colors flex items-center justify-between rounded-lg item-dropdown-pekerja"
                         data-idx="${idx}"
                         onmousedown="pilihPekerjaByIndex(${idx})">
                        <div class="flex items-center gap-2.5 overflow-hidden">
                            <span class="bg-slate-800 text-white font-mono text-[11px] px-2 py-0.5 rounded font-extrabold tracking-wider shrink-0">
                                ${escapeHtml(p.k)}
                            </span>
                            <div class="truncate">
                                <p class="font-extrabold text-slate-900 text-xs sm:text-sm leading-tight truncate">${escapeHtml(p.n)}</p>
                                <span class="text-[10px] font-bold px-2 py-0.2 rounded ${badgeColor} inline-block mt-0.5">${escapeHtml(p.p)}</span>
                            </div>
                        </div>
                        <div class="text-right shrink-0 pl-2">
                            <span class="text-xs font-bold text-slate-700">${formatRp(upahStd)}</span>
                            <span class="text-[10px] text-slate-400 block">/ hari</span>
                        </div>
                    </div>
                `;
            }).join('');

            popup.classList.remove('hidden');
        }

        function pilihPekerjaByIndex(idx) {
            const p = currentHasilPekerja[idx];
            if (!p) return;

            selectedPekerjaKode = p.k;
            selectedPekerjaNama = p.n;

            document.getElementById('inputPekerja').value = `(${p.k}) ${p.n}`;

            // Case-insensitive matching untuk dropdown posisi
            const posTarget = (p.p || '').trim().toUpperCase();
            const selectPosisi = document.getElementById('posisiPekerja');
            const matchOpt = Array.from(selectPosisi.options).find(o => o.value.trim().toUpperCase() === posTarget);
            selectPosisi.value = matchOpt ? matchOpt.value : '';

            const upahStd = STANDAR_UPAH[posTarget] || STANDAR_UPAH[p.p] || 0;
            document.getElementById('upahPerHari').value = upahStd;

            const infoPekerja = document.getElementById('infoPekerjaTerpilih');
            if (infoPekerja) infoPekerja.classList.remove('hidden');

            const btnClear = document.getElementById('btnClearPekerja');
            if (btnClear) btnClear.style.display = 'inline-block';

            tutupDropdownPekerja();
            hitungTotalForm();
        }

        function resetInputPekerjaManual() {
            selectedPekerjaKode = '';
            selectedPekerjaNama = '';
            document.getElementById('inputPekerja').value = '';
            document.getElementById('posisiPekerja').value = '';
            document.getElementById('upahPerHari').value = 0;
            const infoPekerja = document.getElementById('infoPekerjaTerpilih');
            if (infoPekerja) infoPekerja.classList.add('hidden');
            const btnClear = document.getElementById('btnClearPekerja');
            if (btnClear) btnClear.style.display = 'none';
            tutupDropdownPekerja();
            hitungTotalForm();
            document.getElementById('inputPekerja').focus();
        }

        function tutupDropdownPekerja() {
            const popup = document.getElementById('dropdownPekerjaPopup');
            if (popup) popup.classList.add('hidden');
        }

        function toggleDropdownPekerja() {
            const popup = document.getElementById('dropdownPekerjaPopup');
            if (!popup) return;
            if (popup.classList.contains('hidden')) {
                onFocusInputPekerja();
                document.getElementById('inputPekerja').focus();
            } else {
                tutupDropdownPekerja();
            }
        }

        // Tutup dropdown jika klik di luar
        document.addEventListener('click', (e) => {
            const wrapper = document.getElementById('wrapperCariPekerja');
            if (wrapper && !wrapper.contains(e.target)) {
                tutupDropdownPekerja();
            }
        });

        // Keyboard navigasi untuk pencarian pekerja
        document.getElementById('inputPekerja').addEventListener('keydown', (e) => {
            const popup = document.getElementById('dropdownPekerjaPopup');
            if (!popup || popup.classList.contains('hidden')) {
                if (e.key === 'ArrowDown') {
                    onFocusInputPekerja();
                }
                return;
            }

            const items = popup.querySelectorAll('.item-dropdown-pekerja');
            if (items.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                focusedPekerjaIndex = (focusedPekerjaIndex + 1) % items.length;
                highlightFocusedItem(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                focusedPekerjaIndex = (focusedPekerjaIndex - 1 + items.length) % items.length;
                highlightFocusedItem(items);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (focusedPekerjaIndex >= 0 && focusedPekerjaIndex < currentHasilPekerja.length) {
                    pilihPekerjaByIndex(focusedPekerjaIndex);
                } else if (currentHasilPekerja.length > 0) {
                    pilihPekerjaByIndex(0);
                }
            } else if (e.key === 'Escape') {
                tutupDropdownPekerja();
            }
        });

        function highlightFocusedItem(items) {
            items.forEach((it, i) => {
                if (i === focusedPekerjaIndex) {
                    it.classList.add('bg-teal-100');
                    it.scrollIntoView({ block: 'nearest' });
                } else {
                    it.classList.remove('bg-teal-100');
                }
            });
        }

        function onUbahPosisi(pos) {
            if (!pos) {
                document.getElementById('upahPerHari').value = 0;
            } else {
                const upahStd = STANDAR_UPAH[pos] || 0;
                document.getElementById('upahPerHari').value = upahStd;
            }
            hitungTotalForm();
        }

        // =========================================================================
        // B. MANAJEMEN RINCIAN PROYEK (MULTI-PROYEK LENGKAP & ANTI-BUG)
        // =========================================================================
        function renderBlokProyek() {
            const container = document.getElementById('containerProyekList');
            container.innerHTML = '';
            const upah = parseFloat(document.getElementById('upahPerHari').value) || 0;
            const tarifLembur = upah / 8;

            currentProjekList.forEach((item, idx) => {
                const subPokok = (Number(item.hari) || 0) * upah;
                const subLembur = (Number(item.lembur) || 0) * tarifLembur;
                const subTotal = subPokok + subLembur + (Number(item.makan) || 0) + (Number(item.transport) || 0) + (Number(item.insentif) || 0);

                // Cek apakah proyek cocok dengan daftar resmi
                const matchResmi = DAFTAR_PROJEK.find(p => p.toUpperCase() === (item.projek || '').toUpperCase());
                const isCustom = !matchResmi && Boolean(item.projek);

                const card = document.createElement('div');
                card.className = 'p-4 md:p-5 rounded-xl border border-slate-300 bg-slate-50/70 relative shadow-sm';

                // Tombol Hapus (tersedia jika ada lebih dari 1 proyek)
                let btnHapusHtml = '';
                if (currentProjekList.length > 1) {
                    btnHapusHtml = `
                        <button type="button" onclick="hapusBlokProyek(${idx})" 
                                class="text-rose-600 hover:text-rose-800 hover:bg-rose-50 font-bold text-xs px-2.5 py-1 rounded-lg border border-rose-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                                title="Hapus Alokasi Proyek #${idx + 1}">
                            <i class="fas fa-trash-alt text-[10px]"></i>
                            <span>Hapus Alokasi</span>
                        </button>
                    `;
                } else {
                    btnHapusHtml = `<span class="bg-slate-200 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-md">Proyek Utama</span>`;
                }

                // Opsi Dropdown Proyek
                const optionsProjek = DAFTAR_PROJEK.map(p => {
                    const sel = matchResmi && matchResmi === p ? 'selected' : '';
                    return `<option value="${escapeHtml(p)}" ${sel}>${escapeHtml(p)}</option>`;
                }).join('');

                card.innerHTML = `
                    <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
                        <div class="flex items-center gap-2">
                            <span class="w-6 h-6 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                                ${idx + 1}
                            </span>
                            <span class="font-bold text-slate-800 text-sm">Alokasi Proyek #${idx + 1}</span>
                        </div>
                        ${btnHapusHtml}
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-start">
                        <!-- Dropdown Pilihan Proyek -->
                        <div class="md:col-span-12 lg:col-span-3">
                            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">
                                Pilihan Proyek:
                            </label>
                            <select onchange="onPilihDropdownProjek(${idx}, this.value)"
                                    class="form-input-lg font-bold text-slate-900 bg-white cursor-pointer border-2 border-slate-300 focus:border-teal-500">
                                <option value="">-- PILIH PROYEK JAYA KEDHATON --</option>
                                ${optionsProjek}
                                <option value="__CUSTOM__" ${isCustom ? 'selected' : ''}>+ KETIK PROYEK BARU LAINNYA...</option>
                            </select>

                            <!-- Kotak input teks jika memilih proyek kustom/baru -->
                            <div id="wrapperCustomProjek_${idx}" class="mt-2 ${isCustom ? '' : 'hidden'}">
                                <input type="text"
                                       value="${isCustom ? escapeHtml(item.projek) : ''}"
                                       oninput="updateProjekField(${idx}, 'projek', this.value)"
                                       placeholder="Ketik nama proyek baru..."
                                       class="form-input-lg uppercase font-bold text-slate-900 bg-white border-2 border-slate-300 focus:border-teal-500">
                                <span class="text-[10px] text-slate-500 font-medium block mt-1">Nama proyek baru akan tersimpan otomatis</span>
                            </div>
                        </div>

                        <!-- Hari Kerja -->
                        <div class="col-span-6 md:col-span-2 lg:col-span-1">
                            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">
                                Hari:
                            </label>
                            <input type="number" min="0" max="31" step="0.5" value="${item.hari}"
                                   oninput="updateProjekField(${idx}, 'hari', this.value)"
                                   class="form-input-lg form-input-num text-center text-slate-900 font-bold bg-white">
                        </div>

                        <!-- Jam Lembur -->
                        <div class="col-span-6 md:col-span-2 lg:col-span-1">
                            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">
                                Lembur:
                            </label>
                            <input type="number" min="0" step="0.5" value="${item.lembur}"
                                   oninput="updateProjekField(${idx}, 'lembur', this.value)"
                                   class="form-input-lg form-input-num text-center text-slate-900 font-bold bg-white">
                        </div>

                        <!-- Uang Makan -->
                        <div class="col-span-6 md:col-span-3 lg:col-span-2">
                            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">
                                Makan (Rp):
                            </label>
                            <input type="number" min="0" step="5000" value="${item.makan}"
                                   oninput="updateProjekField(${idx}, 'makan', this.value)"
                                   class="form-input-lg form-input-num text-slate-800 font-bold bg-white">
                        </div>

                        <!-- Transport (Opsional) -->
                        <div class="col-span-6 md:col-span-2 lg:col-span-2">
                            <label class="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center justify-between">
                                <span>Transport:</span>
                                <span class="text-[10px] text-teal-600 font-semibold normal-case">opsional</span>
                            </label>
                            <input type="number" min="0" step="5000" value="${item.transport || 0}"
                                   oninput="updateProjekField(${idx}, 'transport', this.value)"
                                   class="form-input-lg form-input-num text-slate-800 font-bold bg-white"
                                   placeholder="0">
                        </div>

                        <!-- Insentif (Opsional) -->
                        <div class="col-span-12 md:col-span-3 lg:col-span-3">
                            <label class="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center justify-between">
                                <span>Insentif (Rp):</span>
                                <span class="text-[10px] text-teal-600 font-semibold normal-case">opsional</span>
                            </label>
                            <input type="number" min="0" step="5000" value="${item.insentif || 0}"
                                   oninput="updateProjekField(${idx}, 'insentif', this.value)"
                                   class="form-input-lg form-input-num text-slate-800 font-bold bg-white"
                                   placeholder="0">
                        </div>
                    </div>

                    <!-- Subtotal baris ini -->
                    <div class="mt-3 pt-2.5 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-xs gap-2">
                        <span class="text-slate-600 font-medium" id="teks-perhitungan-${idx}">
                            ${item.hari} hari @ ${formatRp(upah)}${item.lembur > 0 ? ' + ' + item.lembur + ' jam lembur' : ''}${item.transport > 0 ? ' + Transport ' + formatRp(item.transport) : ''}
                        </span>
                        <div class="font-bold text-slate-800">
                            Subtotal Proyek: <span id="subtotal-projek-${idx}" class="text-emerald-700 font-extrabold text-sm md:text-base">${formatRp(subTotal)}</span>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        function onPilihDropdownProjek(idx, val) {
            const wrapper = document.getElementById('wrapperCustomProjek_' + idx);
            if (val === '__CUSTOM__') {
                if (wrapper) wrapper.classList.remove('hidden');
                currentProjekList[idx].projek = '';
            } else {
                if (wrapper) wrapper.classList.add('hidden');
                currentProjekList[idx].projek = val;
            }
            hitungTotalForm();
        }

        function updateProjekField(idx, key, val) {
            if (key === 'projek') {
                currentProjekList[idx][key] = val.trim();
            } else {
                currentProjekList[idx][key] = parseFloat(val) || 0;
            }
            hitungTotalForm();
        }

        function tambahBlokProyek() {
            currentProjekList.push({
                projek: '',
                hari: 0,
                lembur: 0,
                makan: 0,
                transport: 0,
                insentif: 0
            });
            renderBlokProyek();
            hitungTotalForm();
        }

        function hapusBlokProyek(idx) {
            if (currentProjekList.length <= 1) return;
            currentProjekList.splice(idx, 1);
            renderBlokProyek();
            hitungTotalForm();
        }

        // =========================================================================
        // C. HITUNG TOTAL FORM & LOGIKA TRANSAKSI
        // =========================================================================
        function hitungTotalForm() {
            const upah = parseFloat(document.getElementById('upahPerHari').value) || 0;
            const tarifLembur = upah / 8;
            const elLemburInfo = document.getElementById('labelTarifLemburInfo');
            if (elLemburInfo) {
                elLemburInfo.innerText = 'Lembur: ' + formatRp(tarifLembur) + ' / jam';
            }

            let totalKotor = 0;
            let totalHari = 0;
            let totalLembur = 0;

            currentProjekList.forEach((item, idx) => {
                const subPokok = (Number(item.hari) || 0) * upah;
                const subLembur = (Number(item.lembur) || 0) * tarifLembur;
                const subTotal = subPokok + subLembur + (Number(item.makan) || 0) + (Number(item.transport) || 0) + (Number(item.insentif) || 0);
                totalKotor += subTotal;
                totalHari += Number(item.hari) || 0;
                totalLembur += Number(item.lembur) || 0;

                const elSub = document.getElementById('subtotal-projek-' + idx);
                if (elSub) elSub.innerText = formatRp(subTotal);

                const elHitung = document.getElementById('teks-perhitungan-' + idx);
                if (elHitung) {
                    elHitung.innerText = `${item.hari} hari @ ${formatRp(upah)}${item.lembur > 0 ? ' + ' + item.lembur + ' jam lembur' : ''}${item.transport > 0 ? ' + Transport ' + formatRp(item.transport) : ''}`;
                }
            });

            const kasbon = parseFloat(document.getElementById('formKasbon').value) || 0;
            const sisaDiterima = totalKotor - kasbon;

            // Hitung Transfer & Sisa Cash (Diterima Tunai = Sisa Gaji - Ditransfer)
            const elTransfer = document.getElementById('formTransfer');
            const transfer = elTransfer ? (parseFloat(elTransfer.value) || 0) : 0;
            const cash = Math.max(0, sisaDiterima - transfer);

            document.getElementById('formTotalKotor').innerText = formatRp(totalKotor);
            document.getElementById('formRincianHariLembur').innerText = `${totalHari} Hari Kerja • ${totalLembur} Jam Lembur`;
            
            const elSisa = document.getElementById('formSisaDiterima');
            elSisa.innerText = formatRp(sisaDiterima);
            if (sisaDiterima < 0) {
                elSisa.innerHTML = `${formatRp(sisaDiterima)} <span class="text-xs bg-rose-900 text-rose-200 px-2 py-0.5 rounded font-bold block mt-1">Kasbon Lebih Besar</span>`;
            }

            const elCashDisplay = document.getElementById('formCashDisplay');
            if (elCashDisplay) {
                elCashDisplay.innerText = formatRp(cash);
            }
        }

        function resetFormBaru() {
            editingTrxId = null;
            selectedPekerjaKode = '';
            selectedPekerjaNama = '';
            document.getElementById('inputPekerja').value = '';
            document.getElementById('posisiPekerja').value = '';
            document.getElementById('upahPerHari').value = 0;
            document.getElementById('formKasbon').value = 0;

            const elKasbonKet = document.getElementById('formKasbonKet');
            if (elKasbonKet) elKasbonKet.value = '';

            const elTransfer = document.getElementById('formTransfer');
            if (elTransfer) elTransfer.value = 0;

            const elCashDisplay = document.getElementById('formCashDisplay');
            if (elCashDisplay) elCashDisplay.innerText = formatRp(0);

            currentProjekList = [
                { projek: '', hari: 0, lembur: 0, makan: 0, transport: 0, insentif: 0 }
            ];
            renderBlokProyek();
            hitungTotalForm();

            const infoPekerja = document.getElementById('infoPekerjaTerpilih');
            if (infoPekerja) infoPekerja.classList.add('hidden');

            const btnClear = document.getElementById('btnClearPekerja');
            if (btnClear) btnClear.style.display = 'none';

            const labelMode = document.getElementById('labelModeForm');
            if (labelMode) labelMode.innerText = 'Input Transaksi Baru';

            const labelStatus = document.getElementById('labelStatusEdit');
            if (labelStatus) labelStatus.innerText = '';

            tutupDropdownPekerja();
            document.getElementById('inputPekerja').focus();
        }

        // =========================================================================
        // D. SIMPAN & RENDER DAFTAR TRANSAKSI
        // =========================================================================
        function simpanTransaksi(langsungCetak) {
            const inputVal = document.getElementById('inputPekerja').value.trim();
            if (!inputVal) {
                alert('Silakan pilih atau ketik data pekerja terlebih dahulu!');
                document.getElementById('inputPekerja').focus();
                return;
            }

            // Validasi kelengkapan proyek
            for (let i = 0; i < currentProjekList.length; i++) {
                if (!currentProjekList[i].projek || currentProjekList[i].projek.trim() === '') {
                    alert(`Silakan pilih proyek pada Alokasi Proyek #${i + 1}!`);
                    return;
                }
            }

            let kode = selectedPekerjaKode;
            let nama = selectedPekerjaNama || inputVal;

            // Jika user mengetik langsung tanpa memilih dari list, coba ekstrak format "(KODE) NAMA"
            const matchReg = inputVal.match(/^\(([^)]+)\)\s*(.*)$/);
            if (matchReg) {
                kode = matchReg[1].trim();
                nama = matchReg[2].trim();
            } else if (!kode) {
                const matchP = DAFTAR_PEKERJA.find(p => p.k.toUpperCase() === inputVal.toUpperCase() || p.n.toUpperCase() === inputVal.toUpperCase());
                if (matchP) {
                    kode = matchP.k;
                    nama = matchP.n;
                }
            }

            const posisi = document.getElementById('posisiPekerja').value;
            const upahPerHari = parseFloat(document.getElementById('upahPerHari').value) || 0;
            const kasbon = parseFloat(document.getElementById('formKasbon').value) || 0;
            const kasbonKet = (document.getElementById('formKasbonKet') ? document.getElementById('formKasbonKet').value : '').trim();
            const transfer = document.getElementById('formTransfer') ? (parseFloat(document.getElementById('formTransfer').value) || 0) : 0;

            // Validasi proyek & hitung total kotor
            const tarifLembur = upahPerHari / 8;
            let totKotor = 0;
            const projekList = currentProjekList.map(p => {
                const subPokok = (Number(p.hari) || 0) * upahPerHari;
                const subLembur = (Number(p.lembur) || 0) * tarifLembur;
                const makan = Number(p.makan) || 0;
                const transport = Number(p.transport) || 0;
                const insentif = Number(p.insentif) || 0;
                totKotor += (subPokok + subLembur + makan + transport + insentif);
                return {
                    projek: (p.projek || 'PROYEK').trim(),
                    hari: Number(p.hari) || 0,
                    lembur: Number(p.lembur) || 0,
                    makan: makan,
                    transport: transport,
                    insentif: insentif
                };
            });

            const sisaDiterima = totKotor - kasbon;
            const cash = Math.max(0, sisaDiterima - transfer);

            const tglMulai = document.getElementById('tglMulai').value;
            const tglSelesai = document.getElementById('tglSelesai').value;
            const labelPeriode = (document.getElementById('labelPeriodeAktif') ? document.getElementById('labelPeriodeAktif').innerText : '').trim();

            let idTrx = editingTrxId || Date.now();
            let idxAda = -1;

            if (editingTrxId) {
                // Sedang mengedit transaksi yang dipilih
                idxAda = transaksiList.findIndex(t => t.id === editingTrxId);
            } else {
                // Transaksi baru: cegah menimpa riwayat masa lalu
                // Hanya update jika pekerja yang SAMA di rentang periode tanggal yang SAMA
                idxAda = transaksiList.findIndex(t => {
                    const periodeSama = t.tglMulai === tglMulai && t.tglSelesai === tglSelesai;
                    const pekerjaSama = (t.kode && kode && t.kode === kode) || (t.nama && nama && t.nama.toUpperCase() === nama.toUpperCase());
                    return periodeSama && pekerjaSama;
                });
            }

            const trxData = {
                id: idTrx,
                kode: kode,
                nama: nama,
                posisi: posisi,
                upahPerHari: upahPerHari,
                tglMulai: tglMulai,
                tglSelesai: tglSelesai,
                periodeTeks: labelPeriode,
                projekList: projekList,
                kasbon: kasbon,
                kasbonKet: kasbonKet,
                transfer: transfer,
                cash: cash,
                updatedAt: new Date().toISOString()
            };

            if (idxAda >= 0) {
                transaksiList[idxAda] = trxData;
            } else {
                transaksiList.unshift(trxData);
            }

            simpanKeStorage();
            renderDaftarTransaksi();

            if (langsungCetak) {
                bukaSlipById(idTrx);
            } else {
                alert(`Data transaksi upah untuk ${nama} (${kode || 'Pekerja'}) berhasil disimpan!`);
            }

            // Kembalikan ke mode baru
            editingTrxId = null;
            const labelMode = document.getElementById('labelModeForm');
            if (labelMode) labelMode.innerText = 'Input Transaksi Baru';
            const labelStatus = document.getElementById('labelStatusEdit');
            if (labelStatus) labelStatus.innerText = '';
        }

        function renderDaftarTransaksi() {
            const tbody = document.getElementById('tbodyDaftarTransaksi');
            const keyword = (document.getElementById('filterTabelInput').value || '').trim().toUpperCase();
            tbody.innerHTML = '';

            let grandKotor = 0;
            let grandKasbon = 0;
            let grandBersih = 0;
            let countPekerja = 0;
            let nomor = 1;

            transaksiList.forEach(trx => {
                const teksCari = (trx.kode + ' ' + trx.nama + ' ' + trx.posisi + ' ' + (trx.periodeTeks || '') + ' ' + trx.projekList.map(p => p.projek).join(' ')).toUpperCase();
                if (keyword && !teksCari.includes(keyword)) {
                    return;
                }

                countPekerja++;
                const tarifLembur = (trx.upahPerHari || 0) / 8;
                let totKotor = 0;
                let totHari = 0;
                let ringkasanProjek = [];

                trx.projekList.forEach(p => {
                    const subPokok = (Number(p.hari) || 0) * trx.upahPerHari;
                    const subLembur = (Number(p.lembur) || 0) * tarifLembur;
                    const sub = subPokok + subLembur + (Number(p.makan) || 0) + (Number(p.transport) || 0) + (Number(p.insentif) || 0);
                    totKotor += sub;
                    totHari += Number(p.hari) || 0;
                    let extraInfo = [];
                    if (p.transport > 0) extraInfo.push(`trsp: ${formatRp(p.transport)}`);
                    if (p.insentif > 0) extraInfo.push(`instf: ${formatRp(p.insentif)}`);
                    const extraStr = extraInfo.length > 0 ? ` (${extraInfo.join(', ')})` : '';
                    ringkasanProjek.push(`<span class="font-extrabold text-slate-800">${escapeHtml(p.projek || 'PROYEK')}</span>: ${p.hari} hari${p.lembur > 0 ? ', ' + p.lembur + 'j lembur' : ''}${extraStr}`);
                });

                const bersih = totKotor - (trx.kasbon || 0);
                const tfNominal = trx.transfer || 0;
                const cashNominal = trx.cash !== undefined ? trx.cash : Math.max(0, bersih - tfNominal);

                grandKotor += totKotor;
                grandKasbon += (trx.kasbon || 0);
                grandBersih += bersih;

                const tr = document.createElement('tr');
                tr.className = 'hover:bg-slate-50 transition-colors';
                tr.innerHTML = `
                    <td class="p-3.5 text-center font-bold text-slate-400 bg-slate-50/50">${nomor++}</td>
                    <td class="p-3.5">
                        <div class="font-extrabold text-slate-900 text-sm">
                            ${trx.kode ? `<span class="inline-block bg-slate-800 text-white font-mono text-[11px] px-2 py-0.5 rounded-md mr-1.5 font-bold">${escapeHtml(trx.kode)}</span>` : ''}
                            ${escapeHtml(trx.nama)}
                        </div>
                        ${trx.periodeTeks ? `<div class="text-[10px] text-teal-800 font-bold bg-teal-50 border border-teal-200/60 px-1.5 py-0.5 rounded-md inline-flex items-center gap-1 mt-1"><i class="far fa-calendar-alt text-[9px]"></i> ${escapeHtml(trx.periodeTeks)}</div>` : ''}
                    </td>
                    <td class="p-3.5">
                        <span class="inline-block bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-md uppercase">
                            ${escapeHtml(trx.posisi)}
                        </span>
                    </td>
                    <td class="p-3.5 text-xs text-slate-700 leading-relaxed">
                        ${ringkasanProjek.join('<br>')}
                    </td>
                    <td class="p-3.5 text-right font-extrabold text-slate-900 text-sm">
                        ${formatRp(totKotor)}
                    </td>
                    <td class="p-3.5 text-right font-bold text-rose-700 bg-rose-50/50 text-sm">
                        ${trx.kasbon > 0 ? `<div>${formatRp(trx.kasbon)}</div>${trx.kasbonKet ? `<div class="text-[10px] text-slate-500 italic max-w-[120px] truncate ml-auto" title="${escapeHtml(trx.kasbonKet)}">${escapeHtml(trx.kasbonKet)}</div>` : ''}` : '-'}
                    </td>
                    <td class="p-3.5 text-right font-black text-emerald-950 bg-emerald-50 text-base">
                        ${formatRp(bersih)}
                        <div class="text-[10px] font-semibold text-slate-500 mt-0.5">
                            <span class="text-sky-700 font-bold">Tf:</span> ${formatRp(tfNominal)} &bull; <span class="text-amber-700 font-bold">Cash:</span> ${formatRp(cashNominal)}
                        </div>
                    </td>
                    <td class="p-3.5 text-center no-print">
                        <div class="inline-flex items-center gap-1.5">
                            <button type="button" onclick="bukaSlipById('${trx.id}')" 
                                    class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-xs cursor-pointer inline-flex items-center gap-1.5 transition-colors"
                                    title="Cetak Dokumen Slip Gaji Resmi">
                                <i class="fas fa-print"></i> Cetak Slip
                            </button>
                            <button type="button" onclick="editTrxKeForm('${trx.id}')" 
                                    class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold p-1.5 rounded-lg text-xs border border-slate-300 cursor-pointer transition-colors"
                                    title="Edit Data Transaksi">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button type="button" onclick="hapusTrx('${trx.id}')" 
                                     class="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold p-1.5 rounded-lg text-xs border border-rose-200 cursor-pointer transition-colors"
                                     title="Hapus Data Transaksi">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            document.getElementById('totalJumlahPekerja').innerText = countPekerja;
            document.getElementById('totalGrandKotor').innerText = formatRp(grandKotor);
            document.getElementById('totalGrandKasbon').innerText = formatRp(grandKasbon);
            document.getElementById('totalGrandBersih').innerText = formatRp(grandBersih);
        }

        function editTrxKeForm(idTrx) {
            const trx = transaksiList.find(t => t.id === idTrx);
            if (!trx) return;

            editingTrxId = idTrx;
            selectedPekerjaKode = trx.kode || '';
            selectedPekerjaNama = trx.nama || '';

            document.getElementById('inputPekerja').value = trx.kode ? `(${trx.kode}) ${trx.nama}` : trx.nama;
            document.getElementById('posisiPekerja').value = trx.posisi;
            document.getElementById('upahPerHari').value = trx.upahPerHari;
            document.getElementById('formKasbon').value = trx.kasbon || 0;

            const elKasbonKet = document.getElementById('formKasbonKet');
            if (elKasbonKet) elKasbonKet.value = trx.kasbonKet || '';

            const elTransfer = document.getElementById('formTransfer');
            if (elTransfer) elTransfer.value = trx.transfer || 0;

            if (trx.tglMulai && trx.tglSelesai) {
                document.getElementById('tglMulai').value = trx.tglMulai;
                document.getElementById('tglSelesai').value = trx.tglSelesai;
                updatePeriodeKalender();
            }

            currentProjekList = JSON.parse(JSON.stringify(trx.projekList)).map(p => ({
                projek: p.projek || '',
                hari: Number(p.hari) || 0,
                lembur: Number(p.lembur) || 0,
                makan: Number(p.makan) || 0,
                transport: Number(p.transport) || 0,
                insentif: Number(p.insentif) || 0
            }));
            renderBlokProyek();
            hitungTotalForm();

            const infoPekerja = document.getElementById('infoPekerjaTerpilih');
            if (infoPekerja) infoPekerja.classList.remove('hidden');

            const btnClear = document.getElementById('btnClearPekerja');
            if (btnClear) btnClear.style.display = 'inline-block';

            const labelMode = document.getElementById('labelModeForm');
            if (labelMode) labelMode.innerText = `Mengedit Transaksi: ${trx.nama}`;

            const labelStatus = document.getElementById('labelStatusEdit');
            if (labelStatus) labelStatus.innerText = `*Sedang mengedit data ${trx.nama}. Klik Simpan untuk memperbarui.`;

            document.getElementById('areaInputForm').scrollIntoView({ behavior: 'smooth' });
        }

        function hapusTrx(idTrx) {
            const trx = transaksiList.find(t => t.id === idTrx);
            if (!trx) return;
            if (confirm(`Yakin ingin menghapus transaksi upah ${trx.nama}?`)) {
                transaksiList = transaksiList.filter(t => t.id !== idTrx);
                simpanKeStorage();
                renderDaftarTransaksi();
            }
        }

        // =========================================================================
        // EKSPOR REKAP TRANSAKSI KE MICROSOFT EXCEL (.XLS / SPREADSHEET RESMI)
        // =========================================================================
        function eksporRekapExcel() {
            if (!transaksiList || transaksiList.length === 0) {
                alert('Belum ada data transaksi upah untuk diekspor!');
                return;
            }

            const labelPeriode = (document.getElementById('labelPeriodeAktif') ? document.getElementById('labelPeriodeAktif').innerText : 'Periode').trim();
            const tglCetak = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

            let no = 1;
            let grandKotor = 0;
            let grandKasbon = 0;
            let grandBersih = 0;
            let grandTf = 0;
            let grandCash = 0;
            let grandHari = 0;
            let grandLembur = 0;
            let rowsHtml = '';

            transaksiList.forEach(trx => {
                const tarifLembur = Math.round((trx.upahPerHari || 0) / 8);
                let totKotor = 0;
                let totHari = 0;
                let totLembur = 0;
                let totMakan = 0;
                let totTransport = 0;
                let totInsentif = 0;
                const rincianStr = [];

                (trx.projekList || []).forEach(p => {
                    const h = Number(p.hari) || 0;
                    const l = Number(p.lembur) || 0;
                    const m = Number(p.makan) || 0;
                    const t = Number(p.transport) || 0;
                    const ins = Number(p.insentif) || 0;
                    const sub = (h * (trx.upahPerHari || 0)) + (l * tarifLembur) + m + t + ins;
                    totKotor += sub;
                    totHari += h;
                    totLembur += l;
                    totMakan += m;
                    totTransport += t;
                    totInsentif += ins;
                    rincianStr.push(`${p.projek || 'PROYEK'} (${h} hr, ${l} jam${t > 0 ? ', trsp ' + t : ''})`);
                });

                const kasbon = Number(trx.kasbon) || 0;
                const bersih = totKotor - kasbon;
                const tf = Number(trx.transfer) || 0;
                const cash = trx.cash !== undefined ? Number(trx.cash) : Math.max(0, bersih - tf);

                grandKotor += totKotor;
                grandKasbon += kasbon;
                grandBersih += bersih;
                grandTf += tf;
                grandCash += cash;
                grandHari += totHari;
                grandLembur += totLembur;

                rowsHtml += `
                    <tr>
                        <td style="text-align:center; vertical-align:middle;">${no++}</td>
                        <td style="text-align:center; vertical-align:middle; mso-number-format:'\\@';">${escapeHtml(trx.kode || '-')}</td>
                        <td style="font-weight:bold; vertical-align:middle;">${escapeHtml(trx.nama || '')}</td>
                        <td style="text-align:center; vertical-align:middle;">${escapeHtml(trx.posisi || '-')}</td>
                        <td style="vertical-align:middle;">${escapeHtml(rincianStr.join('; '))}</td>
                        <td style="text-align:center; vertical-align:middle; mso-number-format:'#,##0';">${totHari}</td>
                        <td style="text-align:center; vertical-align:middle; mso-number-format:'#,##0';">${totLembur}</td>
                        <td style="text-align:right; vertical-align:middle; mso-number-format:'#,##0';">${trx.upahPerHari || 0}</td>
                        <td style="text-align:right; vertical-align:middle; mso-number-format:'#,##0';">${totMakan}</td>
                        <td style="text-align:right; vertical-align:middle; mso-number-format:'#,##0';">${totTransport + totInsentif}</td>
                        <td style="text-align:right; font-weight:bold; vertical-align:middle; mso-number-format:'#,##0';">${totKotor}</td>
                        <td style="text-align:right; color:#b91c1c; font-weight:bold; vertical-align:middle; mso-number-format:'#,##0';">${kasbon}</td>
                        <td style="vertical-align:middle;">${escapeHtml(trx.kasbonKet || '-')}</td>
                        <td style="text-align:right; font-weight:bold; background-color:#ecfdf5; color:#065f46; vertical-align:middle; mso-number-format:'#,##0';">${bersih}</td>
                        <td style="text-align:right; vertical-align:middle; mso-number-format:'#,##0';">${tf}</td>
                        <td style="text-align:right; font-weight:bold; vertical-align:middle; mso-number-format:'#,##0';">${cash}</td>
                        <td style="text-align:center; vertical-align:middle;">${escapeHtml(trx.periodeTeks || labelPeriode)}</td>
                    </tr>
                `;
            });

            // Template XML/HTML Excel yang valid dan diformat rapi
            const excelTemplate = `
                <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                    <!--[if gte mso 9]>
                    <xml>
                        <x:ExcelWorkbook>
                            <x:ExcelWorksheets>
                                <x:ExcelWorksheet>
                                    <x:Name>Rekap Upah</x:Name>
                                    <x:WorksheetOptions>
                                        <x:DisplayGridlines/>
                                    </x:WorksheetOptions>
                                </x:ExcelWorksheet>
                            </x:ExcelWorksheets>
                        </x:ExcelWorkbook>
                    </xml>
                    <![endif]-->
                    <style>
                        table { border-collapse: collapse; width: 100%; font-family: Calibri, Arial, sans-serif; font-size: 10pt; }
                        th { background-color: #0f172a; color: #ffffff; font-weight: bold; border: 1px solid #334155; padding: 7px 10px; text-align: center; }
                        td { border: 1px solid #cbd5e1; padding: 5px 8px; }
                        .kop-title { font-size: 13pt; font-weight: bold; color: #0f172a; }
                        .kop-sub { font-size: 10pt; color: #475569; font-weight: bold; }
                        .total-row td { background-color: #e2e8f0; font-weight: bold; border-top: 2px solid #0f172a; border-bottom: 2px solid #0f172a; }
                    </style>
                </head>
                <body>
                    <table>
                        <tr>
                            <td colspan="17" class="kop-title">PT. JAYA KEDHATON — LAPORAN REKAPITULASI PEMBAYARAN UPAH</td>
                        </tr>
                        <tr>
                            <td colspan="17" class="kop-sub">Periode: ${escapeHtml(labelPeriode)} | Tanggal Ekspor: ${tglCetak} | Total: ${transaksiList.length} Pekerja</td>
                        </tr>
                        <tr><td colspan="17"></td></tr>
                        <thead>
                            <tr>
                                <th>NO</th>
                                <th>KODE</th>
                                <th>NAMA PEKERJA</th>
                                <th>JABATAN</th>
                                <th>RINCIAN ALOKASI PROYEK &amp; HARI</th>
                                <th>TOTAL HARI</th>
                                <th>TOTAL LEMBUR (JAM)</th>
                                <th>UPAH POKOK/HARI (RP)</th>
                                <th>UANG MAKAN (RP)</th>
                                <th>TRANSPORT/INSENTIF (RP)</th>
                                <th>TOTAL UPAH KOTOR (RP)</th>
                                <th>POTONGAN KASBON (RP)</th>
                                <th>KETERANGAN KASBON</th>
                                <th>SISA DITERIMA BERSIH (RP)</th>
                                <th>DITRANSFER (RP)</th>
                                <th>DITERIMA CASH (RP)</th>
                                <th>PERIODE</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                        <tfoot>
                            <tr class="total-row">
                                <td colspan="5" style="text-align:right; font-weight:bold;">TOTAL KESELURUHAN (${transaksiList.length} PEKERJA):</td>
                                <td style="text-align:center; font-weight:bold; mso-number-format:'#,##0';">${grandHari}</td>
                                <td style="text-align:center; font-weight:bold; mso-number-format:'#,##0';">${grandLembur}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td style="text-align:right; font-weight:bold; mso-number-format:'#,##0';">${grandKotor}</td>
                                <td style="text-align:right; font-weight:bold; color:#b91c1c; mso-number-format:'#,##0';">${grandKasbon}</td>
                                <td></td>
                                <td style="text-align:right; font-weight:bold; background-color:#d1fae5; color:#064e3b; mso-number-format:'#,##0';">${grandBersih}</td>
                                <td style="text-align:right; font-weight:bold; mso-number-format:'#,##0';">${grandTf}</td>
                                <td style="text-align:right; font-weight:bold; mso-number-format:'#,##0';">${grandCash}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </body>
                </html>
            `;

            // Download sebagai format .xls (MIME ms-excel dengan BOM UTF-8)
            const blob = new Blob(['\uFEFF' + excelTemplate], { type: 'application/vnd.ms-excel;charset=utf-8;' });
            const safePeriode = labelPeriode.replace(/[^a-zA-Z0-9]/g, '_');
            const filename = `Rekap_Upah_JayaKedhaton_${safePeriode}.xls`;

            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, filename);
                return;
            }

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                if (a.parentNode) a.parentNode.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 3000);
        }

        // =========================================================================
        // CETAK REKAPITULASI DOKUMEN RESMI (A4 LANDSCAPE)
        // =========================================================================
        function cetakRekapitulasi() {
            // Pastikan modal slip tertutup agar tidak tumpang tindih
            tutupSlip();

            const tglStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            const labelPeriode = document.getElementById('labelPeriodeAktif') ? document.getElementById('labelPeriodeAktif').innerText.trim() : '';

            const elTeks = document.getElementById('printRekapPeriodeTeks');
            if (elTeks) elTeks.innerText = 'Periode: ' + (labelPeriode || '-');

            const elTgl = document.getElementById('printRekapTglCetak');
            if (elTgl) elTgl.innerText = 'Dicetak pada: ' + tglStr + ' ' + new Date().toLocaleTimeString('id-ID') + ' WIB';

            const elTglFooter = document.getElementById('printFooterTglRekap');
            if (elTglFooter) elTglFooter.innerText = tglStr;

            window.print();
        }

        // =========================================================================
        // E. CETAK SLIP GAJI MULTI-PROJEK (2 RANGKAP: SUSUN ATAS & BAWAH A4 LANDSCAPE)
        // =========================================================================
        function renderSlipLembar(trx, tipe, tglCetakLengkap, tglCetakSingkat) {
            const tarifLembur = Math.round((trx.upahPerHari || 0) / 8);
            const labelPeriode = document.getElementById('labelPeriodeAktif') ? document.getElementById('labelPeriodeAktif').innerText.trim() : '';
            const periodeTeks = trx.periodeTeks || labelPeriode || '-';
            const namaDisplay = trx.kode ? `(${trx.kode}) ${trx.nama}` : trx.nama;

            let grandKotor = 0;
            let rowsProyekHtml = '';

            (trx.projekList || []).forEach(p => {
                const hari = Number(p.hari) || 0;
                const lembur = Number(p.lembur) || 0;
                const makan = Number(p.makan) || 0;
                const transport = Number(p.transport) || 0;
                const insentif = Number(p.insentif) || 0;
                const subPokok = hari * (trx.upahPerHari || 0);
                const subLembur = lembur * tarifLembur;
                const sub = subPokok + subLembur + makan + transport + insentif;
                grandKotor += sub;

                const trpIns = transport + insentif;

                rowsProyekHtml += `
                    <tr class="hover:bg-slate-50">
                        <td class="p-1 font-bold text-slate-800 text-[8.5px] max-w-[140px] truncate" title="${escapeHtml(p.projek || 'PROYEK')}">${escapeHtml(p.projek || 'PROYEK')}</td>
                        <td class="p-1 text-center font-semibold text-[8.5px]">${hari} hr</td>
                        <td class="p-1 text-right text-[8.5px]">${formatRp(trx.upahPerHari || 0)}</td>
                        <td class="p-1 text-center font-semibold text-[8.5px]">${lembur > 0 ? `${lembur}j (${formatRp(tarifLembur)}/j)` : '-'}</td>
                        <td class="p-1 text-right text-[8.5px]">${makan > 0 ? formatRp(makan) : '-'}</td>
                        <td class="p-1 text-right text-[8.5px] font-medium text-slate-700">${trpIns > 0 ? formatRp(trpIns) : '-'}</td>
                        <td class="p-1 text-right font-black text-slate-900 text-[8.5px]">${formatRp(sub)}</td>
                    </tr>
                `;
            });

            const kasbon = Number(trx.kasbon) || 0;
            const bersih = grandKotor - kasbon;
            const transfer = Number(trx.transfer) || 0;
            const cash = trx.cash !== undefined ? Number(trx.cash) : Math.max(0, bersih - transfer);

            const kasbonKetHtml = trx.kasbonKet ? `
                <div class="text-[7.5px] text-slate-600 italic leading-tight pl-1.5 border-l-2 border-rose-400 mt-0.5 bg-rose-50/60 py-0.5 rounded-r" title="${escapeHtml(trx.kasbonKet)}">
                    <span class="font-semibold text-rose-800 not-italic">Ket:</span> ${escapeHtml(trx.kasbonKet)}
                </div>
            ` : '';

            const kasbonRowHtml = kasbon > 0 ? `
                <div class="space-y-0.5">
                    <div class="flex justify-between items-center text-rose-700 font-bold text-[8.5px]">
                        <span>Potongan Kasbon:</span>
                        <span class="font-mono shrink-0">- ${formatRp(kasbon)}</span>
                    </div>
                    ${kasbonKetHtml}
                </div>
            ` : `
                <div class="flex justify-between items-center text-slate-400 text-[8px]">
                    <span>Potongan Kasbon:</span>
                    <span>-</span>
                </div>
            `;

            return `
                <!-- KOP SURAT & IDENTITAS (BARIS ATAS LEBAR) -->
                <div class="border-b-2 border-slate-800 pb-1 flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2 shrink-0">
                        <img src="images/logo.png" alt="Logo" class="w-7 h-7 object-contain">
                        <div class="text-left">
                            <h4 class="text-xs font-black text-slate-900 tracking-wider uppercase leading-none">PT. JAYA KEDHATON</h4>
                            <p class="text-[7.5px] text-slate-600 uppercase font-bold tracking-tight">Design Build • General Contractor • Interior</p>
                            <p class="text-[7px] text-slate-500 leading-none">Jl. AW. Syahranie No. 36 A Samarinda</p>
                        </div>
                    </div>

                    <!-- Info Pekerja & Periode Horizontal di Tengah -->
                    <div class="flex items-center gap-4 bg-slate-50 border border-slate-200 px-3 py-0.5 rounded text-[8.5px]">
                        <div>
                            <span class="text-slate-400 text-[7px] uppercase font-bold block leading-none">Pekerja:</span>
                            <span class="font-black text-slate-900 text-[10px] leading-tight">${escapeHtml(namaDisplay)}</span>
                        </div>
                        <div>
                            <span class="text-slate-400 text-[7px] uppercase font-bold block leading-none">Jabatan:</span>
                            <span class="font-bold text-slate-800 text-[9.5px] leading-tight">${escapeHtml(trx.posisi || '-')}</span>
                        </div>
                        <div>
                            <span class="text-slate-400 text-[7px] uppercase font-bold block leading-none">Periode Upah:</span>
                            <span class="font-bold text-teal-800 text-[9.5px] leading-tight">${escapeHtml(periodeTeks)}</span>
                        </div>
                    </div>

                    <!-- Badge Tipe Lembar di Kanan -->
                    <div class="text-right shrink-0">
                        <span class="inline-block ${tipe.badgeClass} font-black text-[8px] uppercase px-2.5 py-0.5 rounded tracking-wider border border-slate-800">
                            ${tipe.label}
                        </span>
                        <p class="text-[7px] text-slate-500 font-semibold mt-0.5">${tipe.sub}</p>
                    </div>
                </div>

                <!-- RINCIAN PROYEK (LEBAR LELUASA) -->
                <div class="py-1 flex-1 overflow-hidden">
                    <table class="w-full text-[8.5px] border border-slate-300">
                        <thead class="bg-slate-100 text-slate-700 uppercase font-black text-[7.5px] border-b border-slate-300">
                            <tr>
                                <th class="p-1 text-left">Alokasi Proyek</th>
                                <th class="p-1 text-center">Hari Kerja</th>
                                <th class="p-1 text-right">Tarif Upah/Hari</th>
                                <th class="p-1 text-center">Jam Lembur</th>
                                <th class="p-1 text-right">Uang Makan</th>
                                <th class="p-1 text-right">Transport / Insentif</th>
                                <th class="p-1 text-right">Subtotal Upah</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-200">
                            ${rowsProyekHtml}
                        </tbody>
                    </table>
                </div>

                <!-- BARIS BAWAH: FINANSIAL & TANDA TANGAN SEJAJAR -->
                <div class="pt-1 border-t-2 border-slate-800 text-[9px] flex items-end justify-between gap-3">
                    <!-- 1. Penyerahan Upah (Tf & Cash) -->
                    <div class="w-44 space-y-0.5 text-[8px] shrink-0">
                        <div class="bg-sky-50 border border-sky-200 px-2 py-0.5 rounded flex justify-between items-center">
                            <span class="font-bold text-sky-800">Ditransfer:</span>
                            <span class="font-extrabold text-sky-950 font-mono">${formatRp(transfer)}</span>
                        </div>
                        <div class="bg-amber-50 border border-amber-200 px-2 py-0.5 rounded flex justify-between items-center">
                            <span class="font-bold text-amber-800">Tunai (Cash):</span>
                            <span class="font-black text-amber-950 font-mono">${formatRp(cash)}</span>
                        </div>
                    </div>

                    <!-- 2. Rincian Kotor & Kasbon -->
                    <div class="w-48 space-y-0.5 text-[8px] shrink-0">
                        <div class="flex justify-between font-bold text-slate-700">
                            <span>Total Upah Kotor:</span>
                            <span class="font-bold text-slate-900">${formatRp(grandKotor)}</span>
                        </div>
                        ${kasbonRowHtml}
                    </div>

                    <!-- 3. Sisa Upah Diterima Bersih -->
                    <div class="bg-emerald-50 border border-emerald-300 px-3 py-1 rounded text-right shrink-0">
                        <span class="text-[7.5px] uppercase font-bold text-emerald-800 block leading-tight">Sisa Upah Diterima (Bersih):</span>
                        <span class="text-xs font-black text-emerald-950 font-mono leading-tight">${formatRp(bersih)}</span>
                    </div>

                    <!-- 4. Tanda Tangan Penerima -->
                    <div class="text-center w-40 shrink-0">
                        <p class="text-[7px] text-slate-500 leading-tight">Samarinda, ${tglCetakSingkat}</p>
                        <p class="text-[7.5px] font-semibold text-slate-600 mb-5 leading-tight">Tanda Tangan Penerima,</p>
                        <p class="font-bold underline text-[9px] text-slate-900 leading-tight">${escapeHtml(trx.nama)}</p>
                    </div>
                </div>
            `;
        }

        function bukaSlipById(idTrx) {
            try {
                console.log('[SLIP] Membuka slip untuk ID:', idTrx);
                
                // Cari transaksi dengan pencocokan string untuk mencegah mismatch tipe data (number vs string)
                let trx = transaksiList.find(t => String(t.id) === String(idTrx));
                
                // Fallback jika tidak ditemukan di memori lokal, coba cari di window.SERVER_DATA
                if (!trx && typeof window !== 'undefined' && window.SERVER_DATA && Array.isArray(window.SERVER_DATA.transaksiList)) {
                    trx = window.SERVER_DATA.transaksiList.find(t => String(t.id) === String(idTrx));
                }

                if (!trx) {
                    console.warn('[SLIP] Data transaksi tidak ditemukan untuk ID:', idTrx);
                    alert('Data transaksi tidak ditemukan (ID: ' + idTrx + ')');
                    return;
                }

                const tglCetakLengkap = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                const tglCetakSingkat = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

                const elPenerima = document.getElementById('slipLembarPenerima');
                const elKeuangan = document.getElementById('slipLembarKeuangan');

                if (elPenerima) {
                    elPenerima.innerHTML = renderSlipLembar(trx, {
                        label: 'UNTUK PENERIMA',
                        sub: 'Lembar Pekerja / Karyawan',
                        badgeClass: 'bg-emerald-900 text-white'
                    }, tglCetakLengkap, tglCetakSingkat);
                }

                if (elKeuangan) {
                    elKeuangan.innerHTML = renderSlipLembar(trx, {
                        label: 'BUKTI BUAT STAF KEUANGAN',
                        sub: 'Lembar Arsip Dokumen Keuangan',
                        badgeClass: 'bg-slate-900 text-white'
                    }, tglCetakLengkap, tglCetakSingkat);
                }

                // Kompatibilitas mundur jika browser memuat template DOM lama
                const elOldNama = document.getElementById('slipNama');
                if (elOldNama) elOldNama.innerText = trx.kode ? `(${trx.kode}) ${trx.nama}` : trx.nama;
                const elOldPosisi = document.getElementById('slipPosisi');
                if (elOldPosisi) elOldPosisi.innerText = trx.posisi || '-';
                const elOldPeriode = document.getElementById('slipPeriodeDisplay');
                if (elOldPeriode) elOldPeriode.innerText = trx.periodeTeks || '-';
                const elOldTtdNama = document.getElementById('slipTtdNama');
                if (elOldTtdNama) elOldTtdNama.innerText = trx.nama;

                // Pastikan @page diatur ke landscape saat modal slip dibuka
                let dynamicPrintStyle = document.getElementById('dynamicPrintPageStyle');
                if (!dynamicPrintStyle) {
                    dynamicPrintStyle = document.createElement('style');
                    dynamicPrintStyle.id = 'dynamicPrintPageStyle';
                    document.head.appendChild(dynamicPrintStyle);
                }
                dynamicPrintStyle.innerHTML = '@page { size: A4 landscape; margin: 4mm 6mm; }';

                const modal = document.getElementById('modalSlip');
                if (modal) {
                    modal.classList.remove('hidden');
                }
                document.body.classList.add('slip-open');
            } catch (err) {
                console.error('[SLIP ERROR] Terjadi kesalahan saat membuka slip:', err);
                alert('Gagal membuka slip: ' + err.message);
            }
        }

        function tutupSlip() {
            document.getElementById('modalSlip').classList.add('hidden');
            document.body.classList.remove('slip-open');
        }

        // =========================================================================
        // F. KALENDER PERIODE & UTILITIES
        // =========================================================================
        function updatePeriodeKalender() {
            const d1 = document.getElementById('tglMulai').value;
            const d2 = document.getElementById('tglSelesai').value;
            if (!d1 || !d2) return;

            const formatTgl = (tglStr) => {
                const parts = tglStr.split('-');
                if (parts.length !== 3) return tglStr;
                const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                return parseInt(parts[2], 10) + ' ' + bulan[parseInt(parts[1], 10) - 1] + ' ' + parts[0];
            };

            const teksHasil = `${formatTgl(d1)} - ${formatTgl(d2)}`;
            document.getElementById('labelPeriodeAktif').innerText = teksHasil;
            try {
                localStorage.setItem('jaya_periode_kalender_v3', JSON.stringify({ d1, d2, teks: teksHasil }));
            } catch (_) {}
        }

        try {
            const savedCal = localStorage.getItem('jaya_periode_kalender_v3');
            if (savedCal) {
                const parsed = JSON.parse(savedCal);
                if (parsed.d1) document.getElementById('tglMulai').value = parsed.d1;
                if (parsed.d2) document.getElementById('tglSelesai').value = parsed.d2;
                if (parsed.teks) document.getElementById('labelPeriodeAktif').innerText = parsed.teks;
            }
        } catch (_) {}

        function toggleSidebar() {
            const sidebar = document.getElementById('sidebarNav');
            const wrapper = document.getElementById('mainContentWrapper');
            const btn = document.getElementById('btnToggleMenu');
            const labelBtn = document.getElementById('labelTombolMenu');
            if (!sidebar || !wrapper) return;

            const isTutup = sidebar.classList.contains('-translate-x-full');
            if (isTutup) {
                sidebar.classList.remove('-translate-x-full');
                wrapper.classList.remove('ml-0');
                wrapper.classList.add('ml-64');
                if (labelBtn) labelBtn.innerText = 'Sembunyikan Menu';
                if (btn) {
                    btn.classList.remove('bg-teal-700', 'hover:bg-teal-800');
                    btn.classList.add('bg-slate-800', 'hover:bg-slate-900');
                }
                localStorage.setItem('sidebar_drop_left', 'buka');
            } else {
                sidebar.classList.add('-translate-x-full');
                wrapper.classList.remove('ml-64');
                wrapper.classList.add('ml-0');
                if (labelBtn) labelBtn.innerText = 'Buka Menu Samping';
                if (btn) {
                    btn.classList.remove('bg-slate-800', 'hover:bg-slate-900');
                    btn.classList.add('bg-teal-700', 'hover:bg-teal-800');
                }
                localStorage.setItem('sidebar_drop_left', 'tutup');
            }
        }

        if (localStorage.getItem('sidebar_drop_left') === 'tutup') {
            const sidebar = document.getElementById('sidebarNav');
            const wrapper = document.getElementById('mainContentWrapper');
            const btn = document.getElementById('btnToggleMenu');
            const labelBtn = document.getElementById('labelTombolMenu');
            if (sidebar && wrapper) {
                sidebar.classList.add('-translate-x-full');
                wrapper.classList.remove('ml-64');
                wrapper.classList.add('ml-0');
                if (labelBtn) labelBtn.innerText = 'Buka Menu Samping';
                if (btn) {
                    btn.classList.remove('bg-slate-800', 'hover:bg-slate-900');
                    btn.classList.add('bg-teal-700', 'hover:bg-teal-800');
                }
            }
        }

        function updateJamHeader() {
            const el = document.getElementById('waktuRealtime');
            if (el) {
                const now = new Date();
                el.innerText = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
            }
        }
        setInterval(updateJamHeader, 1000);
        updateJamHeader();

        // Inisialisasi awal halaman (Form Bersih Tanpa Autofill Default)
        renderDaftarTransaksi();
        resetFormBaru();

        // Expose fungsi secara global ke window untuk event handler inline
        if (typeof window !== 'undefined') {
            window.bukaSlipById = bukaSlipById;
            window.tutupSlip = tutupSlip;
            window.simpanTransaksi = simpanTransaksi;
            window.editTrxKeForm = editTrxKeForm;
            window.hapusTrx = hapusTrx;
        }