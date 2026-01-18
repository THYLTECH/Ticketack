import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTrans } from '@/lib/translation';
import { formatDate, formatDateTime } from '@/lib/utils';
import { Ticket } from '@/types';
import { Activity, ChevronRight, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface ActivityFeedProps {
    recentActivity: Ticket[];
}

export function ActivityFeed({ recentActivity }: ActivityFeedProps) {
    const __ = useTrans();
    const [isExpanded, setIsExpanded] = useState(false);
    const limit = 5;

    const displayedActivity = isExpanded ? recentActivity : recentActivity.slice(0, limit);
    const hasMore = recentActivity.length > limit;

    if (!recentActivity || recentActivity.length === 0) {
        return (
            <Card className="overflow-hidden border-border/50 bg-background/50 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 py-4 space-y-0">
                    <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
                        <Activity className="h-4 w-4 text-primary" />
                        {__('home.sections.recent_activity')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="rounded-full bg-muted/50 p-3 mb-3 ring-1 ring-border/50">
                        <Activity className="h-6 w-6 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {__('home.activity.no_recent')}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden border-border/50 bg-background/50 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-shadow duration-300 hover:shadow-sm">
            <CardHeader className="border-b border-border/40 py-4">
                <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
                    <Activity className="h-4 w-4 text-primary" />
                    {__('home.sections.recent_activity')}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <ul className="divide-y divide-border/40">
                    {displayedActivity.map((ticket) => (
                        <li key={ticket.id}>
                            <Link
                                href={route('tickets.show', { ticket: ticket.id })}
                                className="group flex items-center gap-4 p-4 transition-all duration-200 hover:bg-primary/5 hover:pl-5"
                            >
                                <div
                                    className="h-2.5 w-2.5 shrink-0 rounded-full shadow-sm ring-2 ring-background"
                                    style={{ backgroundColor: ticket.status?.color || '#6b7280' }}
                                />

                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                                            #{ticket.id}
                                        </span>
                                        {ticket.status && (
                                            <Badge
                                                variant="outline"
                                                className="h-5 px-1.5 text-[10px] font-medium border-transparent bg-opacity-10"
                                                style={{
                                                    backgroundColor: `${ticket.status.color}15`,
                                                    color: ticket.status.color,
                                                }}
                                            >
                                                {ticket.status.title}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm font-medium truncate text-foreground/90 group-hover:text-foreground transition-colors">
                                        {ticket.title}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground/80">
                                        {ticket.user && (
                                            <span className="flex items-center gap-1.5">
                                                <div className="h-4 w-4 rounded-full bg-muted flex items-center justify-center text-[9px] font-bold">
                                                    {ticket.user.name.substring(0, 1)}
                                                </div>
                                                {ticket.user.name}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            <span className="hidden sm:inline">{__('common.labels.updated_at')}</span>
                                            {formatDateTime(ticket.updated_at)}
                                        </span>
                                    </div>
                                </div>

                                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/30 group-hover:text-primary transition-all group-hover:translate-x-0.5" />
                            </Link>
                        </li>
                    ))}
                </ul>
                {hasMore && (
                    <div className="border-t border-border/40 bg-muted/5 p-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="h-8 w-full text-xs font-medium text-muted-foreground hover:bg-background hover:text-foreground"
                        >
                            {isExpanded ? (
                                <>
                                    <ChevronUp className="mr-1.5 h-3 w-3" />
                                    {__('common.actions.read_less')}
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="mr-1.5 h-3 w-3" />
                                    {__('common.actions.read_more')}
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
