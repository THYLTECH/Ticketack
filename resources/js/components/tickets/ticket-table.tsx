import { Link, router } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useTrans } from '@/lib/translation';
import { Ticket } from '@/types';
import { formatDate } from '@/lib/utils';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Ticket as TicketIcon } from 'lucide-react';
import LaravelPagination from '@/components/LaravelPagination'; // Import existant

interface TicketTableProps {
    // Changement : on attend la structure de pagination Laravel
    data: {
        data: Ticket[];
        links: any[];
    };
    emptyMessage?: string;
    showAuthor?: boolean;
}

export function TicketTable({ data, emptyMessage, showAuthor = false }: TicketTableProps) {
    const __ = useTrans();
    const tickets = data.data;

    if (tickets.length === 0) {
        return (
            <Empty className="border-none py-8">
                <EmptyHeader>
                    <EmptyMedia variant="icon"><TicketIcon className="h-8 w-8 text-muted-foreground" /></EmptyMedia>
                    <EmptyTitle className="text-sm font-normal text-muted-foreground">{emptyMessage || __('tickets.index.empty')}</EmptyTitle>
                </EmptyHeader>
            </Empty>
        );
    }

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-xs text-muted-foreground">{__('tickets.fields.id', 'ID')}</TableHead>
                        <TableHead className="text-xs text-muted-foreground">{__('tickets.fields.title')}</TableHead>
                        <TableHead className="text-xs text-muted-foreground">{__('tickets.fields.status')}</TableHead>
                        <TableHead className="text-xs text-muted-foreground">{__('tickets.fields.priority')}</TableHead>
                        {showAuthor && <TableHead className="text-xs text-muted-foreground">{__('tickets.fields.author')}</TableHead>}
                        <TableHead className="w-[8rem] text-right text-xs text-muted-foreground">{__('tickets.fields.updated_at')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tickets.map((ticket) => (
                        <TableRow 
                            key={ticket.id} 
                            className="relative cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => router.get(route('tickets.show', ticket.id))}
                        >
                            <TableCell className="text-xs text-muted-foreground">#{ticket.id}</TableCell>
                            <TableCell className="font-medium text-sm">
                                <Link href={route('tickets.show', ticket.id)} className="absolute inset-0 z-0" />
                                {ticket.title}
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" style={{ backgroundColor: ticket.status?.color + '20', color: ticket.status?.color, borderColor: ticket.status?.color + '40' }}>
                                    {ticket.status?.title}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <span className="flex items-center gap-2 text-xs">
                                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ticket.priority?.color }} />
                                    {ticket.priority?.title}
                                </span>
                            </TableCell>
                            {showAuthor && <TableCell className="text-sm">{ticket.user?.name}</TableCell>}
                            <TableCell className="text-right text-xs text-muted-foreground">{formatDate(ticket.updated_at)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            
            {/* Ajout de la pagination avec le même style que Users Index */}
            <div className="px-4 pb-4">
                <LaravelPagination links={data.links} />
            </div>
        </div>
    );
}