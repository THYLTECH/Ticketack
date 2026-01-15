import {
    getToolbarButtonStyle,
    Toolbar,
    ToolbarLabel,
    ToolbarReset,
    ToolbarSearch,
} from '@/components/data-toolbar';
import { FilterMultiSelect } from '@/components/filter-multi-select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { useTrans } from '@/lib/translation';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { CircleDashed, LayoutGrid, Tags } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

interface AssignmentToolbarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    filters: Record<string, string>;
    onFilterChange: (key: string, value: string | null) => void;
    onClearFilters: () => void;
    priorities: Array<{ id: number; title: string; color: string }>;
    statuses: Array<{ id: number; title: string; color: string }>;
    categories: Array<{ id: number; title: string; color: string }>;
    hasActiveFilters: boolean;
}

/**
 * Assignment toolbar component for filtering and searching unassigned tickets
 * Provides search, date range, priority, status, and category filters
 */
export function AssignmentToolbar({
    searchTerm,
    onSearchChange,
    filters,
    onFilterChange,
    onClearFilters,
    priorities,
    statuses,
    categories,
    hasActiveFilters,
}: AssignmentToolbarProps) {
    const __ = useTrans();

    const [date, setDate] = useState<DateRange | undefined>(
        filters.date_from && filters.date_to
            ? {
                  from: new Date(filters.date_from),
                  to: new Date(filters.date_to),
              }
            : undefined,
    );

    useEffect(() => {
        if (!filters.date_from || !filters.date_to) {
            setDate(undefined);
        }
    }, [filters.date_from, filters.date_to]);

    /**
     * Handles date range selection/deselection
     * Updates URL filters when date range changes
     */
    const handleDateSelect = (range: DateRange | undefined) => {
        setDate(range);

        if (range?.from && range?.to) {
            const newFilters = {
                ...filters,
                date_from: format(range.from, 'yyyy-MM-dd'),
                date_to: format(range.to, 'yyyy-MM-dd'),
            };
            router.get(route('tickets.assignment.index'), newFilters, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        } else if (!range) {
            const newFilters = { ...filters };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { date_from, date_to, ...rest } = newFilters;
            router.get(route('tickets.assignment.index'), rest, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        }
    };

    /**
     * Transform priority data to match FilterMultiSelect expected format
     */
    const priorityOptions = priorities.map((p) => ({
        id: p.id,
        label: p.title,
        value: p.id.toString(),
        color: p.color,
    }));

    /**
     * Transform status data to match FilterMultiSelect expected format
     */
    const statusOptions = statuses.map((s) => ({
        id: s.id,
        label: s.title,
        value: s.id.toString(),
        color: s.color,
    }));

    /**
     * Transform category data to match FilterMultiSelect expected format
     */
    const categoryOptions = categories.map((c) => ({
        id: c.id,
        label: c.title,
        value: c.id.toString(),
        color: c.color,
    }));

    return (
        <Toolbar>
            <ToolbarLabel
                label={
                    __('tickets.pages.index.toolbar.filters.title') || 'Filters'
                }
            />

            <ToolbarSearch
                value={searchTerm}
                onChange={onSearchChange}
                placeholder={__('tickets.search.placeholder')}
            />

            <DatePickerWithRange
                date={date}
                onDateChange={handleDateSelect}
                placeholder={__('tickets.column.created_at')}
                className={getToolbarButtonStyle(!!date)}
            />

            <FilterMultiSelect
                icon={<LayoutGrid className="h-4 w-4" />}
                title={__('tickets.filters.priority')}
                placeholder={__('tickets.filters.priority')}
                value={filters.priority || ''}
                options={priorityOptions}
                onChange={(value) => onFilterChange('priority', value || null)}
            />

            <FilterMultiSelect
                icon={<CircleDashed className="h-4 w-4" />}
                title={__('tickets.filters.status')}
                placeholder={__('tickets.filters.status')}
                value={filters.status || ''}
                options={statusOptions}
                onChange={(value) => onFilterChange('status', value || null)}
            />

            <FilterMultiSelect
                icon={<Tags className="h-4 w-4" />}
                title={__('tickets.filters.category')}
                placeholder={__('tickets.filters.category')}
                value={filters.category || ''}
                options={categoryOptions}
                onChange={(value) => onFilterChange('category', value || null)}
            />

            {hasActiveFilters && <ToolbarReset onClick={onClearFilters} label={__('common.filters.reset')} />}
        </Toolbar>
    );
}

