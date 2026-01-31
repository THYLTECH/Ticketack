import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
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
        suffix?: string;
        customColor?: string;
        variant: 'default' | 'primary' | 'success' | 'warning';
        description: string;
    }> = [
            {
                label: __('tickets.assignment.stats.total_unassigned'),
                value: stats.total_unassigned,
                icon: ListTodo,
                variant: 'primary',
                description: __('tickets.assignment.stats.total_unassigned_description'),
            },
            ...stats.priority_stats.map((priority) => ({
                label: priority.title,
                value: priority.count,
                icon: getPriorityIcon(priority.sort_order),
                customColor: priority.color,
                variant: 'default' as const,
                description: __('tickets.assignment.stats.priority_description').replace(':priority', priority.title),
            })),
            {
                label: __('tickets.assignment.stats.oldest_unassigned'),
                value: stats.oldest_unassigned_days,
                suffix: __('tickets.assignment.stats.days'),
                icon: Clock,
                variant: 'default' as const,
                description: __('tickets.assignment.stats.oldest_unassigned_description'),
            },
        ];

    const getVariantStyles = (variant: string, customColor?: string) => {
        if (customColor) {
            return {
                card: 'border-border/60 shadow-sm',
                icon: 'border-border/50 bg-muted/20',
                value: 'text-foreground',
                iconColor: customColor,
            };
        }

        switch (variant) {
            case 'primary':
                return {
                    card: 'border-primary/20 bg-primary/5 shadow-sm',
                    icon: 'border-primary/20 bg-background text-primary',
                    value: 'text-primary',
                };
            case 'success':
                return {
                    card: 'border-emerald-500/20 bg-emerald-500/5 shadow-sm',
                    icon: 'border-emerald-500/20 bg-background text-emerald-600',
                    value: 'text-emerald-600',
                };
            case 'warning':
                return {
                    card: 'border-orange-500/20 bg-orange-500/5 shadow-sm',
                    icon: 'border-orange-500/20 bg-background text-orange-600',
                    value: 'text-orange-600',
                };
            default:
                return {
                    card: 'border-border/60 shadow-sm',
                    icon: 'border-border/50 text-muted-foreground bg-muted/20',
                    value: 'text-foreground',
                };
        }
    };

    return (
        <div className="flex flex-wrap gap-4">
            <TooltipProvider delayDuration={200}>
                {statItems.map((stat, index) => {
                    const styles = getVariantStyles(stat.variant, stat.customColor);

                    return (
                        <Tooltip key={index}>
                            <TooltipTrigger asChild>
                                <Card
                                    className={cn(
                                        'relative overflow-hidden transition-all hover:shadow-md h-full w-full sm:w-[calc(33%-1rem)] lg:w-40 xl:w-48 flex-1 min-w-[150px]',
                                        styles.card,
                                    )}
                                >
                                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 min-h-14">
                                        <CardTitle className="text-sm font-medium text-muted-foreground line-clamp-2 pr-2">
                                            {stat.label}
                                        </CardTitle>
                                        <div
                                            className={cn(
                                                'flex h-9 w-9 items-center justify-center rounded-lg border shrink-0',
                                                styles.icon,
                                            )}
                                        >
                                            <stat.icon
                                                className="h-5 w-5"
                                                style={
                                                    'iconColor' in styles
                                                        ? { color: styles.iconColor }
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
                                                    styles.value,
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
                            </TooltipTrigger>
                            <TooltipContent
                                side="bottom"
                                className="max-w-xs bg-popover text-popover-foreground backdrop-blur-sm border shadow-lg p-3"
                            >
                                <p className="text-sm leading-normal text-pretty">{stat.description}</p>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </TooltipProvider>
        </div>
    );
}
