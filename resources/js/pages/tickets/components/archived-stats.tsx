import { Card, CardContent } from '@/components/ui/card';
import { useTrans } from '@/lib/translation';
import { Archive, Calendar, CheckCircle, Clock } from 'lucide-react';

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
            color: 'text-amber-600',
            bgColor: 'bg-amber-50 dark:bg-amber-950/20',
        },
        {
            label: __('tickets.pages.archived.stats.resolved'),
            value: stats.resolved,
            icon: CheckCircle,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
        },
        {
            label: __('tickets.pages.archived.stats.avg_days'),
            value: `${stats.avg_archive_days}j`,
            icon: Clock,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-950/20',
        },
        {
            label: __('tickets.pages.archived.stats.last_30_days'),
            value: stats.archived_last_30_days,
            icon: Calendar,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-950/20',
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat, index) => (
                <Card key={index} className="overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">
                                    {stat.label}
                                </p>
                                <p className="text-3xl font-bold tracking-tight">
                                    {stat.value}
                                </p>
                            </div>
                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}
                            >
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

