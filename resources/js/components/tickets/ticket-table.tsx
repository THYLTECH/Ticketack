import { Link, router } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useTrans } from '@/lib/translation';
import { Ticket } from '@/types';
import { formatDate } from '@/lib/utils';
import {
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle
} from '@/components/ui/empty';
import { Ticket as TicketIcon } from 'lucide-react';
// Remplacement de LaravelPagination par PaginationControl
import { PaginationControl } from '@/components/pagination-control';

// Interface mise à jour pour correspondre à PaginationMeta de PaginationControl
interface PaginatedTickets {
    data: Ticket[];
    current_page: number;
    from: number | null;
    to: number | null;
    total: number;
    per_page: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface TicketTableProps {
    data: PaginatedTickets | null;
    emptyMessage?: string;
    showAuthor?: boolean;
}

export function TicketTable({ data, emptyMessage, showAuthor = false }: TicketTableProps) {
    const __ = useTrans();

    if (!data) return null;

    const tickets = data.data;

    return (
        <div className="flex flex-col h-full min-h-[400px] justify-between border rounded-md bg-card overflow-hidden">
            <div className="flex-1 overflow-auto">
                {tickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[300px]">
                        <Empty className="border-none">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <TicketIcon className="h-8 w-8 text-muted-foreground" />
                                </EmptyMedia>
                                <EmptyTitle className="text-sm font-normal text-muted-foreground">
                                    {emptyMessage || __('tickets.index.empty')}
                                </EmptyTitle>
                            </EmptyHeader>
                        </Empty>
                    </div>
                ) : (
                    <>
                        {/* Mobile View */}
                        <div className="md:hidden divide-y divide-border">
                            {tickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    className="p-4 flex flex-col gap-3 active:bg-muted/50 transition-colors cursor-pointer"
                                    onClick={() => router.get(route('tickets.show', ticket.id))}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground font-mono">
                                            #{ticket.id}
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className="text-[10px] uppercase font-bold px-2 py-0.5"
                                            style={{
                                                backgroundColor: ticket.status?.color + '15',
                                                color: ticket.status?.color,
                                                borderColor: ticket.status?.color + '30'
                                            }}
                                        >
                                            {ticket.status?.title}
                                        </Badge>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-sm line-clamp-2 leading-tight">
                                            {ticket.title}
                                        </h4>
                                        {showAuthor && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {__('tickets.fields.author')}: {ticket.user?.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="h-2 w-2 rounded-full shrink-0"
                                                style={{ backgroundColor: ticket.priority?.color }}
                                            />
                                            <span>{ticket.priority?.title}</span>
                                        </div>
                                        <span className="tabular-nums">
                                            {formatDate(ticket.updated_at)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop View */}
                        <div className="hidden md:block">
                            <Table className="table-fixed w-full">
                                <TableHeader className="bg-muted/50 sticky top-0 z-10">
                                    <TableRow>
                                        <TableHead className="w-[80px] pl-6 font-semibold text-foreground">
                                            {__('tickets.fields.id', 'ID')}
                                        </TableHead>
                                        <TableHead className="font-semibold text-foreground">
                                            {__('tickets.fields.title')}
                                        </TableHead>
                                        <TableHead className="w-[120px] font-semibold text-foreground text-center">
                                            {__('tickets.fields.status')}
                                        </TableHead>
                                        <TableHead className="w-[110px] font-semibold text-foreground text-center">
                                            {__('tickets.fields.priority')}
                                        </TableHead>
                                        {showAuthor && (
                                            <TableHead className="w-[140px] font-semibold text-foreground">
                                                {__('tickets.fields.author')}
                                            </TableHead>
                                        )}
                                        <TableHead className="w-[130px] pr-6 text-right font-semibold text-foreground">
                                            {__('tickets.fields.updated_at')}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tickets.map((ticket) => (
                                        <TableRow
                                            key={ticket.id}
                                            className="group cursor-pointer transition-colors hover:bg-muted/40"
                                            onClick={() => router.get(route('tickets.show', ticket.id))}
                                        >
                                            <TableCell className="pl-6 text-xs text-muted-foreground font-mono truncate">
                                                #{ticket.id}
                                            </TableCell>

                                            <TableCell className="font-medium text-sm relative">
                                                <Link href={route('tickets.show', ticket.id)} className="absolute inset-0 z-0" />
                                                <span
                                                    className="relative z-10 block truncate group-hover:underline decoration-primary/30"
                                                    title={ticket.title}
                                                >
                                                    {ticket.title}
                                                </span>
                                            </TableCell>

                                            <TableCell className="text-center">
                                                <Badge
                                                    variant="outline"
                                                    className="text-[10px] uppercase font-bold px-2 py-0.5 max-w-full truncate"
                                                    style={{
                                                        backgroundColor: ticket.status?.color + '15',
                                                        color: ticket.status?.color,
                                                        borderColor: ticket.status?.color + '30'
                                                    }}
                                                >
                                                    {ticket.status?.title}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2 text-xs">
                                                    <span
                                                        className="h-2 w-2 rounded-full shrink-0"
                                                        style={{ backgroundColor: ticket.priority?.color }}
                                                    />
                                                    <span className="hidden xl:inline opacity-80 italic truncate">
                                                        {ticket.priority?.title}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            {showAuthor && (
                                                <TableCell className="text-sm font-medium truncate">
                                                    {ticket.user?.name}
                                                </TableCell>
                                            )}

                                            <TableCell className="pr-6 text-right text-xs text-muted-foreground font-medium truncate tabular-nums">
                                                {formatDate(ticket.updated_at)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </>
                )}
            </div>

            {/* Intégration de PaginationControl en bas du tableau */}
            <div className="px-6 py-4 bg-muted/5 mt-auto">
                <PaginationControl meta={data} />
            </div>
        </div>
    );
}