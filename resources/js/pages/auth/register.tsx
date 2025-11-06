// pages/auth/register.tsx

// Necessary imports
import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';

// Translation Hook
import { useTrans } from '@/lib/translation';

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
    const __ = useTrans();

    return (
        <AuthLayout
            title={__('auth.pages.register.title')}
            description={__('auth.pages.register.description')}
        >
            <Head title={__('auth.pages.register.header')} />
            <Form
                action={route('auth.register.store')}
                method={'POST'}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
            >
                {({ processing, errors }) => (
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                {__('auth.pages.register.name_label')}
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                name="name"
                                required
                                autoFocus
                                placeholder={__('auth.pages.register.name_placeholder')}
                                aria-invalid={errors.name ? 'true' : 'false'}
                                tabIndex={1}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">
                                {__('auth.pages.register.email_label')}
                            </Label>
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
                            <Label htmlFor="password">
                                {__('auth.pages.register.password_label')}
                            </Label>
                            <InputGroup>
                                <InputGroupInput
                                    id="password"
                                    type={visible ? 'text' : 'password'}
                                    name="password"
                                    required
                                    placeholder={__('auth.pages.register.password_placeholder')}
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
                                {__('auth.pages.register.password_confirm_label')}
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                required
                                placeholder={__('auth.pages.register.password_confirm_placeholder')}
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
                                {__('auth.pages.register.submit_button')}
                            </Button>
                            <div className="space-x-1 text-center text-sm text-muted-foreground">
                                <span>
                                    {__('auth.pages.register.already_text')}
                                </span>
                                <Button
                                    asChild
                                    variant={'link'}
                                    size={'sm'}
                                    className="p-0"
                                    type={'button'}
                                    tabIndex={7}
                                >
                                    <Link href={route('auth.login')}>
                                        {__('auth.pages.register.login_link')}
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
