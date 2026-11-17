# SISTEM ABSENSI DIGITAL PT. JAYA KEDHATON — AGENT OPERATIONAL MANIFEST

> **Standard**: ECC (Everything Claude Code) AI-First Engineering Specification  
> **Environment**: Dual-ESP32 Hardware + Web Portal & Multi-Project Payroll Management

---

## 🏛️ 1. Architecture Contracts (Non-Negotiable)

This codebase follows a **Clean 3-Tier Layered Architecture** with strict Separation of Concerns (SoC):

```
HTTP Request ──► Router (src/routes/router.js)
                      │
                      ▼
               Thin Controller (src/controllers/*.controller.js)
                      │
         ┌────────────┴────────────┐
         ▼                         ▼
   Domain Service          Presentation View
(src/services/*.service.js)  (src/views/*.view.js)
         │
         ▼
Persistence Engine (src/db/storage.js / PostgreSQL ready)
```

1. **Controllers are Thin Dispatchers**:
   - Max ~60 lines per controller.
   - Controllers MUST NOT contain HTML templates or direct database record mutations.
   - All body streams MUST use `readRequestBody(req)` from `src/utils/helpers.js` to guard against DoS payload overflows.
2. **Services Own Business Logic**:
   - `karyawan.service.js`: CRUD, UID duplication check, soft-deletion, and restore conflict prevention.
   - `projek.service.js`: Financial aggregation per construction project.
   - `transaksi.service.js`: Wage transaction persistence, batch sync, and audit logging.
3. **Views Own HTML Rendering**:
   - Isolated template functions in `src/views/`. All user-supplied data MUST be sanitized with `escapeHtml()`.
4. **Master Datasets**:
   - Static datasets (255 workers, 30 official projects, positions) MUST reside in `preview/master-data.js` and be injected cleanly into frontend scripts.

---

## 💼 2. Core Business Invariants & Rules

1. **Attendance Cut-Off Time**:
   - **Pekerja Harian**: Tap in $\le \text{07:30 WIB}$ is On-Time. $> \text{07:30 WIB}$ is Late.
   - **Staff Kantor**: Tap in $\le \text{08:30 WIB}$ is On-Time. $> \text{08:30 WIB}$ is Late.
2. **Normal Work Hours & Overtime**:
   - Normal Departure Window: $\text{17:00} - \text{17:30 WIB}$ ($0\text{ hours overtime}$).
   - Overtime Activation: Tap out $> \text{17:30 WIB}$ automatically logs overtime hours.
3. **Financial Wages & Payroll Formula**:
   $$\text{Sub-Pokok} = \text{Hari Kerja} \times \text{Upah Harian}$$
   $$\text{Tarif Lembur per Jam} = \frac{\text{Upah Harian}}{8}$$
   $$\text{Sub-Lembur} = \text{Jam Lembur} \times \text{Tarif Lembur}$$
   $$\text{Total Kotor Proyek} = \text{Sub-Pokok} + \text{Sub-Lembur} + \text{Uang Makan} + \text{Transport} + \text{Insentif}$$
   $$\text{Sisa Diterima Bersih} = \text{Total Kotor} - \text{Kasbon}$$
   $$\text{Diterima Tunai (Cash)} = \max(0, \text{Sisa Diterima Bersih} - \text{Ditransfer})$$
4. **Data Immutability (Soft-Delete)**:
   - NEVER permanently delete employee records from active tables.
   - Employee removals MUST move to `karyawanArsip` with `status: 'Diarsipkan'`.
   - RFID cards MUST automatically transition to `Nonaktif (Arsip)`.
5. **Access Control (RBAC)**:
   - `/audit-log` is strictly restricted to 2 Executive accounts (`superadmin` and `admin.utama`).
   - Unauthorized attempts by operational staff (`staf.keuangan`, `staf.hrd`) or guests MUST return HTTP 403 Forbidden and record an audit log incident.

---

## 🧪 3. Quality Gates & Verification Standard

Before concluding any development turn or committing code, the full 4-layer verification suite MUST be executed and pass 100%:

```bash
npm run test:all
```

The suite enforces:
- **Layer 1**: Syntax check across all JavaScript files (`test-syntax-all.js`).
- **Layer 2**: In-Memory HTTP GET & POST functional backend audit (`test-inmemory.js`).
- **Layer 3**: Cybersecurity penetration tests with 28 attack scenarios (`test-security.js`).
- **Layer 4**: Deep integration & financial precision audit (`test-comprehensive.js`).

---

## 🚀 4. Cross-Platform & Launcher Integrity

- **Windows**: [KLIK-UNTUK-PRESENTASI.bat](file:///c:/Users/Jaya%20Kedhaton/Documents/PROJEK/ABSENSI-dig/KLIK-UNTUK-PRESENTASI.bat)
- **macOS**: [KLIK-UNTUK-PRESENTASI.command](file:///c:/Users/Jaya%20Kedhaton/Documents/PROJEK/ABSENSI-dig/KLIK-UNTUK-PRESENTASI.command) (mode `+x`)
- **Offline / Standalone**: All HTML files in `preview/` MUST function independently in modern browsers without backend dependencies.
