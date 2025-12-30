import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTrans } from '@/lib/translation';
import { cn, formatDate, userHasPermission } from '@/lib/utils';
import { SharedData, Ticket } from '@/types';
import { router } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    ChevronLeft,
    ChevronRight,
    ChevronsUpDown,
    Eye,
    EyeOff,
    Monitor,
    MoreHorizontal,
    Pencil,
    Tag,
    TicketIcon,
    Trash,
} from 'lucide-react';

interface PaginatedTickets {
    data: Ticket[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

interface Props {
    tickets: PaginatedTickets;
    auth: SharedData['auth'];
}

type SortDirection = 'asc' | 'desc';

export function TicketTable({ tickets, auth }: Props) {
    const __ = useTrans();

    const params = new URLSearchParams(window.location.search);
    const currentSort = params.get('sort') || 'created_at';
    const currentDirection =
        (params.get('direction') as SortDirection) || 'desc';

    const handleSort = (column: string) => {
        const newDirection =
            currentSort === column && currentDirection === 'desc'
                ? 'asc'
                : 'desc';
        const newParams = new URLSearchParams(window.location.search);
        newParams.set('sort', column);
        newParams.set('direction', newDirection);
        newParams.delete('page');

        router.get(
            route('tickets.index'),
            Object.fromEntries(newParams.entries()),
            { preserveState: true, replace: true },
        );
    };

    const handleArchive = (id: number) => {
        if (confirm(__('tickets.archive.confirm'))) {
            router.delete(route('tickets.destroy', id));
        }
    };

    const SortableHead = ({
        label,
        column,
        className,
    }: {
        label: string;
        column: string;
        className?: string;
    }) => {
        const isActive = currentSort === column;

        return (
            <TableHead className={className}>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort(column)}
                    className={cn(
                        '-ml-3 h-8 text-xs font-semibold tracking-wider uppercase transition-colors',
                        isActive
                            ? 'font-bold text-foreground'
                            : 'text-muted-foreground/70 hover:text-foreground',
                        className?.includes('text-right') && 'ml-auto',
                    )}
                >
                    {label}
                    <div className="ml-2 flex flex-col">
                        {isActive ? (
                            currentDirection === 'asc' ? (
                                <ArrowUp className="h-3.5 w-3.5 text-primary" />
                            ) : (
                                <ArrowDown className="h-3.5 w-3.5 text-primary" />
                            )
                        ) : (
                            <ChevronsUpDown className="h-3.5 w-3.5 opacity-30" />
                        )}
                    </div>
                </Button>
            </TableHead>
        );
    };

    if (tickets.data.length === 0) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 ring-1 ring-border">
                    <TicketIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">
                        {__('tickets.pages.index.empty.title')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {__('tickets.pages.index.empty.description')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            <div className="overflow-hidden rounded-lg border bg-background shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent">
                            <SortableHead
                                column="title"
                                label={__('tickets.column.title')}
                                className="w-[300px] pl-6"
                            />
                            <SortableHead
                                column="status_id"
                                label={__('tickets.column.status')}
                                className="w-[120px]"
                            />
                            <TableHead className="w-[60px] text-center text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                <Eye className="mx-auto h-3.5 w-3.5 opacity-70" />
                            </TableHead>
                            <SortableHead
                                column="priority_id"
                                label={__('tickets.column.priority')}
                                className="w-[120px]"
                            />
                            <TableHead className="hidden text-xs font-semibold tracking-wider text-muted-foreground uppercase md:table-cell">
                                {__('tickets.column.category')}
                            </TableHead>
                            <TableHead className="hidden text-xs font-semibold tracking-wider text-muted-foreground uppercase lg:table-cell">
                                {__('tickets.filters.equipment')}
                            </TableHead>
                            <TableHead className="hidden text-xs font-semibold tracking-wider text-muted-foreground uppercase xl:table-cell">
                                {__('tickets.column.assignee')}
                            </TableHead>
                            <SortableHead
                                column="created_at"
                                label={__('tickets.column.created_at')}
                                className="hidden text-right xl:table-cell"
                            />
                            <SortableHead
                                column="updated_at"
                                label={__('tickets.column.updated_at')}
                                className="hidden text-right 2xl:table-cell"
                            />
                            <TableHead className="w-[60px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tickets.data.map((ticket) => (
                            <TableRow
                                key={ticket.id}
                                className="group h-16 cursor-pointer transition-all hover:bg-muted/40"
                                onClick={() =>
                                    userHasPermission({
                                        user: auth.user,
                                        permission: 'show tickets',
                                    }) &&
                                    router.get(route('tickets.show', ticket.id))
                                }
                            >
                                <TableCell className="pl-6 align-middle">
                                    <div className="flex flex-col">
                                        <span className="line-clamp-1 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                                            {ticket.title}
                                        </span>
                                        <span className="font-mono text-[10px] text-muted-foreground">
                                            #{ticket.id}
                                        </span>
                                    </div>
                                </TableCell>

                                <TableCell className="align-middle">
                                    {ticket.status && (
                                        <Badge
                                            variant="outline"
                                            className="rounded-md border-transparent px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase"
                                            style={{
                                                backgroundColor: `${ticket.status.color}25`,
                                                color: ticket.status.color,
                                                border: `1px solid ${ticket.status.color}40`,
                                            }}
                                        >
                                            {ticket.status.title}
                                        </Badge>
                                    )}
                                </TableCell>

                                <TableCell className="text-center align-middle">
                                    {ticket.is_public ? (
                                        <Eye className="mx-auto h-4 w-4 text-emerald-500/70" />
                                    ) : (
                                        <EyeOff className="mx-auto h-4 w-4 text-muted-foreground/30" />
                                    )}
                                </TableCell>

                                <TableCell className="align-middle">
                                    <div className="flex items-center gap-2">
                                        {ticket.priority && (
                                            <div
                                                className="h-2 w-2 rounded-full ring-1 ring-black/10 ring-inset dark:ring-white/10"
                                                style={{
                                                    backgroundColor:
                                                        ticket.priority.color,
                                                }}
                                            />
                                        )}
                                        <span className="text-xs font-medium text-muted-foreground">
                                            {ticket.priority?.title}
                                        </span>
                                    </div>
                                </TableCell>

                                <TableCell className="hidden align-middle md:table-cell">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Tag className="h-3.5 w-3.5 opacity-50" />
                                        {ticket.category?.title || '-'}
                                    </div>
                                </TableCell>

                                <TableCell className="hidden align-middle lg:table-cell">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Monitor className="h-3.5 w-3.5 opacity-50" />
                                        {ticket.asset?.title || '-'}
                                    </div>
                                </TableCell>

                                <TableCell className="hidden align-middle xl:table-cell">
                                    {ticket.assignees?.length > 0 ? (
                                        <div className="flex -space-x-2 overflow-hidden py-1">
                                            {ticket.assignees
                                                .slice(0, 3)
                                                .map((assignee) => (
                                                    <TooltipProvider
                                                        key={assignee.id}
                                                    >
                                                        <Tooltip
                                                            delayDuration={300}
                                                        >
                                                            <TooltipTrigger>
                                                                <Avatar className="h-6 w-6 border-2 border-background ring-1 ring-border/10 transition-transform hover:z-10 hover:scale-110">
                                                                    <AvatarImage
                                                                        src={
                                                                            assignee
                                                                                .user
                                                                                .avatar
                                                                                ?.url ??
                                                                            undefined
                                                                        }
                                                                    />
                                                                    <AvatarFallback className="bg-muted text-[8px] font-bold">
                                                                        {assignee.user.name
                                                                            .substring(
                                                                                0,
                                                                                2,
                                                                            )
                                                                            .toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="text-xs">
                                                                {
                                                                    assignee
                                                                        .user
                                                                        .name
                                                                }
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                ))}
                                            {ticket.assignees.length > 3 && (
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-[9px] font-medium text-muted-foreground ring-1 ring-border/10">
                                                    +
                                                    {ticket.assignees.length -
                                                        3}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-muted-foreground/30 italic">
                                            {__(
                                                'tickets.pages.show.tabs.info_content.no_assignees',
                                            )}
                                        </span>
                                    )}
                                </TableCell>

                                <TableCell className="hidden text-right align-middle text-xs text-muted-foreground tabular-nums xl:table-cell">
                                    {formatDate(ticket.created_at)}
                                </TableCell>
                                <TableCell className="hidden text-right align-middle text-xs text-muted-foreground tabular-nums 2xl:table-cell">
                                    {formatDate(ticket.updated_at)}
                                </TableCell>

                                <TableCell className="pr-4 text-right align-middle">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            asChild
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground/60 transition-all hover:bg-muted hover:text-foreground"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    router.get(
                                                        route(
                                                            'tickets.show',
                                                            ticket.id,
                                                        ),
                                                    )
                                                }
                                            >
                                                <Eye className="mr-2 h-4 w-4" />{' '}
                                                {__(
                                                    'tickets.pages.show.head_title',
                                                )}
                                            </DropdownMenuItem>
                                            {userHasPermission({
                                                user: auth.user,
                                                permission: 'update tickets',
                                            }) && (
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        router.get(
                                                            route(
                                                                'tickets.edit',
                                                                ticket.id,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />{' '}
                                                    {__(
                                                        'tickets.pages.form.buttons.edit',
                                                    )}
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleArchive(ticket.id)
                                                }
                                                className="text-destructive focus:text-destructive"
                                            >
                                                <Trash className="mr-2 h-4 w-4" />{' '}
                                                {__(
                                                    'tickets.pages.form.buttons.delete',
                                                )}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {tickets.total > tickets.per_page && (
                <div className="flex items-center justify-between px-2">
                    <div className="text-[10px] tracking-wider text-muted-foreground uppercase">
                        {__(
                            'tickets.pages.show.tabs.logs_content.pagination_info',
                        )
                            .replace(
                                ':current',
                                tickets.current_page.toString(),
                            )
                            .replace(':total', tickets.last_page.toString())
                            .replace(':count', tickets.total.toString())}
                    </div>
                    <div className="flex items-center space-x-1">
                        {tickets.links.map((link, i) => {
                            const label = link.label.includes('Previous')
                                ? 'prev'
                                : link.label.includes('Next')
                                  ? 'next'
                                  : link.label;
                            return (
                                <Button
                                    key={i}
                                    variant={
                                        link.active ? 'default' : 'outline'
                                    }
                                    size="sm"
                                    className={cn(
                                        'h-8 w-8 p-0',
                                        !link.url &&
                                            'pointer-events-none opacity-50',
                                    )}
                                    onClick={() =>
                                        link.url &&
                                        router.get(
                                            link.url,
                                            {},
                                            {
                                                preserveState: true,
                                                preserveScroll: true,
                                            },
                                        )
                                    }
                                >
                                    {label === 'prev' ? (
                                        <ChevronLeft className="h-4 w-4" />
                                    ) : label === 'next' ? (
                                        <ChevronRight className="h-4 w-4" />
                                    ) : (
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: label,
                                            }}
                                        />
                                    )}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
