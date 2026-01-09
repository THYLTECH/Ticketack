import { TicketSchedule } from '@/types';
import { parseISO } from 'date-fns';
import { EventLayout } from '../types';

export function calculateEventLayout(dayEvents: TicketSchedule[]): Map<number | string, EventLayout> {
    const schedules = dayEvents.filter(e => !e.is_entry);
    const entries = dayEvents.filter(e => e.is_entry);

    const sorted = [...schedules].sort(
        (a, b) =>
            parseISO(a.start_date).getTime() -
            parseISO(b.start_date).getTime(),
    );

    const columns: TicketSchedule[][] = [];
    const layout = new Map<number | string, EventLayout>();

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
}

