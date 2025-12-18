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
import { Cell, Label, Pie, PieChart } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartConfig,

} from '@/components/ui/chart';

// Types
import { type BreadcrumbItem } from '@/types';

// Icons
import { LayoutDashboard, Ticket, Users, Box , Clock } from 'lucide-react';
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
    statsAssets?: {
        id : number;
        title : string;
        description : string;
        icon : string;
        total : number;
    };
}
export default function Dashboard({ statsGlobales, statsTickets, statsAssets }: DashboardProps) {
    const __ = useTrans();
    console.log('Statistiques Globales:', statsGlobales);
    console.log('Statistiques Tickets:', statsTickets);
    console.log('Statistiques Assets:', statsAssets);

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
            value: `${statsGlobales.avg_resolution_time}h`, // Ajout d'une unité si besoin
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
    
    const chartConfig = {
        tickets_count: {
            label: "Tickets Count",
            color: "var(--chart-1)", 
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
                                        { label: __('dashboard.pages.stats.ticket_statistics.by_status'), stats : statsTickets.by_status },
                                        { label: __('dashboard.pages.stats.ticket_statistics.by_priority'), stats: statsTickets.by_priority },
                                        { label: __('dashboard.pages.stats.ticket_statistics.by_category'), stats : statsTickets.by_category },
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
                                <div className="p-10 border-2 border-dashed rounded-xl text-center text-muted-foreground">
                                    {/* Do a bar graph */}
                                </div>
                            </TabsContent>
                            {/* Asset Stats */}
                            <TabsContent value="assets" className="space-y-4 pt-4">
                                <div className="p-10 border-2 border-dashed rounded-xl text-center text-muted-foreground">
                                    TODO
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}