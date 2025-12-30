import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileWithPreview } from '@/hooks/use-file-upload';
import AppLayout from '@/layouts/app/layout';
import { useTrans } from '@/lib/translation';
import { userHasPermission } from '@/lib/utils';
import { InformationsTab, UsersTab } from '@/pages/tickets/form';
import {
    Asset,
    BreadcrumbItem,
    SharedData,
    TicketCategory,
    TicketPriority,
    TicketStatus,
    User,
} from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Check, FileText, Users } from 'lucide-react';
import React from 'react';

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
            title: __('tickets.pages.index.buttons.manage'),
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

            <div className="container mx-auto max-w-[1600px] space-y-5 px-4 py-8 sm:px-6 lg:px-8">
                <CreateForm
                    priorities={priorities}
                    categories={categories}
                    statuses={statuses}
                    assets={assets}
                    users={users}
                />
            </div>
        </AppLayout>
    );
}

function CreateForm({
    priorities,
    categories,
    statuses,
    assets,
    users,
}: CreateProps) {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;

    const { data, setData, processing, errors, post } = useForm<{
        title: string;
        description: string;
        is_public: boolean;
        priority_id: number | null;
        status_id: number | null;
        category_id: number | null;
        asset_id: number | null;
        attachments: FileWithPreview[];
        assignees: User[];
    }>({
        title: '',
        description: '',
        is_public: false,
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
        <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        {__('tickets.pages.create.title')}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {__('tickets.pages.create.description')}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button asChild variant="secondary" size="sm">
                        <Link href={route('tickets.manage')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {__('tickets.pages.form.buttons.back')}
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="mx-auto max-w-5xl">
                <form onSubmit={handleSubmit}>
                    <Card className="border-none shadow-sm ring-1 ring-border/50">
                        <CardContent className="p-6">
                            <Tabs
                                defaultValue="informations"
                                className="w-full"
                            >
                                <TabsList className="grid w-full grid-cols-2 bg-muted/20 p-1 md:w-[400px]">
                                    <TabsTrigger
                                        value="informations"
                                        className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                    >
                                        <FileText className="h-4 w-4" />
                                        {__(
                                            'tickets.pages.form.tabs.informations',
                                        )}
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="users"
                                        className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                    >
                                        <Users className="h-4 w-4" />
                                        {__(
                                            'tickets.pages.form.tabs.assignees',
                                        )}
                                    </TabsTrigger>
                                </TabsList>

                                <div className="mt-6">
                                    <div className="space-y-4">
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
                                    </div>
                                </div>
                            </Tabs>
                        </CardContent>

                        {userHasPermission({
                            user: auth.user,
                            permission: 'create tickets',
                        }) && (
                            <CardFooter className="flex items-center justify-between border-t bg-muted/5 px-6 py-4">
                                <Button
                                    variant="ghost"
                                    asChild
                                    disabled={processing}
                                    type="button"
                                >
                                    <Link href={route('tickets.manage')}>
                                        {__(
                                            'tickets.pages.delete.buttons.cancel',
                                        )}
                                    </Link>
                                </Button>
                                <Button
                                    disabled={processing}
                                    className="min-w-[150px] gap-2"
                                >
                                    {processing ? (
                                        <Spinner className="h-4 w-4 text-primary-foreground" />
                                    ) : (
                                        <Check className="h-4 w-4" />
                                    )}
                                    {__('tickets.pages.form.buttons.store')}
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                </form>
            </div>
        </>
    );
}
