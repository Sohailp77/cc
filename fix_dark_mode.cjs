const fs = require('fs');
const path = require('path');

const walk = (dir) => {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.jsx')) results.push(file);
        }
    });
    return results;
}

const map = {
    'bg-white': 'dark:bg-slate-900',
    'bg-slate-50': 'dark:bg-slate-800',
    'bg-slate-100': 'dark:bg-slate-950',
    'text-slate-900': 'dark:text-white',
    'text-slate-800': 'dark:text-slate-200',
    'text-slate-700': 'dark:text-slate-300',
    'text-slate-600': 'dark:text-slate-400',
    'text-slate-500': 'dark:text-slate-400',
    'border-slate-100': 'dark:border-slate-800',
    'border-slate-200': 'dark:border-slate-700',
    'text-black': 'dark:text-white',
    // also replacing brand hardcoded combinations we missed
    'bg-gray-50': 'dark:bg-slate-900',
};

const files = walk('./resources/js');
let modifiedCount = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    for (const [light, dark] of Object.entries(map)) {
        // Regex to find "light" class followed by space, quote, or backtick, avoiding duplicates
        // Example: 'bg-white' -> 'bg-white dark:bg-slate-900'
        // Using word boundary but ensuring it is part of a className
        const regex = new RegExp(`\\b${light}\\b(?!.*\\b${dark}\\b)`, 'g');
        content = content.replace(regex, `${light} ${dark}`);
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
    }
}

console.log(`Modified ${modifiedCount} files to include dark mode prefixes.`);
