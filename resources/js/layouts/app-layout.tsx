// layouts/app-layout.tsx

// Necessary imports
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

// Types
import type { BreadcrumbItem, SharedData } from '@/types';

// Shadcn UI Components
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

// Custom components
import { AppSidebar } from '@/layouts/app/sidebar';
import { AppHeader } from '@/layouts/app/header';
import { CustomToaster } from '@/components/custom-toaster';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const isOpen = usePage<SharedData>().props.sidebarOpen;

    const { props: pageProps } = usePage<{
        flash?: { success?: string; error?: string };
        success?: string;
        error?: string;
        errors?: Record<string, string>;
    }>();

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
