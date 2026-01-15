import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app/layout';

import { TicketTable } from '@/components/tickets/ticket-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useTrans } from '@/lib/translation';
import { type BreadcrumbItem, SharedData, Ticket } from '@/types';
import { userHasPermission } from '@/lib/utils';

import { Ticket as TicketIcon, Clock, CheckCircle2, LayoutDashboard } from 'lucide-react';

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    from: number | null;
    to: number | null;
    total: number;
    per_page: number;
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

            {/* Structure de conteneur identique à la page User (resources/js/pages/users/index.tsx) */}
            <div className="container mx-auto max-w-full space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                
                {/* En-tête de page sans Card, formaté comme sur la page User */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            {__('home.pages.breadcrumbs.home')}
                        </h2>
                        <p className="text-muted-foreground">
                            {__('home.pages.description', undefined, { name: auth.user.name })}
                        </p>
                    </div>
                </div>

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
                                {/* Le composant TicketTable est maintenant affiché directement (les Cards ont été retirées) */}
                                <TicketTable 
                                    data={userTickets.open} 
                                    emptyMessage={__('home.messages.no_open_tickets')} 
                                />
                            </div>

                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <h3 className="text-sm font-semibold">{__('home.tabs.closed_30_days')}</h3>
                                </div>
                                <TicketTable 
                                    data={userTickets.closed}
                                    emptyMessage={__('home.messages.no_recent_closed_tickets')}
                                />
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
                                    <TicketTable 
                                        data={assignedTickets.open} 
                                        showAuthor={true}
                                        emptyMessage={__('home.messages.no_open_tickets')} 
                                    />
                                </div>

                                <div className="flex flex-col space-y-4">
                                    <div className="flex items-center gap-2 px-1">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <h3 className="text-sm font-semibold text-primary">{__('home.tabs.assigned_closed_30_days')}</h3>
                                    </div>
                                    <TicketTable 
                                        data={assignedTickets.closed} 
                                        showAuthor={true} 
                                        emptyMessage={__('home.messages.no_recent_closed_tickets')} 
                                    />
                                </div>
                            </div>
                        </TabsContent>
                    )}
                </Tabs>
            </div>
        </AppLayout>
    );
}