// pages/auth/login.tsx

// Necessary imports
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

// Layout
import AuthLayout from '@/layouts/auth-layout';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

// Icons
import { Eye, EyeOff, Lock, LogIn, User } from 'lucide-react';

export default function Login({
    canResetPassword,
}: {
    canResetPassword: boolean;
}) {
    const { props } = usePage<{ old?: Record<string, string | undefined> }>();
    const old = props.old ?? {};

    const [visible, setVisible] = useState(false);

    return (
        <AuthLayout
            title="Log in to your account"
            description="Enter your email and password below to log in"
        >
            <Head title="Log in" />

            <Form
                action={route('auth.login.store')}
                method={'POST'}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
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
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="email@example.com"
                                        defaultValue={old.email ?? ''}
                                        aria-invalid={
                                            errors.email ? 'true' : 'false'
                                        }
                                    />
                                    <InputGroupAddon>
                                        <User />
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        <Button
                                            asChild
                                            variant={'link'}
                                            size={'sm'}
                                            className="ml-auto p-0"
                                        >
                                            <Link
                                                href={route(
                                                    'auth.password.request',
                                                )}
                                                tabIndex={5}
                                            >
                                                Forgot password?
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                                <InputGroup>
                                    <InputGroupInput
                                        id="password"
                                        type={visible ? 'text' : 'password'}
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Password"
                                        aria-invalid={
                                            errors.password ? 'true' : 'false'
                                        }
                                    />
                                    <InputGroupAddon>
                                        <Lock />
                                    </InputGroupAddon>
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

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    value={'1'}
                                    tabIndex={3}
                                    defaultChecked={old.remember === '1'}
                                />
                                <Label htmlFor="remember">Remember me</Label>
                            </div>

                            <div className="flex flex-col items-center gap-3">
                                <Button
                                    type="submit"
                                    className="mt-4 w-full"
                                    tabIndex={4}
                                    disabled={processing}
                                >
                                    {processing ? <Spinner /> : <LogIn />}
                                    Log in
                                </Button>

                                <Button
                                    type="button"
                                    variant={'secondary'}
                                    className="w-full"
                                    tabIndex={6}
                                    disabled={processing}
                                    asChild
                                >
                                    <Link href={route('home')}>
                                        Go to homepage
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Button
                                asChild
                                variant={'link'}
                                size={'sm'}
                                className="p-0"
                            >
                                <Link
                                    href={route('auth.register')}
                                    tabIndex={5}
                                >
                                    Sign Up
                                </Link>
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
