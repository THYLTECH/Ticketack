// resources/js/pages/notifications/index.tsx

// Necessary imports
import { Form, Head, Link, router, useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Shadcn UI Components
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

// Custom components
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app/layout';

// Helpers
import { cn, formatNotificationDate } from '@/lib/utils';

// Types
import type { BreadcrumbItem, Notification, PaginationProps } from '@/types';

// Icons
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Bell, MailOpen, RefreshCcw, Search, Trash2, X } from 'lucide-react';

type NotificationsProps = PaginationProps & {
    data: Notification[];
};

export default function Notifications({
    notifications,
    search,
    total_notifications,
}: {
    notifications: NotificationsProps;
    search?: string;
    total_notifications: number;
}) {
    const { ...pagination_props } = notifications;

    const __ = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('dashboard.pages.breadcrumbs.dashboard'),
            href: route('dashboard'),
        },
        {
            title: __('notifications.pages.breadcrumbs.index'),
            href: route('notifications.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('notifications.pages.index.head_title')} />

            <Heading
                title={__('notifications.pages.index.title')}
                description={__('notifications.pages.index.description')}
            />

            {total_notifications === 0 ? (
                <NotificationEmpty />
            ) : (
                <div className="grid gap-6">
                    <NotificationSearchForm search={search} />

                    <NotificationTable notifications={notifications} />

                    <NotificationPagination
                        pagination_props={pagination_props}
                    />
                </div>
            )}
        </AppLayout>
    );
}

function NotificationSearchForm({ search }: { search?: string }) {
    const __ = useTrans();
    return (
        <Form
            method={'GET'}
            action={route('notifications.index')}
            options={{
                preserveScroll: true,
            }}
        >
            {({ processing, errors }) => (
                <div className="flex w-full items-end justify-between gap-4">
                    <div className="grid w-full gap-2">
                        <Label htmlFor="search">
                            {__('notifications.pages.index.search.label')}
                        </Label>

                        <ButtonGroup className="w-full">
                            <InputGroup>
                                <InputGroupInput
                                    id="search"
                                    name="search"
                                    className="w-full"
                                    defaultValue={search || ''}
                                    placeholder={__(
                                        'notifications.pages.index.search.placeholder',
                                    )}
                                    aria-invalid={
                                        errors.search ? 'true' : 'false'
                                    }
                                    tabIndex={1}
                                />
                                {search && (
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton
                                            size="icon-xs"
                                            onClick={() => {
                                                router.get(
                                                    route(
                                                        'notifications.index',
                                                    ),
                                                    {
                                                        preserveScroll: true,
                                                    },
                                                );
                                            }}
                                        >
                                            <X />
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                )}
                            </InputGroup>

                            <Button
                                disabled={processing}
                                type={'submit'}
                                tabIndex={2}
                            >
                                {processing ? <Spinner /> : <Search />}
                                {__('notifications.pages.index.search.button')}
                            </Button>
                        </ButtonGroup>
                    </div>
                </div>
            )}
        </Form>
    );
}

function NotificationEmpty() {
    const __ = useTrans();
    return (
        <Empty className="h-full">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Bell />
                </EmptyMedia>
                <EmptyTitle>
                    {__('notifications.pages.index.empty.title')}
                </EmptyTitle>
                <EmptyDescription>
                    {__('notifications.pages.index.empty.description')}
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button variant="outline" size="sm" asChild>
                    <Link href={route('notifications.index')}>
                        <RefreshCcw />
                        {__('notifications.pages.index.empty.button')}
                    </Link>
                </Button>
            </EmptyContent>
        </Empty>
    );
}

