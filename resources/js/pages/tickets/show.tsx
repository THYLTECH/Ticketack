import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupTextarea,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app/layout';
import {
    renderAsset,
    renderTicketCategory,
    renderTicketPriority,
    renderTicketStatus,
} from '@/lib/render';
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import {
    BreadcrumbItem,
    SharedData,
    Ticket,
    TicketSchedule,
    User,
} from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    format,
    parseISO,

} from 'date-fns';
import {
    ArrowLeft,
    Calendar,
    ChevronLeft,
    ChevronRight,
    File,
    Logs,
    MessageCircle,
    Paperclip,
    Send,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

// Import Planning Components
import { EventDialog } from './planning/event-dialog';
import { PlanningGrid } from './planning/planning-grid';
import { TicketSidebar } from './planning/ticket-sidebar';
import {
    formatPeriodTitle,
    navigateByView,
} from '@/pages/tickets/planning/utils';

interface ShowProps {
    ticket: Ticket;
    events: TicketSchedule[];
    solvers: User[];
}

export default function Show({ ticket, events, solvers }: ShowProps) {
    const __ = useTrans();

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
            <Head title={__('tickets.pages.create.head_title')} />

            <ShowCard ticket={ticket} events={events} solvers={solvers} />
        </AppLayout>
    );
}

function ShowCard({ ticket, events, solvers }: ShowProps) {
    // const __ = useTrans(); TODO

    return (
        <Card>
            <CardHeader>
                <CardTitle>{`#${ticket.id} - ${ticket.title}`}</CardTitle>
                <CardAction>
                    <Button asChild variant={'secondary'}>
                        <Link href={route('tickets.index')}>
                            <ArrowLeft />
                            Go back to tickets
                        </Link>
                    </Button>
                </CardAction>
            </CardHeader>
            <Separator />

            <CardContent>
                <Tabs
                    defaultValue={'informations'}
                    className="w-full space-y-4"
                >
                    <TabsList className="w-full">
                        <TabsTrigger value={'informations'}>
                            <File />
                            Informations
                        </TabsTrigger>
                        <TabsTrigger value={'comments'}>
                            <MessageCircle />
                            Comments
                        </TabsTrigger>
                        <TabsTrigger value={'calendar'}>
                            <Calendar />
                            Calendar
                        </TabsTrigger>
                        <TabsTrigger value={'logs'}>
                            <Logs />
                            Logs
                        </TabsTrigger>
                    </TabsList>

                    <InformationsTab ticket={ticket} events={[]} solvers={[]} />
                    <CommentsTab ticket={ticket} events={[]} solvers={[]} />
                    <CalendarTab
                        ticket={ticket}
                        events={events}
                        solvers={solvers}
                    />
                </Tabs>
            </CardContent>
        </Card>
    );
}

