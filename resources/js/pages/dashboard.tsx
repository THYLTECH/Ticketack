// resources/js/pages/dashboard.tsx

// Necessary imports
import { Head, router } from '@inertiajs/react';

// Layout
import AppLayout from '@/layouts/app/layout';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Shadcn UI Components
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Recharts Components
import {
    ChartConfig,
} from '@/components/ui/chart';

// Types
import { type BreadcrumbItem } from '@/types';

// Icons
import { LayoutDashboard, Ticket, Users, Box, Clock, BarChart3, Settings } from 'lucide-react';
import { StatsPieChart } from '@/components/dashboard/StatsPieChart';
import { StatsBarChart } from '@/components/dashboard/StatsBarChart';
import { ActivityLineChart } from '@/components/dashboard/ActivityLineChart';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import MultiSelectAvatars from '@/components/ui/MultiSelectAvatars';

//Interface
interface DashboardProps {
    statsGlobales: {
        end_date: any;
        start_date: any;
        total_assets: number;
        total_users: number;
        avg_resolution_time: number;
        activity: [any]
    };
    statsTickets: {
        total: number;
        by_status: Array<{ title: string; tickets_count: number; color: string }>;
        by_category: Array<{ title: string; tickets_count: number; color: string }>;
        by_priority: Array<{ title: string; tickets_count: number; color: string }>;
    };
    statsUsers: {
        by_assigned: Array<{ id: number; name: string; tickets_count: number; }>;
        by_created: Array<{ id: number; name: string; tickets_count: number; }>;
        by_resolved: Array<{ id: number; name: string; tickets_count: number; }>;
        by_time: Array<{ id: number; name: string; avg_resolution_time: number; }>;
    };
    statsAssets: {
        by_asset: Array<{ id: number; title: string; description: string; icon: string; tickets_count: number; }>;
        by_attribute: Array<{ key: string; count: number }>;
    };

    users: [
        {
            id: number
            name: string
            avatar: any[]
            attachment_avatar: number
        }
    ]
    filters: any
}

