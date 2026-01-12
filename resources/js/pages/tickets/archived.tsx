import { Button } from '@/components/ui/button';
import { useTrans } from '@/lib/translation';
import { userHasPermission } from '@/lib/utils';
import { BreadcrumbItem, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArchiveRestore, Plus } from 'lucide-react';
import { TicketTable } from './components/ticket-table';
import { TicketToolbar } from './components/ticket-toolbar';
import { ArchivedStats } from './components/archived-stats';
import { useTicketFilters } from './hooks/use-ticket-filters';
import { ArchivedTicketStats, BaseTicketPageProps, TicketPageLayout } from './shared';

interface Props extends BaseTicketPageProps {
    stats: ArchivedTicketStats;
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

    const {
        searchTerm,
        setSearchTerm,
        updateFilters,
        clearFilters,
        hasActiveFilters,
    } = useTicketFilters({ filters, routeName: 'tickets.archived' });

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

    const headerActions = (
        <>
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
        </>
    );

    return (
        <TicketPageLayout
            headTitle={__('tickets.pages.archived.head_title')}
            breadcrumbs={breadcrumbs}
            title={__('tickets.pages.archived.title')}
            description={__('tickets.pages.archived.description')}
            headerActions={headerActions}
            statsComponent={<ArchivedStats stats={stats} />}
            toolbar={
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
            }
            paginatedData={tickets}
            onClearFilters={clearFilters}
            tableComponent={<TicketTable tickets={tickets} auth={auth} />}
        />
    );
}

