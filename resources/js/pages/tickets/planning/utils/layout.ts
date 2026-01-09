import { TicketSchedule } from '@/types';
import { parseISO } from 'date-fns';
import { EventLayout } from '../types';

/**
 * Check if two events overlap in time
 */
function eventsOverlap(e1: TicketSchedule, e2: TicketSchedule): boolean {
    const start1 = parseISO(e1.start_date);
    const end1 = parseISO(e1.end_date);
    const start2 = parseISO(e2.start_date);
    const end2 = parseISO(e2.end_date);

    return start1 < end2 && end1 > start2;
}

/**
 * Group events that overlap with each other
 * Events in different groups don't overlap with each other
 */
function groupOverlappingEvents(events: TicketSchedule[]): TicketSchedule[][] {
    const sorted = [...events].sort(
        (a, b) => parseISO(a.start_date).getTime() - parseISO(b.start_date).getTime()
    );

    const groups: TicketSchedule[][] = [];

    sorted.forEach((event) => {
        let foundGroup = false;

        for (const group of groups) {
            if (group.some(e => eventsOverlap(e, event))) {
                group.push(event);
                foundGroup = true;
                break;
            }
        }

        if (!foundGroup) {
            groups.push([event]);
        }
    });

    return groups;
}

/**
 * Calculate layout positions for a group of overlapping events
 * Events are distributed across columns to avoid visual overlap
 */
function calculateGroupLayout(groupEvents: TicketSchedule[]): Map<number | string, EventLayout> {
    const layout = new Map<number | string, EventLayout>();

    if (groupEvents.length === 1) {
        layout.set(groupEvents[0].id, {
            left: 0,
            width: 100,
            column: 0,
            totalColumns: 1
        });
        return layout;
    }

    const sorted = [...groupEvents].sort(
        (a, b) => parseISO(a.start_date).getTime() - parseISO(b.start_date).getTime()
    );

    const columns: TicketSchedule[][] = [];

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
    const GAP_PERCENT = 0.5;
    const columnWidth = (100 - (GAP_PERCENT * (totalColumns - 1))) / totalColumns;

    sorted.forEach((event) => {
        const pos = layout.get(event.id);
        if (pos) {
            const leftPosition = pos.left * (columnWidth + GAP_PERCENT);

            layout.set(event.id, {
                left: leftPosition,
                width: columnWidth,
                column: pos.left,
                totalColumns: totalColumns
            });
        }
    });

    return layout;
}

/**
 * Calculate layout for all events in a day
 * Groups overlapping events and calculates layout for each group independently
 * This ensures events that don't overlap take full width
 */
export function calculateEventLayout(dayEvents: TicketSchedule[]): Map<number | string, EventLayout> {
    if (dayEvents.length === 0) return new Map();

    const groups = groupOverlappingEvents(dayEvents);

    const finalLayout = new Map<number | string, EventLayout>();

    groups.forEach(group => {
        const groupLayout = calculateGroupLayout(group);
        groupLayout.forEach((layout, eventId) => {
            finalLayout.set(eventId, layout);
        });
    });

    return finalLayout;
}

