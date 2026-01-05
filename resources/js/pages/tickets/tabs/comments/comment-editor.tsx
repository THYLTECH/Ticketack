import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTrans } from '@/lib/translation';
import { cn, formatFileSize } from '@/lib/utils';
import {
    Bold,
    Check,
    Code,
    Italic,
    Link2,
    List,
    ListOrdered,
    Loader2,
    Paperclip,
    Quote,
    Send,
    UploadCloud,
    X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface CommentEditorProps {
    content: string;
    setContent: (v: string) => void;
    attachments: File[];
    onRemoveAttachment: (index: number) => void;
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDrop: (e: React.DragEvent) => void;
    onSubmit: (e?: React.FormEvent) => void;
    processing: boolean;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    isEditing?: boolean;
    onCancel?: () => void;
}

export function CommentEditor({
    content,
    setContent,
    attachments,
    onRemoveAttachment,
    onFileSelect,
    onDrop,
    onSubmit,
    processing,
    fileInputRef,
    isEditing = false,
    onCancel,
}: CommentEditorProps) {
    const __ = useTrans();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isEditing && onCancel) {
                onCancel();
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [isEditing, onCancel]);

    const insertFormatting = (prefix: string, suffix: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = content.substring(0, start);
        const selection = content.substring(start, end);
        const after = content.substring(end);

        const newText = before + prefix + selection + suffix + after;
        setContent(newText);

        setTimeout(() => {
            textarea.focus();
            if (selection.length === 0) {
                const newPos = start + prefix.length;
                textarea.setSelectionRange(newPos, newPos);
            } else {
                const newEnd = end + prefix.length + suffix.length;
                textarea.setSelectionRange(start, newEnd);
            }
        }, 0);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            onSubmit();
        }
        if (e.key === 'Escape' && isEditing && onCancel) {
            e.preventDefault();
            onCancel();
        }
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) setIsDragging(true);
    };

    const handleDropInternal = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onDrop(e);
        }
    };

    return (
        <div className="sticky bottom-0 z-10 bg-background">
            <form
                onSubmit={onSubmit}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDropInternal}
                className={cn(
                    'group relative flex flex-col overflow-hidden border shadow-md transition-all duration-200',
                    isDragging
                        ? 'border-primary ring-2 ring-primary/20'
                        : isEditing
                          ? 'rounded-b-xl border-t-0 border-primary/40 ring-1 ring-primary/10'
                          : 'rounded-xl border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary hover:border-primary/50',
                )}
            >
                {isDragging && (
                    <div className="absolute inset-0 z-50 flex animate-in flex-col items-center justify-center bg-background/95 backdrop-blur-sm duration-200 fade-in">
                        <UploadCloud className="h-10 w-10 animate-bounce text-primary" />
                        <p className="text-sm font-medium text-primary">
                            {__(
                                'tickets.pages.show.comments.editor.drop_files',
                            )}
                        </p>
                    </div>
                )}

                <div className="flex items-center gap-0.5 border-b border-border/40 bg-muted/30 px-2 py-1.5">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded"
                        onClick={() => insertFormatting('**', '**')}
                        title={__(
                            'tickets.pages.show.comments.editor.formatting.bold',
                        )}
                    >
                        <Bold className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded"
                        onClick={() => insertFormatting('*', '*')}
                        title={__(
                            'tickets.pages.show.comments.editor.formatting.italic',
                        )}
                    >
                        <Italic className="h-3.5 w-3.5" />
                    </Button>
                    <div className="mx-1 h-4 w-px bg-border/40" />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded"
                        onClick={() => insertFormatting('`', '`')}
                        title={__(
                            'tickets.pages.show.comments.editor.formatting.code',
                        )}
                    >
                        <Code className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded"
                        onClick={() => insertFormatting('\n> ', '')}
                        title={__(
                            'tickets.pages.show.comments.editor.formatting.quote',
                        )}
                    >
                        <Quote className="h-3.5 w-3.5" />
                    </Button>
                    <div className="mx-1 h-4 w-px bg-border/40" />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded"
                        onClick={() => insertFormatting('[', '](url)')}
                        title={__(
                            'tickets.pages.show.comments.editor.formatting.link',
                        )}
                    >
                        <Link2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded"
                        onClick={() => insertFormatting('\n- ', '')}
                        title={__(
                            'tickets.pages.show.comments.editor.formatting.list',
                        )}
                    >
                        <List className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded"
                        onClick={() => insertFormatting('\n1. ', '')}
                        title={__(
                            'tickets.pages.show.comments.editor.formatting.ordered_list',
                        )}
                    >
                        <ListOrdered className="h-3.5 w-3.5" />
                    </Button>
                </div>

                {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 border-b border-border/40 bg-muted/10 p-2">
                        {attachments.map((file, index) => (
                            <div
                                key={index}
                                className="relative flex items-center gap-2 rounded-md border bg-background py-1 pr-6 pl-2 text-xs shadow-sm"
                            >
                                <span className="max-w-[100px] truncate">
                                    {file.name}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                    {formatFileSize(file.size)}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => onRemoveAttachment(index)}
                                    className="absolute right-1 rounded-full p-0.5 hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <Textarea
                    ref={textareaRef}
                    placeholder={
                        isEditing
                            ? __(
                                  'tickets.pages.show.comments.editor.placeholder_edit',
                              )
                            : __(
                                  'tickets.pages.show.comments.editor.placeholder',
                              )
                    }
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="min-h-[100px] w-full resize-y border-none bg-transparent px-4 py-3 text-sm shadow-none focus-visible:ring-0"
                    disabled={processing}
                />

                <div className="flex items-center justify-between border-t bg-muted/10 px-3 py-2">
                    <div className="flex items-center gap-2">
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            ref={fileInputRef}
                            onChange={onFileSelect}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-2 px-2 text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Paperclip className="h-3.5 w-3.5" />
                            <span>
                                {__(
                                    'tickets.pages.show.comments.editor.attach_files',
                                )}
                            </span>
                        </Button>
                    </div>

                    <div className="flex items-center gap-3">
                        {isEditing && (
                            <span className="hidden text-[10px] text-muted-foreground italic sm:inline-block">
                                {__(
                                    'tickets.pages.show.comments.editor.esc_to_cancel',
                                )}
                            </span>
                        )}
                        <Button
                            size="sm"
                            type="submit"
                            disabled={
                                processing ||
                                (!content.trim() && attachments.length === 0)
                            }
                            className={cn(
                                'h-8 gap-2 rounded-lg px-4 transition-all',
                                content.trim() || attachments.length > 0
                                    ? 'opacity-100'
                                    : 'opacity-50',
                            )}
                        >
                            {processing ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : isEditing ? (
                                <Check className="h-3.5 w-3.5" />
                            ) : (
                                <Send className="h-3.5 w-3.5" />
                            )}
                            <span>
                                {isEditing
                                    ? __(
                                          'tickets.pages.show.comments.editor.save',
                                      )
                                    : __(
                                          'tickets.pages.show.comments.editor.submit',
                                      )}
                            </span>
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
