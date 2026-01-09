import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { TicketSchedule, UpdatePayload } from '@/types';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    addDays,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    getHours,
    getMinutes,
    isSameDay,
    isSameMonth,
    isToday,
    parseISO,
    startOfMonth,
    startOfWeek,
} from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import { usePage } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';

export type ViewType = 'day' | 'week' | 'month';

const START_HOUR = 0;
const END_HOUR = 24;
const HOURS = Array.from(
    { length: END_HOUR - START_HOUR },
    (_, i) => START_HOUR + i,
);
const CELL_HEIGHT = 60;
const WORK_START_HOUR = 8;

const COLORS = [
    'bg-blue-500/10 border-l-4 border-blue-500 text-blue-700 dark:text-blue-100',
    'bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-700 dark:text-emerald-100',
    'bg-violet-500/10 border-l-4 border-violet-500 text-violet-700 dark:text-violet-100',
    'bg-amber-500/10 border-l-4 border-amber-500 text-amber-700 dark:text-amber-100',
    'bg-rose-500/10 border-l-4 border-rose-500 text-rose-700 dark:text-rose-100',
];

const DOT_COLORS = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-violet-500',
    'bg-amber-500',
    'bg-rose-500',
];

interface Props {
    events: TicketSchedule[];
    view: ViewType;
    currentDate: Date;
    isEditMode: boolean;
    currentUserId: number;
    selectedSolvers: number[];
    highlightedEventId?: number | string | null;
    onDrop: (date: Date, ticketId?: number, eventId?: number) => void;
    onUpdate: (id: number, data: UpdatePayload) => void;
    onEventClick: (event: TicketSchedule) => void;
    onSlotClick?: (date: Date) => void;
}

