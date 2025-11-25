// resources/js/pages/assets/form.tsx

// Necessary imports
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

// Layout

// Translation Hook

// Hooks
import { FileWithPreview } from '@/hooks/use-file-upload';

// Shadnc UI Components
import { FileUpload } from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { IconPicker } from '@/components/ui/icon-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

// Types
import type { Asset, AssetAttribute } from '@/types';

// Icons
import { Pen, Plus, Trash, X } from 'lucide-react';

export function InformationsTab({
    assets,
    errors,
    data,
    setData,
    disabled = false,
}: {
    assets?: Asset[];
    errors: Record<string, string>;
    // Change these any types
    data: any;
    setData: any;
    disabled?: boolean;
}) {
    const renderOption = (asset: Asset) => {
        const depthLevel = (asset as any).depth_level || 0;
        const indentation = '\u00A0'.repeat(depthLevel * 4);

        return `${indentation}${asset.title}`;
    };

    return (
        <TabsContent
            value={'informations'}
            className="grid gap-4 md:grid-cols-4"
        >
            <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="title" indicator={'required'}>
                    Title
                </Label>
                <Input
                    id="title"
                    type="text"
                    name="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    required
                    placeholder={'My asset'}
                    aria-invalid={errors.title ? 'true' : 'false'}
                    autoFocus
                    disabled={disabled}
                />
            </div>
            <div className="grid gap-2 md:col-span-1">
                <Label htmlFor="parent_id" indicator={'optional'}>
                    Parent
                </Label>
                <div className="flex items-center gap-2">
                    <Select
                        value={String(data.parent_id)}
                        disabled={disabled}
                        onValueChange={(value) =>
                            setData('parent_id', value || '')
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a parent" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {assets?.map((asset) => (
                                    <SelectItem
                                        key={asset.id}
                                        value={String(asset.id)}
                                        disabled={data.id === asset.id}
                                    >
                                        {renderOption(asset)}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {data.parent_id && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={'outline'}
                                    size={'icon'}
                                    onClick={() => setData('parent_id', '')}
                                    disabled={disabled}
                                >
                                    <X />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Clear selection</TooltipContent>
                        </Tooltip>
                    )}
                </div>
            </div>
            <div className="grid gap-2 md:col-span-1">
                <Label htmlFor="icon" indicator={'optional'}>
                    Icon
                </Label>
                <IconPicker
                    id="icon"
                    name="icon"
                    categorized={false}
                    searchPlaceholder="Search for an icon..."
                    triggerPlaceholder="Select an icon"
                    disabled={disabled}
                    value={data.icon}
                    onValueChange={(value) => setData('icon', value || '')}
                />
            </div>

            <div className="grid gap-2 md:col-span-4">
                <Label htmlFor="description" indicator={'optional'}>
                    Description
                </Label>
                <Textarea
                    id="description"
                    name="description"
                    placeholder="The description of my asset..."
                    className="max-h-[24rem] min-h-[8rem]"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    disabled={disabled}
                />
            </div>
        </TabsContent>
    );
}

