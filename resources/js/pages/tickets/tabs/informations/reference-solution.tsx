import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { Ticket } from '@/types';
import {
    BookOpenCheck,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function ReferenceSolution({ ticket }: { ticket: Ticket }) {
    const __ = useTrans();
    const [isExpanded, setIsExpanded] = React.useState(false);

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
                    className={cn(
                        'relative px-5 py-4 transition-all duration-500 ease-in-out',
                        !isExpanded && 'max-h-55 overflow-hidden',
                    )}
                >
                    <article className="prose prose-sm dark:prose-invert prose-emerald max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({ ...props }) => (
                                    <h1
                                        className="mt-4 mb-2 text-lg font-bold"
                                        {...props}
                                    />
                                ),
                                h2: ({ ...props }) => (
                                    <h2
                                        className="mt-3 mb-2 text-base font-bold"
                                        {...props}
                                    />
                                ),
                                h3: ({ ...props }) => (
                                    <h3
                                        className="mt-3 mb-1 text-sm font-semibold"
                                        {...props}
                                    />
                                ),
                                p: ({ ...props }) => (
                                    <p
                                        className="mb-3 leading-relaxed last:mb-0"
                                        {...props}
                                    />
                                ),
                                ul: ({ className, ...props }) => (
                                    <ul
                                        className={cn(
                                            'my-2 list-disc space-y-1 pl-5',
                                            className,
                                        )}
                                        {...props}
                                    />
                                ),
                                ol: ({ className, ...props }) => (
                                    <ol
                                        className={cn(
                                            'my-2 list-decimal space-y-1 pl-5',
                                            className,
                                        )}
                                        {...props}
                                    />
                                ),
                                li: ({ ...props }) => (
                                    <li className="pl-1" {...props} />
                                ),
                                blockquote: ({ ...props }) => (
                                    <blockquote
                                        className="my-4 rounded-r-sm border-l-4 border-emerald-500/50 bg-emerald-50/50 py-2 pr-2 pl-4 text-muted-foreground italic dark:bg-emerald-900/20"
                                        {...props}
                                    />
                                ),
                                table: ({ ...props }) => (
                                    <div className="my-4 w-full overflow-y-auto rounded-lg border border-emerald-500/10 shadow-sm">
                                        <table
                                            className="w-full text-sm"
                                            {...props}
                                        />
                                    </div>
                                ),
                                th: ({ ...props }) => (
                                    <th
                                        className="border-b border-emerald-500/10 bg-emerald-50/50 px-4 py-2 text-left font-semibold dark:bg-emerald-900/20"
                                        {...props}
                                    />
                                ),
                                td: ({ ...props }) => (
                                    <td
                                        className="border-b border-emerald-500/5 px-4 py-2 last:border-0"
                                        {...props}
                                    />
                                ),
                                img: ({ ...props }) => (
                                    <img
                                        className="mx-auto my-4 rounded-lg border border-emerald-500/10 shadow-sm"
                                        {...props}
                                        alt={props.alt || 'Image'}
                                    />
                                ),
                                a: ({ ...props }) => (
                                    <a
                                        className="font-medium text-emerald-600 underline underline-offset-4 hover:text-emerald-500"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        {...props}
                                    />
                                ),
                                code: ({ className, children, ...props }) => {
                                    const match = /language-(\w+)/.exec(
                                        className || '',
                                    );
                                    return match ? (
                                        <div className="relative my-3 rounded-md border border-emerald-500/10 bg-emerald-50/50 dark:bg-emerald-900/20">
                                            <code
                                                className="block w-full overflow-x-auto p-3 font-mono text-xs"
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        </div>
                                    ) : (
                                        <code
                                            className="rounded bg-emerald-100/50 px-1 py-0.5 font-mono text-[0.9em] dark:bg-emerald-900/30"
                                            {...props}
                                        >
                                            {children}
                                        </code>
                                    );
                                },
                                input: ({ ...props }) =>
                                    props.type === 'checkbox' ? (
                                        <input
                                            type="checkbox"
                                            className="mr-2 h-3.5 w-3.5 rounded border-emerald-500 accent-emerald-500"
                                            checked={props.checked}
                                            readOnly
                                            disabled
                                        />
                                    ) : (
                                        <input {...props} />
                                    ),
                            }}
                        >
                            {ticket.detailed_solution || ''}
                        </ReactMarkdown>
                    </article>

                    {!isExpanded && (
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background/90 to-transparent backdrop-blur-[1px]" />
                    )}
                </div>

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
            </div>
        </div>
    );
}
