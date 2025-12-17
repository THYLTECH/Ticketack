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

// Types
import { type BreadcrumbItem } from '@/types';

// Icons
import { LayoutDashboard, Ticket, Users, Box } from 'lucide-react';

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
        // ... ajoute les autres si besoin
    };
}
export default function Dashboard({ statsGlobales, statsTickets }: DashboardProps) {
    const __ = useTrans();
    console.log('Statistiques Globales:', statsGlobales);
    console.log('Statistiques Tickets:', statsTickets);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('dashboard.pages.breadcrumbs.dashboard'),
            href: route('dashboard'),
        },
    ];

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
                                <div className="p-10 border-2 border-dashed rounded-xl text-center text-muted-foreground">
                                    TODO
                                </div>
                            </TabsContent>
                            {/* Ticket Stats */}
                            <TabsContent value="tickets" className="space-y-4 pt-4">
                                <div className="p-10 border-2 border-dashed rounded-xl text-center text-muted-foreground">
                                    TODO
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