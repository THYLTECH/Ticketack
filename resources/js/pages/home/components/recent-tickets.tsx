import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTrans } from '@/lib/translation';
import { formatDate, formatDateTime, cn } from '@/lib/utils';
import { Ticket } from '@/types';
import { Ticket as TicketIcon, ChevronRight, Clock, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface RecentTicketsProps {
    tickets: Ticket[];
    closedTickets?: Ticket[];
    title: string;
    emptyMessage: string;
    showAuthor?: boolean;
}

export function RecentTickets({
    tickets,
    closedTickets = [],
    title,
    emptyMessage,
    showAuthor = false,
}: RecentTicketsProps) {
    const __ = useTrans();
    const [isExpanded, setIsExpanded] = useState(false);
    const [filter, setFilter] = useState<'open' | 'closed'>('open');
    const limit = 5;

    const currentTickets = filter === 'open' ? tickets : closedTickets;
    const displayedTickets = isExpanded ? currentTickets : currentTickets.slice(0, limit);
    const hasMore = currentTickets.length > limit;

    return (
        <Card className="overflow-hidden border-border/50 bg-background/50 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-shadow duration-300 hover:shadow-sm">
            <CardHeader className="border-b border-border/40 py-4">
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
                        <TicketIcon className="h-4 w-4 text-primary" />
                        {title}
                        {filter === 'open' && tickets.length > 0 && (
                            <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                {tickets.length}
                            </Badge>
                        )}
                        {filter === 'closed' && closedTickets.length > 0 && (
                            <Badge variant="secondary" className="ml-2 bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
                                {closedTickets.length}
                            </Badge>
                        )}
                    </CardTitle>

                    <div className="flex p-1 bg-muted/50 rounded-lg">
                        <button
                            onClick={() => {
                                setFilter('open');
                                setIsExpanded(false);
                            }}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all",
                                filter === 'open'
                                    ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            )}
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            {__('common.labels.in_progress')}
                        </button>
                        <button
                            onClick={() => {
                                setFilter('closed');
                                setIsExpanded(false);
                            }}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all",
                                filter === 'closed'
                                    ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            )}
                        >
                            <CheckCircle2 className="h-3 w-3" />
                            {__('common.labels.closed')}
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {currentTickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-muted/50 p-4 mb-4 ring-1 ring-border/50">
                            <TicketIcon className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {filter === 'open' ? emptyMessage : __('home.messages.no_closed_tickets')}
                        </p>
                    </div>
                ) : (
                    <>
                        <ul className="divide-y divide-border/40">
                            {displayedTickets.map((ticket) => (
                                <li key={ticket.id}>
                                    <Link
                                        href={route('tickets.show', { ticket: ticket.id })}
                                        className="group flex items-center gap-4 p-4 transition-all duration-200 hover:bg-primary/5 hover:pl-5"
                                    >
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
                                                            borderColor: `${ticket.status.color}30`,
                                                        }}
                                                    >
                                                        {ticket.status.title}
                                                    </Badge>
                                                )}
                                                {ticket.priority && (
                                                    <Badge
                                                        variant="outline"
                                                        className="h-5 px-1.5 text-[10px] font-medium border-transparent bg-opacity-10"
                                                        style={{
                                                            backgroundColor: `${ticket.priority.color}15`,
                                                            color: ticket.priority.color,
                                                        }}
                                                    >
                                                        {ticket.priority.title}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm font-medium truncate text-foreground/90 group-hover:text-foreground transition-colors">
                                                {ticket.title}
                                            </p>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground/80">
                                                {showAuthor && ticket.user && (
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
                    </>
                )}
            </CardContent>
        </Card>
    );
}
