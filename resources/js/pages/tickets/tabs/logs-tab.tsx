import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TabsContent } from '@/components/ui/tabs';
import { useInitials } from '@/hooks/use-initials';
import { useTrans } from '@/lib/translation';
import { TicketLog } from '@/types';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import {
    CalendarClock,
    ChevronLeft,
    ChevronRight,
    FileText,
    History,
    MessageSquare,
    Search,
    Trash2,
    UserMinus,
    UserPlus,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface Props {
    logs: TicketLog[];
}

export function LogsTab({ logs }: Props) {
    const __ = useTrans();
    const getInitials = useInitials();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredLogs = useMemo(() => {
        const reversed = [...logs].reverse();
        if (!searchQuery.trim()) return reversed;

        const query = searchQuery.toLowerCase();
        return reversed.filter((log) => {
            return (
                log.user.name.toLowerCase().includes(query) ||
                log.action.toLowerCase().includes(query) ||
                log.field?.toLowerCase().includes(query) ||
                log.old_value?.toLowerCase().includes(query) ||
                log.new_value?.toLowerCase().includes(query)
            );
        });
    }, [logs, searchQuery]);

    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const paginatedLogs = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredLogs.slice(start, start + itemsPerPage);
    }, [filteredLogs, currentPage]);

    const getActionData = (log: TicketLog) => {
        const baseKey = 'tickets.pages.show.tabs.logs_content.actions';
        switch (log.action) {
            case 'created':
                return { label: __(baseKey + '.created'), icon: null };
            case 'updated':
                return {
                    label: `${__(baseKey + '.updated')} : ${log.field}`,
                    icon: <FileText className="h-3 w-3" />,
                };
            case 'commented':
                return {
                    label: __(baseKey + '.commented'),
                    icon: <MessageSquare className="h-3 w-3" />,
                };
            case 'comment_deleted':
                return {
                    label: __(baseKey + '.comment_deleted'),
                    icon: <Trash2 className="h-3 w-3 text-destructive" />,
                };
            case 'time_logged':
                return { label: __(baseKey + '.time_logged'), icon: null };
            case 'scheduled':
                return {
                    label: __(baseKey + '.scheduled'),
                    icon: <CalendarClock className="h-3 w-3" />,
                };
            case 'schedule_updated':
                return {
                    label:
                        log.field === 'Priorité'
                            ? __(baseKey + '.priority_changed')
                            : __(baseKey + '.schedule_updated'),
                    icon: <CalendarClock className="h-3 w-3" />,
                };
            case 'assigned':
                return {
                    label: __(baseKey + '.assigned'),
                    icon: <UserPlus className="h-3 w-3 text-primary" />,
                };
            case 'unassigned':
                return {
                    label: __(baseKey + '.unassigned'),
                    icon: <UserMinus className="h-3 w-3 text-destructive" />,
                };
            default:
                return { label: log.action, icon: null };
        }
    };

    if (!logs || logs.length === 0) {
        return (
            <TabsContent
                value="logs"
                className="mt-0 border-none p-0 outline-none"
            >
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <History className="h-10 w-10 opacity-20" />
                    <p className="mt-4 text-sm">
                        {__('tickets.pages.show.tabs.logs_content.empty')}
                    </p>
                </div>
            </TabsContent>
        );
    }

    return (
        <TabsContent
            value="logs"
            className="mt-0 space-y-6 border-none p-0 outline-none"
        >
            <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder={__(
                        'tickets.pages.show.tabs.logs_content.search_placeholder',
                    )}
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>

            <div className="relative min-h-[200px] space-y-4 before:absolute before:inset-y-0 before:left-5 before:w-px before:bg-border" data-onboarding="logs-table">
                {paginatedLogs.map((log) => {
                    const action = getActionData(log);
                    const isChange = log.action === 'updated';

                    return (
                        <div key={log.id} className="relative pl-12">
                            <div
                                className="absolute top-4 z-10 h-3 w-3 rounded-full border-2 border-background bg-primary shadow-sm"
                                style={{ left: '14.5px' }}
                            />

                            <div className="rounded-xl border bg-card p-4 shadow-sm transition-colors hover:bg-accent/5">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8 border">
                                        <AvatarImage
                                            src={
                                                log.user.avatar?.url ??
                                                undefined
                                            }
                                        />
                                        <AvatarFallback>
                                            {getInitials(log.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm leading-none font-medium">
                                            <span className="font-bold">
                                                {log.user.name}
                                            </span>{' '}
                                            {action.label}
                                        </p>
                                        <p className="mt-1 text-[10px] font-semibold text-muted-foreground uppercase">
                                            {format(
                                                new Date(log.created_at),
                                                "PPP 'at' HH:mm",
                                                { locale: enUS },
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {isChange && (
                                    <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-muted/50 p-2 text-[11px]">
                                        <div className="border-r border-border/50 pr-2">
                                            <span className="block text-[9px] font-bold text-muted-foreground uppercase">
                                                {__(
                                                    'tickets.pages.show.tabs.logs_content.old_value',
                                                )}
                                            </span>
                                            <span className="break-words line-through opacity-70">
                                                {log.old_value ||
                                                    __(
                                                        'tickets.pages.show.tabs.logs_content.empty_value',
                                                    )}
                                            </span>
                                        </div>
                                        <div className="pl-2">
                                            <span className="block text-[9px] font-bold text-primary uppercase">
                                                {__(
                                                    'tickets.pages.show.tabs.logs_content.new_value',
                                                )}
                                            </span>
                                            <span className="font-semibold break-words text-primary">
                                                {log.new_value ||
                                                    __(
                                                        'tickets.pages.show.tabs.logs_content.empty_value',
                                                    )}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {log.action !== 'updated' &&
                                    (log.new_value || log.old_value) && (
                                        <div className="mt-2 flex items-start gap-2 border-l-2 border-primary/20 bg-accent/5 py-1.5 pl-3 text-xs text-muted-foreground italic">
                                            <div className="mt-0.5 shrink-0">
                                                {action.icon}
                                            </div>
                                            <span className="break-words">
                                                {log.new_value || log.old_value}
                                            </span>
                                        </div>
                                    )}
                            </div>
                        </div>
                    );
                })}

                {filteredLogs.length === 0 && (
                    <div className="py-10 text-center text-sm text-muted-foreground">
                        {__('tickets.pages.show.tabs.logs_content.no_results')}
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t pt-4">
                    <p className="text-xs text-muted-foreground">
                        {__(
                            'tickets.pages.show.tabs.logs_content.pagination_info',
                        )
                            .replace(':current', currentPage.toString())
                            .replace(':total', totalPages.toString())
                            .replace(':count', filteredLogs.length.toString())}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setCurrentPage((p) => Math.max(1, p - 1))
                            }
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setCurrentPage((p) =>
                                    Math.min(totalPages, p + 1),
                                )
                            }
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </TabsContent>
    );
}
