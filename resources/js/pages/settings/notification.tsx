// pages/settings/password.tsx

// Necessary imports
import { Form, Head, usePage } from '@inertiajs/react';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Shadcn UI Components
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemTitle,
} from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';

// Custom components
import HeadingSmall from '@/components/heading-small';

// Layout
import AppLayout from '@/layouts/app/layout';
import SettingsLayout from '@/layouts/settings/layout';

// Types
import type { ComboboxOption } from '@/components/ui/combobox';
import { SharedData, type BreadcrumbItem } from '@/types';

// Icons
import { AlertCircleIcon, Save } from 'lucide-react';

// Interfaces
type NotificationPreferences = {
    [category: string]: string[];
};
type NotificationChannels = string[];
interface UserPreference {
    user_id: number;
    type: string;
    channel: string;
    enabled: boolean;
}

export default function Notification({
    notification_preferences,
    notification_channels,
    user_preferences,
}: {
    notification_preferences: NotificationPreferences;
    notification_channels: NotificationChannels;
    user_preferences: UserPreference[];
}) {
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
                        notification_preferences={notification_preferences}
                        notification_channels={notification_channels}
                        user_preferences={user_preferences}
                    />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}

function PreferenceForm({
    notification_preferences,
    notification_channels,
    user_preferences,
}: {
    notification_preferences: NotificationPreferences;
    notification_channels: NotificationChannels;
    user_preferences: UserPreference[];
}) {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;

    const channels: ComboboxOption[] = notification_channels.map((channel) => ({
        value: channel,
        label: __(`notifications.channels.${channel}`),
        disabled: channel == 'vonage' && !auth.user.phone,
    }));

    return (
        <div className="grid gap-6">
            {Object.entries(notification_preferences).map(
                ([category, items]) => (
                    <Form
                        method={'PATCH'}
                        action={route('settings.notification.update')}
                        options={{
                            preserveScroll: true,
                        }}
                        className="grid gap-4"
                        key={category}
                    >
                        {({ processing }) => (
                            <div className="grid gap-2">
                                <h3>
                                    {__(
                                        `notifications.preferences.${category}.title`,
                                    )}
                                </h3>
                                <Separator />
                                <div className="grid">
                                    {items.map((item) => {
                                        const selected_channels =
                                            user_preferences
                                                .filter(
                                                    (pref) =>
                                                        pref.type === item &&
                                                        pref.enabled,
                                                )
                                                .map((pref) => pref.channel);

                                        return (
                                            <PreferenceItem
                                                key={item}
                                                name={item}
                                                title={__(
                                                    `notifications.preferences.${category}.items.${item}.title`,
                                                )}
                                                description={__(
                                                    `notifications.preferences.${category}.items.${item}.description`,
                                                )}
                                                channels={channels}
                                                selected_channels={
                                                    selected_channels
                                                }
                                            />
                                        );
                                    })}
                                </div>
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
        <Item variant={'default'} className="gap-4 px-0">
            <ItemContent className="gap-0">
                <ItemTitle>{title}</ItemTitle>
                <ItemDescription>{description}</ItemDescription>
            </ItemContent>
            <ItemActions>
                <input
                    type="hidden"
                    name={`notification_preferences[${name}][type]`}
                    value={name}
                />
                <Combobox
                    size={'sm'}
                    name={`notification_preferences[${name}][value]`}
                    searchable={false}
                    options={new_channels}
                    allowDeselect
                    multiple
                />
            </ItemActions>
        </Item>
    );
}
