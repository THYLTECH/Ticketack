import { Button } from '@/components/ui/button';
import { useTrans } from '@/lib/translation';
import { cn, formatFileSize } from '@/lib/utils';
import {
    Check,
    Loader2,
    Paperclip,
    Send,
    X,
} from 'lucide-react';
import React, { useEffect } from 'react';
import { MarkdownEditor as SharedMarkdownEditor } from '@/components/markdown/markdown-editor';

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
    const [isDragging, setIsDragging] = React.useState(false);

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isEditing && onCancel) {
                onCancel();
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [isEditing, onCancel]);

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

    const editorFooter = (
        <div>
            {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 border-t border-border/40 bg-muted/10 p-2">
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
                        type="button"
                        onClick={() => onSubmit()}
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
        </div>
    );

    return (
        <div
            className="sticky bottom-0 z-10 bg-background"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDropInternal}
        >
            <SharedMarkdownEditor
                value={content}
                onChange={setContent}
                placeholder={
                    isEditing
                        ? __('tickets.pages.show.comments.editor.placeholder_edit')
                        : __('tickets.pages.show.comments.editor.placeholder')
                }
                disabled={processing}
                minHeight="100px"
                variant="minimal"
                enablePreview={false}
                isDragging={isDragging}
                onDrop={handleDropInternal}
                footer={editorFooter}
                onSubmit={() => onSubmit()}
                className={isEditing
                    ? 'rounded-b-xl border-t-0 border-primary/40 ring-1 ring-primary/10'
                    : 'rounded-xl border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary hover:border-primary/50'
                }
            />
        </div>
    );
}
