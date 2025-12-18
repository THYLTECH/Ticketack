import { Link } from '@inertiajs/react';
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
import { format } from 'date-fns'; 

interface TicketTableProps {
    tickets: Ticket[];
    emptyMessage?: string;
    showAuthor?: boolean;
}

export function TicketTable({ tickets, emptyMessage, showAuthor = false }: TicketTableProps) {
    const __ = useTrans();

    if (tickets.length === 0) {
        return (
            <div className="py-8 text-center text-sm text-muted-foreground border rounded-lg bg-muted/20">
                {emptyMessage || __('tickets.index.empty')}
            </div>
        );
    }

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>{__('tickets.fields.title')}</TableHead>
                        <TableHead>{__('tickets.fields.status')}</TableHead>
                        <TableHead>{__('tickets.fields.priority')}</TableHead>
                        {showAuthor && <TableHead>{__('tickets.fields.author')}</TableHead>}
                        <TableHead className="text-right">{__('tickets.fields.updated_at')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                            <TableCell className="font-medium">#{ticket.id}</TableCell>
                            <TableCell>
                                <Link 
                                    href={route('tickets.show', ticket.id)} 
                                    className="font-semibold hover:underline text-primary"
                                >
                                    {ticket.title}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <Badge 
                                    variant="outline" 
                                    style={{ 
                                        backgroundColor: ticket.status?.color + '20', 
                                        color: ticket.status?.color,
                                        borderColor: ticket.status?.color + '40'
                                    }}
                                >
                                    {ticket.status?.title}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <span className="flex items-center gap-2 text-xs">
                                    <span 
                                        className="h-2 w-2 rounded-full" 
                                        style={{ backgroundColor: ticket.priority?.color }} 
                                    />
                                    {ticket.priority?.title}
                                </span>
                            </TableCell>
                            {showAuthor && (
                                <TableCell className="text-sm">
                                    {ticket.user?.name}
                                </TableCell>
                            )}
                            <TableCell className="text-right text-xs text-muted-foreground">
                                {format(new Date(ticket.updated_at), 'dd/MM/yyyy HH:mm')}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}