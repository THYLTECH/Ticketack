import { PaginationControl } from '@/components/pagination-control';
import AppLayout from '@/layouts/app/layout';
import { useTrans } from '@/lib/translation';
import type { BreadcrumbItem, Role } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { RolesEmpty } from './components/roles-empty';
import { RolesHeader } from './components/roles-header';
import { RolesTable } from './components/roles-table';
import { RolesToolbar } from './components/roles-toolbar';
import { PageTutorial } from '@/components/onboarding';

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
    roles: PaginatedData<Role>;
    filters?: { search?: string; usage?: string[] };
}

export default function Index({ roles, filters = {} }: Props) {
    const __ = useTrans();
    const [search, setSearch] = useState(filters.search || '');
    const [usageFilter, setUsageFilter] = useState<string[]>(
        filters.usage || [],
    );
    const [debouncedSearch] = useDebounce(search, 300);
    const [isTutorialActive, setIsTutorialActive] = useState(false);

    const demoRole: Role = {
        id: 0,
        name: __('onboarding.roles.demo_role.title'),
        nbrOfUsers: 5,
        permissions: [],
        users: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('home.pages.breadcrumbs.home'),
            href: route('home'),
        },
        {
            title: __('roles.pages.breadcrumbs.index'),
            href: '#',
        },
    ];

    const isMounted = useRef(false);

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        router.get(
            route('roles.index'),
            {
                search: debouncedSearch,
                usage: usageFilter,
            },
            { preserveState: true, replace: true, preserveScroll: true },
        );
    }, [debouncedSearch, usageFilter]);

    const handleResetFilters = () => {
        setSearch('');
        setUsageFilter([]);
    };

    const hasData = roles.data.length > 0;
    const showDemoData = isTutorialActive && !hasData;
    const displayRoles = showDemoData ? [demoRole] : roles.data;
    const shouldShowTable = hasData || showDemoData;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('roles.pages.index.head_title')} />

            <div className="container mx-auto max-w-full space-y-5 px-4 py-8 sm:px-6 lg:px-8">
                <RolesHeader />

                <div className="flex flex-col gap-4">
                    <RolesToolbar
                        searchTerm={search}
                        onSearchChange={setSearch}
                        filters={{ usage: usageFilter }}
                        onFilterChange={(_, value) => setUsageFilter(value)}
                        onResetFilters={handleResetFilters}
                    />

                    {!shouldShowTable &&
                        search.length === 0 &&
                        usageFilter.length === 0 ? (
                        <RolesEmpty />
                    ) : (
                        <div data-onboarding="roles-table">
                            <RolesTable roles={displayRoles} />
                        </div>
                    )}

                    {hasData && <PaginationControl meta={roles} />}
                </div>

                <PageTutorial
                    page="roles"
                    onActiveChange={setIsTutorialActive}
                />
            </div>
        </AppLayout>
    );
}
