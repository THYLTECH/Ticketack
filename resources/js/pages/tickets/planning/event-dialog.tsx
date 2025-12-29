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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useInitials } from '@/hooks/use-initials';
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { TicketSchedule } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import {
    addMinutes,
    differenceInMinutes,
    format,
    formatDistanceToNow,
    parse,
    parseISO,
    set,
} from 'date-fns';
import {
    Calendar as CalendarIcon,
    CheckCircle,
    Clock,
    ExternalLink,
    Info,
    MessageCircle,
    Send,
    Trash2,
    User,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    event: TicketSchedule | null;
    isEditMode: boolean;
    onSave: (id: number, data: Record<string, string | number>) => void;
    onDelete: (id: number) => void;
}

export function EventDialog({
                                open,
                                onOpenChange,
                                event,
                                isEditMode,
                                onSave,
                                onDelete,
                            }: Props) {
    const __ = useTrans();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('09:00');
    const [activeTab, setActiveTab] = useState('planning');

    const [showConvertAlert, setShowConvertAlert] = useState(false);
    const [conversionNote, setConversionNote] = useState('');

    useEffect(() => {
        if (event) {
            const start = parseISO(event.start_date);
            const end = addMinutes(start, event.duration_minutes);

            setDate(start);
            setStartTime(format(start, 'HH:mm'));
            setEndTime(format(end, 'HH:mm'));
        }
    }, [event]);

    useEffect(() => {
        if (showConvertAlert) {
            setConversionNote('');
        }
    }, [showConvertAlert]);

    const getDuration = () => {
        if (!date) return 0;
        const start = parse(startTime, 'HH:mm', date);
        const end = parse(endTime, 'HH:mm', date);
        return differenceInMinutes(end, start);
    };

    const handleSave = () => {
        if (!event || !date) return;

        const [hours, minutes] = startTime.split(':').map(Number);
        const fullStartDate = set(date, { hours, minutes, seconds: 0 });
        const formattedStartDate = format(fullStartDate, 'yyyy-MM-dd HH:mm:ss');
        const duration = getDuration();

        if (duration <= 0) {
            toast.error(__('schedule.dialog.planning.error_end_time'));
            return;
        }

        onSave(event.id, {
            start_date: formattedStartDate,
            duration_minutes: duration,
        });
    };

    const executeConversion = () => {
        if (!event) return;

        router.post(
            route('tickets.planning.convert', event.id),
            {
                note: conversionNote
            },
            {
                onSuccess: () => {
                    toast.success(__('schedule.flash.validated'));
                    setShowConvertAlert(false);
                    onOpenChange(false);
                },
                onError: () => {
                    toast.error(__('schedule.flash.error'));
                },
            },
        );
    };

    if (!event) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="flex h-[80vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-[600px]"
                aria-describedby={undefined}
            >
                <DialogHeader className="flex shrink-0 flex-row items-start justify-between border-b bg-muted/10 p-6 pb-4">
                    <div className="w-full space-y-1.5 pr-8">
                        <div className="flex items-center gap-2">
                            <Badge
                                variant="outline"
                                className="bg-background font-mono text-xs text-muted-foreground"
                            >
                                #{event.ticket.id}
                            </Badge>
                            <Badge className="border-0 bg-primary/10 text-primary hover:bg-primary/20">
                                {event.ticket.category?.title ||
                                    __('schedule.defaults.intervention')}
                            </Badge>
                        </div>
                        <DialogTitle className="line-clamp-1 text-xl leading-snug font-semibold tracking-tight text-foreground">
                            {event.ticket.title}
                        </DialogTitle>
                        <DialogDescription className="line-clamp-1 text-xs text-muted-foreground">
                            {event.ticket.description ||
                                __('schedule.dialog.no_description')}
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="flex min-h-0 flex-1 flex-col overflow-hidden"
                >
                    <div className="shrink-0 px-6 pt-4">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="planning" className="gap-2">
                                <Clock className="h-4 w-4" />{' '}
                                {__('schedule.dialog.tabs.planning')}
                            </TabsTrigger>
                            <TabsTrigger value="comments" className="gap-2">
                                <MessageCircle className="h-4 w-4" />{' '}
                                {__('schedule.dialog.tabs.comments')}
                            </TabsTrigger>
                            <TabsTrigger value="details" className="gap-2">
                                <Info className="h-4 w-4" />{' '}
                                {__('schedule.dialog.tabs.infos')}
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="mt-2 flex min-h-0 flex-1 flex-col overflow-hidden">
                        <TabsContent
                            value="planning"
                            className="m-0 flex min-h-0 flex-1 flex-col overflow-hidden outline-none data-[state=inactive]:hidden"
                        >
                            <ScrollArea className="flex-1">
                                <div className="space-y-6 p-6">
                                    <div className="flex items-center gap-4 rounded-lg border bg-card p-3 shadow-sm">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                            <User className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                {__(
                                                    'schedule.dialog.planning.technician',
                                                )}
                                            </span>
                                            <span className="font-medium text-foreground">
                                                {event.user.name}
                                            </span>
                                        </div>
                                    </div>

                                    <Separator />

                                    {isEditMode ? (
                                        <div className="grid gap-5">
                                            <div className="grid gap-2">
                                                <Label>
                                                    {__(
                                                        'schedule.dialog.planning.intervention_date',
                                                    )}
                                                </Label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={'outline'}
                                                            className={cn(
                                                                'w-full justify-start text-left font-normal',
                                                                !date &&
                                                                'text-muted-foreground',
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {date ? (
                                                                format(
                                                                    date,
                                                                    'EEEE d MMMM yyyy',
                                                                )
                                                            ) : (
                                                                <span>
                                                                    {__(
                                                                        'schedule.dialog.planning.pick_date',
                                                                    )}
                                                                </span>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-auto p-0"
                                                        align="start"
                                                    >
                                                        <Calendar
                                                            mode="single"
                                                            selected={date}
                                                            onSelect={setDate}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>
                                                        {__(
                                                            'schedule.dialog.planning.start_time',
                                                        )}
                                                    </Label>
                                                    <Input
                                                        type="time"
                                                        value={startTime}
                                                        onChange={(e) =>
                                                            setStartTime(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="font-mono"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>
                                                        {__(
                                                            'schedule.dialog.planning.end_time',
                                                        )}
                                                    </Label>
                                                    <Input
                                                        type="time"
                                                        value={endTime}
                                                        onChange={(e) =>
                                                            setEndTime(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="font-mono"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end border-t pt-2">
                                                <p className="text-xs text-muted-foreground">
                                                    {__(
                                                        'schedule.dialog.planning.duration',
                                                    )}{' '}
                                                    :{' '}
                                                    <span className="font-bold text-foreground">
                                                        {getDuration()} min
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-4 rounded-lg border bg-muted/5 p-4">
                                            <div>
                                                <Label className="text-[10px] text-muted-foreground uppercase">
                                                    {__(
                                                        'schedule.dialog.planning.date_label',
                                                    )}
                                                </Label>
                                                <p className="mt-1 font-medium capitalize">
                                                    {format(
                                                        parseISO(
                                                            event.start_date,
                                                        ),
                                                        'EEEE d MMMM yyyy',
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <Label className="text-[10px] text-muted-foreground uppercase">
                                                    {__(
                                                        'schedule.dialog.planning.time_label',
                                                    )}
                                                </Label>
                                                <p className="mt-1 font-medium">
                                                    {format(
                                                        parseISO(
                                                            event.start_date,
                                                        ),
                                                        'HH:mm',
                                                    )}{' '}
                                                    -{' '}
                                                    {format(
                                                        parseISO(
                                                            event.end_date,
                                                        ),
                                                        'HH:mm',
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                            <div className="flex shrink-0 flex-col-reverse gap-3 border-t bg-muted/5 p-4 sm:flex-row sm:justify-between">
                                <div className="flex items-center gap-2">
                                    {isEditMode && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:bg-destructive/10"
                                            onClick={() =>
                                                confirm(
                                                    __(
                                                        'schedule.dialog.planning.confirm_delete',
                                                    ),
                                                ) && onDelete(event.id)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button
                                        variant="link"
                                        className="h-auto p-0 text-muted-foreground"
                                        onClick={() =>
                                            router.visit(
                                                route(
                                                    'tickets.show',
                                                    event.ticket_id,
                                                ),
                                            )
                                        }
                                    >
                                        <ExternalLink className="mr-2 h-3.5 w-3.5" />{' '}
                                        {__(
                                            'schedule.dialog.planning.open_ticket',
                                        )}
                                    </Button>
                                </div>
                                {isEditMode && (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                                            onClick={() =>
                                                setShowConvertAlert(true)
                                            }
                                        >
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            {__(
                                                'schedule.dialog.planning.validate',
                                            )}
                                        </Button>
                                        <Button onClick={handleSave}>
                                            {__(
                                                'schedule.dialog.planning.save',
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent
                            value="comments"
                            className="m-0 flex min-h-0 flex-1 flex-col overflow-hidden outline-none data-[state=inactive]:hidden"
                        >
                            <TicketComments
                                ticketId={event.ticket.id}
                                comments={event.ticket.comments || []}
                            />
                        </TabsContent>

                        <TabsContent
                            value="details"
                            className="m-0 flex min-h-0 flex-1 flex-col outline-none data-[state=inactive]:hidden"
                        >
                            <ScrollArea className="flex-1 p-6">
                                <div className="grid gap-4 rounded-lg border bg-card p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-xs text-muted-foreground">
                                                {__(
                                                    'schedule.dialog.details.priority',
                                                )}
                                            </Label>
                                            <div className="mt-1">
                                                <Badge
                                                    style={{
                                                        backgroundColor:
                                                        event.ticket
                                                            .priority
                                                            ?.color,
                                                    }}
                                                >
                                                    {
                                                        event.ticket.priority
                                                            ?.title
                                                    }
                                                </Badge>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-muted-foreground">
                                                {__(
                                                    'schedule.dialog.details.status',
                                                )}
                                            </Label>
                                            <p className="mt-1 text-sm font-medium">
                                                {event.ticket.status?.title}
                                            </p>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            {__(
                                                'schedule.dialog.details.description',
                                            )}
                                        </Label>
                                        <p className="mt-2 text-sm whitespace-pre-wrap text-muted-foreground">
                                            {event.ticket.description}
                                        </p>
                                    </div>
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </div>
                </Tabs>
            </DialogContent>

            <AlertDialog
                open={showConvertAlert}
                onOpenChange={setShowConvertAlert}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {__('schedule.dialog.conversion.title')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {__('schedule.dialog.conversion.description')}
                        </AlertDialogDescription>

                        <div className="grid gap-2 py-4">
                            <Label htmlFor="conversionNote">
                                {__('schedule.dialog.conversion.note_label')}
                            </Label>
                            <Textarea
                                id="conversionNote"
                                value={conversionNote}
                                onChange={(e) =>
                                    setConversionNote(e.target.value)
                                }
                                placeholder={__(
                                    'schedule.dialog.conversion.note_placeholder',
                                )}
                                className="resize-none"
                            />
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {__('schedule.dialog.conversion.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={executeConversion}
                            className="border-none bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                            {__(
                                'schedule.dialog.conversion.confirm_validate',
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Dialog>
    );
}

function TicketComments({
                            ticketId,
                            comments: initialComments,
                        }: {
    ticketId: number;
    comments: Array<{
        id: number;
        content: string;
        created_at: string;
        user: { id: number; name: string; profile_photo_url?: string };
    }>;
}) {
    const { auth } = usePage<{ auth: { user: { id: number; name: string } } }>()
        .props;
    const [localComments, setLocalComments] = useState(initialComments);
    const scrollRef = useRef<HTMLDivElement>(null);
    const getInitials = useInitials();
    const __ = useTrans();

    useEffect(() => {
        setLocalComments(initialComments);
    }, [ticketId, initialComments]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [localComments]);

    const { data, setData, post, processing, reset } = useForm({ content: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.content.trim()) return;
        post(route('tickets.comments.store', ticketId), {
            preserveScroll: true,
            onSuccess: () => {
                setLocalComments([
                    ...localComments,
                    {
                        id: Date.now(),
                        content: data.content,
                        created_at: new Date().toISOString(),
                        user: auth.user,
                    },
                ]);
                reset();
            },
        });
    };

    return (
        <div className="flex h-full min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto" ref={scrollRef}>
                <div className="flex flex-col gap-6 p-6">
                    {localComments.length === 0 ? (
                        <div className="py-10 text-center opacity-50">
                            <p className="text-sm">
                                {__('schedule.dialog.comment.no_messages')}
                            </p>
                        </div>
                    ) : (
                        localComments.map((comment) => {
                            const isMe = comment.user?.id === auth.user.id;
                            return (
                                <div
                                    key={comment.id}
                                    className={cn(
                                        'flex w-full gap-3',
                                        isMe ? 'flex-row-reverse' : 'flex-row',
                                    )}
                                >
                                    <Avatar className="h-8 w-8 shrink-0 border">
                                        <AvatarImage
                                            src={
                                                comment.user?.profile_photo_url
                                            }
                                        />
                                        <AvatarFallback className="text-[10px]">
                                            {getInitials(
                                                comment.user?.name || '?',
                                            )}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div
                                        className={cn(
                                            'flex max-w-[85%] flex-col',
                                            isMe ? 'items-end' : 'items-start',
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                'flex items-center gap-2 text-[10px] text-muted-foreground',
                                                isMe && 'flex-row-reverse',
                                            )}
                                        >
                                            <span className="font-semibold text-foreground">
                                                {isMe
                                                    ? __(
                                                        'schedule.dialog.comment.me',
                                                    )
                                                    : comment.user?.name}
                                            </span>
                                            <span>
                                                {formatDistanceToNow(
                                                    new Date(
                                                        comment.created_at,
                                                    ),
                                                    { addSuffix: true },
                                                )}
                                            </span>
                                        </div>
                                        <div
                                            className={cn(
                                                'mt-1 rounded-2xl px-4 py-2 text-sm break-words shadow-sm',
                                                isMe
                                                    ? 'rounded-tr-sm bg-primary text-primary-foreground'
                                                    : 'rounded-tl-sm border bg-muted text-foreground',
                                            )}
                                        >
                                            {comment.content}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <div className="shrink-0 border-t bg-background p-4">
                <form onSubmit={handleSubmit} className="flex items-end gap-2">
                    <Textarea
                        placeholder={__('schedule.dialog.comment.placeholder')}
                        className="h-[40px] max-h-[120px] min-h-[40px] resize-none rounded-3xl px-4 py-2 text-sm shadow-sm focus-visible:ring-1"
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        onKeyDown={(e) => {
                            return (
                                e.key === 'Enter' &&
                                !e.shiftKey &&
                                (e.preventDefault(), handleSubmit(e))
                            );
                        }}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={processing || !data.content.trim()}
                        className="h-10 w-10 shrink-0 rounded-full shadow-sm"
                    >
                        <Send className="ml-0.5 h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
