import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';
import { useUpdateThemes } from '@/hooks/use-update-theme';

import type { BreadcrumbItem, SharedData } from '@/types';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import { CustomToaster } from '@/components/custom-toaster';
import { AppHeader } from '@/layouts/app/header';
import { AppSidebar } from '@/layouts/app/sidebar';

import { WelcomeModal } from '@/components/onboarding/welcome-modal';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs }: AppLayoutProps) => {
    const { sidebarOpen } = usePage<SharedData>().props;

    const { props: pageProps } = usePage<{
        flash?: { success?: string; error?: string };
        success?: string;
        error?: string;
        errors?: Record<string, string>;
    }>();

    useUpdateThemes();

    return (
        <SidebarProvider defaultOpen={sidebarOpen}>
            <AppSidebar />
            <SidebarInset className="overflow-x-hidden">
                <AppHeader breadcrumbs={breadcrumbs} />
                <main className='px-4 py-6'>
                    {children}
                </main>
                <CustomToaster {...pageProps} />
                <WelcomeModal />
            </SidebarInset>
        </SidebarProvider>
    );
};
