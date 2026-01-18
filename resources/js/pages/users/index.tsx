import { PaginationControl } from '@/components/pagination-control';
import AppLayout from '@/layouts/app/layout';
import { useTrans } from '@/lib/translation';
import type { BreadcrumbItem, Role, User } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { UsersEmpty } from './components/users-empty';
import { UsersHeader } from './components/users-header';
import { UsersTable } from './components/users-table';
import { UsersToolbar } from './components/users-toolbar';

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
    users: PaginatedData<User>;
    roles: Role[];
    filters?: { search?: string; role?: string };
}

export default function Index({ users, roles, filters = {} }: Props) {
    const __ = useTrans();

    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');
    const [debouncedSearch] = useDebounce(search, 300);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('home.pages.breadcrumbs.home'),
            href: route('home'),
        },
        {
            title: __('users.pages.breadcrumbs.index'),
            href: '#',
        },
    ];

    useEffect(() => {
        router.get(
            route('users.index'),
            {
                search: debouncedSearch,
                role: roleFilter,
            },
            { preserveState: true, replace: true, preserveScroll: true },
        );
    }, [debouncedSearch, roleFilter]);

    const handleResetFilters = () => {
        setSearch('');
        setRoleFilter('');
    };

    const hasData = users.data.length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('users.pages.index.head_title')} />

            <div className="container mx-auto max-w-full space-y-5 px-4 py-8 sm:px-6 lg:px-8">
                <UsersHeader />

                <div className="flex flex-col gap-4">
                    <UsersToolbar
                        searchTerm={search}
                        onSearchChange={setSearch}
                        filters={filters}
                        onFilterChange={(key, value) => {
                            if (key === 'role') setRoleFilter(value || '');
                        }}
                        onResetFilters={handleResetFilters}
                        roles={roles}
                    />

                    {!hasData &&
                        (search.length > 0 || roleFilter.length > 0) ? (
                        <UsersEmpty />
                    ) : (
                        <UsersTable users={users.data} />
                    )}

                    {hasData && <PaginationControl meta={users} />}
                </div>
            </div>
        </AppLayout>
    );
}
