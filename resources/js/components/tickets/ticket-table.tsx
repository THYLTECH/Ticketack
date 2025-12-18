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

    // Sécurité si les données ne sont pas encore chargées ou nulles
    if (!data) return null;

    const tickets = data.data;

    return (
        /* Conteneur principal avec hauteur fixe (850px).
           justify-between force la pagination à rester tout en bas.
        */
        <div className="flex flex-col h-full min-h-[850px] justify-between">
            
            {/* Zone du contenu (Tableau ou État vide) */}
            <div className="flex-1">
                {tickets.length === 0 ? (
                    /* Centrage de l'état vide dans l'espace disponible */
                    <div className="flex flex-col items-center justify-center h-[750px]">
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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                                    {__('tickets.fields.id', 'ID')}
                                </TableHead>
                                <TableHead className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                                    {__('tickets.fields.title')}
                                </TableHead>
                                <TableHead className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest text-center">
                                    {__('tickets.fields.status')}
                                </TableHead>
                                <TableHead className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest text-center">
                                    {__('tickets.fields.priority')}
                                </TableHead>
                                {showAuthor && (
                                    <TableHead className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                                        {__('tickets.fields.author')}
                                    </TableHead>
                                )}
                                <TableHead className="w-[8rem] text-right text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
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
                                    {/* ID en police mono comme dans Users Index */}
                                    <TableCell className="text-xs text-muted-foreground font-mono">
                                        #{ticket.id}
                                    </TableCell>
                                    
                                    <TableCell className="font-medium text-sm relative">
                                        {/* Lien invisible pour l'accessibilité sur toute la ligne */}
                                        <Link href={route('tickets.show', ticket.id)} className="absolute inset-0 z-0" />
                                        <span className="relative z-10 group-hover:underline decoration-primary/30">
                                            {ticket.title}
                                        </span>
                                    </TableCell>
                                    
                                    <TableCell className="text-center">
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
                                    </TableCell>
                                    
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2 text-xs">
                                            <span 
                                                className="h-2 w-2 rounded-full shadow-sm" 
                                                style={{ backgroundColor: ticket.priority?.color }} 
                                            />
                                            <span className="hidden sm:inline opacity-80 italic">
                                                {ticket.priority?.title}
                                            </span>
                                        </div>
                                    </TableCell>
                                    
                                    {showAuthor && (
                                        <TableCell className="text-sm font-medium">
                                            {ticket.user?.name}
                                        </TableCell>
                                    )}
                                    
                                    <TableCell className="text-right text-xs text-muted-foreground font-medium">
                                        {formatDate(ticket.updated_at)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
            
            {/* PAGINATION : Toujours affichée en bas du bloc de 850px.
                LaravelPagination gère automatiquement l'état désactivé 
                si il n'y a qu'une seule page.
            */}
            <div className="px-6 py-4 border-t bg-muted/5 mt-auto">
                <LaravelPagination links={data.links} />
            </div>
        </div>
    );
}