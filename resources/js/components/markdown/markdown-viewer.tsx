import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownViewerProps {
    content: string;
    className?: string;
    proseClass?: string;
}

export function MarkdownViewer({
    content,
    className,
    proseClass = 'prose-neutral dark:prose-invert',
}: MarkdownViewerProps) {
    const components: Components = {
        h1: ({ className, ...props }) => (
            <h1
                className={cn('mt-6 mb-4 border-b pb-2 text-2xl font-bold tracking-tight', className)}
                {...props}
            />
        ),
        h2: ({ className, ...props }) => (
            <h2
                className={cn('mt-5 mb-3 text-xl font-bold tracking-tight', className)}
                {...props}
            />
        ),
        h3: ({ className, ...props }) => (
            <h3
                className={cn('mt-4 mb-2 text-lg font-semibold', className)}
                {...props}
            />
        ),
        p: ({ className, ...props }) => (
            <p
                className={cn('mb-4 leading-relaxed last:mb-0', className)}
                {...props}
            />
        ),
        blockquote: ({ className, ...props }) => (
            <blockquote
                className={cn(
                    'my-4 border-l-4 border-primary/40 bg-muted/30 py-2 pr-2 pl-4 italic text-muted-foreground',
                    className,
                )}
                {...props}
            />
        ),
        ul: ({ className, ...props }) => (
            <ul
                className={cn('my-4 list-disc space-y-1 pl-6', className)}
                {...props}
            />
        ),
        ol: ({ className, ...props }) => (
            <ol
                className={cn('my-4 list-decimal space-y-1 pl-6', className)}
                {...props}
            />
        ),
        li: ({ className, ...props }) => (
            <li className={cn('my-1 pl-1', className)} {...props} />
        ),
        hr: ({ className, ...props }) => (
            <hr
                className={cn('my-8 border-border', className)}
                {...props}
            />
        ),
        table: ({ className, ...props }) => (
            <div className="my-6 w-full overflow-y-auto rounded-lg border shadow-sm">
                <table
                    className={cn('w-full text-sm', className)}
                    {...props}
                />
            </div>
        ),
        th: ({ className, ...props }) => (
            <th
                className={cn(
                    'border-b bg-muted/40 px-4 py-3 text-left font-semibold',
                    className,
                )}
                {...props}
            />
        ),
        td: ({ className, ...props }) => (
            <td
                className={cn('border-b px-4 py-3 last:border-0', className)}
                {...props}
            />
        ),
        img: ({ className, ...props }) => (
            <img
                className={cn(
                    'mx-auto my-6 max-h-[500px] w-auto rounded-lg border shadow-sm',
                    className,
                )}
                {...props}
                alt={props.alt || 'Image'}
            />
        ),
        a: ({ className, href, children, ...props }) => {
            const isExternal = href?.startsWith('http');
            return (
                <a
                    href={href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className={cn(
                        'inline-flex items-center gap-0.5 font-medium text-primary underline underline-offset-4 hover:text-primary/80',
                        className,
                    )}
                    {...props}
                >
                    {children}
                    {isExternal && <ExternalLink className="h-3 w-3 opacity-70" />}
                </a>
            );
        },
        code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const isBlock = match || (children as string)?.includes?.('\n');

            if (isBlock) {
                return (
                    <div className="group relative my-5 overflow-hidden rounded-lg border bg-muted/50 dark:bg-muted/20">
                        {match && (
                            <div className="absolute top-2 right-3 select-none text-[10px] font-medium text-muted-foreground uppercase opacity-70">
                                {match[1]}
                            </div>
                        )}
                        <code
                            className={cn(
                                'block w-full overflow-x-auto p-4 font-mono text-sm leading-relaxed',
                                className,
                            )}
                            {...props}
                        >
                            {children}
                        </code>
                    </div>
                );
            }

            return (
                <code
                    className={cn(
                        'rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] font-medium text-foreground',
                        className,
                    )}
                    {...props}
                >
                    {children}
                </code>
            );
        },
        input: ({ type, checked, ...props }) => {
            if (type === 'checkbox') {
                return (
                    <input
                        type="checkbox"
                        className="mr-2 h-3.5 w-3.5 rounded border-primary accent-primary disabled:cursor-not-allowed disabled:opacity-70"
                        checked={checked}
                        readOnly
                        disabled
                        {...props}
                    />
                );
            }
            return <input type={type} {...props} />;
        },
    };

    return (
        <article
            className={cn(
                'prose max-w-none break-words',
                proseClass,
                className,
            )}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={components}
            >
                {content}
            </ReactMarkdown>
        </article>
    );
}
