import { PaginationControl } from '@/components/pagination-control';
import AppLayout from '@/layouts/app/layout';
import { useTrans } from '@/lib/translation';
import { Asset, BreadcrumbItem, Role, Ticket, User, SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { TrashTable } from './components/trash-table';
import { TrashToolbar } from './components/trash-toolbar';
import { PageTutorial } from '@/components/onboarding';

type Deleted<T> = T & {
    deleted_at: string;
};

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    deletedTickets: PaginatedData<Deleted<Ticket>>;
    deletedUsers: PaginatedData<Deleted<User>>;
    deletedRoles: PaginatedData<Deleted<Role>>;
    deletedAssets: PaginatedData<Deleted<Asset>>;
    retentionSettings: {
        ticket: number;
        user: number;
        role: number;
        asset: number;
    };
    filters?: {
        search?: string;
        type?: 'ticket' | 'user' | 'asset' | 'role';
    };
    canManageSettings: boolean;
}

export default function TrashIndex({
    deletedTickets,
    deletedUsers,
    deletedRoles,
    deletedAssets,
    retentionSettings,
    filters = {},
    canManageSettings,
}: Props) {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [debouncedSearch] = useDebounce(searchTerm, 300);
    const [activeTab, setActiveTab] = useState<
        'ticket' | 'user' | 'asset' | 'role'
    >(filters.type || 'ticket');
    const [isTutorialActive, setIsTutorialActive] = useState(false);

    const currentRetention = retentionSettings[activeTab] || 30;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('home.pages.breadcrumbs.home'),
            href: route('home'),
        },
        {
            title: __('trash.pages.breadcrumbs.index'),
            href: '#',
        },
    ];

    const isMounted = useRef(false);

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        const params: Record<string, string> = {};
        if (debouncedSearch) params.search = debouncedSearch;
        if (activeTab !== 'ticket') params.type = activeTab;

        router.get(route('trash.index'), params, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    }, [debouncedSearch, activeTab]);

    const getCurrentData = () => {
        switch (activeTab) {
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

    const currentData = getCurrentData();
    const hasData = currentData.data.length > 0;

    const showDemoData = isTutorialActive && !hasData && activeTab === 'ticket';

    const now = new Date();
    const demoDeletedTicket = {
        id: 0,
        title: __('onboarding.trash.demo_item.title'),
        description: '',
        priority: { title: 'Medium', color: '#f59e0b' },
        status: { title: 'Open', color: '#3b82f6' },
        type: 'incident',
        attributes: [],
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        deleted_at: now.toISOString(),
        user_id: auth.user.id,
        user: {
            id: auth.user.id,
            name: auth.user.name,
            email: auth.user.email,
            avatar: auth.user.avatar,
            created_at: auth.user.created_at,
            updated_at: auth.user.updated_at,
        },
        assignees: [],
    } as unknown as Deleted<Ticket>;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('trash.pages.index.head_title')} />

            <div className="container mx-auto max-w-full space-y-5 px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        {__('trash.pages.index.title')}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {__('trash.pages.index.description')}
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <div data-onboarding="trash-tabs">
                        <TrashToolbar
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            onClearSearch={() => setSearchTerm('')}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            retentionDays={currentRetention}
                            canManageSettings={canManageSettings}
                        />
                    </div>

                    <div data-onboarding="trash-table">
                        <TrashTable
                            data={
                                showDemoData
                                    ? { ...currentData, data: [demoDeletedTicket] }
                                    : currentData
                            }
                            type={activeTab}
                            retentionDays={currentRetention}
                        />
                    </div>

                    {hasData && <PaginationControl meta={currentData} />}
                </div>

                <PageTutorial
                    page="trash"
                    onActiveChange={setIsTutorialActive}
                />
            </div>
        </AppLayout>
    );
}
