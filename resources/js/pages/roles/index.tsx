import { PaginationControl } from '@/components/pagination-control';
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
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app/layout';
import { useTrans } from '@/lib/translation';
import { formatDate, userHasPermission } from '@/lib/utils';
import type { BreadcrumbItem, Role, SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Briefcase,
    Eye,
    Lock,
    MoreHorizontal,
    Pencil,
    Plus,
    Search,
    Shield,
    ShieldAlert,
    Trash2,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

interface PaginatedData<T> {
    data: T[];
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
    roles: PaginatedData<Role>;
    filters?: { search?: string };
}

export default function Index({ roles, filters = {} }: Props) {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [debouncedSearch] = useDebounce(search, 300);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('dashboard.pages.breadcrumbs.dashboard'),
            href: route('dashboard'),
        },
        {
            title: __('roles.pages.breadcrumbs.index'),
            href: '#',
        },
    ];

    useEffect(() => {
        if (debouncedSearch !== (filters.search || '')) {
            router.get(
                route('roles.index'),
                { search: debouncedSearch },
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }
    }, [debouncedSearch, filters.search]);

    const handleRowClick = (roleId: number) => {
        if (userHasPermission({ user: auth.user, permission: 'show roles' })) {
            router.get(route('roles.show', roleId));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('roles.pages.index.head_title')} />

            <div className="container mx-auto max-w-full space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            {__('roles.pages.index.title')}
                        </h2>
                        <p className="text-muted-foreground">
                            {__('roles.pages.index.description')}
                        </p>
                    </div>
                    {userHasPermission({
                        user: auth.user,
                        permission: 'create roles',
                    }) && (
                        <Button asChild className="shadow-sm">
                            <Link href={route('roles.create')}>
                                <Plus className="mr-2 h-4 w-4" />
                                {__('roles.pages.index.buttons.create')}
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <Card className={'gap-0'}>
                        <div className="flex items-center border-b px-6 py-4">
                            <div className="relative w-full max-w-sm">
                                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder={__(
                                        'roles.pages.index.search_placeholder',
                                    )}
                                    className="bg-background pl-9"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="w-62.5 pl-6">
                                            {__(
                                                'roles.pages.index.table.columns.name',
                                            )}
                                        </TableHead>
                                        <TableHead>
                                            {__(
                                                'roles.pages.index.table.columns.users',
                                            )}
                                        </TableHead>
                                        <TableHead>
                                            {__(
                                                'roles.pages.index.table.columns.permissions',
                                            )}
                                        </TableHead>
                                        <TableHead className="hidden text-right md:table-cell">
                                            {__(
                                                'roles.pages.index.table.columns.updated_at',
                                            )}
                                        </TableHead>
                                        <TableHead className="w-17.5"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roles.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="h-24 text-center"
                                            >
                                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                    <Briefcase className="mb-2 h-8 w-8 opacity-20" />
                                                    <p>
                                                        {__(
                                                            'roles.pages.index.empty_search',
                                                        )}
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        roles.data.map((role) => {
                                            const isSystemRole = [
                                                'admin',
                                                'solver',
                                                'simple_user',
                                            ].includes(role.name.toLowerCase());

                                            return (
                                                <TableRow
                                                    key={role.id}
                                                    className="group cursor-pointer transition-colors hover:bg-muted/40"
                                                    onClick={() =>
                                                        handleRowClick(role.id)
                                                    }
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
                                                                {role.nbrOfUsers ||
                                                                    0}
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
                                                                {
                                                                    role
                                                                        .permissions
                                                                        .length
                                                                }
                                                            </Badge>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell className="hidden text-right text-sm text-muted-foreground md:table-cell">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <span className="truncate">
                                                                {formatDate(
                                                                    role.updated_at,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell className="pr-6">
                                                        <div
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                        >
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                                                                    >
                                                                        <span className="sr-only">
                                                                            Open
                                                                            menu
                                                                        </span>
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

                                                                    {userHasPermission(
                                                                        {
                                                                            user: auth.user,
                                                                            permission:
                                                                                'show roles',
                                                                        },
                                                                    ) && (
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

                                                                    {userHasPermission(
                                                                        {
                                                                            user: auth.user,
                                                                            permission:
                                                                                'update roles',
                                                                        },
                                                                    ) && (
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
                                                                        userHasPermission(
                                                                            {
                                                                                user: auth.user,
                                                                                permission:
                                                                                    'delete roles',
                                                                            },
                                                                        ) && (
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
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <PaginationControl
                        meta={roles}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
