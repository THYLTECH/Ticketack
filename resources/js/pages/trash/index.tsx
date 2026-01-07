import AppLayout from '@/layouts/app/layout';
import { useTrans } from '@/lib/translation';
import { Asset, BreadcrumbItem, Role, Ticket, User } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ComponentProps, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { TrashTable } from './components/trash-table';
import { TrashToolbar } from './components/trash-toolbar';

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

type Deleted<T> = T & {
    deleted_at: string;
};

interface Props {
    deletedTickets: PaginatedData<Deleted<Ticket>>;
    deletedUsers: PaginatedData<Deleted<User>>;
    deletedRoles: PaginatedData<Deleted<Role>>;
    deletedAssets: PaginatedData<Deleted<Asset>>;
    filters?: { search?: string };
}

type TabType = 'ticket' | 'user' | 'asset' | 'role';

type UnionData =
    | Deleted<Ticket>
    | Deleted<User>
    | Deleted<Role>
    | Deleted<Asset>;

export default function TrashIndex({
    deletedTickets,
    deletedUsers,
    deletedRoles,
    deletedAssets,
    filters = {},
}: Props) {
    const __ = useTrans();

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [debouncedSearch] = useDebounce(searchTerm, 300);
    const [activeTab, setActiveTab] = useState<TabType>('ticket');

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            {
                title: __('home.pages.breadcrumbs.home'),
                href: route('home'),
            },
            {
                title: __('trash.pages.breadcrumbs.index'),
                href: '#',
            },
        ],
        [__],
    );

    useEffect(() => {
        if (debouncedSearch !== (filters.search || '')) {
            router.get(
                route('trash.index'),
                { search: debouncedSearch },
                { preserveState: true, replace: true },
            );
        }
    }, [debouncedSearch, filters.search]);

    const getCurrentData = (): PaginatedData<UnionData> => {
        switch (activeTab) {
            case 'ticket':
                return deletedTickets;
            case 'user':
                return deletedUsers;
            case 'asset':
                return deletedAssets;
            case 'role':
                return deletedRoles;
            default:
                return deletedTickets;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('trash.pages.index.head_title')} />

            <div className="container mx-auto max-w-full space-y-5 px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            {__('trash.pages.index.title')}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {__('trash.pages.index.description')}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <TrashToolbar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        activeTab={activeTab}
                        onTabChange={(tab) => setActiveTab(tab as TabType)}
                        onClearSearch={() => setSearchTerm('')}
                    />

                    <TrashTable
                        data={
                            getCurrentData() as unknown as ComponentProps<
                                typeof TrashTable
                            >['data']
                        }
                        type={activeTab}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
