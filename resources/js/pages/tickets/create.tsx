// resources/js/pages/tickets/create.tsx

// Necessary imports
import { userHasPermission } from '@/lib/utils';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

// Layout
import AppLayout from '@/layouts/app/layout';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Custom components
import { InformationsTab } from '@/pages/tickets/form';

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
import type { BreadcrumbItem, SharedData, Ticket, TicketCategory, TicketPriority, TicketStatus, Asset } from '@/types';

// Icons
import { ArrowLeft, File, Plus, TicketIcon, UserIcon, Users } from 'lucide-react';
import { FileWithPreview } from '@/hooks/use-file-upload';

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

const mockData = {
    priorities: [
        // {
        //     id: 1,
        //     title: 'Low',
        //     description: 'Low priority',
        //     sort_order: 1,
        //     color: '#34D399',
        //     created_at: '',
        //     updated_at: '',
        // },
        // {
        //     id: 2,
        //     title: 'Medium',
        //     description: 'Medium priority',
        //     sort_order: 2,
        //     color: '#FBBF24',
        //     created_at: '',
        //     updated_at: '',
        // },
        // {
        //     id: 3,
        //     title: 'High',
        //     description: 'High priority',
        //     sort_order: 3,
        //     color: '#F87171',
        //     created_at: '',
        //     updated_at: '',
        // },
    ] as TicketPriority[],
    statuses: [
        {
            id: 1,
            title: 'Open',
            description: 'Open status',
            sort_order: 1,
            color: '#3B82F6',
            icon: null,
            is_default: true,
            is_closed: false,
            created_at: '',
            updated_at: '',
        },
        {
            id: 2,
            title: 'In Progress',
            description: 'In Progress status',
            sort_order: 2,
            color: '#FBBF24',
            icon: null,
            is_default: false,
            is_closed: false,
            created_at: '',
            updated_at: '',
        },
        {
            id: 3,
            title: 'Closed',
            description: 'Closed status',
            sort_order: 3,
            color: '#10B981',
            icon: null,
            is_default: false,
            is_closed: true,
            created_at: '',
            updated_at: '',
        },
    ] as TicketStatus[],
    categories: [
        {
            id: 1,
            title: 'Software',
            description: 'Software related issues',
            sort_order: 1,
            color: '#8B5CF6',
            icon: 'code',
            created_at: '',
            updated_at: '',
        },
        {
            id: 2,
            title: 'Hardware',
            description: 'Hardware related issues',
            sort_order: 2,
            color: '#EF4444',
            icon: 'monitor',
            created_at: '',
            updated_at: '',
        },
        {
            id: 3,
            title: 'Network',
            description: 'Network related issues',
            sort_order: 3,
            color: '#3B82F6',
            icon: 'network',
            created_at: '',
            updated_at: '',
        },
    ] as TicketCategory[],
    assets: [
        {
            id: "1",
            title: 'Laptop Dell XPS 13',
            icon: 'laptop',
            parent_id: null,
            depth_level: 0,
        },
        {
            id: "2",
            title: 'Smartphones',
            icon: 'smartphone',
            parent_id: null,
            depth_level: 0,
        },
        {
            id: "3",
            title: 'iPhone 12 Pro',
            parent_id: "2",
            depth_level: 1,
        },
        {
            id: "4",
            title: 'Cisco Router 2901',
            icon: 'router',
            parent_id: null,
            depth_level: 0,
        },
    ] as Asset[],   
}

function CreateForm() {
    const __ = useTrans();

    const { data, setData, processing, errors, post } = useForm<{
        title: string;
        description: string;

        priority_id: number | null;
        status_id: number | null;
        category_id: number | null;
        asset_id: number | null;

        attachments: FileWithPreview[];

        assignees: number[];
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

                            priorities={mockData.priorities}
                            statuses={mockData.statuses}
                            categories={mockData.categories}
                            assets={mockData.assets}
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
