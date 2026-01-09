import { SortableTableHead } from '@/components/sortable-table-head';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { TicketEntry } from '@/types';
import { Link, router } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
    Check,
    Clock,
    ExternalLink,
    FileText,
    Tag,
    Timer,
    Trash2,
    User,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    entries: TicketEntry[];
    showTicketColumn?: boolean;
}

type SortField = 'start_at' | 'duration_seconds' | 'created_at';
type SortDirection = 'asc' | 'desc';

export function EntriesTable({ entries, showTicketColumn = true }: Props) {
    const __ = useTrans();
    const [entryToDelete, setEntryToDelete] = useState<number | null>(null);
    const [previewEntry, setPreviewEntry] = useState<TicketEntry | null>(null);

    const [sortField, setSortField] = useState<SortField>('start_at');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const handleSort = (field: string) => {
        const newDirection =
            sortField === field && sortDirection === 'desc' ? 'asc' : 'desc';
        setSortField(field as SortField);
        setSortDirection(newDirection);

        const params = new URLSearchParams(window.location.search);
        params.set('sort', field);
        params.set('direction', newDirection);
        router.get(
            `${window.location.pathname}?${params.toString()}`,
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const confirmDelete = () => {
        if (!entryToDelete) return;
        router.delete(route('tickets.entries.destroy', entryToDelete), {
            onSuccess: () => {
                toast.success(__('entries.table.toast.deleted'));
                setEntryToDelete(null);
            },
            onError: () => toast.error(__('entries.table.toast.delete_error')),
        });
    };

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return (
            <span className="font-mono text-[13px] tracking-tight tabular-nums">
                {h > 0 && (
                    <span className="font-semibold text-foreground">{h}h </span>
                )}
                <span
                    className={cn(
                        h > 0
                            ? 'text-muted-foreground'
                            : 'font-semibold text-foreground',
                    )}
                >
                    {m.toString().padStart(2, '0')}m
                </span>
            </span>
        );
    };

    if (entries.length === 0) {
        return (
            <div className="flex min-h-100 flex-col items-center justify-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 ring-1 ring-border">
                    <Timer className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">
                        {__('entries.table.empty.title')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {__('entries.table.empty.description')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full overflow-hidden rounded-lg border bg-background shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent">
                            <SortableTableHead
                                label={__('entries.table.headers.date')}
                                column="start_at"
                                currentSort={sortField}
                                currentDirection={sortDirection}
                                onSort={handleSort}
                                className="w-37.5 pl-6"
                            />
                            {showTicketColumn && (
                                <TableHead className="w-[320px]">
                                    {__('entries.table.headers.ticket_context')}
                                </TableHead>
                            )}
                            <SortableTableHead
                                label={__('entries.table.headers.duration')}
                                column="duration_seconds"
                                currentSort={sortField}
                                currentDirection={sortDirection}
                                onSort={handleSort}
                                className="w-30"
                            />
                            <TableHead className="min-w-50">
                                {__('entries.table.headers.description')}
                            </TableHead>
                            <TableHead className="w-25">
                                {__('entries.table.headers.billable')}
                            </TableHead>
                            <TableHead className="w-15"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {entries.map((entry) => (
                            <TableRow
                                key={entry.id}
                                className="group h-16 transition-all hover:bg-muted/40"
                            >
                                <TableCell className="pl-6 align-middle">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-foreground tabular-nums">
                                            {format(
                                                parseISO(entry.start_at),
                                                'dd MMM yyyy',
                                                { locale: fr },
                                            )}
                                        </span>
                                        <span className="font-mono text-xs text-muted-foreground">
                                            {format(
                                                parseISO(entry.start_at),
                                                'HH:mm',
                                            )}
                                        </span>
                                    </div>
                                </TableCell>

                                {showTicketColumn && (
                                    <TableCell className="align-middle">
                                        <div className="flex flex-col items-start gap-1.5">
                                            <button
                                                onClick={() =>
                                                    setPreviewEntry(entry)
                                                }
                                                className="group/link flex max-w-70 flex-col items-start gap-0.5 rounded-md text-left transition-colors focus:outline-none"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="truncate text-sm font-semibold text-foreground decoration-primary/50 underline-offset-4 group-hover/link:text-primary group-hover/link:underline">
                                                        {entry.ticket?.title}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                                    <Badge
                                                        variant="outline"
                                                        className="h-5 rounded-sm border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground"
                                                    >
                                                        ID {entry.ticket_id}
                                                    </Badge>

                                                    {entry.ticket?.status && (
                                                        <div className="flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5">
                                                            <div
                                                                className="h-1.5 w-1.5 rounded-full"
                                                                style={{
                                                                    backgroundColor:
                                                                        entry
                                                                            .ticket
                                                                            .status
                                                                            .color,
                                                                }}
                                                            />
                                                            <span className="font-medium">
                                                                {
                                                                    entry.ticket
                                                                        .status
                                                                        .title
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        </div>
                                    </TableCell>
                                )}

                                <TableCell className="align-middle">
                                    <div className="flex w-fit items-center gap-2 rounded-md border border-transparent bg-muted/40 px-2.5 py-1 transition-colors group-hover:border-border/60 group-hover:bg-background">
                                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                        {formatDuration(entry.duration_seconds)}
                                    </div>
                                </TableCell>

                                <TableCell className="align-middle">
                                    {entry.note ? (
                                        <TooltipProvider>
                                            <Tooltip delayDuration={200}>
                                                <TooltipTrigger asChild>
                                                    <div className="flex max-w-75 cursor-default items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                                                        <FileText className="h-3.5 w-3.5 shrink-0 opacity-50" />
                                                        <span className="truncate">
                                                            {entry.note}
                                                        </span>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-xs p-3 text-xs">
                                                    {entry.note}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ) : (
                                        <span className="text-sm text-muted-foreground/20">
                                            —
                                        </span>
                                    )}
                                </TableCell>

                                <TableCell className="align-middle">
                                    {entry.billable ? (
                                        <Badge
                                            variant="outline"
                                            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400"
                                        >
                                            <Check className="mr-1 h-3 w-3" />
                                            {__('entries.table.badges.yes')}
                                        </Badge>
                                    ) : (
                                        <Badge
                                            variant="outline"
                                            className="border-border text-muted-foreground hover:bg-muted/50"
                                        >
                                            <X className="mr-1 h-3 w-3" />
                                            {__('entries.table.badges.no')}
                                        </Badge>
                                    )}
                                </TableCell>

                                <TableCell className="pr-4 text-right align-middle">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground/60 transition-all group-hover:text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus:opacity-100"
                                        onClick={() =>
                                            setEntryToDelete(entry.id)
                                        }
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">
                                            {__('entries.table.actions.delete')}
                                        </span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog
                open={!!entryToDelete}
                onOpenChange={(open) => !open && setEntryToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader className="space-y-3">
                        <AlertDialogTitle>
                            {__('entries.table.dialog.delete.title')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {__('entries.table.dialog.delete.description')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel>
                            {__('entries.table.dialog.delete.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >
                            {__('entries.table.dialog.delete.confirm')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog
                open={!!previewEntry}
                onOpenChange={(open) => !open && setPreviewEntry(null)}
            >
                <DialogContent className="sm:max-w-125">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <Badge
                                variant="outline"
                                className="bg-background text-muted-foreground"
                            >
                                ID {previewEntry?.ticket?.id}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                                •
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {previewEntry?.start_at &&
                                    format(
                                        parseISO(previewEntry.start_at),
                                        'dd MMMM yyyy',
                                        { locale: fr },
                                    )}
                            </span>
                        </div>
                        <DialogTitle className="pt-2 text-xl leading-snug">
                            {previewEntry?.ticket?.title}
                        </DialogTitle>
                        <DialogDescription className="hidden">
                            Détail
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        <div className="rounded-lg border bg-muted/10 p-4">
                            <div className="mb-2 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                <h4 className="text-sm font-semibold">
                                    {__(
                                        'entries.table.dialog.preview.work_description',
                                    )}
                                </h4>
                            </div>
                            <p className="text-sm leading-relaxed text-foreground/90">
                                {previewEntry?.note || (
                                    <span className="text-muted-foreground italic">
                                        {__(
                                            'entries.table.dialog.preview.no_note',
                                        )}
                                    </span>
                                )}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                    {__(
                                        'entries.table.dialog.preview.technician',
                                    )}
                                </span>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                                        <User className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    {previewEntry?.user?.name ||
                                        __(
                                            'entries.table.dialog.preview.unknown',
                                        )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                    {__(
                                        'entries.table.dialog.preview.duration_billing',
                                    )}
                                </span>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <Badge
                                        variant="secondary"
                                        className="font-mono"
                                    >
                                        {previewEntry &&
                                            formatDuration(
                                                previewEntry.duration_seconds,
                                            )}
                                    </Badge>
                                    {previewEntry?.billable ? (
                                        <span className="text-xs text-emerald-600">
                                            {__(
                                                'entries.table.dialog.preview.billable',
                                            )}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">
                                            {__(
                                                'entries.table.dialog.preview.not_billable',
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                    {__(
                                        'entries.table.dialog.preview.category',
                                    )}
                                </span>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                                    {previewEntry?.ticket?.category?.title ||
                                        __(
                                            'entries.table.dialog.preview.uncategorized',
                                        )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                    {__(
                                        'entries.table.dialog.preview.status_priority',
                                    )}
                                </span>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    {previewEntry?.ticket?.status && (
                                        <Badge
                                            className="border-none text-white hover:opacity-90"
                                            style={{
                                                backgroundColor:
                                                    previewEntry.ticket.status
                                                        .color,
                                            }}
                                        >
                                            {previewEntry.ticket.status.title}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:justify-between">
                        <Button
                            variant="ghost"
                            onClick={() => setPreviewEntry(null)}
                        >
                            {__('entries.table.dialog.preview.close')}
                        </Button>
                        <Button asChild className="gap-2 shadow-sm">
                            <Link
                                href={
                                    previewEntry?.ticket
                                        ? route(
                                              'tickets.show',
                                              previewEntry.ticket.id,
                                          )
                                        : '#'
                                }
                            >
                                <ExternalLink className="h-4 w-4" />
                                {__(
                                    'entries.table.dialog.preview.go_to_ticket',
                                )}
                            </Link>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
