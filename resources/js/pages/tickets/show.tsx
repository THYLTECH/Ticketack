import * as React from 'react';
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
    TicketCategory,
    TicketPriority,
    TicketSchedule,
    TicketStatus,
    User,
} from '@/types';
import { PageTutorial } from '@/components/onboarding';
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
    statuses: TicketStatus[];
    priorities: TicketPriority[];
    categories: TicketCategory[];
}

export default function Show({
    ticket,
    events,
    solvers,
    similar_tickets = [],
    statuses,
    priorities,
    categories,
}: ShowProps) {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;
    const [currentTab, setCurrentTab] = React.useState('informations');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('home.pages.breadcrumbs.home'),
            href: route('home'),
        },
        {
            title: ticket.archived_at
                ? __('tickets.pages.index.buttons.archived')
                : __('tickets.pages.breadcrumbs.index'),
            href: ticket.archived_at
                ? route('tickets.archived')
                : route('tickets.index'),
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

            <div className="container mx-auto max-w-full space-y-5 px-4 py-8 sm:px-6 lg:px-8">
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
                        }) && !ticket.archived_at && (
                                <Button asChild size="sm" variant="outline">
                                    <Link href={route('tickets.edit', ticket.id)}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        {__('tickets.pages.form.buttons.edit')}
                                    </Link>
                                </Button>
                            )}

                        <Button asChild variant="secondary" size="sm">
                            <Link
                                href={
                                    ticket.archived_at
                                        ? route('tickets.archived')
                                        : route('tickets.index')
                                }
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {__('tickets.pages.form.buttons.back')}
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    <Tabs
                        value={currentTab}
                        onValueChange={setCurrentTab}
                        className="w-full space-y-6"
                    >
                        <TabsList className="grid w-full grid-cols-4 bg-muted/80 p-1">
                            <TabsTrigger value="informations" className="gap-2" data-onboarding-trigger="informations">
                                <File className="h-4 w-4" />
                                <span className="hidden lg:inline">
                                    {__('tickets.pages.show.tabs.info')}
                                </span>
                            </TabsTrigger>
                            <TabsTrigger value="comments" className="gap-2" data-onboarding-trigger="comments">
                                <MessageCircle className="h-4 w-4" />
                                <span className="hidden lg:inline">
                                    {__('tickets.pages.show.tabs.comments')}
                                </span>
                            </TabsTrigger>
                            <TabsTrigger value="calendar" className="gap-2" data-onboarding-trigger="calendar">
                                <Calendar className="h-4 w-4" />
                                <span className="hidden lg:inline">
                                    {__('tickets.pages.show.tabs.calendar')}
                                </span>
                            </TabsTrigger>
                            <TabsTrigger value="logs" className="gap-2" data-onboarding-trigger="logs">
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
                            <LogsTab
                                logs={ticket.logs}
                                statuses={statuses}
                                priorities={priorities}
                                categories={categories}
                                solvers={solvers}
                            />
                        </div>
                    </Tabs>
                </div>
            </div>
            <PageTutorial
                page="ticket_detail"
                steps={[
                    {
                        id: 'info',
                        title: __('onboarding.ticket_detail.info_tab.title'),
                        description: __('onboarding.ticket_detail.info_tab.description'),
                        targetSelector: '[data-onboarding-trigger="informations"]',
                        position: 'bottom',
                        onEnter: () => setCurrentTab('informations'),
                    },
                    {
                        id: 'properties',
                        title: __('onboarding.ticket_detail.properties.title'),
                        description: __('onboarding.ticket_detail.properties.description'),
                        targetSelector: '[data-onboarding="ticket-properties"]',
                        position: 'left',
                    },
                    {
                        id: 'comments',
                        title: __('onboarding.ticket_detail.comments_tab.title'),
                        description: __('onboarding.ticket_detail.comments_tab.description'),
                        targetSelector: '[data-onboarding="comments-area"]',
                        position: 'top',
                        onEnter: () => setCurrentTab('comments'),
                    },
                    {
                        id: 'calendar',
                        title: __('onboarding.ticket_detail.calendar_tab.title'),
                        description: __('onboarding.ticket_detail.calendar_tab.description'),
                        targetSelector: '[data-onboarding="planning-grid"]',
                        position: 'top',
                        onEnter: () => setCurrentTab('calendar'),
                    },
                    {
                        id: 'logs',
                        title: __('onboarding.ticket_detail.logs_tab.title'),
                        description: __('onboarding.ticket_detail.logs_tab.description'),
                        targetSelector: '[data-onboarding="logs-table"]',
                        position: 'top',
                        onEnter: () => setCurrentTab('logs'),
                    },
                ]}
            />
        </AppLayout >
    );
}
