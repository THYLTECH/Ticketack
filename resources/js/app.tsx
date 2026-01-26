import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { configureEcho } from '@laravel/echo-react';
import React from 'react';
import { OnboardingProvider } from '@/components/onboarding/onboarding-provider';

if (typeof window.crypto === 'undefined') {
    Object.defineProperty(window, 'crypto', {
        value: {},
        writable: true,
        configurable: true,
    });
}
if (typeof window.crypto.randomUUID === 'undefined') {
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

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ).then((mod) => {
            type PageModule = { default: React.ComponentType & { layout?: (page: React.ReactNode) => React.ReactNode } };
            const module = mod as PageModule;
            const page = module.default;
            const previousLayout = page.layout;
            page.layout = (pageNode: React.ReactNode) => (
                <OnboardingProvider>
                    {previousLayout ? previousLayout(pageNode) : pageNode}
                </OnboardingProvider>
            );
            return module;
        }),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: 'var(--color-primary)',
    },
});

