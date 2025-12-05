// resources/js/pages/tickets/create.tsx

// Necessary imports
import { userHasPermission } from '@/lib/utils';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

// Layout
import AppLayout from '@/layouts/app/layout';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Custom components
// import { InformationsTab, PermissionsTab, UsersTab } from '@/pages/tickets/form';

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
import type { BreadcrumbItem, SharedData, User } from '@/types';

// Icons
import { ArrowLeft, File, Plus, TicketIcon, UserIcon } from 'lucide-react';

export default function Create() {
    const __ = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('dashboard.pages.breadcrumbs.dashboard'),
            href: route('dashboard'),
        },
        {
            title: __('tickets.pages.breadcrumbs.index'),
            href: route('tickets.index'),
        },
        {
            title: __('tickets.pages.breadcrumbs.create'),
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('tickets.pages.create.head_title')} />

            <CreateForm />
        </AppLayout>
    );
}

function CreateForm() {
    const __ = useTrans();

    const { data, setData, processing, errors, post } = useForm<{
        // 
    }>({
        // 
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tickets.store'));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{__('tickets.pages.create.title')}</CardTitle>
                <CardDescription>
                    {__('tickets.pages.create.description')}
                </CardDescription>
                <CardAction>
                    <Button asChild variant={'secondary'}>
                        <Link href={route('tickets.index')}>
                            <ArrowLeft />
                            {__('tickets.pages.form.buttons.back')}
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
                                {__('tickets.pages.form.tabs.informations')}
                            </TabsTrigger>
                        </TabsList>

                        {/* <InformationsTab
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
                        /> */}
                    </Tabs>
                </CardContent>
                <Separator className="my-6" />
                {userHasPermission({
                    user: usePage<SharedData>().props.auth.user,
                    permission: 'create tickets',
                }) && (
                    <CardFooter>
                        <Button disabled={processing} className="w-full">
                            {processing ? <Spinner /> : <Plus />}
                            {__('tickets.pages.form.buttons.store')}
                        </Button>
                    </CardFooter>
                )}
            </form>
        </Card>
    );
}
