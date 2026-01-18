import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useInitials } from '@/hooks/use-initials';
import { useTrans } from '@/lib/translation';
import { formatDate, userHasPermission } from '@/lib/utils';
import type { SharedData, User } from '@/types';
import { router, usePage } from '@inertiajs/react';
import {
    Eye,
    MoreHorizontal,
    Pencil,
    Shield,
    Trash2,
} from 'lucide-react';
import { SortableTableHead } from '@/components/sortable-table-head';

interface Props {
    users: User[];
}

type SortField = 'name' | 'email' | 'created_at';
type SortDirection = 'asc' | 'desc';

export function UsersTable({ users }: Props) {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();

    const params = new URLSearchParams(window.location.search);
    const sortField = (params.get('sort') as SortField) || 'created_at';
    const sortDirection = (params.get('direction') as SortDirection) || 'desc';

    const handleSort = (field: string) => {
        const newDirection =
            sortField === field && sortDirection === 'desc' ? 'asc' : 'desc';

        const params = new URLSearchParams(window.location.search);
        params.set('sort', field);
        params.set('direction', newDirection);

        router.get(
            `${window.location.pathname}?${params.toString()}`,
            {},
            { preserveState: true, replace: true, preserveScroll: true },
        );
    };

    const handleRowClick = (user: User) => {
        if (auth.user.id === user.id) {
            router.get(route('settings.profile.edit'));
        } else if (
            userHasPermission({ user: auth.user, permission: 'view users' })
        ) {
            router.get(route('users.show', user.id));
        }
    };

    const handleEdit = (e: React.MouseEvent, user: User) => {
        e.stopPropagation();
        router.get(route('users.edit', user.id));
    };

    const handleDelete = (e: React.MouseEvent, user: User) => {
        e.stopPropagation();
        router.get(route('users.delete', user.id));
    };

    return (
        <div className="w-full overflow-hidden rounded-lg border bg-background shadow-sm">
            <div className="relative overflow-x-auto">
                <Table className="min-w-full">
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent">
                            <SortableTableHead
                                label={__('users.pages.index.table.columns.name')}
                                column="name"
                                currentSort={sortField}
                                currentDirection={sortDirection}
                                onSort={handleSort}
                                className="pl-6"
                            />
                            <SortableTableHead
                                label={__('users.pages.index.table.columns.email')}
                                column="email"
                                currentSort={sortField}
                                currentDirection={sortDirection}
                                onSort={handleSort}
                            />
                            <SortableTableHead
                                label={__('users.pages.index.table.columns.roles')}
                                column="roles_count"
                                currentSort={sortField}
                                currentDirection={sortDirection}
                                onSort={handleSort}
                            />
                            <SortableTableHead
                                label={__('users.pages.index.table.columns.created_at')}
                                column="created_at"
                                currentSort={sortField}
                                currentDirection={sortDirection}
                                onSort={handleSort}
                                className="hidden text-right md:table-cell"
                            />
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow
                                key={user.id}
                                className="group cursor-pointer transition-colors hover:bg-muted/40"
                                onClick={() => handleRowClick(user)}
                            >
                                <TableCell className="pl-6">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 border bg-background">
                                            <AvatarImage src={user.avatar?.url} />
                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                                {user.name}
                                                {user.id === auth.user.id && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="h-5 px-1.5 text-[10px] font-medium"
                                                    >
                                                        {__('users.pages.index.table.labels.you')}
                                                    </Badge>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {user.email}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {user.roles?.slice(0, 2).map((role) => (
                                            <Badge
                                                key={role.id}
                                                variant="secondary"
                                                className="bg-muted/50 font-normal text-muted-foreground hover:bg-muted"
                                            >
                                                {role.name}
                                            </Badge>
                                        ))}
                                        {(user.roles?.length || 0) > 2 && (
                                            <TooltipProvider>
                                                <Tooltip delayDuration={0}>
                                                    <TooltipTrigger asChild>
                                                        <Badge
                                                            variant="secondary"
                                                            className="cursor-help bg-muted/50 font-normal text-muted-foreground hover:bg-muted"
                                                        >
                                                            +{user.roles!.length - 2}
                                                        </Badge>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <div className="flex flex-col gap-1">
                                                            {user.roles
                                                                ?.slice(2)
                                                                .map((role) => (
                                                                    <span
                                                                        key={
                                                                            role.id
                                                                        }
                                                                        className="text-xs"
                                                                    >
                                                                        {role.name}
                                                                    </span>
                                                                ))}
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="hidden text-right text-muted-foreground md:table-cell">
                                    {formatDate(user.created_at)}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Open menu
                                                </span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>
                                                {__('common.actions')}
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRowClick(user);
                                                }}
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                {__('common.buttons.view')}
                                            </DropdownMenuItem>
                                            {userHasPermission({
                                                user: auth.user,
                                                permission: 'edit users',
                                            }) && (
                                                    <DropdownMenuItem
                                                        onClick={(e) =>
                                                            handleEdit(e, user)
                                                        }
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        {__('common.buttons.edit')}
                                                    </DropdownMenuItem>
                                                )}
                                            {userHasPermission({
                                                user: auth.user,
                                                permission: 'delete users',
                                            }) && (
                                                    <DropdownMenuItem
                                                        onClick={(e) =>
                                                            handleDelete(e, user)
                                                        }
                                                        className="text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        {__('common.buttons.delete')}
                                                    </DropdownMenuItem>
                                                )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
