import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { TabsContent } from '@/components/ui/tabs';
import { useTrans } from '@/lib/translation';
import { Ticket } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowUpRight, Download, Sparkles } from 'lucide-react';
import * as React from 'react';

import AiAssistantPanel from '@/pages/tickets/partials/AiAssistantPanel';
import { TicketAttachments } from '@/pages/tickets/tabs/informations/attachments';
import { TicketDescription } from '@/pages/tickets/tabs/informations/description';
import { ReferenceSolution } from '@/pages/tickets/tabs/informations/reference-solution';
import { TicketSidebar } from '@/pages/tickets/tabs/informations/sidebar';
import { toast } from 'sonner';

interface SimilarTicket {
    id: number;
    title: string;
    similarity: number;
}

interface Props {
    ticket: Ticket;
    similarTickets?: SimilarTicket[];
}

export function InformationsTab({ ticket, similarTickets = [] }: Props) {
    const trans = useTrans();
    const __ = (key: string): string => trans(key) as string;

    const [previewImage, setPreviewImage] = React.useState<{
        url: string;
        alt: string;
    } | null>(null);

    return (
        <TabsContent
            value="informations"
            className="animate-in duration-500 fade-in slide-in-from-bottom-2"
        >
            <div className="flex flex-col gap-10 lg:flex-row">
                <div className="min-w-0 flex-1 space-y-8">
                    <ReferenceSolution ticket={ticket} />
                    <TicketDescription ticket={ticket} />
                    <TicketAttachments
                        ticket={ticket}
                        onPreview={(url, alt) => setPreviewImage({ url, alt })}
                    />
                </div>

                <div className="flex w-full flex-col gap-6 lg:w-80">
                    <TicketSidebar ticket={ticket} />

                    {/* AI Assistant Panel */}
                    {!ticket.status.is_closed && ticket.ai_suggestions && ticket.ai_suggestions.length > 0 && (
                        <AiAssistantPanel
                            ticketId={ticket.id}
                            suggestions={ticket.ai_suggestions}
                            onAccept={(content) => {
                                navigator.clipboard.writeText(content);
                                toast.success(__('ticket.ai_solution_copied'));
                            }}
                        />
                    )}

                    {similarTickets.length > 0 && (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                <Sparkles className="h-4 w-4 text-primary" />
                                {__('knowledge.similar.title')}
                            </div>

                            <div className="grid gap-2">
                                {similarTickets.map((similar) => (
                                    <Link
                                        key={similar.id}
                                        href={route('tickets.show', similar.id)}
                                        className="group relative flex flex-col gap-1.5 rounded-lg border border-border bg-background p-3 transition-all hover:border-primary/50 hover:shadow-sm"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <span className="line-clamp-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                                                {similar.title}
                                            </span>
                                            <ArrowUpRight className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant="secondary"
                                                className="bg-primary/10 text-[10px] font-normal text-primary"
                                            >
                                                {similar.similarity}%{' '}
                                                {__('knowledge.similar.match')}
                                            </Badge>
                                            <span className="text-[10px] text-muted-foreground">
                                                #{similar.id}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Dialog
                open={!!previewImage}
                onOpenChange={(open) => !open && setPreviewImage(null)}
            >
                <DialogContent className="flex h-[90vh] w-full max-w-6xl flex-col items-center justify-center border-none bg-black/95 p-0 shadow-2xl">
                    <DialogHeader className="absolute top-4 left-4 z-50">
                        <DialogTitle className="font-medium tracking-wide text-white/90">
                            {previewImage?.alt}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="relative flex h-full w-full items-center justify-center p-4">
                        {previewImage && (
                            <img
                                src={previewImage.url}
                                alt={previewImage.alt}
                                className="max-h-full max-w-full animate-in rounded-md object-contain shadow-2xl duration-300 zoom-in-95"
                            />
                        )}
                    </div>

                    <div className="absolute top-4 right-4 z-50 flex gap-2">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="rounded-full border-none bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
                            onClick={() =>
                                window.open(previewImage?.url, '_blank')
                            }
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="destructive"
                            size="icon"
                            className="rounded-full opacity-90 hover:opacity-100"
                            onClick={() => setPreviewImage(null)}
                        >
                            <span className="text-xl leading-none font-bold">
                                &times;
                            </span>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </TabsContent>
    );
}
