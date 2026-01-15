import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app/layout';
import { useTrans } from '@/lib/translation';
import { userHasPermission } from '@/lib/utils';
import { InformationsTab, TicketFormData } from '@/pages/tickets/form';
import { prepareTicketFormData } from '@/pages/tickets/form/utils';
import {
    Asset,
    BreadcrumbItem,
    SharedData,
    TicketCategory,
    TicketPriority,
    TicketStatus,
    User,
} from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Check } from 'lucide-react';
import React, { useMemo } from 'react';

interface CreateProps {
    priorities: TicketPriority[];
    categories: TicketCategory[];
    statuses: TicketStatus[];
    assets: Asset[];
    users: User[];
}

interface TicketFormSchema extends Omit<
    TicketFormData,
    'assignees' | 'attachments'
> {
    assignees: number[];
    attachments: never[];
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
                title: __('home.pages.breadcrumbs.home'),
                href: route('home'),
            },
            {
                title: __('tickets.pages.breadcrumbs.index'),
                href: route('tickets.index'),
            },
            {
                title: __('tickets.pages.manage.title'),
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

            <div className="container mx-auto max-w-full px-4 py-8 sm:px-6 lg:px-8">
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

    const { data, setData, processing, errors, hasErrors, clearErrors } =
        useForm<TicketFormSchema>({
            title: '',
            description: '',
            is_archived: false,
            is_referenced: false,
            detailed_solution: '',
            priority_id: null,
            status_id: null,
            category_id: null,
            asset_id: null,
            attachments: [],
            assignees: [],
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = prepareTicketFormData(data);

        router.post(route('tickets.store'), formData, {
            forceFormData: true,
        });
    };

    const handleClearErrors = (field?: keyof TicketFormSchema) => {
        // @ts-expect-error - Compatibilité types useForm
        clearErrors(field);
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
                    <InformationsTab
                        data={data as never}
                        setData={setData}
                        errors={errors}
                        clearErrors={handleClearErrors}
                        disabled={processing}
                        priorities={priorities}
                        statuses={statuses}
                        categories={categories}
                        assets={assets}
                        users={users}
                        existingAttachments={[]}
                    />
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
                            className="min-w-37.5 gap-2"
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
