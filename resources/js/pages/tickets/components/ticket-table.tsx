import LaravelPagination from '@/components/LaravelPagination';
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
    Eye,
    EyeOff,
    Flag,
    Monitor,
    MoreHorizontal,
    Pencil,
    Tag,
    TicketIcon,
    Trash,
} from 'lucide-react';
import { useState } from 'react';

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
            { preserveState: true, replace: true },
        );
    };

    const initiateArchive = (id: number) => {
        setDeleteConfirm({ isOpen: true, id });
    };

    const confirmArchive = () => {
        if (deleteConfirm.id) {
            router.delete(route('tickets.destroy', deleteConfirm.id), {
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
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            <div className="overflow-hidden rounded-lg border bg-background shadow-sm">
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
                                    className="w-75 pl-6"
                                />
                                <SortableTableHead
                                    column="status_id"
                                    label={__('tickets.column.status')}
                                    currentSort={currentSort}
                                    currentDirection={currentDirection}
                                    onSort={handleSort}
                                    className="w-30"
                                />
                                <TableHead className="w-15 text-center text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    <Eye className="mx-auto h-3.5 w-3.5 opacity-70" />
                                </TableHead>
                                <SortableTableHead
                                    column="priority_id"
                                    label={__('tickets.column.priority')}
                                    currentSort={currentSort}
                                    currentDirection={currentDirection}
                                    onSort={handleSort}
                                    className="w-30"
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

                                <TableHead className="sticky right-0 z-20 w-15 bg-muted/30"></TableHead>
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
                                                        color: ticket.status
                                                            .color,
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
                                                    <Flag className="h-3.5 w-3.5" style={{ color: ticket.priority.color }} />
                                                )}
                                                <span className="text-xs font-medium text-muted-foreground">
                                                    {ticket.priority?.title}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="hidden align-middle md:table-cell">
                                            {ticket.user ? (
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6 border-2 border-background ring-1 ring-border/10">
                                                        <AvatarImage
                                                            src={
                                                                ticket.user
                                                                    .avatar
                                                                    ?.url ??
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
                                            ) : (
                                                <span className="text-xs text-muted-foreground/50">
                                                    \-
                                                </span>
                                            )}
                                        </TableCell>

                                        <TableCell className="hidden align-middle md:table-cell">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <GetIcon icon={ticket.category?.icon ?? 'tag'} props={{ className: 'h-3.5 w-3.5 opacity-50' }} />
                                                {ticket.category?.title || '-'}
                                            </div>
                                        </TableCell>

                                        <TableCell className="hidden align-middle lg:table-cell">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <GetIcon icon={ticket.asset?.icon ?? 'monitor'} props={{ className: 'h-3.5 w-3.5 opacity-50' }} />
                                                {ticket.asset?.title || '-'}
                                            </div>
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

                                        <TableCell className="sticky right-0 z-10 bg-background pr-4 text-right align-middle shadow-[-12px_0_16px_-16px_rgba(0,0,0,0.35)]">
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
                                                        className="h-8 w-8 text-muted-foreground/60 transition-all hover:bg-muted hover:text-foreground"
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

                                                    {canArchive && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    initiateArchive(
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
                                                        </>
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

            {tickets.total > tickets.per_page && (
                <div className="flex items-center justify-between border-t px-2 py-4">
                    <div className="text-sm text-muted-foreground">
                        {__('pagination.showing') || 'Showing'}{' '}
                        <span className="font-medium text-foreground">
                            {tickets.from}
                        </span>{' '}
                        {__('pagination.to') || 'to'}{' '}
                        <span className="font-medium text-foreground">
                            {tickets.to}
                        </span>{' '}
                        {__('pagination.of') || 'of'}{' '}
                        <span className="font-medium text-foreground">
                            {tickets.total}
                        </span>{' '}
                        {__('pagination.results') || 'results'}
                    </div>
                    <LaravelPagination links={tickets.links} className="mt-0" />
                </div>
            )}

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
                            {__('tickets.archive.confirm')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {__('tickets.archive.message') ||
                                'Are you sure you want to move this ticket to trash?'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {__('tickets.pages.delete.buttons.cancel') ||
                                'Cancel'}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmArchive}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {__('tickets.pages.delete.buttons.confirm') ||
                                'Confirm'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
