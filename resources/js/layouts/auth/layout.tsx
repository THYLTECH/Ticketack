// layouts/auth-layout.tsx

// Necessary imports
import { Link, usePage } from '@inertiajs/react';
import { useUpdateThemes } from '@/hooks/use-update-theme';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Layout
import { AuthHeader } from '@/layouts/auth/header';

// Custom components
import AppLogoIcon from '@/components/app-logo-icon';
import { CustomToaster } from '@/components/custom-toaster';

// Types
import { type SharedData } from '@/types';

export default function AuthLayout({
    children,
    title,
    description,
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

    const { name } = usePage<SharedData>().props;
    const __ = useTrans();

    useUpdateThemes();

    return (
        <main className="flex min-h-dvh flex-col">
            <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
                <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                    <div className="absolute inset-0 bg-zinc-900" />
                    <div className="relative z-20 flex items-center text-lg font-medium">
                        <AppLogoIcon className="mr-2 size-8 fill-current text-white" />
                        {name}
                    </div>
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg">{name}</p>
                            <footer className="text-sm text-neutral-300">
                                {__('auth.layout.description')}
                            </footer>
                        </blockquote>
                    </div>
                </div>

                <div className="relative flex h-full w-full items-center lg:p-8">
                    <AuthHeader />

                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <Link
                            href={route('home')}
                            className="relative z-20 flex items-center justify-center lg:hidden"
                        >
                            <AppLogoIcon className="h-10 fill-current text-black sm:h-12" />
                        </Link>
                        <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-sm text-balance text-muted-foreground">
                                {description}
                            </p>
                        </div>
                        {children}
                    </div>
                </div>
            </div>

            <CustomToaster {...pageProps} />
        </main>
    );
}
