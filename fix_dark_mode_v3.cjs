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
    // Backgrounds
    'bg-white': 'dark:bg-slate-900',
    'bg-slate-50': 'dark:bg-slate-800',
    'bg-slate-100': 'dark:bg-slate-950',
    'bg-slate-200': 'dark:bg-slate-800',
    'bg-slate-300': 'dark:bg-slate-700',
    'bg-slate-400': 'dark:bg-slate-600',
    'bg-gray-50': 'dark:bg-slate-900',
    'bg-gray-100': 'dark:bg-slate-800',
    'bg-gray-200': 'dark:bg-slate-700',
    'bg-red-50': 'dark:bg-red-900',
    'bg-red-100': 'dark:bg-red-800',
    'bg-green-50': 'dark:bg-green-900',
    'bg-emerald-50': 'dark:bg-emerald-900',
    'bg-brand-50': 'dark:bg-brand-900',
    'bg-brand-100': 'dark:bg-brand-800',
    'bg-blue-50': 'dark:bg-blue-900',
    'bg-indigo-50': 'dark:bg-indigo-900',

    // Text colors
    'text-slate-900': 'dark:text-white',
    'text-slate-800': 'dark:text-slate-200',
    'text-slate-700': 'dark:text-slate-300',
    'text-slate-600': 'dark:text-slate-400',
    'text-slate-500': 'dark:text-slate-400',
    'text-slate-400': 'dark:text-slate-500',
    'text-slate-300': 'dark:text-slate-600',
    'text-black': 'dark:text-white',
    'text-gray-900': 'dark:text-white',
    'text-gray-800': 'dark:text-slate-200',
    'text-gray-700': 'dark:text-slate-300',
    'text-gray-600': 'dark:text-slate-400',
    'text-gray-500': 'dark:text-slate-400',
    'text-red-800': 'dark:text-red-300',
    'text-red-700': 'dark:text-red-400',
    'text-red-600': 'dark:text-red-400',
    'text-red-500': 'dark:text-red-400',
    'text-green-800': 'dark:text-green-300',
    'text-green-700': 'dark:text-green-400',
    'text-green-600': 'dark:text-green-400',
    'text-green-500': 'dark:text-green-400',
    'text-emerald-800': 'dark:text-emerald-300',
    'text-emerald-700': 'dark:text-emerald-400',
    'text-emerald-600': 'dark:text-emerald-400',
    'text-emerald-500': 'dark:text-emerald-400',
    'text-brand-800': 'dark:text-brand-300',
    'text-brand-700': 'dark:text-brand-300',
    'text-brand-600': 'dark:text-brand-400',
    'text-brand-500': 'dark:text-brand-400',

    // Borders
    'border-slate-100': 'dark:border-slate-800',
    'border-slate-200': 'dark:border-slate-700',
    'border-slate-300': 'dark:border-slate-600',
    'border-slate-400': 'dark:border-slate-500',
    'border-gray-100': 'dark:border-slate-800',
    'border-gray-200': 'dark:border-slate-700',
    'border-gray-300': 'dark:border-slate-600',
    'border-red-100': 'dark:border-red-800',
    'border-red-200': 'dark:border-red-700',
    'border-green-100': 'dark:border-green-800',
    'border-green-200': 'dark:border-green-700',
    'border-emerald-100': 'dark:border-emerald-800',
    'border-emerald-200': 'dark:border-emerald-700',
    'border-brand-100': 'dark:border-brand-800',
    'border-brand-200': 'dark:border-brand-700',
    
    // Rings
    'ring-slate-100': 'dark:ring-slate-800',
    'ring-slate-200': 'dark:ring-slate-700',
    'ring-slate-300': 'dark:ring-slate-600',
    'ring-brand-100': 'dark:ring-brand-900',
    'ring-brand-200': 'dark:ring-brand-800',
};

const fullMap = {};
for (const [light, dark] of Object.entries(map)) {
    fullMap[light] = dark;
    for (const opacity of [5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95]) {
        fullMap[`${light}/${opacity}`] = `${dark}/${opacity}`;
    }
}

const files = walk('./resources/js');
let modifiedCount = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // 1. Recover lost light mode opacities from previous script
    content = content.replace(/\b([a-z0-9-]+)\s+(dark:[a-z0-9-]+)\/([0-9]+)\b/g, (match, light, dark, opacity) => {
        return `${light}/${opacity} ${dark}/${opacity}`;
    });

    const sortedEntries = Object.entries(fullMap).sort((a, b) => b[0].length - a[0].length);

    for (const [light, dark] of sortedEntries) {
        // Base
        let regexBase = new RegExp(`(?<![:a-zA-Z0-9-])\\b${light.replace('/', '\\/')}\\b(?!/)`, 'g');
        content = content.replace(regexBase, (match, offset, string) => {
            const lookahead = string.substring(offset, offset + 40);
            if (lookahead.includes(dark)) return match;
            return `${match} ${dark}`;
        });

        // Hover
        const darkHover = dark.replace('dark:', 'dark:hover:');
        let regexHover = new RegExp(`(?<![:a-zA-Z0-9-])hover:${light.replace('/', '\\/')}\\b(?!/)`, 'g');
        content = content.replace(regexHover, (match, offset, string) => {
            const lookahead = string.substring(offset, offset + 40);
            if (lookahead.includes(darkHover)) return match; 
            return `${match} ${darkHover}`;
        });
        
        // Focus
        const darkFocus = dark.replace('dark:', 'dark:focus:');
        let regexFocus = new RegExp(`(?<![:a-zA-Z0-9-])focus:${light.replace('/', '\\/')}\\b(?!/)`, 'g');
        content = content.replace(regexFocus, (match, offset, string) => {
            const lookahead = string.substring(offset, offset + 40);
            if (lookahead.includes(darkFocus)) return match; 
            return `${match} ${darkFocus}`;
        });
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
    }
}
console.log(`Modified ${modifiedCount} files for complete UI dark mode support.`);
