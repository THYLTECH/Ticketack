import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useTrans } from '@/lib/translation';
import { userHasPermission } from '@/lib/utils';
import { User } from '@/types';
import {
    Plus,
    Calendar,
    Clock,
    Users,
    Sparkles,
    ListTree,
} from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface QuickActionsProps {
    user: User;
}

export function QuickActions({ user }: QuickActionsProps) {
    const __ = useTrans();

    const actions = [
        {
            label: __('home.quick_actions.create_ticket'),
            tooltip: __('home.quick_actions_tooltips.create_ticket'),
            icon: Plus,
            href: route('tickets.create'),
            permission: 'create tickets',
            variant: 'default' as const,
        },
        {
            label: __('home.quick_actions.view_planning'),
            tooltip: __('home.quick_actions_tooltips.view_planning'),
            icon: Calendar,
            href: route('tickets.planning.index'),
            permission: 'view planning',
            variant: 'outline' as const,
        },
        {
            label: __('home.quick_actions.time_entries'),
            tooltip: __('home.quick_actions_tooltips.time_entries'),
            icon: Clock,
            href: route('tickets.entries.index'),
            permission: 'view ticket entries',
            variant: 'outline' as const,
        },
        {
            label: __('home.quick_actions.knowledge'),
            tooltip: __('home.quick_actions_tooltips.knowledge'),
            icon: Sparkles,
            href: route('knowledge.search'),
            permission: 'view knowledge explorer',
            variant: 'outline' as const,
        },
        {
            label: __('home.quick_actions.assets'),
            tooltip: __('home.quick_actions_tooltips.assets'),
            icon: ListTree,
            href: route('assets.index'),
            permission: 'view assets',
            variant: 'outline' as const,
        },
        {
            label: __('home.quick_actions.users'),
            tooltip: __('home.quick_actions_tooltips.users'),
            icon: Users,
            href: route('users.index'),
            permission: 'view users',
            variant: 'outline' as const,
        },
    ];

    const visibleActions = actions.filter(
        (action) =>
            action.permission === null ||
            userHasPermission({ user, permission: action.permission })
    );

    return (
        <div className="flex flex-wrap gap-2">
            {visibleActions.map((action) => (
                <Tooltip key={action.href}>
                    <TooltipTrigger asChild>
                        <Button
                            variant={action.variant}
                            size="sm"
                            asChild
                            className="gap-2"
                        >
                            <Link href={action.href}>
                                <action.icon className="h-4 w-4" />
                                <span className="hidden sm:inline">{action.label}</span>
                            </Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{action.tooltip}</p>
                    </TooltipContent>
                </Tooltip>
            ))}
        </div>
    );
}
