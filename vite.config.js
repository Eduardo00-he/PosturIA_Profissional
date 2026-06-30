import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

function getPageEntries(dir) {
    const entries = [];
    for (const file of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, file.name);
        if (file.isDirectory()) {
            entries.push(...getPageEntries(full));
        } else if (file.name.endsWith('.jsx')) {
            entries.push(full.replace(/\\/g, '/'));
        }
    }
    return entries;
}

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/App.jsx', ...getPageEntries('resources/js/Pages')],
            refresh: true,
        }),
        react(),
    ],
});