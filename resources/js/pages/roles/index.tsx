// resources/js/pages/roles/index.tsx

// Necessary imports
import { Head, Link, router, usePage } from '@inertiajs/react';

// Layout
import AppLayout from '@/layouts/app/layout';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Custom functions
import { formatDate, userHasPermission } from '@/lib/utils';

// Types
import type { BreadcrumbItem, Role, SharedData } from '@/types';

// Custom components

// Shadcn UI Components
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
import { Plus, RefreshCcw, Shield } from 'lucide-react';

export default function Index({ roles }: { roles: Role[] }) {
    const __ = useTrans();

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

    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('roles.pages.index.head_title')} />

            <Card>
                <CardHeader>
                    <CardTitle>{__('roles.pages.index.title')}</CardTitle>
                    <CardDescription>
                        {__('roles.pages.index.description')}
                    </CardDescription>

                    <CardAction className="flex items-center gap-2">
                        {userHasPermission({
                            user: auth.user,
                            permission: 'create roles',
                        }) && (
                            <Button asChild>
                                <Link href={route('roles.create')}>
                                    <Plus />
                                    {__('roles.pages.index.buttons.create')}
                                </Link>
                            </Button>
                        )}
                    </CardAction>
                </CardHeader>
                <Separator />

                <CardContent>
                    {roles.length === 0 ? (
                        <RoleEmpty />
                    ) : (
                        <RoleTable roles={roles} />
                    )}
                </CardContent>
            </Card>
        </AppLayout>
    );
}

function RoleEmpty() {
    const __ = useTrans();

    return (
        <Empty className="border border-dashed">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Shield />
                </EmptyMedia>
                <EmptyTitle>{__('roles.pages.index.empty.title')}</EmptyTitle>
                <EmptyDescription>
                    {__('roles.pages.index.empty.description')}
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button variant="outline" size="sm" asChild>
                    <Link href={route('roles.index')}>
                        <RefreshCcw />
                        {__('roles.pages.index.empty.button')}
                    </Link>
                </Button>
            </EmptyContent>
        </Empty>
    );
}

function RoleTable({ roles }: { roles: Role[] }) {
    const __ = useTrans();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-xs text-muted-foreground">
                        {__('roles.pages.index.table.columns.name')}
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground">
                        {__('roles.pages.index.table.columns.users')}
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground">
                        {__('roles.pages.index.table.columns.permissions')}
                    </TableHead>
                    <TableHead className="w-[8rem] text-right text-xs text-muted-foreground">
                        {__('roles.pages.index.table.columns.updated_at')}
                    </TableHead>
                    <TableHead className="w-[8rem] text-right text-xs text-muted-foreground">
                        {__('roles.pages.index.table.columns.created_at')}
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {roles.map((role) => (
                    <TableRow
                        className="relative cursor-pointer"
                        key={role.id}
                        onClick={() => {
                            if (
                                userHasPermission({
                                    user: usePage<SharedData>().props.auth.user,
                                    permission: 'show roles',
                                })
                            ) {
                                router.get(
                                    route('roles.show', { role: role.id }),
                                );
                            }
                        }}
                    >
                        <TableCell>
                            {userHasPermission({
                                user: usePage<SharedData>().props.auth.user,
                                permission: 'show roles',
                            }) && (
                                <Link
                                    href={route('roles.show', {
                                        role: role.id,
                                    })}
                                    className="absolute inset-0 z-0"
                                />
                            )}

                            <div className="font-medium">{role.name}</div>
                        </TableCell>
                        <TableCell>{role.nbrOfUsers || 0}</TableCell>
                        <TableCell>{role.permissions.length}</TableCell>
                        <TableCell className="text-right">
                            {formatDate(role.updated_at)}
                        </TableCell>
                        <TableCell className="text-right">
                            {formatDate(role.created_at)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
