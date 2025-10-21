// layouts/app-layout.tsx

// Necessary imports
import { type ReactNode } from 'react';
import { usePage } from '@inertiajs/react';

// Types
import { type BreadcrumbItem } from '@/types';

// Layout
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';

// Custom componens
import { CustomToaster } from "@/layouts/app/custom-toaster";

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
	const { props: pageProps } = usePage<{
		flash?: { success?: string; error?: string };
		success?: string;
		error?: string;
		errors?: Record<string, string>;
	}>();

	return (
		<AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
			{children}
			<CustomToaster {...pageProps} />
		</AppLayoutTemplate>
	);
};
