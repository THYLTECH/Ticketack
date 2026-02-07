import {
    getToolbarButtonStyle,
    Toolbar,
    ToolbarLabel,
    ToolbarReset,
} from '@/components/data-toolbar';
import { FilterSimpleSelect } from '@/components/filter-simple-select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { useTrans } from '@/lib/translation';
import { TicketCategory, TicketPriority, TicketStatus } from '@/types';
import { Activity, CheckCircle2, Signal, Tag } from 'lucide-react';
import { DateRange } from 'react-day-picker';

export interface FilterState {
    start_date?: string;
    end_date?: string;
    billable?: string;
    ticket_status?: string;
    ticket_priority?: string;
    ticket_category?: string;
}

interface EntriesToolbarProps {
    filters: FilterState;
    onFilterChange: (key: keyof FilterState, value: string) => void;
    onDateRangeChange: (range: DateRange | undefined) => void;
    onReset: () => void;
    dateRange: DateRange | undefined;
    statuses: TicketStatus[];
    priorities: TicketPriority[];
    categories: TicketCategory[];
}

export function EntriesToolbar({
    filters,
    onFilterChange,
    onDateRangeChange,
    onReset,
    dateRange,
    statuses,
    priorities,
    categories,
}: EntriesToolbarProps) {
    const __ = useTrans();

    const activeFiltersCount = [
        filters.ticket_category,
        filters.ticket_status,
        filters.ticket_priority,
        filters.billable,
        dateRange,
    ].filter((v) => v && v !== 'all').length;

    return (
        <Toolbar>
            <ToolbarLabel label={__('entries.toolbar.title') || 'Filters'} />

            <DatePickerWithRange
                date={dateRange}
                onDateChange={onDateRangeChange}
                className={getToolbarButtonStyle(!!dateRange)}
            />

            <FilterSimpleSelect
                title={__('entries.toolbar.category.label')}
                icon={<Tag className="h-3.5 w-3.5 opacity-70" />}
                value={filters.ticket_category}
                onChange={(v) => onFilterChange('ticket_category', v)}
                placeholder={__('entries.toolbar.category.all')}
                options={categories.map((c) => ({
                    value: c.id.toString(),
                    label: c.title,
                    color: c.color || '#cbd5e1',
                }))}
            />

            <FilterSimpleSelect
                title={__('entries.toolbar.status.label')}
                icon={<Activity className="h-3.5 w-3.5 opacity-70" />}
                value={filters.ticket_status}
                onChange={(v) => onFilterChange('ticket_status', v)}
                placeholder={__('entries.toolbar.status.all')}
                options={statuses.map((s) => ({
                    value: s.id.toString(),
                    label: s.title,
                    color: s.color || '#cbd5e1',
                }))}
            />

            <FilterSimpleSelect
                title={__('entries.toolbar.priority.label')}
                icon={<Signal className="h-3.5 w-3.5 opacity-70" />}
                value={filters.ticket_priority}
                onChange={(v) => onFilterChange('ticket_priority', v)}
                placeholder={__('entries.toolbar.priority.all')}
                options={priorities.map((p) => ({
                    value: p.id.toString(),
                    label: p.title,
                    color: p.color || '#cbd5e1',
                }))}
            />

            <FilterSimpleSelect
                title={__('entries.toolbar.billable.label')}
                icon={<CheckCircle2 className="h-3.5 w-3.5 opacity-70" />}
                value={filters.billable}
                onChange={(v) => onFilterChange('billable', v)}
                placeholder={__('entries.toolbar.billable.all')}
                options={[
                    {
                        value: '1',
                        label: __('entries.toolbar.billable.yes'),
                    },
                    {
                        value: '0',
                        label: __('entries.toolbar.billable.no'),
                    },
                ]}
            />

            {activeFiltersCount > 0 && (
                <ToolbarReset
                    onClick={onReset}
                    label={__('entries.toolbar.reset') || 'Reset'}
                />
            )}
        </Toolbar>
    );
}
