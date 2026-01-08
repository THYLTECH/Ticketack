import LaravelPagination from '@/components/LaravelPagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app/layout';
import { useTrans } from '@/lib/translation';
import {
    PaginationProps,
    SharedData,
    TicketCategory,
    TicketEntry,
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

interface TicketOption {
    id: number;
    title: string;
    description: string | null;
    asset: { id: number; title: string } | null;
}

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

    const handlePerPageChange = (value: string) => {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('per_page', value);
        currentUrl.searchParams.delete('page');

        router.get(
            currentUrl.toString(),
            {},
            { preserveState: true, replace: true, preserveScroll: true },
        );
    };

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

            <div className="container mx-auto max-w-400 space-y-5 px-4 py-8 sm:px-6 lg:px-8">
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

                    <div className="flex flex-col items-center justify-between gap-4 border-t py-4 md:flex-row">
                        <div className="flex flex-1 items-center gap-4 text-sm text-muted-foreground">
                            <div className="whitespace-nowrap">
                                {' '}
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

                            <div className="flex items-center gap-2">
                                <span className="hidden text-xs text-muted-foreground sm:inline-block">
                                    {__('entries.pagination.show') ||
                                        'Afficher'}
                                </span>
                                <Select
                                    value={String(entries.per_page)}
                                    onValueChange={handlePerPageChange}
                                >
                                    <SelectTrigger className="h-8 w-17.5">
                                        <SelectValue
                                            placeholder={String(
                                                entries.per_page,
                                            )}
                                        />
                                    </SelectTrigger>
                                    <SelectContent side="top">
                                        {[5, 10, 15, 25, 50, 100].map(
                                            (size) => (
                                                <SelectItem
                                                    key={size}
                                                    value={String(size)}
                                                >
                                                    {size}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <LaravelPagination
                            links={
                                entries.links as unknown as Array<{
                                    url: string | null;
                                    label: string;
                                    active: boolean;
                                }>
                            }
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
