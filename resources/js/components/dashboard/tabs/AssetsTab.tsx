import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { StatsBarChart } from '@/components/dashboard/StatsBarChart';
import MultiSelectSimple from '@/components/ui/MultiSelectSimple';
import { useTrans } from '@/lib/translation';

interface AssetsTabProps {
    statsAssets: {
        by_asset: any[];
        by_attribute: any[];
    };
    chartFilters: Record<number, { selectedKeys: string[], limit: number }>;
    onFilterChange: (index: number, key: 'selectedKeys' | 'limit', value: any) => void;
    chartConfig: any;
}

export const AssetsTab = ({ statsAssets, chartFilters, onFilterChange, chartConfig }: AssetsTabProps) => {
    const __ = useTrans();

    // Configuration des deux sections d'assets
    const sections = [
        {
            title: __('dashboard.pages.tabs.asset_statistics'),
            data: statsAssets.by_asset,
            dataKey: "tickets_count",
            labelKey: "title",
            filterLabel: "Filtrer les assets",
            // Transformation pour le MultiSelect (id doit être string)
            selectItems: statsAssets.by_asset.map(a => ({ id: a.id.toString(), label: a.title }))
        },
        {
            title: __('dashboard.pages.stats.asset_statistics.by_attribute'),
            data: statsAssets.by_attribute,
            dataKey: "count",
            labelKey: "key",
            filterLabel: "Filtrer les attributs",
            // Ici l'id est déjà la clé (string)
            selectItems: statsAssets.by_attribute.map(a => ({ id: a.key, label: a.key }))
        }
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4">
            {sections.map((section, index) => {
                const filters = chartFilters[index];

                // Logique de filtrage Front-end
                const displayData = section.data
                    .filter(item => {
                        const idToCheck = item.id ? item.id.toString() : item.key;
                        return filters.selectedKeys.length === 0 || filters.selectedKeys.includes(idToCheck);
                    })
                    .slice(0, filters.limit);

                return (
                    <Card key={index} className="relative">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{section.title}</CardTitle>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Filter className="size-4 text-muted-foreground" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-72 space-y-4" align="end">
                                    <div className="space-y-2">
                                        <MultiSelectSimple
                                            label={section.filterLabel}
                                            items={section.selectItems}
                                            selectedIds={filters.selectedKeys}
                                            onSelectionChange={(keys) => onFilterChange(index, 'selectedKeys', keys)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">{__('dashboard.pages.filters.label.limit')}</Label>
                                        <Input 
                                            type="number" 
                                            min={1}
                                            value={filters.limit} 
                                            onChange={(e) => onFilterChange(index, 'limit', parseInt(e.target.value) || 1)} 
                                        />
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </CardHeader>
                        <CardContent className="min-h-[300px]">
                            {displayData.length === 0 ? (
                                <div className="h-[200px] flex items-center justify-center border border-dashed rounded-lg text-xs text-muted-foreground">
                                    {__('dashboard.pages.stats.no_data')}
                                </div>
                            ) : (
                                <StatsBarChart
                                    data={displayData}
                                    dataKey={section.dataKey}
                                    labelKey={section.labelKey}
                                    config={chartConfig}
                                    layout="vertical"
                                />
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};