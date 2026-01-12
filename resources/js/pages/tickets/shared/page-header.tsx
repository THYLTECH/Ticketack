import { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    description: string;
    actions?: ReactNode;
}

/**
 * Reusable page header component with title, description and optional actions
 */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    {title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                </p>
            </div>
            {actions && (
                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                    {actions}
                </div>
            )}
        </div>
    );
}

