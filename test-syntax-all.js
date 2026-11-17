const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function scan(dir) {
    let files = [];
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
        if (f.name === 'node_modules' || f.name === '.git') continue;
        const full = path.join(dir, f.name);
        if (f.isDirectory()) {
            files = files.concat(scan(full));
        } else if (f.name.endsWith('.js')) {
            files.push(full);
        }
    }
    return files;
}

const allJs = scan('.');
let errors = 0;
console.log(`Scanning syntax for ${allJs.length} JavaScript files...`);
for (const file of allJs) {
    try {
        execSync(`node -c "${file}"`, { stdio: 'pipe' });
    } catch (e) {
        console.error(`❌ SYNTAX ERROR in: ${file}`);
        console.error(e.stderr.toString());
        errors++;
    }
}

if (errors === 0) {
    console.log(`✅ ALL ${allJs.length} JS FILES PASSED SYNTAX CHECK!`);
} else {
    console.error(`❌ FOUND ${errors} FILES WITH SYNTAX ERRORS!`);
    process.exit(1);
}
