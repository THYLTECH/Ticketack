import { useTrans } from '@/lib/translation';
import { userHasPermission } from '@/lib/utils';
import { BreadcrumbItem, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Archive, ArrowLeft, Plus } from 'lucide-react';
import { TicketTable } from './components/ticket-table';
import { TicketToolbar } from './components/ticket-toolbar';
import { TicketStats } from './components/ticket-stats';
import { useTicketFilters } from './hooks/use-ticket-filters';
import {
    BaseTicketPageProps,
    HeaderActions,
    HeaderActionProps,
    TicketPageLayout,
    TicketStats as TicketStatsType,
} from './shared';

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
            title: __('tickets.pages.manage.title'),
            href: '#',
        },
    ];

    const actions: HeaderActionProps[] = [
        {
            label: __('tickets.pages.index.buttons.archived'),
            icon: Archive,
            href: route('tickets.archived'),
            variant: 'outline',
            badge: stats.archived,
            show: userHasPermission({ user: auth.user, permission: 'view tickets' }),
        },
        {
            label: __('tickets.pages.form.buttons.back'),
            icon: ArrowLeft,
            href: route('tickets.index'),
            variant: 'secondary',
        },
        {
            label: __('tickets.pages.index.buttons.create'),
            icon: Plus,
            href: route('tickets.create'),
            show: userHasPermission({ user: auth.user, permission: 'create tickets' }),
        },
    ];

    return (
        <TicketPageLayout
            headTitle={__('tickets.pages.manage.head_title')}
            breadcrumbs={breadcrumbs}
            title={__('tickets.pages.manage.title')}
            description={__('tickets.pages.manage.description')}
            headerActions={<HeaderActions actions={actions} />}
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
