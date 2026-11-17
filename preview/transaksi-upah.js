        // Data 255 Karyawan & Pekerja Resmi (Termasuk Kode Staff Kantor)
        const DAFTAR_PEKERJA = (typeof window !== 'undefined' && window.SERVER_DATA && window.SERVER_DATA.daftarPekerja && window.SERVER_DATA.daftarPekerja.length > 0)
            ? window.SERVER_DATA.daftarPekerja
            : [{"k": "STAFF-001", "n": "DIMAS ARYA KEDHATON", "p": "STAFF KANTOR"}, {"k": "STAFF-002", "n": "AKMAL ZAIDAN", "p": "STAFF KANTOR"}, {"k": "STAFF-003", "n": "ANOM ARYA", "p": "STAFF KANTOR"}, {"k": "SUDIRO-001", "n": "IMAM MUHAMMAD SUDIRO", "p": "TUKANG"}, {"k": "SUDIRO-002", "n": "SUWITO", "p": "TUKANG"}, {"k": "SUDIRO-003", "n": "ARIS TARWADI", "p": "TUKANG"}, {"k": "SUDIRO-004", "n": "GUNARTO", "p": "TUKANG"}, {"k": "SUDIRO-005", "n": "DAVID BAYU SETIAWAN", "p": "TUKANG"}, {"k": "SUDIRO-006", "n": "ERVA BUDI SANTOSO", "p": "TUKANG"}, {"k": "SUDIRO-007", "n": "SUMADJI", "p": "TUKANG"}, {"k": "SUDIRO-008", "n": "MOH. MUKLIS", "p": "TUKANG"}, {"k": "SUDIRO-009", "n": "SUNAR", "p": "TUKANG"}, {"k": "SUDIRO-010", "n": "NARJUANTO", "p": "TUKANG"}, {"k": "SUDIRO-011", "n": "SURANI", "p": "TUKANG"}, {"k": "SUDIRO-012", "n": "PAULUS SUKAMTO", "p": "TUKANG"}, {"k": "SUDIRO-013", "n": "DONI SETIAWAN", "p": "TUKANG"}, {"k": "SUDIRO-014", "n": "FATQUL ROHMAN", "p": "TUKANG"}, {"k": "KANCIL-025", "n": "ACHMAD FRIADI", "p": "MANDOR"}, {"k": "KANCIL-017", "n": "AGUS SULIYANTO", "p": "TUKANG"}, {"k": "KANCIL-008", "n": "SUMARSONO", "p": "TUKANG"}, {"k": "KANCIL-013", "n": "MUSTOFA", "p": "TUKANG"}, {"k": "KANCIL-024", "n": "NUR HASAN", "p": "TUKANG"}, {"k": "KANCIL-014", "n": "DIDIK ANTO", "p": "TUKANG"}, {"k": "KANCIL-004", "n": "PANUT MULYONO", "p": "TUKANG"}, {"k": "KANCIL-003", "n": "BAHRUDIN", "p": "TUKANG"}, {"k": "KANCIL-018", "n": "SEGER", "p": "TUKANG"}, {"k": "KANCIL-012", "n": "EDI", "p": "TUKANG"}, {"k": "KANCIL-010", "n": "SAPOAN", "p": "SEMI TUKANG"}, {"k": "KANCIL-016", "n": "SURYO SETYAWAN", "p": "SEMI TUKANG"}, {"k": "KANCIL-009", "n": "EKO BUDI IRIAWAN", "p": "PEMBANTU TUKANG"}, {"k": "KANCIL-007", "n": "YOGI YUNISTIRA", "p": "PEMBANTU TUKANG"}, {"k": "KANCIL-001", "n": "TARI", "p": "PEMBANTU TUKANG"}, {"k": "KANCIL-022", "n": "AGUNG WIJAYA", "p": "PEMBANTU TUKANG"}, {"k": "KANCIL-021", "n": "SUKANI", "p": "PEMBANTU TUKANG"}, {"k": "KANCIL-011", "n": "MAULANA ABI SAPUTRA", "p": "PEMBANTU TUKANG"}, {"k": "KANCIL-002", "n": "ARI KURNIAWAN", "p": "PEMBANTU TUKANG"}, {"k": "KANCIL-005", "n": "VERI SETIAWAN", "p": "PEMBANTU TUKANG"}, {"k": "KANCIL-006", "n": "NICHOLAS ARIEL PRASETYO", "p": "PEMBANTU TUKANG"}, {"k": "KANCIL-015", "n": "ALDI CAHYO PRASETYO", "p": "PEMBANTU TUKANG"}, {"k": "KANCIL-026", "n": "ZAINAL ABIDIN", "p": "PEMBANTU TUKANG"}, {"k": "KANCIL-027", "n": "JOKO SUMARTO", "p": "TUKANG"}, {"k": "KANCIL-028", "n": "ENDRO NURSIYO", "p": "TUKANG"}, {"k": "KANCIL-029", "n": "SUMARI", "p": "TUKANG"}, {"k": "KANCIL-030", "n": "SISWANTO-KANCIL", "p": "TUKANG"}, {"k": "KANCIL-031", "n": "SUJIANTO", "p": "SEMI TUKANG"}, {"k": "KANCIL-019", "n": "SISWANTO", "p": "TUKANG"}, {"k": "KANCIL-020", "n": "RIQO YANUWAR SAPUTRA", "p": "TUKANG"}, {"k": "KANCIL-023", "n": "HENRI UTAMAN", "p": "TUKANG"}, {"k": "KANCIL-032", "n": "BOY SETIYAWAN", "p": "TUKANG"}, {"k": "KANCIL-033", "n": "SUMITO", "p": "TUKANG"}, {"k": "KANCIL-034", "n": "MUJIONO", "p": "TUKANG"}, {"k": "KANCIL-035", "n": "SUGENG TKG", "p": "TUKANG"}, {"k": "KANCIL-036", "n": "ALDO", "p": "PEMBANTU TUKANG"}, {"k": "KANCIL-037", "n": "CHOIRUL", "p": "PEMBANTU TUKANG"}, {"k": "KANCIL-038", "n": "NORWANA", "p": "PEMBANTU TUKANG"}, {"k": "KANCIL-039", "n": "GUNAWAN", "p": "TUKANG"}, {"k": "KANCIL-040", "n": "SUNARI", "p": "TUKANG"}, {"k": "KANCIL-041", "n": "KUDORI", "p": "TUKANG"}, {"k": "KANCIL-042", "n": "SUGIANTO", "p": "TUKANG"}, {"k": "KANCIL-043", "n": "ANDRIK SUSANTO", "p": "SEMI TUKANG"}, {"k": "KANCIL-044", "n": "TARJIANTO", "p": "PEMBANTU TUKANG"}, {"k": "KANCIL-045", "n": "DAMOKO", "p": "PEMBANTU TUKANG"}, {"k": "KANCIL-046", "n": "SUYONO", "p": "PEMBANTU TUKANG"}, {"k": "KANCIL-047", "n": "SUMARI", "p": "PEMBANTU TUKANG"}, {"k": "TOPA-001", "n": "IMAM MUSTOFA", "p": "MANDOR"}, {"k": "TOPA-002", "n": "MARKANI", "p": "TUKANG"}, {"k": "TOPA-007", "n": "DIDIK RIFAI", "p": "TUKANG"}, {"k": "TOPA-012", "n": "SUDARSONO", "p": "TUKANG"}, {"k": "TOPA-016", "n": "GUNAJI", "p": "TUKANG"}, {"k": "TOPA-008", "n": "DIMAS DANU TIRTO", "p": "SEMI TUKANG"}, {"k": "TOPA-013", "n": "SUGIYONO", "p": "SEMI TUKANG"}, {"k": "TOPA-003", "n": "RAMADHANI PITRI PRATIKNO", "p": "SEMI TUKANG"}, {"k": "TOPA-004", "n": "YUDHA EKA RAMADHANI", "p": "PEMBANTU TUKANG"}, {"k": "TOPA-005", "n": "LUKI ANDRIAN ARISANDI", "p": "PEMBANTU TUKANG"}, {"k": "TOPA-006", "n": "KOSIM", "p": "PEMBANTU TUKANG"}, {"k": "TOPA-009", "n": "KHOIRUL ROZIQIN", "p": "PEMBANTU TUKANG"}, {"k": "TOPA-010", "n": "YOYOK SUSANTO", "p": "PEMBANTU TUKANG"}, {"k": "TOPA-011", "n": "DIDIK AGUNG BAKTIAR", "p": "PEMBANTU TUKANG"}, {"k": "TOPA-017", "n": "VIXI ANDRIAN", "p": "PEMBANTU TUKANG"}, {"k": "TOPA-018", "n": "AHMAD MUKHLISON", "p": "TUKANG"}, {"k": "TOPA-019", "n": "AGUS SUNARKO", "p": "TUKANG"}, {"k": "TOPA-020", "n": "FIRSGIAN IBNU NAFIS", "p": "PEMBANTU TUKANG"}, {"k": "TOPA-015", "n": "MIRUN", "p": "TUKANG"}, {"k": "TOPA-014", "n": "OMAR HADI", "p": "PEMBANTU TUKANG"}, {"k": "TOPA-021", "n": "SUDARSONO/DARSO", "p": "TUKANG"}, {"k": "TOPA-022", "n": "DODIK AGUNG BAKTIAR", "p": "PEMBANTU TUKANG"}, {"k": "GDG-001", "n": "BAGUS SETIAWAN", "p": "TUKANG"}, {"k": "GDG-002", "n": "MARTIN", "p": "RKS"}, {"k": "GDG-003", "n": "MEBA", "p": "PEMBANTU TUKANG"}, {"k": "GDG-004", "n": "HADI", "p": "PEMBANTU TUKANG"}, {"k": "GDG-005", "n": "ABDUL SUKUR", "p": "TUKANG"}, {"k": "GDG-006", "n": "KALIS", "p": "PEMBANTU TUKANG"}, {"k": "GDG-007", "n": "JATMIKO", "p": "PEMBANTU TUKANG"}, {"k": "GDG-008", "n": "SONDONG", "p": "TUKANG"}, {"k": "GDG-009", "n": "WAHID", "p": "TUKANG"}, {"k": "ALI-001", "n": "ALI MUHAMMAD", "p": "MANDOR"}, {"k": "ALI-011", "n": "MUHARDI WILONOTO", "p": "TUKANG"}, {"k": "ALI-002", "n": "JUREMI", "p": "TUKANG"}, {"k": "ALI-005", "n": "TRIWOKO", "p": "TUKANG"}, {"k": "ALI-017", "n": "DINO MARGO SAPUTRO", "p": "TUKANG"}, {"k": "ALI-019", "n": "M. ZAENURI", "p": "TUKANG"}, {"k": "ALI-007", "n": "ANDI PAMILU IRAWAN", "p": "TUKANG"}, {"k": "ALI-003", "n": "JOKO DWI PURNOMO", "p": "TUKANG"}, {"k": "ALI-013", "n": "RENDI MAULANA", "p": "PEMBANTU TUKANG"}, {"k": "ALI-014", "n": "DENI ADE PUTRA", "p": "PEMBANTU TUKANG"}, {"k": "ALI-018", "n": "M. RIFKI HIDAYAT", "p": "PEMBANTU TUKANG"}, {"k": "ALI-006", "n": "WAHYU AGUNG SETIAWAN", "p": "PEMBANTU TUKANG"}, {"k": "ALI-021", "n": "MUSTOFA", "p": "PEMBANTU TUKANG"}, {"k": "ALI-022", "n": "EDI NUGROHO", "p": "TUKANG"}, {"k": "ALI-023", "n": "AGUS PRASTIAWAN", "p": "TUKANG"}, {"k": "ALI-024", "n": "AHMAD ZAINURI", "p": "TUKANG"}, {"k": "ALI-025", "n": "ARIS WIBOWO", "p": "PEMBANTU TUKANG"}, {"k": "ALI-026", "n": "DWI SANTOSO", "p": "TUKANG"}, {"k": "ALI-027", "n": "MARULI HENY DIATMIKO", "p": "TUKANG"}, {"k": "ALI-028", "n": "PUNGKY ARI W", "p": "PEMBANTU TUKANG"}, {"k": "ALI-029", "n": "SLAMET B", "p": "TUKANG"}, {"k": "ALI-030", "n": "SUMANI", "p": "TUKANG"}, {"k": "ALI-031", "n": "YANTO RIADI", "p": "TUKANG"}, {"k": "ALI-032", "n": "SUYITNO", "p": "TUKANG"}, {"k": "ALI-004", "n": "EDI MUSTONO", "p": "TUKANG"}, {"k": "ALI-009", "n": "ONIK SETIAWAN", "p": "TUKANG"}, {"k": "ALI-010", "n": "PAERAN", "p": "PEMBANTU TUKANG"}, {"k": "ALI-012", "n": "YUDA KRIS SANDINI", "p": "PEMBANTU TUKANG"}, {"k": "ALI-015", "n": "SUYITNO", "p": "TUKANG"}, {"k": "ALI-016", "n": "IRFAN ANDREAN SAPUTRA", "p": "PEMBANTU TUKANG"}, {"k": "ALI-020", "n": "JANI", "p": "PEMBANTU TUKANG"}, {"k": "ALI-008", "n": "RIDHO BAGUS SUMANTRI", "p": "PEMBANTU TUKANG"}, {"k": "KEBUN-001", "n": "JAFAR ARBA", "p": "TUKANG"}, {"k": "KEBUN-002", "n": "ALBERTUS J MUDA", "p": "PEMBANTU TUKANG"}, {"k": "KEBUN-003", "n": "AHMAD MISBAQUL MUNIR", "p": "TUKANG"}, {"k": "KEBUN-004", "n": "DOMINIKUS D MUDA", "p": "PEMBANTU TUKANG"}, {"k": "KEBUN-005", "n": "ONIX", "p": "PEMBANTU TUKANG"}, {"k": "KEBUN-006", "n": "FABIANUS KOPO MUDA", "p": "PEMBANTU TUKANG"}, {"k": "ASROFI-021", "n": "ASROFI", "p": "MANDOR"}, {"k": "ASROFI-001", "n": "MASUDI/HADI", "p": "PEMBANTU TUKANG"}, {"k": "ASROFI-002", "n": "SUPRI", "p": "TUKANG"}, {"k": "ASROFI-022", "n": "RUDIANTO", "p": "TUKANG"}, {"k": "ASROFI-019", "n": "PRAYOKO", "p": "TUKANG"}, {"k": "ASROFI-007", "n": "ROKIM", "p": "TUKANG"}, {"k": "ASROFI-014", "n": "BASRI", "p": "TUKANG"}, {"k": "ASROFI-015", "n": "UJANG SUKIRMAN", "p": "PEMBANTU TUKANG"}, {"k": "ASROFI-016", "n": "AHMAD SUKUR", "p": "TUKANG"}, {"k": "ASROFI-017", "n": "SULANI", "p": "PEMBANTU TUKANG"}, {"k": "ASROFI-018", "n": "MAT RODLI", "p": "SEMI TUKANG"}, {"k": "ASROFI-020", "n": "MISNI", "p": "TUKANG"}, {"k": "ASROFI-006", "n": "MASNGUT", "p": "TUKANG"}, {"k": "ASROFI-008", "n": "RIO YUMAS OKTAVIANO", "p": "PEMBANTU TUKANG"}, {"k": "ASROFI-009", "n": "SUGIANTA", "p": "TUKANG"}, {"k": "ASROFI-010", "n": "IMAM SOPINGI", "p": "SEMI TUKANG"}, {"k": "ASROFI-011", "n": "DADANG RANU TANTOWI", "p": "PEMBANTU TUKANG"}, {"k": "ASROFI-012", "n": "NUR EFFENDI", "p": "TUKANG"}, {"k": "ASROFI-013", "n": "KHOIRI", "p": "TUKANG"}, {"k": "ASROFI-031", "n": "DWI NURWANTO", "p": "TUKANG"}, {"k": "ASROFI-032", "n": "SAFARI", "p": "PEMBANTU TUKANG"}, {"k": "ASROFI-033", "n": "ILHAM", "p": "TUKANG"}, {"k": "ASROFI-034", "n": "SRIANTO", "p": "PEMBANTU TUKANG"}, {"k": "ASROFI-035", "n": "RIAS", "p": "TUKANG"}, {"k": "ASROFI-036", "n": "NANDA AJI PANGESTU", "p": "PEMBANTU TUKANG"}, {"k": "ASROFI-037", "n": "NURHUDA", "p": "PEMBANTU TUKANG"}, {"k": "ASROFI-023", "n": "ANGGA PRADANA", "p": "TUKANG"}, {"k": "ASROFI-024", "n": "AGUS JARWANTO", "p": "TUKANG"}, {"k": "ASROFI-025", "n": "ALI MUSTOFA", "p": "PEMBANTU TUKANG"}, {"k": "ASROFI-026", "n": "HARIYANTO", "p": "TUKANG"}, {"k": "ASROFI-027", "n": "SUGENG", "p": "TUKANG"}, {"k": "ASROFI-028", "n": "MISYADI", "p": "TUKANG"}, {"k": "ASROFI-029", "n": "JOKO SUWITO", "p": "PEMBANTU TUKANG"}, {"k": "ASROFI-030", "n": "IMAM NAHROWI", "p": "PEMBANTU TUKANG"}, {"k": "ASROFI-038", "n": "HENDRO", "p": "PEMBANTU TUKANG"}, {"k": "ASROFI-039", "n": "ADI SONDONG", "p": "TUKANG"}, {"k": "asrofi-040", "n": "AHMAD BG", "p": "TUKANG"}, {"k": "ASROFI-041", "n": "AHMAD SHAIFUL BASHOR", "p": "PEMBANTU TUKANG"}, {"k": "ASROFI-042", "n": "JATMIKO WAHYUDIONO", "p": "PEMBANTU TUKANG"}, {"k": "ASROFI-003", "n": "AGUS SUPRAPTO", "p": "TUKANG"}, {"k": "ASROFI-004", "n": "EKA WAHYU PUTRA", "p": "SEMI TUKANG"}, {"k": "ASROFI-005", "n": "JOHAN P", "p": "SEMI TUKANG"}, {"k": "ASROFI-046", "n": "FAJAR", "p": "PEMBANTU TUKANG"}, {"k": "KASUN-001", "n": "KASUN", "p": "MANDOR"}, {"k": "KASUN-005", "n": "MIFTAHUL HUDA", "p": "TUKANG"}, {"k": "KASUN-004", "n": "NANANG ATHO ILLAHI", "p": "PEMBANTU TUKANG"}, {"k": "KASUN-003", "n": "M. HARUN", "p": "SEMI TUKANG"}, {"k": "KASUN-002", "n": "MUNAWIR", "p": "TUKANG"}, {"k": "GIPSUM-001", "n": "AGUS JALI", "p": "CAT"}, {"k": "GIPSUM-002", "n": "SUGENG WALUYO", "p": "CAT"}, {"k": "GIPSUM-003", "n": "RICO YANUAR SAPUTRO", "p": "TUKANG"}, {"k": "GIPSUM-004", "n": "HENRI UTAMAN", "p": "TUKANG"}, {"k": "GIPSUM-005", "n": "EDI PURWANTO", "p": "TUKANG"}, {"k": "GIPSUM-006", "n": "ANDRIANUS LEBA", "p": "PEMBANTU TUKANG"}, {"k": "MEP-001", "n": "AHMAD TAOFIK", "p": "MEP"}, {"k": "MEP-002", "n": "HENDI", "p": "MEP"}, {"k": "MEP-003", "n": "OBY NURJAMAN", "p": "MEP"}, {"k": "MEP-004", "n": "SAEFUL ANWAR", "p": "MEP"}, {"k": "LAS-001", "n": "EKO ANDRIANTO", "p": "MANDOR"}, {"k": "LAS-002", "n": "ASEP SUNJAYA", "p": "TUKANG"}, {"k": "LAS-003", "n": "DEDI IRAWAN", "p": "PEMBANTU TUKANG"}, {"k": "LAS-004", "n": "RAJIDIN", "p": "PEMBANTU TUKANG"}, {"k": "LAS-005", "n": "RUSDIANSYAH", "p": "TUKANG"}, {"k": "NUR-001", "n": "NURSAID", "p": "MANDOR"}, {"k": "NUR-002", "n": "MASIRIN", "p": "TUKANG"}, {"k": "NUR-003", "n": "JUARI", "p": "TUKANG"}, {"k": "NUR-004", "n": "AHMAD SOLEH", "p": "PEMBANTU TUKANG"}, {"k": "NUR-005", "n": "YOGA ABDI PAMBUDI", "p": "PEMBANTU TUKANG"}, {"k": "NUR-006", "n": "MARDA ADITYA", "p": "PEMBANTU TUKANG"}, {"k": "NUR-007", "n": "SAIFUL ANAM", "p": "PEMBANTU TUKANG"}, {"k": "NUR-008", "n": "DENI ARI SANDIA", "p": "PEMBANTU TUKANG"}, {"k": "NUR-009", "n": "TEDO EMBUN SAPUTRA", "p": "TUKANG"}, {"k": "NUR-010", "n": "DJUBAIDI", "p": "PEMBANTU TUKANG"}, {"k": "NUR-011", "n": "SUTAJI", "p": "TUKANG"}, {"k": "NUR-012", "n": "SRINANTO", "p": "PEMBANTU TUKANG"}, {"k": "NUR-013", "n": "SOIMIN", "p": "TUKANG"}, {"k": "NUR-014", "n": "SUTOYO", "p": "PEMBANTU TUKANG"}, {"k": "NUR-015", "n": "JAYADI", "p": "TUKANG"}, {"k": "NUR-016", "n": "JOKO HOGI PUTRA WIANGGA", "p": "PEMBANTU TUKANG"}, {"k": "MEBEL-001", "n": "AHMAD TAMSIR", "p": "MANDOR INTERIOR"}, {"k": "MEBEL-002", "n": "SAPAWI", "p": "TUKANG"}, {"k": "MEBEL-003", "n": "ANDIKA FANI RISTANTO", "p": "TUKANG"}, {"k": "NARDI-001", "n": "ADITIA RUDIANTO", "p": "TUKANG"}, {"k": "NARDI-002", "n": "DARSONO", "p": "TUKANG"}, {"k": "NARDI-003", "n": "PURWAJI", "p": "TUKANG"}, {"k": "NARDI-004", "n": "NURHAMID", "p": "TUKANG"}, {"k": "NARDI-005", "n": "WAHYUDI", "p": "PEMBANTU TUKANG"}, {"k": "NARDI-006", "n": "NAUFAL YUFRON TRI A", "p": "PEMBANTU TUKANG"}, {"k": "NARDI-007", "n": "REGITA PRAMUJI", "p": "PEMBANTU TUKANG"}, {"k": "NARDI-008", "n": "NARDI", "p": "MANDOR"}, {"k": "NARDI-009", "n": "WARDI", "p": "WAKIL MANDOR"}, {"k": "NARDI-010", "n": "MARTONO", "p": "TUKANG"}, {"k": "NARDI-011", "n": "NYAMIN", "p": "TUKANG"}, {"k": "NARDI-012", "n": "SETO", "p": "TUKANG"}, {"k": "NARDI-013", "n": "SUWARNO", "p": "TUKANG"}, {"k": "NARDI-014", "n": "WARSONO", "p": "TUKANG"}, {"k": "NARDI-015", "n": "TEGUH", "p": "PEMBANTU TUKANG"}, {"k": "NARDI-016", "n": "NUR ALI", "p": "SEMI TUKANG"}, {"k": "NARDI-017", "n": "HERMANTO", "p": "PEMBANTU TUKANG"}, {"k": "NARDI-018", "n": "BEJO", "p": "PEMBANTU TUKANG"}, {"k": "NARDI-019", "n": "DENI", "p": "TUKANG"}, {"k": "NARDI-020", "n": "SOLIKIN", "p": "PEMBANTU TUKANG"}, {"k": "NARDI-021", "n": "GIMO", "p": "PEMBANTU TUKANG"}, {"k": "NARDI-022", "n": "ABDUL HALIM", "p": "PEMBANTU TUKANG"}, {"k": "NARDI-023", "n": "MUH. YUSUF", "p": "PEMBANTU TUKANG"}, {"k": "NARDI-024", "n": "MOCH ABDUL MA'ALI", "p": "PEMBANTU TUKANG"}, {"k": "NARDI-025", "n": "KONI ARI WIBISONO", "p": "PEMBANTU TUKANG"}, {"k": "NARDI-026", "n": "GINANJAR ARDI SAPUTRA", "p": "TUKANG"}, {"k": "NARDI-027", "n": "USUF ROHANI", "p": "TUKANG"}, {"k": "NARDI-028", "n": "SURYONO", "p": "TUKANG"}, {"k": "NARDI-029", "n": "NURUDIN", "p": "TUKANG"}, {"k": "NARDI-030", "n": "ANTOK MURDIONO", "p": "TUKANG"}, {"k": "NARDI-031", "n": "SUPRIYANTO MBAH", "p": "TUKANG"}, {"k": "NARDI-032", "n": "SUPRIYANTO 2", "p": "TUKANG"}, {"k": "NARDI-033", "n": "ANTON DWI CAHYONO", "p": "PEMBANTU TUKANG"}, {"k": "NARDI-034", "n": "SUPOMO", "p": "TUKANG"}, {"k": "NARDI-035", "n": "MOH YUSUF", "p": "TUKANG"}, {"k": "NARDI-036", "n": "ACHMAD HUDA", "p": "PEMBANTU TUKANG"}, {"k": "NARDI-037", "n": "SLAMET BUDIYONO", "p": "PEMBANTU TUKANG"}, {"k": "NARDI-038", "n": "SUKARSONO", "p": "PEMBANTU TUKANG"}, {"k": "NARDI-039", "n": "SUJAK", "p": "TUKANG"}, {"k": "NARDI-040", "n": "PUTJIANTO", "p": "TUKANG"}];

        // Standar Upah Berdasarkan Posisi
        const STANDAR_UPAH = {
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

        // Daftar 30 Proyek Resmi PT. Jaya Kedhaton
        const DAFTAR_PROJEK = (typeof window !== 'undefined' && window.SERVER_DATA && window.SERVER_DATA.daftarProjek && window.SERVER_DATA.daftarProjek.length > 0)
            ? window.SERVER_DATA.daftarProjek
            : [
            'FELISA ESTATE',
            'RUKO PAK DEDI',
            'GREEN HOUSE',
            'GREEN HOUSE TANAH MERAH',
            'PAGAR RING ROAD',
            'WORKSHOP RING ROAD',
            'ASPOL 2026',
            'ASPOL TAHAP 1',
            'JATANRAS POLRES',
            'PENJARA POLRES SAMARINDA',
            'POLIKLINIK POLRES',
            'PROYEK RTT SAMBOJA',
            'RTT JUANDA 6',
            'RTT BALIKPAPAN',
            'RTT CITRA GADING',
            'RTT LOA BAKUNG',
            'RTT PAK FENDI',
            'RTT PAK ZAINAL SAWO',
            'RTT POLDA BALIKPAPAN',
            'TAMAN BALKOT 2025',
            'TANAH MERAH',
            'BATU BESAUNG',
            'GUDANG SENTRAL',
            'KANTOR AW SYAHRANIE',
            'RENOV RTT SERUNI',
            'SERVIS RTT MEDITRAN',
            'SERVIS RTT WIKA',
            'SERVIS SEI KAPIH',
            'BORONGAN JUANDA',
            'BORONGAN ASPOL'
        ];

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
                                title="Hapus Proyek #${idx + 1}">
                            <i class="fas fa-trash-alt text-[10px]"></i>
                            <span>Hapus Proyek Ini</span>
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
                            <button type="button" onclick="bukaSlipById(${trx.id})" 
                                    class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-2.5 py-1.5 rounded-lg text-xs shadow-sm cursor-pointer"
                                    title="Cetak Slip Gaji">
                                <i class="fas fa-file-invoice"></i> Slip
                            </button>
                            <button type="button" onclick="editTrxKeForm(${trx.id})" 
                                    class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1.5 rounded-lg text-xs border border-slate-300 cursor-pointer"
                                    title="Muat kembali data ke form di atas untuk diedit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button type="button" onclick="hapusTrx(${trx.id})" 
                                     class="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-2.5 py-1.5 rounded-lg text-xs border border-rose-200 cursor-pointer"
                                     title="Hapus dari daftar">
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
        // EKSPOR REKAP TRANSAKSI KE MICROSOFT EXCEL / CSV
        // =========================================================================
        function eksporRekapExcel() {
            if (!transaksiList || transaksiList.length === 0) {
                alert('Belum ada data transaksi upah untuk diekspor!');
                return;
            }

            const labelPeriode = (document.getElementById('labelPeriodeAktif') ? document.getElementById('labelPeriodeAktif').innerText : 'Periode').trim();
            const barisCsv = [];

            // Header Kolom Excel
            barisCsv.push(['NO', 'KODE', 'NAMA PEKERJA', 'POSISI', 'RINCIAN PROYEK & HARI KERJA', 'TOTAL HARI', 'TOTAL LEMBUR (JAM)', 'TOTAL MAKAN (RP)', 'TOTAL TRANSPORT (RP)', 'TOTAL INSENTIF (RP)', 'UPAH PER HARI (RP)', 'TOTAL UPAH KOTOR (RP)', 'POTONGAN KASBON (RP)', 'KETERANGAN KASBON', 'SISA DITERIMA (RP)', 'DITRANSFER (RP)', 'DITERIMA CASH (RP)', 'PERIODE TRANSAKSI']);

            let no = 1;
            let grandKotor = 0;
            let grandKasbon = 0;
            let grandBersih = 0;
            let grandTf = 0;
            let grandCash = 0;

            transaksiList.forEach(trx => {
                const tarifLembur = (trx.upahPerHari || 0) / 8;
                let totKotor = 0;
                let totHari = 0;
                let totLembur = 0;
                let totMakan = 0;
                let totTransport = 0;
                let totInsentif = 0;
                const rincianStr = [];

                trx.projekList.forEach(p => {
                    const subPokok = (Number(p.hari) || 0) * (trx.upahPerHari || 0);
                    const subLembur = (Number(p.lembur) || 0) * tarifLembur;
                    const makan = Number(p.makan) || 0;
                    const transport = Number(p.transport) || 0;
                    const insentif = Number(p.insentif) || 0;
                    const sub = subPokok + subLembur + makan + transport + insentif;
                    totKotor += sub;
                    totHari += Number(p.hari) || 0;
                    totLembur += Number(p.lembur) || 0;
                    totMakan += makan;
                    totTransport += transport;
                    totInsentif += insentif;
                    rincianStr.push(`${p.projek || 'PROYEK'} (${p.hari} hr, ${p.lembur} jam${transport > 0 ? ', trsp ' + transport : ''})`);
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

                barisCsv.push([
                    no++,
                    trx.kode || '-',
                    `"${(trx.nama || '').replace(/"/g, '""')}"`,
                    `"${(trx.posisi || '').replace(/"/g, '""')}"`,
                    `"${rincianStr.join('; ')}"`,
                    totHari,
                    totLembur,
                    totMakan,
                    totTransport,
                    totInsentif,
                    trx.upahPerHari || 0,
                    totKotor,
                    kasbon,
                    `"${(trx.kasbonKet || '').replace(/"/g, '""')}"`,
                    bersih,
                    tf,
                    cash,
                    `"${trx.periodeTeks || labelPeriode}"`
                ]);
            });

            // Baris Grand Total
            barisCsv.push(['', '', 'TOTAL KESELURUHAN', '', '', '', '', '', '', '', '', grandKotor, grandKasbon, '', grandBersih, grandTf, grandCash, '']);

            // BOM UTF-8 (\uFEFF) untuk kompatibilitas sempurna dengan Microsoft Excel di Windows
            const csvContent = '\uFEFF' + barisCsv.map(row => row.join(';')).join('\r\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const safePeriode = labelPeriode.replace(/[^a-zA-Z0-9]/g, '_');
            a.href = url;
            a.download = `Rekap_Transaksi_Upah_JayaKedhaton_${safePeriode}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        // =========================================================================
        // E. CETAK SLIP GAJI MULTI-PROJEK (FORMAT JAYA KEDHATON)
        // =========================================================================
        function bukaSlipById(idTrx) {
            const trx = transaksiList.find(t => t.id === idTrx);
            if (!trx) return;

            const tarifLembur = (trx.upahPerHari || 0) / 8;
            document.getElementById('slipNama').innerText = trx.kode ? `(${trx.kode}) ${trx.nama}` : trx.nama;
            document.getElementById('slipTtdNama').innerText = trx.nama;
            document.getElementById('slipPosisi').innerText = trx.posisi;
            document.getElementById('slipPeriodeDisplay').innerText = trx.periodeTeks || document.getElementById('labelPeriodeAktif').innerText;
            document.getElementById('slipTglCetak').innerText = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

            const tbody = document.getElementById('slipTbodyProyek');
            tbody.innerHTML = '';

            let grandKotor = 0;
            trx.projekList.forEach(p => {
                const subPokok = (Number(p.hari) || 0) * trx.upahPerHari;
                const subLembur = (Number(p.lembur) || 0) * tarifLembur;
                const makan = Number(p.makan) || 0;
                const transport = Number(p.transport) || 0;
                const insentif = Number(p.insentif) || 0;
                const sub = subPokok + subLembur + makan + transport + insentif;
                grandKotor += sub;

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="p-2 font-bold text-slate-800">${escapeHtml(p.projek || 'PROYEK')}</td>
                    <td class="p-2 text-center font-semibold">${p.hari} hari</td>
                    <td class="p-2 text-right">${formatRp(trx.upahPerHari)}</td>
                    <td class="p-2 text-center font-semibold">${p.lembur} jam (${formatRp(tarifLembur)}/j)</td>
                    <td class="p-2 text-right">${formatRp(makan)}</td>
                    <td class="p-2 text-right font-medium text-slate-700">${transport > 0 ? formatRp(transport) : '-'}</td>
                    <td class="p-2 text-right font-medium text-slate-700">${insentif > 0 ? formatRp(insentif) : '-'}</td>
                    <td class="p-2 text-right font-black text-emerald-800">${formatRp(sub)}</td>
                `;
                tbody.appendChild(tr);
            });

            const kasbon = trx.kasbon || 0;
            const bersih = grandKotor - kasbon;
            const transfer = Number(trx.transfer) || 0;
            const cash = trx.cash !== undefined ? Number(trx.cash) : Math.max(0, bersih - transfer);

            document.getElementById('slipTotalKotor').innerText = formatRp(grandKotor);
            document.getElementById('slipKasbonNilai').innerText = '- ' + formatRp(kasbon);

            const elKasbonKet = document.getElementById('slipKasbonKetDisplay');
            if (elKasbonKet) {
                if (trx.kasbonKet) {
                    elKasbonKet.innerText = `Ket: ${trx.kasbonKet}`;
                    elKasbonKet.classList.remove('hidden');
                } else {
                    elKasbonKet.innerText = '';
                    elKasbonKet.classList.add('hidden');
                }
            }

            document.getElementById('slipSisaDiterima').innerText = formatRp(bersih);

            const elSlipTf = document.getElementById('slipTransferNilai');
            if (elSlipTf) elSlipTf.innerText = formatRp(transfer);

            const elSlipCash = document.getElementById('slipCashNilai');
            if (elSlipCash) elSlipCash.innerText = formatRp(cash);

            document.getElementById('modalSlip').classList.remove('hidden');
            document.body.classList.add('slip-open');
        }

            document.getElementById('modalSlip').classList.remove('hidden');
            document.body.classList.add('slip-open');
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