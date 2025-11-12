// pages/settings/notification.tsx

// Necessary imports
import { Form, Head, usePage } from '@inertiajs/react';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Shadcn UI Components
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';

// Custom components
import HeadingSmall from '@/components/heading-small';

// Layout
import AppLayout from '@/layouts/app/layout';
import SettingsLayout from '@/layouts/settings/layout';

// Types
import type { ComboboxOption } from '@/components/ui/combobox';
import type {
    BreadcrumbItem,
    NotificationPreference,
    SharedData,
} from '@/types';

// Icons
import { AlertCircleIcon, Save } from 'lucide-react';

// Interfaces for local use
type NotificationProps = {
    existing_notifications: {
        [category: string]: {
            [type: string]: string[];
        };
    };
    existing_channels: string[];
    notification_preferences: NotificationPreference[];
};

export default function Notification({
    existing_notifications,
    existing_channels,
    notification_preferences,
}: NotificationProps) {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('settings.pages.breadcrumbs.settings'),
            href: route('settings.profile.edit'),
        },
        {
            title: __('settings.pages.breadcrumbs.notification'),
            href: route('settings.notification.edit'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('settings.pages.notification.head_title')} />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title={__('settings.pages.notification.form.title')}
                        description={__(
                            'settings.pages.notification.form.description',
                        )}
                    />

                    {!auth.user.phone && (
                        <Alert variant="destructive">
                            <AlertCircleIcon />
                            <AlertTitle>
                                {__(
                                    'settings.pages.notification.phone_number.title',
                                )}
                            </AlertTitle>
                            <AlertDescription>
                                {__(
                                    'settings.pages.notification.phone_number.description',
                                )}
                            </AlertDescription>
                        </Alert>
                    )}

                    <PreferenceForm
                        existing_notifications={existing_notifications}
                        existing_channels={existing_channels}
                        notification_preferences={notification_preferences}
                    />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}

function PreferenceForm({
    existing_notifications,
    existing_channels,
    notification_preferences,
}: NotificationProps) {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="grid gap-10">
            {Object.entries(existing_notifications).map(
                ([category, notificatios]) => (
                    <Form
                        method={'PATCH'}
                        action={route('settings.notification.update')}
                        options={{
                            preserveScroll: true,
                        }}
                        className="grid w-full gap-4"
                        key={category}
                    >
                        {({ processing }) => (
                            <div className="grid gap-3">
                                <div className="grid gap-2">
                                    <h3 className="font-medium">
                                        {__(
                                            `notifications.preferences.${category}.title`,
                                        )}
                                    </h3>
                                    <p className="text-sm font-light text-muted-foreground">
                                        {__(
                                            `notifications.preferences.${category}.description`,
                                        )}
                                    </p>
                                </div>
                                <Separator />
                                <div className="grid">
                                    {Object.entries(notificatios).map(
                                        ([
                                            notification,
                                            available_channels,
                                        ]) => {
                                            // If the user has no phone number, disable the Vonage (SMS) option
                                            // Or if the channel is not in the available channels for this item
                                            const channelIsDisabled = (
                                                channel: string,
                                                phone: string | undefined,
                                                available_channels: string[],
                                            ) => {
                                                return (
                                                    (channel == 'vonage' &&
                                                        !phone) ||
                                                    !available_channels.includes(
                                                        channel,
                                                    )
                                                );
                                            };

                                            const channels: ComboboxOption[] =
                                                existing_channels.map(
                                                    (channel) => ({
                                                        value: channel,
                                                        label: __(
                                                            `notifications.channels.${channel}`,
                                                        ),
                                                        disabled:
                                                            channelIsDisabled(
                                                                channel,
                                                                auth.user.phone,
                                                                available_channels,
                                                            ),
                                                    }),
                                                );

                                            return (
                                                <PreferenceItem
                                                    key={notification}
                                                    name={notification}
                                                    title={__(
                                                        `notifications.preferences.${category}.items.${notification}.title`,
                                                    )}
                                                    description={__(
                                                        `notifications.preferences.${category}.items.${notification}.description`,
                                                    )}
                                                    channels={channels}
                                                    selected_channels={getSelectedChannelsForType(
                                                        existing_channels,
                                                        notification_preferences,
                                                        notification,
                                                    )}
                                                />
                                            );
                                        },
                                    )}
                                </div>
                                <Input
                                    type="hidden"
                                    name="category"
                                    value={category}
                                />
                                <Button disabled={processing}>
                                    {processing ? <Spinner /> : <Save />}
                                    {__(
                                        'settings.pages.notification.form.buttons.submit',
                                    )}
                                </Button>
                            </div>
                        )}
                    </Form>
                ),
            )}
        </div>
    );
}

function PreferenceItem({
    name,
    title,
    description,
    channels,
    selected_channels,
}: {
    name: string;
    title: string;
    description: string;
    channels: ComboboxOption[];
    selected_channels: string[];
}) {
    const new_channels = channels.map((channel) => ({
        ...channel,
        selected: selected_channels.includes(channel.value),
    }));

    return (
        <div className="grid grid-cols-6 items-center gap-6 py-2">
            <div className="col-span-4 flex-grow-0 flex-nowrap gap-0 overflow-hidden overflow-ellipsis">
                <h3>{title}</h3>
                <p className="text-sm font-light text-muted-foreground">
                    {description}
                </p>
            </div>
            <div className="col-span-2 flex items-center gap-2">
                <Input
                    type="hidden"
                    name={`notification_preferences[${name}][type]`}
                    value={name}
                />
                <Combobox
                    size={'sm'}
                    name={`notification_preferences[${name}][value]`}
                    searchable={false}
                    className="w-full"
                    options={new_channels}
                    allowDeselect
                    multiple
                />
            </div>
        </div>
    );
}

function getSelectedChannelsForType(
    existing_channels: string[],
    notification_preferences: NotificationPreference[],
    type: string,
): string[] {
    return existing_channels.filter((channel) =>
        notification_preferences.some(
            (pref) =>
                pref.type === type && pref.channel === channel && pref.enabled,
        ),
    );
}
