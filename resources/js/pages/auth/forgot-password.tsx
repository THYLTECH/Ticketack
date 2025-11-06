// pages/auth/forgot-password.tsx

// Necessary imports
import { Form, Head, Link } from '@inertiajs/react';

// Translation Hook
import { useTrans } from '@/lib/translation';

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
    const __ = useTrans();

    return (
        <AuthLayout
            title={__('auth.pages.forgot_password.title')}
            description={__('auth.pages.forgot_password.description')}
        >
            <Head title={__('auth.pages.forgot_password.header')} />

            <Form
                method={'POST'}
                action={route('auth.password.email')}
                resetOnSuccess
            >
                {({ processing, errors }) => (
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">
                                {__('auth.pages.forgot_password.email_label')}
                            </Label>
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
                                {__('auth.pages.forgot_password.submit_button')}
                            </Button>
                            <div className="space-x-1 text-center text-sm text-muted-foreground">
                                <span>
                                    {__('auth.pages.forgot_password.return_text')}
                                </span>
                                <Button
                                    asChild
                                    variant={'link'}
                                    size={'sm'}
                                    className="p-0"
                                    type={'button'}
                                    tabIndex={3}
                                >
                                    <Link href={route('auth.login')}>
                                        {__('auth.pages.forgot_password.login_link')}
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
