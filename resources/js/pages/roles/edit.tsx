// resources/js/pages/roles/edit.tsx

// Necessary imports
import { Head, Link, useForm } from '@inertiajs/react';

// Layout
import AppLayout from '@/layouts/app/layout';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Custom components
import { DeleteRole } from '@/pages/roles/delete';
import { InformationsTab, PermissionsTab, UsersTab } from '@/pages/roles/form';

// Shadnc UI Components
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
import type { BreadcrumbItem, Permission, Role, User } from '@/types';

// Icons
import { ArrowLeft, File, Pen, Shield, Trash2, UserIcon } from 'lucide-react';

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
            title: __('roles.pages.breadcrumbs.edit'),
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
            />
        </AppLayout>
    );
}

function EditForm({
    role,
    permissions,
    usersWithoutRole,
}: {
    role: Role;
    permissions: Permission[];
    usersWithoutRole: User[];
}) {
    const __ = useTrans();

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
        <Card>
            <CardHeader>
                <CardTitle>
                    {__('roles.pages.edit.title', undefined, {
                        title: role.name,
                    })}
                </CardTitle>
                <CardDescription>
                    {__('roles.pages.edit.description')}
                </CardDescription>
                <CardAction className="space-x-2">
                    <Button asChild variant={'secondary'}>
                        <Link href={route('roles.index')}>
                            <ArrowLeft />
                            {__('roles.pages.form.buttons.back')}
                        </Link>
                    </Button>
                    <DeleteRole role={role}>
                        <Button variant="destructive">
                            <Trash2 />
                            {__('roles.pages.form.buttons.delete')}
                        </Button>
                    </DeleteRole>
                </CardAction>
            </CardHeader>
            <Separator />

            <form onSubmit={handleSubmit}>
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
                            disabled={processing}
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
                    </Tabs>
                </CardContent>
                <Separator className="my-6" />
                <CardFooter>
                    <Button disabled={processing} className="w-full">
                        {processing ? <Spinner /> : <Pen />}
                        {__('roles.pages.form.buttons.update')}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
