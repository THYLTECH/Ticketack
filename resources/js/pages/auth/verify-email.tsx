// pages/auth/verify-email.tsx

// Necessary imports
import { Form, Head, Link, usePage } from '@inertiajs/react';

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
import { Spinner } from '@/components/ui/spinner';

// Icons
import { RefreshCcw, Send, User } from 'lucide-react';

// Types
import { SharedData } from '@/types';

export default function VerifyEmail() {
    const { auth } = usePage<SharedData>().props;

    return (
        <AuthLayout
            title="Verify your email address"
            description="Please click on the button below to receive an email to verify your email address."
        >
            <Head title="Email verification" />

            <Form method={'POST'} action={route('auth.verification.send')}>
                {({ processing }) => (
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <InputGroup>
                                <InputGroupInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    disabled
                                    placeholder="email@example.com"
                                    defaultValue={auth.user?.email}
                                />
                                <InputGroupAddon>
                                    <User />
                                </InputGroupAddon>
                            </InputGroup>
                        </div>

                        <div className="grid gap-3 text-center">
                            <Button
                                disabled={processing}
                                variant="default"
                                tabIndex={1}
                            >
                                {processing ? <Spinner /> : <Send />}
                                Send verification email
                            </Button>
                            <Button
                                disabled={processing}
                                variant="secondary"
                                tabIndex={2}
                                asChild
                            >
                                <Link
                                    href={route('auth.verification.email.edit')}
                                >
                                    <RefreshCcw />
                                    Change email address
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant={'link'}
                                size={'sm'}
                                className="block p-0"
                                tabIndex={3}
                            >
                                <Link href={route('auth.logout')} tabIndex={5}>
                                    Log out
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
