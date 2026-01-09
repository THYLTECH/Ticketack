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
import { ArrowLeft, Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { TicketEmpty } from './components/ticket-empty';
import { TicketTable } from './components/ticket-table';
import { TicketToolbar } from './components/ticket-toolbar';
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
    filters: Record<string, string>;
    statuses: TicketStatus[];
    priorities: TicketPriority[];
    categories: TicketCategory[];
    assets: Asset[];
    solvers: User[];
}

export default function Manage({
    tickets,
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
            router.get(route('tickets.manage'), newFilters, {
                preserveState: true,
                replace: true,
            });
        },
        [filters, searchTerm],
    );

    useEffect(() => {
        if (debouncedSearch !== (filters.search || '')) {
            router.get(
                route('tickets.manage'),
                { ...filters, search: debouncedSearch },
                { preserveState: true, replace: true },
            );
        }
    }, [debouncedSearch, filters]);

    const clearFilters = () => {
        setSearchTerm('');
        router.get(route('tickets.manage'));
    };

    const hasActiveFilters = useMemo(() => {
        return (
            Object.keys(filters).length > 0 &&
            Object.values(filters).some((v) => v)
        );
    }, [filters]);

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
            title: __('tickets.pages.index.buttons.manage'),
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('tickets.pages.index.buttons.manage')} />

            <div className="container mx-auto max-w-full space-y-5 px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            {__('tickets.pages.index.buttons.manage')}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {__('tickets.pages.index.description')}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button asChild variant="secondary" size="sm">
                            <Link href={route('tickets.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {__('tickets.pages.form.buttons.back')}
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

                <div className="flex flex-col gap-4">
                    <TicketToolbar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        filters={filters}
                        onFilterChange={updateFilters}
                        onClearFilters={clearFilters}
                        statuses={statuses}
                        priorities={priorities}
                        categories={categories}
                        assets={assets}
                        solvers={solvers}
                        hasActiveFilters={hasActiveFilters}
                    />

                    {tickets.data.length === 0 ? (
                        <TicketEmpty />
                    ) : (
                        <>
                            <TicketTable tickets={tickets} auth={auth} />
                            <PaginationControl
                                meta={tickets}
                            />
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
