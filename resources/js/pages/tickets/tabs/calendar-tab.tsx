import { Button } from '@/components/ui/button';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { ViewType } from '@/pages/tickets/planning';
import { EventDialog } from '@/pages/tickets/planning/event-dialog';
import { PlanningGrid } from '@/pages/tickets/planning/planning-grid';
import { TicketSidebar } from '@/pages/tickets/planning/ticket-sidebar';
import {
    formatPeriodTitle,
    navigateByView,
} from '@/pages/tickets/planning/utils';
import {
    SharedData,
    Ticket,
    TicketSchedule,
    UpdatePayload,
    User,
} from '@/types';
import { router, usePage } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Props {
    ticket: Ticket;
    events: TicketSchedule[];
    solvers: User[];
}

export function CalendarTab({ ticket, events, solvers }: Props) {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;

    const initialDate =
        ticket.schedules && ticket.schedules.length > 0
            ? parseISO(ticket.schedules[0].start_date)
            : new Date();

    const [date, setDate] = useState(initialDate);
    const [view, setView] = useState<ViewType>('week');
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<TicketSchedule | null>(
        null,
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSolvers] = useState<number[]>(solvers.map((s) => s.id));
    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(
        null,
    );
    const [isTicketsSheetOpen, setIsTicketsSheetOpen] = useState(false);

    useEffect(() => {
        const checkMobileView = () => {
            if (window.innerWidth < 768) {
                setView('day');
            }
        };
        checkMobileView();
        window.addEventListener('resize', checkMobileView);
        return () => window.removeEventListener('resize', checkMobileView);
    }, []);

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
                },
            );
        }
    };

    const handleUpdateEvent = (id: number, data: UpdatePayload) => {
        router.put(
            route('tickets.planning.update', id),
            data as unknown as Record<
                string,
                string | number | boolean | null | undefined
            >,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                },
            },
        );
    };

    const handleDeleteEvent = (id: number) => {
        router.delete(route('tickets.planning.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
            },
        });
    };

    return (
        <TabsContent value="calendar" className="space-y-4">
            <div className="flex flex-col gap-3 rounded-md border bg-background p-2 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center justify-between gap-2 sm:justify-start">
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
                                className="h-8 min-w-[140px] flex-1 justify-start text-sm font-medium sm:min-w-[200px] sm:flex-none"
                            >
                                <span className="truncate capitalize">
                                    {formatPeriodTitle(date, view)}
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

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <div className="flex items-center gap-2">
                        {isEditMode && (
                            <Sheet
                                open={isTicketsSheetOpen}
                                onOpenChange={setIsTicketsSheetOpen}
                            >
                                <SheetTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 gap-2 border-dashed border-primary/50 px-2 text-xs text-primary sm:hidden"
                                    >
                                        <Inbox className="h-3.5 w-3.5" />
                                        <span>{__('schedule.sidebar.trigger')}</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="left"
                                    className="flex w-[85vw] flex-col gap-0 border-r bg-background p-0 sm:w-[380px]"
                                >
                                    <SheetHeader className="border-b px-4 py-3 text-left">
                                        <SheetTitle>
                                            {__('schedule.sidebar.title')}
                                        </SheetTitle>
                                    </SheetHeader>
                                    <div className="flex-1 overflow-hidden">
                                        <TicketSidebar
                                            tickets={[ticket]}
                                            scheduledTicketIds={
                                                scheduledTicketIds
                                            }
                                            selectedId={selectedTicketId}
                                            onSelect={(id) => {
                                                setSelectedTicketId(id);
                                                if (id) {
                                                    setIsTicketsSheetOpen(
                                                        false,
                                                    );
                                                    toast.info(
                                                        __('schedule.flash.select_title'),
                                                        {
                                                            description:
                                                                __('schedule.flash.select_description'),
                                                        },
                                                    );
                                                }
                                            }}
                                            onUnschedule={handleDeleteEvent}
                                        />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        )}

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="edit-mode-tab"
                                checked={isEditMode}
                                onCheckedChange={setIsEditMode}
                            />
                            <Label
                                htmlFor="edit-mode-tab"
                                className="cursor-pointer text-xs font-medium"
                            >
                                {__('tickets.pages.show.calendar.edit_mode')}
                            </Label>
                        </div>
                    </div>

                    <Tabs
                        value={view}
                        onValueChange={(v) => setView(v as ViewType)}
                    >
                        <TabsList className="h-8">
                            <TabsTrigger
                                value="day"
                                className="text-[10px] uppercase"
                            >
                                {__('tickets.pages.show.calendar.views.day')}
                            </TabsTrigger>
                            <TabsTrigger
                                value="week"
                                className="hidden text-[10px] uppercase sm:inline-flex"
                            >
                                {__('tickets.pages.show.calendar.views.week')}
                            </TabsTrigger>
                            <TabsTrigger
                                value="month"
                                className="text-[10px] uppercase"
                            >
                                {__('tickets.pages.show.calendar.views.month')}
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            <div className="flex h-[600px] flex-1 overflow-hidden rounded-md border bg-muted/10">
                <div
                    className={cn(
                        'relative hidden flex-col overflow-hidden border-r bg-background transition-all duration-300 ease-in-out sm:flex',
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
                            const fullEvent = {
                                ...evt,
                                user: evt.user ||
                                    solvers.find(
                                        (s) => s.id === evt.user_id,
                                    ) || {
                                        id: evt.user_id,
                                        name: 'Technicien',
                                        email: '',
                                        avatar: null,
                                    },
                                ticket: evt.ticket || ticket,
                            };
                            setSelectedEvent(fullEvent);
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
