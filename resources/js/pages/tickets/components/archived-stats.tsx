import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTrans } from '@/lib/translation';
import { Archive, Calendar, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArchivedStatsProps {
    stats: {
        total: number;
        resolved: number;
        avg_archive_days: number;
        archived_last_30_days: number;
    };
}

export function ArchivedStats({ stats }: ArchivedStatsProps) {
    const __ = useTrans();

    const statCards = [
        {
            label: __('tickets.pages.archived.stats.total'),
            value: stats.total,
            icon: Archive,
            variant: 'warning' as const,
            description: __('tickets.pages.archived.stats.total_description'),
        },
        {
            label: __('tickets.pages.archived.stats.resolved'),
            value: stats.resolved,
            icon: CheckCircle,
            variant: 'success' as const,
            description: __('tickets.pages.archived.stats.resolved_description'),
        },
        {
            label: __('tickets.pages.archived.stats.avg_days'),
            value: `${stats.avg_archive_days}j`,
            icon: Clock,
            variant: 'primary' as const,
            description: __('tickets.pages.archived.stats.avg_days_description'),
        },
        {
            label: __('tickets.pages.archived.stats.last_30_days'),
            value: stats.archived_last_30_days,
            icon: Calendar,
            variant: 'default' as const,
            description: __('tickets.pages.archived.stats.last_30_days_description'),
        },
    ];

    const getVariantStyles = (variant: 'default' | 'primary' | 'success' | 'warning') => {
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
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
            <TooltipProvider delayDuration={200}>
                {statCards.map((stat, index) => {
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

