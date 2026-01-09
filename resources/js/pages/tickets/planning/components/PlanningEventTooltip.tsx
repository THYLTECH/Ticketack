import { useTrans } from '@/lib/translation';
import { TicketSchedule } from '@/types';
import { TooltipContent } from '@/components/ui/tooltip';
import { format, parseISO } from 'date-fns';
import { usePage } from '@inertiajs/react';
import { enUS, fr } from 'date-fns/locale';

interface PlanningEventTooltipProps {
    event: TicketSchedule;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
}

export function PlanningEventTooltip({ event, side = 'right', align = 'start' }: PlanningEventTooltipProps) {
    const __ = useTrans();
    const { props } = usePage<{ locale: string }>();

    const getDateLocale = () => {
        switch (props.locale) {
            case 'fr':
                return fr;
            case 'en':
            default:
                return enUS;
        }
    };

    const dateLocale = getDateLocale();
    const isEntry = event.is_entry === true;
    const startDate = parseISO(event.start_date);
    const endDate = parseISO(event.end_date);
    const durationHours = Math.floor(event.duration_minutes / 60);
    const durationMins = event.duration_minutes % 60;

    return (
        <TooltipContent
            side={side}
            align={align}
            className="max-w-96 border-border/50 bg-gradient-to-br from-card to-card/95 p-0 shadow-2xl backdrop-blur-xl"
            sideOffset={12}
        >
            <div className="space-y-3 p-4">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary shadow-sm ring-1 ring-primary/20">
                        {isEntry ? (
                            <span className="text-lg font-bold">✓</span>
                        ) : (
                            <span className="text-base font-semibold">#</span>
                        )}
                    </div>
                    <div className="flex-1 space-y-1">
                        <div className="font-semibold leading-tight text-foreground">
                            {event.ticket.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Ticket #{event.ticket.id}
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-3 rounded-lg bg-muted/30 px-3 py-2">
                        <span className="w-20 font-medium text-muted-foreground">
                            {__('schedule.tooltip.assignee')}
                        </span>
                        <span className="flex-1 font-semibold text-foreground">
                            {event.user.name}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-muted/30 px-3 py-2">
                        <span className="w-20 font-medium text-muted-foreground">
                            {__('schedule.tooltip.date')}
                        </span>
                        <span className="flex-1 font-semibold text-foreground">
                            {format(startDate, 'EEEE d MMMM yyyy', { locale: dateLocale })}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-muted/30 px-3 py-2">
                        <span className="w-20 font-medium text-muted-foreground">
                            {__('schedule.tooltip.time')}
                        </span>
                        <span className="flex-1 font-mono font-bold text-foreground">
                            {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-muted/30 px-3 py-2">
                        <span className="w-20 font-medium text-muted-foreground">
                            {__('schedule.tooltip.duration')}
                        </span>
                        <span className="flex-1 font-semibold text-foreground">
                            {durationHours > 0 && `${durationHours}h `}
                            {durationMins > 0 && `${durationMins}min`}
                        </span>
                    </div>
                    {event.ticket.priority && (
                        <div className="flex items-center gap-3 rounded-lg bg-muted/30 px-3 py-2">
                            <span className="w-20 font-medium text-muted-foreground">
                                {__('schedule.tooltip.priority')}
                            </span>
                            <span className="flex-1 font-semibold text-foreground">
                                {event.ticket.priority.title}
                            </span>
                        </div>
                    )}
                    {event.ticket.category && (
                        <div className="flex items-center gap-3 rounded-lg bg-muted/30 px-3 py-2">
                            <span className="w-20 font-medium text-muted-foreground">
                                {__('schedule.tooltip.category')}
                            </span>
                            <span className="flex-1 font-semibold text-foreground">
                                {event.ticket.category.title}
                            </span>
                        </div>
                    )}
                    {event.ticket.status && (
                        <div className="flex items-center gap-3 rounded-lg bg-muted/30 px-3 py-2">
                            <span className="w-20 font-medium text-muted-foreground">
                                {__('schedule.tooltip.status')}
                            </span>
                            <span className="flex-1 font-semibold text-foreground">
                                {event.ticket.status.title}
                            </span>
                        </div>
                    )}
                </div>

                {isEntry && (
                    <>
                        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                        <div className="flex items-center gap-2.5 rounded-lg bg-muted/40 px-3 py-2.5 ring-1 ring-border/50">
                            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 ring-1 ring-emerald-500/30">
                                <svg className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">
                                {__('schedule.tooltip.validated')}
                            </span>
                        </div>
                    </>
                )}
            </div>
        </TooltipContent>
    );
}

