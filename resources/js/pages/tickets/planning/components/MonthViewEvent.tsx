import { cn } from '@/lib/utils';
import { TicketSchedule } from '@/types';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format, parseISO } from 'date-fns';
import { COLORS } from '../constants';
import { PlanningEventTooltip } from './PlanningEventTooltip';

interface MonthViewEventProps {
    event: TicketSchedule;
    isEditMode: boolean;
    highlightedEventId?: number | string | null;
    onDragStart: (e: React.DragEvent) => void;
    onClick: (e: React.MouseEvent) => void;
}

export function MonthViewEvent({
    event,
    isEditMode,
    highlightedEventId,
    onDragStart,
    onClick,
}: MonthViewEventProps) {
    const isEntry = event.is_entry === true;
    const startDate = parseISO(event.start_date);

    return (
        <TooltipProvider key={`${event.id}-${event.updated_at}`} delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        draggable={isEditMode && !isEntry}
                        onDragStart={onDragStart}
                        onClick={onClick}
                        className={cn(
                            'mb-1 truncate rounded-md px-2 py-1 text-[10px] font-medium shadow-sm ring-1 ring-black/5 transition-all dark:ring-white/5',
                            highlightedEventId === event.id
                                ? 'animate-pulse cursor-pointer border-2 border-yellow-500 bg-yellow-100/90 text-yellow-900 shadow-lg ring-2 ring-yellow-400/50 dark:bg-yellow-900/40 dark:text-yellow-100'
                                : isEntry
                                ? 'cursor-default border-2 border-l-2 border-dashed border-muted-foreground/30 bg-muted/60 text-muted-foreground'
                                : cn(
                                      'cursor-pointer border-l-4 hover:shadow-md hover:brightness-95 hover:ring-2',
                                      COLORS[event.user_id % COLORS.length],
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
                        {event.ticket.title}
                    </div>
                </TooltipTrigger>
                <PlanningEventTooltip event={event} side="right" align="start" />
            </Tooltip>
        </TooltipProvider>
    );
}

