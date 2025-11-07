// utils/use-update-themes.ts
import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { initializeTheme } from '@/hooks/use-appearance';
import { initializeColorScheme } from '@/hooks/use-color-scheme';
import type { SharedData } from '@/types';

export function useUpdateThemes() {
    const user = usePage<SharedData>().props.auth.user;

    useEffect(() => {
        const currentAppearance = localStorage.getItem('appearance') || 'system';
        const currentColorScheme = localStorage.getItem('color-scheme') || 'default';

        if (user) {
            if (
                currentAppearance !== user.theme ||
                currentColorScheme !== user.color_scheme
            ) {
                localStorage.setItem('appearance', user.theme);
                localStorage.setItem('color-scheme', user.color_scheme);

                initializeTheme();
                initializeColorScheme();
            }
        } else {
            if (currentColorScheme !== 'default') {
                localStorage.setItem('color-scheme', 'default');
                initializeColorScheme();
            }
        }
    }, [user]);
}
