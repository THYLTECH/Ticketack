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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';

// Types
import type { BreadcrumbItem, Language, SharedData, Timezone } from '@/types';

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

export default function Profile({
    languages,
    timezones,
}: {
    languages: Language[];
    timezones: Timezone[];
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Profile informations"
                        description="Update your name and email address"
                    />

                    <InformationForm auth={auth} />
                </div>

                <Separator className="my-8" />

                <div className="space-y-6">
                    <HeadingSmall
                        title="Language preferences"
                        description="Choose your preferred language and timezone settings"
                    />

                    <LangForm
                        auth={auth}
                        languages={languages}
                        timezones={timezones}
                    />
                </div>

                <Separator className="my-8" />

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}

function InformationForm({ auth }: { auth: SharedData['auth'] }) {
    return (
        <Form
            method={'PATCH'}
            action={route('settings.profile.update')}
            options={{
                preserveScroll: true,
            }}
        >
            {({ processing, errors }) => (
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>

                        <Input
                            id="name"
                            name="name"
                            defaultValue={auth.user.name}
                            required
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
                            defaultValue={auth.user.email}
                            name="email"
                            required
                            placeholder="Email address"
                            aria-invalid={errors.email ? 'true' : 'false'}
                            tabIndex={2}
                        />
                    </div>
                    <Button disabled={processing} type={'submit'} tabIndex={3}>
                        {processing ? <Spinner /> : <Save />}
                        Save informations
                    </Button>
                </div>
            )}
        </Form>
    );
}

function LangForm({
    auth,
    languages,
    timezones,
}: {
    auth: SharedData['auth'];
    languages: Language[];
    timezones: Timezone[];
}) {
    return (
        <Form
            method={'PATCH'}
            action={route('settings.profile.update_lang')}
            options={{
                preserveScroll: true,
            }}
        >
            {({ processing, errors }) => (
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="language">Language</Label>

                        <Select
                            name="language"
                            required
                            aria-invalid={errors.language ? 'true' : 'false'}
                            defaultValue={languages[0].code}
                            // value={auth.user.language}
                        >
                            <SelectTrigger
                                tabIndex={4}
                                id="language"
                                className="w-full"
                            >
                                <SelectValue placeholder="Choose a language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Languages</SelectLabel>
                                    {languages.map((lang) => (
                                        <SelectItem
                                            key={lang.code}
                                            value={lang.code}
                                        >
                                            {lang.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="timezone">Timezone</Label>

                        <Select
                            name="timezone"
                            required
                            aria-invalid={errors.timezone ? 'true' : 'false'}
                            defaultValue={timezones[0].value}
                            // value={auth.user.timezone}
                        >
                            <SelectTrigger
                                tabIndex={5}
                                id="timezone"
                                className="w-full"
                            >
                                <SelectValue placeholder="Choose a timezone" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Timezones</SelectLabel>
                                    {timezones.map((zone) => (
                                        <SelectItem
                                            key={zone.value}
                                            value={zone.value}
                                            className="space-x-1"
                                        >
                                            <span>{zone.value}</span>
                                            <span>
                                                {zone.value !== 'UTC' &&
                                                    `(UTC${zone.utc})`}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        disabled={processing}
                        type={'submit'}
                        className="grow-0"
                        tabIndex={6}
                    >
                        {processing ? <Spinner /> : <Save />}
                        Save preferences
                    </Button>
                </div>
            )}
        </Form>
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
                            tabIndex={7}
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
                                            {processing ? (
                                                <Spinner />
                                            ) : (
                                                <Trash2 />
                                            )}
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
