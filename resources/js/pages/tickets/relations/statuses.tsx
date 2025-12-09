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

// Translation Hook
import { useTrans } from '@/lib/translation';

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
                        title.trim() === '' ? 'Title is required.' : undefined,
                    color: !color ? 'Color is required.' : undefined,
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
                            {status ? 'Edit Status' : 'Create Status'}
                        </DialogTitle>
                        <DialogDescription>
                            {status
                                ? `Modify the details of the status "${status.title}".`
                                : 'Fill in the details to create a new status.'}
                        </DialogDescription>
                    </DialogHeader>

                    {/*  */}
                    <form onSubmit={handleSubmit} className="grid gap-3">
                        {/* Title */}
                        <div className="grid gap-2">
                            <Label htmlFor="title" indicator={'required'}>
                                Title
                            </Label>
                            <Input
                                id="title"
                                value={title}
                                placeholder="eg: To Do, In Progress, Done"
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={processing}
                                aria-invalid={errors.title ? 'true' : 'false'}
                                required
                            />
                        </div>
                        {/* Description */}
                        <div className="grid gap-2">
                            <Label htmlFor="description" indicator={'optional'}>
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                value={description}
                                placeholder="A brief description of the status."
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={processing}
                                aria-invalid={
                                    errors.description ? 'true' : 'false'
                                }
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {/* Is default */}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="is_default"
                                    indicator={'required'}
                                >
                                    Is default
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
                                        <SelectValue placeholder="Is this the default status?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="yes">Yes</SelectItem>
                                        <SelectItem value="no">No</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Is closed */}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="is_default"
                                    indicator={'required'}
                                >
                                    Is closed
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
                                        <SelectValue placeholder="Is this the closed status?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="yes">Yes</SelectItem>
                                        <SelectItem value="no">No</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Color */}
                        <div className="grid gap-2">
                            <Label htmlFor="color" indicator={'required'}>
                                Color
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
                                <Button variant={'secondary'}>Close</Button>
                            </DialogClose>
                            <Button type="submit" disabled={processing}>
                                {status ? <Pen /> : <Plus />}
                                {status ? 'Update Status' : 'Store Status'}
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
                        <DialogTitle>Delete Status</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the status "
                            {status.title}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant={'secondary'}>Cancel</Button>
                        </DialogClose>
                        <Button variant={'destructive'} onClick={handleSubmit}>
                            <Trash2 />
                            Delete Status
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
                            <Badge variant="secondary">Default</Badge>
                        ) : null}
                        {status.is_closed ? (
                            <Badge variant="destructive">Closed</Badge>
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
                        <Button variant="outline" size={'icon-sm'}>
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
                    <SheetTitle>Manage Statuses</SheetTitle>
                    <SheetDescription>
                        Modify the list of ticket statuses.
                    </SheetDescription>
                </SheetHeader>
                <Separator />
                <div className="grid gap-6 px-4">
                    <StatusesDialog>
                        <Button className="w-max" size={'sm'}>
                            <Plus />
                            Add Status
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
                                        Status
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
                                            No statuses found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </DndContext>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="secondary">Close</Button>
                    </SheetClose>
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={processing}
                    >
                        {processing ? <Spinner /> : <Save />}
                        Save Changes
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
