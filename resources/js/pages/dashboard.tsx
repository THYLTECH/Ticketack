// resources/js/pages/dashboard.tsx

// Necessary imports
import { Head } from '@inertiajs/react';

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
import { Bar, BarChart, CartesianGrid, Cell, Label, Pie, PieChart, XAxis, YAxis } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartConfig,

} from '@/components/ui/chart';

// Types
import { type BreadcrumbItem } from '@/types';

// Icons
import { LayoutDashboard, Ticket, Users, Box, Clock } from 'lucide-react';
import { stat } from 'fs';

//Interface
interface DashboardProps {
    statsGlobales: {
        total_assets: number;
        total_users: number;
        avg_resolution_time: number;
    };
    statsTickets: {
        total: number;
        by_status: Array<{ title: string; tickets_count: number; color: string }>;
        by_category: Array<{ title: string; tickets_count: number; color: string }>;
        by_priority: Array<{ title: string; tickets_count: number; color: string }>;
    };
    statsAssets: {
        by_asset: Array<{ id: number; title: string; description: string; icon: string; tickets_count: number; }>;
    };
    statsUsers: {
        by_assigned: Array<{ id: number; name: string; tickets_count: number; }>;
        by_created: Array<{ id: number; name: string; tickets_count: number; }>;
        by_resolved: Array<{ id: number; name: string; tickets_count: number; }>;
        by_time_to_resolve: Array<{ id: number; name: string; avg_resolution_time: number; }>;
    };
}
export default function Dashboard({ statsGlobales, statsTickets, statsAssets, statsUsers }: DashboardProps) {
    const __ = useTrans();
    //console.log('Statistiques Globales:', statsGlobales);
    //console.log('Statistiques Tickets:', statsTickets);
    //console.log('Statistiques Assets:', statsAssets);
    console.log('Statistiques Users:', statsUsers);

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('dashboard.pages.breadcrumbs.dashboard')} />

            <div className="p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>{__('dashboard.pages.breadcrumbs.dashboard')}</CardTitle>
                        <CardDescription>
                            {__('dashboard.pages.description')}
                        </CardDescription>
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
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-2 border-dashed rounded-xl text-center text-muted-foreground">
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
                            </TabsContent>
                            {/* Ticket Stats */}
                            <TabsContent value="tickets" className="space-y-4 pt-4">
                                <div className="p-10 border-2 border-dashed rounded-xl text-center text-muted-foreground">
                                    {/* Card for total tickets */}
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
                                        {[
                                            { label: __('dashboard.pages.stats.ticket_statistics.by_status'), stats: statsTickets.by_status },
                                            { label: __('dashboard.pages.stats.ticket_statistics.by_priority'), stats: statsTickets.by_priority },
                                            { label: __('dashboard.pages.stats.ticket_statistics.by_category'), stats: statsTickets.by_category },
                                        ].map((item, index) => (
                                            <Card key={index} className="p-4">
                                                <CardHeader className="p-0 pb-4 text-center">
                                                    <CardTitle className="text-sm font-semibold uppercase tracking-tight text-muted-foreground">
                                                        {item.label}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="h-[250px] flex items-center justify-center">
                                                    <ChartContainer
                                                        config={{}}
                                                        className="mx-auto w-full aspect-square min-h-[250px] max-h-[300px]"
                                                    >
                                                        <PieChart>
                                                            <ChartTooltip
                                                                cursor={false}
                                                                content={<ChartTooltipContent hideLabel />}
                                                            />
                                                            <Pie
                                                                data={item.stats}
                                                                dataKey="tickets_count"
                                                                nameKey="title"
                                                                innerRadius={60}
                                                                outerRadius={80}
                                                                paddingAngle={5}
                                                                cornerRadius={5}
                                                                stroke="none"
                                                                label
                                                                fontSize={20}
                                                            >
                                                                {item.stats.map((entry, index) => (
                                                                    <Cell
                                                                        key={`cell-${index}`}
                                                                        fill={entry.color || "var(--chart-1)"}
                                                                        className="hover:opacity-80 transition-opacity"
                                                                    />
                                                                ))}
                                                                <Label
                                                                    content={({ viewBox }) => {
                                                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                                            return (
                                                                                <text
                                                                                    x={viewBox.cx}
                                                                                    y={viewBox.cy}
                                                                                    textAnchor="middle"
                                                                                    dominantBaseline="middle"
                                                                                >
                                                                                    <tspan
                                                                                        x={viewBox.cx}
                                                                                        y={viewBox.cy}
                                                                                        className="fill-foreground text-3xl font-bold"
                                                                                    >
                                                                                        {statsTickets.total.toLocaleString()}
                                                                                    </tspan>
                                                                                    <tspan
                                                                                        x={viewBox.cx}
                                                                                        y={(viewBox.cy || 0) + 24}
                                                                                        className="fill-muted-foreground text-xs uppercase"
                                                                                    >
                                                                                        Tickets
                                                                                    </tspan>
                                                                                </text>
                                                                            )
                                                                        }
                                                                    }}
                                                                />
                                                            </Pie>
                                                        </PieChart>
                                                    </ChartContainer>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>
                            {/* User Stats */}
                            <TabsContent value="users" className="space-y-4 pt-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 p-8 border-2 border-dashed rounded-xl text-center text-muted-foreground">
                                    {/*Number of tickets assigned to solvers*/}
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                {__('dashboard.pages.stats.user_statistics.assigned_tickets')}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ChartContainer config={ChartConfig} className="h-[200px] w-full">
                                                <BarChart
                                                    data={statsUsers.by_assigned}
                                                    layout="horizontal"
                                                    margin={{ left: 40, right: 20 }}
                                                >
                                                    <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                                                    <XAxis
                                                        dataKey="name"
                                                        type="category"
                                                        tickLine={false}
                                                        axisLine={true}

                                                    />
                                                    <YAxis
                                                        type="number" hide
                                                    />
                                                    <ChartTooltip
                                                        cursor={false}
                                                        content={<ChartTooltipContent hideIndicator />}
                                                    />
                                                    <Bar
                                                        dataKey="tickets_count"
                                                        fill="var(--primary)"
                                                        radius={[0, 4, 4, 0]}
                                                        barSize={20}
                                                    />
                                                </BarChart>
                                            </ChartContainer>
                                        </CardContent>
                                    </Card>

                                    {/* Number of Created Tickets by user*/}
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                {__('dashboard.pages.stats.user_statistics.created_tickets')}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ChartContainer config={ChartConfig} className="h-[200px] w-full">
                                                <BarChart
                                                    data={statsUsers.by_created}
                                                    layout="horizontal"
                                                    margin={{ left: 40, right: 20 }}
                                                >
                                                    <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                                                    <XAxis
                                                        dataKey="name"
                                                        type="category"
                                                        tickLine={false}
                                                        axisLine={true}
                                                    />
                                                    <YAxis
                                                        type="number" hide
                                                    />
                                                    <ChartTooltip
                                                        cursor={false}
                                                        content={<ChartTooltipContent hideIndicator />}
                                                    />
                                                    <Bar
                                                        dataKey="tickets_count"
                                                        fill="var(--primary)"
                                                        radius={[0, 4, 4, 0]}
                                                        barSize={20}
                                                    />
                                                </BarChart>
                                            </ChartContainer>
                                        </CardContent>
                                    </Card>

                                    {/* Number of Resolved Tickets by assigned user*/}
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                {__('dashboard.pages.stats.user_statistics.resolved_tickets')}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ChartContainer config={ChartConfig} className="h-[200px] w-full">
                                                <BarChart
                                                    data={statsUsers.by_resolved}
                                                    layout="horizontal"
                                                    margin={{ left: 40, right: 20 }}
                                                >
                                                    <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                                                    <XAxis
                                                        dataKey="name"
                                                        type="category"
                                                        tickLine={false}
                                                        axisLine={true}
                                                    />
                                                    <YAxis
                                                        type="number" hide
                                                    />
                                                    <ChartTooltip
                                                        cursor={false}
                                                        content={<ChartTooltipContent hideIndicator />}
                                                    />
                                                    <Bar
                                                        dataKey="tickets_count"
                                                        fill="var(--primary)"
                                                        radius={[0, 4, 4, 0]}
                                                        barSize={20}
                                                    />
                                                </BarChart>
                                            </ChartContainer>
                                        </CardContent>
                                    </Card>

                                    {/* Total Time Spent of Resolving by solver*/}
                                    {/* TODO */}
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                {__('dashboard.pages.stats.user_statistics.time_to_resolve')}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ChartContainer config={ChartConfig} className="h-[200px] w-full">
                                                <BarChart
                                                    data={statsUsers.by_time_to_resolve}
                                                    layout="horizontal"
                                                    margin={{ left: 40, right: 20 }}
                                                >
                                                    <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                                                    <XAxis
                                                        dataKey="name"
                                                        type="category"
                                                        tickLine={false}
                                                        axisLine={true}
                                                    />
                                                    <YAxis
                                                        type="number" hide
                                                    />
                                                    <ChartTooltip
                                                        cursor={false}
                                                        content={<ChartTooltipContent hideIndicator />}
                                                    />
                                                    <Bar
                                                        dataKey="tickets_count"
                                                        fill="var(--primary)"
                                                        radius={[0, 4, 4, 0]}
                                                        barSize={20}
                                                    />
                                                </BarChart>
                                            </ChartContainer>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                            {/* Asset Stats */}
                            <TabsContent value="assets" className="space-y-4 pt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{__('dashboard.pages.tabs.asset_statistics')}</CardTitle>
                                        <CardDescription>
                                            {__('dashboard.pages.stats.asset_statistics.description')}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="min-h-[400px]">
                                        <ChartContainer config={ChartConfig} className="h-[400px] w-full">
                                            <BarChart
                                                data={statsAssets.by_asset}
                                                layout="vertical"
                                                margin={{ left: 40, right: 20 }}
                                            >
                                                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                                                <XAxis type="number" hide />
                                                <YAxis
                                                    dataKey="title"
                                                    type="category"
                                                    tickLine={false}
                                                    axisLine={true}
                                                    width={150}
                                                />
                                                <ChartTooltip
                                                    cursor={false}
                                                    content={<ChartTooltipContent hideIndicator />}
                                                />
                                                <Bar
                                                    dataKey="tickets_count"
                                                    fill="var(--primary)"
                                                    radius={[0, 4, 4, 0]}
                                                    barSize={32}
                                                />
                                            </BarChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}