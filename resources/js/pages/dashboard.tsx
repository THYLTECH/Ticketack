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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartConfig
} from '@/components/ui/chart';

// Types
import { type BreadcrumbItem } from '@/types';

// Icons
import { LayoutDashboard, Ticket, Users, Box , Clock } from 'lucide-react';

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
    };
}
export default function Dashboard({ statsGlobales, statsTickets }: DashboardProps) {
    const __ = useTrans();
    console.log('Statistiques Globales:', statsGlobales);
    console.log('Statistiques Tickets:', statsTickets);

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
            color: "var(--chart-1)", // Utilise la variable CSS de shadcn
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
                                    <ChartContainer config={chartConfig} className="min-h-[300px] w-full max-w-3xl mx-auto">
                                        <BarChart 
                                            // data={globalStatsData} 
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                                                <XAxis 
                                                    dataKey="label" 
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickMargin={10}
                                                />
                                                <YAxis hide />
                                                <ChartTooltip content={<ChartTooltipContent />} />
                                                <Bar 
                                                    dataKey="value" 
                                                    fill="var(--color-tickets_count)" 
                                                    radius={[4, 4, 0, 0]} 
                                                />
                                        </BarChart>
                                    </ChartContainer>
                                </div>
                            </TabsContent>
                            {/* User Stats */}
                            <TabsContent value="users" className="space-y-4 pt-4">
                                <div className="p-10 border-2 border-dashed rounded-xl text-center text-muted-foreground">
                                    TODO
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