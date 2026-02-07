import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: ReactNode;
}

/**
 * Reusable empty state component for tables and lists
 */
export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex min-h-100 flex-col items-center justify-center gap-3 rounded-lg border border-dashed text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 ring-1 ring-border">
                <Icon className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {title}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            </div>
            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}

