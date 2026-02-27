import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

function hexToRgb(hex) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }
    return [r, g, b];
}

function mix(color1, color2, weight) {
    const w = weight / 100;
    const r = Math.round(color1[0] * w + color2[0] * (1 - w));
    const g = Math.round(color1[1] * w + color2[1] * (1 - w));
    const b = Math.round(color1[2] * w + color2[2] * (1 - w));
    return `${r} ${g} ${b}`;
}

export default function ThemeProvider({ children }) {
    const { appSettings } = usePage().props;

    useEffect(() => {
        const themeMode = appSettings?.theme_mode || 'system';
        const root = window.document.documentElement;

        if (themeMode === 'dark' || (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        const primaryHex = appSettings?.brand_color_primary || '#6366f1';
        const rgb = hexToRgb(primaryHex);
        const white = [255, 255, 255];
        const black = [0, 0, 0];

        root.style.setProperty('--color-brand-50', mix(rgb, white, 5));
        root.style.setProperty('--color-brand-100', mix(rgb, white, 10));
        root.style.setProperty('--color-brand-200', mix(rgb, white, 30));
        root.style.setProperty('--color-brand-300', mix(rgb, white, 50));
        root.style.setProperty('--color-brand-400', mix(rgb, white, 70));
        root.style.setProperty('--color-brand-500', `${rgb[0]} ${rgb[1]} ${rgb[2]}`);
        root.style.setProperty('--color-brand-600', mix(rgb, black, 85));
        root.style.setProperty('--color-brand-700', mix(rgb, black, 70));
        root.style.setProperty('--color-brand-800', mix(rgb, black, 50));
        root.style.setProperty('--color-brand-900', mix(rgb, black, 30));
        root.style.setProperty('--color-brand-950', mix(rgb, black, 15));

    }, [appSettings?.theme_mode, appSettings?.brand_color_primary]);

    return children;
}
