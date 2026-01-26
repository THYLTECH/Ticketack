import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { GetIcon } from '@/lib/render';
import { useTrans } from '@/lib/translation';
import { userHasPermission } from '@/lib/utils';
import { router, usePage } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import { AlertCircle, AlertTriangle, Info, UserPlus, Clock, User as UserIcon, Hash, Flag } from 'lucide-react';
import { useState } from 'react';
import { AssignDialog } from './assign-dialog';
import { SharedData, User, Ticket } from '@/types';
import {
    EmptyState,
    MobileCard,
    MobileCardHeader,
    MobileCardIdBadge,
    MobileCardTitle,
    MobileCardMeta,
    MobileCardMetaItem,
    MobileCardActions,
} from '../shared';


interface AssignmentTableProps {
    tickets: Ticket[];
    assignableUsers: User[];
    canAssign: boolean;
    canBeAssigned: boolean;
}

/**
 * Assignment table component
 * Displays a list of unassigned tickets with action buttons for assignment
 */
export function AssignmentTable({
    tickets,
    assignableUsers,
    canAssign,
    canBeAssigned,
}: AssignmentTableProps) {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;
    const locale = document.documentElement.lang === 'fr' ? fr : enUS;
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

    /**
     * Assigns a ticket to specific users
     * @param userIds The IDs of the users to assign the ticket to
     */
    const handleAssign = (userIds: number[]) => {
        if (selectedTicketId && userIds.length > 0) {
            router.post(
                route('tickets.assignment.assign', selectedTicketId),
                { user_ids: userIds },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setSelectedTicketId(null);
                    },
                },
            );
        }
    };

    /**
     * Assigns a ticket to the current user (self-assignment)
     * @param ticketId The ID of the ticket to self-assign
     */
    const handleSelfAssign = (ticketId: number) => {
        router.post(
            route('tickets.assignment.self-assign', ticketId),
            {},
            {
                preserveScroll: true,
            },
        );
    };

    /**
     * Opens the assignment dialog for a specific ticket
     * @param ticketId The ID of the ticket to assign
     */
    const openAssignDialog = (ticketId: number) => {
        setSelectedTicketId(ticketId);
        setAssignDialogOpen(true);
    };

    /**
     * Returns the appropriate icon based on priority order
     * @param sortOrder Priority sort order value
     */
    const getPriorityIcon = (sortOrder: number) => {
        if (sortOrder >= 4)
            return <AlertTriangle className="h-3.5 w-3.5" />;
        if (sortOrder === 3)
            return <AlertCircle className="h-3.5 w-3.5" />;
        return <Info className="h-3.5 w-3.5" />;
    };

    /**
     * Formats the ticket creation date as a relative time string
     * @param createdAt ISO date string
     */
    const getTicketAge = (createdAt: string) => {
        return formatDistanceToNow(new Date(createdAt), {
            addSuffix: true,
            locale,
        });
    };

    /**
     * Handles ticket click navigation
     */
    const handleTicketClick = (ticketId: number) => {
        if (userHasPermission({
            user: auth.user,
            permission: 'show tickets',
        })) {
            router.get(route('tickets.show', ticketId));
        }
    };

    if (tickets.length === 0) {
        return (
            <EmptyState
                icon={UserPlus}
                title={__('tickets.assignment.table.empty')}
                description={__('tickets.assignment.table.empty_description')}
            />
        );
    }

    return (
        <>
            <div className="block space-y-3 lg:hidden">
                {tickets.map((ticket) => (
                    <MobileCard
                        key={ticket.id}
                        onClick={() => handleTicketClick(ticket.id)}
                    >
                        <MobileCardHeader
                            left={
                                <MobileCardIdBadge
                                    id={ticket.id}
                                    icon={<Hash className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                                />
                            }
                            right={
                                ticket.priority && (
                                    <Badge
                                        variant="outline"
                                        className="gap-1.5 text-xs shrink-0"
                                        style={{ borderColor: ticket.priority.color }}
                                    >
                                        <span style={{ color: ticket.priority.color }}>
                                            {getPriorityIcon(ticket.priority.sort_order)}
                                        </span>
                                        <span style={{ color: ticket.priority.color }}>
                                            {ticket.priority.title}
                                        </span>
                                    </Badge>
                                )
                            }
                        />

                        <MobileCardTitle>{ticket.title}</MobileCardTitle>

                        <div className="flex flex-wrap gap-2">
                            {ticket.status && (
                                <Badge
                                    variant="outline"
                                    className="text-xs shadow-sm"
                                    style={{
                                        borderColor: ticket.status.color,
                                        color: ticket.status.color,
                                    }}
                                >
                                    {ticket.status.title}
                                </Badge>
                            )}
                            {ticket.category && (
                                <Badge
                                    variant="outline"
                                    className="text-xs shadow-sm"
                                    style={{
                                        borderColor: ticket.category.color,
                                        color: ticket.category.color,
                                    }}
                                >
                                    {ticket.category.title}
                                </Badge>
                            )}
                        </div>

                        <MobileCardMeta>
                            <MobileCardMetaItem icon={<UserIcon className="h-3.5 w-3.5" />}>
                                {ticket.user.name}
                            </MobileCardMetaItem>
                            <MobileCardMetaItem icon={<Clock className="h-3.5 w-3.5" />}>
                                {getTicketAge(ticket.created_at)}
                            </MobileCardMetaItem>
                        </MobileCardMeta>

                        <MobileCardActions>
                            {canBeAssigned && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleSelfAssign(ticket.id)}
                                    className="flex-1 h-9 text-xs"
                                >
                                    <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                                    <span className="hidden xs:inline">
                                        {__('tickets.assignment.actions.self_assign')}
                                    </span>
                                    <span className="inline xs:hidden">
                                        {__('tickets.assignment.actions.self_assign_short')}
                                    </span>
                                </Button>
                            )}
                            {canAssign && (
                                <Button
                                    size="sm"
                                    onClick={() => openAssignDialog(ticket.id)}
                                    className="flex-1 h-9 text-xs"
                                >
                                    <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                                    <span className="hidden xs:inline">
                                        {__('tickets.assignment.actions.assign')}
                                    </span>
                                    <span className="inline xs:hidden">
                                        {__('tickets.assignment.actions.assign_short')}
                                    </span>
                                </Button>
                            )}
                        </MobileCardActions>
                    </MobileCard>
                ))}
            </div>

            <div className="hidden w-full lg:block">
                <div className="overflow-hidden rounded-lg border bg-background shadow-sm">
                    <div className="relative overflow-x-auto">
                        <Table className="min-w-275 font-sans">
                            <TableHeader className="bg-muted/50">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[80px] pl-6 font-semibold text-foreground">
                                        {__('tickets.assignment.table.columns.id')}
                                    </TableHead>
                                    <TableHead className="font-semibold text-foreground">
                                        {__('tickets.assignment.table.columns.title')}
                                    </TableHead>
                                    <TableHead className="w-32 font-semibold text-foreground">
                                        {__('tickets.assignment.table.columns.priority')}
                                    </TableHead>
                                    <TableHead className="w-32 font-semibold text-foreground">
                                        {__('tickets.assignment.table.columns.status')}
                                    </TableHead>
                                    <TableHead className="w-[140px] font-semibold text-foreground">
                                        {__('tickets.assignment.table.columns.category')}
                                    </TableHead>
                                    <TableHead className="w-[140px] font-semibold text-foreground">
                                        {__('tickets.assignment.table.columns.author')}
                                    </TableHead>
                                    <TableHead className="w-[130px] font-semibold text-foreground text-right pr-6">
                                        {__('tickets.assignment.table.columns.age')}
                                    </TableHead>
                                    <TableHead className="w-[200px] font-semibold text-foreground text-right pr-6">
                                        {__('tickets.assignment.table.columns.actions')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tickets.map((ticket) => (
                                    <TableRow
                                        key={ticket.id}
                                        className="group cursor-pointer transition-colors hover:bg-muted/40"
                                        onClick={() => handleTicketClick(ticket.id)}
                                    >
                                        <TableCell className="pl-6 text-xs text-muted-foreground font-mono truncate align-middle">
                                            #{ticket.id}
                                        </TableCell>
                                        <TableCell className="font-medium text-sm relative align-middle">
                                            <div className="max-w-[400px]">
                                                <p className="truncate group-hover:underline decoration-primary/30 transition-colors" title={ticket.title}>
                                                    {ticket.title}
                                                </p>
                                            </div>
                                        </TableCell>

                                        <TableCell className="align-middle">
                                            <div className="flex items-center gap-2">
                                                {ticket.priority && (
                                                    <Flag className="h-3.5 w-3.5" style={{ color: ticket.priority.color }} />
                                                )}
                                                <span className="text-xs font-medium text-muted-foreground">
                                                    {ticket.priority?.title}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="align-middle">
                                            {ticket.status && (
                                                <Badge
                                                    variant="outline"
                                                    className="rounded-md border-transparent px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase"
                                                    style={{
                                                        backgroundColor: `${ticket.status.color}25`,
                                                        color: ticket.status.color,
                                                        border: `1px solid ${ticket.status.color}40`,
                                                    }}
                                                >
                                                    {ticket.status.title}
                                                </Badge>
                                            )}
                                        </TableCell>

                                        <TableCell className="align-middle">
                                            {ticket.category ? (
                                                <TooltipProvider delayDuration={300}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground max-w-32">
                                                                <GetIcon icon={ticket.category.icon ?? 'tag'} props={{ className: 'h-3.5 w-3.5 opacity-50 shrink-0' }} />
                                                                <span className="truncate">{ticket.category.title}</span>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top">
                                                            <p className="text-sm">{ticket.category.title}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            ) : (
                                                <span className="text-xs text-muted-foreground/50">-</span>
                                            )}
                                        </TableCell>

                                        <TableCell className="align-middle">
                                            {ticket.user ? (
                                                <TooltipProvider delayDuration={300}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex items-center gap-2 max-w-28">
                                                                <Avatar className="h-6 w-6 border-2 border-background ring-1 ring-border/10 shrink-0">
                                                                    <AvatarImage src={ticket.user.avatar?.url ?? undefined} />
                                                                    <AvatarFallback className="bg-muted text-[8px] font-bold">
                                                                        {ticket.user.name.substring(0, 2).toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <span className="truncate text-xs font-medium text-muted-foreground">
                                                                    {ticket.user.name}
                                                                </span>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top">
                                                            <p className="text-sm">{ticket.user.name}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            ) : (
                                                <span className="text-xs text-muted-foreground/50">-</span>
                                            )}
                                        </TableCell>

                                        <TableCell className="pr-6 text-right text-xs text-muted-foreground font-medium truncate tabular-nums align-middle">
                                            {getTicketAge(ticket.created_at)}
                                        </TableCell>
                                        <TableCell
                                            className="pr-6"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="flex items-center justify-end gap-2">
                                                {canBeAssigned && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleSelfAssign(ticket.id)
                                                        }
                                                        className="h-7 text-xs px-2"
                                                    >
                                                        <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                                                        {__(
                                                            'tickets.assignment.actions.self_assign',
                                                        )}
                                                    </Button>
                                                )}
                                                {canAssign && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            openAssignDialog(ticket.id)
                                                        }
                                                        className="h-7 text-xs px-2"
                                                    >
                                                        <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                                                        {__(
                                                            'tickets.assignment.actions.assign',
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            <AssignDialog
                open={assignDialogOpen}
                onOpenChange={setAssignDialogOpen}
                users={assignableUsers}
                onAssign={handleAssign}
            />
        </>
    );
}
