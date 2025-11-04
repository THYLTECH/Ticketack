// pages/auth/change-email.tsx

// Necessary imports
import { Form, Head, Link, usePage } from '@inertiajs/react';
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
import { Eye, EyeOff, Lock, RefreshCcw, Send, User } from 'lucide-react';

// Types
import { SharedData } from '@/types';

export default function ChangeEmail() {
    const { auth } = usePage<SharedData>().props;

    const [visible, setVisible] = useState(false);

    return (
        <AuthLayout
            title="Change your email address"
            description="Update your email address to keep your account secure or if your current one is invalid."
        >
            <Head title="Change email" />

            <Form
                action={route('auth.verification.email.update')}
                method={'POST'}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <InputGroup>
                                <InputGroupInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    placeholder="email@example.com"
                                    defaultValue={auth.user?.email}
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

                        <div className="grid gap-3">
                            <Button
                                type="submit"
                                tabIndex={4}
                                disabled={processing}
                            >
                                {processing ? <Spinner /> : <RefreshCcw />}
                                Change email address
                            </Button>
                            <Button
                                type="submit"
                                tabIndex={5}
                                disabled={processing}
                                variant={'secondary'}
                                asChild
                            >
                                <Link href={route('auth.verification.notice')}>
                                    <Send />
                                    Verify email address
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant={'link'}
                                size={'sm'}
                                className="p-0"
                                tabIndex={6}
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
