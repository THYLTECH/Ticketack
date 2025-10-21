// layouts/auth-layout.tsx

// Necessary imports
import { type ReactNode, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

// Types
import { type BreadcrumbItem } from '@/types';

// Layout
import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

// Custom componens
import { CustomToaster } from "@/layouts/app/custom-toaster";

export default function AuthLayout({
    children,
    title,
    description,
    ...props
}: {
    children: React.ReactNode;
    title: string;
    description: string;
}) {
    const { props: pageProps } = usePage<{
		flash?: { success?: string; error?: string };
		success?: string;
		error?: string;
        errors?: Record<string, string>;
	}>();

    useEffect(() => {
        console.log('pageProps', pageProps);
    }, [pageProps]);

    return (
        <AuthLayoutTemplate title={title} description={description} {...props}>
            {children}
            <CustomToaster {...pageProps}/>
        </AuthLayoutTemplate>
    );
}
