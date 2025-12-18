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
import LaravelPagination from '@/components/LaravelPagination';

interface TicketTableProps {
    data: {
        data: Ticket[];
        links: { url: string | null; label: string; active: boolean }[];
    } | null;
    emptyMessage?: string;
    showAuthor?: boolean;
}

export function TicketTable({ data, emptyMessage, showAuthor = false }: TicketTableProps) {
    const __ = useTrans();

    if (!data) return null;

    const tickets = data.data;

    return (
        /* - min-h-[750px] : Hauteur stable adaptée à 15 tickets (réduite par rapport à 850px).
           - flex-col + justify-between : Maintient la pagination tout en bas si elle existe.
        */
        <div className="flex flex-col h-full min-h-[750px] justify-between">
            <div className="flex-1 overflow-x-auto">
                {tickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[650px]">
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
                    /* - table-fixed : Force le respect des largeurs de colonnes.
                       - truncate : Empêche les débordements des textes longs.
                    */
                    <Table className="table-fixed w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[60px] text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                                    {__('tickets.fields.id', 'ID')}
                                </TableHead>
                                <TableHead className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                                    {__('tickets.fields.title')}
                                </TableHead>
                                <TableHead className="w-[100px] text-[10px] text-muted-foreground uppercase font-bold tracking-widest text-center">
                                    {__('tickets.fields.status')}
                                </TableHead>
                                <TableHead className="w-[90px] text-[10px] text-muted-foreground uppercase font-bold tracking-widest text-center">
                                    {__('tickets.fields.priority')}
                                </TableHead>
                                {showAuthor && (
                                    <TableHead className="w-[120px] text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                                        {__('tickets.fields.author')}
                                    </TableHead>
                                )}
                                <TableHead className="w-[110px] text-right text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                                    {__('tickets.fields.updated_at')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickets.map((ticket) => (
                                <TableRow 
                                    key={ticket.id} 
                                    className="relative cursor-pointer hover:bg-muted/50 transition-colors group"
                                    onClick={() => router.get(route('tickets.show', ticket.id))}
                                >
                                    <TableCell className="text-xs text-muted-foreground font-mono truncate">
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
                                    
                                    <TableCell className="text-right text-xs text-muted-foreground font-medium truncate">
                                        {formatDate(ticket.updated_at)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
            
            {/* La barre de navigation n'est rendue que s'il y a plus d'une page 
                (Laravel génère 3 liens par défaut pour une seule page).
            */}
            {data.links && data.links.length > 3 && (
                <div className="px-6 py-4 border-t bg-muted/5 mt-auto">
                    <LaravelPagination links={data.links} />
                </div>
            )}
        </div>
    );
}