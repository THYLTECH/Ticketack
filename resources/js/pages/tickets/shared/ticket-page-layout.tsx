import { PaginationControl } from '@/components/pagination-control';
import AppLayout from '@/layouts/app/layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ReactNode } from 'react';
import { PageHeader } from './page-header';
import { PaginatedData } from './types';
import { TicketEmpty } from '../components/ticket-empty';

interface TicketPageLayoutProps<T> {
    /** Page title for browser tab */
    headTitle: string;
    /** Breadcrumb navigation items */
    breadcrumbs: BreadcrumbItem[];
    /** Page header title */
    title: string;
    /** Page header description */
    description: string;
    /** Optional action buttons in header */
    headerActions?: ReactNode;
    /** Stats component to render */
    statsComponent?: ReactNode;
    /** Toolbar component for filters/search */
    toolbar?: ReactNode;
    /** Paginated data for checking if empty */
    paginatedData: PaginatedData<T>;
    /** Callback when clearing filters (for empty state) */
    onClearFilters?: () => void;
    /** Table component to render when data exists */
    tableComponent: ReactNode;
    /** Optional custom empty state component */
    emptyComponent?: ReactNode;
    /** Additional content after main content */
    children?: ReactNode;
}

/**
 * Reusable page layout for ticket-related pages
 * Provides consistent structure: header, stats, toolbar, table/empty, pagination
 */
export function TicketPageLayout<T>({
    headTitle,
    breadcrumbs,
    title,
    description,
    headerActions,
    statsComponent,
    toolbar,
    paginatedData,
    onClearFilters,
    tableComponent,
    emptyComponent,
    children,
}: TicketPageLayoutProps<T>) {
    const isEmpty = paginatedData.data.length === 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={headTitle} />

            <div className="container mx-auto max-w-full space-y-4 px-3 py-4 sm:space-y-5 sm:px-6 sm:py-8 lg:px-8">
                <PageHeader
                    title={title}
                    description={description}
                    actions={headerActions}
                />

                {statsComponent}

                <div className="flex flex-col gap-4">
                    {toolbar}

                    {isEmpty ? (
                        emptyComponent || (
                            <TicketEmpty onClearFilters={onClearFilters} />
                        )
                    ) : (
                        <>
                            {tableComponent}
                            <PaginationControl meta={paginatedData} />
                        </>
                    )}
                </div>

                {children}
            </div>
        </AppLayout>
    );
}

