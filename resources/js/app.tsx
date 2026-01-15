import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { configureEcho } from '@laravel/echo-react';

// Polyfill pour crypto.randomUUID dans les contextes non sécurisés (HTTP)
if (typeof window.crypto === 'undefined') {
    Object.defineProperty(window, 'crypto', {
        value: {},
        writable: true,
        configurable: true,
    });
}
if (typeof window.crypto.randomUUID === 'undefined') {
    // UUID v4 format pattern
    window.crypto.randomUUID = function (): `${string}-${string}-${string}-${string}-${string}` {
        return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) => {
            const n = Number(c);
            return (n ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (n / 4)))).toString(16);
        }) as `${string}-${string}-${string}-${string}-${string}`;
    };
}

configureEcho({
    broadcaster: 'reverb',
});
// import { initializeTheme } from './hooks/use-appearance';
// import { initializeColorScheme } from './hooks/use-color-scheme';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: 'var(--color-primary)',
    },
});

// This will set light/dark mode on page load
// initializeTheme();
// initializeColorScheme();
