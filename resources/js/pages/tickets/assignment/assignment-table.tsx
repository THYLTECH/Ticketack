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
import { Card, CardContent } from '@/components/ui/card';
import { useTrans } from '@/lib/translation';
import { router, usePage } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import { AlertCircle, AlertTriangle, Info, UserPlus, Clock, User as UserIcon, Hash } from 'lucide-react';
import { useState } from 'react';
import { AssignDialog } from './assign-dialog';
import { SharedData, User, Ticket } from '@/types';
import { userHasPermission } from '@/lib/utils';


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
     * Calculate urgency level based on priority and age
     * Returns a number from 0-3 (0=low, 1=medium, 2=high, 3=critical)
     */
    const getUrgencyLevel = (priority: number, daysOld: number): number => {
        let urgency: number;

        if (priority >= 4) urgency = 3;
        else if (priority === 3) urgency = 2;
        else if (priority === 2) urgency = 1;
        else urgency = 0;

        if (daysOld >= 7 && urgency < 3) urgency++;
        if (daysOld >= 14 && urgency < 3) urgency++;

        return Math.min(urgency, 3);
    };

    /**
     * Get days since ticket creation
     */
    const getDaysOld = (createdAt: string): number => {
        const created = new Date(createdAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - created.getTime());
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
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
            <div className="flex min-h-100 flex-col items-center justify-center gap-3 rounded-lg border border-dashed text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 ring-1 ring-border">
                    <UserPlus className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">
                        {__('tickets.assignment.table.empty')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {__('tickets.assignment.table.empty_description')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="block space-y-3 lg:hidden">
                {tickets.map((ticket) => {
                    const daysOld = getDaysOld(ticket.created_at);
                    const urgencyLevel = getUrgencyLevel(
                        ticket.priority?.sort_order || 0,
                        daysOld
                    );

                    const urgencyBorder = [
                        '',
                        'border-l-4 border-l-yellow-500',
                        'border-l-4 border-l-orange-500',
                        'border-l-4 border-l-red-500',
                    ][urgencyLevel];

                    return (
                        <Card
                            key={ticket.id}
                            className={`overflow-hidden transition-all hover:shadow-md cursor-pointer ${urgencyBorder}`}
                            onClick={() => handleTicketClick(ticket.id)}
                        >
                        <CardContent className="p-4 space-y-3">
                            <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="font-mono text-xs font-medium text-muted-foreground">
                                            {ticket.id}
                                        </span>
                                    </div>
                                    {ticket.priority && (
                                        <Badge
                                            variant="outline"
                                            className="gap-1.5 text-xs"
                                            style={{
                                                borderColor: ticket.priority.color,
                                            }}
                                        >
                                            <span style={{ color: ticket.priority.color }}>
                                                {getPriorityIcon(ticket.priority.sort_order)}
                                            </span>
                                            <span style={{ color: ticket.priority.color }}>
                                                {ticket.priority.title}
                                            </span>
                                        </Badge>
                                    )}
                                </div>
                                <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                                    {ticket.title}
                                </h3>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {ticket.status && (
                                    <Badge
                                        variant="outline"
                                        style={{
                                            borderColor: ticket.status.color,
                                            color: ticket.status.color,
                                        }}
                                        className="text-xs"
                                    >
                                        {ticket.status.title}
                                    </Badge>
                                )}
                                {ticket.category && (
                                    <Badge
                                        variant="outline"
                                        style={{
                                            borderColor: ticket.category.color,
                                            color: ticket.category.color,
                                        }}
                                        className="text-xs"
                                    >
                                        {ticket.category.title}
                                    </Badge>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <UserIcon className="h-3.5 w-3.5" />
                                    <span>{ticket.user.name}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>{getTicketAge(ticket.created_at)}</span>
                                </div>
                            </div>

                            <div
                                className="flex gap-2 pt-2 border-t"
                                onClick={(e) => e.stopPropagation()}
                            >
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
                            </div>
                        </CardContent>
                    </Card>
                    );
                })}
            </div>

            <div className="hidden w-full lg:block">
                <div className="overflow-hidden rounded-lg border bg-background shadow-sm">
                    <div className="relative overflow-x-auto">
                        <Table className="min-w-275">
                        <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-20 pl-6 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    {__('tickets.assignment.table.columns.id')}
                                </TableHead>
                                <TableHead className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    {__('tickets.assignment.table.columns.title')}
                                </TableHead>
                                <TableHead className="w-35 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    {__('tickets.assignment.table.columns.priority')}
                                </TableHead>
                                <TableHead className="w-35 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    {__('tickets.assignment.table.columns.status')}
                                </TableHead>
                                <TableHead className="w-35 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    {__('tickets.assignment.table.columns.category')}
                                </TableHead>
                                <TableHead className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    {__('tickets.assignment.table.columns.author')}
                                </TableHead>
                                <TableHead className="w-35 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    {__('tickets.assignment.table.columns.age')}
                                </TableHead>
                                <TableHead className="w-70 text-xs font-semibold tracking-wider text-muted-foreground uppercase text-right pr-6">
                                    {__('tickets.assignment.table.columns.actions')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickets.map((ticket) => (
                                <TableRow
                                    key={ticket.id}
                                    className="group cursor-pointer transition-colors hover:bg-muted/30"
                                    onClick={() => handleTicketClick(ticket.id)}
                                >
                                    <TableCell className="pl-6 font-mono text-xs font-medium text-muted-foreground">
                                        #{ticket.id}
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-100">
                                            <p className="truncate font-medium text-sm group-hover:text-primary transition-colors">
                                                {ticket.title}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {ticket.priority ? (
                                            <Badge
                                                variant="outline"
                                                className="gap-1.5 text-xs"
                                                style={{
                                                    borderColor: ticket.priority.color,
                                                }}
                                            >
                                                <span style={{ color: ticket.priority.color }}>
                                                    {getPriorityIcon(ticket.priority.sort_order)}
                                                </span>
                                                <span
                                                    style={{ color: ticket.priority.color }}
                                                >
                                                    {ticket.priority.title}
                                                </span>
                                            </Badge>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">
                                                -
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {ticket.status ? (
                                            <Badge
                                                variant="outline"
                                                style={{
                                                    borderColor: ticket.status.color,
                                                    color: ticket.status.color,
                                                }}
                                                className="text-xs"
                                            >
                                                {ticket.status.title}
                                            </Badge>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">
                                                -
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {ticket.category ? (
                                            <Badge
                                                variant="outline"
                                                style={{
                                                    borderColor: ticket.category.color,
                                                    color: ticket.category.color,
                                                }}
                                                className="text-xs"
                                            >
                                                {ticket.category.title}
                                            </Badge>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">
                                                -
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <p className="font-medium">{ticket.user.name}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs text-muted-foreground">
                                            {getTicketAge(ticket.created_at)}
                                        </span>
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
                                                    className="h-8 text-xs"
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
                                                    className="h-8 text-xs"
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
