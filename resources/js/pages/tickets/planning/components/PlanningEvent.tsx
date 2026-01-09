import { cn } from '@/lib/utils';
import { TicketSchedule } from '@/types';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format, parseISO } from 'date-fns';
import { COLORS } from '../constants';
import { PlanningEventTooltip } from './PlanningEventTooltip';
import { EventLayout } from '../types';

interface PlanningEventProps {
    event: TicketSchedule;
    layout?: EventLayout;
    isEditMode: boolean;
    isResizing: boolean;
    highlightedEventId?: number | string | null;
    onDragStart: (e: React.DragEvent) => void;
    onClick: (e: React.MouseEvent) => void;
    onResizeStart: (e: React.MouseEvent) => void;
    style: React.CSSProperties;
}

export function PlanningEvent({
    event,
    layout,
    isEditMode,
    isResizing,
    highlightedEventId,
    onDragStart,
    onClick,
    onResizeStart,
    style,
}: PlanningEventProps) {
    const isEntry = event.is_entry === true;
    const startDate = parseISO(event.start_date);
    const endDate = parseISO(event.end_date);

    return (
        <TooltipProvider key={`${event.id}-${event.updated_at}`} delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        draggable={isEditMode && !isEntry && !isResizing}
                        onDragStart={onDragStart}
                        onClick={onClick}
                        className={cn(
                            'group/event absolute flex flex-col justify-center overflow-hidden rounded-lg px-2 py-1.5 text-xs transition-all duration-200',
                            highlightedEventId === event.id
                                ? 'animate-pulse cursor-pointer border-2 border-yellow-500 bg-yellow-100/90 text-yellow-900 shadow-lg ring-2 ring-yellow-400/50 dark:bg-yellow-900/40 dark:text-yellow-100'
                                : isEntry
                                ? 'cursor-default border-2 border-dashed border-muted-foreground/30 bg-muted/70 text-muted-foreground shadow-sm backdrop-blur-sm'
                                : cn(
                                      'cursor-pointer border-l-4',
                                      COLORS[event.user_id % COLORS.length],
                                      'shadow-md ring-1 ring-black/5 dark:ring-white/5',
                                  ),
                            isEditMode && !isEntry && 'cursor-move',
                            !isEntry &&
                                highlightedEventId !== event.id &&
                                'hover:z-50 hover:shadow-xl hover:ring-2 hover:ring-offset-1 hover:brightness-105',
                            isResizing &&
                                'z-50 cursor-ns-resize opacity-95 shadow-2xl ring-2 ring-primary ring-offset-2',
                            layout && layout.totalColumns > 1 && 'backdrop-blur-sm',
                        )}
                        style={style}
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
                                {`${format(startDate, 'HH:mm')} - ${format(endDate, 'HH:mm')}`}
                            </span>
                            {layout && layout.totalColumns > 1 && (
                                <span className="shrink-0 rounded-full bg-black/10 px-1 text-[9px] dark:bg-white/10">
                                    {event.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                </span>
                            )}
                        </div>

                        {isEditMode && !isEntry && (
                            <div
                                className="absolute bottom-0 left-0 flex h-4 w-full cursor-ns-resize items-end justify-center bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity group-hover/event:opacity-100 dark:from-white/5"
                                onMouseDown={onResizeStart}
                            >
                                <div className="mb-0.5 h-1 w-12 rounded-full bg-current opacity-40 shadow-sm" />
                            </div>
                        )}
                    </div>
                </TooltipTrigger>
                <PlanningEventTooltip event={event} side="right" align="start" />
            </Tooltip>
        </TooltipProvider>
    );
}

