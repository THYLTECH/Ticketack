import { cn } from '@/lib/utils';
import { TicketSchedule } from '@/types';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format, parseISO } from 'date-fns';
import { COLORS } from '../constants';
import { PlanningEventTooltip } from './PlanningEventTooltip';
import { EventLayout } from '../types';
import { CheckCircle2, Clock } from 'lucide-react';

interface PlanningEventProps {
    event: TicketSchedule;
    layout?: EventLayout;
    isEditMode: boolean;
    isResizing: boolean;
    highlightedEventId?: number | string | null;
    currentUserId: number;
    view?: 'day' | 'week' | 'month';
    onDragStart: (e: React.DragEvent) => void;
    onClick: (e: React.MouseEvent) => void;
    onResizeStart: (e: React.MouseEvent) => void;
    style: React.CSSProperties;
}

/**
 * Get color for a user based on their ID
 * Current user always gets the first color (blue)
 * Other users get distinct colors from the palette
 */
function getUserColor(userId: number, currentUserId: number): string {
    if (userId === currentUserId) {
        return COLORS[0];
    }

    const colorIndex = (userId % (COLORS.length - 1)) + 1;
    return COLORS[colorIndex];
}

export function PlanningEvent({
    event,
    layout,
    isEditMode,
    isResizing,
    highlightedEventId,
    currentUserId,
    view,
    onDragStart,
    onClick,
    onResizeStart,
    style,
}: PlanningEventProps) {
    const isEntry = event.is_entry === true;
    const startDate = parseISO(event.start_date);
    const userColor = getUserColor(event.user_id, currentUserId);

    const tooltipSide = view === 'day' ? 'top' : 'left';

    return (
        <TooltipProvider key={`${event.id}-${event.updated_at}`} delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        draggable={isEditMode && !isEntry && !isResizing}
                        onDragStart={onDragStart}
                        onClick={onClick}
                        className={cn(
                            'group/event absolute overflow-hidden rounded-lg transition-all duration-200',
                            highlightedEventId === event.id
                                ? 'z-50 animate-pulse ring-2 ring-yellow-400 ring-offset-2 shadow-xl'
                                : isEntry
                                ? 'border-2 border-dashed border-muted-foreground/30 bg-muted/50 text-foreground shadow-sm dark:bg-muted/40'
                                : cn(
                                      userColor,
                                      'shadow-md ring-1 ring-black/5 dark:ring-white/5',
                                  ),
                            isEditMode && !isEntry && 'cursor-move hover:shadow-lg',
                            !isEntry &&
                                highlightedEventId !== event.id &&
                                'hover:z-40 hover:shadow-xl hover:ring-2 hover:brightness-105',
                            isResizing &&
                                'z-50 cursor-ns-resize opacity-95 shadow-2xl ring-2 ring-primary',
                            isEntry && 'cursor-default',
                            !isEntry && !isEditMode && 'cursor-pointer',
                        )}
                        style={style}
                    >
                        <div className="flex h-full items-center gap-1.5 px-2 py-1">
                            {isEntry ? (
                                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                            ) : (
                                <Clock className="h-3.5 w-3.5 shrink-0 opacity-70" />
                            )}

                            <div className="min-w-0 flex-1">
                                <div className="truncate text-xs font-semibold leading-tight">
                                    {event.ticket.title}
                                </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-1">
                                <span className="font-mono text-[10px] font-medium opacity-80">
                                    {format(startDate, 'HH:mm')}
                                </span>
                                {layout && layout.totalColumns > 1 && (
                                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-black/10 text-[8px] font-bold dark:bg-white/10">
                                        {event.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                    </div>
                                )}
                            </div>

                            {isEditMode && !isEntry && (
                                <div
                                    className="absolute bottom-0 left-0 flex h-5 w-full cursor-ns-resize items-end justify-center bg-linear-to-t from-black/10 to-transparent opacity-0 transition-opacity group-hover/event:opacity-100 dark:from-white/10"
                                    onMouseDown={onResizeStart}
                                >
                                    <div className="mb-1 h-1 w-16 rounded-full bg-current opacity-50 shadow-sm" />
                                </div>
                            )}
                        </div>
                    </div>
                </TooltipTrigger>
                <PlanningEventTooltip event={event} side={tooltipSide} align="center" />
            </Tooltip>
        </TooltipProvider>
    );
}

