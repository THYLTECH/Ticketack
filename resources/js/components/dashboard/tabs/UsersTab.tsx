
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { StatsBarChart } from '@/components/dashboard/StatsBarChart';
import MultiSelectAvatars from '@/components/ui/MultiSelectAvatars';
import { useTrans } from '@/lib/translation';
import { ChartConfig } from '@/components/ui/chart';

interface Avatar {
    id: number;
    url: string;
    file_name: string;
    file_path: string;
    file_extension: string;
    file_size: number;
    mime_type: string;
    created_at: string;
    updated_at: string;
    description: string | null;
    title: string | null;
}

interface UsersTabProps {
    statsUsers: {
        by_assigned: {
            avatar: Avatar;
            id: number;
            name: string;
            tickets_count: number;
        }[];
        by_created: {
            avatar: Avatar;
            id: number;
            name: string;
            tickets_count: number;
        }[];
        by_resolved: {
            avatar: Avatar;
            id: number;
            name: string;
            tickets_count: number;
        }[];
        by_time: {
            id: number; 
            name: string; 
            avg_resolution_time: number;
        }[];
    };
    users: {
        id: number;
        name: string;
        avatar: Avatar;
        attachment_avatar: number;
    }[];

    chartFilters: Record<number, { userIds: string[], limit: number }>;

    onFilterChange: (index: number, key: 'userIds' | 'limit', value: string[] | number) => void;

    chartConfig: ChartConfig;
}

export function UsersTab({ statsUsers, users, chartFilters, onFilterChange, chartConfig }: UsersTabProps) {
    const __ = useTrans();

    const sections = [
        { title: __('dashboard.pages.stats.user_statistics.assigned_tickets'), data: statsUsers.by_assigned, key: 'tickets_count' },
        { title: __('dashboard.pages.stats.user_statistics.created_tickets'), data: statsUsers.by_created, key: 'tickets_count' },
        { title: __('dashboard.pages.stats.user_statistics.resolved_tickets'), data: statsUsers.by_resolved, key: 'tickets_count' },
        { title: __('dashboard.pages.stats.user_statistics.time_to_resolve'), data: statsUsers.by_time, key: 'total_hours' },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-4">
            {sections.map((section, index) => {
                const filters = chartFilters[index];
                const activeIds = section.data.map(u => u.id.toString());
                const filteredUsers = users.filter(u => activeIds.includes(u.id.toString()));

                const displayData = section.data
                    .filter(u => filters.userIds.length === 0 || filters.userIds.includes(u.id.toString()))
                    .slice(0, filters.limit);

                return (
                    <Card key={index} className="relative">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{section.title}</CardTitle>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><Filter className="size-4 text-muted-foreground" /></Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-72 space-y-4" align="end">
                                    <MultiSelectAvatars
                                        users={filteredUsers}
                                        selectedIds={filters.userIds}
                                        onSelectionChange={(ids) => onFilterChange(index, 'userIds', ids)}
                                    />
                                    <div className="space-y-2">
                                        <Label className="text-xs">{__('dashboard.pages.filters.label.limit')}</Label>
                                        <Input type="number" value={filters.limit} onChange={(e) => onFilterChange(index, 'limit', parseInt(e.target.value) || 1)} />
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </CardHeader>
                        <CardContent>
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
                                <StatsBarChart data={displayData} dataKey={section.key} labelKey="name" config={chartConfig} />
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};