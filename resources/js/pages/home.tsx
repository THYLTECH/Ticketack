import { Head, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app/layout';

import { StatsCard } from '@/pages/home/components/stats-card';
import { QuickActions } from '@/pages/home/components/quick-actions';
import { RecentTickets } from '@/pages/home/components/recent-tickets';
import { TimeSummary } from '@/pages/home/components/time-summary';
import { UpcomingSchedules } from '@/pages/home/components/upcoming-schedules';
import { ActivityFeed } from '@/pages/home/components/activity-feed';

import { useTrans } from '@/lib/translation';
import { userHasPermission } from '@/lib/utils';
import { type BreadcrumbItem, SharedData, Ticket, TicketEntry, TicketSchedule } from '@/types';

import {
    Ticket as TicketIcon,
    CheckCircle2,
    Users,
    AlertCircle,
    LayoutDashboard,
    Timer,
    Clock,
    Rocket,
    Eye,
    EyeOff,
    ChevronUp,
    ChevronDown,
} from 'lucide-react';
import { PageTutorial } from '@/components/onboarding';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

import { TicketTable } from '@/components/tickets/ticket-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    DragStartEvent,
    DragEndEvent,
    rectIntersection,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    rectSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { cn } from '@/lib/utils';

type WidgetId =
    | 'stat_open' | 'stat_closed' | 'stat_assigned_open' | 'stat_weekly_hours'
    | 'stat_admin_open' | 'stat_admin_unassigned' | 'stat_admin_closed_today' | 'stat_admin_users'
    | 'my_recent_tickets' | 'time_summary' | 'assigned_tickets' | 'upcoming_schedules' | 'activity_feed';

interface Widget {
    id: WidgetId;
    label: string;
    visible: boolean;
}

interface DashboardLayout {
    top: Widget[];
    left: Widget[];
    right: Widget[];
    show_banner?: boolean;
}

type WidgetContainer = 'top' | 'left' | 'right';

const DEFAULT_LAYOUT: DashboardLayout = {
    top: [
        { id: 'stat_open', label: 'My Open Tickets', visible: true },
        { id: 'stat_closed', label: 'My Closed Tickets', visible: true },
        { id: 'stat_assigned_open', label: 'Assigned Open', visible: true },
        { id: 'stat_weekly_hours', label: 'Weekly Hours', visible: true },
        { id: 'stat_admin_open', label: 'System Open', visible: true },
        { id: 'stat_admin_unassigned', label: 'Unassigned', visible: true },
        { id: 'stat_admin_closed_today', label: 'Closed Today', visible: true },
        { id: 'stat_admin_users', label: 'Total Users', visible: true },
    ],
    left: [
        { id: 'my_recent_tickets', label: 'My Recent Tickets', visible: true },
        { id: 'time_summary', label: 'Time Summary', visible: true },
    ],
    right: [
        { id: 'assigned_tickets', label: 'Assigned Tickets', visible: true },
        { id: 'upcoming_schedules', label: 'Upcoming Schedules', visible: true },
        { id: 'activity_feed', label: 'Activity Feed', visible: true },
    ]
};

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    from: number | null;
    to: number | null;
    total: number;
    per_page: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface HomeStats {
    user: {
        open: number;
        closed: number;
    };
    assigned: {
        open: number;
        closed: number;
    } | null;
    weekly_hours: number | null;
    admin: {
        total_tickets: number;
        total_open: number;
        closed_today: number;
        total_users: number;
        unassigned: number;
    } | null;
}

interface HomeProps {
    home_page_mode: 'default' | 'classic' | 'construction';
    home_page_layout?: DashboardLayout | null;
    stats?: HomeStats;
    recentUserTickets?: Ticket[];
    recentUserClosedTickets?: Ticket[];
    assignedTickets?: {
        open: PaginatedData<Ticket>;
        closed: PaginatedData<Ticket>;
    } | Ticket[];
    assignedClosedTickets?: Ticket[];
    recentEntries?: TicketEntry[] | null;
    upcomingSchedules?: TicketSchedule[] | null;
    recentActivity?: Ticket[] | null;

    userTickets?: {
        open: PaginatedData<Ticket>;
        closed: PaginatedData<Ticket>;
    };
    is_banner_globally_enabled?: boolean;
}

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
}

