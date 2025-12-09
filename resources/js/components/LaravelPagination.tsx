import { Link } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from '@/components/ui/pagination';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface LaravelPaginationProps {
    links: PaginationLink[];
    className?: string;
}

export default function LaravelPagination({ links, className }: LaravelPaginationProps) {
    if (links.length <= 3) return null;

    return (
        <Pagination className={cn("mt-6", className)}>
            <PaginationContent className="flex-wrap justify-center gap-1">
                {links.map((link, key) => {
                    const label = link.label
                        .replace('&laquo; Previous', '')
                        .replace('Next &raquo;', '')
                        .replace('&laquo;', '')
                        .replace('&raquo;', '')
                        .trim();

                    const isPrevious = link.label.includes('Previous') || link.label.includes('&laquo;');
                    const isNext = link.label.includes('Next') || link.label.includes('&raquo;');
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
                                            variant: "ghost",
                                            size: "icon",
                                        }),
                                        "opacity-50 cursor-not-allowed",
                                        (isPrevious || isNext) && "gap-1 px-2.5 w-auto"
                                    )}
                                >
                                    {isPrevious && <ChevronLeft className="h-4 w-4" />}
                                    {isPrevious && <span className="hidden sm:block">Précédent</span>}

                                    {!isPrevious && !isNext && label}

                                    {isNext && <span className="hidden sm:block">Suivant</span>}
                                    {isNext && <ChevronRight className="h-4 w-4" />}
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
                                        variant: link.active ? "outline" : "ghost",
                                        size: (isPrevious || isNext) ? "default" : "icon",
                                    }),
                                    (isPrevious || isNext) && "gap-1 px-2.5 sm:px-4",
                                    link.active && "pointer-events-none"
                                )}
                            >
                                {isPrevious && <ChevronLeft className="h-4 w-4" />}
                                {isPrevious && <span className="hidden sm:block">Précédent</span>}

                                {!isPrevious && !isNext && label}

                                {isNext && <span className="hidden sm:block">Suivant</span>}
                                {isNext && <ChevronRight className="h-4 w-4" />}
                            </Link>
                        </PaginationItem>
                    );
                })}
            </PaginationContent>
        </Pagination>
    );
}
