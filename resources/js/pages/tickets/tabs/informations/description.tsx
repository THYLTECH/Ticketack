import { MarkdownViewer } from '@/components/markdown/markdown-viewer';
import { useTrans } from '@/lib/translation';
import { Ticket } from '@/types';
import { AlignLeft } from 'lucide-react';

export function TicketDescription({ ticket }: { ticket: Ticket }) {
    const __ = useTrans();

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <AlignLeft className="h-4 w-4" />
                </div>
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {__('tickets.pages.show.tabs.info_content.description')}
                </h3>
            </div>

            <div className="rounded-xl border bg-card p-5 shadow-sm">
                {ticket.description ? (
                    <MarkdownViewer content={ticket.description} />
                ) : (
                    <span className="text-muted-foreground italic opacity-70">
                        {__('tickets.pages.show.tabs.info_content.no_desc')}
                    </span>
                )}
            </div>
        </div>
    );
}