function CalendarTab({ ticket, events, solvers }: ShowProps) {
    const { auth } = usePage<SharedData>().props;

    const initialDate =
        ticket.schedules && ticket.schedules.length > 0
            ? parseISO(ticket.schedules[0].start_date)
            : new Date();

    const [date, setDate] = useState(initialDate);
    const [view, setView] = useState<'day' | 'week' | 'month'>('week');
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<TicketSchedule | null>(
        null,
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSolvers] = useState<number[]>(solvers.map((s) => s.id));

    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(
        null,
    );

    const scheduledTicketIds = events.map((e) => e.ticket_id);

    const handleNavigate = (direction: 'prev' | 'next') => {
        setDate(navigateByView(date, view, direction));
    };

    const handleDropEvent = (
        targetDate: Date,
        ticketId?: number,
        eventId?: number,
    ) => {
        if (ticketId) {
            router.post(
                route('tickets.planning.store'),
                {
                    ticket_id: ticketId,
                    user_id: auth.user.id,
                    start_date: format(targetDate, 'yyyy-MM-dd HH:mm:ss'),
                    duration_minutes: 60,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('Planifié');
                        setSelectedTicketId(null);
                    },
                },
            );
        } else if (eventId) {
            const original = events.find((e) => e.id === eventId);
            if (!original) return;
            router.put(
                route('tickets.planning.update', eventId),
                {
                    start_date: format(targetDate, 'yyyy-MM-dd HH:mm:ss'),
                    duration_minutes: original.duration_minutes,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => toast.success('Déplacé'),
                },
            );
        }
    };

    const handleUpdateEvent = (id: number, data: any) => {
        router.put(route('tickets.planning.update', id), data, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Mis à jour');
                setIsModalOpen(false);
            },
        });
    };

    const handleDeleteEvent = (id: number) => {
        router.delete(route('tickets.planning.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Supprimé du planning');
                setIsModalOpen(false);
            },
        });
    };

    const getPeriodTitle = () => formatPeriodTitle(date, view);

    return (
        <TabsContent value={'calendar'} className="space-y-4">
            <div className="flex items-center justify-between rounded-md border bg-background p-2 shadow-sm">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleNavigate('prev')}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-8 min-w-[200px] justify-start text-sm font-medium"
                            >
                                <span className="truncate capitalize">
                                    {getPeriodTitle()}
                                </span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <CalendarPicker
                                mode="single"
                                selected={date}
                                onSelect={(d) => d && setDate(d)}
                            />
                        </PopoverContent>
                    </Popover>

                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleNavigate('next')}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="edit-mode-tab"
                            checked={isEditMode}
                            onCheckedChange={setIsEditMode}
                        />
                        <Label
                            htmlFor="edit-mode-tab"
                            className="text-xs font-medium"
                        >
                            Planifier
                        </Label>
                    </div>
                    <Tabs value={view} onValueChange={(v: any) => setView(v)}>
                        <TabsList className="h-8">
                            <TabsTrigger
                                value="day"
                                className="text-[10px] uppercase"
                            >
                                Jour
                            </TabsTrigger>
                            <TabsTrigger
                                value="week"
                                className="text-[10px] uppercase"
                            >
                                Semaine
                            </TabsTrigger>
                            <TabsTrigger
                                value="month"
                                className="text-[10px] uppercase"
                            >
                                Mois
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            <div className="flex h-[600px] flex-1 overflow-hidden rounded-md border bg-muted/10">
                <div
                    className={cn(
                        'relative flex flex-col overflow-hidden border-r bg-background transition-all duration-300 ease-in-out',
                        isEditMode
                            ? 'w-72 opacity-100'
                            : 'w-0 border-none opacity-0',
                    )}
                >
                    <div className="h-full w-72">
                        <TicketSidebar
                            tickets={[ticket]}
                            scheduledTicketIds={scheduledTicketIds}
                            selectedId={selectedTicketId}
                            onSelect={setSelectedTicketId}
                            onUnschedule={handleDeleteEvent}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-hidden bg-background">
                    <PlanningGrid
                        events={events}
                        view={view}
                        currentDate={date}
                        isEditMode={isEditMode}
                        currentUserId={auth.user.id}
                        selectedSolvers={selectedSolvers}
                        onDrop={handleDropEvent}
                        onUpdate={handleUpdateEvent}
                        onEventClick={(evt) => {
                            setSelectedEvent(evt);
                            setIsModalOpen(true);
                        }}
                    />
                </div>
            </div>

            <EventDialog
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                event={selectedEvent}
                isEditMode={isEditMode}
                onSave={handleUpdateEvent}
                onDelete={handleDeleteEvent}
                onValidate={() => setIsModalOpen(false)}
            />
        </TabsContent>
    );
}

