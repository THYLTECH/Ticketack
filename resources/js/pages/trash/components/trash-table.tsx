import { TrashEmpty } from './trash-empty';
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
import { Checkbox } from '@/components/ui/checkbox';
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
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import {
    Box,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Lock,
    MoreHorizontal,
    RotateCcw,
    Shield,
    TicketIcon,
    Trash2,
    User,
    Users,
} from 'lucide-react';
import { useState } from 'react';

interface DeletedItem {
    id: number;
    deleted_at: string;
    title?: string;
    name?: string;
    email?: string;
    status?: { title: string; color: string };
    priority?: { title: string; color: string };
    assignees?: {
        id: number;
        user?: { name: string; avatar?: { url: string } };
    }[];
    roles?: { name: string }[];
    tickets_count?: number;
    users_count?: number;
    permissions_count?: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData {
    data: DeletedItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
}

interface Props {
    data: PaginatedData;
    type: 'ticket' | 'user' | 'asset' | 'role';
}

type SortDirection = 'asc' | 'desc';

export function TrashTable({ data, type }: Props) {
    const __ = useTrans();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const [deleteConfirm, setDeleteConfirm] = useState<{
        isOpen: boolean;
        id?: number;
        isBulk: boolean;
    }>({ isOpen: false, isBulk: false });

    const params = new URLSearchParams(window.location.search);
    const currentSort = params.get('sort') || 'deleted_at';
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

        router.get(
            route('trash.index'),
            Object.fromEntries(newParams.entries()),
            { preserveState: true, replace: true, preserveScroll: true },
        );
    };

    const handleSelectAll = (checked: boolean) => {
        setSelectedIds(checked ? data.data.map((item) => item.id) : []);
    };

    const handleSelectRow = (checked: boolean, id: number) => {
        if (checked) {
            setSelectedIds((prev) => [...prev, id]);
        } else {
            setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
        }
    };

    const handleRestore = (id: number) => {
        router.put(
            route('trash.restore', { type, id }),
            {},
            { preserveScroll: true },
        );
    };

    const initiateForceDelete = (id: number) => {
        setDeleteConfirm({ isOpen: true, id, isBulk: false });
    };

    const initiateBulkForceDelete = () => {
        setDeleteConfirm({ isOpen: true, isBulk: true });
    };

    const confirmDelete = () => {
        if (deleteConfirm.isBulk) {
            router.post(
                route('trash.bulk-force-delete'),
                { type, ids: selectedIds },
                {
                    preserveScroll: true,
                    onSuccess: () => setSelectedIds([]),
                    onFinish: () =>
                        setDeleteConfirm({ isOpen: false, isBulk: false }),
                },
            );
        } else if (deleteConfirm.id) {
            router.delete(
                route('trash.force-delete', { type, id: deleteConfirm.id }),
                {
                    preserveScroll: true,
                    onFinish: () =>
                        setDeleteConfirm({ isOpen: false, isBulk: false }),
                },
            );
        }
    };

    const handleBulkRestore = () => {
        router.post(
            route('trash.bulk-restore'),
            { type, ids: selectedIds },
            {
                preserveScroll: true,
                onSuccess: () => setSelectedIds([]),
            },
        );
    };

    if (data.data.length === 0) {
        return <TrashEmpty type={type} />;
    }

    const allSelected =
        data.data.length > 0 && selectedIds.length === data.data.length;

    return (
        <div className="w-full space-y-4">
            {selectedIds.length > 0 && (
                <div className="flex animate-in items-center justify-between rounded-md border border-primary/20 bg-primary/5 p-2 px-4 fade-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">
                            {selectedIds.length} {__('trash.common.selected')}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleBulkRestore}
                            className="h-8 border-primary/20 bg-background hover:bg-background/80"
                        >
                            <RotateCcw className="mr-2 h-3.5 w-3.5" />
                            {__('trash.buttons.restore_selected')}
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={initiateBulkForceDelete}
                            className="h-8"
                        >
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            {__('trash.buttons.delete_selected')}
                        </Button>
                    </div>
                </div>
            )}

            <div className="overflow-hidden rounded-lg border bg-background shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[40px] pl-6">
                                <Checkbox
                                    checked={allSelected}
                                    onCheckedChange={(c) =>
                                        handleSelectAll(!!c)
                                    }
                                />
                            </TableHead>

                            {type === 'ticket' && (
                                <>
                                    <SortableTableHead
                                        column="title"
                                        label={__('tickets.column.title')}
                                        currentSort={currentSort}
                                        currentDirection={currentDirection}
                                        onSort={handleSort}
                                        className="w-[300px]"
                                    />
                                    <SortableTableHead
                                        column="status_id"
                                        label={__('tickets.column.status')}
                                        currentSort={currentSort}
                                        currentDirection={currentDirection}
                                        onSort={handleSort}
                                        className="w-[120px]"
                                    />
                                    <SortableTableHead
                                        column="priority_id"
                                        label={__('tickets.column.priority')}
                                        currentSort={currentSort}
                                        currentDirection={currentDirection}
                                        onSort={handleSort}
                                        className="w-[120px]"
                                    />
                                    <TableHead className="hidden md:table-cell">
                                        <span className="-ml-3 h-8 text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
                                            {__('tickets.column.assignee')}
                                        </span>
                                    </TableHead>
                                </>
                            )}

