// resources/js/pages/roles/show.tsx

// Necessary imports
import { userHasPermission } from '@/lib/utils';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

// Layout
import AppLayout from '@/layouts/app/layout';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Custom components
import { InformationsTab, PermissionsTab, UsersTab } from '@/pages/roles/form';

// Shadnc UI Components
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
import type {
    BreadcrumbItem,
    Permission,
    Role,
    SharedData,
    User,
} from '@/types';

// Icons
import { ArrowLeft, File, Pen, Shield, UserIcon } from 'lucide-react';

export default function Show({
    role,
    permissions,
    usersWithoutRole,
}: {
    role: Role;
    permissions: Permission[];
    usersWithoutRole: User[];
}) {
    const __ = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('dashboard.pages.breadcrumbs.dashboard'),
            href: route('dashboard'),
        },
        {
            title: __('roles.pages.breadcrumbs.index'),
            href: route('roles.index'),
        },
        {
            title: __('roles.pages.breadcrumbs.show'),
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={__('roles.pages.show.head_title', undefined, {
                    title: role.name,
                })}
            />

            <ShowForm
                role={role}
                permissions={permissions}
                usersWithoutRole={usersWithoutRole}
            />
        </AppLayout>
    );
}

function ShowForm({
    role,
    permissions,
    usersWithoutRole,
}: {
    role: Role;
    permissions: Permission[];
    usersWithoutRole: User[];
}) {
    const __ = useTrans();

    const { data, setData, errors } = useForm<{
        name: string;
        permissions: Permission[];
        users: User[];
    }>({
        name: role.name,
        permissions: role.permissions || [],
        users: role.users || [],
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {__('roles.pages.show.title', undefined, {
                        title: role.name,
                    })}
                </CardTitle>
                <CardDescription>
                    {__('roles.pages.show.description')}
                </CardDescription>
                <CardAction className="space-x-2">
                    <Button asChild variant={'secondary'}>
                        <Link href={route('roles.index')}>
                            <ArrowLeft />
                            {__('roles.pages.form.buttons.back')}
                        </Link>
                    </Button>
                    {userHasPermission({
                        user: usePage<SharedData>().props.auth.user,
                        permission: 'update roles',
                    }) && (
                        <Button asChild variant={'default'}>
                            <Link href={route('roles.edit', { role: role.id })}>
                                <Pen />
                                {__('roles.pages.form.buttons.edit')}
                            </Link>
                        </Button>
                    )}
                </CardAction>
            </CardHeader>
            <Separator />

            <CardContent>
                <Tabs
                    defaultValue={'informations'}
                    className="w-full space-y-4"
                >
                    <TabsList className="w-full">
                        <TabsTrigger value={'informations'}>
                            <File />
                            {__('roles.pages.form.tabs.informations')}
                        </TabsTrigger>
                        <TabsTrigger value={'permissions'}>
                            <Shield />
                            {__('roles.pages.form.tabs.permissions')}
                        </TabsTrigger>
                        <TabsTrigger value={'users'}>
                            <UserIcon />
                            {__('roles.pages.form.tabs.users')}
                        </TabsTrigger>
                    </TabsList>

                    <InformationsTab
                        data={data}
                        setData={setData}
                        errors={errors}
                        disabled
                    />
                    <PermissionsTab
                        data={data}
                        setData={setData}
                        permissions={permissions}
                        disabled
                    />
                    <UsersTab
                        data={data}
                        setData={setData}
                        usersWithoutRole={usersWithoutRole}
                        disabled
                    />
                </Tabs>
            </CardContent>
        </Card>
    );
}