function NotificationTable({
    notifications,
}: {
    notifications: NotificationsProps;
}) {
    const __ = useTrans();
    const { put, delete: destroy } = useForm();

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const { data } = notifications;

    // Sélecteur principal
    const allSelected = selectedIds.length === data.length && data.length > 0;
    const partiallySelected = selectedIds.length > 0 && !allSelected;

    const toggleSelectAll = () => {
        if (allSelected) setSelectedIds([]);
        else setSelectedIds(data.map((n) => n.id));
    };

    const toggleSelect = (id: string) => {
        // e?.stopPropagation();
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    };

    // Action solitaires
    const handleMarkAsRead = (
        notification: Notification,
        e?: React.MouseEvent<HTMLButtonElement>,
    ) => {
        e?.stopPropagation();
        if (!notification.read_at) {
            put(
                route('notifications.markAsRead', {
                    notification: notification.id,
                }),
                { preserveScroll: true },
            );
        }
    };
    const handleDelete = (
        notification: Notification,
        e?: React.MouseEvent<HTMLButtonElement>,
    ) => {
        e?.stopPropagation();
        destroy(
            route('notifications.destroy', { notification: notification.id }),
            { preserveScroll: true },
        );
    };

    // Actions groupées
    const handleBulkMarkAsRead = () => {
        put(route('notifications.markManyAsRead', { ids: selectedIds }), {
            preserveScroll: true,
        });
        setSelectedIds([]);
    };

    const handleBulkDelete = () => {
        destroy(route('notifications.destroyMany', { ids: selectedIds }), {
            preserveScroll: true,
        });
        setSelectedIds([]);
    };

    return (
        <>
            <div className="overflow-hidden">
                <AnimatePresence mode="wait">
                    {selectedIds.length > 0 && (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="w-full border-t border-b p-2 text-center text-sm">
                                {__(
                                    'notifications.pages.index.bulk_actions.text',
                                    undefined,
                                    { count: selectedIds.length },
                                )}
                                <Button
                                    variant="link"
                                    onClick={handleBulkMarkAsRead}
                                    className="px-1"
                                >
                                    {__(
                                        'notifications.pages.index.bulk_actions.mark_as_read',
                                    )}
                                </Button>
                                {__(
                                    'notifications.pages.index.bulk_actions.or',
                                )}
                                <Button
                                    variant="link"
                                    onClick={handleBulkDelete}
                                    className="px-1"
                                >
                                    {__(
                                        'notifications.pages.index.bulk_actions.delete',
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Table className="w-full table-fixed overflow-hidden">
                <TableHeader>
                    <TableRow className="!bg-background">
                        {notifications.data.length > 0 && (
                            <TableHead className="w-[4%]">
                                <Checkbox
                                    checked={
                                        allSelected
                                            ? true
                                            : partiallySelected
                                              ? 'indeterminate'
                                              : false
                                    }
                                    onCheckedChange={toggleSelectAll}
                                />
                            </TableHead>
                        )}
                        <TableHead className="w-[16%] text-left">
                            {__('notifications.pages.index.table.columns.type')}
                        </TableHead>
                        <TableHead className="w-[68%]">
                            {__(
                                'notifications.pages.index.table.columns.message',
                            )}
                        </TableHead>
                        <TableHead className="w-[12%] text-right">
                            {__('notifications.pages.index.table.columns.date')}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((notification) => {
                        const type = notification.data.type;
                        const category = notification.data.category;
                        const date = formatNotificationDate(
                            notification.created_at,
                        );

                        return (
                            <NotificationDetail
                                key={notification.id}
                                notification={notification}
                                handleMarkAsRead={() =>
                                    handleMarkAsRead(notification)
                                }
                            >
                                <TableRow
                                    className={cn(
                                        selectedIds.includes(notification.id)
                                            ? 'bg-muted hover:bg-muted'
                                            : notification.read_at
                                              ? 'bg-muted text-muted-foreground hover:bg-muted'
                                              : '',
                                        'group relative cursor-pointer',
                                    )}
                                >
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedIds.includes(
                                                notification.id,
                                            )}
                                            onClick={(e) => e.stopPropagation()}
                                            onCheckedChange={() =>
                                                toggleSelect(notification.id)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell className="text-left font-medium">
                                        {__(
                                            `notifications.preferences.${category}.items.${type}.title`,
                                            type,
                                        )}
                                    </TableCell>
                                    <TableCell className="truncate overflow-hidden whitespace-nowrap">
                                        <strong>
                                            {notification.data.title}
                                        </strong>{' '}
                                        – {notification.data.message}
                                    </TableCell>
                                    <TableCell className="text-right transition-opacity group-hover:opacity-0">
                                        {notification.read_at ? (
                                            <span>{date}</span>
                                        ) : (
                                            <strong>{date}</strong>
                                        )}
                                    </TableCell>
                                    <div
                                        className={cn(
                                            'absolute top-0 right-0 bottom-0 flex w-[12%] items-center justify-end gap-2 opacity-0 group-hover:opacity-100',
                                            'bg-transparent transition-opacity',
                                        )}
                                    >
                                        {!notification.read_at && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Button
                                                        variant={'ghost'}
                                                        size={'icon-sm'}
                                                        onClick={(e) =>
                                                            handleMarkAsRead(
                                                                notification,
                                                                e,
                                                            )
                                                        }
                                                        className="text-foreground"
                                                    >
                                                        <MailOpen />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {__(
                                                        'notifications.pages.index.table.buttons.mark_as_read',
                                                    )}
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Button
                                                    variant={'ghost'}
                                                    size={'icon-sm'}
                                                    onClick={(e) =>
                                                        handleDelete(
                                                            notification,
                                                            e,
                                                        )
                                                    }
                                                    className="text-foreground"
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {__(
                                                    'notifications.pages.index.table.buttons.delete',
                                                )}
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </TableRow>
                            </NotificationDetail>
                        );
                    })}
                    {data.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="py-4 text-center">
                                {__('notifications.pages.index.table.empty')}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                {notifications.total > 0 && (
                    <TableFooter>
                        <TableRow className="!bg-background">
                            <TableCell colSpan={4} className="py-2 text-center">
                                <span className="flex text-sm font-light text-muted-foreground">
                                    {__(
                                        'notifications.pages.index.table.footer',
                                        undefined,
                                        {
                                            first:
                                                (notifications.current_page -
                                                    1) *
                                                    notifications.per_page +
                                                1,
                                            last:
                                                (notifications.current_page -
                                                    1) *
                                                    notifications.per_page +
                                                data.length,
                                            total: notifications.total,
                                        },
                                    )}
                                </span>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
        </>
    );
}

function NotificationDetail({
    children,
    notification,
    handleMarkAsRead,
}: {
    children: React.ReactNode;
    notification: Notification;
    handleMarkAsRead: (notification: Notification) => void;
}) {
    const __ = useTrans();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) handleMarkAsRead(notification);
    }, [open, handleMarkAsRead, notification]);

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {notification.data.title}
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <div className="flex w-full flex-col gap-2">
                    <p className="text-sm leading-6 break-words whitespace-pre-wrap text-muted-foreground">
                        {notification.data.message}
                    </p>
                </div>
                <AlertDialogFooter>
                    <div className="flex gap-2">
                        <AlertDialogCancel>
                            {__(
                                'notifications.pages.index.dialog.buttons.close',
                            )}
                        </AlertDialogCancel>
                        {notification.data.action && (
                            <AlertDialogAction asChild>
                                <Link
                                    href={notification.data.action_url || '#'}
                                >
                                    {notification.data.action}
                                </Link>
                            </AlertDialogAction>
                        )}
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function NotificationPagination({
    pagination_props,
}: {
    pagination_props: PaginationProps;
}) {
    const totalPages = Number(pagination_props.last_page);
    const current = Number(pagination_props.current_page);
    const delta = 2; // nbr of pages to show around current
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    // Always include start and end + interval around current
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= current - delta && i <= current + delta)
        ) {
            range.push(i);
        }
    }

    // Add dots
    for (const i of range) {
        if (l !== undefined) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l > 2) {
                rangeWithDots.push('ellipsis');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    // Avoid refresh when switching page
    function handleVisit(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        if (e.currentTarget.getAttribute('href') !== '#') {
            e.preventDefault();
        }

        router.visit(e.currentTarget.getAttribute('href') || '#', {
            preserveState: true,
            preserveScroll: true,
        });
    }

    return (
        pagination_props.total > pagination_props.per_page && (
            <Pagination>
                {totalPages > 0 && (
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={handleVisit}
                                href={pagination_props.prev_page_url || '#'}
                                disabled={current === 1}
                            />
                        </PaginationItem>
                        {rangeWithDots.map((page, idx) =>
                            page === 'ellipsis' ? (
                                <PaginationItem key={`dots-${idx}`}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            ) : (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        href={
                                            page === current
                                                ? '#'
                                                : route('notifications.index', {
                                                      page,
                                                  })
                                        }
                                        isActive={page === current}
                                        onClick={handleVisit}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ),
                        )}
                        <PaginationItem>
                            <PaginationNext
                                onClick={handleVisit}
                                href={pagination_props.next_page_url || '#'}
                                disabled={
                                    current === totalPages || totalPages === 0
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                )}
            </Pagination>
        )
    );
}
