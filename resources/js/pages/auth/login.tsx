// pages/auth/login.tsx

// Necessary imports
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

// Hooks
import { useTrans } from '@/lib/translation';

// Layout
import AuthLayout from '@/layouts/auth/layout';

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

    const __ = useTrans();

    return (
        <AuthLayout
            title={__('auth.login.title', 'Log in to your account')}
            description={__(
                'auth.login.description',
                'Enter your email and password below to log in',
            )}
        >
            <Head title={__('auth.login.header', 'Log in')} />

            <Form
                action={route('auth.login.store')}
                method={'POST'}
                resetOnSuccess={['password']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">
                                {__('auth.login.email_label', 'Email Address')}
                            </Label>
                            <InputGroup>
                                <InputGroupInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
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
                                <Label htmlFor="password">
                                    {__(
                                        'auth.login.password_label',
                                        'Password',
                                    )}
                                </Label>
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
                                            {__(
                                                'auth.login.forgot_password',
                                                'Forgot your password?',
                                            )}
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
                                            onClick={() => setVisible(false)}
                                            tabIndex={6}
                                        >
                                            <EyeOff />
                                        </Button>
                                    ) : (
                                        <Button
                                            type={'button'}
                                            variant={'ghost'}
                                            size={'icon-sm'}
                                            onClick={() => setVisible(true)}
                                            tabIndex={6}
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
                            <Label htmlFor="remember">
                                {__('auth.login.remember_label', 'Remember me')}
                            </Label>
                        </div>

                        <div className="grid gap-3">
                            <Button
                                type="submit"
                                tabIndex={4}
                                disabled={processing}
                            >
                                {processing ? <Spinner /> : <LogIn />}
                                {__('auth.login.submit_button', 'Log in')}
                            </Button>

                            <Button
                                type="button"
                                variant={'secondary'}
                                className="w-full"
                                tabIndex={7}
                                disabled={processing}
                                asChild
                            >
                                <Link href={route('home')}>
                                    {__(
                                        'auth.login.home_link',
                                        'Go to homepage',
                                    )}
                                </Link>
                            </Button>
                            <div className="space-x-1 text-center text-sm text-muted-foreground">
                                <span>
                                    {__(
                                        'auth.login.register_link',
                                        "Don't have an account?",
                                    )}
                                </span>
                                <Button
                                    asChild
                                    variant={'link'}
                                    size={'sm'}
                                    className="p-0"
                                >
                                    <Link
                                        href={route('auth.register')}
                                        tabIndex={8}
                                    >
                                        {__(
                                            'auth.login.register_link_text',
                                            'Sign Up',
                                        )}
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
