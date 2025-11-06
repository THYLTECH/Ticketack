// pages/auth/email-verified.tsx

// Necessary imports
import { Head, Link } from '@inertiajs/react';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Layout
import AuthLayout from '@/layouts/auth/layout';

// Shadcn UI Components
import { Button } from '@/components/ui/button';

// Icons
import { LogIn } from 'lucide-react';

export default function EmailVerified() {
    const __ = useTrans();

    return (
        <AuthLayout
            title={__('auth.pages.email_verified.title')}
            description={__('auth.pages.email_verified.description')}
        >
            <Head title={__('auth.pages.email_verified.header')} />

            <div className="grid gap-3 text-center">
                <Button variant={'default'} asChild tabIndex={1}>
                    <Link href={route('auth.login')}>
                        <LogIn className="h-4 w-4" />
                        {__('auth.pages.email_verified.login_button')}
                    </Link>
                </Button>
                <Button asChild variant={'secondary'} tabIndex={2}>
                    <Link href={route('home')}>
                        {__('auth.pages.email_verified.home_button')}
                    </Link>
                </Button>
            </div>
        </AuthLayout>
    );
}
