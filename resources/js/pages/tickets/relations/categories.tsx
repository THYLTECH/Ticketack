// resources/js/pages/tickets/relations/categories.tsx

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
import { renderTicketCategory } from '@/lib/render';

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
import { IconPicker, IconPickerProps } from '@/components/ui/icon-picker';

// Types
import { TicketCategory } from '@/types';

// Icons
import { GripVertical, Pen, Plus, Save, Trash2 } from 'lucide-react';

interface CategoriesSheetProps {
    children: React.ReactNode;
    categories: TicketCategory[];
}

export function CategoriesSheet({
    children,
    categories,
}: CategoriesSheetProps) {
    const [sheetOpen, setSheetOpen] = React.useState(false);

    const __ = useTrans();

    const { data, setData, processing, patch } = useForm<{
        categories: TicketCategory[];
    }>({
        categories: categories,
    });

    const dataIds = React.useMemo<UniqueIdentifier[]>(
        () => data.categories.map(({ id }) => id),
        [data.categories],
    );

    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {}),
    );

    // -------------------------------------
    // Dialog
    // -------------------------------------

    interface CategoriesDialogProps {
        category?: TicketCategory;
        children: React.ReactNode;
    }

    function CategoriesDialog({ category, children }: CategoriesDialogProps) {
        const [open, setOpen] = React.useState(false);

        const [title, setTitle] = React.useState(
            category ? category.title : '',
        );
        const [description, setDescription] = React.useState(
            category ? category.description : '',
        );
        const [color, setColor] = React.useState<string | null>(
            category ? category.color : null,
        );

        const [icon, setIcon] = React.useState<
            IconPickerProps['value'] | undefined
        >(category ? category.icon : undefined);

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
            setIcon(undefined);
            setOpen(false);
        }

        function handleSubmit(e: React.FormEvent) {
            e.stopPropagation();
            e.preventDefault();

            // Error verification
            if (title.trim() === '') {
                setErrors({ title: 'Title is required.' });
                return;
            }

            if (!color) {
                setErrors({ color: 'Color is required.' });
                return;
            }

            // Clear previous errors
            setErrors({});

            if (category) {
                const updatedCategories = data.categories.map((c) =>
                    c.id === category.id
                        ? {
                              ...c,
                              title: title,
                              description: description,
                              color: color,
                              icon: icon,
                              updated_at: new Date().toISOString(),
                          }
                        : c,
                );

                setData('categories', updatedCategories);

                handleSuccess();
            } else {
                setData('categories', [
                    ...data.categories,
                    {
                        id: Date.now(),
                        title: title,
                        description: description,
                        color: color,
                        icon: icon,
                        sort_order: data.categories.length + 1,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    } as TicketCategory,
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
                            {category ? 'Edit Category' : 'Create Category'}
                        </DialogTitle>
                        <DialogDescription>
                            {category
                                ? `Modify the details of the category "${category.title}".`
                                : 'Fill in the details to create a new category.'}
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
                                placeholder="eg: Network Issues"
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
                                placeholder="A brief description of the category."
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={processing}
                                aria-invalid={
                                    errors.description ? 'true' : 'false'
                                }
                            />
                        </div>
                        {/* Icon */}
                        <div className="grid gap-2">
                            <Label htmlFor="icon" indicator={'optional'}>
                                Icon
                            </Label>
                            <IconPicker
                                id="icon"
                                categorized={false}
                                value={icon}
                                searchPlaceholder={__(
                                    'components.ui.icon-picker.search',
                                )}
                                triggerPlaceholder={__(
                                    'components.ui.icon-picker.trigger',
                                )}
                                emptyPlaceholder={__(
                                    'components.ui.icon-picker.empty',
                                )}
                                onValueChange={(icon) => setIcon(icon)}
                                disabled={processing}
                            />
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
                                {category ? <Pen /> : <Plus />}
                                {category
                                    ? 'Update Category'
                                    : 'Store Category'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );
    }

    interface CategoriesDeleteDialogProps {
        category: TicketCategory;
        children: React.ReactNode;
    }

    function CategoriesDeleteDialog({
        category,
        children,
    }: CategoriesDeleteDialogProps) {
        const [open, setOpen] = React.useState(false);

        function handleSubmit(e: React.FormEvent) {
            e.stopPropagation();
            e.preventDefault();

            const updatedCategories = data.categories.filter(
                (c) => c.id !== category.id,
            );

            setData('categories', updatedCategories);
            setOpen(false);
        }

        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Category</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the category "
                            {category.title}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant={'secondary'}>Cancel</Button>
                        </DialogClose>
                        <Button variant={'destructive'} onClick={handleSubmit}>
                            <Trash2 />
                            Delete Category
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
                const newCategories = arrayMove(
                    prevData.categories,
                    oldIndex,
                    newIndex,
                );

                const updatedCategories = newCategories.map(
                    (item: TicketCategory, index: number) => ({
                        ...item,
                        sort_order: index + 1,
                    }),
                );

                return { ...prevData, categories: updatedCategories };
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

    function DraggableRow({ category }: { category: TicketCategory }) {
        const { transform, transition, setNodeRef, isDragging } = useSortable({
            id: category.id,
        });

        return (
            <TableRow
                key={category.id}
                className="group"
                data-dragging={isDragging}
                ref={setNodeRef}
                style={{
                    transform: CSS.Transform.toString(transform),
                    transition,
                }}
            >
                <TableCell>
                    <DragHandle id={category.id} />
                </TableCell>
                <TableCell>{renderTicketCategory(category)}</TableCell>
                <TableCell
                    className={cn(
                        'space-x-1 text-right opacity-0 transition-opacity',

                        // Show on row hover only if not dragging
                        !isDragging && 'group-hover:opacity-100',
                    )}
                >
                    <CategoriesDialog category={category}>
                        <Button variant="outline" size={'icon-sm'}>
                            <Pen />
                        </Button>
                    </CategoriesDialog>

                    <CategoriesDeleteDialog category={category}>
                        <Button variant="outline" size={'icon-sm'}>
                            <Trash2 />
                        </Button>
                    </CategoriesDeleteDialog>
                </TableCell>
            </TableRow>
        );
    }

    // -------------------------------------
    // Submit
    // -------------------------------------

    function handleSave() {
        patch(route('tickets.categories.save'), {
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
                    <SheetTitle>Manage Categories</SheetTitle>
                    <SheetDescription>
                        Modify the list of ticket categories.
                    </SheetDescription>
                </SheetHeader>
                <Separator />
                <div className="grid gap-6 px-4">
                    <CategoriesDialog>
                        <Button className="w-max" size={'sm'}>
                            <Plus />
                            Add Category
                        </Button>
                    </CategoriesDialog>

                    <DndContext
                        collisionDetection={closestCenter}
                        modifiers={[restrictToVerticalAxis]}
                        onDragEnd={handleDragEnd}
                        sensors={sensors}
                        id="categories-sortable-context"
                    >
                        <Table className="overflow-hidden">
                            <TableHeader>
                                <TableRow>
                                    <TableHead></TableHead>
                                    <TableHead className="text-xs text-muted-foreground">
                                        Category
                                    </TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.categories.length > 0 ? (
                                    <SortableContext
                                        items={dataIds}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {data.categories
                                            .sort(
                                                (a, b) =>
                                                    a.sort_order - b.sort_order,
                                            )
                                            .map((category) => (
                                                <DraggableRow
                                                    key={category.id}
                                                    category={category}
                                                />
                                            ))}
                                    </SortableContext>
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={3}
                                            className="py-4 text-center"
                                        >
                                            No categories found.
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
