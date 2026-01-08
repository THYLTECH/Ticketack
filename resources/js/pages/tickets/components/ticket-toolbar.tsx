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
import {
    Asset,
    TicketCategory,
    TicketPriority,
    TicketStatus,
    User,
} from '@/types';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    CircleDashed,
    LayoutGrid,
    Monitor,
    Tags,
    User as UserIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

interface Props {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    filters: Record<string, string>;
    onFilterChange: (key: string, value: string | null) => void;
    onClearFilters: () => void;
    statuses: TicketStatus[];
    priorities: TicketPriority[];
    categories: TicketCategory[];
    assets: Asset[];
    solvers: User[];
    hasActiveFilters: boolean;
}

export function TicketToolbar({
    searchTerm,
    onSearchChange,
    filters,
    onFilterChange,
    onClearFilters,
    statuses,
    priorities,
    categories,
    assets,
    solvers,
    hasActiveFilters,
}: Props) {
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

    const handleDateSelect = (range: DateRange | undefined) => {
        setDate(range);

        if (range?.from && range?.to) {
            const newFilters = {
                ...filters,
                date_from: format(range.from, 'yyyy-MM-dd'),
                date_to: format(range.to, 'yyyy-MM-dd'),
                search: searchTerm,
            };
            router.get(route('tickets.index'), newFilters, {
                preserveState: true,
                replace: true,
            });
        } else if (!range) {
            const newFilters = { ...filters };
            delete newFilters.date_from;
            delete newFilters.date_to;
            newFilters.search = searchTerm;
            router.get(route('tickets.index'), newFilters, {
                preserveState: true,
                replace: true,
            });
        }
    };

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
                placeholder={
                    __('tickets.pages.index.toolbar.search') || 'Search...'
                }
            />

            <DatePickerWithRange
                date={date}
                onDateChange={handleDateSelect}
                placeholder={__('tickets.column.created_at')}
                className={getToolbarButtonStyle(!!date)}
            />

            <FilterMultiSelect
                icon={<CircleDashed className="h-3.5 w-3.5" />}
                title={__('tickets.pages.index.toolbar.filters.status')}
                placeholder={__('tickets.pages.index.toolbar.filters.status')}
                value={filters.status}
                options={statuses.map((s) => ({
                    label: s.title,
                    value: String(s.id),
                }))}
                onChange={(v) => onFilterChange('status', v)}
            />

            <FilterMultiSelect
                icon={<LayoutGrid className="h-3.5 w-3.5" />}
                title={__('tickets.pages.index.toolbar.filters.priority')}
                placeholder={__('tickets.pages.index.toolbar.filters.priority')}
                value={filters.priority}
                options={priorities.map((p) => ({
                    label: p.title,
                    value: String(p.id),
                }))}
                onChange={(v) => onFilterChange('priority', v)}
            />

            <FilterMultiSelect
                icon={<Tags className="h-3.5 w-3.5" />}
                title={__('tickets.pages.index.toolbar.filters.category')}
                placeholder={__('tickets.pages.index.toolbar.filters.category')}
                value={filters.category}
                options={categories.map((c) => ({
                    label: c.title,
                    value: String(c.id),
                }))}
                onChange={(v) => onFilterChange('category', v)}
            />

            <FilterMultiSelect
                icon={<Monitor className="h-3.5 w-3.5" />}
                title={__('tickets.pages.index.toolbar.filters.asset')}
                placeholder={__('tickets.pages.index.toolbar.filters.asset')}
                value={filters.equipment}
                options={assets.map((a) => ({
                    label: a.title,
                    value: String(a.id),
                }))}
                onChange={(v) => onFilterChange('equipment', v)}
                className="hidden xl:flex"
            />

            <FilterMultiSelect
                icon={<UserIcon className="h-3.5 w-3.5" />}
                title={__('tickets.pages.index.toolbar.filters.solver')}
                placeholder={__('tickets.pages.index.toolbar.filters.solver')}
                value={filters.assignee}
                options={solvers.map((s) => ({
                    label: s.name,
                    value: String(s.id),
                }))}
                onChange={(v) => onFilterChange('assignee', v)}
            />

            {hasActiveFilters && (
                <ToolbarReset
                    onClick={onClearFilters}
                    label={__('tickets.pages.index.toolbar.clear') || 'Reset'}
                />
            )}
        </Toolbar>
    );
}
