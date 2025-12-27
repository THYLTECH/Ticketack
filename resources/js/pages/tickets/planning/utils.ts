import {
    addDays,
    addMonths,
    addWeeks,
    endOfWeek,
    format,
    startOfWeek,
} from 'date-fns';
import { fr } from 'date-fns/locale';

export type ViewType = 'day' | 'week' | 'month';

export const navigateByView = (
    date: Date,
    view: ViewType,
    direction: 'prev' | 'next',
) => {
    const modifier = direction === 'next' ? 1 : -1;
    switch (view) {
        case 'day':
            return addDays(date, modifier);
        case 'week':
            return addWeeks(date, modifier);
        case 'month':
            return addMonths(date, modifier);
    }
};

export const formatPeriodTitle = (date: Date, view: ViewType) => {
    switch (view) {
        case 'day':
            return format(date, 'd MMMM yyyy', { locale: fr });
        case 'month':
            return format(date, 'MMMM yyyy', { locale: fr });
        case 'week':
            return `${format(startOfWeek(date, { weekStartsOn: 1 }), 'd MMM')} - ${format(endOfWeek(date, { weekStartsOn: 1 }), 'd MMM yyyy', { locale: fr })}`;
    }
};
