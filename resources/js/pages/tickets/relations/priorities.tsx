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
import { GripVertical, Pen, Plus, Save, Trash2 } from 'lucide-react';
import { ColorPicker } from '@/components/ui/color-picker';

interface PrioritiesSheetProps {
    children: React.ReactNode;
    priorities: TicketPriority[];
}

export function PrioritiesSheet({
    children,
    priorities,
}: PrioritiesSheetProps) {
    const { data, setData, processing, errors, patch } = useForm<{
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

    // Draggable Functions
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
                    {/* <Button variant={'ghost'} size={'icon-sm'}>
                    <GripVertical />
                </Button> */}
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
                        <Button variant="outline" size={'icon-sm'}>
                            <Trash2 />
                        </Button>
                    </PrioritiesDeleteDialog>
                </TableCell>
            </TableRow>
        );
    }

    function handleSave() {
        patch(route('tickets.priorities.save'), {
            preserveScroll: true,
            onSuccess: () => {},
        });
    }

    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Manage Priorities</SheetTitle>
                    <SheetDescription>
                        Modify the list of ticket priorities.
                    </SheetDescription>
                </SheetHeader>
                <Separator />
                <div className="grid gap-6 px-4">
                    <PrioritiesDialog>
                        <Button className="w-max" size={'sm'}>
                            <Plus />
                            Add Priority
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
                                        Priority
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
                                            No priorities found.
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

interface PrioritiesDialogProps {
    priority?: TicketPriority;
    children: React.ReactNode;
}

function PrioritiesDialog({ priority, children }: PrioritiesDialogProps) {
    const [open, setOpen] = React.useState(false);

    const { data, setData, processing, errors, post, patch } = useForm<{
        title: string;
        description: string;
        color: string | null;
    }>({
        title: priority ? priority.title : '',
        description: priority ? priority.description : '',
        color: priority ? priority.color : null,
    });

    function handleSubmit(e: React.FormEvent) {
        e.stopPropagation();
        e.preventDefault();

        if (priority) {
            patch(
                route('tickets.priorities.update', { priority: priority.id }),
            );
        } else {
            post(route('tickets.priorities.store'));
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {priority ? 'Edit Priority' : 'Create Priority'}
                    </DialogTitle>
                    <DialogDescription>
                        {priority
                            ? `Modify the details of the priority "${priority.title}".`
                            : 'Fill in the details to create a new priority.'}
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
                            value={data.title}
                            placeholder="eg: High, Medium, Low"
                            onChange={(e) => setData('title', e.target.value)}
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
                            value={data.description}
                            placeholder="A brief description of the priority."
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            disabled={processing}
                            aria-invalid={errors.description ? 'true' : 'false'}
                        />
                    </div>
                    {/* Color */}
                    <div className="grid gap-2">
                        <Label htmlFor="color" indicator={'required'}>
                            Color
                        </Label>
                        <ColorPicker
                            id="color"
                            value={data.color}
                            onChange={(color) => setData('color', color )}
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
                            {priority ? <Pen /> : <Plus />}
                            {priority ? 'Update Priority' : 'Store Priority'}
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
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Priority</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the priority "
                        {priority.title}"? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant={'secondary'}>Cancel</Button>
                    </DialogClose>
                    <Button variant={'destructive'}>
                        <Trash2 />
                        Delete Priority
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
