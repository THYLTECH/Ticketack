import { PaginationControl } from '@/components/pagination-control';
import AppLayout from '@/layouts/app/layout';
import { useTrans } from '@/lib/translation';
import type { Asset, BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { AssetsEmpty } from './components/assets-empty';
import { AssetsHeader } from './components/assets-header';
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

            <div className="container mx-auto max-w-full space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <AssetsHeader />

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