                            {type === 'user' && (
                                <>
                                    <SortableTableHead
                                        column="name"
                                        label={__(
                                            'trash.pages.index.table.headers.name',
                                        )}
                                        currentSort={currentSort}
                                        currentDirection={currentDirection}
                                        onSort={handleSort}
                                    />
                                    <SortableTableHead
                                        column="email"
                                        label="Email"
                                        currentSort={currentSort}
                                        currentDirection={currentDirection}
                                        onSort={handleSort}
                                        className="hidden md:table-cell"
                                    />
                                    <TableHead className="hidden lg:table-cell">
                                        <span className="-ml-3 h-8 text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
                                            Roles
                                        </span>
                                    </TableHead>
                                </>
                            )}

                            {type === 'asset' && (
                                <>
                                    <SortableTableHead
                                        column="title"
                                        label={__(
                                            'trash.pages.index.table.headers.name',
                                        )}
                                        currentSort={currentSort}
                                        currentDirection={currentDirection}
                                        onSort={handleSort}
                                    />
                                    <TableHead className="hidden text-center md:table-cell">
                                        <span className="h-8 text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
                                            Tickets
                                        </span>
                                    </TableHead>
                                </>
                            )}

                            {type === 'role' && (
                                <>
                                    <SortableTableHead
                                        column="name"
                                        label={__(
                                            'trash.pages.index.table.headers.name',
                                        )}
                                        currentSort={currentSort}
                                        currentDirection={currentDirection}
                                        onSort={handleSort}
                                    />
                                    <TableHead className="hidden text-center md:table-cell">
                                        <span className="h-8 text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
                                            Users
                                        </span>
                                    </TableHead>
                                    <TableHead className="hidden text-center md:table-cell">
                                        <span className="h-8 text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
                                            Permissions
                                        </span>
                                    </TableHead>
                                </>
                            )}

