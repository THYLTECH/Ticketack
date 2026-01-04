import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { TabsContent } from '@/components/ui/tabs';
import { Ticket } from '@/types';
import { Download } from 'lucide-react';
import * as React from 'react';

import { TicketAttachments } from '@/pages/tickets/tabs/informations/attachments';
import { TicketDescription } from '@/pages/tickets/tabs/informations/description';
import { ReferenceSolution } from '@/pages/tickets/tabs/informations/reference-solution';
import { TicketSidebar } from '@/pages/tickets/tabs/informations/sidebar';

interface Props {
    ticket: Ticket;
}

export function InformationsTab({ ticket }: Props) {
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

                <TicketSidebar ticket={ticket} />
            </div>

            {/* Lightbox Modal */}
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
