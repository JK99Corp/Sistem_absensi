/**
 * User & Role Management
 * PT. Jaya Kedhaton Enterprise System
 * 
 * 4 Akun Resmi:
 * - 2 Akun Pimpinan (Super Admin): Diizinkan akses Log Audit Keamanan
 * - 2 Staf Operasional: Staf Keuangan & Staf HRD
 */

const REGISTERED_USERS = [
    { username: 'superadmin', nama: 'Direktur Utama', role: 'superadmin', roleLabel: 'Super Admin (Direksi)', pass: 'kedhaton2026!' },
    { username: 'admin.utama', nama: 'Admin Utama', role: 'superadmin', roleLabel: 'Super Admin (Auditor Internal)', pass: 'adminutama123' },
    { username: 'staf.keuangan', nama: 'Siti Aminah', role: 'keuangan', roleLabel: 'Staf Keuangan', pass: 'keuangan123' },
    { username: 'staf.hrd', nama: 'Rendra Bagus', role: 'hrd', roleLabel: 'Staf HRD & Personalia', pass: 'hrd123' }
];

module.exports = {
    REGISTERED_USERS
};