                            <SortableTableHead
                                column="deleted_at"
                                label={__(
                                    'trash.pages.index.table.headers.deleted_at',
                                )}
                                currentSort={currentSort}
                                currentDirection={currentDirection}
                                onSort={handleSort}
                                className="hidden xl:table-cell"
                            />
                            <TableHead className="w-[60px]"></TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.data.map((item) => (
                            <TableRow
                                key={item.id}
                                className="group h-16 cursor-pointer transition-all hover:bg-muted/40"
                                onClick={() =>
                                    handleSelectRow(
                                        !selectedIds.includes(item.id),
                                        item.id,
                                    )
                                }
                            >
                                <TableCell className="pl-6 align-middle">
                                    <Checkbox
                                        checked={selectedIds.includes(item.id)}
                                        onCheckedChange={(c) =>
                                            handleSelectRow(!!c, item.id)
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </TableCell>

                                {type === 'ticket' && (
                                    <>
                                        <TableCell className="align-middle">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-500/10">
                                                    <TicketIcon className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="line-clamp-1 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                                                        {item.title}
                                                    </span>
                                                    <span className="font-mono text-[10px] text-muted-foreground">
                                                        #{item.id}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="align-middle">
                                            {item.status ? (
                                                <Badge
                                                    variant="outline"
                                                    className="rounded-md border-transparent px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase"
                                                    style={{
                                                        backgroundColor: `${item.status.color}25`,
                                                        color: item.status
                                                            .color,
                                                        border: `1px solid ${item.status.color}40`,
                                                    }}
                                                >
                                                    {item.status.title}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    -
                                                </span>
                                            )}
                                        </TableCell>

                                        <TableCell className="align-middle">
                                            {item.priority && (
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="h-2 w-2 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                item.priority
                                                                    .color,
                                                        }}
                                                    />
                                                    <span className="text-xs font-medium text-muted-foreground">
                                                        {item.priority.title}
                                                    </span>
                                                </div>
                                            )}
                                        </TableCell>

                                        <TableCell className="hidden align-middle md:table-cell">
                                            {item.assignees &&
                                            item.assignees.length > 0 ? (
                                                <div className="flex -space-x-2 overflow-hidden py-1">
                                                    {item.assignees
                                                        .filter((a) => a.user)
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
                                                                                        ?.avatar
                                                                                        ?.url
                                                                                }
                                                                            />
                                                                            <AvatarFallback className="bg-muted text-[8px] font-bold">
                                                                                {assignee.user?.name
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
                                                                                ?.name
                                                                        }
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        ))}
                                                    {item.assignees.filter(
                                                        (a) => a.user,
                                                    ).length > 3 && (
                                                        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-[9px] font-medium text-muted-foreground ring-1 ring-border/10">
                                                            +
                                                            {item.assignees.filter(
                                                                (a) => a.user,
                                                            ).length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground/50 italic">
                                                    {__(
                                                        'tickets.pages.show.tabs.info_content.no_assignees',
                                                    )}
                                                </span>
                                            )}
                                        </TableCell>
                                    </>
                                )}

                                {type === 'user' && (
                                    <>
                                        <TableCell className="align-middle">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                                    <User className="h-4 w-4 text-primary" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-foreground">
                                                        {item.name}
                                                    </span>
                                                    {item.tickets_count !==
                                                        undefined &&
                                                        item.tickets_count >
                                                            0 && (
                                                            <span className="text-[10px] text-muted-foreground">
                                                                {
                                                                    item.tickets_count
                                                                }{' '}
                                                                tickets créés
                                                            </span>
                                                        )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden align-middle text-xs text-muted-foreground md:table-cell">
                                            {item.email}
                                        </TableCell>
                                        <TableCell className="hidden align-middle lg:table-cell">
                                            <div className="flex flex-wrap gap-1">
                                                {item.roles &&
                                                item.roles.length > 0 ? (
                                                    item.roles.map(
                                                        (role, idx) => (
                                                            <Badge
                                                                key={idx}
                                                                variant="secondary"
                                                                className="h-5 px-1.5 text-[10px] font-normal"
                                                            >
                                                                {role.name}
                                                            </Badge>
                                                        ),
                                                    )
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">
                                                        -
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                    </>
                                )}

                                {type === 'asset' && (
                                    <>
                                        <TableCell className="align-middle">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500/10">
                                                    <Box className="h-4 w-4 text-orange-600" />
                                                </div>
                                                <span className="text-sm font-medium text-foreground">
                                                    {item.title || item.name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden text-center align-middle md:table-cell">
                                            {item.tickets_count !==
                                                undefined && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Badge
                                                                variant="outline"
                                                                className="font-mono text-xs"
                                                            >
                                                                {
                                                                    item.tickets_count
                                                                }
                                                            </Badge>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Tickets liés</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </TableCell>
                                    </>
                                )}

                                {type === 'role' && (
                                    <>
                                        <TableCell className="align-middle">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500/10">
                                                    <Shield className="h-4 w-4 text-purple-600" />
                                                </div>
                                                <span className="text-sm font-medium text-foreground">
                                                    {item.name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden text-center align-middle md:table-cell">
                                            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                                                <Users className="h-3.5 w-3.5" />
                                                {item.users_count ?? 0}
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden text-center align-middle md:table-cell">
                                            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                                                <Lock className="h-3.5 w-3.5" />
                                                {item.permissions_count ?? 0}
                                            </div>
                                        </TableCell>
                                    </>
                                )}

                                <TableCell className="hidden align-middle text-xs text-muted-foreground tabular-nums xl:table-cell">
                                    <Badge
                                        variant="secondary"
                                        className="bg-muted/50 font-normal text-muted-foreground hover:bg-muted/70"
                                    >
                                        {new Date(
                                            item.deleted_at,
                                        ).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false,
                                        })}
                                    </Badge>
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
                                                    handleRestore(item.id)
                                                }
                                                className="text-green-600 focus:text-green-700"
                                            >
                                                <RotateCcw className="mr-2 h-4 w-4" />
                                                {__(
                                                    'trash.pages.index.buttons.restore',
                                                )}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    initiateForceDelete(item.id)
                                                }
                                                className="text-destructive focus:text-destructive"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                {__(
                                                    'trash.pages.index.buttons.force_delete',
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

            {data.total > data.per_page && (
                <div className="flex items-center justify-between px-2">
                    <div className="text-[10px] tracking-wider text-muted-foreground uppercase">
                        {__(
                            'tickets.pages.show.tabs.logs_content.pagination_info',
                        )
                            .replace(':current', data.current_page.toString())
                            .replace(':total', data.last_page.toString())
                            .replace(':count', data.total.toString())}
                    </div>
                    <div className="flex items-center space-x-1">
                        {data.links.map((link, i) => {
                            const label = link.label.includes('Previous')
                                ? 'prev'
                                : link.label.includes('Next')
                                  ? 'next'
                                  : link.label;
                            const isDots = label === '...';
                            const isDisabled = !link.url || isDots;

                            return (
                                <Button
                                    key={i}
                                    variant={
                                        link.active ? 'default' : 'outline'
                                    }
                                    size="sm"
                                    disabled={isDisabled}
                                    className={cn(
                                        'h-8 w-8 p-0',
                                        isDisabled && 'opacity-50',
                                        link.active && 'pointer-events-none',
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
                            {__('trash.modals.delete.title')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {__('trash.modals.delete.warning')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {__('trash.modals.delete.buttons.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {__('trash.modals.delete.buttons.confirm')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
