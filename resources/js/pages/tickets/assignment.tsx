import { useTrans } from '@/lib/translation';
import { PaginationProps, User, Ticket, TicketPriority, TicketStatus, TicketCategory, SharedData } from '@/types';
import { PageTutorial } from '@/components/onboarding';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

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
    const { auth } = usePage<SharedData>().props;
    const __ = useTrans();
    const [isTutorialActive, setIsTutorialActive] = useState(false);

    const {
        searchTerm,
        setSearchTerm,
        updateFilters,
        clearFilters,
        hasActiveFilters,
    } = useTicketFilters({ filters, routeName: 'tickets.assignment.index' });

    const now = new Date();
    const demoTicket: Ticket = {
        id: 0,
        user: auth.user,
        priority: priorities[0] || { id: 1, title: 'Normal', description: '', sort_order: 1, color: '#3b82f6', created_at: '', updated_at: '' },
        status: statuses.find(s => s.is_default) || { id: 1, title: 'Open', description: '', sort_order: 1, color: '#22c55e', is_default: true, is_closed: false, progress: 0, created_at: '', updated_at: '' },
        category: categories[0] || { id: 1, title: 'General', description: '', sort_order: 1, color: '#8b5cf6', icon: undefined, created_at: '', updated_at: '' },
        asset: { id: '', title: '', description: '', parent_id: null, parent: null, icon: null, attributes: [], attachments: [], updated_at: '', created_at: '' },
        assignees: [],
        comments: [],
        logs: [],
        entries: [],
        schedules: [],
        attachments: [],
        title: __('onboarding.assignment.demo_ticket.title'),
        description: __('onboarding.assignment.demo_ticket.description'),
        is_archived: false,
        archived_at: null,
        is_referenced: false,
        detailed_solution: null,
        updated_at: now.toISOString(),
        created_at: now.toISOString(),
    };

    const demoStats: Stats = {
        total_unassigned: 1,
        priority_stats: priorities.slice(0, 3).map(p => ({ ...p, count: p.id === priorities[0]?.id ? 1 : 0 })),
        oldest_unassigned_days: 1,
    };

    const showDemoData = isTutorialActive && tickets.data.length === 0;
    const displayTickets = showDemoData ? [demoTicket] : tickets.data;
    const displayStats = showDemoData ? demoStats : stats;

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
            statsComponent={
                <div data-onboarding="assignment-stats" className="w-fit">
                    <AssignmentStats stats={displayStats} />
                </div>
            }
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
                <div data-onboarding="assignment-table">
                    <AssignmentTable
                        tickets={displayTickets}
                        assignableUsers={assignableUsers}
                        canAssign={canAssign}
                        canBeAssigned={canBeAssigned}
                    />
                </div>
            }
            emptyComponent={emptyComponent}
        >
            <PageTutorial
                page="assignment"
                steps={[
                    {
                        id: 'stats',
                        title: __('onboarding.assignment.stats.title'),
                        description: __('onboarding.assignment.stats.description'),
                        targetSelector: '[data-onboarding="assignment-stats"]',
                        position: 'bottom',
                    },
                    {
                        id: 'table',
                        title: __('onboarding.assignment.table.title'),
                        description: __('onboarding.assignment.table.description'),
                        targetSelector: '[data-onboarding="assignment-table"]',
                        position: 'top',
                    },
                ]}
                onActiveChange={setIsTutorialActive}
            />
        </TicketPageLayout>
    );
}
