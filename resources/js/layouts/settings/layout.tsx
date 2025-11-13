// layouts/settings/layout.tsx

// Necessary imports
import { type PropsWithChildren } from 'react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Custom components
import Heading from '@/components/heading';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// Types
import { type NavItem } from '@/types';

export default function SettingsLayout({ children }: PropsWithChildren) {

    const __ = useTrans();

    const sidebarNavItems: NavItem[] = [
        {
            title: __('settings.pages.breadcrumbs.settings'),
            href: route('settings.profile.edit'),
            icon: null,
        },
        {
            title: __('settings.pages.breadcrumbs.password'),
            href: route('settings.password.edit'),
            icon: null,
        },
        {
            title: __('settings.pages.breadcrumbs.appearance'),
            href: route('settings.appearance.edit'),
            icon: null,
        },
        {
            title: __('settings.pages.breadcrumbs.notification'),
            href: route('settings.notification.edit'),
            icon: null,
        },
    ];

    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const current_url = new URL(window.location.href).href;

    return (
        <>
            <Heading
                title={__('settings.pages.layout.title')}
                description={__('settings.pages.layout.description')}
            />

            <div className="flex flex-col lg:flex-row lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${typeof item.href === 'string' ? item.href : item.href.url}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': current_url === item.href,
                                })}
                            >
                                <Link href={item.href}>
                                    {item.icon && (
                                        <item.icon className="h-4 w-4" />
                                    )}
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 lg:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">
                        {children}
                    </section>
                </div>
            </div>
        </>
    );
}