export default function Dashboard({ statsGlobales, statsTickets, statsAssets, statsUsers, users, filters }: DashboardProps) {
    const __ = useTrans();
    // console.log('Statistiques Globales:', statsGlobales);
    console.log('Statistiques Tickets:', statsTickets);
    // console.log('Statistiques Assets:', statsAssets);
    console.log('Statistiques Users:', statsUsers);
    // console.log('Users:', users);
    console.log('Filters:', filters);
    const globalStatsItems = [
        {
            label: __('dashboard.pages.stats.global_statistics.total_assets'),
            value: statsGlobales.total_assets,
            icon: Box,
            color: "text-blue-500"
        },
        {
            label: __('dashboard.pages.stats.global_statistics.total_users'),
            value: statsGlobales.total_users,
            icon: Users,
            color: "text-green-500"
        },
        {
            label: __('dashboard.pages.stats.global_statistics.avg_resolution_time'),
            value: `${statsGlobales.avg_resolution_time}h`,
            icon: Clock,
            color: "text-orange-500"
        },
    ];

    const userStatsItems = [
        {
            title: __('dashboard.pages.stats.user_statistics.assigned_tickets'),
            data: statsUsers.by_assigned,
        },
        {
            title: __('dashboard.pages.stats.user_statistics.created_tickets'),
            data: statsUsers.by_created,
        },
        {
            title: __('dashboard.pages.stats.user_statistics.resolved_tickets'),
            data: statsUsers.by_resolved,
        },
        {
            title: __('dashboard.pages.stats.user_statistics.time_to_resolve'),
            data: statsUsers.by_time,
        },
    ];

    const ticketStatsItems = [
        {
            label: __('dashboard.pages.stats.ticket_statistics.by_status'),
            indicator: __("dashboard.pages.stats.ticket_statistics.indicator.status"),
            stats: statsTickets.by_status,
            total: statsTickets.total
        },
        {
            label: __('dashboard.pages.stats.ticket_statistics.by_priority'),
            indicator: __("dashboard.pages.stats.ticket_statistics.indicator.priority"),
            stats: statsTickets.by_priority,
            total: statsTickets.total
        },
        {
            label: __('dashboard.pages.stats.ticket_statistics.by_category'),
            indicator: __("dashboard.pages.stats.ticket_statistics.indicator.category"),
            stats: statsTickets.by_category,
            total: statsTickets.total
        },
    ]

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
    } satisfies ChartConfig;

    //State
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: filters.start_date ? parseISO(filters.start_date) : new Date(),
        to: filters.end_date ? parseISO(filters.end_date) : new Date(),
    });

    const [selectedUserIds, setSelectedUserIds] = React.useState<string[]>(filters.user_ids || []);

    const updateFilters = (newDate?: DateRange, newUserIds?: string[]) => {
        const startDate = newDate?.from
            ? format(newDate.from, "yyyy-MM-dd")
            : (filters.start_date || format(date?.from || new Date(), "yyyy-MM-dd"));

        const endDate = newDate?.to
            ? format(newDate.to, "yyyy-MM-dd")
            : (filters.end_date || format(date?.to || new Date(), "yyyy-MM-dd"));

        const uIds = newUserIds !== undefined ? newUserIds : (filters.user_ids || []);

        router.get(route('dashboard'), {
            start_date: startDate,
            end_date: endDate,
            user_ids: uIds,
        }, {
            preserveState: true,
            replace: true,
        });
    };
    //Handle Function
    const handleSelect = (range: DateRange | undefined) => {
        setDate(range);
        if (range?.from && range?.to) {
            updateFilters(range,selectedUserIds);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('dashboard.pages.breadcrumbs.dashboard')} />
            <div className="p-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div className="grid gap-1">
                            <CardTitle>{__('dashboard.pages.breadcrumbs.dashboard')}</CardTitle>
                            <CardDescription>
                                {__('dashboard.pages.description')}
                            </CardDescription>
                        </div>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" title="Paramètres du tableau de bord">
                                    <Settings className="size-5" />
                                </Button>
                            </SheetTrigger>

                            <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col">
                                <SheetHeader className="text-left">
                                    <SheetTitle>{__('dashboard.pages.settings.title')}</SheetTitle>
                                    <SheetDescription>
                                        {__('dashboard.pages.settings.description')}
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="flex-1 overflow-y-auto py-6 space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex w-full items-center justify-center p-1 border rounded-lg bg-muted/30 shadow-sm">
                                            <Calendar
                                                mode="range"
                                                defaultMonth={date?.from}
                                                selected={date}
                                                onSelect={handleSelect}
                                                className="rounded-md flex justify-center bg-muted/1 shadow-sm "
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground text-center italic">
                                            {date?.from ? (
                                                date.to ? (
                                                    <>Données du <strong>{format(date.from, "dd/MM/yyyy")}</strong> au <strong>{format(date.to, "dd/MM/yyyy")}</strong></>
                                                ) : "Sélectionnez une date de fin"
                                            ) : "Sélectionnez une période"}
                                        </p>
                                    </div>
                                    <MultiSelectAvatars
                                        users={users}
                                        selectedIds={selectedUserIds}
                                        onSelectionChange={(ids) => {
                                            setSelectedUserIds(ids);
                                            updateFilters(undefined, ids);
                                        }}
                                    ></MultiSelectAvatars>
                                </div>
                                <div className="pt-4 border-t">
                                    <SheetTrigger asChild>
                                        <Button className="w-full">Appliquer les modifications</Button>
                                    </SheetTrigger>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </CardHeader>
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
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6text-center text-muted-foreground">
                                    {globalStatsItems.map((item, index) => (
                                        <Card key={index} className="flex flex-col items-center justify-center p-6 text-center shadow-sm">
                                            <CardHeader className="p-0 pb-4 w-full justify-center">
                                                <item.icon className={`size-12 ${item.color}`} />
                                            </CardHeader>
                                            <CardContent className="p-0 space-y-1">
                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    {item.label}
                                                </p>
                                                <div className="text-3xl font-bold text-foreground">
                                                    {item.value}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                                <Card className="p-6 w-full md:col-span-3">
                                    <CardHeader className="px-0 pt-0">
                                        <CardTitle>{__('dashboard.pages.stats.global_statistics.activity_title')}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-0 pb-0">
                                        <ActivityLineChart
                                            data={statsGlobales.activity}
                                            labelKey="date"
                                            config={ChartConfig}
                                            colors={["var(--primary)", "hsl(from var(--primary) calc(h + 180) s l)"]}
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            {/* Ticket Stats */}
                            <TabsContent value="tickets" className="space-y-4 pt-4">
                                <div className=" rounded-xl text-center text-muted-foreground">
                                    <Card className="flex flex-col items-center justify-center p-6 text-center shadow-sm mb-6">
                                        <CardHeader className="p-0 pb-2 w-full flex flex-row justify-center items-center">
                                            <Ticket className="size-10 text-primary" />
                                        </CardHeader>
                                        <CardContent className="p-0 flex flex-col items-center">
                                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                                {__('dashboard.pages.stats.ticket_statistics.total_tickets')}
                                            </p>
                                            <div className="text-4xl font-bold">
                                                {statsTickets.total}
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {ticketStatsItems.map((item) => (
                                            <StatsPieChart
                                                title={item.label}
                                                data={item.stats}
                                                total={item.total}
                                                key={item.label}
                                                indicator={item.indicator}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>
                            {/* User Stats */}
                            <TabsContent value="users" className="space-y-4 pt-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {userStatsItems.map((item, index) => (
                                        <Card key={index}>
                                            <CardHeader className="flex flex-row items-center justify-center pb-2">
                                                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                {item.data.length === 0 ? (
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
                                                        data={item.data}
                                                        dataKey={index === 3 ? 'avg_resolution_time' : 'tickets_count'}
                                                        labelKey="name"
                                                        config={ChartConfig}
                                                    />
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>
                            {/* Asset Stats */}
                            <TabsContent value="assets" className="space-y-4 pt-4">
                                <div className="text-muted-foreground flex flex-row flex-wrap justify-center gap-4">
                                    <Card className='flex-1 min-w-[250px]'>
                                        <CardHeader>
                                            <CardTitle>{__('dashboard.pages.tabs.asset_statistics')}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="min-h-[400px]">
                                            <StatsBarChart
                                                data={statsAssets.by_asset}
                                                dataKey="tickets_count"
                                                labelKey="title"
                                                config={ChartConfig}
                                                layout="vertical"
                                            />
                                        </CardContent>
                                    </Card>
                                    <Card className='flex-1 min-w-[250px]'>
                                        <CardHeader>
                                            <CardTitle className="text-sm font-medium">
                                                {__('dashboard.pages.stats.asset_statistics.by_attribute')}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <StatsBarChart
                                                data={statsAssets.by_attribute}
                                                dataKey="count"
                                                labelKey="key"
                                                config={ChartConfig}
                                                layout="vertical"
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );

}