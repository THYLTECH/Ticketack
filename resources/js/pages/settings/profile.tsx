// pages/settings/profile.tsx

// Necessary imports
import { Form, Head, usePage } from '@inertiajs/react';
import { useRef } from 'react';

// Layout
import AppLayout from '@/layouts/app/layout';
import SettingsLayout from '@/layouts/settings/layout';

// Custom components
import HeadingSmall from '@/components/heading-small';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';

// Types
import { type BreadcrumbItem, type SharedData } from '@/types';

// Icons
import { Save, Trash2 } from 'lucide-react';

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: route('settings.profile.edit'),
    },
    {
        title: 'Profile',
        href: route('settings.profile.edit'),
    },
];

export default function Profile() {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6 mb-0">
                    <HeadingSmall
                        title="Profile information"
                        description="Update your name and email address"
                    />

                    <Form
                        method={'PATCH'}
                        action={route('settings.profile.update')}
                    >
                        {({ processing, errors }) => (
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>

                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
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
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                        aria-invalid={
                                            errors.email ? 'true' : 'false'
                                        }
                                    />
                                </div>
                                <Button
                                    disabled={processing}
                                    type={'submit'}
                                    className="grow-0"
                                >
                                    {processing ? <Spinner /> : <Save />}
                                    Save
                                </Button>
                            </div>
                        )}
                    </Form>
                </div>

                <Separator className='my-8'/>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}

function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-6">
            <HeadingSmall
                title="Delete account"
                description="Delete your account and all of its resources"
            />
            <div className="space-y-2 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                    <p className="font-medium">Warning</p>
                    <p className="text-sm">
                        Please proceed with caution, this cannot be undone.
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            data-test="delete-user-button"
                        >
                            <Trash2 />
                            Delete account
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>
                            Are you sure you want to delete your account?
                        </DialogTitle>
                        <DialogDescription>
                            Once your account is deleted, all of its resources
                            and data will also be permanently deleted. Please
                            enter your password to confirm you would like to
                            permanently delete your account.
                        </DialogDescription>

                        <Form
                            method={'DELETE'}
                            action={route('settings.profile.destroy')}
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="password"
                                            className="sr-only"
                                        >
                                            Password
                                        </Label>

                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            ref={passwordInput}
                                            placeholder="Password"
                                            autoComplete="current-password"
                                            aria-invalid={
                                                errors.password
                                                    ? 'true'
                                                    : 'false'
                                            }
                                        />
                                    </div>

                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button
                                                variant="secondary"
                                                onClick={() =>
                                                    resetAndClearErrors()
                                                }
                                            >
                                                Cancel
                                            </Button>
                                        </DialogClose>

                                        <Button
                                            variant="destructive"
                                            disabled={processing}
                                        >
                                            <Trash2 />
                                            Delete account
                                        </Button>
                                    </DialogFooter>
                                </div>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
