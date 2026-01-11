import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app/layout';
import { useTrans } from '@/lib/translation';
import { userHasPermission } from '@/lib/utils';
import {
    Asset,
    BreadcrumbItem,
    SharedData,
    Ticket,
    TicketCategory,
    TicketPriority,
    TicketStatus,
    User,
} from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArchiveRestore, Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { TicketEmpty } from './components/ticket-empty';
import { TicketTable } from './components/ticket-table';
import { TicketToolbar } from './components/ticket-toolbar';
import { ArchivedStats } from './components/archived-stats';
import { PaginationControl } from '@/components/pagination-control';

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

interface Props {
    tickets: PaginatedData<Ticket>;
    stats: {
        total: number;
        resolved: number;
        avg_archive_days: number;
        archived_last_30_days: number;
    };
    filters: Record<string, string>;
    statuses: TicketStatus[];
    priorities: TicketPriority[];
    categories: TicketCategory[];
    assets: Asset[];
    solvers: User[];
}

export default function Archived({
    tickets,
    stats,
    filters = {},
    statuses = [],
    priorities = [],
    categories = [],
    assets = [],
    solvers = [],
}: Props) {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [debouncedSearch] = useDebounce(searchTerm, 300);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('home.pages.breadcrumbs.home'),
            href: route('home'),
        },
        {
            title: __('tickets.pages.breadcrumbs.index'),
            href: route('tickets.index'),
        },
        {
            title: __('tickets.pages.archived.title'),
            href: '#',
        },
    ];

    const updateFilters = useCallback(
        (key: string, value: string | null) => {
            const newFilters: Record<string, string> = {
                ...filters,
                search: searchTerm,
            };

            if (value && value !== 'all') {
                newFilters[key] = value;
            } else {
                delete newFilters[key];
            }

            router.get(route('tickets.archived'), newFilters, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        },
        [filters, searchTerm],
    );

    useEffect(() => {
        if (debouncedSearch !== (filters.search || '')) {
            router.get(
                route('tickets.archived'),
                { ...filters, search: debouncedSearch },
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }
    }, [debouncedSearch, filters]);

    const clearFilters = () => {
        setSearchTerm('');
        router.get(route('tickets.archived'));
    };

    const hasActiveFilters = useMemo(() => {
        return (
            Object.keys(filters).length > 0 &&
            Object.values(filters).some((v) => v)
        );
    }, [filters]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('tickets.pages.archived.head_title')} />

            <div className="container mx-auto max-w-full space-y-5 px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            {__('tickets.pages.archived.title')}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {__('tickets.pages.archived.description')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild size="sm" variant="outline">
                            <Link href={route('tickets.index')}>
                                <ArchiveRestore className="mr-2 h-4 w-4" />
                                {__('tickets.pages.archived.back_to_active')}
                            </Link>
                        </Button>
                        {userHasPermission({
                            user: auth.user,
                            permission: 'create tickets',
                        }) && (
                            <Button asChild size="sm">
                                <Link href={route('tickets.create')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    {__('tickets.pages.index.buttons.create')}
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <ArchivedStats stats={stats} />

                <div className="flex flex-col gap-4">
                    <TicketToolbar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        filters={filters}
                        onFilterChange={updateFilters}
                        onClearFilters={clearFilters}
                        hasActiveFilters={hasActiveFilters}
                        statuses={statuses}
                        priorities={priorities}
                        categories={categories}
                        assets={assets}
                        solvers={solvers}
                        routeName="tickets.archived"
                    />

                    {tickets.data.length === 0 ? (
                        <TicketEmpty onClearFilters={clearFilters} />
                    ) : (
                        <>
                            <TicketTable tickets={tickets} auth={auth} />
                            <PaginationControl meta={tickets} />
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

