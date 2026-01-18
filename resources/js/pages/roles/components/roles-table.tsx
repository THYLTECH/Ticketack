import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
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
import { useTrans } from '@/lib/translation';
import { formatDate, userHasPermission } from '@/lib/utils';
import type { Role, SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import {
    Briefcase,
    Eye,
    Lock,
    MoreHorizontal,
    Pencil,
    Shield,
    ShieldAlert,
    Trash2,
    Users,
} from 'lucide-react';
import { SortableTableHead } from '@/components/sortable-table-head';

interface Props {
    roles: Role[];
}

// ... imports
type SortField =
    | 'name'
    | 'updated_at'
    | 'users_count'
    | 'permissions_count';
type SortDirection = 'asc' | 'desc';

export function RolesTable({ roles }: Props) {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;

    const params = new URLSearchParams(window.location.search);
    const sortField = (params.get('sort') as SortField) || 'updated_at';
    const sortDirection = (params.get('direction') as SortDirection) || 'desc';

    const handleRowClick = (roleId: number) => {
        if (userHasPermission({ user: auth.user, permission: 'show roles' })) {
            router.get(route('roles.show', roleId));
        }
    };

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

    return (
        <div className="w-full space-y-4">
            <div className="block space-y-3 lg:hidden">
                {roles.map((role) => {
                    const isSystemRole = [
                        'admin',
                        'solver',
                        'simple_user',
                    ].includes(role.name.toLowerCase());

                    return (
                        <Card
                            key={role.id}
                            className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border-border/60 bg-linear-to-br from-card to-card/80 cursor-pointer"
                            onClick={() => handleRowClick(role.id)}
                        >
                            <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <CardContent className="relative p-4 space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`flex h-8 w-8 items-center justify-center rounded-lg border ${isSystemRole ? 'border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-background text-muted-foreground'}`}
                                        >
                                            {isSystemRole ? (
                                                <Lock className="h-3.5 w-3.5" />
                                            ) : (
                                                <Shield className="h-3.5 w-3.5" />
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                                {role.name}
                                                {isSystemRole && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="h-4 rounded-lg px-1 text-[10px] font-normal text-muted-foreground"
                                                    >
                                                        {__(
                                                            'roles.pages.index.table.badges.system',
                                                        )}
                                                    </Badge>
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground/60 transition-all hover:bg-muted hover:text-foreground"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="w-40"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <DropdownMenuLabel>
                                                {__(
                                                    'roles.pages.index.table.actions.label',
                                                )}
                                            </DropdownMenuLabel>

                                            {userHasPermission({
                                                user: auth.user,
                                                permission: 'show roles',
                                            }) && (
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.get(
                                                                route(
                                                                    'roles.show',
                                                                    role.id,
                                                                ),
                                                            )
                                                        }}
                                                    >
                                                        <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                                                        {__(
                                                            'roles.pages.index.table.actions.view',
                                                        )}
                                                    </DropdownMenuItem>
                                                )}

                                            {userHasPermission({
                                                user: auth.user,
                                                permission: 'create roles',
                                            }) && (
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.get(
                                                                route(
                                                                    'roles.clone',
                                                                    role.id,
                                                                ),
                                                            )
                                                        }}
                                                    >
                                                        <Briefcase className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                                                        {__(
                                                            'roles.pages.index.table.actions.clone',
                                                        )}
                                                    </DropdownMenuItem>
                                                )}

                                            {userHasPermission({
                                                user: auth.user,
                                                permission: 'update roles',
                                            }) && (
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.get(
                                                                route(
                                                                    'roles.edit',
                                                                    role.id,
                                                                ),
                                                            )
                                                        }}
                                                    >
                                                        <Pencil className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                                                        {__(
                                                            'roles.pages.index.table.actions.edit',
                                                        )}
                                                    </DropdownMenuItem>
                                                )}

                                            {!isSystemRole &&
                                                userHasPermission({
                                                    user: auth.user,
                                                    permission:
                                                        'delete roles',
                                                }) && (
                                                    <>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.delete(
                                                                    route(
                                                                        'roles.destroy',
                                                                        role.id,
                                                                    ),
                                                                    {
                                                                        preserveScroll: true,
                                                                    },
                                                                )
                                                            }}
                                                        >
                                                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                                                            {__(
                                                                'roles.pages.index.table.actions.delete',
                                                            )}
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Badge
                                        variant="outline"
                                        className="h-6 gap-1.5 pr-2.5 pl-1.5 font-normal"
                                    >
                                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                        {role.nbrOfUsers || 0} users
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="h-6 gap-1.5 pr-2.5 pl-1.5 font-normal"
                                    >
                                        <ShieldAlert className="h-3.5 w-3.5 text-muted-foreground" />
                                        {role.permissions.length} permissions
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <span className="font-semibold">{__('common.labels.updated_at')}:</span>
                                        {formatDate(role.updated_at)}
                                    </span>
                                </div>

                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="hidden lg:block overflow-hidden rounded-lg border bg-background shadow-sm">
                <div className="relative overflow-x-auto">
                    <Table className="min-w-full">
                        <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent">
                                <SortableTableHead
                                    label={__(
                                        'roles.pages.index.table.columns.name',
                                    )}
                                    column="name"
                                    currentSort={sortField}
                                    currentDirection={sortDirection}
                                    onSort={handleSort}
                                    className="w-62.5 pl-6"
                                />
                                <SortableTableHead
                                    label={__(
                                        'roles.pages.index.table.columns.users',
                                    )}
                                    column="users_count"
                                    currentSort={sortField}
                                    currentDirection={sortDirection}
                                    onSort={handleSort}
                                />
                                <SortableTableHead
                                    label={__(
                                        'roles.pages.index.table.columns.permissions',
                                    )}
                                    column="permissions_count"
                                    currentSort={sortField}
                                    currentDirection={sortDirection}
                                    onSort={handleSort}
                                />
                                <SortableTableHead
                                    label={__(
                                        'roles.pages.index.table.columns.updated_at',
                                    )}
                                    column="updated_at"
                                    currentSort={sortField}
                                    currentDirection={sortDirection}
                                    onSort={handleSort}
                                    className="hidden text-right md:table-cell"
                                />
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.map((role) => {
                                const isSystemRole = [
                                    'admin',
                                    'solver',
                                    'simple_user',
                                ].includes(role.name.toLowerCase());

                                return (
                                    <TableRow
                                        key={role.id}
                                        className="group cursor-pointer transition-colors hover:bg-muted/40"
                                        onClick={() => handleRowClick(role.id)}
                                    >
                                        <TableCell className="pl-6 font-medium">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-9 w-9 items-center justify-center rounded-lg border ${isSystemRole ? 'border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-background text-muted-foreground'}`}
                                                >
                                                    {isSystemRole ? (
                                                        <Lock className="h-4 w-4" />
                                                    ) : (
                                                        <Shield className="h-4 w-4" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                                        {role.name}
                                                        {isSystemRole && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="h-4 rounded-lg px-1 text-[10px] font-normal text-muted-foreground"
                                                            >
                                                                {__(
                                                                    'roles.pages.index.table.badges.system',
                                                                )}
                                                            </Badge>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant="outline"
                                                    className="h-6 gap-1.5 pr-2.5 pl-1.5 font-normal"
                                                >
                                                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                                    {role.nbrOfUsers || 0}
                                                </Badge>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant="outline"
                                                    className="h-6 gap-1.5 pr-2.5 pl-1.5 font-normal"
                                                >
                                                    <ShieldAlert className="h-3.5 w-3.5 text-muted-foreground" />
                                                    {role.permissions.length}
                                                </Badge>
                                            </div>
                                        </TableCell>

                                        <TableCell className="hidden text-right text-sm text-muted-foreground md:table-cell">
                                            <div className="flex items-center justify-end gap-2">
                                                <span className="truncate">
                                                    {formatDate(role.updated_at)}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="pr-6">
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
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
                                                        className="w-40"
                                                    >
                                                        <DropdownMenuLabel>
                                                            {__(
                                                                'roles.pages.index.table.actions.label',
                                                            )}
                                                        </DropdownMenuLabel>

                                                        {userHasPermission({
                                                            user: auth.user,
                                                            permission: 'show roles',
                                                        }) && (
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        router.get(
                                                                            route(
                                                                                'roles.show',
                                                                                role.id,
                                                                            ),
                                                                        )
                                                                    }
                                                                >
                                                                    <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                                                                    {__(
                                                                        'roles.pages.index.table.actions.view',
                                                                    )}
                                                                </DropdownMenuItem>
                                                            )}

                                                        {userHasPermission({
                                                            user: auth.user,
                                                            permission: 'create roles',
                                                        }) && (
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        router.get(
                                                                            route(
                                                                                'roles.clone',
                                                                                role.id,
                                                                            ),
                                                                        )
                                                                    }
                                                                >
                                                                    <Briefcase className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                                                                    {__(
                                                                        'roles.pages.index.table.actions.clone',
                                                                    )}
                                                                </DropdownMenuItem>
                                                            )}

                                                        {userHasPermission({
                                                            user: auth.user,
                                                            permission: 'update roles',
                                                        }) && (
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        router.get(
                                                                            route(
                                                                                'roles.edit',
                                                                                role.id,
                                                                            ),
                                                                        )
                                                                    }
                                                                >
                                                                    <Pencil className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                                                                    {__(
                                                                        'roles.pages.index.table.actions.edit',
                                                                    )}
                                                                </DropdownMenuItem>
                                                            )}

                                                        {!isSystemRole &&
                                                            userHasPermission({
                                                                user: auth.user,
                                                                permission:
                                                                    'delete roles',
                                                            }) && (
                                                                <>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        className="text-destructive focus:text-destructive"
                                                                        onClick={() =>
                                                                            router.delete(
                                                                                route(
                                                                                    'roles.destroy',
                                                                                    role.id,
                                                                                ),
                                                                                {
                                                                                    preserveScroll: true,
                                                                                },
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                                                                        {__(
                                                                            'roles.pages.index.table.actions.delete',
                                                                        )}
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
