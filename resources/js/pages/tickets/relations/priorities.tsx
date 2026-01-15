// resources/js/pages/tickets/relations/priorities.tsx

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
import { renderTicketPriority } from '@/lib/render';

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

// Types
import { TicketPriority } from '@/types';

// Icons
import { ColorPicker } from '@/components/ui/color-picker';
import { GripVertical, Pen, Plus, Save, Trash2 } from 'lucide-react';
import { useTrans } from '@/lib/translation';

interface PrioritiesSheetProps {
    children: React.ReactNode;
    priorities: TicketPriority[];
}

export function PrioritiesSheet({
    children,
    priorities,
}: PrioritiesSheetProps) {
    const [sheetOpen, setSheetOpen] = React.useState(false);

    const __ = useTrans();
    const { data, setData, processing, patch } = useForm<{
        priorities: TicketPriority[];
    }>({
        priorities: priorities,
    });

    const dataIds = React.useMemo<UniqueIdentifier[]>(
        () => data.priorities.map(({ id }) => id),
        [data.priorities],
    );

    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {}),
    );

    // -------------------------------------
    // Dialog
    // -------------------------------------

    interface PrioritiesDialogProps {
        priority?: TicketPriority;
        children: React.ReactNode;
    }

    function PrioritiesDialog({ priority, children }: PrioritiesDialogProps) {
        const [open, setOpen] = React.useState(false);

        const [title, setTitle] = React.useState(
            priority ? priority.title : '',
        );
        const [description, setDescription] = React.useState(
            priority ? priority.description : '',
        );
        const [color, setColor] = React.useState<string | null>(
            priority ? priority.color : null,
        );

        const [errors, setErrors] = React.useState<{
            title?: string;
            description?: string;
            color?: string;
        }>({});

        function handleSuccess() {
            setTitle('');
            setDescription('');
            setColor(null);
            setOpen(false);
        }

        function handleSubmit(e: React.FormEvent) {
            e.stopPropagation();
            e.preventDefault();

            // Error verification
            if (title.trim() === '') {
                setErrors({ title: __('tickets.pages.relations.priorities.validation.title_required') });
                return;
            }

            if (!color) {
                setErrors({ color: __('tickets.pages.relations.priorities.validation.color_required') });
                return;
            }

            // Clear previous errors
            setErrors({});

            if (priority) {
                const updatedPriorities = data.priorities.map((p) =>
                    p.id === priority.id
                        ? {
                              ...p,
                              title: title,
                              description: description,
                              color: color,
                              updated_at: new Date().toISOString(),
                          }
                        : p,
                );

                setData('priorities', updatedPriorities);

                handleSuccess();
            } else {
                setData('priorities', [
                    ...data.priorities,
                    {
                        id: Date.now(),
                        title: title,
                        description: description,
                        color: color,
                        sort_order: data.priorities.length + 1,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    } as TicketPriority,
                ]);

                handleSuccess();
            }
        }

        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {priority ? __('tickets.pages.relations.priorities.dialog.edit_title') : __('tickets.pages.relations.priorities.dialog.create_title')}
                        </DialogTitle>
                        <DialogDescription>
                            {priority
                                ? __('tickets.pages.relations.priorities.dialog.edit_description')
                                : __('tickets.pages.relations.priorities.dialog.create_description')}
                        </DialogDescription>
                    </DialogHeader>

                    {/*  */}
                    <form onSubmit={handleSubmit} className="grid gap-3">
                        {/* Title */}
                        <div className="grid gap-2">
                            <Label htmlFor="title" indicator={'required'}>
                                {__('tickets.pages.relations.priorities.dialog.form.title_label')}
                            </Label>
                            <Input
                                id="title"
                                value={title}
                                placeholder={__('tickets.pages.relations.priorities.dialog.form.title_placeholder')}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={processing}
                                aria-invalid={errors.title ? 'true' : 'false'}
                                required
                            />
                        </div>
                        {/* Description */}
                        <div className="grid gap-2">
                            <Label htmlFor="description" indicator={'optional'}>
                                {__('tickets.pages.relations.priorities.dialog.form.description_label')}
                            </Label>
                            <Textarea
                                id="description"
                                value={description}
                                placeholder={__('tickets.pages.relations.priorities.dialog.form.description_placeholder')}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={processing}
                                aria-invalid={
                                    errors.description ? 'true' : 'false'
                                }
                            />
                        </div>
                        {/* Color */}
                        <div className="grid gap-2">
                            <Label htmlFor="color" indicator={'required'}>
                                {__('tickets.pages.relations.priorities.dialog.form.color_label')}
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
                                <Button variant={'secondary'}>{__('tickets.pages.relations.priorities.dialog.form.buttons.close')}</Button>
                            </DialogClose>
                            <Button type="submit" disabled={processing}>
                                {priority ? <Pen /> : <Plus />}
                                {priority
                                    ? __('tickets.pages.relations.priorities.dialog.form.buttons.update')
                                    : __('tickets.pages.relations.priorities.dialog.form.buttons.store')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );
    }

    interface PrioritiesDeleteDialogProps {
        priority: TicketPriority;
        children: React.ReactNode;
    }

    function PrioritiesDeleteDialog({
        priority,
        children,
    }: PrioritiesDeleteDialogProps) {
        const [open, setOpen] = React.useState(false);



        function handleSubmit(e: React.FormEvent) {
            e.stopPropagation();
            e.preventDefault();

            const updatedPriorities = data.priorities.filter(
                (p) => p.id !== priority.id,
            );

            setData('priorities', updatedPriorities);
            setOpen(false);
        }

        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {__('tickets.pages.relations.priorities.dialog.delete_title')}
                        </DialogTitle>
                        <DialogDescription>
                            {__('tickets.pages.relations.priorities.dialog.delete_description')}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant={'secondary'}>
                                {__('tickets.pages.relations.priorities.dialog.form.buttons.cancel')}
                            </Button>
                        </DialogClose>
                        <Button variant={'destructive'} onClick={handleSubmit} disabled={priority.locked}>
                            <Trash2 />
                            {__('tickets.pages.relations.priorities.dialog.form.buttons.delete')}
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
                const newPriorities = arrayMove(
                    prevData.priorities,
                    oldIndex,
                    newIndex,
                );

                const updatedPriorities = newPriorities.map(
                    (item: TicketPriority, index: number) => ({
                        ...item,
                        sort_order: index + 1,
                    }),
                );

                return { ...prevData, priorities: updatedPriorities };
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

    function DraggableRow({ priority }: { priority: TicketPriority }) {
        const { transform, transition, setNodeRef, isDragging } = useSortable({
            id: priority.id,
        });

        return (
            <TableRow
                key={priority.id}
                className="group"
                data-dragging={isDragging}
                ref={setNodeRef}
                style={{
                    transform: CSS.Transform.toString(transform),
                    transition,
                }}
            >
                <TableCell>
                    <DragHandle id={priority.id} />
                </TableCell>
                <TableCell>{renderTicketPriority(priority)}</TableCell>
                <TableCell
                    className={cn(
                        'space-x-1 text-right opacity-0 transition-opacity',

                        // Show on row hover only if not dragging
                        !isDragging && 'group-hover:opacity-100',
                    )}
                >
                    <PrioritiesDialog priority={priority}>
                        <Button variant="outline" size={'icon-sm'}>
                            <Pen />
                        </Button>
                    </PrioritiesDialog>

                    <PrioritiesDeleteDialog priority={priority}>
                        <Button variant="outline" size={'icon-sm'} disabled={priority.locked}>
                            <Trash2 />
                        </Button>
                    </PrioritiesDeleteDialog>
                </TableCell>
            </TableRow>
        );
    }

    // -------------------------------------
    // Submit
    // -------------------------------------

    function handleSave() {
        patch(route('tickets.priorities.save'), {
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
                    <SheetTitle>
                        {__('tickets.pages.relations.priorities.sheet.title')}
                    </SheetTitle>
                    <SheetDescription>
                        {__('tickets.pages.relations.priorities.sheet.description')}
                    </SheetDescription>
                </SheetHeader>
                <Separator />
                <div className="grid gap-6 px-4">
                    <PrioritiesDialog>
                        <Button className="w-max" size={'sm'}>
                            <Plus />
                            {__('tickets.pages.relations.priorities.sheet.buttons.create')}
                        </Button>
                    </PrioritiesDialog>

                    <DndContext
                        collisionDetection={closestCenter}
                        modifiers={[restrictToVerticalAxis]}
                        onDragEnd={handleDragEnd}
                        sensors={sensors}
                        id="priorities-sortable-context"
                    >
                        <Table className="overflow-hidden">
                            <TableHeader>
                                <TableRow>
                                    <TableHead></TableHead>
                                    <TableHead className="text-xs text-muted-foreground">
                                        {__('tickets.pages.relations.priorities.sheet.table.column')}
                                    </TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.priorities.length > 0 ? (
                                    <SortableContext
                                        items={dataIds}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {data.priorities
                                            .sort(
                                                (a, b) =>
                                                    a.sort_order - b.sort_order,
                                            )
                                            .map((priority) => (
                                                <DraggableRow
                                                    key={priority.id}
                                                    priority={priority}
                                                />
                                            ))}
                                    </SortableContext>
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={3}
                                            className="py-4 text-center"
                                        >
                                            {__('tickets.pages.relations.priorities.sheet.table.empty')}
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
                            {__('tickets.pages.relations.priorities.sheet.buttons.close')}
                        </Button>
                    </SheetClose>
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={processing}
                    >
                        {processing ? <Spinner /> : <Save />}
                        {__('tickets.pages.relations.priorities.sheet.buttons.save')}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
