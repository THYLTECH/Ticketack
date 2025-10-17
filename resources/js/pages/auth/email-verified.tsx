// pages/auth/verify-email.tsx

// Necessary imports
import { Head, Link } from '@inertiajs/react';

// Layout
import AuthLayout from '@/layouts/auth-layout';

// Custom Components
import TextLink from '@/components/text-link';

// Shadcn UI Components
import { Button } from '@/components/ui/button';

// Icons
import { LogIn } from 'lucide-react';

export default function VerifyEmail() {
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

                    <TextLink
                        href={route('home')}
                        className="mx-auto block text-sm"
                    >
                        Go to homepage
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
