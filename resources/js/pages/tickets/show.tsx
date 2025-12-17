// resources/js/pages/tickets/create.tsx

// Necessary imports
import { Head, Link, useForm, usePage } from '@inertiajs/react';

// Layout
import AppLayout from '@/layouts/app/layout';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Shadnc UI Components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
import type { BreadcrumbItem, SharedData, Ticket } from '@/types';

// Icons
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupTextarea,
} from '@/components/ui/input-group';
import { useInitials } from '@/hooks/use-initials';
import {
    renderAsset,
    renderTicketCategory,
    renderTicketPriority,
    renderTicketStatus,
} from '@/lib/render';
import {
    ArrowLeft,
    Calendar,
    File,
    Logs,
    MessageCircle,
    Paperclip,
    Send,
} from 'lucide-react';

interface ShowProps {
    ticket: Ticket;
}

export default function Show({ ticket }: ShowProps) {
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
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('tickets.pages.create.head_title')} />

            <ShowCard ticket={ticket} />
        </AppLayout>
    );
}

function ShowCard({ ticket }: ShowProps) {
    // const __ = useTrans(); TODO

    return (
        <Card>
            <CardHeader>
                <CardTitle>{`#${ticket.id} - ${ticket.title}`}</CardTitle>
                <CardAction>
                    <Button asChild variant={'secondary'}>
                        <Link href={route('tickets.index')}>
                            <ArrowLeft />
                            Go back to tickets
                        </Link>
                    </Button>
                </CardAction>
            </CardHeader>
            <Separator />

            <CardContent>
                <Tabs
                    defaultValue={'informations'}
                    className="w-full space-y-4"
                >
                    <TabsList className="w-full">
                        <TabsTrigger value={'informations'}>
                            <File />
                            Informations
                        </TabsTrigger>
                        <TabsTrigger value={'comments'}>
                            <MessageCircle />
                            Comments
                        </TabsTrigger>
                        <TabsTrigger value={'calendar'}>
                            <Calendar />
                            Calendar
                        </TabsTrigger>
                        <TabsTrigger value={'logs'}>
                            <Logs />
                            Logs
                        </TabsTrigger>
                    </TabsList>

                    <InformationsTab ticket={ticket} />
                    <CommentsTab ticket={ticket} />
                </Tabs>
            </CardContent>
        </Card>
    );
}

function InformationsTab({ ticket }: ShowProps) {
    const getInitials = useInitials();

    function DetailCard({
        title,
        content,
    }: {
        title: string;
        content: string | React.ReactNode;
    }) {
        return (
            <div className="col-span-1 rounded-md border p-2">
                <h3 className="mb-2 text-sm font-medium">{title}</h3>
                <p className="rounded-md border px-4 py-2">{content}</p>
            </div>
        );
    }

    return (
        <TabsContent value={'informations'} className="grid gap-8">
            <div className="grid gap-2">
                <h3 className="mb-2 font-medium">Description</h3>
                <Separator className="mb-4" />
                <p className="rounded-md border p-2">{ticket.description}</p>
            </div>

            <div className="grid gap-2">
                <h3 className="mb-2 font-medium">Assignees</h3>
                <Separator className="mb-4" />
                <div className="grid grid-cols-6">
                    {ticket.assignees.length === 0 && (
                        <p className="col-span-6 rounded-md border p-2">
                            No assignees.
                        </p>
                    )}
                    {ticket.assignees.length > 0 &&
                        ticket.assignees.map((assignee) => (
                            <div
                                className="col-span-1 flex items-center gap-2 rounded-md border p-2"
                                key={assignee.id}
                            >
                                <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                    <AvatarImage
                                        src={
                                            assignee.user.avatar?.url ??
                                            undefined
                                        }
                                        alt={assignee.user.name}
                                    />
                                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                        {getInitials(assignee.user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        {assignee.user.name}
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        {assignee.user.email}
                                    </span>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            <div className="grid gap-2">
                <h3 className="mb-2 font-medium">Details</h3>
                <Separator className="mb-4" />
                <div className="grid grid-cols-4 gap-4">
                    <DetailCard
                        title="Priority"
                        content={renderTicketPriority(ticket.priority)}
                    />
                    <DetailCard
                        title="Category"
                        content={renderTicketCategory(ticket.category)}
                    />
                    <DetailCard
                        title="Status"
                        content={renderTicketStatus(ticket.status)}
                    />
                    <DetailCard
                        title="Asset"
                        content={renderAsset(ticket.asset, false)}
                    />
                    <DetailCard title="Author" content={ticket.user.name} />
                    <DetailCard
                        title="Nbr of Assignees"
                        content={ticket.assignees.length}
                    />
                    <DetailCard
                        title="Last updated"
                        content={new Date(ticket.updated_at).toLocaleString()}
                    />
                    <DetailCard
                        title="Created at"
                        content={new Date(ticket.created_at).toLocaleString()}
                    />
                </div>
            </div>
        </TabsContent>
    );
}

function CommentsTab({ ticket }: ShowProps) {

    console.log(ticket.comments);

    const { data, setData, processing, errors, post } = useForm<{
        content: string;
    }>({
        content: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post(route('tickets.comments.store', { ticket: ticket.id }), {
            preserveScroll: true,
            onSuccess: () => setData('content', ''),
        });
    }

    // const { auth } = usePage<SharedData>().props; TODO

    /*const CURRENT_USER_ID = auth.user.id; TODO
    const LOCALE = `${auth.user.language}-${auth.user.language.toUpperCase()}`;*/

    return (
        <TabsContent value={'comments'} className="grid gap-8">
            {/* Form */}
            <form className="flex items-start gap-2" onSubmit={handleSubmit}>
                <InputGroup>
                    <InputGroupTextarea
                        placeholder="Write a comment..."
                        name="content"
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        className="flex-1"
                        aria-invalid={errors.content ? 'true' : 'false'}
                        disabled={processing}
                        required
                        autoFocus
                    />
                    <InputGroupAddon align="block-end">
                        <InputGroupButton
                            variant="outline"
                            className="rounded-full"
                            size={'icon-sm'}
                        >
                            <Paperclip />
                        </InputGroupButton>

                        <InputGroupButton
                            className="rounded-full"
                            size={'icon-sm'}
                            variant={'default'}
                            type="submit"
                            disabled={processing}
                        >
                            <Send />
                            <span className="sr-only">Send</span>
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
            </form>


            {/* Comments */}
            {ticket.comments.length === 0 && (
                <p className="rounded-md border p-2">No comments.</p>
            )}

            {ticket.comments.length > 0 && (
                <div className="grid gap-4">
                    {ticket.comments.map((comment) => (
                        <div>
                            {comment.content}
                        </div>
                    ))}
                </div>
            )}
        </TabsContent>
    );
}
