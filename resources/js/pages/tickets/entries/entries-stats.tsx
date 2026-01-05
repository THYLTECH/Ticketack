import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { Activity, CalendarRange, Clock, LucideIcon } from 'lucide-react';

interface StatsProps {
    total_hours: number;
    count: number;
    period: string;
}

export function EntriesStats({ stats }: { stats: StatsProps }) {
    const __ = useTrans();

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <StatsCard
                title={__('entries.stats.total_hours.title')}
                value={`${stats.total_hours} ${__('entries.stats.unit')}`}
                icon={Clock}
                description={__('entries.stats.total_hours.description')}
                variant="primary"
            />
            <StatsCard
                title={__('entries.stats.count.title')}
                value={stats.count}
                icon={Activity}
                description={__('entries.stats.count.description')}
            />
            <StatsCard
                title={__('entries.stats.period.title')}
                value={stats.period}
                icon={CalendarRange}
                description={__('entries.stats.period.description')}
            />
        </div>
    );
}

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    className?: string;
    variant?: 'default' | 'primary';
}

function StatsCard({
    title,
    value,
    icon: Icon,
    description,
    className,
    variant = 'default',
}: StatsCardProps) {
    const isPrimary = variant === 'primary';

    return (
        <Card
            className={cn(
                'relative overflow-hidden transition-all hover:shadow-md',
                isPrimary
                    ? 'border-primary/20 bg-primary/5 shadow-sm'
                    : 'border-border/60 shadow-sm',
                className,
            )}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div
                    className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-lg border',
                        isPrimary
                            ? 'border-primary/20 bg-background text-primary'
                            : 'border-border/50 bg-muted/20 text-muted-foreground',
                    )}
                >
                    <Icon className="h-5 w-5" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-1">
                    <div
                        className={cn(
                            'truncate text-2xl font-bold tracking-tight',
                            isPrimary ? 'text-primary' : 'text-foreground',
                        )}
                    >
                        {value}
                    </div>
                    {description && (
                        <p className="truncate text-xs text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
