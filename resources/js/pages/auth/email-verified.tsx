// pages/auth/email-verified.tsx

// Necessary imports
import { Head, Link } from '@inertiajs/react';

// Layout
import AuthLayout from '@/layouts/auth-layout';

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

            <div className="space-y-6 text-center">
                <p>
                    Thank you for verifying your email address. You can now
                    proceed to log in and access your account.
                </p>

                <div className="space-y-4">
                    <Button variant={'default'} asChild>
                        <Link href={route('auth.login')}>
                            <LogIn className="h-4 w-4" />
                            Log in
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant={'link'}
                        size={'sm'}
                        className="p-0 block"
                    >
                        <Link href={route('home')} tabIndex={5}>
                            Go to homepage
                        </Link>
                    </Button>
                </div>
            </div>
        </AuthLayout>
    );
}