function InformationsTab({ ticket }: ShowProps) {
    const getInitials = useInitials();

    function DetailCard({
        title,
        content,
    }: {
        title: string;
        content: string | React.ReactNode;
    }) {
        return (
            <div className="col-span-1 rounded-md border p-2">
                <h3 className="mb-2 text-sm font-medium">{title}</h3>
                <p className="rounded-md border px-4 py-2">{content}</p>
            </div>
        );
    }

    return (
        <TabsContent value={'informations'} className="grid gap-8">
            <div className="grid gap-2">
                <h3 className="mb-2 font-medium">Description</h3>
                <Separator className="mb-4" />
                <p className="rounded-md border p-2">{ticket.description}</p>
            </div>

            <div className="grid gap-2">
                <h3 className="mb-2 font-medium">Assignees</h3>
                <Separator className="mb-4" />
                <div className="grid grid-cols-6">
                    {ticket.assignees.length === 0 && (
                        <p className="col-span-6 rounded-md border p-2">
                            No assignees.
                        </p>
                    )}
                    {ticket.assignees.length > 0 &&
                        ticket.assignees.map((assignee) => (
                            <div
                                className="col-span-1 flex items-center gap-2 rounded-md border p-2"
                                key={assignee.id}
                            >
                                <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                    <AvatarImage
                                        src={
                                            assignee.user.avatar?.url ??
                                            undefined
                                        }
                                        alt={assignee.user.name}
                                    />
                                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                        {getInitials(assignee.user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        {assignee.user.name}
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        {assignee.user.email}
                                    </span>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            <div className="grid gap-2">
                <h3 className="mb-2 font-medium">Details</h3>
                <Separator className="mb-4" />
                <div className="grid grid-cols-4 gap-4">
                    <DetailCard
                        title="Priority"
                        content={renderTicketPriority(ticket.priority)}
                    />
                    <DetailCard
                        title="Category"
                        content={renderTicketCategory(ticket.category)}
                    />
                    <DetailCard
                        title="Status"
                        content={renderTicketStatus(ticket.status)}
                    />
                    <DetailCard
                        title="Asset"
                        content={renderAsset(ticket.asset, false)}
                    />
                    <DetailCard title="Author" content={ticket.user.name} />
                    <DetailCard
                        title="Nbr of Assignees"
                        content={ticket.assignees.length}
                    />
                    <DetailCard
                        title="Last updated"
                        content={new Date(ticket.updated_at).toLocaleString()}
                    />
                    <DetailCard
                        title="Created at"
                        content={new Date(ticket.created_at).toLocaleString()}
                    />
                </div>
            </div>
        </TabsContent>
    );
}

function CommentsTab({ ticket }: ShowProps) {
    const getInitials = useInitials();

    const { data, setData, processing, errors, post } = useForm<{
        content: string;
    }>({
        content: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post(route('tickets.comments.store', { ticket: ticket.id }), {
            preserveScroll: true,
            onSuccess: () => setData('content', ''),
        });
    }

    // const { auth } = usePage<SharedData>().props; TODO

    /*const CURRENT_USER_ID = auth.user.id; TODO
    const LOCALE = `${auth.user.language}-${auth.user.language.toUpperCase()}`;*/

    return (
        <TabsContent value={'comments'} className="grid gap-8">
            {/* Form */}
            <form className="flex items-start gap-2" onSubmit={handleSubmit}>
                <InputGroup>
                    <InputGroupTextarea
                        placeholder="Write a comment..."
                        name="content"
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        className="flex-1"
                        aria-invalid={errors.content ? 'true' : 'false'}
                        disabled={processing}
                        required
                        autoFocus
                    />
                    <InputGroupAddon align="block-end">
                        <InputGroupButton
                            variant="outline"
                            className="rounded-full"
                            size={'icon-sm'}
                        >
                            <Paperclip />
                        </InputGroupButton>

                        <InputGroupButton
                            className="rounded-full"
                            size={'icon-sm'}
                            variant={'default'}
                            type="submit"
                            disabled={processing}
                        >
                            <Send />
                            <span className="sr-only">Send</span>
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
            </form>


            {/* Comments */}
            {ticket.comments.length === 0 && (
                <p className="rounded-md border p-2">No comments.</p>
            )}

            {ticket.comments.length > 0 && (
                <div className="grid gap-4">
                    {ticket.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-2">
                            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                <AvatarImage
                                    src={
                                        comment.user?.profile_photo_url ||
                                        undefined
                                    }
                                    alt={comment.user?.name}
                                />
                                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                    {getInitials(comment.user?.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="rounded-md bg-muted/50 p-3 text-sm">
                                <div className="mb-1 text-xs font-bold">
                                    {comment.user?.name}
                                </div>
                                {comment.content}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </TabsContent>
    );
}
