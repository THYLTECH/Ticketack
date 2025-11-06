// pages/auth/verify-email.tsx

// Necessary imports
import { Form, Head, Link, usePage } from '@inertiajs/react';

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
import { Spinner } from '@/components/ui/spinner';

// Icons
import { RefreshCcw, Send, User } from 'lucide-react';

// Types
import { SharedData } from '@/types';

export default function VerifyEmail() {
    const { auth } = usePage<SharedData>().props;
    const __ = useTrans();

    return (
        <AuthLayout
            title={__('auth.pages.verify_email.title')}
            description={__('auth.pages.verify_email.description')}
        >
            <Head title={__('auth.pages.verify_email.header')} />

            <Form method={'POST'} action={route('auth.verification.send')}>
                {({ processing }) => (
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">
                                {__('auth.pages.verify_email.email_label')}
                            </Label>
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

                        <div className="grid gap-3">
                            <Button
                                disabled={processing}
                                variant="default"
                                tabIndex={1}
                            >
                                {processing ? <Spinner /> : <Send />}
                                {__('auth.pages.verify_email.submit_button')}
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
                                    {__('auth.pages.verify_email.change_email_button')}
                                </Link>
                            </Button>
                            <div className="text-center">
                                <Button
                                    asChild
                                    variant={'link'}
                                    size={'sm'}
                                    tabIndex={3}
                                >
                                    <Link href={route('auth.logout')}>
                                        {__('auth.pages.verify_email.logout_link')}
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
