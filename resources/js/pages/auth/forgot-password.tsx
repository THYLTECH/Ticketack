// pages/auth/forgot-password.tsx

// Necessary imports
import { Form, Head } from '@inertiajs/react';

// Layout
import AuthLayout from '@/layouts/auth-layout';

// Custom components
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Icons
import { LoaderCircle, Send } from 'lucide-react';

export default function ForgotPassword() {
    return (
        <AuthLayout
            title="Forgot password"
            description="Enter your email to receive a password reset link"
        >
            <Head title="Forgot password" />

            <div className="space-y-6">
                <Form method={'POST'} action={route('auth.password.email')}>
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="email@example.com"
                                    aria-invalid={errors.email ? 'true' : 'false'}
                                />
                            </div>

                            <div className="my-6 flex items-center justify-start">
                                <Button
                                    className="w-full"
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing ? (
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className='h-4 w-4'/>
                                    )}
                                    Send email password reset link
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="space-x-1 text-center text-sm text-muted-foreground">
                    <span>Or, return to</span>
                    <TextLink href={route('auth.login')}>log in</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
