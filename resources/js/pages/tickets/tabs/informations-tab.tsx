import { SimilarContext } from '@/components/tickets/similar-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { useInitials } from '@/hooks/use-initials';
import {
    renderAsset,
    renderTicketCategory,
    renderTicketPriority,
    renderTicketStatus,
} from '@/lib/render';
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { Ticket } from '@/types';
import { BookOpenCheck, CheckCircle2 } from 'lucide-react';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SimilarTicket {
    id: number;
    title: string;
    similarity: number;
}

interface Props {
    ticket: Ticket;
    similarTickets?: SimilarTicket[];
}

interface DetailCardProps {
    title: string;
    content: string | React.ReactNode;
}

function DetailCard({ title, content }: DetailCardProps) {
    return (
        <div className="rounded-lg border bg-card p-3 shadow-sm transition-colors hover:bg-muted/5">
            <h3 className="mb-1.5 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                {title}
            </h3>
            <div className="text-sm font-medium">{content}</div>
        </div>
    );
}

export function InformationsTab({ ticket, similarTickets = [] }: Props) {
    const __ = useTrans();
    const getInitials = useInitials();

    return (
        <TabsContent
            value="informations"
            className="grid animate-in gap-8 fade-in slide-in-from-bottom-2"
        >
            <div className="grid gap-3">
                <h3 className="text-lg font-semibold tracking-tight">
                    {__('tickets.pages.show.tabs.info_content.description')}
                </h3>
                <p className="rounded-lg border bg-muted/10 p-4 text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                    {ticket.description}
                </p>
            </div>

            {ticket.is_referenced && ticket.detailed_solution && (
                <div className="animate-in duration-500 fade-in slide-in-from-bottom-2">
                    <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <BookOpenCheck className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-semibold tracking-tight text-emerald-950 dark:text-emerald-50">
                                {__('tickets.pages.show.knowledge_base.title')}
                            </h3>
                        </div>
                        <Badge
                            variant="outline"
                            className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                        >
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            {__('tickets.pages.show.knowledge_base.badge')}
                        </Badge>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50/30 shadow-sm dark:border-emerald-900/20 dark:bg-emerald-950/5">
                        <div className="overflow-x-auto p-6">
                            <article className="prose prose-sm dark:prose-invert max-w-none text-foreground/90">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        h1: (props) => (
                                            <h1
                                                className="mt-6 mb-4 border-b border-emerald-200/50 pb-2 text-2xl font-bold tracking-tight text-foreground dark:border-emerald-800/50"
                                                {...props}
                                            />
                                        ),
                                        h2: (props) => (
                                            <h2
                                                className="mt-5 mb-3 text-xl font-bold tracking-tight text-foreground"
                                                {...props}
                                            />
                                        ),
                                        h3: (props) => (
                                            <h3
                                                className="mt-4 mb-2 text-lg font-semibold text-foreground"
                                                {...props}
                                            />
                                        ),
                                        blockquote: (props) => (
                                            <blockquote
                                                className="my-4 rounded-r border-l-4 border-emerald-500 bg-background/50 py-2 pl-4 text-muted-foreground italic"
                                                {...props}
                                            />
                                        ),
                                        table: (props) => (
                                            <div className="my-6 w-full overflow-y-auto rounded-lg border border-emerald-100 bg-background/50 shadow-sm dark:border-emerald-800">
                                                <table
                                                    className="w-full text-sm"
                                                    {...props}
                                                />
                                            </div>
                                        ),
                                        th: (props) => (
                                            <th
                                                className="border-b border-emerald-100 bg-emerald-50/50 px-4 py-3 text-left font-semibold text-emerald-900 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-100"
                                                {...props}
                                            />
                                        ),
                                        td: (props) => (
                                            <td
                                                className="border-b border-emerald-50 px-4 py-3 last:border-0 dark:border-emerald-900/50"
                                                {...props}
                                            />
                                        ),
                                        ul: ({ className, ...props }) => (
                                            <ul
                                                className={cn(
                                                    'my-4 list-disc space-y-1 pl-6',
                                                    className?.includes(
                                                        'contains-task-list',
                                                    ) && 'list-none pl-0',
                                                )}
                                                {...props}
                                            />
                                        ),
                                        ol: (props) => (
                                            <ol
                                                className="my-4 list-decimal space-y-1 pl-6"
                                                {...props}
                                            />
                                        ),
                                        li: ({ className, ...props }) => (
                                            <li
                                                className={cn(
                                                    'my-1 pl-1',
                                                    className?.includes(
                                                        'task-list-item',
                                                    ) &&
                                                        'flex list-none items-center pl-0',
                                                )}
                                                {...props}
                                            />
                                        ),
                                        img: (props) => (
                                            <img
                                                className="mx-auto my-4 h-auto max-w-full rounded-md border shadow-sm"
                                                {...props}
                                                alt={props.alt || 'Image'}
                                            />
                                        ),
                                        hr: (props) => (
                                            <hr
                                                className="my-8 border-emerald-200/50 dark:border-emerald-800/50"
                                                {...props}
                                            />
                                        ),
                                        a: (props) => (
                                            <a
                                                className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                {...props}
                                            />
                                        ),
                                        code: ({
                                            className,
                                            children,
                                            ...props
                                        }) => {
                                            const match = /language-(\w+)/.exec(
                                                className || '',
                                            );
                                            return match ? (
                                                <div className="relative my-4 rounded-md border bg-background/50 shadow-sm">
                                                    <div className="absolute top-2 right-2 text-[10px] text-muted-foreground uppercase opacity-70 select-none">
                                                        {match[1]}
                                                    </div>
                                                    <code
                                                        className="block w-full overflow-x-auto p-4 font-mono text-xs"
                                                        {...props}
                                                    >
                                                        {children}
                                                    </code>
                                                </div>
                                            ) : (
                                                <code
                                                    className="rounded border border-border/50 bg-muted/50 px-1.5 py-0.5 font-mono text-[0.9em] font-medium text-foreground"
                                                    {...props}
                                                >
                                                    {children}
                                                </code>
                                            );
                                        },
                                        p: (props) => (
                                            <p
                                                className="mb-4 leading-7 last:mb-0"
                                                {...props}
                                            />
                                        ),
                                        input: (props) => {
                                            if (props.type === 'checkbox') {
                                                return (
                                                    <input
                                                        type="checkbox"
                                                        className="mr-2 h-3.5 w-3.5 rounded border-emerald-500 text-emerald-600 accent-emerald-500 shadow-sm focus:ring-0 disabled:cursor-not-allowed disabled:opacity-70"
                                                        checked={props.checked}
                                                        readOnly
                                                        disabled
                                                    />
                                                );
                                            }
                                            return <input {...props} />;
                                        },
                                    }}
                                >
                                    {ticket.detailed_solution || ''}
                                </ReactMarkdown>
                            </article>
                        </div>
                        <div className="border-t border-emerald-100 bg-emerald-100/20 px-6 py-2 dark:border-emerald-900/20 dark:bg-emerald-950/20">
                            <p className="text-[10px] font-semibold tracking-wider text-emerald-700/70 uppercase dark:text-emerald-400/60">
                                {__('tickets.pages.show.knowledge_base.footer')}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-3">
                <h3 className="text-lg font-semibold tracking-tight">
                    {__('tickets.pages.show.tabs.info_content.assignees')}
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {ticket.assignees.length === 0 ? (
                        <p className="col-span-4 rounded-lg border border-dashed p-4 text-sm text-muted-foreground italic">
                            {__(
                                'tickets.pages.show.tabs.info_content.no_assignees',
                            )}
                        </p>
                    ) : (
                        ticket.assignees.map((assignee) => (
                            <div
                                className="flex items-center gap-3 rounded-lg border bg-card p-3 shadow-sm transition-colors hover:bg-muted/50"
                                key={assignee.id}
                            >
                                <Avatar className="h-9 w-9 border-2 border-background ring-1 ring-border/20">
                                    <AvatarImage
                                        src={
                                            assignee.user.avatar?.url ??
                                            undefined
                                        }
                                        alt={assignee.user.name}
                                    />
                                    <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                                        {getInitials(assignee.user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 gap-0.5 overflow-hidden">
                                    <span className="truncate text-sm font-semibold">
                                        {assignee.user.name}
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        {assignee.user.email}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="grid gap-3">
                <h3 className="text-lg font-semibold tracking-tight">
                    {__('tickets.pages.show.tabs.info_content.details')}
                </h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <DetailCard
                        title={__('tickets.column.priority')}
                        content={renderTicketPriority(ticket.priority)}
                    />
                    <DetailCard
                        title={__('tickets.column.category')}
                        content={renderTicketCategory(ticket.category)}
                    />
                    <DetailCard
                        title={__('tickets.column.status')}
                        content={renderTicketStatus(ticket.status)}
                    />
                    <DetailCard
                        title={__('tickets.filters.equipment')}
                        content={renderAsset(ticket.asset, false)}
                    />
                    <DetailCard
                        title={__('tickets.column.author')}
                        content={ticket.user.name}
                    />
                    <DetailCard
                        title={__('tickets.column.assignee')}
                        content={`${ticket.assignees.length} ${__('tickets.pages.show.tabs.info_content.users')}`}
                    />
                    <DetailCard
                        title={__('tickets.column.updated_at')}
                        content={new Date(ticket.updated_at).toLocaleString()}
                    />
                    <DetailCard
                        title={__('tickets.column.created_at')}
                        content={new Date(ticket.created_at).toLocaleString()}
                    />
                </div>
            </div>

            <SimilarContext tickets={similarTickets} />
        </TabsContent>
    );
}
