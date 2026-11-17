const fs = require('fs');
const path = require('path');

const previewDir = path.join(__dirname, 'preview');
const htmlFiles = fs.readdirSync(previewDir).filter(f => f.endsWith('.html') && f !== 'login.html');

console.log('Checking sidebar links in preview HTML files...');
const requiredLinks = [
    'dashboard.html',
    'riwayat.html',
    'rekap.html',
    'upah.html',
    'laporan-proyek.html',
    'karyawan.html',
    'kartu-rfid.html',
    'device.html',
    'audit-log.html'
];

let missingCount = 0;
for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(previewDir, file), 'utf8');
    for (const link of requiredLinks) {
        if (!content.includes(link)) {
            console.log(`⚠️  ${file} is missing link: ${link}`);
            missingCount++;
        }
    }
}

if (missingCount === 0) {
    console.log(`✅ All ${htmlFiles.length} preview HTML files have complete, consistent sidebar links!`);
} else {
    console.log(`Found ${missingCount} missing links.`);
}
