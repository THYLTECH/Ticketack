import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { Ticket } from '@/types';
import {
    AlertCircle,
    ArchiveX,
    GripVertical,
    Inbox,
    Search,
    X,
} from 'lucide-react';
import React, { useState } from 'react';

interface Props {
    tickets: Ticket[];
    scheduledTicketIds: number[];
    selectedId: number | null;
    onSelect: (id: number | null) => void;
    onUnschedule?: (eventId: number) => void;
}

export function TicketSidebar({
    tickets,
    scheduledTicketIds,
    selectedId,
    onSelect,
    onUnschedule,
}: Props) {
    const __ = useTrans();
    const [search, setSearch] = useState('');
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const availableTickets = tickets
        .filter((t) => !scheduledTicketIds.includes(t.id))
        .filter(
            (t) =>
                t.title.toLowerCase().includes(search.toLowerCase()) ||
                t.id.toString().includes(search),
        );

    const handleDragOver = (e: React.DragEvent) => {
        if (onUnschedule) {
            e.preventDefault();
            setIsDraggingOver(true);
        }
    };

    const handleDragLeave = () => {
        setIsDraggingOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingOver(false);
        const eventId = e.dataTransfer.getData('eventId');

        if (eventId && onUnschedule) {
            onUnschedule(parseInt(eventId));
        }
    };

    return (
        <div className="flex h-full flex-col overflow-hidden">
            <div className="flex flex-col gap-4 border-b bg-muted/10 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <Inbox className="h-4 w-4 text-primary" />
                        <span>{__('schedule.sidebar.title')}</span>
                    </div>
                    <Badge
                        variant="secondary"
                        className="h-5 px-1.5 font-mono text-[10px]"
                    >
                        {availableTickets.length}
                    </Badge>
                </div>

                <div className="relative">
                    <Search className="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                        placeholder={__('schedule.sidebar.search_placeholder')}
                        className="h-9 w-full bg-background pr-8 pl-8 text-xs transition-all focus-visible:ring-1"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 h-7 w-7 hover:bg-transparent"
                            onClick={() => setSearch('')}
                        >
                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </Button>
                    )}
                </div>
            </div>

            <ScrollArea
                className="relative flex-1"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {isDraggingOver && (
                    <div className="absolute inset-0 z-50 m-2 flex animate-in flex-col items-center justify-center rounded-xl border-2 border-dashed border-destructive bg-destructive/5 backdrop-blur-[1px] transition-all zoom-in-95 fade-in">
                        <div className="mb-2 rounded-full bg-background p-3 shadow-sm ring-1 ring-destructive/20">
                            <ArchiveX className="h-6 w-6 text-destructive" />
                        </div>
                        <p className="text-xs font-bold tracking-wider text-destructive uppercase">
                            {__('schedule.sidebar.drop_to_unschedule')}
                        </p>
                    </div>
                )}

                <div className="flex flex-col gap-3 p-3">
                    {availableTickets.map((ticket) => {
                        const isSelected = selectedId === ticket.id;
                        return (
                            <div
                                key={ticket.id}
                                draggable="true"
                                onDragStart={(e) => {
                                    e.dataTransfer.setData(
                                        'ticketId',
                                        ticket.id.toString(),
                                    );
                                    e.dataTransfer.effectAllowed = 'copy';
                                    onSelect(ticket.id);
                                }}
                                onClick={() =>
                                    onSelect(isSelected ? null : ticket.id)
                                }
                                className={cn(
                                    'group flex w-full cursor-grab overflow-hidden rounded-lg border bg-card text-left shadow-sm transition-all duration-200 select-none active:cursor-grabbing',
                                    isSelected
                                        ? 'border-primary ring-1 ring-primary'
                                        : 'hover:border-primary/50 hover:shadow-md',
                                )}
                            >
                                {/* Barre de couleur latérale intégrée via Flexbox */}
                                <div
                                    className="w-1.5 shrink-0"
                                    style={{
                                        backgroundColor:
                                            ticket.priority?.color ||
                                            'hsl(var(--border))',
                                    }}
                                />

                                <div className="flex flex-1 flex-col gap-1.5 p-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="line-clamp-2 text-xs leading-snug font-semibold text-foreground/90">
                                            {ticket.title}
                                        </span>
                                        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/30 transition-colors group-hover:text-muted-foreground" />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant="outline"
                                                className="h-5 border-border/50 bg-background/50 px-1.5 font-mono text-[9px] text-muted-foreground"
                                            >
                                                #{ticket.id}
                                            </Badge>
                                        </div>
                                        <span className="max-w-[80px] truncate text-[9px] font-medium tracking-wider text-muted-foreground/70 uppercase">
                                            {ticket.category?.title}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {availableTickets.length === 0 && (
                        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center opacity-60">
                            {search ? (
                                <>
                                    <Search className="h-8 w-8 text-muted-foreground" />
                                    <p className="text-xs text-muted-foreground">
                                        {__('schedule.sidebar.no_results')} "
                                        {search}"
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="rounded-full bg-muted/50 p-3">
                                        <AlertCircle className="h-6 w-6 text-primary/50" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">
                                            {__('schedule.sidebar.empty_title')}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {__(
                                                'schedule.sidebar.empty_description',
                                            )}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
