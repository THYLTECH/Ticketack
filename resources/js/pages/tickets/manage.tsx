import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTrans } from '@/lib/translation';
import { userHasPermission } from '@/lib/utils';
import { BreadcrumbItem, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Archive, ArrowLeft, Plus } from 'lucide-react';
import { TicketTable } from './components/ticket-table';
import { TicketToolbar } from './components/ticket-toolbar';
import { TicketStats } from './components/ticket-stats';
import { useTicketFilters } from './hooks/use-ticket-filters';
import { BaseTicketPageProps, TicketPageLayout, TicketStats as TicketStatsType } from './shared';

interface Props extends BaseTicketPageProps {
    stats: TicketStatsType;
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

    const headerActions = (
        <>
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
        </>
    );

    return (
        <TicketPageLayout
            headTitle={__('tickets.pages.index.buttons.manage')}
            breadcrumbs={breadcrumbs}
            title={__('tickets.pages.index.buttons.manage')}
            description={__('tickets.pages.index.description')}
            headerActions={headerActions}
            statsComponent={<TicketStats stats={stats} />}
            toolbar={
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
            }
            paginatedData={tickets}
            onClearFilters={clearFilters}
            tableComponent={<TicketTable tickets={tickets} auth={auth} />}
        />
    );
}
