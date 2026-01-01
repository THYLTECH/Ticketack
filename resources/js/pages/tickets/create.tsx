import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app/layout';
import { useTrans } from '@/lib/translation';
import { userHasPermission } from '@/lib/utils';
import {
    InformationsTab,
    TicketFormData,
    UsersTab,
} from '@/pages/tickets/form';
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
import { AlertCircle, ArrowLeft, Check, FileText, Users } from 'lucide-react';
import React, { useMemo } from 'react';

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

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
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
        ],
        [__],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('tickets.pages.create.head_title')} />

            <div className="container mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
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

    const { data, setData, processing, errors, hasErrors, post, clearErrors } =
        useForm<TicketFormData>({
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

    /**
     * Wrapper to satisfy the type mismatch between Inertia's complex nested keys
     * and the Child component's expected simple key type using exact parameter inference.
     */
    const handleClearErrors = (field?: keyof TicketFormData) => {
        clearErrors(field as Parameters<typeof clearErrors>[0]);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        {__('tickets.pages.create.title')}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {__('tickets.pages.create.description')}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link href={route('tickets.manage')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {__('tickets.pages.form.buttons.back')}
                        </Link>
                    </Button>
                </div>
            </div>

            {hasErrors && (
                <Alert
                    variant="destructive"
                    className="animate-in fade-in slide-in-from-top-2"
                >
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>
                        {__('tickets.pages.create.validation_error.title')}
                    </AlertTitle>
                    <AlertDescription>
                        {__(
                            'tickets.pages.create.validation_error.description',
                        )}
                    </AlertDescription>
                </Alert>
            )}

            <Card className="overflow-hidden border shadow-sm">
                <CardContent className="p-6">
                    <Tabs defaultValue="informations" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-muted p-1 md:w-[400px]">
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
                                    clearErrors={handleClearErrors}
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
                    permission: 'create tickets',
                }) && (
                    <CardFooter className="flex items-center justify-end gap-2 border-t px-6 py-4">
                        <Button
                            variant="ghost"
                            asChild
                            disabled={processing}
                            type="button"
                        >
                            <Link href={route('tickets.manage')}>
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
                            {__('tickets.pages.form.buttons.store')}
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </form>
    );
}
