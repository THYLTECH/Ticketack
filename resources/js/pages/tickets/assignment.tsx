import { PaginationControl } from '@/components/pagination-control';
import AppLayout from '@/layouts/app/layout';
import { useTrans } from '@/lib/translation';
import { PaginationProps, User, Ticket, TicketPriority, TicketStatus, TicketCategory } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { AssignmentHeader } from './assignment/assignment-header';
import { AssignmentStats } from './assignment/assignment-stats';
import { AssignmentTable } from './assignment/assignment-table';
import { AssignmentToolbar } from './assignment/assignment-toolbar';


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
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [debouncedSearch] = useDebounce(searchTerm, 300);

    /**
     * Updates URL filters when filter values change
     */
    const updateFilters = useCallback(
        (key: string, value: string | null) => {
            const newFilters: Record<string, string> = {
                ...filters,
                search: searchTerm,
            };

            if (value !== null && value !== '') {
                newFilters[key] = value;
            } else {
                delete newFilters[key];
            }

            Object.keys(newFilters).forEach((k) => {
                if (
                    newFilters[k] === '' ||
                    newFilters[k] === null ||
                    newFilters[k] === undefined
                ) {
                    delete newFilters[k];
                }
            });

            router.get(route('tickets.assignment.index'), newFilters, {
                preserveState: true,
                replace: true,
            });
        },
        [filters, searchTerm],
    );

    /**
     * Clears all active filters
     */
    const clearFilters = useCallback(() => {
        setSearchTerm('');
        router.get(route('tickets.assignment.index'), {}, {
            preserveState: true,
            replace: true,
        });
    }, []);

    const hasActiveFilters = useMemo(() => {
        return (
            searchTerm !== '' ||
            Object.keys(filters).some(
                (key) =>
                    key !== 'search' &&
                    filters[key] !== '' &&
                    filters[key] !== null,
            )
        );
    }, [searchTerm, filters]);

    useEffect(() => {
        if (debouncedSearch !== (filters.search || '')) {
            const newFilters = { ...filters };
            if (debouncedSearch === '') {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { search, ...rest } = newFilters;
                router.get(route('tickets.assignment.index'), rest, {
                    preserveState: true,
                    replace: true,
                });
            } else {
                newFilters.search = debouncedSearch;
                router.get(route('tickets.assignment.index'), newFilters,
                    {
                    preserveState: true,
                    replace: true,
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: __('home.pages.breadcrumbs.home'),
                    href: route('home'),
                },
                {
                    title: __('tickets.assignment.page_title'),
                    href: '#',
                },
            ]}
        >
            <Head title={__('tickets.assignment.page_title')} />

            <div className="container mx-auto max-w-full space-y-4 px-3 py-4 sm:space-y-5 sm:px-6 sm:py-8 lg:px-8">
                <AssignmentHeader />

                <AssignmentStats stats={stats} />

                <div className="flex flex-col gap-4">
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

                    <AssignmentTable
                        tickets={tickets.data}
                        assignableUsers={assignableUsers}
                        canAssign={canAssign}
                        canBeAssigned={canBeAssigned}
                    />

                    <PaginationControl meta={tickets} />
                </div>
            </div>
        </AppLayout>
    );
}

