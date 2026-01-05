import { Button } from '@/components/ui/button';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from '@/components/ui/empty';
import { useTrans } from '@/lib/translation';
import { Link } from '@inertiajs/react';
import { Box, Shield, TicketIcon, User } from 'lucide-react';

interface Props {
    type: 'ticket' | 'user' | 'asset' | 'role';
}

export function TrashEmpty({ type }: Props) {
    const __ = useTrans();

    const config = {
        ticket: {
            icon: TicketIcon,
            route: 'tickets.index',
            buttonLabel: 'tickets.pages.index.head_title',
        },
        user: {
            icon: User,
            route: 'users.index',
            buttonLabel: 'users.pages.index.head_title',
        },
        asset: {
            icon: Box,
            route: 'assets.index',
            buttonLabel: 'assets.pages.index.head_title',
        },
        role: {
            icon: Shield,
            route: 'roles.index',
            buttonLabel: 'roles.pages.index.head_title',
        },
    };

    const currentConfig = config[type];
    const Icon = currentConfig.icon;

    const typeLabel = __('trash.tabs.' + type + 's').toLowerCase();

    const description = __('trash.pages.index.empty.description')
        .replace('{type}', typeLabel)
        .replace(':type', typeLabel);

    return (
        <Empty className="py-16">
            <EmptyHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
                    <Icon className="h-6 w-6 text-muted-foreground" />
                </div>
                <EmptyTitle className="mt-4 text-lg">
                    {__('trash.pages.index.empty.title')}
                </EmptyTitle>
                <EmptyDescription className="mx-auto max-w-sm">
                    {description}
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="mt-6">
                <Button variant="outline" size="sm" asChild>
                    <Link
                        href={
                            route().has(currentConfig.route)
                                ? route(currentConfig.route)
                                : route('dashboard')
                        }
                    >
                        {route().has(currentConfig.route) ? (
                            <>
                                <span className="mr-2">←</span>
                                {__(currentConfig.buttonLabel) ||
                                    __('dashboard.buttons.back')}
                            </>
                        ) : (
                            __('dashboard.pages.breadcrumbs.dashboard')
                        )}
                    </Link>
                </Button>
            </EmptyContent>
        </Empty>
    );
}
