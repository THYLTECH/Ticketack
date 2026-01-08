import { PaginationControl } from '@/components/pagination-control';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app/layout';
import { useTrans } from '@/lib/translation';
import {
    PaginationProps,
    SharedData,
    TicketCategory,
    TicketEntry,
    TicketOption,
    TicketPriority,
    TicketStatus,
} from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { Globe } from 'lucide-react';
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
    tickets: TicketOption[];
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
    const { auth } = usePage<SharedData>().props;
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
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                    title: __('home.pages.breadcrumbs.home'),
                    href: route('home'),
                },
                { title: __('entries.index.breadcrumbs.current'), href: '#' },
            ]}
        >
            <Head title={__('entries.index.title')} />

            <div className="max-w-full space-y-5 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <EntriesHeader
                    onCreateClick={() => setIsCreateOpen(true)}
                    onReportClick={() => setIsReportOpen(true)}
                />

                <div className="flex w-fit items-center rounded-full border bg-background/50 px-3 py-1 gap-1.5 shadow-sm">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-foreground uppercase">
                        {__('entries.index.timezone')} : {auth.user.timezone || 'UTC'}
                    </span>
                </div>

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

                    <EntriesTable entries={entries.data} showTicketColumn />

                    <PaginationControl
                        meta={entries}
                    />
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
