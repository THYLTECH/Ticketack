import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
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
    ListFilter,
    Monitor,
    Search,
    Tags,
    User as UserIcon,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { FilterMultiSelect } from './filter-multi-select';

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
        <div className="flex w-full items-center justify-between rounded-md border bg-background p-2 pl-3 shadow-sm">
            <div className="flex flex-1 flex-wrap items-center gap-2">
                <div className="ml-2 hidden items-center gap-2 text-sm font-medium text-muted-foreground md:flex">
                    <ListFilter className="h-4 w-4" />
                    <span>
                        {__('tickets.pages.index.toolbar.filters.title')}
                    </span>
                </div>

                <Separator
                    orientation="vertical"
                    className="mr-2 hidden h-6 md:block"
                />

                <div className="relative flex items-center">
                    <Search className="absolute left-2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                        placeholder={__('tickets.pages.index.toolbar.search')}
                        className="h-8 w-[150px] border-dashed bg-transparent pl-8 text-xs shadow-none focus-visible:border-solid focus-visible:ring-1 lg:w-[200px]"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <DatePickerWithRange
                    date={date}
                    onDateChange={handleDateSelect}
                    placeholder={__('tickets.column.created_at')}
                    className="h-9"
                />

                <FilterMultiSelect
                    icon={<CircleDashed className="h-3.5 w-3.5" />}
                    placeholder={__(
                        'tickets.pages.index.toolbar.filters.status',
                    )}
                    value={filters.status}
                    options={statuses.map((s) => ({ ...s }))}
                    onChange={(v) => onFilterChange('status', v)}
                />

                <FilterMultiSelect
                    icon={<LayoutGrid className="h-3.5 w-3.5" />}
                    placeholder={__(
                        'tickets.pages.index.toolbar.filters.priority',
                    )}
                    value={filters.priority}
                    options={priorities.map((p) => ({ ...p }))}
                    onChange={(v) => onFilterChange('priority', v)}
                />

                <FilterMultiSelect
                    icon={<Tags className="h-3.5 w-3.5" />}
                    placeholder={__(
                        'tickets.pages.index.toolbar.filters.category',
                    )}
                    value={filters.category}
                    options={categories.map((c) => ({ ...c }))}
                    onChange={(v) => onFilterChange('category', v)}
                />

                <FilterMultiSelect
                    icon={<Monitor className="h-3.5 w-3.5" />}
                    placeholder={__(
                        'tickets.pages.index.toolbar.filters.asset',
                    )}
                    value={filters.equipment}
                    options={assets.map((a) => ({ ...a }))}
                    onChange={(v) => onFilterChange('equipment', v)}
                    className="hidden xl:flex"
                />

                <FilterMultiSelect
                    icon={<UserIcon className="h-3.5 w-3.5" />}
                    placeholder={__(
                        'tickets.pages.index.toolbar.filters.solver',
                    )}
                    value={filters.assignee}
                    options={solvers.map((s) => ({ ...s }))}
                    labelKey="name"
                    onChange={(v) => onFilterChange('assignee', v)}
                />

                {hasActiveFilters && (
                    <>
                        <Separator
                            orientation="vertical"
                            className="mx-1 hidden h-6 sm:block"
                        />
                        <Button
                            variant="ghost"
                            onClick={onClearFilters}
                            size="sm"
                            className="h-8 border-solid px-2 text-xs font-medium text-muted-foreground hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                            {__('tickets.pages.index.toolbar.clear')}
                            <X className="ml-2 h-3.5 w-3.5" />
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
