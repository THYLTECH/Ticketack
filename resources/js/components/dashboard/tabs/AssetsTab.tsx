import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { StatsBarChart } from '@/components/dashboard/StatsBarChart';
import MultiSelectSimple from '@/components/ui/MultiSelectSimple';
import { useTrans } from '@/lib/translation';

interface ChartConfigItem {
    label: string;
    color?: string;
}

type ChartConfig = Record<string, ChartConfigItem>;

interface AssetsTabProps {
    statsAssets: {
        by_asset: { id: number; title: string; description: string; icon: string; tickets_count: number; }[];
        by_attribute: { key: string; count: number }[];
    };
    chartFilters: Record<number, { selectedKeys: string[], limit: number }>;
    onFilterChange: (index: number, key: 'selectedKeys' | 'limit', value: string[] | number) => void;
    chartConfig: ChartConfig;
}

export const AssetsTab = ({ statsAssets, chartFilters, onFilterChange, chartConfig }: AssetsTabProps) => {
    const __ = useTrans();

    const sections = [
        {
            title: __('dashboard.pages.tabs.asset_statistics'),
            data: statsAssets.by_asset,
            dataKey: "tickets_count",
            labelKey: "title",
            filterLabel: __('dashboard.pages.filters.label.filter'),
            selectItems: statsAssets.by_asset.map(a => ({ id: a.id.toString(), label: a.title }))
        },
        {
            title: __('dashboard.pages.stats.asset_statistics.by_attribute'),
            data: statsAssets.by_attribute,
            dataKey: "count_assets",
            labelKey: "key",
            filterLabel: __('dashboard.pages.filters.label.filter'),
            selectItems: statsAssets.by_attribute.map(a => ({ id: a.key, label: a.key }))
        }
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4">
            {sections.map((section, index) => {
                const filters = chartFilters[index];

                const displayData = section.data
                    .filter(item => {
                        const idToCheck = 'id' in item ? item.id.toString() : item.key;
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
                                <div className="relative flex h-[200px] w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-muted/20 bg-muted/5">
                                    <div className="absolute flex flex-col items-center gap-1">
                                        <BarChart3 className="size-8 text-muted-foreground/20" />
                                        <p className="text-xs font-medium text-muted-foreground/40">
                                            {__('dashboard.pages.stats.no_data')}
                                        </p>
                                    </div>
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