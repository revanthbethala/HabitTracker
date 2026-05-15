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

const files = walk('src');
let foundCount = 0;

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    // Simplified regex to match any string starting with ./ or ../
    const matches = content.match(/['"](\.\.?\/[^'"]+)['"]/g);
    if (matches) {
        // Filter out .css and .svg if needed, or keep them if they should be aliased
        const relativeImports = matches.filter(m => !m.includes('.css') && !m.includes('.svg'));
        if (relativeImports.length > 0) {
            console.log(`File ${file} has relative imports:`, relativeImports);
            foundCount += relativeImports.length;
        }
    }
});

if (foundCount === 0) {
    console.log('No relative imports found (excluding CSS/SVG).');
} else {
    console.log(`Found ${foundCount} relative imports.`);
}
