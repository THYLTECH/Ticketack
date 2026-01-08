// resources/js/pages/users/index.tsx

// Necessary imports
import { Head, Link, router, usePage } from '@inertiajs/react';

// Layout
import AppLayout from '@/layouts/app/layout';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Custom functions
import { formatDate, userHasPermission } from '@/lib/utils';

// Types
import type { BreadcrumbItem, SharedData, User } from '@/types';

// Custom components

// Shadcn UI Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

// Icons
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { Check, Plus, RefreshCcw, Shield, X } from 'lucide-react';
import LaravelPagination from '@/components/LaravelPagination';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export default function Index({ users }: { users: { data: User[], links: PaginationLink[] } }) {
    const __ = useTrans();
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

    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('users.pages.index.head_title')} />

            <Card>
                <CardHeader>
                    <CardTitle>{__('users.pages.index.title')}</CardTitle>
                    <CardDescription>
                        {__('users.pages.index.description')}
                    </CardDescription>

                    <CardAction className="flex items-center gap-2">
                        {userHasPermission({
                            user: auth.user,
                            permission: 'create users',
                        }) && (
                            <Button asChild>
                                <Link href={route('users.create')}>
                                    <Plus />
                                    {__('users.pages.index.buttons.create')}
                                </Link>
                            </Button>
                        )}
                    </CardAction>
                </CardHeader>
                <Separator />

                <CardContent>
                    {users.data.length === 0 ? (
                        <UserEmpty />
                    ) : (
                        <>
                            <UserTable users={users.data} />

                            <div className="mt-4">
                                <LaravelPagination links={users.links} />
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </AppLayout>
    );
}

function UserEmpty() {
    const __ = useTrans();

    return (
        <Empty className="border border-dashed">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Shield />
                </EmptyMedia>
                <EmptyTitle>{__('users.pages.index.empty.title')}</EmptyTitle>
                <EmptyDescription>
                    {__('users.pages.index.empty.description')}
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button variant="outline" size="sm" asChild>
                    <Link href={route('users.index')}>
                        <RefreshCcw />
                        {__('users.pages.index.empty.button')}
                    </Link>
                </Button>
            </EmptyContent>
        </Empty>
    );
}

function UserTable({ users }: { users: User[] }) {
    const __ = useTrans();

    const auth = usePage<SharedData>().props.auth;

    const getInitials = useInitials();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-xs text-muted-foreground">
                        {/* {__('users.pages.index.table.columns.pfp')} */}
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground">
                        {__('users.pages.index.table.columns.name')}
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground">
                        {__('users.pages.index.table.columns.email')}
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground">
                        {__('users.pages.index.table.columns.email_status')}
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground">
                        {__('users.pages.index.table.columns.roles')}
                    </TableHead>
                    <TableHead className="w-[8rem] text-right text-xs text-muted-foreground">
                        {__('users.pages.index.table.columns.updated_at')}
                    </TableHead>
                    <TableHead className="w-[8rem] text-right text-xs text-muted-foreground">
                        {__('users.pages.index.table.columns.created_at')}
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow
                        className="relative cursor-pointer"
                        key={user.id}
                        onClick={() => {
                            if (auth.user.id == user.id) {
                                router.get(route('settings.profile.edit'));
                            } else {
                                if (
                                    userHasPermission({
                                        user: auth.user,
                                        permission: 'show users',
                                    })
                                ) {
                                    router.get(
                                        route('users.show', { user: user.id }),
                                    );
                                }
                            }
                        }}
                    >
                        <TableCell>
                            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                <AvatarImage
                                    src={user.avatar?.url || undefined}
                                    alt={user.name}
                                />
                                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                        </TableCell>
                        <TableCell>
                            {auth.user.id === user.id ? (
                                <Link
                                    href={route('settings.profile.edit')}
                                    className="absolute inset-0 z-0"
                                />
                            ) : (
                                userHasPermission({
                                    user: auth.user,
                                    permission: 'show users',
                                }) && (
                                    <Link
                                        href={route('users.show', {
                                            user: user.id,
                                        })}
                                        className="absolute inset-0 z-0"
                                    />
                                )
                            )}

                            <div className="font-medium">
                                {user.name}
                                {user.id === auth.user.id && (
                                    <Badge className="ml-3">
                                        {__(
                                            'users.pages.index.table.labels.you',
                                        )}
                                    </Badge>
                                )}
                            </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                            {user.email_verified_at ? (
                                <Badge>
                                    <Check />
                                    {__(
                                        'users.pages.index.table.labels.email_verified',
                                    )}
                                </Badge>
                            ) : (
                                <Badge variant={'outline'}>
                                    <X />
                                    {__(
                                        'users.pages.index.table.labels.email_unverified',
                                    )}
                                </Badge>
                            )}
                        </TableCell>
                        <TableCell>
                            {user.roles &&
                                user.roles.map((role) => (
                                    <Badge
                                        key={role.id}
                                        className="mr-2"
                                        variant={'secondary'}
                                    >
                                        {role.name}
                                    </Badge>
                                ))}
                        </TableCell>
                        <TableCell className="text-right">
                            {formatDate(user.updated_at)}
                        </TableCell>
                        <TableCell className="text-right">
                            {formatDate(user.created_at)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
