/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import {
    Bold,
    Code,
    Expand,
    Heading1,
    Heading2,
    Image as ImageIcon,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Minus,
    Monitor,
    Quote,
    Shrink,
    Strikethrough,
    Table as TableIcon,
} from 'lucide-react';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function MarkdownToolbar({
                             onAction,
                             isFullscreen,
                             toggleFullscreen,
                         }: {
    onAction: (prefix: string, suffix?: string) => void;
    isFullscreen: boolean;
    toggleFullscreen: () => void;
}) {
    const __ = useTrans();

    const handleAction = (
        e: React.MouseEvent,
        prefix: string,
        suffix?: string,
    ) => {
        e.preventDefault();
        onAction(prefix, suffix);
    };

    return (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/30 p-2">
            <div className="flex flex-wrap items-center gap-1">
                <TooltipProvider delayDuration={0}>
                    <div className="flex items-center rounded-md border bg-background p-0.5 shadow-sm">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onMouseDown={(e) =>
                                        handleAction(e, '**', '**')
                                    }
                                    type="button"
                                >
                                    <Bold className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {__('tickets.pages.form.editor.formatting.bold')}
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onMouseDown={(e) =>
                                        handleAction(e, '*', '*')
                                    }
                                    type="button"
                                >
                                    <Italic className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {__('tickets.pages.form.editor.formatting.italic')}
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onMouseDown={(e) =>
                                        handleAction(e, '~~', '~~')
                                    }
                                    type="button"
                                >
                                    <Strikethrough className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {__('tickets.pages.form.editor.formatting.strike')}
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    <div className="flex items-center rounded-md border bg-background p-0.5 shadow-sm">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onMouseDown={(e) => handleAction(e, '# ')}
                                    type="button"
                                >
                                    <Heading1 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {__('tickets.pages.form.editor.formatting.h1')}
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onMouseDown={(e) => handleAction(e, '## ')}
                                    type="button"
                                >
                                    <Heading2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {__('tickets.pages.form.editor.formatting.h2')}
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    <div className="flex items-center rounded-md border bg-background p-0.5 shadow-sm">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onMouseDown={(e) => handleAction(e, '- ')}
                                    type="button"
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {__('tickets.pages.form.editor.formatting.list')}
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onMouseDown={(e) => handleAction(e, '1. ')}
                                    type="button"
                                >
                                    <ListOrdered className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {__(
                                    'tickets.pages.form.editor.formatting.ordered_list',
                                )}
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    <div className="flex items-center rounded-md border bg-background p-0.5 shadow-sm">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onMouseDown={(e) =>
                                        handleAction(e, '[texte](url)')
                                    }
                                    type="button"
                                >
                                    <LinkIcon className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {__('tickets.pages.form.editor.formatting.link')}
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onMouseDown={(e) =>
                                        handleAction(e, '![alt](url)')
                                    }
                                    type="button"
                                >
                                    <ImageIcon className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {__('tickets.pages.form.editor.formatting.image')}
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onMouseDown={(e) =>
                                        handleAction(
                                            e,
                                            '| Col 1 | Col 2 |\n|---|---|\n| Val 1 | Val 2 |',
                                        )
                                    }
                                    type="button"
                                >
                                    <TableIcon className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {__('tickets.pages.form.editor.formatting.table')}
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onMouseDown={(e) =>
                                        handleAction(e, '```\n', '\n```')
                                    }
                                    type="button"
                                >
                                    <Code className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {__('tickets.pages.form.editor.formatting.code')}
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onMouseDown={(e) => handleAction(e, '> ')}
                                    type="button"
                                >
                                    <Quote className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {__('tickets.pages.form.editor.formatting.quote')}
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onMouseDown={(e) =>
                                        handleAction(e, '\n---\n')
                                    }
                                    type="button"
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {__(
                                    'tickets.pages.form.editor.formatting.separator',
                                )}
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </TooltipProvider>
            </div>

            {!isFullscreen && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="hidden h-8 gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex"
                    onClick={toggleFullscreen}
                    type="button"
                >
                    <Expand className="h-3.5 w-3.5" />
                    {__('tickets.pages.form.editor.actions.fullscreen')}
                </Button>
            )}

            {!isFullscreen && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground sm:hidden"
                    onClick={toggleFullscreen}
                    type="button"
                >
                    <Expand className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}

export function MarkdownEditor({
                                   value,
                                   onChange,
                                   disabled,
                               }: {
    value: string;
    onChange: (val: string) => void;
    disabled?: boolean;
}) {
    const __ = useTrans();
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
        if (isFullscreen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isFullscreen]);

    const insertText = (prefix: string, suffix: string = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        textarea.setRangeText(
            prefix + value.substring(start, end) + suffix,
            start,
            end,
            'select',
        );

        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);
        onChange(textarea.value);

        setTimeout(() => {
            textarea.focus({ preventScroll: true });
            textarea.setSelectionRange(
                start + prefix.length,
                end + prefix.length,
            );
        }, 0);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const textarea = e.currentTarget;
            textarea.setRangeText(
                '    ',
                textarea.selectionStart,
                textarea.selectionEnd,
                'end',
            );
            const event = new Event('input', { bubbles: true });
            textarea.dispatchEvent(event);
            onChange(textarea.value);
        }
    };

    const containerClasses = isFullscreen
        ? 'fixed inset-0 z-[9999] h-[100dvh] w-screen bg-background flex flex-col animate-in fade-in duration-200'
        : 'flex flex-col rounded-lg border shadow-sm h-[600px] bg-card';

    return (
        <div className={containerClasses}>
            {isFullscreen && (
                <div className="flex flex-shrink-0 items-center justify-between border-b bg-background px-4 py-2 shadow-sm">
                    <div className="flex items-center gap-2">
                        <Label className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                            {__('tickets.pages.form.editor.label')}
                        </Label>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsFullscreen(false)}
                        className="gap-2"
                    >
                        <Shrink className="h-4 w-4" />
                        <span className="hidden sm:inline">
                            {__('tickets.pages.form.editor.actions.exit')}
                        </span>
                    </Button>
                </div>
            )}

            <MarkdownToolbar
                onAction={insertText}
                isFullscreen={isFullscreen}
                toggleFullscreen={() => setIsFullscreen(!isFullscreen)}
            />

            <div
                className={cn(
                    'grid flex-1 gap-0 overflow-hidden',
                    isFullscreen
                        ? 'grid-rows-2 lg:grid-cols-2 lg:grid-rows-1 lg:divide-x'
                        : 'grid-rows-2 lg:grid-cols-2 lg:grid-rows-1 lg:divide-x',
                )}
            >
                <div className="relative flex h-full min-h-0 flex-col bg-background">
                    <Textarea
                        ref={textareaRef}
                        placeholder={__(
                            'tickets.pages.form.editor.placeholder',
                        )}
                        className="w-full flex-1 resize-none overflow-y-auto rounded-none border-0 p-4 font-mono text-sm leading-relaxed scrollbar-thin scrollbar-thumb-muted-foreground/20 focus-visible:ring-0 sm:p-6"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={disabled}
                    />
                    <div className="pointer-events-none absolute right-2 bottom-2 rounded border bg-background/80 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur-sm">
                        {__('tickets.pages.form.editor.markdown_active')}
                    </div>
                </div>

                <div className="flex h-full min-h-0 flex-col border-t bg-muted/5 lg:border-t-0">
                    <div className="flex flex-shrink-0 items-center justify-between border-b bg-muted/10 px-4 py-2">
                        <Label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                            {__('tickets.pages.form.editor.preview')}
                        </Label>
                        <Monitor className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>

                    <div className="flex-1 overflow-y-auto break-words p-4 scrollbar-thin scrollbar-thumb-muted-foreground/20 sm:p-6">
                        {value ? (
                            <article className="prose prose-sm max-w-none text-foreground dark:prose-invert">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        h1: ({ node, ...props }) => (
                                            <h1
                                                className="mt-6 mb-4 border-b pb-2 text-2xl font-bold tracking-tight text-foreground"
                                                {...props}
                                            />
                                        ),
                                        h2: ({ node, ...props }) => (
                                            <h2
                                                className="mt-5 mb-3 text-xl font-bold tracking-tight text-foreground"
                                                {...props}
                                            />
                                        ),
                                        h3: ({ node, ...props }) => (
                                            <h3
                                                className="mt-4 mb-2 text-lg font-semibold text-foreground"
                                                {...props}
                                            />
                                        ),
                                        blockquote: ({ node, ...props }) => (
                                            <blockquote
                                                className="my-4 rounded-r-sm border-l-4 border-primary/40 bg-muted/30 py-2 pr-2 pl-4 italic text-muted-foreground"
                                                {...props}
                                            />
                                        ),
                                        hr: ({ node, ...props }) => (
                                            <hr
                                                className="my-10 w-full border-t-2 border-border/60"
                                                {...props}
                                            />
                                        ),
                                        ul: ({ node, ...props }) => (
                                            <ul
                                                className="my-4 list-disc space-y-1 pl-6"
                                                {...props}
                                            />
                                        ),
                                        ol: ({ node, ...props }) => (
                                            <ol
                                                className="my-4 list-decimal space-y-1 pl-6"
                                                {...props}
                                            />
                                        ),
                                        li: ({ node, ...props }) => (
                                            <li
                                                className="my-1 pl-1"
                                                {...props}
                                            />
                                        ),
                                        code: ({
                                                   node,
                                                   className,
                                                   children,
                                                   ...props
                                               }) => {
                                            const match = /language-(\w+)/.exec(
                                                className || '',
                                            );
                                            return match ? (
                                                <div className="group relative my-4 rounded-md border bg-muted">
                                                    <div className="absolute top-2 right-2 select-none text-[10px] text-muted-foreground uppercase opacity-70">
                                                        {match[1]}
                                                    </div>
                                                    <code
                                                        className="block w-full overflow-x-auto p-4 font-mono text-xs"
                                                        {...props}
                                                    >
                                                        {children}
                                                    </code>
                                                </div>
                                            ) : (
                                                <code
                                                    className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] font-medium text-foreground"
                                                    {...props}
                                                >
                                                    {children}
                                                </code>
                                            );
                                        },
                                        table: ({ node, ...props }) => (
                                            <div className="my-6 w-full overflow-y-auto rounded-lg border shadow-sm">
                                                <table
                                                    className="w-full text-sm"
                                                    {...props}
                                                />
                                            </div>
                                        ),
                                        th: ({ node, ...props }) => (
                                            <th
                                                className="border-b bg-muted/40 px-4 py-3 text-left font-semibold"
                                                {...props}
                                            />
                                        ),
                                        td: ({ node, ...props }) => (
                                            <td
                                                className="border-b px-4 py-3 last:border-0"
                                                {...props}
                                            />
                                        ),
                                        img: ({ node, ...props }) => (
                                            <img
                                                className="mx-auto my-4 h-auto max-w-full rounded-md border shadow-sm"
                                                {...props}
                                                alt={props.alt || 'Image'}
                                            />
                                        ),
                                        a: ({ node, ...props }) => (
                                            <a
                                                className="font-medium text-primary hover:underline"
                                                target="_blank"
                                                rel="noreferrer"
                                                {...props}
                                            />
                                        ),
                                    }}
                                >
                                    {value}
                                </ReactMarkdown>
                            </article>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-3 select-none text-muted-foreground/40">
                                <Monitor className="h-16 w-16 opacity-10" />
                                <p className="text-sm font-medium">
                                    {__('tickets.pages.form.editor.empty_preview')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
