// layouts/app-layout.tsx

// Necessary imports
import { usePage } from '@inertiajs/react';
import { useEffect, type ReactNode } from 'react';

// Types
import type { BreadcrumbItem, SharedData } from '@/types';

// Shadcn UI Components
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

// Custom components
import { CustomToaster } from '@/components/custom-toaster';
import { AppHeader } from '@/layouts/app/header';
import { AppSidebar } from '@/layouts/app/sidebar';

// Custom Hooks
import { initializeTheme } from '@/hooks/use-appearance';
import { initializeColorScheme } from '@/hooks/use-color-scheme';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs }: AppLayoutProps) => {
    const isOpen = usePage<SharedData>().props.sidebarOpen;

    const { props: pageProps } = usePage<{
        flash?: { success?: string; error?: string };
        success?: string;
        error?: string;
        errors?: Record<string, string>;
    }>();

    const user = usePage<SharedData>().props.auth.user;

    useEffect(() => {
        if (user) {
            const currentAppearance =
                localStorage.getItem('appearance') || 'system';
            const currentColorScheme =
                localStorage.getItem('color-scheme') || 'default';

            if (
                currentAppearance !== user.theme ||
                currentColorScheme !== user.color_scheme
            ) {
                localStorage.setItem('appearance', user.theme);
                localStorage.setItem('color-scheme', user.color_scheme);

                initializeTheme();
                initializeColorScheme();
            }
        }
    }, []);

    return (
        <SidebarProvider defaultOpen={isOpen}>
            <AppSidebar />
            <SidebarInset className="overflow-x-hidden">
                <AppHeader breadcrumbs={breadcrumbs} />
                {children}
                <CustomToaster {...pageProps} />
            </SidebarInset>
        </SidebarProvider>
    );
};
