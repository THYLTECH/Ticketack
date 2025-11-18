
// Necessary imports
import { Form, Head, useForm, usePage } from '@inertiajs/react';
import { useCallback, useRef } from 'react';

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
import { PhoneInput } from '@/components/ui/phone-input';

// Types
import type { BreadcrumbItem, Language, SharedData, Timezone } from '@/types';

// Icons
import { Save, Trash2 } from 'lucide-react';

import AvatarUpload from '@/components/avatar-upload';

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

                    <LangForm auth={auth} languages={languages} timezones={timezones} />
                </div>

                <Separator className="my-8" />

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}

function InformationForm({ auth }: { auth: SharedData['auth'] }) {
    const __ = useTrans();

    const { data, setData, post, processing, errors } = useForm<{
        _method: 'PATCH';
        name: string;
        email: string;
        phone: string;
        avatar?: File | null;
    }>({
        _method: 'PATCH',
        name: auth.user.name ?? '',
        email: auth.user.email ?? '',
        phone: auth.user.phone || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('settings.profile.update'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setData((current) => {
                    const { ...rest } = current;
                    return rest as typeof current;
                });
            },
        });
    };

    const handlePhoneChange = useCallback((v: string) => {
        setData('phone', v);
    }, [setData]);

    return (
        <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="grid md:grid-cols-3 gap-x-8 gap-y-4"
        >
            <div className="md:col-span-2 flex flex-col gap-2">
                <Label htmlFor="name">
                    {__('settings.pages.profile.info_form.fields.name.label')}
                </Label>
            </div>

            <div className="flex flex-col justify-end">
                <Label htmlFor="avatar" className="text-left">
                    {__('settings.pages.profile.info_form.fields.avatar.label')}
                </Label>
            </div>

            <div className="space-y-4 md:col-span-2">
                <Input
                    id="name"
                    name="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                    placeholder={__('settings.pages.profile.info_form.fields.name.placeholder')}
                    aria-invalid={errors.name ? 'true' : 'false'}
                />

                <div className="grid gap-2">
                    <Label htmlFor="email">
                        {__('settings.pages.profile.info_form.fields.email.label')}
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        placeholder={__('settings.pages.profile.info_form.fields.email.placeholder')}
                        aria-invalid={errors.email ? 'true' : 'false'}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="phone">
                        {__('settings.pages.profile.info_form.fields.phone.label')}
                    </Label>
                    <PhoneInput
                        id="phone"
                        name="phone"
                        value={data.phone}
                        onChange={handlePhoneChange}
                        placeholder={__('settings.pages.profile.info_form.fields.phone.placeholder')}
                        placeholderSearch={__('settings.pages.profile.info_form.fields.phone.country_search_placeholder')}
                        aria-invalid={errors.phone ? 'true' : 'false'}
                    />
                </div>
            </div>

            <div className="flex flex-col items-start gap-3 md:col-span-1">
                <AvatarUpload
                    defaultUrl={auth.user?.avatar ?? null}
                    onFileChange={(file) => {
                        setData('avatar', file);
                    }}
                />
            </div>

            <div className="md:col-span-2 flex pt-2">
                <Button disabled={processing} type="submit">
                    {processing ? <Spinner /> : <Save />}
                    {__('settings.pages.profile.info_form.buttons.submit')}
                </Button>
            </div>
        </form>
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
                            defaultValue={auth.user.language ?? languages[0].code}
                        >
                            <SelectTrigger
                                tabIndex={6}
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
                                        <SelectItem key={lang.code} value={lang.code}>
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
                            defaultValue={auth.user.timezone ?? timezones[0].value}
                        >
                            <SelectTrigger
                                tabIndex={7}
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
                                            <span>{zone.value !== 'UTC' && `(UTC${zone.utc})`}</span>
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button disabled={processing} type={'submit'} tabIndex={8}>
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
                                            aria-invalid={errors.password ? 'true' : 'false'}
                                        />
                                    </div>

                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button
                                                variant="secondary"
                                                onClick={() => resetAndClearErrors()}
                                            >
                                                {__(
                                                    'settings.pages.profile.delete_account.dialog.buttons.cancel',
                                                )}
                                            </Button>
                                        </DialogClose>

                                        <Button variant="destructive" disabled={processing}>
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
