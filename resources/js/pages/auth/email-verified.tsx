// pages/auth/email-verified.tsx

// Necessary imports
import { Head, Link } from '@inertiajs/react';

// Layout
import AuthLayout from '@/layouts/auth/layout';

// Shadcn UI Components
import { Button } from '@/components/ui/button';

// Icons
import { LogIn } from 'lucide-react';

export default function EmailVerified() {
    return (
        <AuthLayout
            title="Email verified!"
            description="Your email address has been successfully verified."
        >
            <Head title="Email verified!" />

            <div className="grid gap-3 text-center">
                <Button variant={'default'} asChild tabIndex={1}>
                    <Link href={route('auth.login')}>
                        <LogIn className="h-4 w-4" />
                        Log in
                    </Link>
                </Button>
                <Button asChild variant={'link'} size={'sm'}>
                    <Link href={route('home')} tabIndex={2}>
                        Go to homepage
                    </Link>
                </Button>
            </div>
        </AuthLayout>
    );
}
