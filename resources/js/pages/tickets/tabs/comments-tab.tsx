import { TabsContent } from '@/components/ui/tabs';
import { useTrans } from '@/lib/translation';
import { SharedData, Ticket, TicketComment } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import { echo } from '@laravel/echo-react';
import { X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { CommentEditor } from './comments/comment-editor';
import { CommentList } from './comments/comment-list';
import { ImageModal } from './comments/image-modal';

interface Props {
    ticket: Ticket;
}

export function CommentsTab({ ticket }: Props) {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [localContent, setLocalContent] = useState('');
    const [editingComment, setEditingComment] = useState<TicketComment | null>(
        null,
    );
    const [localComments, setLocalComments] = useState<TicketComment[]>(
        ticket.comments,
    );

    useEffect(() => {
        setLocalComments(ticket.comments);
    }, [ticket.comments]);

    useEffect(() => {
        const echoInstance = echo();
        const channel = echoInstance.private(`ticket.${ticket.id}`);

        channel.listen('CommentPosted', (e: { comment: TicketComment }) => {
            setLocalComments((prev) => {
                if (prev.some((c) => c.id === e.comment.id)) {
                    return prev.map((c) =>
                        c.id === e.comment.id ? e.comment : c,
                    );
                }
                return [...prev, e.comment];
            });
        });

        return () => {
            echoInstance.leave(`ticket.${ticket.id}`);
        };
    }, [ticket.id]);

    const { data, setData, processing, post, reset } = useForm<{
        content: string;
        attachments: File[];
    }>({
        content: '',
        attachments: [],
    });

    useEffect(() => {
        setData('content', localContent);
    }, [localContent, setData]);

    const handleFiles = (files: File[]) => {
        setData('attachments', [...data.attachments, ...files]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) handleFiles(Array.from(e.target.files));
    };

    const handleDrop = (e: React.DragEvent) => {
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(Array.from(e.dataTransfer.files));
            toast.success(
                __('tickets.pages.show.comments.files_added').replace(
                    ':count',
                    e.dataTransfer.files.length.toString(),
                ),
            );
        }
    };

    const removeAttachment = (index: number) => {
        setData(
            'attachments',
            data.attachments.filter((_, i) => i !== index),
        );
    };

    const startEditing = (comment: TicketComment) => {
        setEditingComment(comment);
        setLocalContent(comment.content);
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth',
        });
    };

    const cancelEditing = useCallback(() => {
        setEditingComment(null);
        setLocalContent('');
        reset('attachments');
    }, [reset]);

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const contentToSend = localContent.trim();
        if (!contentToSend && data.attachments.length === 0) return;

        if (editingComment) {
            router.post(
                route('tickets.comments.update', {
                    ticket: ticket.id,
                    comment: editingComment.id,
                }),
                {
                    _method: 'PUT',
                    content: contentToSend,
                    attachments: data.attachments,
                },
                {
                    forceFormData: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        cancelEditing();
                        toast.success(
                            __(
                                'tickets.pages.show.comments.notifications.updated',
                            ),
                        );
                    },
                    onError: () =>
                        toast.error(
                            __(
                                'tickets.pages.show.comments.notifications.error',
                            ),
                        ),
                },
            );
        } else {
            post(route('tickets.comments.store', { ticket: ticket.id }), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setLocalContent('');
                    toast.success(
                        __('tickets.pages.show.comments.notifications.sent'),
                    );
                },
            });
        }
    };

    return (
        <TabsContent
            value="comments"
            className="flex h-[calc(100vh-16rem)] min-h-[500px] flex-col gap-4"
        >
            <div data-onboarding="comments-area" className="flex flex-col gap-4">
                <CommentList
                    comments={localComments}
                    currentUserId={auth.user.id}
                    onImageClick={setPreviewImage}
                    ticketId={ticket.id}
                    onEdit={startEditing}
                    editingId={editingComment?.id}
                />

                <div className="relative" data-onboarding="comment-editor">
                    {editingComment && (
                        <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-primary/30 bg-primary/5 px-4 py-2 transition-all">
                            <div className="flex items-center gap-2 text-xs font-medium text-primary">
                                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                                {__('tickets.pages.show.comments.editor.edit_mode')}
                            </div>
                            <button
                                onClick={cancelEditing}
                                className="flex items-center gap-1 text-[10px] tracking-wider text-muted-foreground uppercase hover:text-foreground"
                            >
                                <X className="h-3 w-3" />
                                {__(
                                    'tickets.pages.show.comments.editor.cancel_edit',
                                )}
                            </button>
                        </div>
                    )}
                    <CommentEditor
                        content={localContent}
                        setContent={setLocalContent}
                        attachments={data.attachments}
                        onRemoveAttachment={removeAttachment}
                        onFileSelect={handleFileSelect}
                        onDrop={handleDrop}
                        onSubmit={handleSubmit}
                        processing={processing}
                        fileInputRef={fileInputRef}
                        isEditing={!!editingComment}
                        onCancel={cancelEditing}
                    />
                </div>
            </div>

            <ImageModal
                src={previewImage}
                isOpen={!!previewImage}
                onClose={() => setPreviewImage(null)}
            />
        </TabsContent>
    );
}
