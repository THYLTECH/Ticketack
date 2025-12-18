import AppLayout from '@/layouts/app/layout';
import { TicketTable } from '@/components/tickets/ticket-table';
import { Head, usePage } from '@inertiajs/react';
import { useTrans } from '@/lib/translation';
import { type BreadcrumbItem, SharedData, Ticket } from '@/types';
import { userHasPermission } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    console.log(userTickets);
    console.log(assignedTickets);

    const isSolverOrAdmin = userHasPermission({ 
        user: auth.user, 
        permission: 'view tickets' 
    }) && (assignedTickets.open.length > 0 || assignedTickets.closed.length > 0);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: __('app.layout.sidebar.menugroups.platform.items.home'), href: route('home') }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('app.layout.sidebar.menugroups.platform.items.home')} />

            <div className="flex flex-col gap-8">
                <section>
                    <h2 className="mb-4 text-2xl font-bold tracking-tight">{__('home.sections.my_tickets')}</h2>
                    <Tabs defaultValue="open" className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="open">{__('home.tabs.unresolved')} ({userTickets.open.length})</TabsTrigger>
                            <TabsTrigger value="closed">{__('home.tabs.closed_30_days')} ({userTickets.closed.length})</TabsTrigger>
                        </TabsList>
                        <TabsContent value="open">
                            <TicketTable tickets={userTickets.open} emptyMessage={__('home.messages.no_open_tickets')} />
                        </TabsContent>
                        <TabsContent value="closed">
                            <TicketTable tickets={userTickets.closed} emptyMessage={__('home.messages.no_recent_closed_tickets')} />
                        </TabsContent>
                    </Tabs>
                </section>

                {isSolverOrAdmin && (
                    <section>
                        <h2 className="mb-4 text-2xl font-bold tracking-tight text-primary">{__('home.sections.assigned_tickets')}</h2>
                        <Tabs defaultValue="assigned_open" className="w-full">
                            <TabsList className="mb-4">
                                <TabsTrigger value="assigned_open">{__('home.tabs.assigned_unresolved')} ({assignedTickets.open.length})</TabsTrigger>
                                <TabsTrigger value="assigned_closed">{__('home.tabs.assigned_closed_30_days')} ({assignedTickets.closed.length})</TabsTrigger>
                            </TabsList>
                            <TabsContent value="assigned_open">
                                <TicketTable tickets={assignedTickets.open} showAuthor={true} emptyMessage={__('home.messages.no_assigned_tickets')} />
                            </TabsContent>
                            <TabsContent value="assigned_closed">
                                <TicketTable tickets={assignedTickets.closed} showAuthor={true} emptyMessage={__('home.messages.no_assigned_closed_tickets')} />
                            </TabsContent>
                        </Tabs>
                    </section>
                )}
            </div>
        </AppLayout>
    );
}