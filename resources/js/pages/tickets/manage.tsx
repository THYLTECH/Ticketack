import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Head, Link, usePage } from '@inertiajs/react';
import { Archive, ArrowLeft, Plus } from 'lucide-react';
import { TicketEmpty } from './components/ticket-empty';
import { TicketTable } from './components/ticket-table';
import { TicketToolbar } from './components/ticket-toolbar';
import { TicketStats } from './components/ticket-stats';
import { PaginationControl } from '@/components/pagination-control';
import { useTicketFilters } from './hooks/use-ticket-filters';

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
        open: number;
        unassigned: number;
        resolved: number;
        avg_resolution_days: number;
        assigned_to_me: number;
        archived: number;
    };
    filters: Record<string, string>;
    statuses: TicketStatus[];
    priorities: TicketPriority[];
    categories: TicketCategory[];
    assets: Asset[];
    solvers: User[];
}

export default function Manage({
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

    const {
        searchTerm,
        setSearchTerm,
        updateFilters,
        clearFilters,
        hasActiveFilters,
    } = useTicketFilters({ filters, routeName: 'tickets.manage' });

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

                    <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                        {userHasPermission({
                            user: auth.user,
                            permission: 'view tickets',
                        }) && (
                            <Button asChild variant="outline" size="sm" className="relative flex-1 sm:flex-initial">
                                <Link href={route('tickets.archived')}>
                                    <Archive className="mr-2 h-4 w-4" />
                                    {__('tickets.pages.index.buttons.archived')}
                                    {stats.archived > 0 && (
                                        <Badge
                                            variant="secondary"
                                            className="ml-2 h-5 min-w-5 px-1.5 text-xs"
                                        >
                                            {stats.archived}
                                        </Badge>
                                    )}
                                </Link>
                            </Button>
                        )}
                        <Button asChild variant="secondary" size="sm" className="flex-1 sm:flex-initial">
                            <Link href={route('tickets.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {__('tickets.pages.form.buttons.back')}
                            </Link>
                        </Button>
                        {userHasPermission({
                            user: auth.user,
                            permission: 'create tickets',
                        }) && (
                            <Button asChild size="sm" className="flex-1 sm:flex-initial">
                                <Link href={route('tickets.create')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    {__('tickets.pages.index.buttons.create')}
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <TicketStats stats={stats} />

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
                        routeName="tickets.manage"
                    />

                    {tickets.data.length === 0 ? (
                        <TicketEmpty onClearFilters={clearFilters} />
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