function SortableWidget({
    id,
    children,
    isEditing,
    visible,
    onToggleVisibility,
    onMoveUp,
    onMoveDown,
    isFirst,
    isLast,
    label
}: {
    id: string;
    children: React.ReactNode;
    isEditing: boolean;
    visible: boolean;
    onToggleVisibility: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    isFirst?: boolean;
    isLast?: boolean;
    label?: string;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform ? { ...transform, scaleY: 1 } : null),
        transition,
        opacity: isDragging ? 0 : 1,
        position: 'relative' as const,
        zIndex: isDragging ? 50 : 'auto',
    };

    if (!visible && !isEditing) return null;
    if (isEditing && !visible) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className={cn(
                    "relative group select-none touch-none h-14 transition-all duration-300",
                    isDragging && "opacity-50"
                )}
            >
                <div className="absolute inset-0 z-10 border-2 border-dashed border-muted-foreground/20 bg-muted/20 rounded-lg flex items-center justify-between px-3 group-hover:border-muted-foreground/40 transition-colors">
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-2 truncate">
                        <EyeOff className="h-4 w-4 shrink-0" />
                        <span className="truncate">{label || id}</span>
                        <span className="text-xs opacity-60 italic">(Hidden)</span>
                    </span>

                    <div className="flex items-center gap-1">
                        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-accent rounded-sm transition-colors md:flex hidden">
                            <LayoutDashboard className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>

                        <div className="flex md:hidden items-center gap-1 border-r pr-1 mr-1">
                            <button onClick={(e) => { e.stopPropagation(); onMoveUp?.(); }} disabled={isFirst} className="p-1">
                                <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onMoveDown?.(); }} disabled={isLast} className="p-1">
                                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="w-px h-3 bg-border/50 hidden md:block" />

                        <button onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }} className="p-1.5 hover:bg-accent rounded-sm transition-colors">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={setNodeRef} style={style} className={cn("relative group select-none", isEditing && "touch-none")}>
            {isEditing && (
                <>
                    <div className="absolute inset-0 z-10 border-2 border-dashed border-primary/20 bg-primary/5 rounded-lg pointer-events-none group-hover:border-primary/40 transition-colors" />

                    <div className="absolute top-2 right-2 z-20 flex flex-col gap-1 items-end">
                        <div className="flex items-center gap-1 bg-background/90 backdrop-blur rounded-md p-1 shadow-sm opacity-100 ring-1 ring-border/50">
                            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-accent rounded-sm transition-colors md:flex hidden">
                                <LayoutDashboard className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>

                            <div className="flex md:hidden flex-col gap-0.5 border-r pr-1 mr-1">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onMoveUp?.(); }}
                                    disabled={isFirst}
                                    className="p-1 hover:bg-accent rounded-sm disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                    <ChevronUp className="h-3 w-3 text-muted-foreground" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onMoveDown?.(); }}
                                    disabled={isLast}
                                    className="p-1 hover:bg-accent rounded-sm disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                </button>
                            </div>

                            <div className="w-px h-3 bg-border/50 hidden md:block" />

                            <button onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }} className="p-1.5 hover:bg-accent rounded-sm transition-colors">
                                {visible ?
                                    <Eye className="h-3.5 w-3.5 text-muted-foreground" /> :
                                    <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                                }
                            </button>
                        </div>
                    </div>
                </>
            )}
            <div className={cn("h-full transition-all duration-200", isEditing && !visible && "opacity-40 grayscale blur-[1px]")}>
                {children}
            </div>
        </div>
    );
}

