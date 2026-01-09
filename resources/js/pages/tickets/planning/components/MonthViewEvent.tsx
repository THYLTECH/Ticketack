import { cn } from '@/lib/utils';
import { TicketSchedule } from '@/types';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format, parseISO } from 'date-fns';
import { COLORS } from '../constants';
import { PlanningEventTooltip } from './PlanningEventTooltip';
import { CheckCircle2, Clock } from 'lucide-react';

interface MonthViewEventProps {
    event: TicketSchedule;
    isEditMode: boolean;
    highlightedEventId?: number | string | null;
    currentUserId: number;
    onDragStart: (e: React.DragEvent) => void;
    onClick: (e: React.MouseEvent) => void;
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

export function MonthViewEvent({
    event,
    isEditMode,
    highlightedEventId,
    currentUserId,
    onDragStart,
    onClick,
}: MonthViewEventProps) {
    const isEntry = event.is_entry === true;
    const startDate = parseISO(event.start_date);
    const userColor = getUserColor(event.user_id, currentUserId);

    return (
        <TooltipProvider key={`${event.id}-${event.updated_at}`} delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        draggable={isEditMode && !isEntry}
                        onDragStart={onDragStart}
                        onClick={onClick}
                        className={cn(
                            'group mb-1 flex items-center gap-1.5 overflow-hidden rounded-md px-2 py-1 text-[10px] font-medium shadow-sm ring-1 ring-black/5 transition-all dark:ring-white/5',
                            highlightedEventId === event.id
                                ? 'animate-pulse ring-2 ring-yellow-400 ring-offset-1 shadow-lg'
                                : isEntry
                                ? 'border-2 border-dashed border-muted-foreground/30 bg-muted/50 text-foreground dark:bg-muted/40'
                                : cn(
                                      'cursor-pointer hover:shadow-md hover:brightness-95 hover:ring-2',
                                      userColor,
                                  ),
                            isEntry && 'cursor-default',
                        )}
                    >
                        {isEntry ? (
                            <CheckCircle2 className="h-3 w-3 shrink-0 text-foreground" />
                        ) : (
                            <Clock className="h-3 w-3 shrink-0 opacity-60" />
                        )}
                        <span className="shrink-0 font-mono font-bold opacity-80">
                            {format(startDate, 'HH:mm')}
                        </span>
                        <span className="min-w-0 flex-1 truncate font-semibold">
                            {event.ticket.title}
                        </span>
                    </div>
                </TooltipTrigger>
                <PlanningEventTooltip event={event} side="left" align="center" />
            </Tooltip>
        </TooltipProvider>
    );
}

