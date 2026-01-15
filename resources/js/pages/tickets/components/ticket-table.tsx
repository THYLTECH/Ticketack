import { SortableTableHead } from '@/components/sortable-table-head';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { GetIcon } from '@/lib/render';
import { useTrans } from '@/lib/translation';
import { userHasPermission } from '@/lib/utils';
import { SharedData, Ticket } from '@/types';
import { router } from '@inertiajs/react';
import {
    Archive,
    ArchiveRestore,
    Eye,
    Flag,
    MoreHorizontal,
    Pencil,
    TicketIcon,
    Trash,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
    tickets: {
        data: Ticket[];
    };
    auth: SharedData['auth'];
}

type SortDirection = 'asc' | 'desc';

export function TicketTable({ tickets, auth }: Props) {
    const __ = useTrans();
    const [archiveConfirm, setArchiveConfirm] = useState<{
        isOpen: boolean;
        id?: number;
    }>({ isOpen: false });
    const [unarchiveConfirm, setUnarchiveConfirm] = useState<{
        isOpen: boolean;
        id?: number;
    }>({ isOpen: false });
    const [deleteConfirm, setDeleteConfirm] = useState<{
        isOpen: boolean;
        id?: number;
    }>({ isOpen: false });

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
            { preserveState: true, replace: true, preserveScroll: true },
        );
    };

    const initiateArchive = (id: number) => {
        setArchiveConfirm({ isOpen: true, id });
    };

    const confirmArchive = () => {
        if (archiveConfirm.id) {
            router.post(route('tickets.archive', archiveConfirm.id), {}, {
                preserveScroll: true,
                onFinish: () => setArchiveConfirm({ isOpen: false }),
            });
        }
    };

    const initiateUnarchive = (id: number) => {
        setUnarchiveConfirm({ isOpen: true, id });
    };

    const confirmUnarchive = () => {
        if (unarchiveConfirm.id) {
            router.post(route('tickets.unarchive', unarchiveConfirm.id), {}, {
                preserveScroll: true,
                onFinish: () => setUnarchiveConfirm({ isOpen: false }),
            });
        }
    };

    const initiateDelete = (id: number) => {
        setDeleteConfirm({ isOpen: true, id });
    };

    const confirmDelete = () => {
        if (deleteConfirm.id) {
            router.delete(route('tickets.destroy', deleteConfirm.id), {
                preserveScroll: true,
                onFinish: () => setDeleteConfirm({ isOpen: false }),
            });
        }
    };

    if (tickets.data.length === 0) {
        const description = __('tickets.pages.index.empty.description')
            .replace('{type}', 'tickets')
            .replace(':type', 'tickets');

        return (
            <div className="flex min-h-100 flex-col items-center justify-center gap-3 rounded-lg border border-dashed text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 ring-1 ring-border">
                    <TicketIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">
                        {__('tickets.pages.index.empty.title')}
                    </h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            <div className="block space-y-3 lg:hidden">
                {tickets.data.map((ticket) => {
                    const validAssignees = ticket.assignees?.filter((a) => a.user);
                    const isAdmin = auth.user.roles?.some((r) => r.name === 'admin');
                    const isAssigned = ticket.assignees?.some((a) => a.user?.id === auth.user.id);
                    const isAuthor = ticket.user?.id === auth.user.id;
                    const canArchive = isAdmin || isAssigned;

                    return (
                        <Card
                            key={ticket.id}
                            className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border-border/60 bg-linear-to-br from-card to-card/80 cursor-pointer"
                            onClick={() => router.get(route('tickets.show', ticket.id))}
                        >
                            <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <CardContent className="relative p-4 space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-muted/40 group-hover:bg-muted/60 transition-colors min-w-0">
                                        <TicketIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                        <span className="font-mono text-xs font-semibold text-foreground truncate">
                                            {ticket.id}
                                        </span>
                                    </div>
                                    {ticket.status && (
                                        <Badge
                                            variant="outline"
                                            className="text-xs shadow-sm shrink-0"
                                            style={{
                                                borderColor: ticket.status.color,
                                                color: ticket.status.color,
                                            }}
                                        >
                                            {ticket.status.title}
                                        </Badge>
                                    )}
                                </div>

                                <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                    {ticket.title}
                                </h3>

                                <div className="flex flex-wrap gap-2">
                                    {ticket.priority && (
                                        <Badge
                                            variant="outline"
                                            className="gap-1.5 text-xs shadow-sm"
                                            style={{ borderColor: ticket.priority.color }}
                                        >
                                            <Flag className="h-3 w-3" style={{ color: ticket.priority.color }} />
                                            <span style={{ color: ticket.priority.color }}>
                                                {ticket.priority.title}
                                            </span>
                                        </Badge>
                                    )}
                                    {ticket.category && (
                                        <Badge
                                            variant="outline"
                                            className="text-xs shadow-sm"
                                            style={{
                                                borderColor: ticket.category.color,
                                                color: ticket.category.color,
                                            }}
                                        >
                                            {ticket.category.title}
                                        </Badge>
                                    )}
                                </div>

                                {validAssignees && validAssignees.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {validAssignees.slice(0, 3).map((assignee) => (
                                                <TooltipProvider key={assignee.user.id}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Avatar className="h-6 w-6 border-2 border-background">
                                                                <AvatarImage
                                                                    src={assignee.user.avatar?.url}
                                                                    alt={assignee.user.name}
                                                                />
                                                                <AvatarFallback className="text-[10px]">
                                                                    {assignee.user.name.substring(0, 2).toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p className="text-xs">{assignee.user.name}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            ))}
                                            {validAssignees.length > 3 && (
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium">
                                                    +{validAssignees.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/40 text-xs text-muted-foreground">
                                        <Avatar className="h-4 w-4">
                                            <AvatarImage src={ticket.user?.avatar?.url} alt={ticket.user?.name} />
                                            <AvatarFallback className="text-[8px]">
                                                {ticket.user?.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{ticket.user?.name}</span>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground/60 hover:text-foreground"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {userHasPermission({ user: auth.user, permission: 'show tickets' }) && (
                                                <DropdownMenuItem onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.get(route('tickets.show', ticket.id));
                                                }}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    {__('tickets.pages.show.head_title')}
                                                </DropdownMenuItem>
                                            )}
                                            {(isAdmin || isAuthor || isAssigned) &&
                                                userHasPermission({ user: auth.user, permission: 'update tickets' }) && (
                                                    <DropdownMenuItem onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.get(route('tickets.edit', ticket.id));
                                                    }}>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        {__('tickets.pages.form.buttons.edit')}
                                                    </DropdownMenuItem>
                                                )}
                                            {canArchive &&
                                                userHasPermission({ user: auth.user, permission: 'archive tickets' }) && (
                                                    <>
                                                        <DropdownMenuSeparator />
                                                        {ticket.is_archived ? (
                                                            <DropdownMenuItem
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    initiateUnarchive(ticket.id);
                                                                }}
                                                            >
                                                                <ArchiveRestore className="mr-2 h-4 w-4" />
                                                                {__('tickets.pages.form.buttons.unarchive')}
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    initiateArchive(ticket.id);
                                                                }}
                                                            >
                                                                <Archive className="mr-2 h-4 w-4" />
                                                                {__('tickets.pages.form.buttons.archive')}
                                                            </DropdownMenuItem>
                                                        )}
                                                    </>
                                                )}
                                            {canArchive &&
                                                userHasPermission({ user: auth.user, permission: 'delete tickets' }) && (
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            initiateDelete(ticket.id);
                                                        }}
                                                    >
                                                        <Trash className="mr-2 h-4 w-4" />
                                                        {__('tickets.pages.form.buttons.delete')}
                                                    </DropdownMenuItem>
                                                )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="hidden lg:block overflow-hidden rounded-lg border bg-background shadow-sm">
                <div className="relative overflow-x-auto">
                    <Table className="min-w-275">
                        <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent">
                                <SortableTableHead
                                    column="title"
                                    label={__('tickets.column.title')}
                                    currentSort={currentSort}
                                    currentDirection={currentDirection}
                                    onSort={handleSort}
                                    className="w-40 pl-6"
                                />
                                <SortableTableHead
                                    column="status_id"
                                    label={__('tickets.column.status')}
                                    currentSort={currentSort}
                                    currentDirection={currentDirection}
                                    onSort={handleSort}
                                    className="w-32"
                                />
                                <SortableTableHead
                                    column="priority_id"
                                    label={__('tickets.column.priority')}
                                    currentSort={currentSort}
                                    currentDirection={currentDirection}
                                    onSort={handleSort}
                                    className="w-32"
                                />
                                <TableHead className="hidden text-xs font-semibold tracking-wider text-muted-foreground uppercase md:table-cell">
                                    {__('tickets.column.author')}
                                </TableHead>
                                <TableHead className="hidden text-xs font-semibold tracking-wider text-muted-foreground uppercase md:table-cell">
                                    {__('tickets.column.category')}
                                </TableHead>
                                <TableHead className="hidden text-xs font-semibold tracking-wider text-muted-foreground uppercase lg:table-cell">
                                    {__('tickets.filters.equipment')}
                                </TableHead>
                                <TableHead className="hidden text-xs font-semibold tracking-wider text-muted-foreground uppercase xl:table-cell">
                                    {__('tickets.column.assignee')}
                                </TableHead>
                                <SortableTableHead
                                    column="created_at"
                                    label={__('tickets.column.created_at')}
                                    currentSort={currentSort}
                                    currentDirection={currentDirection}
                                    onSort={handleSort}
                                    className="hidden xl:table-cell"
                                />
                                <SortableTableHead
                                    column="updated_at"
                                    label={__('tickets.column.updated_at')}
                                    currentSort={currentSort}
                                    currentDirection={currentDirection}
                                    onSort={handleSort}
                                    className="hidden xl:table-cell"
                                />

                                <TableHead className="sticky right-0 w-12 bg-muted/30 text-center text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    <span className="sr-only">{__('tickets.column.actions')}</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {tickets.data.map((ticket) => {
                                const validAssignees = ticket.assignees?.filter(
                                    (a) => a.user,
                                );

                                const isAdmin = auth.user.roles?.some(
                                    (r) => r.name === 'admin',
                                );
                                const isAssigned = ticket.assignees?.some(
                                    (a) => a.user?.id === auth.user.id,
                                );
                                const canArchive = isAdmin || isAssigned;

                                return (
                                    <TableRow
                                        key={ticket.id}
                                        className="group h-12 cursor-pointer transition-all hover:bg-muted/40"
                                        onClick={() =>
                                            userHasPermission({
                                                user: auth.user,
                                                permission: 'show tickets',
                                            }) &&
                                            router.get(
                                                route(
                                                    'tickets.show',
                                                    ticket.id,
                                                ),
                                            )
                                        }
                                    >
                                        <TableCell className="pl-4 align-middle">
                                            <div className="flex flex-col max-w-36">
                                                <TooltipProvider delayDuration={300}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                                                                {ticket.title}
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top" className="max-w-none whitespace-nowrap">
                                                            <p className="text-sm">{ticket.title}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
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
                                                        color: ticket.status
                                                            .color,
                                                        border: `1px solid ${ticket.status.color}40`,
                                                    }}
                                                >
                                                    {ticket.status.title}
                                                </Badge>
                                            )}
                                        </TableCell>


                                        <TableCell className="align-middle">
                                            <div className="flex items-center gap-2">
                                                {ticket.priority && (
                                                    <Flag className="h-3.5 w-3.5" style={{ color: ticket.priority.color }} />
                                                )}
                                                <span className="text-xs font-medium text-muted-foreground">
                                                    {ticket.priority?.title}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="hidden align-middle md:table-cell">
                                            {ticket.user ? (
                                                <TooltipProvider delayDuration={300}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex items-center gap-2 max-w-28">
                                                                <Avatar className="h-6 w-6 border-2 border-background ring-1 ring-border/10 shrink-0">
                                                                    <AvatarImage
                                                                        src={
                                                                            ticket.user.avatar?.url ??
                                                                            undefined
                                                                        }
                                                                    />
                                                                    <AvatarFallback className="bg-muted text-[8px] font-bold">
                                                                        {ticket.user.name
                                                                            .substring(0, 2)
                                                                            .toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <span className="truncate text-xs font-medium text-muted-foreground">
                                                                    {ticket.user.name}
                                                                </span>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top">
                                                            <p className="text-sm">{ticket.user.name}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            ) : (
                                                <span className="text-xs text-muted-foreground/50">\-</span>
                                            )}
                                        </TableCell>

                                        <TableCell className="hidden align-middle md:table-cell">
                                            {ticket.category ? (
                                                <TooltipProvider delayDuration={300}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground max-w-32">
                                                                <GetIcon icon={ticket.category.icon ?? 'tag'} props={{ className: 'h-3.5 w-3.5 opacity-50 shrink-0' }} />
                                                                <span className="truncate">{ticket.category.title}</span>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top">
                                                            <p className="text-sm">{ticket.category.title}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            ) : (
                                                <span className="text-xs text-muted-foreground/50">-</span>
                                            )}
                                        </TableCell>

                                        <TableCell className="hidden align-middle lg:table-cell">
                                            {ticket.asset ? (
                                                <TooltipProvider delayDuration={300}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground max-w-32">
                                                                <GetIcon icon={ticket.asset.icon ?? 'monitor'} props={{ className: 'h-3.5 w-3.5 opacity-50 shrink-0' }} />
                                                                <span className="truncate">{ticket.asset.title}</span>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top">
                                                            <p className="text-sm">{ticket.asset.title}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            ) : (
                                                <span className="text-xs text-muted-foreground/50">-</span>
                                            )}
                                        </TableCell>

                                        <TableCell className="hidden align-middle xl:table-cell">
                                            {validAssignees?.length > 0 ? (
                                                <div className="flex -space-x-2 overflow-hidden py-1">
                                                    {validAssignees
                                                        .slice(0, 3)
                                                        .map((assignee) => (
                                                            <TooltipProvider
                                                                key={
                                                                    assignee.id
                                                                }
                                                            >
                                                                <Tooltip
                                                                    delayDuration={
                                                                        300
                                                                    }
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
                                                    {validAssignees.length >
                                                        3 && (
                                                        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-[9px] font-medium text-muted-foreground ring-1 ring-border/10">
                                                            \+
                                                            {validAssignees.length -
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

                                        <TableCell className="hidden align-middle text-xs text-muted-foreground tabular-nums xl:table-cell">
                                            {new Date(
                                                ticket.created_at,
                                            ).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false,
                                            })}
                                        </TableCell>

                                        <TableCell className="hidden align-middle text-xs text-muted-foreground tabular-nums xl:table-cell">
                                            {new Date(
                                                ticket.updated_at,
                                            ).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false,
                                            })}
                                        </TableCell>

                                        <TableCell className="sticky right-0 w-12 bg-background pr-2 text-center align-middle">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger
                                                    asChild
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-md text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
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
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        {__(
                                                            'tickets.pages.show.head_title',
                                                        )}
                                                    </DropdownMenuItem>

                                                    {userHasPermission({
                                                        user: auth.user,
                                                        permission:
                                                            'update tickets',
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
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            {__(
                                                                'tickets.pages.form.buttons.edit',
                                                            )}
                                                        </DropdownMenuItem>
                                                    )}

                                                    {canArchive && userHasPermission({ user: auth.user, permission: 'archive tickets' }) && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            {ticket.is_archived ? (
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        initiateUnarchive(
                                                                            ticket.id,
                                                                        )
                                                                    }
                                                                >
                                                                    <ArchiveRestore className="mr-2 h-4 w-4" />
                                                                    {__(
                                                                        'tickets.pages.form.buttons.unarchive',
                                                                    )}
                                                                </DropdownMenuItem>
                                                            ) : (
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        initiateArchive(
                                                                            ticket.id,
                                                                        )
                                                                    }
                                                                >
                                                                    <Archive className="mr-2 h-4 w-4" />
                                                                    {__(
                                                                        'tickets.pages.form.buttons.archive',
                                                                    )}
                                                                </DropdownMenuItem>
                                                            )}
                                                        </>
                                                    )}

                                                    {canArchive && userHasPermission({ user: auth.user, permission: 'delete tickets' }) && (
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                initiateDelete(
                                                                    ticket.id,
                                                                )
                                                            }
                                                            className="text-destructive focus:text-destructive"
                                                        >
                                                            <Trash className="mr-2 h-4 w-4" />
                                                            {__(
                                                                'tickets.pages.form.buttons.delete',
                                                            )}
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <AlertDialog
                open={archiveConfirm.isOpen}
                onOpenChange={(open) =>
                    !open &&
                    setArchiveConfirm({ ...archiveConfirm, isOpen: false })
                }
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {__('tickets.archive.confirm')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {__('tickets.archive.message')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {__('tickets.pages.delete.buttons.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmArchive}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {__('tickets.pages.form.buttons.archive')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                open={unarchiveConfirm.isOpen}
                onOpenChange={(open) =>
                    !open &&
                    setUnarchiveConfirm({ ...unarchiveConfirm, isOpen: false })
                }
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {__('tickets.unarchive.confirm')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {__('tickets.unarchive.message')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {__('tickets.pages.delete.buttons.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmUnarchive}
                        >
                            {__('tickets.pages.form.buttons.unarchive')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                open={deleteConfirm.isOpen}
                onOpenChange={(open) =>
                    !open &&
                    setDeleteConfirm({ ...deleteConfirm, isOpen: false })
                }
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {__('tickets.delete.confirm')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {__('tickets.delete.message')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {__('tickets.pages.delete.buttons.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {__('tickets.pages.form.buttons.delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
