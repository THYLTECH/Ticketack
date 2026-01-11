import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
import { Link } from '@inertiajs/react';
import { Archive, Clock, Layers, type LucideIcon, Tag, User } from 'lucide-react';
import * as React from 'react';

const SidebarRow = ({
    icon: Icon,
    label,
    children,
    className,
}: {
    icon: LucideIcon;
    label: string;
    children: React.ReactNode;
    className?: string;
}) => (
    <div
        className={cn(
            'flex items-center justify-between py-1.5 text-sm',
            className,
        )}
    >
        <div className="flex items-center gap-2 text-muted-foreground/80">
            <Icon className="h-3.5 w-3.5 opacity-70" />
            <span className="text-xs font-medium tracking-wide">{label}</span>
        </div>
        <div className="max-w-45 truncate pl-4 text-right font-medium text-foreground">
            {children}
        </div>
    </div>
);

export function TicketSidebar({ ticket }: { ticket: Ticket }) {
    const __ = useTrans();
    const getInitials = useInitials();

    return (
        <div className="w-full shrink-0 lg:w-70">
            <div className="sticky top-6 flex flex-col gap-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            {__(
                                'tickets.pages.show.tabs.info_content.assignees',
                            )}
                        </span>
                        <Badge
                            variant="secondary"
                            className="h-5 px-1.5 font-mono text-[10px]"
                        >
                            {ticket.assignees.length}
                        </Badge>
                    </div>

                    {ticket.assignees.length > 0 ? (
                        <div className="flex flex-col gap-1">
                            {ticket.assignees.map((assignee) => (
                                <div
                                    key={assignee.id}
                                    className="flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/50"
                                >
                                    <Avatar className="h-6 w-6 border ring-1 ring-background">
                                        <AvatarImage
                                            src={
                                                assignee.user.avatar?.url ??
                                                undefined
                                            }
                                            alt={assignee.user.name}
                                        />
                                        <AvatarFallback className="bg-primary/10 text-[9px] font-bold text-primary">
                                            {getInitials(assignee.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="truncate text-sm font-medium text-foreground/90">
                                        {assignee.user.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="px-2 py-1 text-sm text-muted-foreground italic opacity-70">
                            {__(
                                'tickets.pages.show.tabs.info_content.no_assignees',
                            )}
                        </div>
                    )}
                </div>

                <Separator className="opacity-50" />

                <div className="space-y-3">
                    <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        {__('tickets.pages.show.tabs.info_content.properties')}
                    </span>

                    <div className="flex flex-col gap-1">
                        <SidebarRow
                            icon={Tag}
                            label={__('tickets.column.status')}
                        >
                            {ticket.status ? (
                                renderTicketStatus(ticket.status)
                            ) : (
                                <span className="text-muted-foreground">-</span>
                            )}
                        </SidebarRow>
                        <SidebarRow
                            icon={Clock}
                            label={__('tickets.column.priority')}
                        >
                            {ticket.priority ? (
                                renderTicketPriority(ticket.priority)
                            ) : (
                                <span className="text-muted-foreground">-</span>
                            )}
                        </SidebarRow>
                        <SidebarRow
                            icon={Layers}
                            label={__('tickets.column.category')}
                        >
                            {ticket.category ? (
                                renderTicketCategory(ticket.category)
                            ) : (
                                <span className="text-muted-foreground">-</span>
                            )}
                        </SidebarRow>
                        <SidebarRow
                            icon={Archive}
                            label={__('tickets.column.archive_status')}
                        >
                            {ticket.archived_at ? (
                                <Badge variant="secondary" className="text-xs">
                                    <Archive className="mr-1 h-3 w-3" />
                                    {__('tickets.pages.form.fields.archived_label')}
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="text-xs border-emerald-500/50 text-emerald-600 dark:text-emerald-400">
                                    {__('tickets.pages.form.fields.active_label')}
                                </Badge>
                            )}
                        </SidebarRow>
                        <SidebarRow
                            icon={User}
                            label={__('tickets.column.author')}
                        >
                            <div className="flex items-center justify-end gap-2">
                                <span className="truncate text-sm">
                                    {ticket.user.name}
                                </span>
                                <Avatar className="h-5 w-5">
                                    <AvatarImage
                                        src={
                                            ticket.user.avatar?.url ?? undefined
                                        }
                                    />
                                    <AvatarFallback className="text-[8px]">
                                        {getInitials(ticket.user.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </SidebarRow>
                    </div>
                </div>

                <Separator className="opacity-50" />

                <div className="space-y-3">
                    <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        {__('tickets.pages.show.tabs.info_content.history')}
                    </span>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between py-1.5 text-sm">
                            <span className="text-xs text-muted-foreground">
                                {__(
                                    'tickets.pages.show.tabs.info_content.created',
                                )}
                            </span>
                            <span className="font-medium">
                                {new Date(
                                    ticket.created_at,
                                ).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-1.5 text-sm">
                            <span className="text-xs text-muted-foreground">
                                {__(
                                    'tickets.pages.show.tabs.info_content.updated',
                                )}
                            </span>
                            <span className="font-medium">
                                {new Date(
                                    ticket.updated_at,
                                ).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {ticket.asset && (
                    <>
                        <Separator className="opacity-50" />
                        <div className="space-y-3">
                            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                {__('tickets.filters.equipment')}
                            </span>
                            <div className="px-1">
                                <Link
                                    href={route('assets.show', ticket.asset.id)}
                                    className="group block"
                                >
                                    <div className="transition-opacity group-hover:opacity-80">
                                        {renderAsset(ticket.asset, false)}
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
