// pages/auth/register.tsx

// Necessary imports
import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';

// Layout
import AuthLayout from '@/layouts/auth-layout';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

// Icons
import { Eye, EyeOff, UserPlus } from 'lucide-react';

export default function Register() {
    const [visible, setVisible] = useState(false);

    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />
            <Form
                action={route('auth.register.store')}
                method={'POST'}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                    aria-invalid={
                                        errors.name ? 'true' : 'false'
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                    aria-invalid={
                                        errors.email ? 'true' : 'false'
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <InputGroup>
                                    <InputGroupInput
                                        id="password"
                                        type={visible ? 'text' : 'password'}
                                        name="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="current-password"
                                        placeholder="Password"
                                        aria-invalid={
                                            errors.password ? 'true' : 'false'
                                        }
                                    />
                                    <InputGroupAddon align="inline-end">
                                        {visible ? (
                                            <Button
                                                type={'button'}
                                                variant={'ghost'}
                                                size={'icon-sm'}
                                                onClick={() =>
                                                    setVisible(false)
                                                }
                                            >
                                                <EyeOff />
                                            </Button>
                                        ) : (
                                            <Button
                                                type={'button'}
                                                variant={'ghost'}
                                                size={'icon-sm'}
                                                onClick={() => setVisible(true)}
                                            >
                                                <Eye />
                                            </Button>
                                        )}
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                    aria-invalid={
                                        errors.password_confirmation
                                            ? 'true'
                                            : 'false'
                                    }
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={5}
                                data-test="register-user-button"
                                disabled={processing}
                            >
                                {processing ? <Spinner /> : <UserPlus />}
                                Create account
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Button
                                asChild
                                variant={'link'}
                                size={'sm'}
                                className="p-0"
                            >
                                <Link href={route('auth.login')} tabIndex={6}>
                                    Log in
                                </Link>
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
