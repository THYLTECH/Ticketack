// pages/settings/password.tsx

// Necessary imports
import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

// Custom components
import HeadingSmall from '@/components/heading-small';

// Layout
import AppLayout from '@/layouts/app/layout';
import SettingsLayout from '@/layouts/settings/layout';

// Types
import { type BreadcrumbItem } from '@/types';

// Icons
import { Save } from 'lucide-react';

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const __ = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('settings.pages.breadcrumbs.settings'),
            href: route('settings.profile.edit'),
        },
        {
            title: __('settings.pages.breadcrumbs.password'),
            href: route('settings.password.edit'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('settings.pages.password.head_title')} />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title={__('settings.pages.password.form.title')}
                        description={__(
                            'settings.pages.password.form.description',
                        )}
                    />

                    <Form
                        method={'PUT'}
                        action={route('settings.password.update')}
                        options={{
                            preserveScroll: true,
                        }}
                        resetOnError={[
                            'password',
                            'password_confirmation',
                            'current_password',
                        ]}
                        resetOnSuccess
                        onError={(errors) => {
                            if (errors.password) {
                                passwordInput.current?.focus();
                            }

                            if (errors.current_password) {
                                currentPasswordInput.current?.focus();
                            }
                        }}
                    >
                        {({ errors, processing }) => (
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="current_password">
                                        {__(
                                            'settings.pages.password.form.fields.current_password.label',
                                        )}
                                    </Label>

                                    <Input
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        name="current_password"
                                        type="password"
                                        className="mt-1 block w-full"
                                        autoComplete="current-password"
                                        placeholder={__(
                                            'settings.pages.password.form.fields.current_password.placeholder',
                                        )}
                                        aria-invalid={
                                            errors.current_password
                                                ? 'true'
                                                : 'false'
                                        }
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">
                                        {__(
                                            'settings.pages.password.form.fields.password.label',
                                        )}
                                    </Label>

                                    <Input
                                        id="password"
                                        ref={passwordInput}
                                        name="password"
                                        type="password"
                                        className="mt-1 block w-full"
                                        autoComplete="new-password"
                                        placeholder={__(
                                            'settings.pages.password.form.fields.password.placeholder',
                                        )}
                                        aria-invalid={
                                            errors.password ? 'true' : 'false'
                                        }
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">
                                        {__(
                                            'settings.pages.password.form.fields.password_confirmation.label',
                                        )}
                                    </Label>

                                    <Input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        className="mt-1 block w-full"
                                        autoComplete="new-password"
                                        placeholder={__(
                                            'settings.pages.password.form.fields.password_confirmation.placeholder',
                                        )}
                                        aria-invalid={
                                            errors.password_confirmation
                                                ? 'true'
                                                : 'false'
                                        }
                                    />
                                </div>

                                <Button
                                    disabled={processing}
                                    data-test="update-password-button"
                                >
                                    {processing ? <Spinner /> : <Save />}
                                    {__(
                                        'settings.pages.password.form.buttons.submit',
                                    )}
                                </Button>
                            </div>
                        )}
                    </Form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