export function PlanningGrid({
    events,
    view,
    currentDate,
    isEditMode,
    currentUserId,
    selectedSolvers,
    highlightedEventId,
    onDrop,
    onUpdate,
    onEventClick,
    onSlotClick,
}: Props) {
    const __ = useTrans();
    const { props } = usePage<{ locale: string }>();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

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

    const [resizingEvent, setResizingEvent] = useState<{
        id: number | string;
        initialY: number;
        initialDuration: number;
        currentDuration: number;
        startData: string;
    } | null>(null);

    const isResizingRef = useRef(false);

    useEffect(() => {
        if (scrollAreaRef.current && (view === 'week' || view === 'day')) {
            scrollAreaRef.current.scrollTop =
                WORK_START_HOUR * CELL_HEIGHT - 20;
        }
    }, [view]);

    const getEventLayout = (dayEvents: TicketSchedule[]) => {
        const schedules = dayEvents.filter(e => !e.is_entry);
        const entries = dayEvents.filter(e => e.is_entry);

        const sorted = [...schedules].sort(
            (a, b) =>
                parseISO(a.start_date).getTime() -
                parseISO(b.start_date).getTime(),
        );

        const columns: TicketSchedule[][] = [];
        const layout = new Map<number | string, { left: number; width: number; column: number; totalColumns: number }>();

        sorted.forEach((event) => {
            const eventStart = parseISO(event.start_date);
            const eventEnd = parseISO(event.end_date);

            let colIndex = 0;
            while (true) {
                const col = columns[colIndex] || [];
                const hasOverlap = col.some((placedEvent) => {
                    const placedStart = parseISO(placedEvent.start_date);
                    const placedEnd = parseISO(placedEvent.end_date);

                    return eventStart < placedEnd && eventEnd > placedStart;
                });

                if (!hasOverlap) {
                    if (!columns[colIndex]) columns[colIndex] = [];
                    columns[colIndex].push(event);
                    layout.set(event.id, { left: colIndex, width: 0, column: colIndex, totalColumns: 0 });
                    break;
                }
                colIndex++;
            }
        });

        const totalColumns = columns.length;
        if (totalColumns > 0) {
            sorted.forEach((event) => {
                const pos = layout.get(event.id);
                if (pos) {
                    const GAP_PERCENT = 0.5;
                    const columnWidth = (100 - (GAP_PERCENT * (totalColumns - 1))) / totalColumns;
                    const leftPosition = pos.left * (columnWidth + GAP_PERCENT);

                    layout.set(event.id, {
                        left: leftPosition,
                        width: columnWidth,
                        column: pos.left,
                        totalColumns: totalColumns
                    });
                }
            });
        }

        entries.forEach((entry) => {
            layout.set(entry.id, {
                left: 0,
                width: 100,
                column: 0,
                totalColumns: 1
            });
        });

        return layout;
    };

    const getEventStyle = (
        event: TicketSchedule,
        layoutData: { left: number; width: number; column: number; totalColumns: number } | undefined,
    ) => {
        const isResizing = resizingEvent?.id === event.id;
        const isEntry = event.is_entry === true;
        const duration = isResizing
            ? resizingEvent.currentDuration
            : event.duration_minutes;
        const start = parseISO(event.start_date);
        const minutesFromStart =
            (getHours(start) - START_HOUR) * 60 + getMinutes(start);

        let zIndex = 10;
        if (isResizing) {
            zIndex = 60;
        } else if (!isEntry) {
            zIndex = layoutData ? 20 + layoutData.column : 20;
        }

        return {
            top: `${(minutesFromStart / 60) * CELL_HEIGHT}px`,
            height: `${Math.max((duration / 60) * CELL_HEIGHT, 24)}px`,
            left: layoutData ? `${layoutData.left}%` : '0%',
            width: layoutData ? `${layoutData.width}%` : '100%',
            zIndex,
        };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!resizingEvent) return;
            const deltaY = e.clientY - resizingEvent.initialY;
            let newDuration =
                resizingEvent.initialDuration +
                Math.round((deltaY / CELL_HEIGHT) * 60);
            newDuration = Math.max(15, Math.ceil(newDuration / 15) * 15);

            setResizingEvent((prev) =>
                prev ? { ...prev, currentDuration: newDuration } : null,
            );
        };

        const handleMouseUp = () => {
            if (resizingEvent) {
                const event = events.find(e => e.id === resizingEvent.id);
                if (event?.is_entry) {
                    setResizingEvent(null);
                    setTimeout(() => {
                        isResizingRef.current = false;
                    }, 100);
                    return;
                }

                const numericId = typeof resizingEvent.id === 'number'
                    ? resizingEvent.id
                    : (resizingEvent.id.startsWith('entry-')
                        ? parseInt(resizingEvent.id.replace('entry-', ''))
                        : parseInt(resizingEvent.id));

                onUpdate(numericId, {
                    start_date: resizingEvent.startData,
                    duration_minutes: resizingEvent.currentDuration,
                });
                setResizingEvent(null);
                setTimeout(() => {
                    isResizingRef.current = false;
                }, 100);
            }
        };


        if (resizingEvent) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizingEvent, onUpdate, events]);

    const handleDragOver = (e: React.DragEvent) => {
        if (isEditMode) e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, day: Date, hour: number = 8) => {
        if (!isEditMode) return;
        e.preventDefault();
        const ticketId = e.dataTransfer.getData('ticketId');
        const eventId = e.dataTransfer.getData('eventId');

        const targetDate = new Date(day);
        targetDate.setHours(hour, 0, 0, 0);

        if (ticketId) {
            onDrop(targetDate, parseInt(ticketId), undefined);
        } else if (eventId) {
            const event = events.find(e => e.id.toString() === eventId);
            if (event?.is_entry) return;

            const numericId = eventId.startsWith('entry-')
                ? parseInt(eventId.replace('entry-', ''))
                : parseInt(eventId);
            onDrop(targetDate, undefined, numericId);
        }
    };


    const handleSlotClick = (day: Date, hour: number) => {
        if (!isEditMode || !onSlotClick) return;
        const targetDate = new Date(day);
        targetDate.setHours(hour, 0, 0, 0);
        onSlotClick(targetDate);
    };

    if (view === 'month') {
        const monthStart = startOfWeek(startOfMonth(currentDate), {
            weekStartsOn: 1,
        });
        const monthEnd = endOfWeek(endOfMonth(currentDate), {
            weekStartsOn: 1,
        });
        const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
        const weekDays = [
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday',
        ];

        return (
            <div className="flex h-full flex-col overflow-hidden bg-card select-none">
                <div className="flex flex-1 flex-col overflow-y-auto">
                    <div className="sticky top-0 z-20 flex h-12 shrink-0 border-b bg-background sm:h-28">
                        {weekDays.map((dayKey) => (
                            <div
                                key={dayKey}
                                className="flex flex-1 items-center justify-center border-r border-border bg-muted/40 text-center text-xs font-semibold tracking-wider text-muted-foreground uppercase last:border-r-0"
                            >
                                <span className="hidden sm:inline">
                                    {__(`schedule.days.${dayKey}`)}
                                </span>
                                <span className="sm:hidden">
                                    {__(`schedule.days.${dayKey}`).charAt(0)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="grid flex-1 auto-rows-fr grid-cols-7">
                        {days.map((day, idx) => {
                            const dayEvents = events.filter(
                                (e) => {
                                    if (!isSameDay(parseISO(e.start_date), day)) return false;
                                    if (e.is_entry) {
                                        return e.user_id === currentUserId;
                                    }
                                    return isEditMode
                                        ? e.user_id === currentUserId
                                        : selectedSolvers.includes(e.user_id);
                                },
                            );
                            return (
                                <div
                                    key={day.toString()}
                                    className={cn(
                                        'group relative min-h-15 border-r border-b p-1 transition-colors sm:min-h-30 sm:p-2',
                                        !isSameMonth(day, currentDate) &&
                                            'bg-muted text-muted-foreground',
                                        idx % 7 === 6 && 'border-r-0',
                                        isEditMode &&
                                            'cursor-pointer hover:bg-muted/50',
                                    )}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, day)}
                                    onClick={() => handleSlotClick(day, 8)}
                                >
                                    <div className="mb-1 flex justify-center sm:justify-end">
                                        <span
                                            className={cn(
                                                'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                                                isToday(day)
                                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                                    : 'text-foreground/70',
                                            )}
                                        >
                                            {format(day, 'd')}
                                        </span>
                                    </div>
                                    <div className="mt-1 flex flex-wrap justify-center gap-1 sm:hidden">
                                        {dayEvents.map((evt) => {
                                            const isEntry = evt.is_entry === true;
                                            const startDate = parseISO(evt.start_date);
                                            const endDate = parseISO(evt.end_date);
                                            const durationHours = Math.floor(evt.duration_minutes / 60);
                                            const durationMins = evt.duration_minutes % 60;

                                            return (
                                                <TooltipProvider key={evt.id} delayDuration={300}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (!isEntry) onEventClick(evt);
                                                                }}
                                                                className={cn(
                                                                    'h-1.5 w-1.5 rounded-full',
                                                                    isEntry
                                                                        ? 'cursor-default bg-muted-foreground/40'
                                                                        : cn(
                                                                              'cursor-pointer',
                                                                              DOT_COLORS[
                                                                                  evt.user_id %
                                                                                      DOT_COLORS.length
                                                                              ],
                                                                          ),
                                                                )}
                                                            />
                                                        </TooltipTrigger>
                                                        <TooltipContent
                                                            side="right"
                                                            align="start"
                                                            className="max-w-80 p-0 shadow-xl"
                                                            sideOffset={8}
                                                        >
                                                            <div className="space-y-2 p-3">
                                                                <div className="flex items-start gap-2">
                                                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                                                        {isEntry ? '✓' : '#'}
                                                                    </div>
                                                                    <div className="flex-1 space-y-1">
                                                                        <div className="font-semibold leading-tight text-foreground">
                                                                            {evt.ticket.title}
                                                                        </div>
                                                                        <div className="text-xs text-muted-foreground">
                                                                            Ticket #{evt.ticket.id}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="h-px bg-border" />

                                                                <div className="space-y-1.5 text-xs">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="w-16 text-muted-foreground">
                                                                            {__('schedule.tooltip.assignee')}:
                                                                        </span>
                                                                        <span className="font-medium text-foreground">
                                                                            {evt.user.name}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="w-16 text-muted-foreground">
                                                                            {__('schedule.tooltip.date')}:
                                                                        </span>
                                                                        <span className="font-medium text-foreground">
                                                                            {format(startDate, 'EEEE d MMMM yyyy', { locale: dateLocale })}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="w-16 text-muted-foreground">
                                                                            {__('schedule.tooltip.time')}:
                                                                        </span>
                                                                        <span className="font-medium text-foreground">
                                                                            {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="w-16 text-muted-foreground">
                                                                            {__('schedule.tooltip.duration')}:
                                                                        </span>
                                                                        <span className="font-medium text-foreground">
                                                                            {durationHours > 0 && `${durationHours}h `}
                                                                            {durationMins > 0 && `${durationMins}min`}
                                                                        </span>
                                                                    </div>
                                                                    {evt.ticket.priority && (
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="w-16 text-muted-foreground">
                                                                                {__('schedule.tooltip.priority')}:
                                                                            </span>
                                                                            <span className="font-medium text-foreground">
                                                                                {evt.ticket.priority.title}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    {evt.ticket.category && (
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="w-16 text-muted-foreground">
                                                                                {__('schedule.tooltip.category')}:
                                                                            </span>
                                                                            <span className="font-medium text-foreground">
                                                                                {evt.ticket.category.title}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    {evt.ticket.status && (
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="w-16 text-muted-foreground">
                                                                                {__('schedule.tooltip.status')}:
                                                                            </span>
                                                                            <span className="font-medium text-foreground">
                                                                                {evt.ticket.status.title}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {isEntry && (
                                                                    <>
                                                                        <div className="h-px bg-border" />
                                                                        <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 ring-1 ring-border/50">
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
                                                    </Tooltip>
                                                </TooltipProvider>
                                            );
                                        })}
                                    </div>

                                    <div className="hidden sm:block">
                                        {dayEvents.map((evt) => {
                                            const isEntry = evt.is_entry === true;
                                            const startDate = parseISO(evt.start_date);
                                            const endDate = parseISO(evt.end_date);
                                            const durationHours = Math.floor(evt.duration_minutes / 60);
                                            const durationMins = evt.duration_minutes % 60;

                                            return (
                                                <TooltipProvider key={`${evt.id}-${evt.updated_at}`} delayDuration={300}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div
                                                                draggable={
                                                                    isEditMode && !isEntry
                                                                }
                                                                onDragStart={(e) => {
                                                                    if (isEntry) {
                                                                        e.preventDefault();
                                                                        return;
                                                                    }
                                                                    e.dataTransfer.setData(
                                                                        'eventId',
                                                                        evt.id.toString(),
                                                                    );
                                                                }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onEventClick(evt);
                                                                }}
                                                                className={cn(
                                                                    'mb-1 truncate rounded-md px-2 py-1 text-[10px] font-medium shadow-sm ring-1 ring-black/5 transition-all dark:ring-white/5',
                                                                    highlightedEventId === evt.id
                                                                        ? 'animate-pulse cursor-pointer border-2 border-yellow-500 bg-yellow-100/90 text-yellow-900 shadow-lg ring-2 ring-yellow-400/50 dark:bg-yellow-900/40 dark:text-yellow-100'
                                                                        : isEntry
                                                                        ? 'cursor-default border-2 border-l-2 border-dashed border-muted-foreground/30 bg-muted/60 text-muted-foreground'
                                                                        : cn(
                                                                              'cursor-pointer border-l-4 hover:shadow-md hover:brightness-95 hover:ring-2',
                                                                              COLORS[
                                                                                  evt.user_id %
                                                                                      COLORS.length
                                                                              ],
                                                                          ),
                                                                )}
                                                            >
                                                                <span className="mr-1 font-bold opacity-70">
                                                                    {isEntry && (
                                                                        <span className="text-green-600 dark:text-green-500">
                                                                            ✓{' '}
                                                                        </span>
                                                                    )}
                                                                    {format(startDate, 'HH:mm')}
                                                                </span>
                                                                {evt.ticket.title}
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent
                                                            side="right"
                                                            align="start"
                                                            className="max-w-96 border-border/50 bg-linear-to-br from-card to-card/95 p-0 shadow-2xl backdrop-blur-xl"
                                                            sideOffset={12}
                                                        >
                                                            <div className="space-y-3 p-4">
                                                                <div className="flex items-start gap-3">
                                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-primary/10 text-primary shadow-sm ring-1 ring-primary/20">
                                                                        {isEntry ? (
                                                                            <span className="text-lg font-bold">✓</span>
                                                                        ) : (
                                                                            <span className="text-base font-semibold">#</span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 space-y-1">
                                                                        <div className="font-semibold leading-tight text-foreground">
                                                                            {evt.ticket.title}
                                                                        </div>
                                                                        <div className="text-xs text-muted-foreground">
                                                                            Ticket #{evt.ticket.id}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />

                                                                <div className="space-y-2 text-xs">
                                                                    <div className="flex items-center gap-3 rounded-lg bg-muted/30 px-3 py-2">
                                                                        <span className="w-20 font-medium text-muted-foreground">
                                                                            {__('schedule.tooltip.assignee')}
                                                                        </span>
                                                                        <span className="flex-1 font-semibold text-foreground">
                                                                            {evt.user.name}
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
                                                                    {evt.ticket.priority && (
                                                                        <div className="flex items-center gap-3 rounded-lg bg-muted/30 px-3 py-2">
                                                                            <span className="w-20 font-medium text-muted-foreground">
                                                                                {__('schedule.tooltip.priority')}
                                                                            </span>
                                                                            <span className="flex-1 font-semibold text-foreground">
                                                                                {evt.ticket.priority.title}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    {evt.ticket.category && (
                                                                        <div className="flex items-center gap-3 rounded-lg bg-muted/30 px-3 py-2">
                                                                            <span className="w-20 font-medium text-muted-foreground">
                                                                                {__('schedule.tooltip.category')}
                                                                            </span>
                                                                            <span className="flex-1 font-semibold text-foreground">
                                                                                {evt.ticket.category.title}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    {evt.ticket.status && (
                                                                        <div className="flex items-center gap-3 rounded-lg bg-muted/30 px-3 py-2">
                                                                            <span className="w-20 font-medium text-muted-foreground">
                                                                                {__('schedule.tooltip.status')}
                                                                            </span>
                                                                            <span className="flex-1 font-semibold text-foreground">
                                                                                {evt.ticket.status.title}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {isEntry && (
                                                                    <>
                                                                        <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />
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
                                                    </Tooltip>
                                                </TooltipProvider>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    const days =
        view === 'day'
            ? [currentDate]
            : Array.from({ length: 7 }, (_, i) =>
                  addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), i),
              );
    const colWidth = `${100 / days.length}%`;

    return (
        <div className="flex h-full flex-col overflow-hidden bg-background">
            <div className="z-50 flex h-28 shrink-0 border-b bg-card shadow-sm ring-1 ring-border/5">
                <div className="w-17 shrink-0 border-r border-border bg-card"></div>
                <div className="flex h-full flex-1">
                    {days.map((day) => {
                        const dayKey = format(day, 'eeee').toLowerCase();
                        return (
                            <div
                                key={day.toString()}
                                style={{ width: colWidth }}
                                className={cn(
                                    'flex h-full flex-col items-center justify-center border-r border-border bg-card text-center last:border-r-0',
                                    isToday(day) && 'bg-primary/5',
                                )}
                            >
                                <span
                                    className={cn(
                                        'mb-1 text-xs font-bold tracking-wider uppercase',
                                        isToday(day)
                                            ? 'text-primary'
                                            : 'text-muted-foreground',
                                    )}
                                >
                                    {__(`schedule.days.${dayKey}`)}
                                </span>
                                <div
                                    className={cn(
                                        'flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold transition-all',
                                        isToday(day)
                                            ? 'scale-110 bg-primary text-primary-foreground shadow-md'
                                            : 'text-foreground',
                                    )}
                                >
                                    {format(day, 'd')}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div
                ref={scrollAreaRef}
                className="scrollbar-thin relative z-0 flex-1 overflow-y-auto"
            >
                <div
                    className="relative flex min-h-full"
                    style={{ height: HOURS.length * CELL_HEIGHT }}
                >
                    <div className="z-30 flex w-17 shrink-0 flex-col border-r bg-card shadow-[4px_0_24px_rgba(0,0,0,0.02)] select-none">
                        {HOURS.map((hour) => (
                            <div
                                key={hour}
                                className="relative h-15 border-b border-transparent"
                            >
                                <span
                                    className={cn(
                                        'absolute right-3 bg-card px-1 font-mono text-xs font-medium text-muted-foreground',
                                        hour === START_HOUR
                                            ? 'top-1'
                                            : '-top-2.5',
                                    )}
                                >
                                    {hour}:00
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="relative flex flex-1">
                        <div className="pointer-events-none absolute inset-0 z-0 w-full">
                            {HOURS.map((hour) => (
                                <div
                                    key={hour}
                                    className="h-15 w-full border-b border-border/40"
                                />
                            ))}
                        </div>

                        {days.map((day) => {
                            const dayEvents = events.filter(
                                (e) => {
                                    if (!isSameDay(parseISO(e.start_date), day)) return false;
                                    if (e.is_entry) {
                                        return e.user_id === currentUserId;
                                    }
                                    return isEditMode
                                        ? e.user_id === currentUserId
                                        : selectedSolvers.includes(e.user_id);
                                },
                            );

                            const layoutMap = getEventLayout(dayEvents);

                            return (
                                <div
                                    key={day.toString()}
                                    style={{ width: colWidth }}
                                    className={cn(
                                        'group relative border-r border-border transition-all last:border-r-0',
                                        isToday(day) ? 'z-40' : 'z-10',
                                        'hover:z-50',
                                    )}
                                >
                                    {HOURS.map((hour) => (
                                        <div
                                            key={hour}
                                            style={{ height: CELL_HEIGHT }}
                                            className={cn(
                                                'w-full transition-colors',
                                                isEditMode &&
                                                    'cursor-pointer hover:bg-primary/5 active:bg-primary/10',
                                            )}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) =>
                                                handleDrop(e, day, hour)
                                            }
                                            onClick={() =>
                                                handleSlotClick(day, hour)
                                            }
                                        />
                                    ))}

                                    {isToday(day) && (
                                        <div
                                            className="pointer-events-none absolute z-50 flex w-full -translate-y-1/2 transform items-center"
                                            style={{
                                                top: `${(((getHours(new Date()) - START_HOUR) * 60 + getMinutes(new Date())) / 60) * CELL_HEIGHT}px`,
                                            }}
                                        >
                                            <div className="-ml-1.5 h-3 w-3 shrink-0 rounded-full bg-red-500 shadow-sm ring-2 ring-background" />
                                            <div className="h-0.5 w-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                                        </div>
                                    )}

                                    {dayEvents.map((event) => {
                                        const isEntry = event.is_entry === true;
                                        const isResizing =
                                            resizingEvent?.id === event.id;
                                        const layout = layoutMap.get(
                                            typeof event.id === 'number'
                                                ? event.id
                                                : 0,
                                        );

                                        const startDate = parseISO(event.start_date);
                                        const endDate = parseISO(event.end_date);
                                        const durationHours = Math.floor(event.duration_minutes / 60);
                                        const durationMins = event.duration_minutes % 60;

                                        return (
                                            <TooltipProvider key={`${event.id}-${event.updated_at}`} delayDuration={300}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div
                                                            draggable={
                                                                isEditMode &&
                                                                !isEntry &&
                                                                !isResizing
                                                            }
                                                            onDragStart={(e) => {
                                                                if (isEntry) {
                                                                    e.preventDefault();
                                                                    return;
                                                                }
                                                                e.dataTransfer.setData(
                                                                    'eventId',
                                                                    event.id.toString(),
                                                                );
                                                            }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (
                                                                    isResizingRef.current ||
                                                                    isEntry
                                                                )
                                                                    return;
                                                                onEventClick(event);
                                                            }}
                                                            className={cn(
                                                                'group/event absolute flex flex-col justify-center overflow-hidden rounded-lg px-2 py-1.5 text-xs transition-all duration-200',
                                                                highlightedEventId === event.id
                                                                    ? 'animate-pulse cursor-pointer border-2 border-yellow-500 bg-yellow-100/90 text-yellow-900 shadow-lg ring-2 ring-yellow-400/50 dark:bg-yellow-900/40 dark:text-yellow-100'
                                                                    : isEntry
                                                                    ? 'cursor-default border-2 border-dashed border-muted-foreground/30 bg-muted/70 text-muted-foreground shadow-sm backdrop-blur-sm'
                                                                    : cn(
                                                                          'cursor-pointer border-l-4',
                                                                          COLORS[
                                                                              event.user_id %
                                                                                  COLORS.length
                                                                          ],
                                                                          'shadow-md ring-1 ring-black/5 dark:ring-white/5',
                                                                      ),
                                                                isEditMode &&
                                                                    !isEntry &&
                                                                    'cursor-move',
                                                                !isEntry &&
                                                                    highlightedEventId !== event.id &&
                                                                    'hover:z-50 hover:shadow-xl hover:ring-2 hover:ring-offset-1 hover:brightness-105',
                                                                isResizing &&
                                                                    'z-50 cursor-ns-resize opacity-95 shadow-2xl ring-2 ring-primary ring-offset-2',
                                                                layout && layout.totalColumns > 1 && 'backdrop-blur-sm',
                                                            )}
                                                            style={getEventStyle(
                                                                event,
                                                                layout,
                                                            )}
                                                        >
                                                            <div className="flex items-start gap-1">
                                                                {isEntry && (
                                                                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white dark:bg-green-500">
                                                                        ✓
                                                                    </span>
                                                                )}
                                                                <div className="min-w-0 flex-1 truncate leading-tight font-semibold">
                                                                    {event.ticket.title}
                                                                </div>
                                                            </div>
                                                            <div className="pointer-events-none mt-1 flex items-center justify-between gap-1 font-mono text-[10px] opacity-80">
                                                                <span className="truncate">
                                                                    {isResizing
                                                                        ? format(
                                                                              new Date(
                                                                                  new Date(
                                                                                      event.start_date,
                                                                                  ).getTime() +
                                                                                      resizingEvent.currentDuration *
                                                                                          60000,
                                                                              ),
                                                                              'HH:mm',
                                                                          )
                                                                        : `${format(startDate, 'HH:mm')} - ${format(endDate, 'HH:mm')}`}
                                                                </span>
                                                                {layout && layout.totalColumns > 1 && (
                                                                    <span className="shrink-0 rounded-full bg-black/10 px-1 text-[9px] dark:bg-white/10">
                                                                        {event.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {isEditMode && !isEntry && (
                                                                <div
                                                                    className="absolute bottom-0 left-0 flex h-4 w-full cursor-ns-resize items-end justify-center bg-linear-to-t from-black/5 to-transparent opacity-0 transition-opacity group-hover/event:opacity-100 dark:from-white/5"
                                                                    onMouseDown={(e) => {
                                                                        e.stopPropagation();
                                                                        e.preventDefault();
                                                                        isResizingRef.current = true;
                                                                        setResizingEvent({
                                                                            id: event.id as number,
                                                                            initialY:
                                                                                e.clientY,
                                                                            initialDuration:
                                                                                event.duration_minutes,
                                                                            currentDuration:
                                                                                event.duration_minutes,
                                                                            startData:
                                                                                format(
                                                                                    startDate,
                                                                                    'yyyy-MM-dd HH:mm:ss',
                                                                                ),
                                                                        });
                                                                    }}
                                                                >
                                                                    <div className="mb-0.5 h-1 w-12 rounded-full bg-current opacity-40 shadow-sm" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent
                                                        side="right"
                                                        align="start"
                                                        className="max-w-96 border-border/50 bg-linear-to-br from-card to-card/95 p-0 shadow-2xl backdrop-blur-xl"
                                                        sideOffset={12}
                                                    >
                                                        <div className="space-y-3 p-4">
                                                            <div className="flex items-start gap-3">
                                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-primary/10 text-primary shadow-sm ring-1 ring-primary/20">
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

                                                            <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />

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
                                                                    <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />
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
                                                </Tooltip>
                                            </TooltipProvider>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
