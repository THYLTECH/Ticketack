// resources/js/pages/users/create.tsx

// Necessary imports
import { userHasPermission } from '@/lib/utils';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

// Layout
import AppLayout from '@/layouts/app/layout';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Custom components
import { InformationsTab } from '@/pages/users/form';

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
import type { BreadcrumbItem, Role, SharedData } from '@/types';

// Icons
import { ArrowLeft, File, Plus } from 'lucide-react';

export default function Create({ roles }: { roles: Role[] }) {
    const __ = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('dashboard.pages.breadcrumbs.dashboard'),
            href: route('dashboard'),
        },
        {
            title: __('users.pages.breadcrumbs.index'),
            href: route('users.index'),
        },
        {
            title: __('users.pages.breadcrumbs.create'),
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('users.pages.create.head_title')} />

            <CreateForm existing_roles={roles} />
        </AppLayout>
    );
}

function CreateForm({ existing_roles }: { existing_roles: Role[] }) {
    const __ = useTrans();

    const { data, setData, processing, errors, post } = useForm<{
        name: string;
        email: string;
        phone: string;
        avatar?: File | null;
        roles: string[];
        email_verified: boolean;
    }>({
        name: '',
        email: '',
        phone: '',
        avatar: null,
        roles: [],
        email_verified: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.store'));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{__('users.pages.create.title')}</CardTitle>
                <CardDescription>
                    {__('users.pages.create.description')}
                </CardDescription>
                <CardAction>
                    <Button asChild variant={'secondary'}>
                        <Link href={route('users.index')}>
                            <ArrowLeft />
                            {__('users.pages.form.buttons.back')}
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
                        <TabsList className="hidden w-full">
                            <TabsTrigger value={'informations'}>
                                <File />
                                {__('users.pages.form.tabs.informations')}
                            </TabsTrigger>
                        </TabsList>

                        <InformationsTab
                            data={data}
                            setData={setData}
                            errors={errors}
                            disabled={processing}
                            roles={existing_roles}
                        />
                    </Tabs>
                </CardContent>
                <Separator className="my-6" />
                {userHasPermission({
                    user: usePage<SharedData>().props.auth.user,
                    permission: 'create users',
                }) && (
                    <CardFooter>
                        <Button disabled={processing} className="w-full">
                            {processing ? <Spinner /> : <Plus />}
                            {__('users.pages.form.buttons.store')}
                        </Button>
                    </CardFooter>
                )}
            </form>
        </Card>
    );
}
