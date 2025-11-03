// pages/settings/appearance.tsx

// Necessary imports
import { type Appearance, useAppearance } from '@/hooks/use-appearance';
import { type ColorScheme, useColorScheme } from '@/hooks/use-color-scheme';
import { cn } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import { HTMLAttributes } from 'react';

// Layout
import AppLayout from '@/layouts/app/layout';
import SettingsLayout from '@/layouts/settings/layout';

// Shadcn UI Components
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

// Custom components
import HeadingSmall from '@/components/heading-small';
import { Icon } from '@/components/icon';

// Types
import { type BreadcrumbItem } from '@/types';

// Icons
import { CheckIcon, LucideIcon, Monitor, Moon, Sun } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: route('settings.profile.edit'),
    },
    {
        title: 'Appearance',
        href: route('settings.appearance.edit'),
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="space-y-6 mb-0">
                    <HeadingSmall
                        title="Theme mode"
                        description="Select the theme mode for your account"
                    />
                    <AppearanceToggle />
                </div>

                <Separator className='my-8'/>

                <div className="space-y-6 mb-0">
                    <HeadingSmall
                        title="Color scheme"
                        description="Choose your preferred color scheme"
                    />
                    <ColorDropdown />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}

function AppearanceToggle({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
        { value: 'system', icon: Monitor, label: 'System' },
    ];

    return (
        <div className={cn('', className)} {...props}>
            <Tabs
                value={appearance}
                onValueChange={(value: string) =>
                    updateAppearance(value as Appearance)
                }
            >
                <TabsList className="gap-2">
                    {tabs.map(({ value, icon, label }) => (
                        <TabsTrigger
                            key={value}
                            value={value}
                            className="flex gap-2 px-4 py-3"
                        >
                            <Icon iconNode={icon} />
                            <span className="hidden sm:inline">{label}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </div>
    );
}

function ColorDropdown() {
    const { scheme, updateColorScheme } = useColorScheme();

    const colors: { value: ColorScheme; color: string }[] = [
        { value: 'default', color: 'oklch(0.205 0 0)' },
        { value: 'blue', color: 'oklch(0.488 0.243 264.376)' },
        { value: 'red', color: 'oklch(0.577 0.245 27.325)' },
        { value: 'green', color: 'oklch(0.648 0.2 131.684)' },
        { value: 'orange', color: 'oklch(0.646 0.222 41.116)' },
        { value: 'rose', color: 'oklch(0.586 0.253 17.585)' },
        { value: 'violet', color: 'oklch(0.541 0.281 293.009)' },
        { value: 'yellow', color: 'oklch(0.852 0.199 91.936)' },
    ];

    return (
        <RadioGroup
            className="grid grid-cols-3 gap-2"
            defaultValue={scheme}
            onValueChange={(v) => updateColorScheme(v as any)}
        >
            {colors.map(({ value, color }) => (
                <ColorOption
                    key={value}
                    value={value}
                    color={color}
                    isActive={scheme === value}
                />
            ))}
        </RadioGroup>
    );
}

function ColorOption({
    value,
    color = '',
    isActive = false,
}: {
    value: string;
    color?: string;
    isActive?: boolean;
}) {
    return (
        <Label
            className={cn(
                'flex h-8 items-center gap-2 rounded-md border px-3 py-2',
                'hover:cursor-pointer hover:bg-accent',
                'transition-all',
                isActive && 'border-2 border-primary',
            )}
            htmlFor={value}
        >
            <div
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: color }}
            >
                {isActive && <CheckIcon className="h-4 w-4 text-white" />}
            </div>
            <RadioGroupItem value={value} id={value} className="sr-only" />
            <span className="text-xs capitalize">{value}</span>
        </Label>
    );
}
