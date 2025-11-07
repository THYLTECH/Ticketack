// pages/welcome.tsx

// Necessary imports
import { Head, Link, usePage } from '@inertiajs/react';
import { useUpdateThemes } from '@/hooks/use-update-theme';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Shadcn UI Components
import { Button } from '@/components/ui/button';

// Types
import { type SharedData } from '@/types';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const __ = useTrans();
    useUpdateThemes();

    return (
        <>
            <Head title="Landing page" />
            <div className="flex min-h-screen flex-col items-center p-6 lg:justify-center lg:p-8 ">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Button asChild variant={'outline'}>
                                <Link href={route('dashboard')}>{__('landing.pages.buttons.dashboard')}</Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild variant={'ghost'}>
                                    <Link href={route('auth.login')}>{__('landing.pages.buttons.login')}</Link>
                                </Button>
                                <Button asChild variant={'outline'}>
                                    <Link href={route('auth.register')}>
                                        {__('landing.pages.buttons.register')}
                                    </Link>
                                </Button>
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full max-w-3xl items-start justify-start lg:grow">
                    <h1 className="text-4xl font-bold">{__('landing.pages.title')}</h1>
                </div>
            </div>
        </>
    );
}
