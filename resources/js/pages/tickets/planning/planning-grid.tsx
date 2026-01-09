import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { TicketSchedule, UpdatePayload } from '@/types';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
    addDays,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    formatISO,
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
import { PlanningEvent, MonthViewEvent, PlanningEventTooltip } from './components';
import { calculateEventLayout } from './utils/layout';
import { START_HOUR, HOURS, CELL_HEIGHT, WORK_START_HOUR, DOT_COLORS } from './constants';
import type { ViewType, ResizingEvent } from './types';

export type { ViewType };

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
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const [resizingEvent, setResizingEvent] = useState<ResizingEvent | null>(null);

    const isResizingRef = useRef(false);

    useEffect(() => {
        if (scrollAreaRef.current && (view === 'week' || view === 'day')) {
            scrollAreaRef.current.scrollTop = WORK_START_HOUR * CELL_HEIGHT - 20;
        }
    }, [view]);


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

        let zIndex: number;
        if (isResizing) {
            zIndex = 60;
        } else if (isEntry) {
            zIndex = layoutData ? 30 + layoutData.column : 30;
        } else {
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

                                    if (isEditMode) {
                                        return e.user_id === currentUserId;
                                    } else {
                                        const isMyEntry = e.is_entry === true && e.user_id === currentUserId;
                                        const isSelectedSolverSchedule = !e.is_entry && selectedSolvers.includes(e.user_id);
                                        return isMyEntry || isSelectedSolverSchedule;
                                    }
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
                                                        <PlanningEventTooltip event={evt} side="left" align="center" />
                                                    </Tooltip>
                                                </TooltipProvider>
                                            );
                                        })}
                                    </div>

                                    <div className="hidden sm:block">
                                        {dayEvents.map((evt) => (
                                            <MonthViewEvent
                                                key={`${evt.id}-${evt.updated_at}`}
                                                event={evt}
                                                isEditMode={isEditMode}
                                                highlightedEventId={highlightedEventId}
                                                currentUserId={currentUserId}
                                                onDragStart={(e) => {
                                                    if (evt.is_entry) {
                                                        e.preventDefault();
                                                        return;
                                                    }
                                                    e.dataTransfer.setData('eventId', evt.id.toString());
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEventClick(evt);
                                                }}
                                            />
                                        ))}
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
                            const displayEvents = events.filter((e) => {
                                if (!isSameDay(parseISO(e.start_date), day)) return false;

                                if (isEditMode) {
                                    return e.user_id === currentUserId;
                                } else {
                                    const isMyEntry = e.is_entry === true && e.user_id === currentUserId;
                                    const isSelectedSolverSchedule = !e.is_entry && selectedSolvers.includes(e.user_id);
                                    return isMyEntry || isSelectedSolverSchedule;
                                }
                            });

                            const layoutMap = calculateEventLayout(displayEvents);


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

                                    {displayEvents.map((event) => {
                                        const isEntry = event.is_entry === true;
                                        const isResizing = resizingEvent?.id === event.id;
                                        const layout = layoutMap.get(event.id);
                                        const startDate = parseISO(event.start_date);

                                        return (
                                            <PlanningEvent
                                                key={`${event.id}-${event.updated_at}`}
                                                event={event}
                                                layout={layout}
                                                isEditMode={isEditMode}
                                                isResizing={isResizing}
                                                highlightedEventId={highlightedEventId}
                                                currentUserId={currentUserId}
                                                view={view}
                                                onDragStart={(e) => {
                                                    if (isEntry) {
                                                        e.preventDefault();
                                                        return;
                                                    }
                                                    e.dataTransfer.setData('eventId', event.id.toString());
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (isResizingRef.current || isEntry) return;
                                                    onEventClick(event);
                                                }}
                                                onResizeStart={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    isResizingRef.current = true;
                                                    setResizingEvent({
                                                        id: event.id as number,
                                                        initialY: e.clientY,
                                                        initialDuration: event.duration_minutes,
                                                        currentDuration: event.duration_minutes,
                                                        startData: formatISO(startDate),
                                                    });
                                                }}
                                                style={getEventStyle(event, layout)}
                                            />
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
