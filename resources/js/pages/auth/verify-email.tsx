// pages/auth/verify-email.tsx

// Necessary imports
import { Form, Head } from '@inertiajs/react';

// Layout
import AuthLayout from '@/layouts/auth-layout';

// Custom components
import TextLink from '@/components/text-link';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

// Icons
import { Send } from 'lucide-react';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Verify email"
            description="Please verify your email address by clicking on the link we just emailed to you."
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
                            Resend verification email
                        </Button>

                        <TextLink
                            href={route('auth.logout')}
                            className="mx-auto block text-sm"
                        >
                            Log out
                        </TextLink>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
