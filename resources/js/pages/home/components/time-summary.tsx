import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTrans } from '@/lib/translation';
import { formatDate } from '@/lib/utils';
import { TicketEntry } from '@/types';
import { Clock, Timer } from 'lucide-react';

interface TimeSummaryProps {
    weeklyHours: number | null;
    recentEntries: TicketEntry[];
}

function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

export function TimeSummary({ weeklyHours, recentEntries }: TimeSummaryProps) {
    const __ = useTrans();

    return (
        <Card className="overflow-hidden border-border/50 bg-background/50 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-shadow duration-300 hover:shadow-sm">
            <CardHeader className="border-b border-border/40 py-4">
                <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
                    <Timer className="h-4 w-4 text-primary" />
                    {__('home.sections.time_tracking')}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 border border-primary/10">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            {__('home.time.this_week')}
                        </p>
                        <p className="text-3xl font-bold tracking-tight text-foreground">{weeklyHours ?? 0}h</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-primary" />
                    </div>
                </div>

                {recentEntries && recentEntries.length > 0 ? (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <p className="text-xs font-medium text-muted-foreground">
                                {__('home.time.recent_entries')}
                            </p>
                            <Link href={route('tickets.entries.index')} className="text-xs text-primary hover:underline">
                                {__('common.actions.view_all')}
                            </Link>
                        </div>
                        <ul className="space-y-2">
                            {recentEntries.slice(0, 3).map((entry) => {
                                let startDate = new Date(entry.start_at);
                                if (isNaN(startDate.getTime())) {
                                    startDate = new Date();
                                }
                                const endDate = new Date(startDate.getTime() + entry.duration_seconds * 1000);
                                const timeRange = `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

                                return (
                                    <li key={entry.id}>
                                        <Link
                                            href={route('tickets.show', { ticket: entry.ticket_id, tab: 'calendar' })}
                                            className="group flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 p-3 transition-all hover:bg-primary/5 hover:border-primary/20 hover:shadow-sm"
                                        >
                                            <div
                                                className="h-2 w-2 shrink-0 rounded-full ring-2 ring-background shadow-sm"
                                                style={{ backgroundColor: entry.ticket?.status?.color || '#6b7280' }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="text-xs font-semibold text-muted-foreground">#{entry.ticket_id}</span>
                                                    <span className="text-xs text-muted-foreground/50">•</span>
                                                    <span className="text-xs text-muted-foreground">{formatDate(entry.start_at)}</span>
                                                </div>
                                                <p className="text-sm font-medium truncate text-foreground/90 group-hover:text-foreground transition-colors">
                                                    {entry.ticket?.title || __('tickets.defaults.untitled')}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                                    <Clock className="h-3 w-3 opacity-70" />
                                                    {timeRange}
                                                </p>
                                            </div>
                                            <Badge variant="secondary" className="shrink-0 bg-background/80 group-hover:bg-background transition-colors font-mono">
                                                {formatDuration(entry.duration_seconds)}
                                            </Badge>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <div className="rounded-full bg-muted/30 p-3 mb-2">
                            <Timer className="h-5 w-5 text-muted-foreground/50" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {__('home.time.no_entries')}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
