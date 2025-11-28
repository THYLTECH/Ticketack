// resources/js/pages/roles/show.tsx

// Necessary imports
import { Head, Link, useForm } from '@inertiajs/react';

// Layout
import AppLayout from '@/layouts/app/layout';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Custom components
import { InformationsTab, PermissionsTab } from '@/pages/roles/form';

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
import type { BreadcrumbItem, Permission, Role } from '@/types';

// Icons
import { ArrowLeft, File, Shield } from 'lucide-react';

export default function Show({
    role,
    permissions,
}: {
    role: Role;
    permissions: Permission[];
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
            <Head title="Show Role" />

            <ShowForm role={role} permissions={permissions} />
        </AppLayout>
    );
}

function ShowForm({
    role,
    permissions,
}: {
    role: Role;
    permissions: Permission[];
}) {
    const __ = useTrans();

    const { data, setData, processing, errors, post } = useForm<{
        name: string;
        permissions: string[];
    }>({
        name: '',
        permissions: [],
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Show a role</CardTitle>
                <CardDescription>
                    View the details of this role.
                </CardDescription>
                <CardAction>
                    <Button asChild variant={'secondary'}>
                        <Link href={route('roles.index')}>
                            <ArrowLeft />
                            Go back to roles
                        </Link>
                    </Button>
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
                            Informations
                        </TabsTrigger>
                        <TabsTrigger value={'permissions'}>
                            <Shield />
                            Permissions
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
                </Tabs>
            </CardContent>
        </Card>
    );
}
