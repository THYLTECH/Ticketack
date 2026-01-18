import {
    Toolbar,
    ToolbarLabel,
    ToolbarReset,
    ToolbarSearch,
} from '@/components/data-toolbar';
import { useTrans } from '@/lib/translation';

import { FilterMultiSelect } from '@/components/filter-multi-select';
import { Layers } from 'lucide-react';

interface Props {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    filters: { usage?: string[] };
    onFilterChange: (key: string, value: string[]) => void;
    onResetFilters: () => void;
    hasData: boolean;
}

export function RolesToolbar({
    searchTerm,
    onSearchChange,
    filters,
    onFilterChange,
    onResetFilters,
    hasData,
}: Props) {
    const __ = useTrans();

    const hasActiveFilters =
        searchTerm.length > 0 || (filters.usage && filters.usage.length > 0);

    return (
        <Toolbar>
            <ToolbarLabel label={__('common.filters.title') || 'Filters'} />

            <ToolbarSearch
                value={searchTerm}
                onChange={onSearchChange}
                placeholder={
                    __('roles.pages.index.search_placeholder') ||
                    'Search roles...'
                }
            />

            <FilterMultiSelect
                icon={<Layers className="h-3.5 w-3.5" />}
                title={__('roles.pages.index.filters.usage_placeholder')}
                value={filters.usage?.join(',')}
                options={[
                    {
                        label: __('roles.pages.index.filters.usage_options.used'),
                        value: 'used',
                    },
                    {
                        label: __('roles.pages.index.filters.usage_options.unused'),
                        value: 'unused',
                    },
                ]}
                onChange={(v) => onFilterChange('usage', v ? v.split(',') : [])}
            />

            {hasActiveFilters && (
                <ToolbarReset
                    onClick={onResetFilters}
                    label={__('common.filters.reset') || 'Reset'}
                />
            )}
        </Toolbar>
    );
}
