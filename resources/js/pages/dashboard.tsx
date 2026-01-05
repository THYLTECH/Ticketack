// resources/js/pages/dashboard.tsx

// Necessary imports
import { Head, router } from '@inertiajs/react';

// Layout
import AppLayout from '@/layouts/app/layout';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Shadcn UI Components
import { Card,CardContent,CardDescription,CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Recharts Components
import {
    ChartConfig,
} from '@/components/ui/chart';

// Types
import { type BreadcrumbItem } from '@/types';

// Icons
import { LayoutDashboard, Ticket, Users, Box} from 'lucide-react';

import { DateRange } from 'react-day-picker';
import React from 'react';
import { format, parseISO } from 'date-fns';
import { DateRangeFilter } from '@/components/dashboard/DateRangeFilter';
import { GeneralTab } from '@/components/dashboard/tabs/GeneralTab';
import { TicketsTab } from '@/components/dashboard/tabs/TicketsTab';
import { UsersTab } from '@/components/dashboard/tabs/UsersTab';
import { AssetsTab } from '@/components/dashboard/tabs/AssetsTab';

//Interface
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

interface DashboardProps {
    statsGeneral: { 
        end_date: string;
        start_date: string;
        total_assets: number;
        total_users: number;
        avg_resolution_time: number;
        activity: {
            created : number;
            date : string;
            resolved : number;
        }[]
    };
    statsTickets: {
        total: number;
        by_status: { title: string; tickets_count: number; color: string }[];
        by_category: { title: string; tickets_count: number; color: string }[];
        by_priority: { title: string; tickets_count: number; color: string }[];
    };
    statsUsers: {
        by_assigned:{ id: number; name: string; tickets_count: number; avatar: Avatar; }[];
        by_created: { id: number; name: string; tickets_count: number; avatar: Avatar; }[];
        by_resolved:{ id: number; name: string; tickets_count: number;avatar: Avatar; }[];
        by_time: { id: number; name: string; avg_resolution_time: number; }[];
    };
    statsAssets: {
        by_asset: { id: number; title: string; description: string; icon: string; tickets_count: number; }[];
        by_attribute: { key: string; count: number }[];
    };

    users: {id: number, name: string, avatar: Avatar, attachment_avatar: number}[];
    filters: {start_date: string, end_date: string , users ?: string };
}

export default function Dashboard({ statsGeneral, statsTickets, statsAssets, statsUsers, users, filters }: DashboardProps) {
    const __ = useTrans();
    console.log(statsUsers);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('dashboard.pages.breadcrumbs.dashboard'),
            href: route('dashboard'),
        },
    ];

    const ChartConfig = {
        tickets_count: {
            label: __("dashboard.pages.stats.ticket_statistics.total_tickets"),
        },
        total_hours: {
            label: "Total hours", 
        },
        count_assets: {
            label: "Total assets", 
        },
    } satisfies ChartConfig;

    //State
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: filters.start_date ? parseISO(filters.start_date) : new Date(),
        to: filters.end_date ? parseISO(filters.end_date) : new Date(),
    });
    const [chartFilters, setChartFilters] = React.useState<Record<number, { userIds: string[], limit: number }>>({
        0: { userIds: [], limit: 5 },
        1: { userIds: [], limit: 5 },
        2: { userIds: [], limit: 5 },
        3: { userIds: [], limit: 5 },
    });
    const [assetChartFilters, setAssetChartFilters] = React.useState<Record<number, { selectedKeys: string[], limit: number }>>({
        0: { selectedKeys: [], limit: 5 },
        1: { selectedKeys: [], limit: 5 },
    });

    // Functions
    const updateFilters = (newDate?: DateRange) => {
        const startDate = newDate?.from ? format(newDate.from, "yyyy-MM-dd") : format(date?.from || new Date(), "yyyy-MM-dd");
        const endDate = newDate?.to ? format(newDate.to, "yyyy-MM-dd") : format(date?.to || new Date(), "yyyy-MM-dd");

        router.get(route('dashboard'), {
            start_date: startDate,
            end_date: endDate,
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['statsUsers', 'statsTickets', 'statsAssets', 'statsGeneral'],
        });
    };
    //Handle Functions
    const handleSelect = (range: DateRange | undefined) => {
        setDate(range);
        if (range?.from && range?.to) {
            updateFilters(range);
        }
    };

    const handleChartFilterChange = (index: number, key: 'userIds' | 'limit', value: string[] | number) => {
        setChartFilters(prev => ({
            ...prev,
            [index]: { ...prev[index], [key]: value }
        }));
    };

    const handleAssetFilterChange = (index: number, key: 'selectedKeys' | 'limit', value: string[] | number) => {
        setAssetChartFilters(prev => ({
            ...prev,
            [index]: { ...prev[index], [key]: value }
        }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('dashboard.pages.breadcrumbs.dashboard')} />
            <div className="p-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2">
                            <div className="grid gap-1">
                                <CardTitle className="text-2xl font-bold tracking-tight">
                                    {__('dashboard.pages.breadcrumbs.dashboard')}
                                </CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    {__('dashboard.pages.description')}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <Separator />
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap ml-10">
                            {__('dashboard.pages.filters.period')} :
                        </span>
                        <DateRangeFilter
                            date={date}
                            onSelect={handleSelect}
                            placeholder="Select a period"
                        />
                    </div>

                    <Separator />

                    <CardContent className="pt-6">
                        <Tabs defaultValue="global" className="w-full space-y-4">
                            <TabsList className="w-full justify-start overflow-x-auto">
                                <TabsTrigger value="global">
                                    <LayoutDashboard className="mr-2 size-4" />
                                    {__('dashboard.pages.tabs.global_statistics')}
                                </TabsTrigger>
                                <TabsTrigger value="tickets">
                                    <Ticket className="mr-2 size-4" />
                                    {__('dashboard.pages.tabs.ticket_statistics')}
                                </TabsTrigger>
                                <TabsTrigger value="users">
                                    <Users className="mr-2 size-4" />
                                    {__('dashboard.pages.tabs.user_statistics')}
                                </TabsTrigger>
                                <TabsTrigger value="assets">
                                    <Box className="mr-2 size-4" />
                                    {__('dashboard.pages.tabs.asset_statistics')}
                                </TabsTrigger>
                            </TabsList>

                            {/* Global Stats */}
                            <TabsContent value="global" className="space-y-4 pt-4">
                                <GeneralTab stats={statsGeneral} chartConfig={ChartConfig} />
                            </TabsContent>

                            {/* Ticket Stats */}
                            <TabsContent value="tickets" className="space-y-4 pt-4">
                                <TicketsTab statsTickets={statsTickets} />
                            </TabsContent>

                            {/* User Stats */}
                            <TabsContent value="users" className="space-y-4 pt-4">
                                <UsersTab
                                    statsUsers={statsUsers}
                                    users={users}
                                    chartFilters={chartFilters}
                                    onFilterChange={handleChartFilterChange}
                                    chartConfig={ChartConfig}
                                />
                            </TabsContent>

                            {/* Asset Stats */}
                            <TabsContent value="assets" className="space-y-4 pt-4">
                                <AssetsTab
                                    statsAssets={statsAssets}
                                    chartFilters={assetChartFilters}
                                    onFilterChange={handleAssetFilterChange}
                                    chartConfig={ChartConfig}
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div >
        </AppLayout >
    );

}