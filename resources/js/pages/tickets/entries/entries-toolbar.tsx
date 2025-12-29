import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { TicketCategory, TicketPriority, TicketStatus } from '@/types';
import {
    Activity,
    CheckCircle2,
    ListFilter,
    Signal,
    Tag,
    X,
} from 'lucide-react';
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
    const activeCategory = categories.find(
        (c) => c.id.toString() === filters.ticket_category,
    );
    const activeStatus = statuses.find(
        (s) => s.id.toString() === filters.ticket_status,
    );
    const activePriority = priorities.find(
        (p) => p.id.toString() === filters.ticket_priority,
    );
    const activeBillable =
        filters.billable === '1'
            ? __('entries.toolbar.billable.yes')
            : filters.billable === '0'
              ? __('entries.toolbar.billable.no')
              : null;

    const activeFiltersCount = [
        activeCategory,
        activeStatus,
        activePriority,
        activeBillable,
        dateRange,
    ].filter(Boolean).length;

    return (
        <div className="flex w-full items-center justify-between rounded-md border bg-background p-2 pl-3 shadow-sm">
            <div className="flex flex-1 flex-wrap items-center gap-2">
                <div className="ml-2 hidden items-center gap-2 text-sm font-medium text-muted-foreground md:flex">
                    <ListFilter className="h-4 w-4" />
                    <span>{__('entries.toolbar.title')}</span>
                </div>

                <Separator
                    orientation="vertical"
                    className="mr-2 hidden h-6 md:block"
                />

                <DatePickerWithRange
                    date={dateRange}
                    onDateChange={onDateRangeChange}
                    className="w-auto"
                />

                <Select
                    value={filters.ticket_category || 'all'}
                    onValueChange={(v) => onFilterChange('ticket_category', v)}
                >
                    <SelectTrigger
                        className={cn(
                            'h-8 w-auto min-w-[130px] border-dashed shadow-none transition-all hover:bg-accent hover:text-accent-foreground',
                            activeCategory &&
                                'border-solid border-primary/50 bg-accent font-medium text-accent-foreground',
                        )}
                    >
                        <div className="flex items-center gap-2 text-xs">
                            <Tag className="h-3.5 w-3.5 opacity-70" />
                            <span
                                className={cn(
                                    activeCategory && 'font-semibold',
                                )}
                            >
                                {__('entries.toolbar.category.label')}
                            </span>
                            {activeCategory && (
                                <>
                                    <Separator
                                        orientation="vertical"
                                        className="mx-1 h-3"
                                    />
                                    <span className="max-w-[80px] truncate">
                                        {activeCategory.title}
                                    </span>
                                </>
                            )}
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            {__('entries.toolbar.category.all')}
                        </SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="h-2 w-2 rounded-full"
                                        style={{
                                            backgroundColor:
                                                cat.color || '#cbd5e1',
                                        }}
                                    />
                                    {cat.title}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.ticket_status || 'all'}
                    onValueChange={(v) => onFilterChange('ticket_status', v)}
                >
                    <SelectTrigger
                        className={cn(
                            'h-8 w-auto min-w-[120px] border-dashed shadow-none transition-all hover:bg-accent hover:text-accent-foreground',
                            activeStatus &&
                                'border-solid border-primary/50 bg-accent font-medium text-accent-foreground',
                        )}
                    >
                        <div className="flex items-center gap-2 text-xs">
                            <Activity className="h-3.5 w-3.5 opacity-70" />
                            <span
                                className={cn(activeStatus && 'font-semibold')}
                            >
                                {__('entries.toolbar.status.label')}
                            </span>
                            {activeStatus && (
                                <>
                                    <Separator
                                        orientation="vertical"
                                        className="mx-1 h-3"
                                    />
                                    <span className="max-w-[80px] truncate">
                                        {activeStatus.title}
                                    </span>
                                </>
                            )}
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            {__('entries.toolbar.status.all')}
                        </SelectItem>
                        {statuses.map((status) => (
                            <SelectItem
                                key={status.id}
                                value={status.id.toString()}
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="h-2 w-2 rounded-full"
                                        style={{
                                            backgroundColor:
                                                status.color || '#cbd5e1',
                                        }}
                                    />
                                    {status.title}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.ticket_priority || 'all'}
                    onValueChange={(v) => onFilterChange('ticket_priority', v)}
                >
                    <SelectTrigger
                        className={cn(
                            'h-8 w-auto min-w-[120px] border-dashed shadow-none transition-all hover:bg-accent hover:text-accent-foreground',
                            activePriority &&
                                'border-solid border-primary/50 bg-accent font-medium text-accent-foreground',
                        )}
                    >
                        <div className="flex items-center gap-2 text-xs">
                            <Signal className="h-3.5 w-3.5 opacity-70" />
                            <span
                                className={cn(
                                    activePriority && 'font-semibold',
                                )}
                            >
                                {__('entries.toolbar.priority.label')}
                            </span>
                            {activePriority && (
                                <>
                                    <Separator
                                        orientation="vertical"
                                        className="mx-1 h-3"
                                    />
                                    <span className="max-w-[80px] truncate">
                                        {activePriority.title}
                                    </span>
                                </>
                            )}
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            {__('entries.toolbar.priority.all')}
                        </SelectItem>
                        {priorities.map((prio) => (
                            <SelectItem
                                key={prio.id}
                                value={prio.id.toString()}
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="h-2 w-2 rounded-full"
                                        style={{
                                            backgroundColor:
                                                prio.color || '#cbd5e1',
                                        }}
                                    />
                                    {prio.title}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.billable || 'all'}
                    onValueChange={(v) => onFilterChange('billable', v)}
                >
                    <SelectTrigger
                        className={cn(
                            'h-8 w-auto min-w-[130px] border-dashed shadow-none transition-all hover:bg-accent hover:text-accent-foreground',
                            activeBillable &&
                                'border-solid border-primary/50 bg-accent font-medium text-accent-foreground',
                        )}
                    >
                        <div className="flex items-center gap-2 text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 opacity-70" />
                            <span
                                className={cn(
                                    activeBillable && 'font-semibold',
                                )}
                            >
                                {__('entries.toolbar.billable.label')}
                            </span>
                            {activeBillable && (
                                <>
                                    <Separator
                                        orientation="vertical"
                                        className="mx-1 h-3"
                                    />
                                    <span>{activeBillable}</span>
                                </>
                            )}
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            {__('entries.toolbar.billable.all')}
                        </SelectItem>
                        <SelectItem value="1">
                            {__('entries.toolbar.billable.yes')}
                        </SelectItem>
                        <SelectItem value="0">
                            {__('entries.toolbar.billable.no')}
                        </SelectItem>
                    </SelectContent>
                </Select>

                {activeFiltersCount > 0 && (
                    <>
                        <Separator
                            orientation="vertical"
                            className="mx-1 hidden h-6 sm:block"
                        />
                        <Button
                            variant="outline"
                            onClick={onReset}
                            size="sm"
                            className="h-8 border-solid px-2 text-xs font-medium text-muted-foreground hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                            {__('entries.toolbar.reset')}
                            <X className="ml-2 h-3.5 w-3.5" />
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
