import { useTrans } from '@/lib/translation';
import { PaginationProps, User, Ticket, TicketPriority, TicketStatus, TicketCategory } from '@/types';

import { AssignmentStats } from './assignment/assignment-stats';
import { AssignmentTable } from './assignment/assignment-table';
import { AssignmentToolbar } from './assignment/assignment-toolbar';
import { useTicketFilters } from './hooks/use-ticket-filters';
import { TicketPageLayout } from './shared';


interface PriorityStat {
    id: number;
    title: string;
    color: string;
    sort_order: number;
    count: number;
}

interface Stats {
    total_unassigned: number;
    priority_stats: PriorityStat[];
    oldest_unassigned_days: number;
}

type TicketPagination = PaginationProps & {
    data: Ticket[];
};

interface Props {
    tickets: TicketPagination;
    stats: Stats;
    assignableUsers: User[];
    canAssign: boolean;
    canBeAssigned: boolean;
    filters: Record<string, string>;
    priorities: TicketPriority[];
    statuses: TicketStatus[];
    categories: TicketCategory[];
}

/**
 * Ticket assignment page component
 * Displays unassigned tickets with filtering, search, and assignment
 * capabilities
 */
export default function TicketAssignment({
    tickets,
    stats,
    assignableUsers,
    canAssign,
    canBeAssigned,
    filters = {},
    priorities,
    statuses,
    categories,
}: Props) {
    const __ = useTrans();

    const {
        searchTerm,
        setSearchTerm,
        updateFilters,
        clearFilters,
        hasActiveFilters,
    } = useTicketFilters({ filters, routeName: 'tickets.assignment.index' });

    const breadcrumbs = [
        {
            title: __('home.pages.breadcrumbs.home'),
            href: route('home'),
        },
        {
            title: __('tickets.assignment.page_title'),
            href: '#',
        },
    ];

    const emptyComponent = (
        <AssignmentTable
            tickets={[]}
            assignableUsers={assignableUsers}
            canAssign={canAssign}
            canBeAssigned={canBeAssigned}
        />
    );

    return (
        <TicketPageLayout
            headTitle={__('tickets.assignment.page_title')}
            breadcrumbs={breadcrumbs}
            title={__('tickets.assignment.page_title')}
            description={__('tickets.assignment.page_description')}
            statsComponent={<AssignmentStats stats={stats} />}
            toolbar={
                <AssignmentToolbar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filters={filters}
                    onFilterChange={updateFilters}
                    onClearFilters={clearFilters}
                    priorities={priorities}
                    statuses={statuses}
                    categories={categories}
                    hasActiveFilters={hasActiveFilters}
                />
            }
            paginatedData={tickets}
            onClearFilters={clearFilters}
            tableComponent={
                <AssignmentTable
                    tickets={tickets.data}
                    assignableUsers={assignableUsers}
                    canAssign={canAssign}
                    canBeAssigned={canBeAssigned}
                />
            }
            emptyComponent={emptyComponent}
        />
    );
}

