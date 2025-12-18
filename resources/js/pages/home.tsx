// resources/js/pages/home.tsx

import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app/layout';

// Composants de l'application
import { TicketTable } from '@/components/tickets/ticket-table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Hooks et Utilitaires
import { useTrans } from '@/lib/translation';
import { userHasPermission } from '@/lib/utils';
import { type BreadcrumbItem, SharedData, Ticket } from '@/types';

// Icônes
import { CheckCircle2, Clock, LayoutDashboard, Ticket as TicketIcon } from 'lucide-react';

// Interfaces pour la pagination Laravel
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

    // Vérification des permissions pour l'affichage des sections Solveur/Admin
    const isSolverOrAdmin = userHasPermission({
        user: auth.user,
        permission: 'view tickets',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('app.layout.sidebar.menugroups.platform.items.home'),
            href: route('home'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('app.layout.sidebar.menugroups.platform.items.home')} />

            {/* Carte principale reprenant la structure de Users Index */}
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
                        {/* Liste des onglets utilisant toute la largeur (sans max-width) */}
                        {isSolverOrAdmin && (
                            <TabsList className="grid w-full grid-cols-2">
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

                        {/* CONTENU : MES TICKETS (CRÉÉS) */}
                        <TabsContent value="my_tickets" className="space-y-6 border-none p-0 outline-none">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                                {/* Section : Tickets créés en cours */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 px-1">
                                        <Clock className="h-4 w-4 text-orange-500" />
                                        <h3 className="text-sm font-semibold">{__('home.tabs.unresolved')}</h3>
                                    </div>
                                    <Card>
                                        <CardContent className="p-0">
                                            <TicketTable
                                                data={userTickets.open}
                                                emptyMessage={__('home.messages.no_open_tickets')}
                                            />
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Section : Tickets créés clôturés */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 px-1">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <h3 className="text-sm font-semibold">{__('home.tabs.closed_30_days')}</h3>
                                    </div>
                                    <Card>
                                        <CardContent className="p-0">
                                            <TicketTable
                                                data={userTickets.closed}
                                                emptyMessage={__('home.messages.no_recent_closed_tickets')}
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        {/* CONTENU : TICKETS ATTRIBUÉS (POUR SOLVEURS/ADMINS) */}
                        {isSolverOrAdmin && (
                            <TabsContent value="assigned_tickets" className="space-y-6 border-none p-0 outline-none">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                                    {/* Section : Attribués à résoudre */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 px-1">
                                            <Clock className="h-4 w-4 text-orange-500" />
                                            <h3 className="text-sm font-semibold text-primary">
                                                {__('home.tabs.assigned_unresolved')}
                                            </h3>
                                        </div>
                                        <Card>
                                            <CardContent className="p-0">
                                                <TicketTable
                                                    data={assignedTickets.open}
                                                    showAuthor={true}
                                                    emptyMessage={__('home.messages.no_assigned_tickets')}
                                                />
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Section : Attribués résolus */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 px-1">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            <h3 className="text-sm font-semibold text-primary">
                                                {__('home.tabs.assigned_closed_30_days')}
                                            </h3>
                                        </div>
                                        <Card>
                                            <CardContent className="p-0">
                                                <TicketTable
                                                    data={assignedTickets.closed}
                                                    showAuthor={true}
                                                    emptyMessage={__('home.messages.no_assigned_closed_tickets')}
                                                />
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