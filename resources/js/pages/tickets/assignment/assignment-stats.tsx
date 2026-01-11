import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTrans } from '@/lib/translation';
import { AlertCircle, AlertTriangle, Clock, Info, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriorityStat {
    id: number;
    title: string;
    color: string;
    sort_order: number;
    count: number;
}

interface Stats {
    total_unassigned: number;
    priority_stats: PriorityStat[];
    oldest_unassigned_days: number;
}

interface AssignmentStatsProps {
    stats: Stats;
}

/**
 * Assignment statistics component
 * Displays stats cards for unassigned tickets including total, priority
 * breakdown, and oldest ticket age
 */
export function AssignmentStats({ stats }: AssignmentStatsProps) {
    const __ = useTrans();

    /**
     * Returns the appropriate icon based on priority order
     * @param sortOrder Priority sort order value
     */
    const getPriorityIcon = (sortOrder: number) => {
        if (sortOrder >= 4) return AlertTriangle;
        if (sortOrder === 3) return AlertCircle;
        return Info;
    };

    const statItems: Array<{
        label: string;
        value: number | string;
        icon: typeof ListTodo;
        color: string;
        bgColor: string;
        suffix?: string;
        customColor?: string;
        variant?: 'default' | 'primary';
    }> = [
        {
            label: __('tickets.assignment.stats.total_unassigned'),
            value: stats.total_unassigned,
            icon: ListTodo,
            color: 'text-primary',
            bgColor: 'bg-background',
            variant: 'primary',
        },
        ...stats.priority_stats.map((priority) => ({
            label: priority.title,
            value: priority.count,
            icon: getPriorityIcon(priority.sort_order),
            color: 'text-muted-foreground',
            bgColor: 'bg-muted/20',
            customColor: priority.color,
            variant: 'default' as const,
        })),
        {
            label: __('tickets.assignment.stats.oldest_unassigned'),
            value: `${stats.oldest_unassigned_days}`,
            suffix: __('tickets.assignment.stats.days'),
            icon: Clock,
            color: 'text-muted-foreground',
            bgColor: 'bg-muted/20',
            variant: 'default' as const,
        },
    ];

    return (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {statItems.map((stat, index) => {
                const isPrimary = stat.variant === 'primary';

                return (
                    <Card
                        key={index}
                        className={cn(
                            'relative overflow-hidden transition-all hover:shadow-md',
                            isPrimary
                                ? 'border-primary/20 bg-primary/5 shadow-sm'
                                : 'border-border/60 shadow-sm',
                        )}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.label}
                            </CardTitle>
                            <div
                                className={cn(
                                    'flex h-9 w-9 items-center justify-center rounded-lg border shrink-0',
                                    isPrimary
                                        ? 'border-primary/20 bg-background text-primary'
                                        : 'border-border/50 text-muted-foreground',
                                    stat.bgColor,
                                )}
                            >
                                <stat.icon
                                    className="h-5 w-5"
                                    style={
                                        stat.customColor && !isPrimary
                                            ? { color: stat.customColor }
                                            : undefined
                                    }
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-1">
                                <div
                                    className={cn(
                                        'text-2xl font-bold tracking-tight',
                                        isPrimary ? 'text-primary' : 'text-foreground',
                                    )}
                                >
                                    {stat.value}
                                    {stat.suffix && (
                                        <span className="ml-1 text-sm font-normal text-muted-foreground">
                                            {stat.suffix}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
