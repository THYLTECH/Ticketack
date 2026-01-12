import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app/layout';
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import {
    SharedData,
    Ticket,
    TicketSchedule,
    UpdatePayload,
    User,
} from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import {
    addDays,
    addMonths,
    addWeeks,
    endOfWeek,
    format,
    formatISO,
    parseISO,
    startOfWeek,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import {
    Activity,
    BarChart3,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    CircleDashed,
    Clock,
    Filter,
    Globe,
    Inbox,
    LucideIcon,
    Search,
    Target,
    Users,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { PreFillData, TimeEntryDialog } from '../entries/create-dialog';
import { EventDialog } from './event-dialog';
import { PlanningGrid } from './planning-grid';
import { SolverFilters } from './solver-filters';
import { TicketSidebar } from './ticket-sidebar';

interface Props {
    events: TicketSchedule[];
    myTickets: Ticket[];
    solvers: User[];
}

export type ViewType = 'day' | 'week' | 'month';

export default function PlanningPage({ events, myTickets, solvers }: Props) {
    const { auth } = usePage<SharedData>().props;
    const __ = useTrans();

    const [isEditMode, setIsEditMode] = useState(false);
    const [view, setView] = useState<ViewType>('day');
    const [date, setDate] = useState(new Date());

    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(
        null,
    );
    const [isTicketsSheetOpen, setIsTicketsSheetOpen] = useState(false);

    const [selectedEvent, setSelectedEvent] = useState<TicketSchedule | null>(
        null,
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [convertingEvent, setConvertingEvent] =
        useState<TicketSchedule | null>(null);

    const [selectedSolvers, setSelectedSolvers] = useState<number[]>(() => {
        const currentUserInSolvers = solvers.find((s) => s.id === auth.user.id);
        return currentUserInSolvers ? [auth.user.id] : [];
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [highlightedEventId, setHighlightedEventId] = useState<number | string | null>(null);

    const searchResults = useMemo(() => {
        if (!searchQuery) return [];
        const lower = searchQuery.toLowerCase();
        return events.filter(
            (e) =>
                e.ticket.title.toLowerCase().includes(lower) ||
                e.ticket.id.toString().includes(lower) ||
                e.user.name.toLowerCase().includes(lower),
        );
    }, [events, searchQuery]);

    const handleNavigate = (direction: 'prev' | 'next') => {
        const modifier = direction === 'next' ? 1 : -1;
        if (view === 'day') setDate(addDays(date, modifier));
        if (view === 'week') setDate(addWeeks(date, modifier));
        if (view === 'month') setDate(addMonths(date, modifier));
    };

    const handleSearchSelect = (event: TicketSchedule) => {
        const eventDate = parseISO(event.start_date);
        setDate(eventDate);
        setIsSearchOpen(false);
        setSearchQuery('');

        setHighlightedEventId(event.id);
        setTimeout(() => {
            setHighlightedEventId(null);
        }, 3000);

        const message = __('schedule.page.search_found').replace(
            ':id',
            event.ticket.id.toString(),
        );

        toast.info(message, {
            description: format(eventDate, 'd MMMM yyyy', { locale: fr }),
        });
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
                    start_date: formatISO(targetDate),
                    duration_minutes: 60,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setSelectedTicketId(null);
                        setSelectedEvent(null);
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
                { preserveScroll: true },
            );
        }
    };

    const handleSlotClick = (targetDate: Date) => {
        if (selectedTicketId) {
            handleDropEvent(targetDate, selectedTicketId);
        }
    };

    const handleDayHeaderClick = (targetDate: Date) => {
        setDate(targetDate);
        setView('day');
    };

    const handleUpdateEvent = (id: number, data: UpdatePayload) => {
        const payload = data as unknown as Record<
            string,
            string | number | boolean | null | undefined
        >;

        router.put(route('tickets.planning.update', id), payload, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(__('schedule.page.toast_updated'));
                setIsModalOpen(false);
            },
        });
    };

    const handleDeleteEvent = (id: number) => {
        router.delete(route('tickets.planning.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
            },
        });
    };

    const handleValidateEvent = (event: TicketSchedule) => {
        setIsModalOpen(false);
        setSelectedEvent(null);
        setConvertingEvent(event);
    };

    const getPeriodTitle = () => {
        if (view === 'day') return format(date, 'd MMMM yyyy', { locale: fr });
        if (view === 'month') return format(date, 'MMMM yyyy', { locale: fr });
        return `${format(startOfWeek(date, { weekStartsOn: 1 }), 'd MMM')} - ${format(endOfWeek(date, { weekStartsOn: 1 }), 'd MMM yyyy', { locale: fr })}`;
    };

    const prefillData: PreFillData | undefined = useMemo(() => {
        if (!convertingEvent) return undefined;

        const baseData = {
            date: parseISO(convertingEvent.start_date),
            hours: Math.floor(convertingEvent.duration_minutes / 60),
            minutes: convertingEvent.duration_minutes % 60,
            description: '',
        };

        return typeof convertingEvent.id === 'number'
            ? { ...baseData, schedule_id: convertingEvent.id }
            : baseData;
    }, [convertingEvent]);

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: __('home.pages.breadcrumbs.home'),
                    href: route('home'),
                },
                { title: __('schedule.page.breadcrumbs.planning'), href: '#' },
            ]}
        >
            <Head title={__('schedule.page.title')} />

            <div className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden bg-background">
                <div className="z-30 flex shrink-0 flex-col gap-3 border-b bg-background/95 px-4 py-3 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/60 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
                    <div className="flex items-center justify-between gap-2 lg:justify-start lg:gap-4">
                        <div className="flex items-center rounded-lg border bg-card p-0.5 shadow-sm">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-md"
                                onClick={() => handleNavigate('prev')}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="flex h-8 min-w-30 items-center justify-center px-2 text-xs font-semibold sm:min-w-35 sm:px-3 sm:text-sm"
                                    >
                                        <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
                                        <span className="max-w-30 truncate leading-none capitalize sm:max-w-none">
                                            {getPeriodTitle()}
                                        </span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={(d) => d && setDate(d)}
                                        autoFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-md"
                                onClick={() => handleNavigate('next')}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="hidden items-center gap-1.5 rounded-md border border-border/50 bg-muted/50 px-2 py-2.5 xl:flex">
                                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                                    {auth.user.timezone || 'UTC'}
                                </span>
                            </div>

                            <Popover
                                open={isSearchOpen}
                                onOpenChange={setIsSearchOpen}
                            >
                                <PopoverTrigger asChild>
                                    <div className="group relative cursor-pointer">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9 lg:hidden"
                                        >
                                            <Search className="h-4 w-4 text-muted-foreground" />
                                        </Button>

                                        <div className="hidden lg:block lg:w-55 xl:w-70">
                                            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                                            <div className="flex h-9 w-full items-center rounded-md border border-input bg-muted/30 pr-3 pl-9 text-xs text-muted-foreground shadow-sm transition-all group-hover:border-primary/50 group-hover:bg-background">
                                                {__(
                                                    'schedule.toolbar.search_placeholder',
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-70 p-0"
                                    align="end"
                                    sideOffset={5}
                                >
                                    <div className="flex items-center border-b px-3">
                                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                        <input
                                            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder={__(
                                                'schedule.toolbar.search_command',
                                            )}
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            autoFocus
                                        />
                                    </div>
                                    <ScrollArea className="h-60">
                                        <div className="p-1">
                                            {searchResults.length === 0 ? (
                                                <div className="py-8 text-center text-xs text-muted-foreground">
                                                    {searchQuery
                                                        ? __(
                                                              'schedule.toolbar.no_results',
                                                          )
                                                        : __(
                                                              'schedule.toolbar.start_typing',
                                                          )}
                                                </div>
                                            ) : (
                                                searchResults.map((evt) => (
                                                    <div
                                                        key={evt.id}
                                                        onClick={() =>
                                                            handleSearchSelect(
                                                                evt,
                                                            )
                                                        }
                                                        className="flex cursor-pointer flex-col gap-1 rounded-sm px-2 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="truncate pr-2 font-medium">
                                                                {
                                                                    evt.ticket
                                                                        .title
                                                                }
                                                            </span>
                                                            <Badge
                                                                variant="outline"
                                                                className="h-4 px-1 text-[10px]"
                                                            >
                                                                {
                                                                    evt.ticket
                                                                        .status
                                                                        ?.title
                                                                }
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <span className="flex items-center">
                                                                <CalendarIcon className="mr-1 h-3 w-3" />
                                                                {format(
                                                                    parseISO(
                                                                        evt.start_date,
                                                                    ),
                                                                    'dd MMM',
                                                                    {
                                                                        locale: fr,
                                                                    },
                                                                )}
                                                            </span>
                                                            <span>•</span>
                                                            <span className="max-w-25 truncate">
                                                                {evt.user.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </ScrollArea>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 lg:justify-end">
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
                                            className="h-9 text-primary lg:hidden"
                                        >
                                            <Inbox className="mr-2 h-4 w-4" />
                                            {__('schedule.sidebar.title')}
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
                                                tickets={myTickets}
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

                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 lg:hidden"
                                    >
                                        <Filter className="mr-2 h-4 w-4" />
                                        {__('schedule.drawer.action')}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="right"
                                    className="flex w-[85vw] flex-col gap-0 border-l bg-background p-0 sm:w-[320px]"
                                >
                                    <SheetHeader className="border-b px-4 py-3 text-left">
                                        <SheetTitle>{__('schedule.drawer.title')}</SheetTitle>
                                    </SheetHeader>
                                    <div className="flex-1 overflow-hidden">
                                        <SolverFilters
                                            solvers={solvers}
                                            selectedIds={selectedSolvers}
                                            onToggle={(id) =>
                                                setSelectedSolvers((prev) =>
                                                    prev.includes(id)
                                                        ? prev.filter(
                                                              (s) => s !== id,
                                                          )
                                                        : [...prev, id],
                                                )
                                            }
                                            embedded
                                        />
                                    </div>
                                </SheetContent>
                            </Sheet>

                            <PlanningStatsDialog
                                events={events}
                                solvers={solvers}
                            />
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <Separator
                                orientation="vertical"
                                className="hidden h-6 lg:block"
                            />

                            <Tabs
                                value={view}
                                onValueChange={(v) => setView(v as ViewType)}
                                className="hidden md:block"
                            >
                                <TabsList className="h-9 p-1">
                                    <TabsTrigger
                                        value="day"
                                        className="px-3 text-xs"
                                    >
                                        {__('schedule.toolbar.views.day')}
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="week"
                                        className="px-3 text-xs"
                                    >
                                        {__('schedule.toolbar.views.week')}
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="month"
                                        className="px-3 text-xs"
                                    >
                                        {__('schedule.toolbar.views.month')}
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>

                            <div className="flex rounded-md border bg-muted/20 p-0.5 md:hidden">
                                <Button
                                    variant={
                                        view === 'day' ? 'secondary' : 'ghost'
                                    }
                                    size="sm"
                                    onClick={() => setView('day')}
                                    className="h-8 w-10 px-0 text-xs"
                                >
                                    J
                                </Button>
                                <Button
                                    variant={
                                        view === 'month' ? 'secondary' : 'ghost'
                                    }
                                    size="sm"
                                    onClick={() => setView('month')}
                                    className="h-8 w-10 px-0 text-xs"
                                >
                                    M
                                </Button>
                            </div>

                            <div
                                className={cn(
                                    'flex h-9 items-center space-x-2 rounded-md border px-3 transition-colors',
                                    isEditMode
                                        ? 'border-primary/30 bg-primary/5'
                                        : 'bg-card',
                                )}
                            >
                                <Switch
                                    id="mode-switch"
                                    checked={isEditMode}
                                    onCheckedChange={(v) => {
                                        setIsEditMode(v);
                                        setSelectedTicketId(null);
                                    }}
                                    className="scale-75"
                                />
                                <Label
                                    htmlFor="mode-switch"
                                    className="hidden cursor-pointer text-xs font-medium sm:inline-block"
                                >
                                    {__('schedule.toolbar.edit_label')}
                                </Label>
                                <Label
                                    htmlFor="mode-switch"
                                    className="cursor-pointer text-xs font-medium sm:hidden"
                                >
                                    {__('schedule.toolbar.edit_label')}
                                </Label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-1 flex-row gap-4 overflow-hidden bg-muted/10 p-2 sm:p-4">
                    <aside
                        className={cn(
                            'relative hidden shrink-0 flex-col overflow-hidden transition-all duration-300 ease-in-out lg:flex',
                            isEditMode
                                ? 'w-64 translate-x-0 opacity-100'
                                : '-ml-4 w-0 -translate-x-4 opacity-0',
                        )}
                    >
                        <div className="h-full w-64 overflow-hidden rounded-xl border bg-card shadow-sm">
                            <TicketSidebar
                                tickets={myTickets}
                                selectedId={selectedTicketId}
                                onSelect={setSelectedTicketId}
                                onUnschedule={handleDeleteEvent}
                            />
                        </div>
                    </aside>

                    <main className="relative flex-1 overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300">
                        <PlanningGrid
                            events={events}
                            view={view}
                            currentDate={date}
                            isEditMode={isEditMode}
                            currentUserId={auth.user.id}
                            selectedSolvers={selectedSolvers}
                            highlightedEventId={highlightedEventId}
                            onDrop={handleDropEvent}
                            onUpdate={handleUpdateEvent}
                            onEventClick={(evt) => {
                                setSelectedEvent(evt);
                                setIsModalOpen(true);
                            }}
                            onSlotClick={handleSlotClick}
                            onDayHeaderClick={handleDayHeaderClick}
                        />
                    </main>

                    <aside className="relative hidden shrink-0 flex-col overflow-visible lg:flex">
                        <SolverFilters
                            solvers={solvers}
                            selectedIds={selectedSolvers}
                            onToggle={(id) =>
                                setSelectedSolvers((prev) =>
                                    prev.includes(id)
                                        ? prev.filter((s) => s !== id)
                                        : [...prev, id],
                                )
                            }
                        />
                    </aside>
                </div>
            </div>

            <EventDialog
                open={isModalOpen}
                onOpenChange={(open) => {
                    setIsModalOpen(open);
                    if (!open) setSelectedEvent(null);
                }}
                event={selectedEvent}
                isEditMode={isEditMode}
                onSave={handleUpdateEvent}
                onDelete={handleDeleteEvent}
                onValidate={handleValidateEvent}
            />

            <TimeEntryDialog
                open={!!convertingEvent}
                onOpenChange={(open) => {
                    if (!open) {
                        setConvertingEvent(null);
                        setSelectedEvent(null);
                    }
                }}
                ticket={convertingEvent?.ticket}
                availableTickets={myTickets.map((t) => ({
                    id: t.id,
                    title: t.title,
                    description: t.description,
                    asset: t.asset,
                }))}
                initialValues={prefillData}
            />
        </AppLayout>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    subValue,
}: {
    icon: LucideIcon;
    label: string;
    value: string | number;
    subValue?: string | number | React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md">
            <span className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                <Icon className="h-3.5 w-3.5" /> {label}
            </span>
            <span className="text-2xl font-bold tracking-tight text-foreground">
                {value}
                {subValue && (
                    <span className="ml-1 text-sm font-normal text-muted-foreground">
                        {subValue}
                    </span>
                )}
            </span>
        </div>
    );
}

function PlanningStatsDialog({
    events,
    solvers,
}: {
    events: TicketSchedule[];
    solvers: User[];
}) {
    const __ = useTrans();

    const totalHours =
        events.reduce((acc, e) => acc + e.duration_minutes, 0) / 60;
    const uniqueSolvers = new Set(events.map((e) => e.user_id)).size;

    const aggregateBy = (
        items: TicketSchedule[],
        keySelector: (e: TicketSchedule) => string | undefined,
        colorSelector: (e: TicketSchedule) => string | undefined,
    ) => {
        return items.reduce(
            (acc, e) => {
                const key = keySelector(e);
                if (key) {
                    const color = colorSelector(e) || '#94a3b8';
                    acc[key] = { count: (acc[key]?.count || 0) + 1, color };
                }
                return acc;
            },
            {} as Record<string, { count: number; color: string }>,
        );
    };

    const priorityCounts = aggregateBy(
        events,
        (e) => e.ticket?.priority?.title,
        (e) => e.ticket?.priority?.color,
    );

    const statusCounts = aggregateBy(
        events,
        (e) => e.ticket?.status?.title || 'Inconnu',
        (e) => e.ticket?.status?.color,
    );

    const renderBars = (
        dataMap: Record<string, { count: number; color: string }>,
    ) => {
        if (Object.keys(dataMap).length === 0) {
            return (
                <p className="text-xs text-muted-foreground italic">
                    {__('schedule.stats.no_data')}
                </p>
            );
        }
        return Object.entries(dataMap).map(([title, data]) => (
            <div key={title} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                    <span>{title}</span>
                    <span className="text-muted-foreground">{data.count}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted/50">
                    <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                            width: `${(data.count / events.length) * 100}%`,
                            backgroundColor: data.color,
                        }}
                    />
                </div>
            </div>
        ));
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-2 border-dashed text-xs font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground"
                >
                    <BarChart3 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">
                        {__('schedule.toolbar.stats')}
                    </span>
                </Button>
            </DialogTrigger>
                <DialogContent className="max-h-[90vh] w-[90vw] overflow-y-auto sm:max-w-150">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle>{__('schedule.stats.title')}</DialogTitle>
                    <DialogDescription>
                        {__('schedule.stats.description')}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 pt-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <StatCard
                            icon={Clock}
                            label={__('schedule.stats.volume')}
                            value={totalHours.toFixed(1)}
                            subValue="h"
                        />
                        <StatCard
                            icon={Target}
                            label={__('schedule.stats.interventions')}
                            value={events.length}
                        />
                        <StatCard
                            icon={Users}
                            label={__('schedule.stats.technicians')}
                            value={uniqueSolvers}
                            subValue={`/ ${solvers.length}`}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="space-y-4 rounded-xl border bg-muted/5 p-4">
                            <h4 className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
                                <CircleDashed className="h-3.5 w-3.5" />{' '}
                                {__('schedule.stats.statuses')}
                            </h4>
                            <div className="space-y-3">
                                {renderBars(statusCounts)}
                            </div>
                        </div>

                        <div className="space-y-4 rounded-xl border bg-muted/5 p-4">
                            <h4 className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
                                <Activity className="h-3.5 w-3.5" />{' '}
                                {__('schedule.stats.priorities')}
                            </h4>
                            <div className="space-y-3">
                                {renderBars(priorityCounts)}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
