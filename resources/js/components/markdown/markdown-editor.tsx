import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
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
    UploadCloud,
} from 'lucide-react';
import * as React from 'react';
import { MarkdownViewer } from './markdown-viewer';

interface MarkdownToolbarProps {
    onAction: (prefix: string, suffix?: string) => void;
    variant: 'default' | 'minimal';
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
}

function MarkdownToolbar({
    onAction,
    variant,
    isFullscreen,
    onToggleFullscreen,
}: MarkdownToolbarProps) {
    const handleAction = (
        e: React.MouseEvent,
        prefix: string,
        suffix?: string,
    ) => {
        e.preventDefault();
        onAction(prefix, suffix);
    };

    const ActionButton = ({
        icon: Icon,
        label,
        prefix,
        suffix,
        shortcut,
    }: {
        icon: React.ElementType;
        label: string;
        prefix: string;
        suffix?: string;
        shortcut?: string;
    }) => (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded"
                    onMouseDown={(e) => handleAction(e, prefix, suffix)}
                    type="button"
                >
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{label}</span>
                </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
                <p>{label}</p>
                {shortcut && (
                    <span className="text-xs text-muted-foreground">
                        {shortcut}
                    </span>
                )}
            </TooltipContent>
        </Tooltip>
    );

    return (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 bg-muted/30 p-1.5 backdrop-blur-sm">
            <TooltipProvider delayDuration={300}>
                <div className="flex flex-wrap items-center gap-0.5">
                    <ActionButton
                        icon={Bold}
                        label="Bold (Ctrl+B)"
                        prefix="**"
                        suffix="**"
                    />
                    <ActionButton
                        icon={Italic}
                        label="Italic (Ctrl+I)"
                        prefix="*"
                        suffix="*"
                    />

                    {variant === 'default' && (
                        <ActionButton
                            icon={Strikethrough}
                            label="Strikethrough"
                            prefix="~~"
                            suffix="~~"
                        />
                    )}

                    <div className="mx-1 h-4 w-px bg-border/40" />

                    {variant === 'default' && (
                        <>
                            <ActionButton
                                icon={Heading1}
                                label="Heading 1"
                                prefix="# "
                            />
                            <ActionButton
                                icon={Heading2}
                                label="Heading 2"
                                prefix="## "
                            />
                            <div className="mx-1 h-4 w-px bg-border/40" />
                        </>
                    )}

                    <ActionButton icon={List} label="Bullet List" prefix="- " />
                    <ActionButton
                        icon={ListOrdered}
                        label="Ordered List"
                        prefix="1. "
                    />

                    <div className="mx-1 h-4 w-px bg-border/40" />

                    <ActionButton
                        icon={LinkIcon}
                        label="Link"
                        prefix="["
                        suffix="](url)"
                    />

                    {variant === 'default' ? (
                        <ActionButton
                            icon={ImageIcon}
                            label="Image"
                            prefix="!["
                            suffix="](url)"
                        />
                    ) : null}

                    <ActionButton
                        icon={Code}
                        label="Code"
                        prefix={variant === 'default' ? '```\n' : '`'}
                        suffix={variant === 'default' ? '\n```' : '`'}
                    />

                    <ActionButton
                        icon={Quote}
                        label="Quote"
                        prefix="> "
                    />

                    {variant === 'default' && (
                        <>
                            <div className="mx-1 h-4 w-px bg-border/40" />
                            <ActionButton
                                icon={TableIcon}
                                label="Table"
                                prefix={'| Col 1 | Col 2 |\n|---|---|\n| Val 1 | Val 2 |'}
                            />
                            <ActionButton
                                icon={Minus}
                                label="Horizontal Rule"
                                prefix="\n---\n"
                            />
                        </>
                    )}
                </div>

                {onToggleFullscreen && (
                    <div className="ml-auto border-l border-border/40 pl-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={onToggleFullscreen}
                            type="button"
                        >
                            {isFullscreen ? (
                                <Shrink className="h-4 w-4" />
                            ) : (
                                <Expand className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                )}
            </TooltipProvider>
        </div>
    );
}

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    minHeight?: string;
    variant?: 'default' | 'minimal';
    enablePreview?: boolean;
    isDragging?: boolean;
    onDrop?: (e: React.DragEvent) => void;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    onSubmit?: () => void;
    className?: string;
}

export function MarkdownEditor({
    value,
    onChange,
    placeholder,
    disabled = false,
    minHeight = '200px',
    variant = 'default',
    enablePreview = true,
    isDragging = false,
    onDrop,
    header,
    footer,
    onSubmit,
    className,
}: MarkdownEditorProps) {
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

        const newValue = textarea.value;
        onChange(newValue);

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
            onChange(textarea.value);
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && onSubmit) {
            e.preventDefault();
            onSubmit();
        }
    };

    const containerClasses = isFullscreen
        ? 'fixed inset-0 z-[50] h-[100dvh] w-screen bg-background flex flex-col animate-in fade-in duration-200'
        : cn('flex flex-col rounded-lg border bg-card shadow-sm transition-all',
            isDragging && 'ring-2 ring-primary border-primary',
            className
        );

    return (
        <div className={containerClasses}>
            {isFullscreen && (
                <div className="flex flex-shrink-0 items-center justify-between border-b bg-background px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2 font-medium">
                        Editor Mode
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsFullscreen(false)}
                        className="gap-2"
                    >
                        <Shrink className="h-4 w-4" />
                        Exit Fullscreen
                    </Button>
                </div>
            )}

            {header}

            <MarkdownToolbar
                onAction={insertText}
                variant={variant}
                isFullscreen={isFullscreen}
                onToggleFullscreen={
                    enablePreview && variant === 'default'
                        ? () => setIsFullscreen(!isFullscreen)
                        : undefined
                }
            />

            <div
                className={cn(
                    'relative flex min-h-0 flex-1 overflow-hidden',
                    isFullscreen
                        ? 'grid grid-rows-2 lg:grid-cols-2 lg:grid-rows-1 lg:divide-x'
                        : enablePreview && variant === 'default'
                            ? 'grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x'
                            : 'flex flex-col',
                )}
                style={!isFullscreen && !enablePreview ? { minHeight } : undefined}
            >
                <div className="relative flex min-h-0 flex-1 flex-col">
                    <textarea
                        ref={textareaRef}
                        className="flex-1 resize-none bg-transparent p-4 font-mono text-sm leading-relaxed outline-none placeholder:text-muted-foreground/40 scrollbar-thin scrollbar-thumb-muted-foreground/20 focus:ring-0 sm:p-5"
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={disabled}
                        spellCheck={false}
                        style={{ minHeight: isFullscreen ? undefined : minHeight }}
                    />

                    {isDragging && (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm animate-in fade-in duration-200">
                            <UploadCloud className="h-10 w-10 animate-bounce text-primary" />
                            <p className="mt-2 text-sm font-medium text-primary">Drop files to upload</p>
                        </div>
                    )}

                    {onDrop && (
                        <div
                            className="absolute inset-0 z-10 hidden"
                        />
                    )}
                </div>

                {enablePreview && variant === 'default' && (
                    <div className={cn("flex min-h-0 flex-col bg-muted/5", !isFullscreen && "hidden md:flex")}>
                        <div className="flex flex-shrink-0 items-center justify-between border-b border-border/40 bg-muted/10 px-4 py-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Preview
                            </span>
                            <Monitor className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-muted-foreground/20 sm:p-5">
                            {value ? (
                                <MarkdownViewer content={value} />
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground/40 select-none">
                                    <Monitor className="h-12 w-12 opacity-10" />
                                    <p className="text-sm font-medium">Nothing to preview</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {footer}
        </div>
    );
}
