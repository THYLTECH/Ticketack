import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTrans } from '@/lib/translation';
import {
    ListTodo,
    CheckCircle2,
    AlertCircle,
    Users,
    TrendingUp,
    UserX
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TicketStatsData {
    total: number;
    open: number;
    unassigned: number;
    resolved: number;
    avg_resolution_days: number;
    assigned_to_me: number;
}

interface TicketStatsProps {
    stats: TicketStatsData;
}

/**
 * Ticket statistics component
 * Displays overview stats for tickets including total, status breakdown, and performance metrics
 */
export function TicketStats({ stats }: TicketStatsProps) {
    const __ = useTrans();

    const statItems: Array<{
        label: string;
        value: number | string;
        icon: typeof ListTodo;
        variant?: 'default' | 'primary' | 'success' | 'warning';
        suffix?: string;
        description: string;
    }> = [
        {
            label: __('tickets.stats.total'),
            value: stats.total,
            icon: ListTodo,
            variant: 'primary',
            description: __('tickets.stats.total_description'),
        },
        {
            label: __('tickets.stats.open'),
            value: stats.open,
            icon: AlertCircle,
            variant: 'warning',
            description: __('tickets.stats.open_description'),
        },
        {
            label: __('tickets.stats.unassigned'),
            value: stats.unassigned,
            icon: UserX,
            variant: 'default',
            description: __('tickets.stats.unassigned_description'),
        },
        {
            label: __('tickets.stats.resolved'),
            value: stats.resolved,
            icon: CheckCircle2,
            variant: 'success',
            description: __('tickets.stats.resolved_description'),
        },
        {
            label: __('tickets.stats.avg_resolution'),
            value: stats.avg_resolution_days.toFixed(1),
            suffix: __('tickets.stats.days'),
            icon: TrendingUp,
            variant: 'default',
            description: __('tickets.stats.avg_resolution_description'),
        },
        {
            label: __('tickets.stats.assigned_to_me'),
            value: stats.assigned_to_me,
            icon: Users,
            variant: 'default',
            description: __('tickets.stats.assigned_to_me_description'),
        },
    ];

    const getVariantStyles = (variant?: string) => {
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
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            <TooltipProvider delayDuration={200}>
                {statItems.map((stat, index) => {
                    const styles = getVariantStyles(stat.variant);

                    return (
                        <Tooltip key={index}>
                            <TooltipTrigger asChild>
                                <Card
                                    className={cn(
                                        'relative overflow-hidden transition-all hover:shadow-md h-full',
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
                                            <stat.icon className="h-5 w-5" />
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

