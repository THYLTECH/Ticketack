// pages/auth/reset-password.tsx

// Necessary imports
import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';

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
import { Eye, EyeOff, Lock, RefreshCcw, User } from 'lucide-react';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const [visible, setVisible] = useState(false);

    return (
        <AuthLayout
            title="Reset password"
            description="Please enter your new password below"
        >
            <Head title="Reset password" />

            <Form
                action={route('auth.password.update')}
                method={'POST'}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <InputGroup>
                                <InputGroupInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    disabled
                                    placeholder="email@example.com"
                                    aria-invalid={
                                        errors.email ? 'true' : 'false'
                                    }
                                    value={email}
                                    tabIndex={1}
                                />
                                <InputGroupAddon>
                                    <User />
                                </InputGroupAddon>
                            </InputGroup>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <InputGroup>
                                <InputGroupInput
                                    id="password"
                                    type={visible ? 'text' : 'password'}
                                    name="password"
                                    required
                                    autoFocus
                                    placeholder="Password"
                                    aria-invalid={
                                        errors.password ? 'true' : 'false'
                                    }
                                    tabIndex={2}
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
                                            tabIndex={5}
                                        >
                                            <EyeOff />
                                        </Button>
                                    ) : (
                                        <Button
                                            type={'button'}
                                            variant={'ghost'}
                                            size={'icon-sm'}
                                            onClick={() => setVisible(true)}
                                            tabIndex={5}
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
                            <InputGroup>
                                <InputGroupInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    required
                                    placeholder="Confirm password"
                                    aria-invalid={
                                        errors.password_confirmation
                                            ? 'true'
                                            : 'false'
                                    }
                                    tabIndex={3}
                                />
                                <InputGroupAddon>
                                    <Lock />
                                </InputGroupAddon>
                            </InputGroup>
                        </div>

                        <div className="grid gap-3">
                            <Button
                                type="submit"
                                disabled={processing}
                                tabIndex={4}
                            >
                                {processing ? <Spinner /> : <RefreshCcw />}
                                Reset password
                            </Button>
                            <div className="space-x-1 text-center text-sm text-muted-foreground">
                                <span>Or, return to</span>
                                <Button
                                    asChild
                                    variant={'link'}
                                    size={'sm'}
                                    className="p-0"
                                    tabIndex={6}
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
