import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TabsContent } from '@/components/ui/tabs';
import { useInitials } from '@/hooks/use-initials';
import {
    renderAsset,
    renderTicketCategory,
    renderTicketPriority,
    renderTicketStatus,
} from '@/lib/render';
import { useTrans } from '@/lib/translation';
import { Ticket } from '@/types';
import React from 'react';

interface Props {
    ticket: Ticket;
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

export function InformationsTab({ ticket }: Props) {
    const __ = useTrans();
    const getInitials = useInitials();

    return (
        <TabsContent value="informations" className="grid gap-8">
            <div className="grid gap-3">
                <h3 className="text-lg font-semibold tracking-tight">
                    {__('tickets.pages.show.tabs.info_content.description')}
                </h3>
                <p className="rounded-lg border bg-muted/10 p-4 text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                    {ticket.description}
                </p>
            </div>

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
                                className="flex items-center gap-3 rounded-lg border bg-card p-3 shadow-sm hover:bg-muted/50"
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
                                <div className="grid flex-1 gap-0.5">
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
        </TabsContent>
    );
}