export function AttributesTab({
    attribute_keys,
    errors,
    data,
    setData,
    disabled = false,
}: {
    attribute_keys?: string[];
    errors: Record<string, string>;
    // Change these any types
    data: any;
    setData: any;
    disabled?: boolean;
}) {
    const {
        data: attributeData,
        setData: setAttributeData,
        processing,
    } = useForm({
        key: '',
        value: '',
    });

    const [status, setStatus] = useState<'adding' | 'editing' | null>(null);
    const [open, setOpen] = useState(false);
    const [editingKey, setEditingKey] = useState<string | null>(null);

    const handleSelectKey = (key: string) => {
        setAttributeData('key', key);
        setOpen(true);
        setStatus('adding');
    };

    const handleUpdateAttribute = (attribute: AssetAttribute) => {
        setStatus('editing');
        setAttributeData('key', attribute.key);
        setAttributeData('value', attribute.value);
        setEditingKey(attribute.key);
        setOpen(true);
    };

    const handleSubmitAttribute = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // key must be unique
        if (
            data.attributes.find(
                (attribute: AssetAttribute) =>
                    attribute.key === attributeData.key &&
                    attribute.key !== editingKey,
            )
        ) {
            toast.error('An error occured', {
                description: 'Attribute key must be unique.',
            });
            return;
        }

        if (status === 'editing' && editingKey) {
            const updatedAttributes = data.attributes.map(
                (attribute: AssetAttribute) => {
                    if (attribute.key === editingKey) {
                        return {
                            key: attributeData.key,
                            value: attributeData.value,
                        };
                    }
                    return attribute;
                },
            );
            setData('attributes', updatedAttributes);
            toast.success('Attribute updated successfully');
        } else {
            // Add new attribute
            setData('attributes', [
                ...data.attributes,
                {
                    key: attributeData.key,
                    value: attributeData.value,
                },
            ]);
            toast.success('Attribute added successfully');
        }
        // Reset form
        setAttributeData('key', '');
        setAttributeData('value', '');
        setEditingKey(null);
        setOpen(false);

        return;
    };

    const handleRemoveAttribute = (key: string) => {
        const filteredAttributes = data.attributes.filter(
            (attribute: AssetAttribute) => attribute.key !== key,
        );
        setData('attributes', filteredAttributes);
        toast.success('Attribute removed successfully');
    };

    return (
        <TabsContent value={'attributes'}>
            <div className="grid gap-6">
                {!disabled && (
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-max"
                                size={'sm'}
                                type="button"
                                onClick={() => setStatus('adding')}
                            >
                                <Plus />
                                {status === 'editing'
                                    ? 'Edit an attribute'
                                    : 'Add an attribute'}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {status === 'editing'
                                        ? 'Edit an attribute'
                                        : 'Add an attribute'}
                                </DialogTitle>
                                <DialogDescription>
                                    {status === 'editing'
                                        ? 'Edit the attribute details below.'
                                        : 'Here you can add a new attribute to this asset.'}
                                </DialogDescription>
                            </DialogHeader>

                            <form
                                onSubmit={handleSubmitAttribute}
                                className="grid gap-3"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="key"
                                            indicator={'required'}
                                        >
                                            Key
                                        </Label>
                                        <Input
                                            id="key"
                                            type="text"
                                            name="key"
                                            value={attributeData.key}
                                            onChange={(e) =>
                                                setAttributeData(
                                                    'key',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                            placeholder={'Serial Number'}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="value"
                                            indicator={'required'}
                                        >
                                            Value
                                        </Label>
                                        <Input
                                            id="value"
                                            type="text"
                                            name="value"
                                            value={attributeData.value}
                                            onChange={(e) =>
                                                setAttributeData(
                                                    'value',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                            placeholder={'ABC12345'}
                                        />
                                    </div>
                                </div>

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button
                                            variant="secondary"
                                            type="button"
                                        >
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? <Spinner /> : <Plus />}
                                        {status === 'editing'
                                            ? 'Edit attribute'
                                            : 'Add attribute'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}

                {attribute_keys && attribute_keys.length > 0 && (
                    <div className="grid gap-2">
                        <Label>Frequently used attributes</Label>
                        <div className="flex w-full items-center gap-2 overflow-auto">
                            {attribute_keys.map((key) => (
                                <Button
                                    key={key}
                                    variant="secondary"
                                    size="sm"
                                    className="rounded-full"
                                    type="button"
                                    onClick={() => handleSelectKey(key)}
                                >
                                    {key}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid gap-2">
                    <Label>Current attributes</Label>
                    {data.attributes && data.attributes.length > 0 ? (
                        <div className="grid gap-2 md:grid-cols-3">
                            {data.attributes.map(
                                (attribute: AssetAttribute) => (
                                    <Card
                                        key={attribute.key}
                                        className="col-span-1 bg-input/30 p-2"
                                    >
                                        <CardHeader className="p-2">
                                            <CardTitle className="text-sm">
                                                {attribute.key}
                                            </CardTitle>
                                            <CardDescription>
                                                {attribute.value}
                                            </CardDescription>
                                            {!disabled && (
                                                <CardAction className="flex gap-2">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant={
                                                                    'secondary'
                                                                }
                                                                size={'icon-sm'}
                                                                type="button"
                                                                onClick={() =>
                                                                    handleUpdateAttribute(
                                                                        attribute,
                                                                    )
                                                                }
                                                            >
                                                                <Pen />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            Edit attribute
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant={
                                                                    'outline'
                                                                }
                                                                size={'icon-sm'}
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRemoveAttribute(
                                                                        attribute.key,
                                                                    )
                                                                }
                                                            >
                                                                <Trash />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            Remove attribute
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </CardAction>
                                            )}
                                        </CardHeader>
                                    </Card>
                                ),
                            )}
                        </div>
                    ) : (
                        <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                            No attributes created yet.
                        </div>
                    )}
                </div>
            </div>
        </TabsContent>
    );
}

export function AttachmentsTab({
    errors,
    data,
    setData,
    disabled = false,
}: {
    errors: Record<string, string>;
    data: any;
    setData: any;
    disabled?: boolean;
}) {
    return (
        <TabsContent value={'attachments'}>
            <FileUpload
                value={data.attachments || []}
                onValueChange={(files: FileWithPreview[]) =>
                    setData('attachments', files)
                }
                accept="image/*,application/pdf"
                maxFiles={10}
                maxSizeMB={10}
                disabled={disabled}
            />
        </TabsContent>
    );
}
