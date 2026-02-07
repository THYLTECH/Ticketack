import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { LucideIcon, Plus } from 'lucide-react';

export interface HeaderActionProps {
    label: string;
    icon?: LucideIcon;
    href?: string;
    onClick?: () => void;
    variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
    badge?: number;
    show?: boolean;
}

interface HeaderActionsProps {
    actions: HeaderActionProps[];
}

/**
 * Reusable header actions component that renders a list of buttons
 * Supports both Link and onClick handlers
 */
export function HeaderActions({ actions }: HeaderActionsProps) {
    const visibleActions = actions.filter((action) => action.show !== false);

    if (visibleActions.length === 0) return null;

    return (
        <>
            {visibleActions.map((action, index) => {
                const Icon = action.icon;
                const buttonContent = (
                    <>
                        {Icon && <Icon className="mr-2 h-4 w-4" />}
                        {action.label}
                        {action.badge !== undefined && action.badge > 0 && (
                            <Badge
                                variant="secondary"
                                className="ml-2 h-5 min-w-5 px-1.5 text-xs"
                            >
                                {action.badge}
                            </Badge>
                        )}
                    </>
                );

                if (action.href) {
                    return (
                        <Button
                            key={index}
                            asChild
                            size="sm"
                            variant={action.variant || 'default'}
                            className="relative flex-1 sm:flex-initial"
                            data-onboarding={action.icon === Plus ? 'create-ticket-button' : undefined}
                        >
                            <Link href={action.href}>{buttonContent}</Link>
                        </Button>
                    );
                }

                return (
                    <Button
                        key={index}
                        size="sm"
                        variant={action.variant || 'default'}
                        onClick={action.onClick}
                        className="relative flex-1 sm:flex-initial"
                    >
                        {buttonContent}
                    </Button>
                );
            })}
        </>
    );
}

