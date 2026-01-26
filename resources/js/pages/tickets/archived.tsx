import { useTrans } from '@/lib/translation';
import { userHasPermission } from '@/lib/utils';
import { BreadcrumbItem, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ArchiveRestore, Plus } from 'lucide-react';
import { PageTutorial } from '@/components/onboarding';
import { TicketTable } from './components/ticket-table';
import { TicketToolbar } from './components/ticket-toolbar';
import { ArchivedStats } from './components/archived-stats';
import { useTicketFilters } from './hooks/use-ticket-filters';
import {
    ArchivedTicketStats,
    BaseTicketPageProps,
    HeaderActions,
    HeaderActionProps,
    TicketPageLayout,
} from './shared';

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

    const actions: HeaderActionProps[] = [
        {
            label: __('tickets.pages.archived.back_to_active'),
            icon: ArchiveRestore,
            href: route('tickets.index'),
            variant: 'outline',
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
            headTitle={__('tickets.pages.archived.head_title')}
            breadcrumbs={breadcrumbs}
            title={__('tickets.pages.archived.title')}
            description={__('tickets.pages.archived.description')}
            headerActions={<HeaderActions actions={actions} />}
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
            tableComponent={
                <div data-onboarding="archived-list">
                    <TicketTable tickets={tickets} auth={auth} />
                </div>
            }
        >
            <PageTutorial
                page="archived_tickets"
                steps={[
                    {
                        id: 'list',
                        title: __('onboarding.archived.list.title'),
                        description: __('onboarding.archived.list.description'),
                        targetSelector: '[data-onboarding="archived-list"]',
                        position: 'top',
                    },
                ]}
            />
        </TicketPageLayout>
    );
}

