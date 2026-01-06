import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app/layout';
import { useTrans } from '@/lib/translation';
import { userHasPermission } from '@/lib/utils';
import { LogsTab } from '@/pages/tickets/tabs/logs-tab';
import {
    BreadcrumbItem,
    SharedData,
    Ticket,
    TicketSchedule,
    User,
} from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    File,
    FileDown,
    Logs,
    MessageCircle,
    Pencil,
} from 'lucide-react';
import { CalendarTab } from './tabs/calendar-tab';
import { CommentsTab } from './tabs/comments-tab';
import { InformationsTab } from './tabs/informations-tab';

interface SimilarTicket {
    id: number;
    title: string;
    similarity: number;
}

interface ShowProps {
    ticket: Ticket;
    events: TicketSchedule[];
    solvers: User[];
    similar_tickets?: SimilarTicket[];
}

export default function Show({
    ticket,
    events,
    solvers,
    similar_tickets = [],
}: ShowProps) {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('dashboard.pages.breadcrumbs.dashboard'),
            href: route('dashboard'),
        },
        {
            title: __('tickets.pages.breadcrumbs.index'),
            href: route('tickets.index'),
        },
        {
            title: `#${ticket.id} - ${ticket.title}`,
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={`${__('tickets.pages.show.head_title')} #${ticket.id}`}
            />

            <div className="container mx-auto max-w-[1600px] space-y-5 px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            {`#${ticket.id} - ${ticket.title}`}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {__('tickets.pages.show.description')}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                            <a href={route('tickets.pdf', ticket.id)}>
                                <FileDown className="mr-2 h-4 w-4" />
                                {__('tickets.pages.show.actions.pdf')}
                            </a>
                        </Button>

                        {userHasPermission({
                            user: auth.user,
                            permission: 'update tickets',
                        }) && (
                            <Button asChild size="sm" variant="outline">
                                <Link href={route('tickets.edit', ticket.id)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    {__('tickets.pages.form.buttons.edit')}
                                </Link>
                            </Button>
                        )}

                        <Button asChild variant="secondary" size="sm">
                            <Link href={route('tickets.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {__('tickets.pages.form.buttons.back')}
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    <Tabs
                        defaultValue="informations"
                        className="w-full space-y-6"
                    >
                        <TabsList className="grid w-full grid-cols-4 bg-muted/80 p-1">
                            <TabsTrigger value="informations" className="gap-2">
                                <File className="h-4 w-4" />
                                <span className="hidden lg:inline">
                                    {__('tickets.pages.show.tabs.info')}
                                </span>
                            </TabsTrigger>
                            <TabsTrigger value="comments" className="gap-2">
                                <MessageCircle className="h-4 w-4" />
                                <span className="hidden lg:inline">
                                    {__('tickets.pages.show.tabs.comments')}
                                </span>
                            </TabsTrigger>
                            <TabsTrigger value="calendar" className="gap-2">
                                <Calendar className="h-4 w-4" />
                                <span className="hidden lg:inline">
                                    {__('tickets.pages.show.tabs.calendar')}
                                </span>
                            </TabsTrigger>
                            <TabsTrigger value="logs" className="gap-2">
                                <Logs className="h-4 w-4" />
                                <span className="hidden lg:inline">
                                    {__('tickets.pages.show.tabs.logs')}
                                </span>
                            </TabsTrigger>
                        </TabsList>

                        <div className="min-h-[400px]">
                            <InformationsTab
                                ticket={ticket}
                                similarTickets={similar_tickets}
                            />
                            <CommentsTab ticket={ticket} />
                            <CalendarTab
                                ticket={ticket}
                                events={events}
                                solvers={solvers}
                            />
                            <LogsTab logs={ticket.logs} />
                        </div>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}
