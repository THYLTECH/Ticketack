// pages/auth/register.tsx

// Necessary imports
import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';

// Layout
import AuthLayout from '@/layouts/auth/layout';

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
            >
                {({ processing, errors }) => (
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                name="name"
                                required
                                autoFocus
                                placeholder="Full name"
                                aria-invalid={errors.name ? 'true' : 'false'}
                                tabIndex={1}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                required
                                placeholder="email@example.com"
                                aria-invalid={errors.email ? 'true' : 'false'}
                                tabIndex={2}
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
                                    placeholder="Password"
                                    aria-invalid={
                                        errors.password ? 'true' : 'false'
                                    }
                                    tabIndex={3}
                                />
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

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                Confirm password
                            </Label>
                            <Input
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
                                tabIndex={4}
                            />
                        </div>

                        <div className="grid gap-3">
                            <Button
                                type={'submit'}
                                disabled={processing}
                                tabIndex={5}
                            >
                                {processing ? <Spinner /> : <UserPlus />}
                                Create account
                            </Button>
                            <div className="space-x-1 text-center text-sm text-muted-foreground">
                                <span>Already have an account?</span>
                                <Button
                                    asChild
                                    variant={'link'}
                                    size={'sm'}
                                    className="p-0"
                                    type={'button'}
                                    tabIndex={7}
                                >
                                    <Link href={route('auth.login')}>
                                        Log in
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
