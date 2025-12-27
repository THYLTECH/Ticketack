import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { TicketSchedule, UpdatePayload } from '@/types';
import {
    addDays,
    areIntervalsOverlapping,
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
import React, { useEffect, useRef, useState } from 'react';
import { ViewType } from './index';

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

interface Props {
    events: TicketSchedule[];
    view: ViewType;
    currentDate: Date;
    isEditMode: boolean;
    currentUserId: number;
    selectedSolvers: number[];
    onDrop: (date: Date, ticketId?: number, eventId?: number) => void;
    onUpdate: (id: number, data: UpdatePayload) => void;
    onEventClick: (event: TicketSchedule) => void;
}

export function PlanningGrid({
    events,
    view,
    currentDate,
    isEditMode,
    currentUserId,
    selectedSolvers,
    onDrop,
    onUpdate,
    onEventClick,
}: Props) {
    const __ = useTrans();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const [resizingEvent, setResizingEvent] = useState<{
        id: number;
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
        const sorted = [...dayEvents].sort(
            (a, b) =>
                parseISO(a.start_date).getTime() -
                parseISO(b.start_date).getTime(),
        );

        const columns: TicketSchedule[][] = [];
        const layout = new Map<number, { left: number; width: number }>();

        sorted.forEach((event) => {
            const eventStart = parseISO(event.start_date);
            const eventEnd = parseISO(event.end_date);

            let colIndex = 0;
            while (true) {
                const col = columns[colIndex] || [];
                const hasOverlap = col.some((placedEvent) =>
                    areIntervalsOverlapping(
                        { start: eventStart, end: eventEnd },
                        {
                            start: parseISO(placedEvent.start_date),
                            end: parseISO(placedEvent.end_date),
                        },
                    ),
                );

                if (!hasOverlap) {
                    if (!columns[colIndex]) columns[colIndex] = [];
                    columns[colIndex].push(event);
                    layout.set(event.id, { left: colIndex, width: 0 });
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
                    layout.set(event.id, {
                        left: (pos.left / totalColumns) * 100,
                        width: 100 / totalColumns,
                    });
                }
            });
        }

        return layout;
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
                onUpdate(resizingEvent.id, {
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
    }, [resizingEvent, onUpdate]);

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

        if (ticketId) onDrop(targetDate, parseInt(ticketId), undefined);
        if (eventId) onDrop(targetDate, undefined, parseInt(eventId));
    };

    const getEventStyle = (
        event: TicketSchedule,
        layoutData: { left: number; width: number } | undefined,
    ) => {
        const isResizing = resizingEvent?.id === event.id;
        const duration = isResizing
            ? resizingEvent.currentDuration
            : event.duration_minutes;
        const start = parseISO(event.start_date);
        const minutesFromStart =
            (getHours(start) - START_HOUR) * 60 + getMinutes(start);

        return {
            top: `${(minutesFromStart / 60) * CELL_HEIGHT}px`,
            height: `${Math.max((duration / 60) * CELL_HEIGHT, 24)}px`,
            left: layoutData ? `${layoutData.left}%` : '0%',
            width: layoutData ? `${layoutData.width}%` : '100%',
            zIndex: isResizing ? 60 : 20,
        };
    };

    if (view === 'month') {
        const monthStart = startOfWeek(startOfMonth(currentDate), {
            weekStartsOn: 1,
        });
        const monthEnd = endOfWeek(endOfMonth(currentDate), {
            weekStartsOn: 1,
        });
        const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
        const weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

        return (
            <div className="flex h-full flex-col overflow-hidden bg-card select-none">
                <div className="z-20 flex shrink-0 border-b bg-muted/40">
                    {weekDays.map((dayKey) => (
                        <div
                            key={dayKey}
                            className="flex-1 border-r border-border bg-muted/40 py-3 text-center text-xs font-semibold tracking-wider text-muted-foreground uppercase last:border-r-0"
                        >
                            {__(`schedule.days_short.${dayKey}`)}
                        </div>
                    ))}
                </div>
                <div className="grid flex-1 auto-rows-fr grid-cols-7 overflow-y-auto">
                    {days.map((day, idx) => {
                        const dayEvents = events.filter(
                            (e) =>
                                (isEditMode
                                    ? e.user_id === currentUserId
                                    : selectedSolvers.includes(e.user_id)) &&
                                isSameDay(parseISO(e.start_date), day),
                        );
                        return (
                            <div
                                key={day.toString()}
                                className={cn(
                                    'group relative min-h-[120px] border-r border-b p-2 transition-colors',
                                    !isSameMonth(day, currentDate) &&
                                        'bg-muted/5 text-muted-foreground',
                                    idx % 7 === 6 && 'border-r-0',
                                )}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, day)}
                            >
                                <span
                                    className={cn(
                                        'mb-1 ml-auto flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                                        isToday(day)
                                            ? 'bg-primary text-primary-foreground shadow-sm'
                                            : 'text-foreground/70',
                                    )}
                                >
                                    {format(day, 'd')}
                                </span>
                                {dayEvents.map((evt) => (
                                    <div
                                        key={evt.id}
                                        draggable={isEditMode}
                                        onDragStart={(e) => {
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
                                            'mb-1 cursor-pointer truncate rounded-md border px-2 py-1 text-[10px] font-medium transition-all hover:scale-[1.02] hover:shadow-sm hover:brightness-95',
                                            COLORS[evt.user_id % COLORS.length],
                                        )}
                                    >
                                        <span className="mr-1 font-bold opacity-70">
                                            {format(
                                                parseISO(evt.start_date),
                                                'HH:mm',
                                            )}
                                        </span>
                                        {evt.ticket.title}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
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
            <div className="z-50 flex shrink-0 border-b bg-card shadow-sm ring-1 ring-border/5">
                <div className="w-17 shrink-0 border-r border-border bg-card"></div>
                <div className="flex flex-1">
                    {days.map((day) => (
                        <div
                            key={day.toString()}
                            style={{ width: colWidth }}
                            className={cn(
                                'flex flex-col items-center justify-center border-r border-border bg-card py-4 text-center last:border-r-0',
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
                                {format(day, 'EEE')}
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
                    ))}
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
                                className="relative h-[60px] border-b border-transparent"
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
                                    className="h-[60px] w-full border-b border-border/40"
                                />
                            ))}
                        </div>

                        {days.map((day) => {
                            const dayEvents = events.filter(
                                (e) =>
                                    (isEditMode
                                        ? e.user_id === currentUserId
                                        : selectedSolvers.includes(
                                              e.user_id,
                                          )) &&
                                    isSameDay(parseISO(e.start_date), day),
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
                                                    'hover:bg-primary/5',
                                            )}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) =>
                                                handleDrop(e, day, hour)
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
                                            <div className="h-[2px] w-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                                        </div>
                                    )}

                                    {dayEvents.map((event) => {
                                        const isResizing =
                                            resizingEvent?.id === event.id;
                                        const layout = layoutMap.get(event.id);

                                        return (
                                            <div
                                                key={event.id}
                                                draggable={
                                                    isEditMode && !isResizing
                                                }
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData(
                                                        'eventId',
                                                        event.id.toString(),
                                                    );
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (isResizingRef.current)
                                                        return;
                                                    onEventClick(event);
                                                }}
                                                className={cn(
                                                    'group/event absolute flex cursor-pointer flex-col justify-center overflow-hidden rounded-md px-2 py-1 text-xs shadow-sm transition-all duration-200',
                                                    'mx-[1px]',
                                                    COLORS[
                                                        event.user_id %
                                                            COLORS.length
                                                    ],
                                                    isEditMode && 'cursor-move',
                                                    'hover:z-50 hover:scale-[1.02] hover:shadow-lg hover:brightness-105',
                                                    isResizing &&
                                                        'z-50 scale-[1.02] cursor-ns-resize opacity-95 shadow-xl ring-2 ring-primary',
                                                )}
                                                style={getEventStyle(
                                                    event,
                                                    layout,
                                                )}
                                            >
                                                <div className="truncate leading-snug font-semibold">
                                                    {event.ticket.title}
                                                </div>
                                                <div className="pointer-events-none mt-0.5 flex justify-between font-mono text-[10px] opacity-80">
                                                    <span>
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
                                                            : `${format(parseISO(event.start_date), 'HH:mm')} - ${format(parseISO(event.end_date), 'HH:mm')}`}
                                                    </span>
                                                </div>

                                                {isEditMode && (
                                                    <div
                                                        className="absolute bottom-0 left-0 flex h-3 w-full cursor-ns-resize items-end justify-center opacity-0 transition-opacity group-hover/event:opacity-100"
                                                        onMouseDown={(e) => {
                                                            e.stopPropagation();
                                                            e.preventDefault();
                                                            isResizingRef.current = true;
                                                            setResizingEvent({
                                                                id: event.id,
                                                                initialY:
                                                                    e.clientY,
                                                                initialDuration:
                                                                    event.duration_minutes,
                                                                currentDuration:
                                                                    event.duration_minutes,
                                                                startData:
                                                                    format(
                                                                        parseISO(
                                                                            event.start_date,
                                                                        ),
                                                                        'yyyy-MM-dd HH:mm:ss',
                                                                    ),
                                                            });
                                                        }}
                                                    >
                                                        <div className="mb-1 h-1 w-10 rounded-full bg-foreground/20" />
                                                    </div>
                                                )}
                                            </div>
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
