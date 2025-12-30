import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileWithPreview } from '@/hooks/use-file-upload';
import AppLayout from '@/layouts/app/layout';
import { useTrans } from '@/lib/translation';
import { userHasPermission } from '@/lib/utils';
import { InformationsTab, UsersTab } from '@/pages/tickets/form';
import {
    Asset,
    BreadcrumbItem,
    SharedData,
    Ticket,
    TicketCategory,
    TicketPriority,
    TicketStatus,
    User,
} from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Check, FileText, Pencil, Trash, Users } from 'lucide-react';
import React from 'react';

interface EditProps {
    ticket: Ticket;
    priorities: TicketPriority[];
    categories: TicketCategory[];
    statuses: TicketStatus[];
    assets: Asset[];
    users: User[];
}

export default function Edit({
    ticket,
    priorities,
    categories,
    statuses,
    assets,
    users,
}: EditProps) {
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
            title: `#${ticket.id} - ${ticket.title}`,
            href: route('tickets.show', ticket.id),
        },
        {
            title: __('tickets.pages.breadcrumbs.edit'),
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${__('tickets.pages.edit.title')} #${ticket.id}`} />

            <div className="mx-auto max-w-[1600px] space-y-6">
                <EditForm
                    ticket={ticket}
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

function EditForm({
    ticket,
    priorities,
    categories,
    statuses,
    assets,
    users,
}: EditProps) {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;

    const { data, setData, processing, errors, put } = useForm<{
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
        title: ticket.title,
        description: ticket.description || '',
        is_public: ticket.is_public,
        priority_id: ticket.priority?.id ?? null,
        status_id: ticket.status?.id ?? null,
        category_id: ticket.category?.id ?? null,
        asset_id: ticket.asset?.id ? Number(ticket.asset.id) : null,
        attachments: [],
        assignees: ticket.assignees.map((assignee) => assignee.user),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('tickets.update', ticket.id));
    };

    const handleDelete = () => {
        if (confirm(__('tickets.archive.confirm'))) {
            router.delete(route('tickets.destroy', ticket.id));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border/50">
                <CardHeader className="border-b bg-muted/10 px-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
                                <Pencil className="h-5 w-5 text-muted-foreground" />
                                {__('tickets.pages.edit.title')} #{ticket.id}
                            </CardTitle>
                            <CardDescription>
                                {__('tickets.pages.edit.description')}
                            </CardDescription>
                        </div>

                        <div className="flex items-center gap-2">
                            {userHasPermission({
                                user: auth.user,
                                permission: 'delete tickets',
                            }) && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleDelete}
                                >
                                    <Trash className="mr-2 h-4 w-4" />
                                    {__('tickets.pages.form.buttons.delete')}
                                </Button>
                            )}
                            <Button asChild variant="secondary" size="sm">
                                <Link href={route('tickets.show', ticket.id)}>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    {__(
                                        'tickets.pages.form.buttons.back_to_ticket',
                                    )}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    <Tabs defaultValue="informations" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-muted/80 p-1 md:w-[400px]">
                            <TabsTrigger
                                value="informations"
                                className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                            >
                                <FileText className="h-4 w-4" />
                                {__('tickets.pages.form.tabs.informations')}
                            </TabsTrigger>
                            <TabsTrigger
                                value="users"
                                className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                            >
                                <Users className="h-4 w-4" />
                                {__('tickets.pages.form.tabs.assignees')}
                            </TabsTrigger>
                        </TabsList>

                        <div className="mt-6">
                            <TabsContent
                                value="informations"
                                className="m-0 space-y-4 focus-visible:outline-none"
                            >
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
                            </TabsContent>

                            <TabsContent
                                value="users"
                                className="m-0 focus-visible:outline-none"
                            >
                                <UsersTab
                                    data={data}
                                    setData={setData}
                                    users={users}
                                    disabled={processing}
                                />
                            </TabsContent>
                        </div>
                    </Tabs>
                </CardContent>

                {userHasPermission({
                    user: auth.user,
                    permission: 'update tickets',
                }) && (
                    <CardFooter className="flex items-center justify-between border-t bg-muted/5 px-6 py-4">
                        <Button
                            variant="ghost"
                            asChild
                            disabled={processing}
                            type="button"
                        >
                            <Link href={route('tickets.show', ticket.id)}>
                                {__('tickets.pages.delete.buttons.cancel')}
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
                            {__('tickets.pages.form.buttons.update')}
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </form>
    );
}
