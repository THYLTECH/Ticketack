import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTrans } from '@/lib/translation';
import { TicketSchedule } from '@/types';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, User, Trash2, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScheduleListProps {
    schedules: TicketSchedule[];
    onEdit?: (schedule: TicketSchedule) => void;
    onDelete?: (id: number) => void;
    compact?: boolean;
}

export function ScheduleList({ schedules, onEdit, onDelete, compact = false }: ScheduleListProps) {
    const __ = useTrans();

    if (schedules.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Calendar className="mb-4 h-12 w-12 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">
                        {__('schedule.no_schedules')}
                    </p>
                </CardContent>
            </Card>
        );
    }

    const sortedSchedules = [...schedules].sort((a, b) =>
        parseISO(a.start_date).getTime() - parseISO(b.start_date).getTime()
    );

    return (
        <div className={cn("space-y-3", compact && "space-y-2")}>
            {sortedSchedules.map((schedule) => {
                const isEntry = schedule.is_entry === true;
                const startDate = parseISO(schedule.start_date);
                const endDate = parseISO(schedule.end_date);
                const durationHours = Math.floor(schedule.duration_minutes / 60);
                const durationMins = schedule.duration_minutes % 60;

                return (
                    <Card
                        key={schedule.id}
                        className={cn(
                            "group overflow-hidden transition-all hover:shadow-md",
                            isEntry && "border-dashed border-muted-foreground/30 bg-muted/30"
                        )}
                    >
                        <CardContent className={cn("p-4", compact && "p-3")}>
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className={cn(
                                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                                            isEntry
                                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                : "bg-primary/10 text-primary"
                                        )}>
                                            {isEntry ? (
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <Calendar className="h-5 w-5" />
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-foreground">
                                                    {format(startDate, 'EEEE d MMMM yyyy')}
                                                </h4>
                                                {isEntry && (
                                                    <Badge variant="outline" className="h-5 text-xs text-emerald-600 dark:text-emerald-400">
                                                        {__('schedule.tooltip.validated')}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    <span className="font-mono">
                                                        {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-medium">
                                                        {durationHours > 0 && `${durationHours}h `}
                                                        {durationMins > 0 && `${durationMins}min`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">
                                            {schedule.user.name}
                                        </span>
                                    </div>
                                </div>

                                {!isEntry && (onEdit || onDelete) && (
                                    <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                        {onEdit && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => onEdit(schedule)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        )}
                                        {onDelete && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() => onDelete(schedule.id as number)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

