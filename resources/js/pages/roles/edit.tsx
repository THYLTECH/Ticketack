import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app/layout';
import { useTrans } from '@/lib/translation';
import { userHasPermission } from '@/lib/utils';
import { DeleteRole } from '@/pages/roles/delete';
import { InformationsTab, PermissionsTab, UsersTab } from '@/pages/roles/form';
import type {
    BreadcrumbItem,
    Permission,
    Role,
    SharedData,
    User,
} from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Info, Save, Shield, Trash2, Users } from 'lucide-react';
import React from 'react';

export default function Edit({
    role,
    permissions,
    usersWithoutRole,
}: {
    role: Role;
    permissions: Permission[];
    usersWithoutRole: User[];
}) {
    const __ = useTrans();

    const isSystemRole = ['admin', 'solver', 'simple_user'].includes(
        role.name.toLowerCase().trim(),
    );

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
            title: role.name,
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={__('roles.pages.edit.head_title', undefined, {
                    title: role.name,
                })}
            />

            <EditForm
                role={role}
                permissions={permissions}
                usersWithoutRole={usersWithoutRole}
                isSystemRole={isSystemRole}
            />
        </AppLayout>
    );
}

function EditForm({
    role,
    permissions,
    usersWithoutRole,
    isSystemRole,
}: {
    role: Role;
    permissions: Permission[];
    usersWithoutRole: User[];
    isSystemRole: boolean;
}) {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;

    const { data, setData, errors, processing, patch } = useForm<{
        name: string;
        permissions: Permission[];
        users: User[];
    }>({
        name: role.name,
        permissions: role.permissions || [],
        users: role.users || [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('roles.update', { role: role.id }));
    };

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                        {__('roles.pages.edit.title', undefined, {
                            title: role.name,
                        })}
                        {isSystemRole && (
                            <Badge
                                variant="outline"
                                className="border-blue-200 bg-blue-50 text-blue-600"
                            >
                                {__(
                                    'roles.pages.form.fields.name.system_badge',
                                )}
                            </Badge>
                        )}
                    </h2>
                    <p className="text-muted-foreground">
                        {__('roles.pages.edit.description')}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link href={route('roles.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {__('roles.pages.form.buttons.back')}
                        </Link>
                    </Button>

                    {!isSystemRole &&
                        userHasPermission({
                            user: auth.user,
                            permission: 'delete roles',
                        }) && (
                            <DeleteRole role={role}>
                                <Button variant="destructive" size="sm">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {__('roles.pages.form.buttons.delete')}
                                </Button>
                            </DeleteRole>
                        )}
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardContent className="p-6">
                        <Tabs defaultValue="informations" className="w-full">
                            <TabsList className="grid h-12 w-full grid-cols-3 rounded-lg bg-muted/60 p-1">
                                <TabsTrigger
                                    value="informations"
                                    className="flex items-center gap-2 rounded-md transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                                >
                                    <Info className="h-4 w-4" />
                                    {__('roles.pages.form.tabs.informations')}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="permissions"
                                    className="flex items-center gap-2 rounded-md transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                                >
                                    <Shield className="h-4 w-4" />
                                    {__('roles.pages.form.tabs.permissions')}
                                    <Badge
                                        variant="secondary"
                                        className="ml-1 h-5 px-1.5 text-[10px] opacity-80"
                                    >
                                        {data.permissions.length}
                                    </Badge>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="users"
                                    className="flex items-center gap-2 rounded-md transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                                >
                                    <Users className="h-4 w-4" />
                                    {__('roles.pages.form.tabs.users')}
                                    <Badge
                                        variant="secondary"
                                        className="ml-1 h-5 px-1.5 text-[10px] opacity-80"
                                    >
                                        {data.users.length}
                                    </Badge>
                                </TabsTrigger>
                            </TabsList>

                            <div className="mt-6">
                                <InformationsTab
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                    disabled={processing}
                                    isSystemRole={isSystemRole}
                                />
                                <PermissionsTab
                                    data={data}
                                    setData={setData}
                                    permissions={permissions}
                                    disabled={processing}
                                />
                                <UsersTab
                                    data={data}
                                    setData={setData}
                                    usersWithoutRole={usersWithoutRole}
                                    disabled={processing}
                                />
                            </div>
                        </Tabs>
                    </CardContent>

                    {userHasPermission({
                        user: auth.user,
                        permission: 'update roles',
                    }) && (
                        <CardFooter className="flex justify-end border-t bg-muted/10 py-4">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="min-w-37.5"
                            >
                                {processing ? (
                                    <Spinner className="mr-2 h-4 w-4" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                {__('roles.pages.form.buttons.update')}
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            </form>
        </div>
    );
}
