// resources/js/pages/tickets/index.tsx

// Necessary imports
import { Head, Link, router, usePage } from '@inertiajs/react';

// Layout
import AppLayout from '@/layouts/app/layout';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Custom functions
import { formatDate, userHasPermission } from '@/lib/utils';

// Types
import type { BreadcrumbItem, Ticket, SharedData } from '@/types';

// Custom components

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

// Icons
import { Plus, RefreshCcw, Shield } from 'lucide-react';

export default function Index({ tickets }: { tickets: Ticket[] }) {
    const __ = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('dashboard.pages.breadcrumbs.dashboard'),
            href: route('dashboard'),
        },
        {
            title: __('tickets.pages.breadcrumbs.index'),
            href: '#',
        },
    ];

    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('tickets.pages.index.head_title')} />

            <Card>
                <CardHeader>
                    <CardTitle>{__('tickets.pages.index.title')}</CardTitle>
                    <CardDescription>
                        {__('tickets.pages.index.description')}
                    </CardDescription>

                    <CardAction className="flex items-center gap-2">
                        {userHasPermission({
                            user: auth.user,
                            permission: 'create tickets',
                        }) && (
                            <Button asChild>
                                <Link href={route('tickets.create')}>
                                    <Plus />
                                    {__('tickets.pages.index.buttons.create')}
                                </Link>
                            </Button>
                        )}
                    </CardAction>
                </CardHeader>
                <Separator />

                <CardContent>
                    {tickets.length === 0 ? (
                        <TicketEmpty />
                    ) : (
                        <TicketTable tickets={tickets} />
                    )}
                </CardContent>
            </Card>
        </AppLayout>
    );
}

function TicketEmpty() {
    const __ = useTrans();

    return (
        <Empty className="border border-dashed">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Shield />
                </EmptyMedia>
                <EmptyTitle>{__('tickets.pages.index.empty.title')}</EmptyTitle>
                <EmptyDescription>
                    {__('tickets.pages.index.empty.description')}
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button variant="outline" size="sm" asChild>
                    <Link href={route('tickets.index')}>
                        <RefreshCcw />
                        {__('tickets.pages.index.empty.button')}
                    </Link>
                </Button>
            </EmptyContent>
        </Empty>
    );
}

function TicketTable({ tickets }: { tickets: Ticket[] }) {
    const __ = useTrans();

    const auth = usePage<SharedData>().props.auth;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[8rem] text-right text-xs text-muted-foreground">
                        {__('tickets.pages.index.table.columns.updated_at')}
                    </TableHead>
                    <TableHead className="w-[8rem] text-right text-xs text-muted-foreground">
                        {__('tickets.pages.index.table.columns.created_at')}
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tickets.map((Ticket) => (
                    <TableRow
                        className="relative cursor-pointer"
                        key={Ticket.id}
                        onClick={() => {
                            if (
                                userHasPermission({
                                    user: auth.user,
                                    permission: 'show tickets',
                                })
                            ) {
                                router.get(
                                    route('tickets.show', { Ticket: Ticket.id }),
                                );
                            }
                        }}
                    >

                        <TableCell className="text-right">
                            {formatDate(Ticket.updated_at)}
                        </TableCell>
                        <TableCell className="text-right">
                            {formatDate(Ticket.created_at)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
