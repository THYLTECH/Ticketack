// pages/auth/forgot-password.tsx

// Necessary imports
import { Form, Head, Link } from '@inertiajs/react';

// Layout
import AuthLayout from '@/layouts/auth/layout';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';

// Icons
import { LoaderCircle, Send, User } from 'lucide-react';

export default function ForgotPassword() {
    return (
        <AuthLayout
            title="Forgot password"
            description="Enter your email to receive a password reset link"
        >
            <Head title="Forgot password" />

            <Form
                method={'POST'}
                action={route('auth.password.email')}
                resetOnSuccess
            >
                {({ processing, errors }) => (
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <InputGroup>
                                <InputGroupInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    placeholder="email@example.com"
                                    aria-invalid={
                                        errors.email ? 'true' : 'false'
                                    }
                                    tabIndex={1}
                                />
                                <InputGroupAddon>
                                    <User />
                                </InputGroupAddon>
                            </InputGroup>
                        </div>

                        <div className="grid gap-3">
                            <Button
                                type={'submit'}
                                disabled={processing}
                                tabIndex={2}
                            >
                                {processing ? (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                                Send reset link
                            </Button>
                            <div className="space-x-1 text-center text-sm text-muted-foreground">
                                <span>Or, return to</span>
                                <Button
                                    asChild
                                    variant={'link'}
                                    size={'sm'}
                                    className="p-0"
                                    type={'button'}
                                    tabIndex={3}
                                >
                                    <Link href={route('auth.login')}>
                                        log in
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
