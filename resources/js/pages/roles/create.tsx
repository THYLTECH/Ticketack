// resources/js/pages/roles/create.tsx

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
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
import type { BreadcrumbItem, Permission } from '@/types';

// Icons
import { ArrowLeft, File, Plus, Shield } from 'lucide-react';

export default function Create({ permissions }: { permissions: Permission[] }) {
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
            <Head title="Create a Role" />

            <CreateForm permissions={permissions} />
        </AppLayout>
    );
}

function CreateForm({ permissions }: { permissions: Permission[] }) {
    const __ = useTrans();

    const { data, setData, processing, errors, post } = useForm<{
        name: string;
        permissions: string[];
    }>({
        name: '',
        permissions: [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('roles.store'));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create a role</CardTitle>
                <CardDescription>
                    Fill in the form below to create a new role.
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

            <form onSubmit={handleSubmit}>
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
                        />
                        <PermissionsTab
                            data={data}
                            setData={setData}
                            permissions={permissions}
                        />
                    </Tabs>
                </CardContent>
                <Separator className="my-6" />
                <CardFooter>
                    <Button disabled={processing} className="w-full">
                        {processing ? <Spinner /> : <Plus />}
                        Store Role
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
