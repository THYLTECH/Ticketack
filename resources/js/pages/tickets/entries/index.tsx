import LaravelPagination from '@/components/LaravelPagination';
import AppLayout from '@/layouts/app/layout';
import { useTrans } from '@/lib/translation';
import {
    PaginationProps,
    TicketCategory,
    TicketEntry,
    TicketPriority,
    TicketStatus,
} from '@/types';
import { Head, router } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

import { TimeEntryDialog } from './create-dialog';
import { EntriesHeader } from './entries-header';
import { EntriesStats } from './entries-stats';
import { EntriesTable } from './entries-table';
import { EntriesToolbar, FilterState } from './entries-toolbar';
import { ReportDialog } from './report-dialog';

type TicketEntryPagination = PaginationProps & {
    data: TicketEntry[];
};

interface Props {
    entries: TicketEntryPagination;
    stats: {
        total_hours: number;
        count: number;
        period: string;
    };
    filters: FilterState;
    tickets: { id: number; title: string }[];
    statuses: TicketStatus[];
    priorities: TicketPriority[];
    categories: TicketCategory[];
}

export default function EntriesIndex({
    entries,
    stats,
    filters,
    tickets,
    statuses,
    priorities,
    categories,
}: Props) {
    const __ = useTrans();
    const [filterValues, setFilterValues] = useState<FilterState>(filters);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);

    const initialDateRange: DateRange | undefined =
        filters.start_date && filters.end_date
            ? {
                  from: parseISO(filters.start_date),
                  to: parseISO(filters.end_date),
              }
            : undefined;

    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        initialDateRange,
    );

    const applyFilters = (newFilters: FilterState) => {
        setFilterValues(newFilters);
        const cleanFilters = Object.fromEntries(
            Object.entries(newFilters).filter(
                ([_, v]) => v != null && v !== '' && v !== 'all',
            ),
        ) as Record<string, string>;

        router.get(route('tickets.entries.index'), cleanFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        applyFilters({ ...filterValues, [key]: value });
    };

    const handleDateRangeChange = (range: DateRange | undefined) => {
        setDateRange(range);
        if (range?.from) {
            const newFilters = {
                ...filterValues,
                start_date: format(range.from, 'yyyy-MM-dd'),
                end_date: range.to
                    ? format(range.to, 'yyyy-MM-dd')
                    : format(range.from, 'yyyy-MM-dd'),
            };
            if (range.to || range.from) applyFilters(newFilters);
        } else {
            const { start_date, end_date, ...rest } = filterValues;
            applyFilters({
                ...rest,
                start_date: undefined,
                end_date: undefined,
            });
        }
    };

    const resetFilters = () => {
        setFilterValues({});
        setDateRange(undefined);
        router.get(route('tickets.entries.index'));
    };

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: __('entries.index.breadcrumbs.dashboard'),
                    href: route('dashboard'),
                },
                { title: __('entries.index.breadcrumbs.current'), href: '#' },
            ]}
        >
            <Head title={__('entries.index.title')} />

            <div className="container mx-auto max-w-[1600px] space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                <EntriesHeader
                    onCreateClick={() => setIsCreateOpen(true)}
                    onReportClick={() => setIsReportOpen(true)}
                />

                <EntriesStats stats={stats} />

                <div className="flex flex-col gap-4">
                    <EntriesToolbar
                        filters={filterValues}
                        onFilterChange={handleFilterChange}
                        onDateRangeChange={handleDateRangeChange}
                        onReset={resetFilters}
                        dateRange={dateRange}
                        statuses={statuses}
                        priorities={priorities}
                        categories={categories}
                    />

                    <EntriesTable entries={entries.data} />

                    <div className="flex items-center justify-between border-t py-4">
                        <div className="text-sm text-muted-foreground">
                            {__('entries.pagination.showing')}{' '}
                            <span className="font-medium text-foreground">
                                {entries.data.length}
                            </span>{' '}
                            {__('entries.pagination.of')}{' '}
                            <span className="font-medium text-foreground">
                                {entries.total}
                            </span>{' '}
                            {__('entries.pagination.results')}
                        </div>
                        <LaravelPagination
                            links={entries.links as any}
                            className="mt-0"
                        />
                    </div>
                </div>
            </div>

            <TimeEntryDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                availableTickets={tickets}
            />

            <ReportDialog
                open={isReportOpen}
                onOpenChange={setIsReportOpen}
                filters={filterValues}
            />
        </AppLayout>
    );
}
