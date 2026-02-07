import { router } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';

interface UseTicketFiltersOptions {
    filters: Record<string, string>;
    routeName: string;
}

export function useTicketFilters({ filters, routeName }: UseTicketFiltersOptions) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [debouncedSearch] = useDebounce(searchTerm, 300);

    const updateFilters = useCallback(
        (key: string, value: string | null) => {
            const newFilters: Record<string, string> = {
                ...filters,
                search: searchTerm,
            };

            if (value && value !== 'all') {
                newFilters[key] = value;
            } else {
                delete newFilters[key];
            }

            router.get(route(routeName), newFilters, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        },
        [filters, searchTerm, routeName],
    );

    useEffect(() => {
        if (debouncedSearch !== (filters.search || '')) {
            router.get(
                route(routeName),
                { ...filters, search: debouncedSearch },
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }
    }, [debouncedSearch, filters, routeName]);

    const clearFilters = useCallback(() => {
        setSearchTerm('');
        router.get(route(routeName));
    }, [routeName]);

    const hasActiveFilters = useMemo(() => {
        return (
            Object.keys(filters).length > 0 &&
            Object.values(filters).some((v) => v)
        );
    }, [filters]);

    return {
        searchTerm,
        setSearchTerm,
        updateFilters,
        clearFilters,
        hasActiveFilters,
    };
}

