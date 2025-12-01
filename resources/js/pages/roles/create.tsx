// resources/js/pages/roles/create.tsx

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
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
import type { BreadcrumbItem, Permission, SharedData, User } from '@/types';

// Icons
import { ArrowLeft, File, Plus, Shield, UserIcon } from 'lucide-react';

export default function Create({
    permissions,
    usersWithoutRole,
}: {
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
            title: __('roles.pages.breadcrumbs.create'),
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('roles.pages.create.head_title')} />

            <CreateForm
                permissions={permissions}
                usersWithoutRole={usersWithoutRole}
            />
        </AppLayout>
    );
}

function CreateForm({
    permissions,
    usersWithoutRole,
}: {
    permissions: Permission[];
    usersWithoutRole: User[];
}) {
    const __ = useTrans();

    const { data, setData, processing, errors, post } = useForm<{
        name: string;
        permissions: Permission[];
        users: User[];
    }>({
        name: '',
        permissions: [],
        users: [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('roles.store'));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{__('roles.pages.create.title')}</CardTitle>
                <CardDescription>
                    {__('roles.pages.create.description')}
                </CardDescription>
                <CardAction>
                    <Button asChild variant={'secondary'}>
                        <Link href={route('roles.index')}>
                            <ArrowLeft />
                            {__('roles.pages.form.buttons.back')}
                        </Link>
                    </Button>
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
                {userHasPermission({
                    user: usePage<SharedData>().props.auth.user,
                    permission: 'create roles',
                }) && (
                    <CardFooter>
                        <Button disabled={processing} className="w-full">
                            {processing ? <Spinner /> : <Plus />}
                            {__('roles.pages.form.buttons.store')}
                        </Button>
                    </CardFooter>
                )}
            </form>
        </Card>
    );
}
