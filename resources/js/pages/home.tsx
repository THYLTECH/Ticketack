// resources/js/pages/home.tsx

// Necessary imports
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app/layout';

// Components
import { TicketTable } from '@/components/tickets/ticket-table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

// Hooks & Utils
import { useTrans } from '@/lib/translation';
import { type BreadcrumbItem, SharedData, Ticket } from '@/types';
import { userHasPermission } from '@/lib/utils';

// Icons
import { Ticket as TicketIcon, Clock, CheckCircle2, LayoutDashboard } from 'lucide-react';

interface HomeProps {
    userTickets: {
        open: Ticket[];
        closed: Ticket[];
    };
    assignedTickets: {
        open: Ticket[];
        closed: Ticket[];
    };
}

export default function Home({ userTickets, assignedTickets }: HomeProps) {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;

    const isSolverOrAdmin = userHasPermission({ 
        user: auth.user, 
        permission: 'view tickets' 
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { 
            title: __('app.layout.sidebar.menugroups.platform.items.home'), 
            href: route('home') 
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('app.layout.sidebar.menugroups.platform.items.home')} />

            <div className="p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>{__('home.pages.breadcrumbs.home')}</CardTitle>
                        <CardDescription>
                            {__('home.pages.description')}
                        </CardDescription>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-6">
                        <Tabs defaultValue="my_tickets" className="w-full space-y-6">
                            {/* Onglets */}
                            {isSolverOrAdmin && (
                                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                                    <TabsTrigger value="my_tickets">
                                        <TicketIcon className="mr-2 h-4 w-4" />
                                        {__('home.sections.my_tickets')}
                                    </TabsTrigger>
                                    <TabsTrigger value="assigned_tickets">
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        {__('home.sections.assigned_tickets')}
                                    </TabsTrigger>
                                </TabsList>
                            )}

                            {/* Mes Tickets */}
                            <TabsContent value="my_tickets" className="space-y-6 border-none p-0 outline-none">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                                    {/* En cours */}
                                    <Card className="shadow-sm">
                                        <CardHeader>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-5 w-5 text-orange-500" />
                                                <CardTitle>{__('home.tabs.unresolved')}</CardTitle>
                                            </div>
                                            <CardDescription>
                                                {__('home.descriptions.my_open_tickets')}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <TicketTable 
                                                tickets={userTickets.open} 
                                                emptyMessage={__('home.messages.no_open_tickets')}
                                            />
                                        </CardContent>
                                    </Card>

                                    {/* Clos */}
                                    <Card className="shadow-sm">
                                        <CardHeader>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                <CardTitle>{__('home.tabs.closed_30_days')}</CardTitle>
                                            </div>
                                            <CardDescription>
                                                {__('home.descriptions.my_closed_tickets')}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <TicketTable 
                                                tickets={userTickets.closed} 
                                                emptyMessage={__('home.messages.no_recent_closed_tickets')}
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            {/* Tickets Attribués */}
                            {isSolverOrAdmin && (
                                <TabsContent value="assigned_tickets" className="space-y-6 border-none p-0 outline-none">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                                        <Card className="shadow-sm border-primary/20">
                                            <CardHeader>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-5 w-5 text-primary" />
                                                    <CardTitle className="text-primary">{__('home.tabs.assigned_unresolved')}</CardTitle>
                                                </div>
                                                <CardDescription>
                                                    {__('home.descriptions.assigned_open_tickets')}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <TicketTable tickets={assignedTickets.open} showAuthor={true} />
                                            </CardContent>
                                        </Card>

                                        <Card className="shadow-sm border-primary/20">
                                            <CardHeader>
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                                    <CardTitle className="text-primary">{__('home.tabs.assigned_closed_30_days')}</CardTitle>
                                                </div>
                                                <CardDescription>
                                                    {__('home.descriptions.assigned_closed_tickets')}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <TicketTable tickets={assignedTickets.closed} showAuthor={true} />
                                            </CardContent>
                                        </Card>
                                    </div>
                                </TabsContent>
                            )}
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}