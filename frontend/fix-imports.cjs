const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            results.push(fullPath);
        }
    });
    return results;
}

const srcDir = path.resolve(__dirname, 'src');
const files = walk(srcDir);
console.log(`srcDir: ${srcDir}`);
console.log(`Processing ${files.length} files...`);

if (files.length > 0) {
    console.log(`Example file: ${files[0]}`);
}

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanged = false;

    // Very broad regex to find all strings that look like relative paths
    const newContent = content.replace(/['"](\.\.?\/[^'"]+)['"]/g, (match, p1) => {
        // Resolve absolute path
        const absoluteImportPath = path.resolve(path.dirname(file), p1);
        
        // Check if it's within src
        if (absoluteImportPath.toLowerCase().startsWith(srcDir.toLowerCase())) {
            let relativeToSrc = absoluteImportPath.substring(srcDir.length).replace(/\\/g, '/');
            if (relativeToSrc.startsWith('/')) relativeToSrc = relativeToSrc.substring(1);
            
            const newImport = `'@/${relativeToSrc}'`;
            console.log(`  Updating in ${path.relative(srcDir, file)}: ${match} -> ${newImport}`);
            hasChanged = true;
            return newImport;
        }
        return match;
    });

    if (hasChanged) {
        fs.writeFileSync(file, newContent, 'utf8');
    }
});
console.log('Done.');
