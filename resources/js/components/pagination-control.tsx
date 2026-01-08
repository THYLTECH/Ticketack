import LaravelPagination from '@/components/LaravelPagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTrans } from '@/lib/translation';
import { router } from '@inertiajs/react';

interface PaginationMeta {
    current_page: number;
    from: number | null;
    to: number | null;
    total: number;
    per_page: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

interface Props {
    meta: PaginationMeta;
    perPageOptions?: number[];
}

export function PaginationControl({
    meta,
    perPageOptions = [5, 10, 15, 25, 50, 100],
}: Props) {
    const __ = useTrans();

    if (meta.total === 0) return null;

    return (
        <div className="flex flex-col items-center justify-between gap-4 border-t pt-4 md:flex-row">
            <div className="text-center text-sm text-muted-foreground md:text-left">
                {__('pagination.showing') || 'Affichage de'}{' '}
                <span className="font-medium text-foreground">
                    {meta.from ?? 0}
                </span>{' '}
                {__('pagination.to') || 'à'}{' '}
                <span className="font-medium text-foreground">
                    {meta.to ?? 0}
                </span>{' '}
                {__('pagination.of') || 'sur'}{' '}
                <span className="font-medium text-foreground">
                    {meta.total}
                </span>{' '}
                {__('pagination.results') || 'résultats'}
            </div>

            <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium whitespace-nowrap text-muted-foreground">
                        {__('pagination.rows_per_page') || 'Lignes'}
                    </p>
                    <Select
                        value={String(meta.per_page)}
                        onValueChange={handlePerPageChange}
                    >
                        <SelectTrigger className="h-8 w-17.5">
                            <SelectValue placeholder={String(meta.per_page)} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {perPageOptions.map((size) => (
                                <SelectItem key={size} value={String(size)}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center">
                    <LaravelPagination links={meta.links} className="mt-0" />
                </div>
            </div>
        </div>
    );
}

const handlePerPageChange = (value: string) => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('per_page', value);
    currentUrl.searchParams.delete('page');
    router.get(
        currentUrl.toString(),
        {},
        { preserveState: true, replace: true, preserveScroll: true },
    );
};
