const fs = require('fs');
const path = require('path');

const previewDir = path.join(__dirname, 'preview');
if (!fs.existsSync(previewDir)) fs.mkdirSync(previewDir, { recursive: true });

// Read server.js and adapt it for static preview
let code = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');

// Replace relative urls with .html in HTML renderers
code = code
    .replace(/href:\s*'\/dashboard'/g, "href: 'dashboard.html'")
    .replace(/href:\s*'\/riwayat'/g, "href: 'riwayat.html'")
    .replace(/href:\s*'\/rekap'/g, "href: 'rekap.html'")
    .replace(/href:\s*'\/upah'/g, "href: 'upah.html'")
    .replace(/href:\s*'\/karyawan'/g, "href: 'karyawan.html'")
    .replace(/href:\s*'\/kartu-rfid'/g, "href: 'kartu-rfid.html'")
    .replace(/href:\s*'\/device'/g, "href: 'device.html'")
    .replace(/href="\/login"/g, 'href="login.html"')
    .replace(/action="\/dashboard"/g, 'action="dashboard.html"')
    .replace(/\/images\/logo\.(jpg|png)(\?v=\d+)?/g, 'images/logo.png');

// Save adapted preview generator
const generatorFile = path.join(__dirname, 'scratch_gen.js');

const staticGenScript = `
${code.substring(0, code.indexOf('const server = http.createServer'))}

fs.writeFileSync(path.join('${previewDir.replace(/\\/g, '\\\\')}', 'login.html'), renderLogin());
fs.writeFileSync(path.join('${previewDir.replace(/\\/g, '\\\\')}', 'index.html'), renderDashboard());
fs.writeFileSync(path.join('${previewDir.replace(/\\/g, '\\\\')}', 'dashboard.html'), renderDashboard());
fs.writeFileSync(path.join('${previewDir.replace(/\\/g, '\\\\')}', 'upah.html'), renderUpah());
fs.writeFileSync(path.join('${previewDir.replace(/\\/g, '\\\\')}', 'riwayat.html'), renderRiwayat());
fs.writeFileSync(path.join('${previewDir.replace(/\\/g, '\\\\')}', 'rekap.html'), renderRekap());
fs.writeFileSync(path.join('${previewDir.replace(/\\/g, '\\\\')}', 'karyawan.html'), renderKaryawan('aktif'));
fs.writeFileSync(path.join('${previewDir.replace(/\\/g, '\\\\')}', 'kartu-rfid.html'), renderKartuRfid());
fs.writeFileSync(path.join('${previewDir.replace(/\\/g, '\\\\')}', 'device.html'), renderDevice());

console.log('✅ Semua file HTML preview berhasil disinkronkan!');
`;

fs.writeFileSync(generatorFile, staticGenScript);
require(generatorFile);
try { fs.unlinkSync(generatorFile); } catch(e){}
