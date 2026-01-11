import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { configureEcho } from '@laravel/echo-react';

// Polyfill pour crypto.randomUUID dans les contextes non sécurisés (HTTP)
if (typeof window.crypto === 'undefined') {
    // @ts-ignore
    window.crypto = {};
}
if (typeof window.crypto.randomUUID === 'undefined') {
    // @ts-ignore
    window.crypto.randomUUID = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };
}

configureEcho({
    broadcaster: 'reverb',
});
// import { initializeTheme } from './hooks/use-appearance';
// import { initializeColorScheme } from './hooks/use-color-scheme';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
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

// This will set light / dark mode on load...
// initializeTheme();
// initializeColorScheme();
