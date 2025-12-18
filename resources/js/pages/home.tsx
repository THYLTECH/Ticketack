// resources/js/pages/home.tsx

// Necessary imports
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app/layout'; 

// Components
import { TicketTable } from '@/components/tickets/ticket-table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Hooks & Utils
import { useTrans } from '@/lib/translation';
import { type BreadcrumbItem, SharedData, Ticket } from '@/types';
import { userHasPermission } from '@/lib/utils';

// Icons (en accord avec votre dashboard)
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

    // Définition si l'utilisateur a accès aux fonctions de solveur/admin
    const isSolverOrAdmin = userHasPermission({ 
        user: auth.user, 
        permission: 'view tickets' 
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: __('app.layout.sidebar.menugroups.platform.items.home'), href: route('home') }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('app.layout.sidebar.menugroups.platform.items.home')} />

            <div className="flex flex-col gap-6">
                {/* Header de la page style Dashboard */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight">
                            {__('app.layout.sidebar.menugroups.platform.items.home')}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            {__('home.welcome_message')}
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="my_tickets" className="w-full space-y-6">
                    {/* Liste des onglets uniquement si solveur/admin */}
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

                    {/* CONTENU : MES TICKETS */}
                    <TabsContent value="my_tickets" className="space-y-6 border-none p-0 outline-none">
                        <div className="grid gap-6">
                            {/* Card Tickets en cours */}
                            <Card className="shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg font-bold flex items-center">
                                            <Clock className="mr-2 h-5 w-5 text-orange-500" />
                                            {__('home.tabs.unresolved')}
                                        </CardTitle>
                                        <CardDescription>
                                            {__('home.descriptions.my_open_tickets')}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <TicketTable 
                                        tickets={userTickets.open} 
                                        emptyMessage={__('home.messages.no_open_tickets')}
                                    />
                                </CardContent>
                            </Card>

                            {/* Card Tickets clos (30 jours) */}
                            <Card className="shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg font-bold flex items-center">
                                            <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                                            {__('home.tabs.closed_30_days')}
                                        </CardTitle>
                                        <CardDescription>
                                            {__('home.descriptions.my_closed_tickets')}
                                        </CardDescription>
                                    </div>
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

                    {/* CONTENU : TICKETS ATTRIBUÉS (Si solveur/admin) */}
                    {isSolverOrAdmin && (
                        <TabsContent value="assigned_tickets" className="space-y-6 border-none p-0 outline-none">
                            <div className="grid gap-6">
                                {/* Card Tickets attribués en cours */}
                                <Card className="shadow-sm border-primary/20">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg font-bold flex items-center text-primary">
                                                <Clock className="mr-2 h-5 w-5" />
                                                {__('home.tabs.assigned_unresolved')}
                                            </CardTitle>
                                            <CardDescription>
                                                {__('home.descriptions.assigned_open_tickets')}
                                            </CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <TicketTable 
                                            tickets={assignedTickets.open} 
                                            showAuthor={true}
                                            emptyMessage={__('home.messages.no_assigned_tickets')}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Card Tickets attribués clos (30 jours) */}
                                <Card className="shadow-sm border-primary/20">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg font-bold flex items-center text-primary">
                                                <CheckCircle2 className="mr-2 h-5 w-5" />
                                                {__('home.tabs.assigned_closed_30_days')}
                                            </CardTitle>
                                            <CardDescription>
                                                {__('home.descriptions.assigned_closed_tickets')}
                                            </CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <TicketTable 
                                            tickets={assignedTickets.closed} 
                                            showAuthor={true}
                                            emptyMessage={__('home.messages.no_assigned_closed_tickets')}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    )}
                </Tabs>
            </div>
        </AppLayout>
    );
}