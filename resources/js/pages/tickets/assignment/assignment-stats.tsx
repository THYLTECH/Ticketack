import { Card, CardContent } from '@/components/ui/card';
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
    }> = [
        {
            label: __('tickets.assignment.stats.total_unassigned'),
            value: stats.total_unassigned,
            icon: ListTodo,
            color: 'text-foreground',
            bgColor: 'bg-muted',
        },
        ...stats.priority_stats.map((priority) => ({
            label: priority.title,
            value: priority.count,
            icon: getPriorityIcon(priority.sort_order),
            color: `text-[${priority.color}]`,
            bgColor: 'bg-muted/50',
            customColor: priority.color,
        })),
        {
            label: __('tickets.assignment.stats.oldest_unassigned'),
            value: `${stats.oldest_unassigned_days}`,
            suffix: __('tickets.assignment.stats.days'),
            icon: Clock,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10',
        },
    ];

    return (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {statItems.map((stat, index) => (
                <Card key={index} className="border-border/50 shadow-sm">
                    <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 space-y-1 min-w-0">
                                <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
                                    {stat.label}
                                </p>
                                <div className="flex items-baseline gap-1 sm:gap-1.5">
                                    <p className="text-xl sm:text-2xl font-bold tracking-tight">
                                        {stat.value}
                                    </p>
                                    {stat.suffix && (
                                        <span className="text-[10px] sm:text-xs text-muted-foreground">
                                            {stat.suffix}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div
                                className={cn(
                                    'flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg shrink-0',
                                    stat.bgColor,
                                )}
                            >
                                <stat.icon
                                    className={cn('h-4 w-4 sm:h-5 sm:w-5', stat.color)}
                                    style={
                                        stat.customColor
                                            ? { color: stat.customColor }
                                            : undefined
                                    }
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
