import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { TicketSchedule } from '@/types';
import { Calendar, ChevronRight, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface UpcomingSchedulesProps {
    schedules: TicketSchedule[];
}

function formatScheduleDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const time = date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });

    if (isToday) {
        return `Aujourd'hui ${time}`;
    }
    if (isTomorrow) {
        return `Demain ${time}`;
    }
    return date.toLocaleDateString(undefined, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function UpcomingSchedules({ schedules }: UpcomingSchedulesProps) {
    const __ = useTrans();
    const [isExpanded, setIsExpanded] = useState(false);
    const limit = 5;

    const displayedSchedules = isExpanded ? schedules : schedules.slice(0, limit);
    const hasMore = schedules.length > limit;

    if (!schedules || schedules.length === 0) {
        return (
            <Card className="overflow-hidden border-border/50 bg-background/50 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 py-4 space-y-0">
                    <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        {__('home.sections.upcoming_schedules')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="rounded-full bg-muted/50 p-3 mb-3 ring-1 ring-border/50">
                        <Calendar className="h-6 w-6 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {__('home.schedules.no_upcoming')}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden border-border/50 bg-background/50 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-shadow duration-300 hover:shadow-sm">
            <CardHeader className="border-b border-border/40 py-4">
                <div className="flex items-center gap-2">
                    <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        {__('home.sections.upcoming_schedules')}
                        <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                            {schedules.length}
                        </Badge>
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <ul className="divide-y divide-border/40">
                    {displayedSchedules.map((schedule) => (
                        <li key={schedule.id}>
                            <Link
                                href={route('tickets.show', { ticket: schedule.ticket_id, tab: 'calendar' })}
                                className="group flex items-center gap-4 p-4 transition-all duration-200 hover:bg-primary/5 hover:pl-5"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-card/50 text-muted-foreground group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary transition-all shadow-sm">
                                    <Clock className="h-5 w-5" />
                                </div>

                                <div className="flex-1 min-w-0 space-y-1">
                                    <p className="text-sm font-medium truncate text-foreground/90 group-hover:text-foreground transition-colors">
                                        #{schedule.ticket_id} - {schedule.ticket?.title}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                                        <Calendar className="h-3 w-3" />
                                        <span className="font-medium">{formatScheduleDate(schedule.start_date)}</span>
                                        <span className="text-muted-foreground/50">•</span>
                                        <Badge variant="outline" className="h-4 rounded-[4px] px-1 text-[10px] bg-muted/50 border-input">
                                            {schedule.duration_minutes}min
                                        </Badge>
                                    </div>
                                </div>

                                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/30 group-hover:text-primary transition-all group-hover:translate-x-0.5" />
                            </Link>
                        </li>
                    ))}
                </ul>
                {hasMore && (
                    <div className="border-t border-border/40 bg-muted/5 p-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="h-8 w-full text-xs font-medium text-muted-foreground hover:bg-background hover:text-foreground"
                        >
                            {isExpanded ? (
                                <>
                                    <ChevronUp className="mr-1.5 h-3 w-3" />
                                    {__('common.actions.read_less')}
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="mr-1.5 h-3 w-3" />
                                    {__('common.actions.read_more')}
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
