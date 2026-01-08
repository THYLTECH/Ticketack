import { PaginationControl } from '@/components/pagination-control';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app/layout';
import { useTrans } from '@/lib/translation';
import { formatDate, userHasPermission } from '@/lib/utils';
import type { BreadcrumbItem, SharedData, User } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Check,
    Mail,
    Plus,
    Search,
    Shield,
    User as UserIcon,
    X,
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
    users: PaginatedData<User>;
    filters?: { search?: string };
}

export default function Index({ users, filters = {} }: Props) {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();

    const [search, setSearch] = useState(filters.search || '');
    const [debouncedSearch] = useDebounce(search, 300);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('home.pages.breadcrumbs.home'),
            href: route('home'),
        },
        {
            title: __('users.pages.breadcrumbs.index'),
            href: '#',
        },
    ];

    useEffect(() => {
        if (debouncedSearch !== (filters.search || '')) {
            router.get(
                route('users.index'),
                { search: debouncedSearch },
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }
    }, [debouncedSearch, filters.search]);

    const handleRowClick = (user: User) => {
        if (auth.user.id === user.id) {
            router.get(route('settings.profile.edit'));
        } else if (
            userHasPermission({ user: auth.user, permission: 'show users' })
        ) {
            router.get(route('users.show', { user: user.id }));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('users.pages.index.head_title')} />

            <div className="container mx-auto max-w-full space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            {__('users.pages.index.title')}
                        </h2>
                        <p className="text-muted-foreground">
                            {__('users.pages.index.description')}
                        </p>
                    </div>
                    {userHasPermission({
                        user: auth.user,
                        permission: 'create users',
                    }) && (
                        <Button asChild className="shadow-sm">
                            <Link href={route('users.create')}>
                                <Plus className="mr-2 h-4 w-4" />
                                {__('users.pages.index.buttons.create')}
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
                                    placeholder={
                                        __(
                                            'users.pages.index.search_placeholder',
                                        ) || 'Search users...'
                                    }
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
                                        <TableHead className="w-15 pl-6"></TableHead>
                                        <TableHead className="min-w-50">
                                            {__(
                                                'users.pages.index.table.columns.name',
                                            )}
                                        </TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            {__(
                                                'users.pages.index.table.columns.email',
                                            )}
                                        </TableHead>
                                        <TableHead className="hidden lg:table-cell">
                                            {__(
                                                'users.pages.index.table.columns.email_status',
                                            )}
                                        </TableHead>
                                        <TableHead className="hidden xl:table-cell">
                                            {__(
                                                'users.pages.index.table.columns.roles',
                                            )}
                                        </TableHead>
                                        <TableHead className="pr-6 text-right">
                                            {__(
                                                'users.pages.index.table.columns.created_at',
                                            )}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="h-24 text-center"
                                            >
                                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                    <UserIcon className="mb-2 h-8 w-8 opacity-20" />
                                                    <p>
                                                        {__(
                                                            'users.pages.index.empty.title',
                                                        )}
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.data.map((user) => (
                                            <TableRow
                                                key={user.id}
                                                className="group cursor-pointer transition-colors hover:bg-muted/40"
                                                onClick={() =>
                                                    handleRowClick(user)
                                                }
                                            >
                                                <TableCell className="pl-6 align-middle">
                                                    <Avatar className="h-9 w-9 overflow-hidden rounded-full border bg-muted">
                                                        <AvatarImage
                                                            src={
                                                                user.avatar
                                                                    ?.url ||
                                                                undefined
                                                            }
                                                            alt={user.name}
                                                        />
                                                        <AvatarFallback className="text-xs font-medium text-muted-foreground">
                                                            {getInitials(
                                                                user.name,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </TableCell>
                                                <TableCell className="align-middle">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-foreground">
                                                            {user.name}
                                                        </span>
                                                        {user.id ===
                                                            auth.user.id && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="h-5 px-1.5 text-[10px] font-medium"
                                                            >
                                                                {__(
                                                                    'users.pages.index.table.labels.you',
                                                                )}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden align-middle text-sm text-muted-foreground md:table-cell">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-3.5 w-3.5 opacity-70" />
                                                        {user.email}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden align-middle lg:table-cell">
                                                    {user.email_verified_at ? (
                                                        <Badge
                                                            variant="outline"
                                                            className="gap-1.5 border-emerald-500/20 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400"
                                                        >
                                                            <Check className="h-3.5 w-3.5" />
                                                            {__(
                                                                'users.pages.index.table.labels.email_verified',
                                                            )}
                                                        </Badge>
                                                    ) : (
                                                        <Badge
                                                            variant="outline"
                                                            className="gap-1.5 border-muted-foreground/20 text-muted-foreground"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                            {__(
                                                                'users.pages.index.table.labels.email_unverified',
                                                            )}
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="hidden align-middle xl:table-cell">
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.roles &&
                                                        user.roles.length >
                                                            0 ? (
                                                            user.roles.map(
                                                                (role) => (
                                                                    <Badge
                                                                        key={
                                                                            role.id
                                                                        }
                                                                        variant="secondary"
                                                                        className="gap-1 font-normal"
                                                                    >
                                                                        <Shield className="h-3 w-3 opacity-50" />
                                                                        {
                                                                            role.name
                                                                        }
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
                                                <TableCell className="pr-6 text-right align-middle text-sm text-muted-foreground tabular-nums">
                                                    {formatDate(
                                                        user.created_at,
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <PaginationControl
                        meta={users}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
