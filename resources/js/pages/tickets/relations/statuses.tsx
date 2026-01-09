// resources/js/pages/tickets/relations/statuses.tsx

// Necessary imports
import { cn } from '@/lib/utils';
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type UniqueIdentifier,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useForm } from '@inertiajs/react';
import * as React from 'react';

// Utils
import { renderTicketStatus } from '@/lib/render';

// Shadnc UI Components
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

// Custom Components
import { ColorPicker } from '@/components/ui/color-picker';

// Types
import { TicketStatus } from '@/types';

// Icons
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { GripVertical, Pen, Plus, Save, Trash2 } from 'lucide-react';
import { useTrans } from '@/lib/translation';

interface StatusesSheetProps {
    children: React.ReactNode;
    statuses: TicketStatus[];
}

export function StatusesSheet({ children, statuses }: StatusesSheetProps) {
    const [sheetOpen, setSheetOpen] = React.useState(false);

    const __ = useTrans();

    const { data, setData, processing, patch } = useForm<{
        statuses: TicketStatus[];
    }>({
        statuses: statuses,
    });

    const dataIds = React.useMemo<UniqueIdentifier[]>(
        () => data.statuses.map(({ id }) => id),
        [data.statuses],
    );

    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {}),
    );

    // -------------------------------------
    // Dialog
    // -------------------------------------

    interface StatusesDialogProps {
        status?: TicketStatus;
        children: React.ReactNode;
    }

    function calculateProgress(sort_order: number, totalStatuses: number): number {
        return ((sort_order + 1) / (totalStatuses + 1)) * 100;
    }

    function StatusesDialog({ status, children }: StatusesDialogProps) {
        const [open, setOpen] = React.useState(false);

        const [title, setTitle] = React.useState(status ? status.title : '');
        const [description, setDescription] = React.useState(
            status ? status.description : '',
        );
        const [color, setColor] = React.useState<string | null>(
            status ? status.color : null,
        );

        const [isDefault, setIsDefault] = React.useState(
            status ? status.is_default : false,
        );
        const [isClosed, setIsClosed] = React.useState(
            status ? status.is_closed : false,
        );

        const [errors, setErrors] = React.useState<{
            title?: string;
            description?: string;
            color?: string;
            icon?: string;
        }>({});

        function handleSuccess() {
            setTitle('');
            setDescription('');
            setColor(null);
            setIsDefault(false);
            setIsClosed(false);
            setOpen(false);
        }



        function handleSubmit(e: React.FormEvent) {
            e.stopPropagation();
            e.preventDefault();

            // Error verification (omitted for brevity)
            if (title.trim() === '' || !color) {
                setErrors({
                    title:
                        title.trim() === '' ? __('tickets.pages.relations.statuses.validation.title_required') : undefined,
                    color: !color ? __('tickets.pages.relations.statuses.validation.color_required') : undefined,
                });
                return;
            }
            setErrors({});

            // Nouvelle logique de mise à jour
            let statusesToUpdate = [...data.statuses];

            if (isDefault) {
                statusesToUpdate = statusesToUpdate.map((s) => ({
                    ...s,
                    is_default: false,
                }));
            }

            if (isClosed) {
                statusesToUpdate = statusesToUpdate.map((s) => ({
                    ...s,
                    is_closed: false,
                }));
            }

            if (status) {
                statusesToUpdate = statusesToUpdate.map((s) =>
                    s.id === status.id
                        ? {
                              ...s,
                              title: title,
                              description: description,
                              color: color,
                              is_default: isDefault,
                              is_closed: isClosed,
                              updated_at: new Date().toISOString(),
                          }
                        : s,
                );
            } else {
                statusesToUpdate = [
                    ...statusesToUpdate,
                    {
                        id: Date.now(),
                        title: title,
                        description: description,
                        color: color,
                        is_default: isDefault,
                        is_closed: isClosed,
                        sort_order: data.statuses.length + 1,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    } as TicketStatus,
                ];
            }

            // recalcule le progress pour chaque status
            statusesToUpdate = statusesToUpdate.map((s, index) => ({
                ...s,
                progress: calculateProgress(index + 1, statusesToUpdate.length),
            }));

            setData('statuses', statusesToUpdate);

            handleSuccess();
        }

        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {status ? __('tickets.pages.relations.statuses.dialog.edit_title') : __('tickets.pages.relations.statuses.dialog.create_title')}
                        </DialogTitle>
                        <DialogDescription>
                            {status
                                ? __('tickets.pages.relations.statuses.dialog.edit_description')
                                : __('tickets.pages.relations.statuses.dialog.create_description')}
                        </DialogDescription>
                    </DialogHeader>

                    {/*  */}
                    <form onSubmit={handleSubmit} className="grid gap-3">
                        {/* Title */}
                        <div className="grid gap-2">
                            <Label htmlFor="title" indicator={'required'}>
                                {__('tickets.pages.relations.statuses.dialog.form.title_label')}
                            </Label>
                            <Input
                                id="title"
                                value={title}
                                placeholder={__('tickets.pages.relations.statuses.dialog.form.title_placeholder')}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={processing}
                                aria-invalid={errors.title ? 'true' : 'false'}
                                required
                            />
                        </div>
                        {/* Description */}
                        <div className="grid gap-2">
                            <Label htmlFor="description" indicator={'optional'}>
                                {__('tickets.pages.relations.statuses.dialog.form.description_label')}
                            </Label>
                            <Textarea
                                id="description"
                                value={description}
                                placeholder={__('tickets.pages.relations.statuses.dialog.form.description_placeholder')}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={processing}
                                aria-invalid={
                                    errors.description ? 'true' : 'false'
                                }
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {/* Is default */}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="is_default"
                                    indicator={'required'}
                                >
                                    {__('tickets.pages.relations.statuses.dialog.form.default_label')}
                                </Label>
                                <Select
                                    defaultValue={
                                        status ? (isDefault ? 'yes' : 'no') : ''
                                    }
                                    onValueChange={(value) =>
                                        setIsDefault(value === 'yes')
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={__('tickets.pages.relations.statuses.dialog.form.default_placeholder')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="yes">{__('tickets.pages.relations.statuses.dialog.form.default_yes')}</SelectItem>
                                        <SelectItem value="no">{__('tickets.pages.relations.statuses.dialog.form.default_no')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Is closed */}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="is_default"
                                    indicator={'required'}
                                >
                                    {__('tickets.pages.relations.statuses.dialog.form.closed_label')}
                                </Label>
                                <Select
                                    defaultValue={
                                        status ? (isClosed ? 'yes' : 'no') : ''
                                    }
                                    onValueChange={(value) =>
                                        setIsClosed(value === 'yes')
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={__('tickets.pages.relations.statuses.dialog.form.closed_placeholder')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="yes">{__('tickets.pages.relations.statuses.dialog.form.closed_yes')}</SelectItem>
                                        <SelectItem value="no">{__('tickets.pages.relations.statuses.dialog.form.closed_no')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Color */}
                        <div className="grid gap-2">
                            <Label htmlFor="color" indicator={'required'}>
                                {__('tickets.pages.relations.statuses.dialog.form.color_label')}
                            </Label>
                            <ColorPicker
                                id="color"
                                value={color}
                                onChange={(color) => setColor(color)}
                                disabled={processing}
                                ariaInvalid={errors.color ? true : false}
                                required
                            />
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant={'secondary'}>
                                    {__('tickets.pages.relations.statuses.dialog.form.buttons.close')}
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={processing}>
                                {status ? <Pen /> : <Plus />}
                                {status ? __('tickets.pages.relations.statuses.dialog.form.buttons.update') : __('tickets.pages.relations.statuses.dialog.form.buttons.store')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );
    }

    interface StatusesDeleteDialogProps {
        status: TicketStatus;
        children: React.ReactNode;
    }

    function StatusesDeleteDialog({
        status,
        children,
    }: StatusesDeleteDialogProps) {
        const [open, setOpen] = React.useState(false);

        function handleSubmit(e: React.FormEvent) {
            e.stopPropagation();
            e.preventDefault();

            const updatedStatuses = data.statuses.filter(
                (s) => s.id !== status.id,
            );

            // recalcule le progress pour chaque status
            const statusesToUpdate = updatedStatuses.map((s, index) => ({
                ...s,
                progress: calculateProgress(index + 1, updatedStatuses.length),
            }));

            setData('statuses', statusesToUpdate);
            setOpen(false);
        }

        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {__('tickets.pages.relations.statuses.dialog.delete_title')}
                        </DialogTitle>
                        <DialogDescription>
                            {__('tickets.pages.relations.statuses.dialog.delete_description')}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant={'secondary'}>
                                {__('tickets.pages.relations.statuses.dialog.form.buttons.cancel')}
                            </Button>
                        </DialogClose>
                        <Button variant={'destructive'} onClick={handleSubmit} disabled={status.locked}>
                            <Trash2 />
                            {__('tickets.pages.relations.statuses.dialog.form.buttons.delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    // -------------------------------------
    // Draggable functions
    // -------------------------------------

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            setData((prevData) => {
                const oldIndex = dataIds.indexOf(active.id);
                const newIndex = dataIds.indexOf(over.id);
                const newStatuses = arrayMove(
                    prevData.statuses,
                    oldIndex,
                    newIndex,
                );

                const updatedStatuses = newStatuses.map(
                    (item: TicketStatus, index: number) => ({
                        ...item,
                        sort_order: index + 1,
                    }),
                );

                const statusesToUpdate = updatedStatuses.map((s, index) => ({
                    ...s,
                    progress: calculateProgress(index + 1, updatedStatuses.length),
                }));

                return { ...prevData, statuses: statusesToUpdate };
            });
        }
    }

    function DragHandle({ id }: { id: UniqueIdentifier }) {
        const { attributes, listeners } = useSortable({
            id,
        });

        return (
            <Button
                {...attributes}
                {...listeners}
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground"
            >
                <GripVertical className="size-4" />
            </Button>
        );
    }

    function DraggableRow({ status }: { status: TicketStatus }) {
        const { transform, transition, setNodeRef, isDragging } = useSortable({
            id: status.id,
        });

        return (
            <TableRow
                key={status.id}
                className="group"
                data-dragging={isDragging}
                ref={setNodeRef}
                style={{
                    transform: CSS.Transform.toString(transform),
                    transition,
                }}
            >
                <TableCell>
                    <DragHandle id={status.id} />
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-4">
                        {renderTicketStatus(status)}
                        {status.is_default ? (
                            <Badge variant="secondary">
                                {__('tickets.pages.relations.statuses.sheet.table.default')}
                            </Badge>
                        ) : null}
                        {status.is_closed ? (
                            <Badge variant="destructive">{__('tickets.pages.relations.statuses.sheet.table.closed')}</Badge>
                        ) : null}
                    </div>
                </TableCell>
                <TableCell
                    className={cn(
                        'space-x-1 text-right opacity-0 transition-opacity',

                        // Show on row hover only if not dragging
                        !isDragging && 'group-hover:opacity-100',
                    )}
                >
                    <StatusesDialog status={status}>
                        <Button variant="outline" size={'icon-sm'}>
                            <Pen />
                        </Button>
                    </StatusesDialog>
                    <StatusesDeleteDialog status={status}>
                        <Button variant="outline" size={'icon-sm'} disabled={status.locked}>
                            <Trash2 />
                        </Button>
                    </StatusesDeleteDialog>
                </TableCell>
            </TableRow>
        );
    }

    // -------------------------------------
    // Submit
    // -------------------------------------

    function handleSave() {
        patch(route('tickets.statuses.save'), {
            preserveScroll: true,
            onSuccess: () => {
                setSheetOpen(false);
            },
        });
    }

    return (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{__('tickets.pages.relations.statuses.sheet.title')}</SheetTitle>
                    <SheetDescription>
                        {__('tickets.pages.relations.statuses.sheet.description')}
                    </SheetDescription>
                </SheetHeader>
                <Separator />
                <div className="grid gap-6 px-4">
                    <StatusesDialog>
                        <Button className="w-max" size={'sm'}>
                            <Plus />
                            {__('tickets.pages.relations.statuses.sheet.buttons.create')}
                        </Button>
                    </StatusesDialog>

                    <DndContext
                        collisionDetection={closestCenter}
                        modifiers={[restrictToVerticalAxis]}
                        onDragEnd={handleDragEnd}
                        sensors={sensors}
                        id="statuses-sortable-context"
                    >
                        <Table className="overflow-hidden">
                            <TableHeader>
                                <TableRow>
                                    <TableHead></TableHead>
                                    <TableHead className="text-xs text-muted-foreground">
                                        {__('tickets.pages.relations.statuses.sheet.table.column')}
                                    </TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.statuses.length > 0 ? (
                                    <SortableContext
                                        items={dataIds}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {data.statuses
                                            .sort(
                                                (a, b) =>
                                                    a.sort_order - b.sort_order,
                                            )
                                            .map((status) => (
                                                <DraggableRow
                                                    key={status.id}
                                                    status={status}
                                                />
                                            ))}
                                    </SortableContext>
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={3}
                                            className="py-4 text-center"
                                        >
                                            {__('tickets.pages.relations.statuses.sheet.table.empty')}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </DndContext>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="secondary">
                            {__('tickets.pages.relations.statuses.sheet.buttons.close')}
                        </Button>
                    </SheetClose>
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={processing}
                    >
                        {processing ? <Spinner /> : <Save />}
                        {__('tickets.pages.relations.statuses.sheet.buttons.save')}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
