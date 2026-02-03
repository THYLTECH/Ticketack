import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { Ticket } from '@/types';
import { MarkdownViewer } from '@/components/markdown/markdown-viewer';
import {
    BookOpenCheck,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import * as React from 'react';

export function ReferenceSolution({ ticket }: { ticket: Ticket }) {
    const __ = useTrans();
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [showExpandButton, setShowExpandButton] = React.useState(false);
    const contentRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (contentRef.current) {
            setShowExpandButton(contentRef.current.scrollHeight > 220);
        }
    }, [ticket.detailed_solution]);

    if (!ticket.is_referenced || !ticket.detailed_solution) return null;

    return (
        <div className="group rounded-lg border border-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/10">
            <div className="flex items-center justify-between border-b border-emerald-500/10 bg-emerald-500/5 px-4 py-3">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-600/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400">
                        <BookOpenCheck className="h-4 w-4" />
                    </div>
                    <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                        {__('tickets.pages.show.knowledge_base.title')}
                    </h4>
                </div>
                <Badge
                    variant="outline"
                    className="border-emerald-500/30 bg-background/50 text-emerald-700 backdrop-blur-sm dark:border-emerald-500/30 dark:text-emerald-400"
                >
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    {__('tickets.pages.show.knowledge_base.verified')}
                </Badge>
            </div>

            <div className="relative">
                <div
                    ref={contentRef}
                    className={cn(
                        'relative px-5 py-4 transition-all duration-500 ease-in-out',
                        !isExpanded && 'max-h-[220px] overflow-hidden',
                    )}
                >
                    <MarkdownViewer
                        content={ticket.detailed_solution}
                        proseClass="prose-emerald dark:prose-invert"
                    />

                    {!isExpanded && showExpandButton && (
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background/90 to-transparent backdrop-blur-[1px]" />
                    )}
                </div>

                {showExpandButton && (
                    <div className="border-t border-emerald-500/10 bg-emerald-500/5 p-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="h-7 w-full text-xs font-medium text-emerald-700 hover:bg-emerald-100/50 hover:text-emerald-800 dark:text-emerald-400"
                        >
                            {isExpanded ? (
                                <>
                                    <ChevronUp className="mr-1.5 h-3 w-3" />{' '}
                                    {__('tickets.pages.show.knowledge_base.collapse')}
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="mr-1.5 h-3 w-3" />{' '}
                                    {__('tickets.pages.show.knowledge_base.expand')}
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
