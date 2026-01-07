import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app/layout';

import { TicketTable } from '@/components/tickets/ticket-table';
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

import { useTrans } from '@/lib/translation';
import { type BreadcrumbItem, SharedData, Ticket } from '@/types';
import { userHasPermission } from '@/lib/utils';

import { Ticket as TicketIcon, Clock, CheckCircle2, LayoutDashboard } from 'lucide-react';

interface PaginatedData<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
}

interface HomeProps {
    userTickets: {
        open: PaginatedData<Ticket>;
        closed: PaginatedData<Ticket>;
    };
    assignedTickets: {
        open: PaginatedData<Ticket>;
        closed: PaginatedData<Ticket>;
    };
}

export default function Home({ userTickets, assignedTickets }: HomeProps) {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;

    const canSeeAssigned = userHasPermission({ 
        user: auth.user, 
        permission: 'be assigned tickets' 
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

            <Card>
                <CardHeader>
                    <CardTitle>{__('home.pages.breadcrumbs.home')}</CardTitle>
                    <CardDescription>
                        {__('home.pages.description', undefined, { name: auth.user.name })}
                    </CardDescription>
                </CardHeader>
                <Separator />
                
                <CardContent className="pt-6">
                    <Tabs defaultValue="my_tickets" className="w-full space-y-6">
                        <TabsList className={`grid w-full ${canSeeAssigned ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            <TabsTrigger value="my_tickets">
                                <TicketIcon className="mr-2 h-4 w-4" />
                                {__('home.sections.my_tickets')}
                            </TabsTrigger>
                            {canSeeAssigned && (
                                <TabsTrigger value="assigned_tickets">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    {__('home.sections.assigned_tickets')}
                                </TabsTrigger>
                            )}
                        </TabsList>

                        <TabsContent value="my_tickets" className="space-y-6 border-none p-0 outline-none">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="flex flex-col space-y-4">
                                    <div className="flex items-center gap-2 px-1">
                                        <Clock className="h-4 w-4 text-orange-500" />
                                        <h3 className="text-sm font-semibold">{__('home.tabs.unresolved')}</h3>
                                    </div>
                                    <Card className="h-full flex flex-col overflow-hidden">
                                        <CardContent className="p-0 flex-1">
                                            <TicketTable 
                                                data={userTickets.open} 
                                                emptyMessage={__('home.messages.no_open_tickets')} 
                                            />
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="flex flex-col space-y-4">
                                    <div className="flex items-center gap-2 px-1">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <h3 className="text-sm font-semibold">{__('home.tabs.closed_30_days')}</h3>
                                    </div>
                                    <Card className="h-full flex flex-col overflow-hidden">
                                        <CardContent className="p-0 flex-1">
                                            <TicketTable 
                                                data={userTickets.closed}
                                                emptyMessage={__('home.messages.no_recent_closed_tickets')}
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        {canSeeAssigned && (
                            <TabsContent value="assigned_tickets" className="space-y-6 border-none p-0 outline-none">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="flex flex-col space-y-4">
                                        <div className="flex items-center gap-2 px-1">
                                            <Clock className="h-4 w-4 text-orange-500" />
                                            <h3 className="text-sm font-semibold text-primary">{__('home.tabs.assigned_unresolved')}</h3>
                                        </div>
                                        <Card className="h-full flex flex-col overflow-hidden">
                                            <CardContent className="p-0 flex-1">
                                                <TicketTable data={assignedTickets.open} showAuthor={true}
                                                emptyMessage={__('home.messages.no_open_tickets')} />
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="flex flex-col space-y-4">
                                        <div className="flex items-center gap-2 px-1">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            <h3 className="text-sm font-semibold text-primary">{__('home.tabs.assigned_closed_30_days')}</h3>
                                        </div>
                                        <Card className="h-full flex flex-col overflow-hidden">
                                            <CardContent className="p-0 flex-1">
                                                <TicketTable data={assignedTickets.closed} 
                                                showAuthor={true} 
                                                emptyMessage={__('home.messages.no_recent_closed_tickets')} />
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>
                        )}
                    </Tabs>
                </CardContent>
            </Card>
        </AppLayout>
    );
}