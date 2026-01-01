import { buttonVariants } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from '@/components/ui/pagination';
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface LaravelPaginationProps {
    links: PaginationLink[];
    className?: string;
}

export default function LaravelPagination({
    links,
    className,
}: LaravelPaginationProps) {
    const __ = useTrans();

    if (links.length <= 3) return null;

    return (
        <Pagination className={cn('mt-6', className)}>
            <PaginationContent className="flex-wrap justify-center gap-1">
                {links.map((link, key) => {
                    const label = link.label
                        .replace('&laquo; Previous', '')
                        .replace('Next &raquo;', '')
                        .replace('&laquo;', '')
                        .replace('&raquo;', '')
                        .trim();

                    const isPrevious =
                        link.label.includes('Previous') ||
                        link.label.includes('&laquo;');
                    const isNext =
                        link.label.includes('Next') ||
                        link.label.includes('&raquo;');
                    const isEllipsis = link.label === '...';

                    if (isEllipsis) {
                        return (
                            <PaginationItem key={key}>
                                <div className="flex h-9 w-9 items-center justify-center">
                                    <MoreHorizontal className="h-4 w-4 opacity-50" />
                                </div>
                            </PaginationItem>
                        );
                    }

                    if (link.url === null) {
                        return (
                            <PaginationItem key={key}>
                                <div
                                    className={cn(
                                        buttonVariants({
                                            variant: 'ghost',
                                            size: 'icon',
                                        }),
                                        'cursor-not-allowed opacity-50',
                                        (isPrevious || isNext) &&
                                            'w-auto gap-1 px-2.5',
                                    )}
                                >
                                    {isPrevious && (
                                        <ChevronLeft className="h-4 w-4" />
                                    )}
                                    {isPrevious && (
                                        <span className="hidden sm:block">
                                            {__('pagination.previous')}
                                        </span>
                                    )}

                                    {!isPrevious && !isNext && label}

                                    {isNext && (
                                        <span className="hidden sm:block">
                                            {__('pagination.next')}
                                        </span>
                                    )}
                                    {isNext && (
                                        <ChevronRight className="h-4 w-4" />
                                    )}
                                </div>
                            </PaginationItem>
                        );
                    }

                    return (
                        <PaginationItem key={key}>
                            <Link
                                href={link.url}
                                preserveScroll
                                preserveState
                                className={cn(
                                    buttonVariants({
                                        variant: link.active
                                            ? 'outline'
                                            : 'ghost',
                                        size:
                                            isPrevious || isNext
                                                ? 'default'
                                                : 'icon',
                                    }),
                                    (isPrevious || isNext) &&
                                        'gap-1 px-2.5 sm:px-4',
                                    link.active && 'pointer-events-none',
                                )}
                            >
                                {isPrevious && (
                                    <ChevronLeft className="h-4 w-4" />
                                )}
                                {isPrevious && (
                                    <span className="hidden sm:block">
                                        {__('pagination.previous')}
                                    </span>
                                )}

                                {!isPrevious && !isNext && label}

                                {isNext && (
                                    <span className="hidden sm:block">
                                        {__('pagination.next')}
                                    </span>
                                )}
                                {isNext && <ChevronRight className="h-4 w-4" />}
                            </Link>
                        </PaginationItem>
                    );
                })}
            </PaginationContent>
        </Pagination>
    );
}
