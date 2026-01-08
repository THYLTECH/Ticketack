import { PaginationControl } from '@/components/pagination-control';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app/layout';
import { useTrans } from '@/lib/translation';
import { userHasPermission } from '@/lib/utils';
import type { Asset, BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { AssetsEmpty } from './components/assets-empty';
import { AssetsTable } from './components/assets-table';
import { AssetsToolbar } from './components/assets-toolbar';

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
    assets: PaginatedData<Asset>;
    filters?: { search?: string; attributes?: string };
    available_attributes: { value: string; label: string }[];
}

export default function AssetsIndex({
    assets,
    filters = {},
    available_attributes = [],
}: Props) {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [debouncedSearch] = useDebounce(searchTerm, 300);

    const [selectedAttributes, setSelectedAttributes] = useState(
        filters.attributes || '',
    );

    const [globalExpand, setGlobalExpand] = useState<boolean | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('dashboard.pages.breadcrumbs.dashboard'),
            href: route('dashboard'),
        },
        {
            title: __('assets.pages.breadcrumbs.index'),
            href: '#',
        },
    ];

    useEffect(() => {
        const query: Record<string, string> = {};

        if (debouncedSearch) query.search = debouncedSearch;
        if (selectedAttributes) query.attributes = selectedAttributes;

        const currentUrl = new URL(window.location.href);
        const params = currentUrl.searchParams;
        const currentSearch = params.get('search') || '';
        const currentAttrs = params.get('attributes') || '';

        if (
            debouncedSearch !== currentSearch ||
            selectedAttributes !== currentAttrs
        ) {
            router.get(route('assets.index'), query, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        }
    }, [debouncedSearch, selectedAttributes]);

    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedAttributes('');
    };

    const hasData = assets.data.length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('assets.pages.index.head_title')} />

            <div className="container mx-auto max-w-full space-y-5 px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            {__('assets.pages.index.title')}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {__('assets.pages.index.description')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {userHasPermission({
                            user: auth.user,
                            permission: 'create assets',
                        }) && (
                            <Button asChild size="sm">
                                <Link href={route('assets.create')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    {__('assets.pages.index.buttons.create')}
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <AssetsToolbar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        selectedAttributes={selectedAttributes}
                        onAttributeChange={setSelectedAttributes}
                        availableAttributes={available_attributes}
                        onExpandAll={() => setGlobalExpand(true)}
                        onCollapseAll={() => setGlobalExpand(false)}
                        onResetFilters={handleResetFilters}
                        hasData={hasData}
                    />

                    {!hasData ? (
                        <AssetsEmpty />
                    ) : (
                        <AssetsTable
                            assets={assets.data}
                            searchTerm={searchTerm}
                            globalExpand={globalExpand}
                            setGlobalExpand={setGlobalExpand}
                        />
                    )}

                    {hasData && (
                        <PaginationControl
                            meta={assets}
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
