// pages/welcome.tsx

import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Landing page" />
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Button asChild variant={'outline'}>
                                <Link href={route('dashboard')}>Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild variant={'ghost'}>
                                    <Link href={route('auth.login')}>Log in</Link>
                                </Button>
                                <Button asChild variant={'outline'}>
                                    <Link href={route('auth.register')}>
                                        Register
                                    </Link>
                                </Button>
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full max-w-3xl items-start justify-start lg:grow">
                    <h1 className="text-4xl font-bold">Landing page</h1>
                </div>
            </div>
        </>
    );
}
