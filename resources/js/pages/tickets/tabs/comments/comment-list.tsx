import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import { useTrans } from '@/lib/translation';
import { cn, formatFileSize } from '@/lib/utils';
import { TicketComment } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import {
    ArrowDown,
    Download,
    FileIcon,
    MessageSquareDashed,
    MoreHorizontal,
    Pencil,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { MarkdownViewer } from '@/components/markdown/markdown-viewer';

interface CommentListProps {
    comments: TicketComment[];
    currentUserId: number;
    onImageClick: (url: string) => void;
    ticketId: number;
    onEdit: (comment: TicketComment) => void;
    editingId?: number | null;
}

export function CommentList({
    comments,
    currentUserId,
    onImageClick,
    ticketId,
    onEdit,
    editingId,
}: CommentListProps) {
    const __ = useTrans();
    const getInitials = useInitials();
    const scrollRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const [isAtBottom, setIsAtBottom] = useState(true);
    const [showNewMessageToast, setShowNewMessageToast] = useState(false);
    const prevCommentsLengthRef = useRef(comments.length);

    const [deleteId, setDeleteId] = useState<number | null>(null);

    const { delete: destroy } = useForm({});

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const isBottom = scrollHeight - scrollTop - clientHeight < 100;
        setIsAtBottom(isBottom);
        if (isBottom) setShowNewMessageToast(false);
    };

    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        bottomRef.current?.scrollIntoView({ behavior });
        setShowNewMessageToast(false);
    };

    useEffect(() => {
        setTimeout(() => scrollToBottom('auto'), 50);
    }, []);

    useEffect(() => {
        if (comments.length > prevCommentsLengthRef.current) {
            if (isAtBottom) {
                setTimeout(() => scrollToBottom('smooth'), 100);
            } else {
                setShowNewMessageToast(true);
            }
        }
        prevCommentsLengthRef.current = comments.length;
    }, [comments.length, isAtBottom]);

    const confirmDelete = () => {
        if (!deleteId) return;
        destroy(
            route('tickets.comments.destroy', {
                ticket: ticketId,
                comment: deleteId,
            }),
            {
                onSuccess: () => {
                    setDeleteId(null);
                    toast.success(
                        __('tickets.pages.show.comments.notifications.deleted'),
                    );
                },
                preserveScroll: true,
            },
        );
    };

    const removeExistingAttachment = (attachmentId: number) => {
        router.delete(
            route('attachments.destroy', { attachment: attachmentId }),
            {
                onSuccess: () => {
                    toast.success(
                        __(
                            'tickets.pages.show.comments.notifications.attachment_deleted',
                        ),
                    );
                },
                preserveScroll: true,
                only: ['ticket'],
            },
        );
    };


    if (comments.length === 0) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-border/40 bg-muted/5 py-20 text-center opacity-60">
                <MessageSquareDashed className="h-12 w-12 text-muted-foreground/30" />
                <h3 className="mt-4 text-base font-semibold">
                    {__('tickets.pages.show.comments.empty_title')}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {__('tickets.pages.show.comments.empty_description')}
                </p>
            </div>
        );
    }

    return (
        <div className="relative flex-1 overflow-hidden rounded-lg border border-border/40 bg-muted/5">
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border h-full w-full overflow-y-auto p-4"
            >
                <div className="space-y-8">
                    {comments.map((comment) => {
                        const isMe = comment.user.id === currentUserId;
                        const isBeingEdited = editingId === comment.id;

                        return (
                            <div
                                key={comment.id}
                                className={cn(
                                    'flex w-full animate-in gap-4 duration-300 fade-in slide-in-from-bottom-2',
                                    isMe ? 'flex-row-reverse' : 'flex-row',
                                    isBeingEdited && 'opacity-60',
                                )}
                            >
                                <Avatar className="mt-1 h-9 w-9 shrink-0 border shadow-sm">
                                    <AvatarImage
                                        src={
                                            comment.user.avatar?.url ||
                                            undefined
                                        }
                                        className="object-cover"
                                    />
                                    <AvatarFallback
                                        className={cn(
                                            'text-[10px] font-bold',
                                            isMe
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground',
                                        )}
                                    >
                                        {getInitials(comment.user.name)}
                                    </AvatarFallback>
                                </Avatar>

                                <div
                                    className={cn(
                                        'group relative flex max-w-[85%] flex-col gap-1',
                                        isMe ? 'items-end' : 'items-start',
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'flex items-center gap-2 px-1',
                                            isMe
                                                ? 'flex-row-reverse'
                                                : 'flex-row',
                                        )}
                                    >
                                        <span className="text-sm font-semibold text-foreground">
                                            {comment.user.name}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {formatDistanceToNow(
                                                parseISO(comment.created_at),
                                                {
                                                    addSuffix: true,
                                                    locale: enUS,
                                                },
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {isMe && !isBeingEdited && (
                                            <div className="shrink-0">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align={
                                                            isMe
                                                                ? 'start'
                                                                : 'end'
                                                        }
                                                        className="w-32"
                                                    >
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                onEdit(comment)
                                                            }
                                                            className="cursor-pointer gap-2"
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />{' '}
                                                            {__(
                                                                'tickets.pages.show.comments.actions.edit',
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                setDeleteId(
                                                                    comment.id,
                                                                )
                                                            }
                                                            className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />{' '}
                                                            {__(
                                                                'tickets.pages.show.comments.actions.delete',
                                                            )}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        )}

                                        {comment.content && (
                                            <div
                                                className={cn(
                                                    'relative min-w-20 rounded-2xl border px-5 py-3 text-sm shadow-sm transition-all',
                                                    isMe
                                                        ? 'rounded-tr-none border-primary bg-primary text-primary-foreground'
                                                        : 'rounded-tl-none border-border/60 bg-card text-card-foreground',
                                                    isBeingEdited &&
                                                    'ring-2 ring-primary ring-offset-2',
                                                )}
                                            >
                                                <MarkdownViewer
                                                    content={comment.content}
                                                    proseClass={cn(
                                                        'prose-sm max-w-none leading-relaxed wrap-break-word',
                                                        isMe
                                                            ? 'prose-invert'
                                                            : 'dark:prose-invert'
                                                    )}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {comment.attachments &&
                                        comment.attachments.length > 0 && (
                                            <div
                                                className={cn(
                                                    'mt-1 flex flex-wrap gap-2',
                                                    isMe
                                                        ? 'justify-end'
                                                        : 'justify-start',
                                                )}
                                            >
                                                {comment.attachments.map(
                                                    (att) => {
                                                        const isImage =
                                                            att.mime_type?.startsWith(
                                                                'image/',
                                                            );
                                                        const fileUrl = `/storage/${att.file_path}`;

                                                        return (
                                                            <div
                                                                key={att.id}
                                                                className="group/att relative"
                                                            >
                                                                {isImage ? (
                                                                    <div
                                                                        className="relative cursor-zoom-in overflow-hidden rounded-lg border shadow-sm transition-all hover:ring-2 hover:ring-primary/50"
                                                                        onClick={() =>
                                                                            onImageClick(
                                                                                fileUrl,
                                                                            )
                                                                        }
                                                                    >
                                                                        <img
                                                                            src={
                                                                                fileUrl
                                                                            }
                                                                            alt={
                                                                                att.file_name
                                                                            }
                                                                            className="h-32 w-32 object-cover"
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-2 rounded-md border bg-card p-2 text-xs shadow-sm hover:bg-accent/50">
                                                                        <FileIcon className="h-4 w-4 text-primary" />
                                                                        <div className="flex flex-col overflow-hidden">
                                                                            <span className="max-w-30 truncate font-medium">
                                                                                {
                                                                                    att.file_name
                                                                                }
                                                                            </span>
                                                                            <span className="text-[9px] text-muted-foreground">
                                                                                {formatFileSize(
                                                                                    att.file_size ||
                                                                                    0,
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                        <a
                                                                            href={
                                                                                fileUrl
                                                                            }
                                                                            download
                                                                            className="text-muted-foreground hover:text-foreground"
                                                                        >
                                                                            <Download className="h-3.5 w-3.5" />
                                                                        </a>
                                                                    </div>
                                                                )}
                                                                {isBeingEdited && (
                                                                    <button
                                                                        onClick={() =>
                                                                            removeExistingAttachment(
                                                                                att.id,
                                                                            )
                                                                        }
                                                                        className="absolute -top-1 -right-1 z-20 rounded-full bg-destructive p-0.5 text-white shadow-md transition-transform hover:scale-110"
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        )}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={bottomRef} className="h-1" />
                </div>
            </div>

            {showNewMessageToast && (
                <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2">
                    <Button
                        onClick={() => scrollToBottom('smooth')}
                        size="sm"
                        className="h-8 animate-in gap-2 rounded-full bg-primary text-primary-foreground shadow-lg fade-in slide-in-from-bottom-2 hover:opacity-90"
                    >
                        <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
                        <span>
                            {__('tickets.pages.show.comments.new_messages')}
                        </span>
                    </Button>
                </div>
            )}

            <AlertDialog
                open={!!deleteId}
                onOpenChange={() => setDeleteId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {__(
                                'tickets.pages.show.comments.delete_modal.title',
                            )}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {__(
                                'tickets.pages.show.comments.delete_modal.description',
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {__(
                                'tickets.pages.show.comments.delete_modal.cancel',
                            )}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {__(
                                'tickets.pages.show.comments.delete_modal.confirm',
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