function PlaceholderCard({
    title,
    icon: Icon,
    className
}: {
    title: string;
    icon: React.ElementType;
    className?: string;
}) {
    return (
        <div className={cn("flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg bg-muted/30 h-full min-h-[150px] gap-3 text-muted-foreground", className)}>
            <div className="p-3 bg-background rounded-full shadow-sm ring-1 ring-border">
                <Icon className="h-6 w-6" />
            </div>
            <span className="font-medium">{title}</span>
        </div>
    );
}

export default function Home({
    stats,
    recentUserTickets,
    recentUserClosedTickets,
    assignedTickets,
    assignedClosedTickets,
    recentEntries,
    upcomingSchedules,
    recentActivity,
    home_page_mode,
    home_page_layout,
    userTickets,
    is_banner_globally_enabled = true,
}: HomeProps) {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;

    const canSeeAssigned = userHasPermission({
        user: auth.user,
        permission: 'be assigned tickets',
    });
    const canSeeEntries = userHasPermission({
        user: auth.user,
        permission: 'view ticket entries',
    });
    const canSeePlanning = userHasPermission({
        user: auth.user,
        permission: 'view planning',
    });
    const canSeeDashboard = userHasPermission({
        user: auth.user,
        permission: 'view dashboard',
    });

    const [currentMode, setCurrentMode] = useState(home_page_mode);

    const [isEditing, setIsEditing] = useState(false);

    const isWidgetPermitted = (id: string) => {
        switch (id) {
            case 'stat_assigned_open':
            case 'assigned_tickets':
                return canSeeAssigned;
            case 'stat_weekly_hours':
            case 'time_summary':
                return canSeeEntries;
            case 'stat_admin_open':
            case 'stat_admin_unassigned':
            case 'stat_admin_closed_today':
            case 'stat_admin_users':
            case 'activity_feed':
                return canSeeDashboard;
            case 'upcoming_schedules':
                return canSeePlanning;
            default:
                return true;
        }
    };

    const filterLayout = (layout: DashboardLayout) => ({
        top: layout.top.filter(w => isWidgetPermitted(w.id)),
        left: layout.left.filter(w => isWidgetPermitted(w.id)),
        right: layout.right.filter(w => isWidgetPermitted(w.id)),
        show_banner: layout.show_banner,
    });

    const initializeLayout = () => {
        if (!home_page_layout) return filterLayout(DEFAULT_LAYOUT);

        const currentIds = new Set([
            ...home_page_layout.top.map(w => w.id),
            ...home_page_layout.left.map(w => w.id),
            ...home_page_layout.right.map(w => w.id)
        ]);

        if (currentIds.has('stats_overview' as unknown as WidgetId)) {
            return filterLayout(DEFAULT_LAYOUT);
        }

        const filtered = filterLayout(home_page_layout);

        const missingTop = DEFAULT_LAYOUT.top.filter(w => isWidgetPermitted(w.id) && !currentIds.has(w.id));
        const missingLeft = DEFAULT_LAYOUT.left.filter(w => isWidgetPermitted(w.id) && !currentIds.has(w.id));
        const missingRight = DEFAULT_LAYOUT.right.filter(w => isWidgetPermitted(w.id) && !currentIds.has(w.id));

        filtered.top = [...filtered.top, ...missingTop];
        filtered.left = [...filtered.left, ...missingLeft];
        filtered.right = [...filtered.right, ...missingRight];

        if (home_page_layout.show_banner !== undefined) {
            filtered.show_banner = home_page_layout.show_banner;
        }
        return filtered;
    };

    const [layout, setLayout] = useState<DashboardLayout>(initializeLayout());
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const updateSettings = (mode: 'default' | 'classic') => {
        router.post(route('home.settings'), {
            home_page_mode: mode,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setCurrentMode(mode);
            }
        });
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeId = active.id as string;
        const overId = over.id as string;

        const findContainer = (id: string): WidgetContainer | undefined => {
            const containers: WidgetContainer[] = ['top', 'left', 'right'];
            if (containers.includes(id as WidgetContainer)) return id as WidgetContainer;

            return containers.find(key =>
                (layout[key] as Widget[])?.find(item => item.id === id)
            );
        };

        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId);

        if (activeContainer && overContainer) {
            const isStatWidget = activeId.startsWith('stat_');
            const isTopContainer = overContainer === 'top';

            if (isStatWidget && !isTopContainer) return;
            if (!isStatWidget && isTopContainer) return;

            if (activeContainer !== overContainer) {
                setLayout(prev => {
                    const activeItems = prev[activeContainer] as Widget[];
                    const overItems = prev[overContainer] as Widget[];
                    const activeIndex = activeItems.findIndex(i => i.id === activeId);
                    const overIndex = overItems.findIndex(i => i.id === overId);

                    let newIndex;
                    if (overId in prev) {
                        newIndex = overItems.length + 1;
                    } else {
                        const isBelowOverItem =
                            over &&
                            active.rect.current.translated &&
                            active.rect.current.translated.top >
                            over.rect.top + over.rect.height;

                        const modifier = isBelowOverItem ? 1 : 0;
                        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
                    }

                    return {
                        ...prev,
                        [activeContainer]: [...(prev[activeContainer] as Widget[]).filter(item => item.id !== activeId)],
                        [overContainer]: [
                            ...(prev[overContainer] as Widget[]).slice(0, newIndex),
                            activeItems[activeIndex],
                            ...(prev[overContainer] as Widget[]).slice(newIndex, (prev[overContainer] as Widget[]).length)
                        ]
                    };
                });
            } else {
                const activeIndex = (layout[activeContainer] as Widget[]).findIndex(i => i.id === activeId);
                const overIndex = (layout[activeContainer] as Widget[]).findIndex(i => i.id === overId);

                if (activeIndex !== overIndex) {
                    setLayout((items) => ({
                        ...items,
                        [activeContainer]: arrayMove((items[activeContainer] as Widget[]), activeIndex, overIndex),
                    }));
                }
            }
        }

        setActiveId(null);
    };

    const toggleWidgetVisibility = (id: string, container: WidgetContainer) => {
        setLayout(prev => ({
            ...prev,
            [container]: (prev[container] as Widget[]).map(item =>
                item.id === id ? { ...item, visible: !item.visible } : item
            )
        }));
    };

    const moveWidget = (id: string, container: WidgetContainer, direction: 'up' | 'down') => {
        setLayout(prev => {
            const items = [...(prev[container] as Widget[])];
            const index = items.findIndex(item => item.id === id);
            if (index === -1) return prev;

            const newIndex = direction === 'up' ? index - 1 : index + 1;
            if (newIndex < 0 || newIndex >= items.length) return prev;

            return {
                ...prev,
                [container]: arrayMove(items, index, newIndex)
            };
        });
    };

    const saveLayout = () => {
        router.post(route('home.settings'), {
            home_page_layout: layout as unknown as Record<string, { id: string; label: string; visible: boolean }[]>,
        }, {
            preserveScroll: true,
            onSuccess: () => setIsEditing(false),
        });
    };

    const cancelLayout = () => {
        setLayout(initializeLayout());
        setIsEditing(false);
    };

    const resetToDefault = () => {
        setLayout(filterLayout(DEFAULT_LAYOUT));
    };



    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('app.layout.sidebar.menugroups.platform.items.home'),
            href: route('home'),
        },
    ];

    const greeting = getGreeting();
    const greetingText = __(`home.greeting.${greeting}`, undefined, { name: auth.user.name });
    const showNewHome = currentMode === 'default';

    const tutorialSteps = showNewHome ? [
        {
            id: 'banner',
            title: __('onboarding.home.banner.title'),
            description: __('onboarding.home.banner.description'),
            targetSelector: '[data-onboarding="banner"]',
            position: 'bottom' as const,
        },
        {
            id: 'quick-actions',
            title: __('onboarding.home.quick_actions.title'),
            description: __('onboarding.home.quick_actions.description'),
            targetSelector: '[data-onboarding="quick-actions"]',
            position: 'bottom' as const,
        },
        {
            id: 'stats',
            title: __('onboarding.home.stats.title'),
            description: __('onboarding.home.stats.description'),
            targetSelector: '[data-onboarding="stats-section"]',
            position: 'bottom' as const,
            disableScroll: true,
        },
        {
            id: 'widgets',
            title: __('onboarding.home.widgets.title'),
            description: __('onboarding.home.widgets.description'),
            targetSelector: '[data-onboarding="widgets-section"]',
            position: 'top' as const,
        },
    ] : [
        {
            id: 'tabs',
            title: __('onboarding.home.tabs.title'),
            description: __('onboarding.home.tabs.description'),
            targetSelector: '[data-onboarding="tabs"]',
            position: 'bottom' as const,
        },
        {
            id: 'open-tickets',
            title: __('onboarding.home.open_column.title'),
            description: __('onboarding.home.open_column.description'),
            targetSelector: '[data-onboarding="open-tickets"]',
            position: 'bottom' as const,
        },
        {
            id: 'closed-tickets',
            title: __('onboarding.home.closed_column.title'),
            description: __('onboarding.home.closed_column.description'),
            targetSelector: '[data-onboarding="closed-tickets"]',
            position: 'top' as const,
        },
    ];

    const isAdmin = auth.user.roles?.some(role => role.name === 'admin') ?? false;

    const showBanner = !showNewHome && (isAdmin || is_banner_globally_enabled);
    const isBannerHiddenForUsers = !is_banner_globally_enabled;

    const toggleGlobalBanner = () => {
        router.post(route('home.toggle-global-banner'), {}, { preserveScroll: true });
    };


    const renderWidget = (id: string) => {
        if (!stats) return null;

        switch (id) {
            case 'stat_open':
                return (
                    <StatsCard
                        title={__('home.stats.my_open_tickets')}
                        value={stats.user.open}
                        icon={TicketIcon}
                        description={__('home.stats.my_open_tickets_desc')}
                        tooltip={__('home.descriptions.my_open_tickets')}
                        onClick={() => router.visit(route('tickets.index', { status: 'open', author: 'me' }))}
                    />
                );
            case 'stat_closed':
                return (
                    <StatsCard
                        title={__('home.stats.my_closed_tickets')}
                        value={stats.user.closed}
                        icon={CheckCircle2}
                        colorClass="text-green-500"
                        description={__('home.stats.last_30_days')}
                        tooltip={__('home.descriptions.my_closed_tickets')}
                    />
                );
            case 'stat_assigned_open':
                return canSeeAssigned && stats.assigned ? (
                    <StatsCard
                        title={__('home.stats.assigned_open')}
                        value={stats.assigned.open}
                        icon={AlertCircle}
                        colorClass="text-orange-500"
                        description={__('home.stats.needs_attention')}
                        tooltip={__('home.descriptions.assigned_open_tickets')}
                        onClick={() => router.visit(route('tickets.index', { status: 'open', assigned: 'me' }))}
                    />
                ) : null;
            case 'stat_weekly_hours':
                return canSeeEntries ? (
                    <StatsCard
                        title={__('home.stats.weekly_hours')}
                        value={`${stats.weekly_hours ?? 0}h`}
                        icon={Timer}
                        colorClass="text-blue-500"
                        description={__('home.stats.this_week')}
                        tooltip={__('home.descriptions.weekly_hours')}
                        onClick={() => router.visit(route('tickets.entries.index'))}
                    />
                ) : null;
            case 'stat_admin_open':
                return canSeeDashboard && stats.admin ? (
                    <StatsCard
                        title={__('home.stats.total_open')}
                        value={stats.admin.total_open}
                        icon={LayoutDashboard}
                        colorClass="text-purple-500"
                        description={__('home.stats.system_wide')}
                        tooltip={__('home.descriptions.total_open')}
                    />
                ) : null;
            case 'stat_admin_unassigned':
                return canSeeDashboard && stats.admin ? (
                    <StatsCard
                        title={__('home.stats.unassigned')}
                        value={stats.admin.unassigned}
                        icon={AlertCircle}
                        colorClass="text-red-500"
                        description={__('home.stats.needs_assignment')}
                        tooltip={__('home.descriptions.unassigned')}
                    />
                ) : null;
            case 'stat_admin_closed_today':
                return canSeeDashboard && stats.admin ? (
                    <StatsCard
                        title={__('home.stats.closed_today')}
                        value={stats.admin.closed_today}
                        icon={CheckCircle2}
                        colorClass="text-emerald-500"
                        description={__('home.stats.today')}
                        tooltip={__('home.descriptions.closed_today')}
                    />
                ) : null;
            case 'stat_admin_users':
                return canSeeDashboard && stats.admin ? (
                    <StatsCard
                        title={__('home.stats.total_users')}
                        value={stats.admin.total_users}
                        icon={Users}
                        colorClass="text-indigo-500"
                        onClick={() => router.visit(route('users.index'))}
                        description={__('home.stats.total_users_desc')}
                        tooltip={__('home.descriptions.total_users')}
                    />
                ) : null;

            case 'my_recent_tickets':
                if (isEditing) return <PlaceholderCard title={__('home.sections.my_recent_tickets')} icon={TicketIcon} />;
                return recentUserTickets ? (
                    <RecentTickets
                        tickets={recentUserTickets}
                        closedTickets={recentUserClosedTickets || []}
                        title={__('home.sections.my_recent_tickets')}
                        emptyMessage={__('home.messages.no_open_tickets')}
                    />
                ) : null;
            case 'time_summary':
                if (!canSeeEntries) return null;
                if (isEditing) return <PlaceholderCard title={__('home.stats.time_summary')} icon={Timer} />;
                return (
                    <TimeSummary
                        weeklyHours={stats?.weekly_hours ?? 0}
                        recentEntries={recentEntries || []}
                    />
                );
            case 'assigned_tickets':
                if (!canSeeAssigned) return null;
                if (isEditing) return <PlaceholderCard title={__('home.sections.assigned_to_me')} icon={AlertCircle} />;
                return assignedTickets ? (
                    <RecentTickets
                        tickets={Array.isArray(assignedTickets) ? assignedTickets : []}
                        closedTickets={assignedClosedTickets || []}
                        title={__('home.sections.assigned_to_me')}
                        emptyMessage={__('home.messages.no_assigned_tickets')}
                        showAuthor
                    />
                ) : null;
            case 'upcoming_schedules':
                if (!canSeePlanning) return null;
                if (isEditing) return <PlaceholderCard title={__('home.sections.upcoming_schedules')} icon={Clock} />;
                return (
                    <UpcomingSchedules
                        schedules={upcomingSchedules || []}
                    />
                );
            case 'activity_feed':
                if (!canSeeDashboard) return null;
                if (isEditing) return <PlaceholderCard title={__('home.sections.activity_feed')} icon={LayoutDashboard} />;
                return (
                    <ActivityFeed
                        recentActivity={recentActivity || []}
                    />
                );
            default: return null;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('app.layout.sidebar.menugroups.platform.items.home')} />

            <div className="container mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {showBanner && userTickets && (
                    <div className="space-y-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    {greetingText}
                                </h1>
                                <p className="text-muted-foreground">{__('home.pages.description')}</p>
                            </div>
                        </div>
                        <div className={cn(
                            "relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm group transition-all",
                            isBannerHiddenForUsers && "opacity-75"
                        )} data-onboarding="banner">
                            <div className="flex items-center justify-between gap-4 relative z-10">
                                <div className="space-y-1">
                                    <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
                                        <Rocket className="h-4 w-4 text-indigo-500" />
                                        {__('home.banner.title')}
                                        {isAdmin && (
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "ml-2 cursor-pointer transition-colors hover:bg-opacity-80 py-0.5 px-2 h-auto text-[10px] select-none",
                                                    isBannerHiddenForUsers
                                                        ? "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200"
                                                        : "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                                                )}
                                                onClick={(e: React.MouseEvent) => {
                                                    e.stopPropagation();
                                                    toggleGlobalBanner();
                                                }}
                                            >
                                                {isBannerHiddenForUsers ? (
                                                    <span className="flex items-center gap-1">
                                                        <EyeOff className="h-3 w-3" />
                                                        {__('home.banner.hidden')}
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="h-3 w-3" />
                                                        {__('home.banner.visible')}
                                                    </span>
                                                )}
                                            </Badge>
                                        )}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {__('home.banner.description')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button onClick={() => updateSettings('default')} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                                        {__('home.banner.button')}
                                    </Button>
                                </div>
                            </div>
                            <div className="absolute -top-12 -right-12 h-32 w-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
                            <div className="absolute -bottom-12 -left-12 h-32 w-32 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
                        </div>

                    </div>
                )}

                {!showBanner && !showNewHome && (
                    <div className="flex items-center justify-between mb-6">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight">
                                {greetingText}
                            </h1>
                            <p className="text-muted-foreground">{__('home.pages.description')}</p>
                        </div>
                        <Button variant="outline" onClick={() => updateSettings('default')} className="gap-2" data-onboarding="banner">
                            <Rocket className="h-4 w-4 text-indigo-500" />
                            {__('home.banner.button')}
                        </Button>
                    </div>
                )}

                {!showNewHome && userTickets && (
                    <Tabs defaultValue="my_tickets" className="w-full space-y-6" data-onboarding="tabs">
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
                                <div className="flex flex-col space-y-4" data-onboarding="open-tickets">
                                    <div className="flex items-center gap-2 px-1">
                                        <Clock className="h-4 w-4 text-orange-500" />
                                        <h3 className="text-sm font-semibold">{__('home.tabs.unresolved')}</h3>
                                    </div>
                                    <TicketTable
                                        data={userTickets.open}
                                        emptyMessage={__('home.messages.no_open_tickets')}
                                    />
                                </div>

                                <div className="flex flex-col space-y-4" data-onboarding="closed-tickets">
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

                        {canSeeAssigned && assignedTickets && (
                            <TabsContent value="assigned_tickets" className="space-y-6 border-none p-0 outline-none">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="flex flex-col space-y-4">
                                        <div className="flex items-center gap-2 px-1">
                                            <Clock className="h-4 w-4 text-orange-500" />
                                            <h3 className="text-sm font-semibold text-primary">{__('home.tabs.assigned_unresolved')}</h3>
                                        </div>
                                        <TicketTable
                                            data={!Array.isArray(assignedTickets) ? assignedTickets.open : null}
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
                                            data={!Array.isArray(assignedTickets) ? assignedTickets.closed : null}
                                            showAuthor={true}
                                            emptyMessage={__('home.messages.no_recent_closed_tickets')}
                                        />
                                    </div>
                                </div>
                            </TabsContent>
                        )}
                    </Tabs>
                )}

                {showNewHome && (
                    <>
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
                            <div className="space-y-1.5">
                                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                    {greetingText}
                                </h1>
                                <p className="text-muted-foreground">{__('home.pages.description')}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 justify-start lg:justify-end" data-onboarding="quick-actions">
                                <QuickActions user={auth.user} />

                                <div className="flex items-center gap-2">
                                    {isEditing ? (
                                        <div className="flex items-center gap-2">
                                            <Button size="sm" onClick={saveLayout}>{__('home.actions.save')}</Button>
                                            <Button size="sm" variant="outline" onClick={resetToDefault}>{__('home.actions.reset_default')}</Button>
                                            <Button size="sm" variant="ghost" onClick={cancelLayout}>{__('home.actions.cancel')}</Button>
                                        </div>
                                    ) : (
                                        <Button size="sm" variant="secondary" onClick={() => setIsEditing(true)}>
                                            {__('home.actions.customize')}
                                        </Button>
                                    )}

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => updateSettings('classic')}
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        {__('home.actions.classic_view')}
                                    </Button>
                                </div>
                            </div>
                        </div>



                        <DndContext
                            sensors={sensors}
                            collisionDetection={rectIntersection}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            modifiers={[restrictToWindowEdges]}
                        >
                            <div className="space-y-6">
                                <SortableContext items={layout.top.map(w => w.id)} strategy={rectSortingStrategy}>
                                    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4" data-onboarding="stats-section">
                                        {layout.top.map((widget, index) => (
                                            <SortableWidget
                                                key={widget.id}
                                                id={widget.id}
                                                isEditing={isEditing}
                                                visible={widget.visible}
                                                onToggleVisibility={() => toggleWidgetVisibility(widget.id, 'top')}
                                                onMoveUp={() => moveWidget(widget.id, 'top', 'up')}
                                                onMoveDown={() => moveWidget(widget.id, 'top', 'down')}
                                                isFirst={index === 0}
                                                isLast={index === layout.top.length - 1}
                                                label={widget.label}
                                            >
                                                {renderWidget(widget.id)}
                                            </SortableWidget>
                                        ))}
                                    </div>
                                </SortableContext>

                                <div className={cn(
                                    "grid gap-6",
                                    (isEditing || (layout.left.some(w => w.visible) && layout.right.some(w => w.visible)))
                                        ? "lg:grid-cols-2"
                                        : "grid-cols-1"
                                )} data-onboarding="widgets-section">
                                    <SortableContext items={layout.left.map(w => w.id)} strategy={verticalListSortingStrategy}>
                                        <div className="space-y-6">
                                            {layout.left.map((widget, index) => (
                                                <SortableWidget
                                                    key={widget.id}
                                                    id={widget.id}
                                                    isEditing={isEditing}
                                                    visible={widget.visible}
                                                    onToggleVisibility={() => toggleWidgetVisibility(widget.id, 'left')}
                                                    onMoveUp={() => moveWidget(widget.id, 'left', 'up')}
                                                    onMoveDown={() => moveWidget(widget.id, 'left', 'down')}
                                                    isFirst={index === 0}
                                                    isLast={index === layout.left.length - 1}
                                                    label={widget.label}
                                                >
                                                    {renderWidget(widget.id)}
                                                </SortableWidget>
                                            ))}
                                        </div>
                                    </SortableContext>


                                    <SortableContext items={layout.right.map(w => w.id)} strategy={verticalListSortingStrategy}>
                                        <div className="space-y-6">
                                            {layout.right.map((widget, index) => (
                                                <SortableWidget
                                                    key={widget.id}
                                                    id={widget.id}
                                                    isEditing={isEditing}
                                                    visible={widget.visible}
                                                    onToggleVisibility={() => toggleWidgetVisibility(widget.id, 'right')}
                                                    onMoveUp={() => moveWidget(widget.id, 'right', 'up')}
                                                    onMoveDown={() => moveWidget(widget.id, 'right', 'down')}
                                                    isFirst={index === 0}
                                                    isLast={index === layout.right.length - 1}
                                                    label={widget.label}
                                                >
                                                    {renderWidget(widget.id)}
                                                </SortableWidget>
                                            ))}
                                        </div>
                                    </SortableContext>
                                </div>
                            </div>

                            <DragOverlay dropAnimation={{
                                duration: 250,
                                easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
                            }}>
                                {activeId ? (
                                    <div className="opacity-90 rotate-2 scale-105 cursor-grabbing shadow-2xl rounded-xl ring-2 ring-primary">
                                        {renderWidget(activeId)}
                                    </div>
                                ) : null}
                            </DragOverlay>
                        </DndContext>
                    </>
                )}

            </div>
            <PageTutorial page="home" steps={tutorialSteps} />
        </AppLayout>
    );
}