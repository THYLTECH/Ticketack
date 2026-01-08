import {
    Toolbar,
    ToolbarLabel,
    ToolbarReset,
    ToolbarSearch,
    ToolbarSeparator,
} from '@/components/data-toolbar';
import { FilterMultiSelect } from '@/components/filter-multi-select';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTrans } from '@/lib/translation';
import { Maximize2, Minimize2, Tags } from 'lucide-react';

interface Props {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    selectedAttributes: string;
    onAttributeChange: (val: string) => void;
    availableAttributes: { value: string; label: string }[];
    onExpandAll: () => void;
    onCollapseAll: () => void;
    hasData: boolean;
    onResetFilters: () => void;
}

export function AssetsToolbar({
    searchTerm,
    onSearchChange,
    selectedAttributes,
    onAttributeChange,
    availableAttributes,
    onExpandAll,
    onCollapseAll,
    hasData,
    onResetFilters,
}: Props) {
    const __ = useTrans();
    const hasActiveFilters = !!selectedAttributes;

    return (
        <Toolbar>
            <ToolbarLabel label={__('common.filters.title') || 'Filters'} />

            <ToolbarSearch
                value={searchTerm}
                onChange={onSearchChange}
                placeholder={
                    __('assets.pages.index.filter.placeholder') ||
                    'Search assets...'
                }
            />

            <FilterMultiSelect
                title={__('assets.filters.attributes') || 'Attributes'}
                placeholder={
                    __('assets.filters.attributes_search') ||
                    'Search attributes...'
                }
                icon={<Tags className="h-3.5 w-3.5 opacity-70" />}
                options={availableAttributes}
                value={selectedAttributes}
                onChange={onAttributeChange}
            />

            {(hasActiveFilters || searchTerm) && (
                <ToolbarReset
                    onClick={onResetFilters}
                    label={__('common.filters.reset') || 'Reset'}
                />
            )}

            {hasData && (
                <div className="ml-auto flex items-center gap-1">
                    <ToolbarSeparator />
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onCollapseAll}
                                className="h-8 border-dashed px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                            >
                                <Minimize2 className="mr-2 h-3.5 w-3.5" />
                                {__('assets.pages.index.buttons.collapse') ||
                                    'Collapse all'}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            {__('assets.pages.index.buttons.collapse') ||
                                'Collapse all'}
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onExpandAll}
                                className="h-8 border-dashed px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                            >
                                <Maximize2 className="mr-2 h-3.5 w-3.5" />
                                {__('assets.pages.index.buttons.expand') ||
                                    'Expand all'}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            {__('assets.pages.index.buttons.expand') ||
                                'Expand all'}
                        </TooltipContent>
                    </Tooltip>
                </div>
            )}
        </Toolbar>
    );
}
