// pages/settings/profile.tsx

// Necessary imports
import { Form, Head, usePage } from '@inertiajs/react';
import { useRef } from 'react';

// Layout
import AppLayout from '@/layouts/app/layout';
import SettingsLayout from '@/layouts/settings/layout';

// Translation Hook
import { useTrans } from '@/lib/translation';

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

export default function Profile({
    languages,
    timezones,
}: {
    languages: Language[];
    timezones: Timezone[];
}) {
    const { auth } = usePage<SharedData>().props;
    const __ = useTrans();
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('settings.pages.breadcrumbs.settings'),
            href: route('settings.profile.edit'),
        },
        {
            title: __('settings.pages.breadcrumbs.profile'),
            href: route('settings.profile.edit'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('settings.pages.profile.head_title')} />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title={__('settings.pages.profile.info_form.title')}
                        description={__(
                            'settings.pages.profile.info_form.description',
                        )}
                    />

                    <InformationForm auth={auth} />
                </div>

                <Separator className="my-8" />

                <div className="space-y-6">
                    <HeadingSmall
                        title={__('settings.pages.profile.lang_form.title')}
                        description={__(
                            'settings.pages.profile.lang_form.description',
                        )}
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
    const __ = useTrans();

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
                        <Label htmlFor="name">
                            {__(
                                'settings.pages.profile.info_form.fields.name.label',
                            )}
                        </Label>

                        <Input
                            id="name"
                            name="name"
                            defaultValue={auth.user.name}
                            required
                            placeholder={__(
                                'settings.pages.profile.info_form.fields.name.placeholder',
                            )}
                            aria-invalid={errors.name ? 'true' : 'false'}
                            tabIndex={1}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">
                            {__(
                                'settings.pages.profile.info_form.fields.email.label',
                            )}
                        </Label>

                        <Input
                            id="email"
                            type="email"
                            defaultValue={auth.user.email}
                            name="email"
                            required
                            placeholder={__(
                                'settings.pages.profile.info_form.fields.email.placeholder',
                            )}
                            aria-invalid={errors.email ? 'true' : 'false'}
                            tabIndex={2}
                        />
                    </div>
                    <Button
                        disabled={processing}
                        type={'submit'}
                        tabIndex={3}
                    >
                        {processing ? <Spinner /> : <Save />}
                        {__('settings.pages.profile.info_form.buttons.submit')}
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
    const __ = useTrans();

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
                        <Label htmlFor="language">
                            {__(
                                'settings.pages.profile.lang_form.fields.language.label',
                            )}
                        </Label>

                        <Select
                            name="language"
                            required
                            aria-invalid={errors.language ? 'true' : 'false'}
                            defaultValue={
                                auth.user.language ?? languages[0].code
                            }
                        >
                            <SelectTrigger
                                tabIndex={4}
                                id="language"
                                className="w-full"
                            >
                                <SelectValue
                                    placeholder={__(
                                        'settings.pages.profile.lang_form.fields.language.placeholder',
                                    )}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>
                                        {__(
                                            'settings.pages.profile.lang_form.fields.language.label',
                                        )}
                                    </SelectLabel>
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
                        <Label htmlFor="timezone">
                            {__(
                                'settings.pages.profile.lang_form.fields.timezone.label',
                            )}
                        </Label>

                        <Select
                            name="timezone"
                            required
                            aria-invalid={errors.timezone ? 'true' : 'false'}
                            defaultValue={
                                auth.user.timezone ?? timezones[0].value
                            }
                        >
                            <SelectTrigger
                                tabIndex={5}
                                id="timezone"
                                className="w-full"
                            >
                                <SelectValue
                                    placeholder={__(
                                        'settings.pages.profile.lang_form.fields.timezone.placeholder',
                                    )}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>
                                        {__(
                                            'settings.pages.profile.lang_form.fields.timezone.label',
                                        )}
                                    </SelectLabel>
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
                        tabIndex={6}
                    >
                        {processing ? <Spinner /> : <Save />}
                        {__('settings.pages.profile.lang_form.buttons.submit')}
                    </Button>
                </div>
            )}
        </Form>
    );
}

function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    const __ = useTrans();

    return (
        <div className="space-y-6">
            <HeadingSmall
                title={__('settings.pages.profile.delete_account.title')}
                description={__(
                    'settings.pages.profile.delete_account.description',
                )}
            />
            <div className="space-y-2 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                    <p className="font-medium">
                        {__(
                            'settings.pages.profile.delete_account.caution_title',
                        )}
                    </p>
                    <p className="text-sm">
                        {__(
                            'settings.pages.profile.delete_account.caution_description',
                        )}
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="destructive" tabIndex={7}>
                            <Trash2 />
                            {__(
                                'settings.pages.profile.delete_account.dialog.trigger',
                            )}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>
                            {__(
                                'settings.pages.profile.delete_account.dialog.title',
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {__(
                                'settings.pages.profile.delete_account.dialog.description',
                            )}
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
                                        <Label htmlFor="password">
                                            {__(
                                                'settings.pages.profile.delete_account.dialog.fields.password.label',
                                            )}
                                        </Label>

                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            ref={passwordInput}
                                            required
                                            placeholder={__(
                                                'settings.pages.profile.delete_account.dialog.fields.password.placeholder',
                                            )}
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
                                                {__(
                                                    'settings.pages.profile.delete_account.dialog.buttons.cancel',
                                                )}
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
                                            {__(
                                                'settings.pages.profile.delete_account.dialog.buttons.confirm',
                                            )}
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
