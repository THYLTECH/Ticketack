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
import { PageTutorial } from '@/components/onboarding';

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
    const [isTutorialActive, setIsTutorialActive] = useState(false);

    const demoEntry: TicketEntry = {
        id: -1,
        ticket_id: 0,
        user_id: auth.user.id,
        user: auth.user,
        note: __('onboarding.time_entries.demo_entry.description'),
        start_at: new Date().toISOString(),
        end_at: new Date(Date.now() + 3600000).toISOString(),
        duration_seconds: 3600,
        billable: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    const showDemoData = isTutorialActive && entries.data.length === 0;
    const displayEntries = showDemoData ? [demoEntry] : entries.data;
    const displayStats = showDemoData
        ? { total_hours: 1, count: 1, period: __('entries.stats.today') }
        : stats;

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
                ([, v]) => v != null && v !== '' && v !== 'all',
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
            const newFilters = { ...filterValues };
            delete newFilters.start_date;
            delete newFilters.end_date;

            applyFilters({
                ...newFilters,
                start_date: undefined,
                end_date: undefined,
            });
        }
    };

    const resetFilters = () => {
        setFilterValues({});
        setDateRange(undefined);
        router.get(route('tickets.entries.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
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

            <div className="container mx-auto max-w-full space-y-4 px-3 py-4 sm:space-y-5 sm:px-6 sm:py-8 lg:px-8">
                <EntriesHeader
                    onCreateClick={() => setIsCreateOpen(true)}
                    onReportClick={() => setIsReportOpen(true)}
                />

                <div className="flex w-fit items-center rounded-full border bg-background/50 px-3 py-1 shadow-sm">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                    <Separator orientation="vertical" className="mx-2 h-3" />
                    <span className="text-[11px] font-medium tracking-tight text-foreground uppercase">
                        TIMEZONE : {auth.user.timezone || 'UTC'}
                    </span>
                </div>

                <EntriesStats stats={displayStats} data-onboarding="entries-stats" />

                <div className="flex flex-col gap-4" data-onboarding="entries-table">
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

                    <EntriesTable entries={displayEntries} showTicketColumn />

                    <PaginationControl meta={entries} />
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

            <PageTutorial
                page="time_entries"
                steps={[
                    {
                        id: 'stats',
                        title: __('onboarding.time_entries.stats.title'),
                        description: __('onboarding.time_entries.stats.description'),
                        targetSelector: '[data-onboarding="entries-stats"]',
                        position: 'bottom',
                    },
                    {
                        id: 'table',
                        title: __('onboarding.time_entries.table.title'),
                        description: __('onboarding.time_entries.table.description'),
                        targetSelector: '[data-onboarding="entries-table"]',
                        position: 'top',
                    },
                ]}
                onActiveChange={setIsTutorialActive}
            />
        </AppLayout>
    );
}
