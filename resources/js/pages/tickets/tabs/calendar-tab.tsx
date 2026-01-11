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
import { ScheduleList } from '@/pages/tickets/planning/components';
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
import { formatISO, parseISO } from 'date-fns';
import {
    ChevronLeft,
    ChevronRight,
    Inbox,
    LayoutGrid,
    List,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
    const [showListView, setShowListView] = useState(false);
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

    const filteredEvents = useMemo(() => {
        return events.filter((e) => {
            if (isEditMode) {
                return selectedSolvers.includes(e.user_id);
            } else {
                const isForThisTicket = e.ticket_id === ticket.id;
                const isFromSelectedSolver = selectedSolvers.includes(
                    e.user_id,
                );
                return isForThisTicket && isFromSelectedSolver;
            }
        });
    }, [events, isEditMode, ticket.id, selectedSolvers]);

    const handleNavigate = (direction: 'prev' | 'next') => {
        setDate(navigateByView(date, view, direction));
    };

    const handleDayHeaderClick = (targetDate: Date) => {
        setDate(targetDate);
        setView('day');
    };

    const handleDropEvent = (
        targetDate: Date,
        ticketId?: number,
        eventId?: number,
    ) => {
        const effectiveTicketId = ticketId || selectedTicketId;

        if (effectiveTicketId) {
            router.post(
                route('tickets.planning.store'),
                {
                    ticket_id: effectiveTicketId,
                    user_id: auth.user.id,
                    start_date: formatISO(targetDate),
                    duration_minutes: 60,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setSelectedTicketId(null);
                        if (isTicketsSheetOpen) setIsTicketsSheetOpen(false);
                    },
                },
            );
        } else if (eventId) {
            const original = events.find((e) => e.id === eventId);
            if (!original) return;
            router.put(
                route('tickets.planning.update', eventId),
                {
                    start_date: formatISO(targetDate),
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
                                className="h-8 min-w-35 flex-1 justify-start text-sm font-medium sm:min-w-50 sm:flex-none"
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

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                    <div className="flex items-center justify-between gap-2 sm:gap-3">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center rounded-md border">
                                <Button
                                    variant={
                                        showListView ? 'ghost' : 'secondary'
                                    }
                                    size="sm"
                                    className="h-8 px-2 sm:px-3"
                                    onClick={() => setShowListView(false)}
                                >
                                    <LayoutGrid className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    variant={
                                        showListView ? 'secondary' : 'ghost'
                                    }
                                    size="sm"
                                    className="h-8 px-2 sm:px-3"
                                    onClick={() => setShowListView(true)}
                                >
                                    <List className="h-3.5 w-3.5" />
                                </Button>
                            </div>

                            {isEditMode && (
                                <Sheet
                                    open={isTicketsSheetOpen}
                                    onOpenChange={setIsTicketsSheetOpen}
                                >
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 gap-1.5 border-dashed border-primary/50 px-2 text-xs text-primary sm:hidden"
                                        >
                                            <Inbox className="h-3.5 w-3.5" />
                                            <span className="text-[10px]">
                                                {__('schedule.sidebar.trigger')}
                                            </span>
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent
                                        side="left"
                                        className="flex w-[85vw] flex-col gap-0 border-r bg-background p-0 sm:w-95"
                                    >
                                        <SheetHeader className="border-b px-4 py-3 text-left">
                                            <SheetTitle>
                                                {__('schedule.sidebar.title')}
                                            </SheetTitle>
                                        </SheetHeader>
                                        <div className="flex-1 overflow-hidden">
                                            <TicketSidebar
                                                tickets={[ticket]}
                                                selectedId={selectedTicketId}
                                                onSelect={(id) => {
                                                    setSelectedTicketId(id);
                                                    if (id) {
                                                        setIsTicketsSheetOpen(
                                                            false,
                                                        );
                                                        toast.info(
                                                            __(
                                                                'schedule.flash.select_title',
                                                            ),
                                                            {
                                                                description: __(
                                                                    'schedule.flash.select_description',
                                                                ),
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
                        </div>

                        <div className="flex h-8 items-center space-x-2 rounded-md border px-2 transition-colors sm:hidden">
                            <Switch
                                id="edit-mode-tab"
                                checked={isEditMode}
                                onCheckedChange={setIsEditMode}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 sm:gap-3">
                        <Tabs
                            value={view}
                            onValueChange={(v) => setView(v as ViewType)}
                            className="flex-1 sm:flex-none"
                        >
                            <TabsList className="h-8 w-full sm:w-auto">
                                <TabsTrigger
                                    value="day"
                                    className="flex-1 text-[10px] uppercase sm:flex-none"
                                >
                                    {__(
                                        'tickets.pages.show.calendar.views.day',
                                    )}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="week"
                                    className="hidden text-[10px] uppercase sm:inline-flex"
                                >
                                    {__(
                                        'tickets.pages.show.calendar.views.week',
                                    )}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="month"
                                    className="flex-1 text-[10px] uppercase sm:flex-none"
                                >
                                    {__(
                                        'tickets.pages.show.calendar.views.month',
                                    )}
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="hidden h-9 items-center space-x-2 rounded-md border px-3 transition-colors sm:flex">
                            <Switch
                                id="edit-mode-tab-desktop"
                                checked={isEditMode}
                                onCheckedChange={setIsEditMode}
                            />
                            <Label
                                htmlFor="edit-mode-tab-desktop"
                                className="cursor-pointer text-xs font-medium"
                            >
                                {__('tickets.pages.show.calendar.edit_mode')}
                            </Label>
                        </div>
                    </div>
                </div>
            </div>

            {showListView ? (
                <div className="rounded-md border bg-background p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">
                                {__('schedule.list.title')}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {filteredEvents.length}{' '}
                                {filteredEvents.length > 1
                                    ? __('schedule.list.interventions')
                                    : __('schedule.list.intervention')}
                            </p>
                        </div>
                    </div>
                    <ScheduleList
                        schedules={filteredEvents}
                        onEdit={(schedule) => {
                            setSelectedEvent(schedule);
                            setIsModalOpen(true);
                        }}
                        onDelete={isEditMode ? handleDeleteEvent : undefined}
                    />
                </div>
            ) : (
                <div className="flex h-150 flex-1 overflow-hidden rounded-md border bg-muted/10">
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
                                selectedId={selectedTicketId}
                                onSelect={setSelectedTicketId}
                                onUnschedule={handleDeleteEvent}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden bg-background">
                        <PlanningGrid
                            events={filteredEvents}
                            view={view}
                            currentDate={date}
                            isEditMode={isEditMode}
                            currentUserId={auth.user.id}
                            selectedSolvers={selectedSolvers}
                            onDrop={handleDropEvent}
                            onSlotClick={handleDropEvent}
                            onUpdate={handleUpdateEvent}
                            onDayHeaderClick={handleDayHeaderClick}
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
            )}

            <EventDialog
                open={isModalOpen}
                onOpenChange={(open) => {
                    setIsModalOpen(open);
                    if (!open) {
                        setSelectedEvent(null);
                    }
                }}
                event={selectedEvent}
                isEditMode={isEditMode}
                onSave={handleUpdateEvent}
                onDelete={handleDeleteEvent}
                onValidate={() => {
                    setIsModalOpen(false);
                    setSelectedEvent(null);
                }}
            />
        </TabsContent>
    );
}
