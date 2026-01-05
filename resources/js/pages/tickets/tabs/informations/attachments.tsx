import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatBytes } from '@/hooks/use-file-upload';
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { Attachment, Ticket } from '@/types';
import { Download, Eye, FileText, Paperclip } from 'lucide-react';

const isImage = (file: Attachment) => {
    const mime = file.mime_type || '';
    const ext = file.file_extension || '';
    return (
        mime.startsWith('image/') ||
        ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext.toLowerCase())
    );
};

export function TicketAttachments({
    ticket,
    onPreview,
}: {
    ticket: Ticket;
    onPreview: (url: string, alt: string) => void;
}) {
    const __ = useTrans();

    return (
        <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Paperclip className="h-4 w-4" />
                    </div>
                    <h3 className="text-base font-semibold tracking-tight text-foreground">
                        {__('tickets.pages.show.tabs.info_content.attachments')}
                    </h3>
                </div>
                {ticket.attachments && ticket.attachments.length > 0 && (
                    <Badge variant="secondary" className="rounded-full px-2.5">
                        {ticket.attachments.length}
                    </Badge>
                )}
            </div>

            {ticket.attachments && ticket.attachments.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {ticket.attachments.map((file) => {
                        const isImg = isImage(file);
                        const fileName =
                            file.file_name || file.title || 'Fichier';

                        return (
                            <div
                                key={file.id}
                                className={cn(
                                    'group relative flex cursor-pointer items-center gap-3 rounded-xl border bg-background p-2.5 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md',
                                    !isImg && 'cursor-default',
                                )}
                                onClick={() =>
                                    isImg && onPreview(file.url, fileName)
                                }
                            >
                                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted/30">
                                    {isImg ? (
                                        <img
                                            src={file.url}
                                            alt={fileName}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <FileText className="h-5 w-5 text-muted-foreground/70" />
                                    )}
                                    {isImg && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                            <Eye className="h-4 w-4 text-white drop-shadow-md" />
                                        </div>
                                    )}
                                </div>

                                <div className="grid min-w-0 flex-1 gap-0.5">
                                    <p className="truncate text-xs font-medium text-foreground transition-colors group-hover:text-primary">
                                        {fileName}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] font-medium text-muted-foreground uppercase">
                                            {file.file_extension || 'FILE'}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {formatBytes(file.file_size || 0)}
                                        </span>
                                    </div>
                                </div>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-muted-foreground/50 opacity-0 transition-all group-hover:opacity-100 hover:bg-muted hover:text-foreground"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.open(
                                                        file.url,
                                                        '_blank',
                                                    );
                                                }}
                                            >
                                                <Download className="h-3.5 w-3.5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            {__('Download')}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/5 py-8 text-center">
                    <p className="text-sm text-muted-foreground italic">
                        {__(
                            'tickets.pages.show.tabs.info_content.no_attachments',
                        )}
                    </p>
                </div>
            )}
        </div>
    );
}
