// layouts/app-layout.tsx

// Necessary imports
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';
import { useUpdateThemes } from '@/hooks/use-update-theme';

// Types
import type { BreadcrumbItem, SharedData } from '@/types';

// Shadcn UI Components
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

// Custom components
import { CustomToaster } from '@/components/custom-toaster';
import { AppHeader } from '@/layouts/app/header';
import { AppSidebar } from '@/layouts/app/sidebar';

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

    useUpdateThemes();

    return (
        <SidebarProvider defaultOpen={isOpen}>
            <AppSidebar />
            <SidebarInset className="overflow-x-hidden">
                <AppHeader breadcrumbs={breadcrumbs} />
                <main className='px-4 py-6'>
                    {children}
                </main>
                <CustomToaster {...pageProps} />
            </SidebarInset>
        </SidebarProvider>
    );
};
