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
} from 'lucide-react';

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
    stats: HomeStats;
    recentUserTickets: Ticket[];
    recentUserClosedTickets: Ticket[];
    assignedTickets: Ticket[] | null;
    assignedClosedTickets: Ticket[] | null;
    recentEntries: TicketEntry[] | null;
    upcomingSchedules: TicketSchedule[] | null;
    recentActivity: Ticket[] | null;
}

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
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

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('app.layout.sidebar.menugroups.platform.items.home'),
            href: route('home'),
        },
    ];

    const greeting = getGreeting();
    const greetingText = __(`home.greeting.${greeting}`, undefined, { name: auth.user.name });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('app.layout.sidebar.menugroups.platform.items.home')} />

            <div className="container mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1.5">
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            {greetingText}
                        </h1>
                        <p className="text-muted-foreground">
                            {__('home.pages.description')}
                        </p>
                    </div>
                    <QuickActions user={auth.user} />
                </div>

                <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title={__('home.stats.my_open_tickets')}
                        value={stats.user.open}
                        icon={TicketIcon}
                        description={__('home.stats.my_open_tickets_desc')}
                        tooltip={__('home.descriptions.my_open_tickets')}
                        onClick={() => router.visit(route('tickets.index', { status: 'open', author: 'me' }))}
                    />
                    <StatsCard
                        title={__('home.stats.my_closed_tickets')}
                        value={stats.user.closed}
                        icon={CheckCircle2}
                        colorClass="text-green-500"
                        description={__('home.stats.last_30_days')}
                        tooltip={__('home.descriptions.my_closed_tickets')}
                    />

                    {canSeeAssigned && stats.assigned && (
                        <>
                            <StatsCard
                                title={__('home.stats.assigned_open')}
                                value={stats.assigned.open}
                                icon={AlertCircle}
                                colorClass="text-orange-500"
                                description={__('home.stats.needs_attention')}
                                tooltip={__('home.descriptions.assigned_open_tickets')}
                                onClick={() => router.visit(route('tickets.index', { status: 'open', assigned: 'me' }))}
                            />
                            {canSeeEntries && (
                                <StatsCard
                                    title={__('home.stats.weekly_hours')}
                                    value={`${stats.weekly_hours ?? 0}h`}
                                    icon={Timer}
                                    colorClass="text-blue-500"
                                    description={__('home.stats.this_week')}
                                    tooltip={__('home.descriptions.weekly_hours')}
                                    onClick={() => router.visit(route('tickets.entries.index'))}
                                />
                            )}
                        </>
                    )}

                    {canSeeDashboard && stats.admin && (
                        <>
                            <StatsCard
                                title={__('home.stats.total_open')}
                                value={stats.admin.total_open}
                                icon={LayoutDashboard}
                                colorClass="text-purple-500"
                                description={__('home.stats.system_wide')}
                                tooltip={__('home.descriptions.total_open')}
                            />
                            <StatsCard
                                title={__('home.stats.unassigned')}
                                value={stats.admin.unassigned}
                                icon={AlertCircle}
                                colorClass="text-red-500"
                                description={__('home.stats.needs_assignment')}
                                tooltip={__('home.descriptions.unassigned')}
                            />
                            <StatsCard
                                title={__('home.stats.closed_today')}
                                value={stats.admin.closed_today}
                                icon={CheckCircle2}
                                colorClass="text-emerald-500"
                                description={__('home.stats.today')}
                                tooltip={__('home.descriptions.closed_today')}
                            />
                            <StatsCard
                                title={__('home.stats.total_users')}
                                value={stats.admin.total_users}
                                icon={Users}
                                colorClass="text-indigo-500"
                                onClick={() => router.visit(route('users.index'))}
                                description={__('home.stats.total_users_desc')}
                                tooltip={__('home.descriptions.total_users')}
                            />
                        </>
                    )}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-6">
                        <RecentTickets
                            tickets={recentUserTickets}
                            closedTickets={recentUserClosedTickets}
                            title={__('home.sections.my_recent_tickets')}
                            emptyMessage={__('home.messages.no_open_tickets')}
                        />

                        {canSeeEntries && (
                            <TimeSummary
                                weeklyHours={stats.weekly_hours}
                                recentEntries={recentEntries || []}
                            />
                        )}
                    </div>

                    <div className="space-y-6">
                        {canSeeAssigned && (
                            <RecentTickets
                                tickets={assignedTickets || []}
                                closedTickets={assignedClosedTickets || []}
                                title={__('home.sections.assigned_to_me')}
                                emptyMessage={__('home.messages.no_assigned_tickets')}
                                showAuthor
                            />
                        )}

                        {canSeePlanning && (
                            <UpcomingSchedules
                                schedules={upcomingSchedules || []}
                            />
                        )}

                        {canSeeDashboard && (
                            <ActivityFeed
                                recentActivity={recentActivity || []}
                            />
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}