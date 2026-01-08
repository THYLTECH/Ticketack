import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
    Ticket,
    TicketCategory,
    TicketPriority,
    TicketStatus,
    User,
} from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Check, Trash } from 'lucide-react';
import React, { useMemo, useState } from 'react';

interface EditProps {
    ticket: Ticket;
    priorities: TicketPriority[];
    categories: TicketCategory[];
    statuses: TicketStatus[];
    assets: Asset[];
    users: User[];
}

interface FileWrapper {
    file: File;
    id?: string | number;
}

interface TicketFormSchema extends Omit<
    TicketFormData,
    'assignees' | 'attachments'
> {
    assignees: number[];
    attachments: (File | FileWrapper)[];
}

type TicketWithForeignKeys = Ticket & {
    priority_id?: number | string | null;
    status_id?: number | string | null;
    category_id?: number | string | null;
    asset_id?: number | string | null;
    assignees?: Array<{ user_id: number; user: { id: number } }>;
};

export default function Edit({
    ticket,
    priorities,
    categories,
    statuses,
    assets,
    users,
}: EditProps) {
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
                title: `#${ticket.id} - ${ticket.title}`,
                href: route('tickets.show', ticket.id),
            },
            {
                title: __('tickets.pages.breadcrumbs.edit'),
                href: '#',
            },
        ],
        [__, ticket.id, ticket.title],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${__('tickets.pages.edit.title')} #${ticket.id}`} />

            <div className="container mx-auto max-w-full px-4 py-8 sm:px-6 lg:px-8">
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
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    const ticketWithFK = ticket as TicketWithForeignKeys;

    const { data, setData, processing, errors, hasErrors, clearErrors } =
        useForm<TicketFormSchema>({
            title: ticket.title || '',
            description: ticket.description || '',
            is_public: Boolean(ticket.is_public),
            is_referenced: Boolean(ticket.is_referenced),
            detailed_solution: ticket.detailed_solution || '',
            priority_id: ticketWithFK.priority_id
                ? Number(ticketWithFK.priority_id)
                : (ticket.priority?.id ?? null),
            status_id: ticketWithFK.status_id
                ? Number(ticketWithFK.status_id)
                : (ticket.status?.id ?? null),
            category_id: ticketWithFK.category_id
                ? Number(ticketWithFK.category_id)
                : (ticket.category?.id ?? null),
            asset_id: ticketWithFK.asset_id
                ? Number(ticketWithFK.asset_id)
                : ticket.asset?.id
                  ? Number(ticket.asset.id)
                  : null,
            attachments: [],
            assignees: ticket.assignees
                ? ticket.assignees.map((assignee) => assignee.user.id)
                : [],
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // @ts-expect-error - Compatibilité de type mineure
        const formData = prepareTicketFormData(data, 'PUT');

        router.post(route('tickets.update', ticket.id), formData, {
            forceFormData: true,
        });
    };

    const confirmDelete = () => {
        router.delete(route('tickets.destroy', ticket.id), {
            onFinish: () => setDeleteConfirmOpen(false),
        });
    };

    const handleClearErrors = (field?: keyof TicketFormSchema) => {
        clearErrors(field as keyof TicketFormSchema);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        {__('tickets.pages.edit.title')} #{ticket.id}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {__('tickets.pages.edit.description')}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link href={route('tickets.show', ticket.id)}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {__('tickets.pages.form.buttons.back_to_ticket')}
                        </Link>
                    </Button>

                    {userHasPermission({
                        user: auth.user,
                        permission: 'delete tickets',
                    }) && (
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteConfirmOpen(true)}
                        >
                            <Trash className="mr-2 h-4 w-4" />
                            {__('tickets.pages.form.buttons.delete')}
                        </Button>
                    )}
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
                        data={data as unknown as never}
                        setData={setData}
                        errors={errors}
                        clearErrors={handleClearErrors}
                        disabled={processing}
                        priorities={priorities}
                        statuses={statuses}
                        categories={categories}
                        assets={assets}
                        users={users}
                        existingAttachments={ticket.attachments}
                    />
                </CardContent>

                {userHasPermission({
                    user: auth.user,
                    permission: 'update tickets',
                }) && (
                    <CardFooter className="flex items-center justify-end gap-2 border-t px-6 py-4">
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
                            className="min-w-37.5 gap-2"
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

            <AlertDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {__('tickets.archive.confirm')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {__('tickets.archive.message')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {__('tickets.pages.delete.buttons.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {__('tickets.pages.form.buttons.delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </form>
    );
}
