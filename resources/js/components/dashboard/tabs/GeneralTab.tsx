import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Box, Users, Clock } from 'lucide-react';
import { ActivityLineChart } from '@/components/dashboard/ActivityLineChart';
import { useTrans } from '@/lib/translation';
import { ChartConfig } from '@/components/ui/chart';

interface GeneralTabProps {
    stats: {
        total_assets: number;
        total_users: number;
        avg_resolution_time: number;
        activity: {
            created : number;
            date : string;
            resolved : number;
        }[];
    };
    chartConfig: ChartConfig;
}

export const GeneralTab = ({ stats, chartConfig }: GeneralTabProps) => {
    const __ = useTrans();

    const items = [
        { label: __('dashboard.pages.stats.global_statistics.total_assets'), value: stats.total_assets, icon: Box, color: "text-blue-500" },
        { label: __('dashboard.pages.stats.global_statistics.total_users'), value: stats.total_users, icon: Users, color: "text-green-500" },
        { label: __('dashboard.pages.stats.global_statistics.avg_resolution_time'), value: `${stats.avg_resolution_time}h`, icon: Clock, color: "text-orange-500" },
    ];

    return (
        <div className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {items.map((item, index) => (
                    <Card key={index} className="flex flex-col items-center justify-center p-6 text-center shadow-sm">
                        <CardHeader className="p-0 pb-4 w-full justify-center">
                            <item.icon className={`size-12 ${item.color}`} />
                        </CardHeader>
                        <CardContent className="p-0 space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{item.label}</p>
                            <div className="text-3xl font-bold text-foreground">{item.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Card className="p-6 w-full">
                <CardHeader className="px-0 pt-0">
                    <CardTitle>{__('dashboard.pages.stats.global_statistics.activity_title')}</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                    <ActivityLineChart
                        data={stats.activity}
                        labelKey="date"
                        config={chartConfig}
                        colors={["var(--primary)", "hsl(from var(--primary) calc(h + 180) s l)"]}
                    />
                </CardContent>
            </Card>
        </div>
    );
};