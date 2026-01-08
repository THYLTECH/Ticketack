import { FilterMultiSelect } from '@/components/filter-multi-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTrans } from '@/lib/translation';
import {
    ListFilter,
    Maximize2,
    Minimize2,
    Search,
    Tags,
    X,
} from 'lucide-react';

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
        <div className="flex w-full items-center justify-between rounded-md border bg-background p-2 pl-3 shadow-sm">
            <div className="flex flex-1 flex-wrap items-center gap-2">
                <div className="ml-2 hidden items-center gap-2 text-sm font-medium text-muted-foreground md:flex">
                    <ListFilter className="h-4 w-4" />
                    <span>{__('common.filters.title') || 'Filters'}</span>
                </div>

                <Separator
                    orientation="vertical"
                    className="mr-2 hidden h-6 md:block"
                />

                <div className="relative flex items-center">
                    <Search className="absolute left-2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                        placeholder={
                            __('assets.pages.index.filter.placeholder')
                        }
                        className="h-8 w-50 border-dashed bg-transparent pl-8 text-xs shadow-none focus-visible:border-solid focus-visible:ring-1 lg:w-62.5"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <FilterMultiSelect
                    title={__('assets.filters.attributes')}
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
                    <>
                        <Separator
                            orientation="vertical"
                            className="mx-1 hidden h-6 sm:block"
                        />
                        <Button
                            variant="ghost"
                            onClick={onResetFilters}
                            size="sm"
                            className="h-8 border-solid px-2 text-xs font-medium text-muted-foreground hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                            {__('common.filters.reset') || 'Reset'}
                            <X className="ml-2 h-3.5 w-3.5" />
                        </Button>
                    </>
                )}

                {hasData && (
                    <div className="ml-auto flex items-center gap-1">
                        <Separator
                            orientation="vertical"
                            className="mx-1 hidden h-6 sm:block"
                        />
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onCollapseAll}
                                    className="h-8 border-dashed px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                                >
                                    <Minimize2 className="mr-2 h-3.5 w-3.5" />
                                    {__(
                                        'assets.pages.index.buttons.collapse',
                                    ) || 'Collapse all'}
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
            </div>
        </div>
    );
}
