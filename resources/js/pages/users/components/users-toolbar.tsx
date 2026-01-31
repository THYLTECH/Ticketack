import {
    Toolbar,
    ToolbarLabel,
    ToolbarReset,
    ToolbarSearch,
} from '@/components/data-toolbar';
import { FilterMultiSelect } from '@/components/filter-multi-select';
import { useTrans } from '@/lib/translation';
import { Role } from '@/types';
import { Shield } from 'lucide-react';

interface Props {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    filters: { role?: string };
    onFilterChange: (key: string, value: string | null) => void;
    onResetFilters: () => void;
    roles: Role[];
}

export function UsersToolbar({
    searchTerm,
    onSearchChange,
    filters,
    onFilterChange,
    onResetFilters,
    roles,
}: Props) {
    const __ = useTrans();

    const hasActiveFilters =
        searchTerm.length > 0 || (filters.role && filters.role !== 'all');

    return (
        <Toolbar>
            <ToolbarLabel label={__('common.filters.title') || 'Filters'} />

            <ToolbarSearch
                id="users-search"
                name="search"
                value={searchTerm}
                onChange={onSearchChange}
                placeholder={
                    __('users.pages.index.search_placeholder') ||
                    'Search users...'
                }
            />

            <FilterMultiSelect
                icon={<Shield className="h-3.5 w-3.5" />}
                title={__('users.pages.index.filters.role_placeholder')}
                placeholder={__('users.pages.index.filters.role_placeholder')}
                value={filters.role}
                options={roles.map((r) => ({
                    label: r.name,
                    value: String(r.id),
                }))}
                onChange={(v) => onFilterChange('role', v)}
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
