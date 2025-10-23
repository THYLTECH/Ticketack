// pages/auth/verify-email.tsx

// Necessary imports
import { Form, Head, Link } from '@inertiajs/react';

// Layout
import AuthLayout from '@/layouts/auth-layout';

// Custom components

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

// Icons
import { Send } from 'lucide-react';

export default function VerifyEmail() {
    return (
        <AuthLayout
            title="Verify email"
            description="Please click on the button below to receive an email to verify your email address."
        >
            <Head title="Email verification" />

            <Form
                method={'POST'}
                action={route('auth.verification.send')}
                className="space-y-6 text-center"
            >
                {({ processing }) => (
                    <>
                        <Button disabled={processing} variant="secondary">
                            {processing ? <Spinner /> : <Send />}
                            Send verification email
                        </Button>
                        <Button
                            asChild
                            variant={'link'}
                            size={'sm'}
                            className="block p-0"
                        >
                            <Link href={route('auth.logout')} tabIndex={5}>
                                Log out
                            </Link>
                        </Button>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
