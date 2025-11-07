// pages/settings/appearance.tsx

// Necessary imports
import { type Appearance, useAppearance } from '@/hooks/use-appearance';
import { type ColorScheme, useColorScheme } from '@/hooks/use-color-scheme';
import { cn } from '@/lib/utils';
import { Head, useForm } from '@inertiajs/react';

// Layout
import AppLayout from '@/layouts/app/layout';
import SettingsLayout from '@/layouts/settings/layout';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Shadcn UI Components
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Custom components
import HeadingSmall from '@/components/heading-small';
import { Icon } from '@/components/icon';

// Types
import type { BreadcrumbItem, Color, Theme } from '@/types';

// Icons
import { CheckIcon, Monitor, Moon, Sun } from 'lucide-react';

export default function Appearance({
    themes,
    colors,
}: {
    themes: Theme[];
    colors: Color[];
}) {
    const __ = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('settings.pages.breadcrumbs.settings'),
            href: route('settings.profile.edit'),
        },
        {
            title: __('settings.pages.breadcrumbs.appearance'),
            href: route('settings.appearance.edit'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('settings.pages.appearance.head_title')} />

            <SettingsLayout>
                <div className="mb-0 space-y-6">
                    <HeadingSmall
                        title={__('settings.pages.appearance.theme_form.title')}
                        description={__(
                            'settings.pages.appearance.theme_form.description',
                        )}
                    />
                    <AppearanceToggle themes={themes} />
                </div>

                <Separator className="my-8" />

                <div className="mb-0 space-y-6">
                    <HeadingSmall
                        title={__('settings.pages.appearance.color_form.title')}
                        description={__(
                            'settings.pages.appearance.color_form.description',
                        )}
                    />
                    <ColorDropdown colors={colors} />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}

function AppearanceToggle({ themes }: { themes: Theme[] }) {
    const { appearance, updateAppearance } = useAppearance();
    const __ = useTrans();

    const tabs = themes.map((theme) => ({
        value: theme.value as Appearance,
        icon:
            theme.value === 'light'
                ? Sun
                : theme.value === 'dark'
                  ? Moon
                  : Monitor,
        label: __(`common.themes.${theme.value}`),
    }));

    // Form
    const { put, processing } = useForm();

    const handleChange = (value: string) => {
        put(route('settings.appearance.update_theme', { theme: value }), {
            preserveScroll: true,
            onSuccess: () => updateAppearance(value as Appearance),
        });
    };

    return (
        <Tabs value={appearance} onValueChange={handleChange}>
            <TabsList className="gap-2">
                {tabs.map(({ value, icon, label }) => (
                    <TabsTrigger
                        key={value}
                        value={value}
                        className="flex gap-2 px-4 py-3"
                        disabled={processing}
                    >
                        <Icon iconNode={icon} />
                        <span className="hidden sm:inline">{label}</span>
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
}

function ColorDropdown({ colors }: { colors: Color[] }) {
    const { scheme, updateColorScheme } = useColorScheme();

    // Form
    const { put, processing } = useForm();

    const handleChange = (value: string) => {
        put(
            route('settings.appearance.update_color', { color_scheme: value }),
            {
                preserveScroll: true,
                onSuccess: () => updateColorScheme(value as ColorScheme),
            },
        );
    };

    return (
        <RadioGroup
            className="grid grid-cols-3 gap-2"
            value={scheme}
            onValueChange={handleChange}
        >
            {colors.map(({ value, color }) => (
                <ColorOption
                    key={value}
                    value={value}
                    color={color}
                    isActive={scheme === value}
                    disabled={processing}
                />
            ))}
        </RadioGroup>
    );
}

function ColorOption({
    value,
    color = '',
    isActive = false,
    disabled = false,
}: {
    value: string;
    color?: string;
    isActive?: boolean;
    disabled?: boolean;
}) {
    const __ = useTrans();

    return (
        <Label
            className={cn(
                'flex h-8 items-center gap-2 rounded-md border px-3 py-2',
                'hover:cursor-pointer hover:bg-accent',
                'transition-all',
                isActive && 'border-2 border-primary',
                disabled && 'pointer-events-none opacity-50',
            )}
            htmlFor={value}
        >
            <div
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: color }}
            >
                {isActive && <CheckIcon className="h-4 w-4 text-white" />}
            </div>
            <RadioGroupItem
                value={value}
                id={value}
                className="sr-only"
                disabled={disabled}
            />
            <span className="text-xs capitalize">
                {__('common.colors.' + value)}
            </span>
        </Label>
    );
}
