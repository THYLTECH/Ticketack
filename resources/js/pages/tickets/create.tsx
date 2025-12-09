// resources/js/pages/tickets/create.tsx

// Necessary imports
import { userHasPermission } from '@/lib/utils';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

// Layout
import AppLayout from '@/layouts/app/layout';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Custom components
import { InformationsTab, UsersTab } from '@/pages/tickets/form';

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
import type {
    Asset,
    BreadcrumbItem,
    SharedData,
    TicketCategory,
    TicketPriority,
    TicketStatus,
    User,
} from '@/types';

// Icons
import { FileWithPreview } from '@/hooks/use-file-upload';
import { ArrowLeft, File, Plus, Users } from 'lucide-react';

interface CreateProps {
    priorities: TicketPriority[];
    categories: TicketCategory[];
    statuses: TicketStatus[];
    assets: Asset[];
    users: User[];
}

export default function Create({
    priorities,
    categories,
    statuses,
    assets,
    users,
}: CreateProps) {
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
            title: 'Manage',
            href: route('tickets.manage'),
        },
        {
            title: __('tickets.pages.breadcrumbs.create'),
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('tickets.pages.create.head_title')} />

            <CreateForm
                priorities={priorities}
                categories={categories}
                statuses={statuses}
                assets={assets}
                users={users}
            />
        </AppLayout>
    );
}

function CreateForm({ priorities, categories, statuses, assets, users }: CreateProps) {
    const __ = useTrans();

    const { data, setData, processing, errors, post } = useForm<{
        title: string;
        description: string;

        priority_id: number | null;
        status_id: number | null;
        category_id: number | null;
        asset_id: number | null;

        attachments: FileWithPreview[];

        assignees: User[];
    }>({
        title: '',
        description: '',

        priority_id: null,
        status_id: null,
        category_id: null,
        asset_id: null,

        attachments: [],

        assignees: [],
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
                        <Link href={route('tickets.manage')}>
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
                            <TabsTrigger value={'users'}>
                                <Users />
                                Assignees
                            </TabsTrigger>
                        </TabsList>

                        <InformationsTab
                            data={data}
                            setData={setData}
                            errors={errors}
                            disabled={processing}
                            priorities={priorities}
                            statuses={statuses}
                            categories={categories}
                            assets={assets}
                        />

                        <UsersTab   
                            data={data}
                            setData={setData}
                            users={users}
                            disabled={processing}
                        />
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
