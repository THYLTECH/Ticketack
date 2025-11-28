// resources/js/pages/assets/form.tsx

// Necessary imports
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

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
import { useTrans } from '@/lib/translation';
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setData: any;
    disabled?: boolean;
}) {
    const renderOption = (asset: Asset) => {
        const depthLevel = asset.depth_level || 0;
        const indentation = '\u00A0'.repeat(depthLevel * 4);

        return `${indentation}${asset.title}`;
    };

    const __ = useTrans();

    return (
        <TabsContent
            value={'informations'}
            className="grid gap-4 md:grid-cols-4"
        >
            <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="title" indicator={'required'}>
                    {__('assets.pages.form.fields.informations.title.label')}
                </Label>
                <Input
                    id="title"
                    type="text"
                    name="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    required
                    placeholder={__(
                        'assets.pages.form.fields.informations.title.placeholder',
                    )}
                    aria-invalid={errors.title ? 'true' : 'false'}
                    autoFocus
                    disabled={disabled}
                />
            </div>
            <div className="grid gap-2 md:col-span-1">
                <Label htmlFor="parent_id" indicator={'optional'}>
                    {__(
                        'assets.pages.form.fields.informations.parent_asset.label',
                    )}
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
                            <SelectValue
                                placeholder={__(
                                    'assets.pages.form.fields.informations.parent_asset.placeholder',
                                )}
                            />
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
                            <TooltipContent>
                                {__(
                                    'assets.pages.form.fields.informations.parent_asset.clear',
                                )}
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
            </div>
            <div className="grid gap-2 md:col-span-1">
                <Label htmlFor="icon" indicator={'optional'}>
                    {__('assets.pages.form.fields.informations.icon.label')}
                </Label>
                <IconPicker
                    id="icon"
                    name="icon"
                    categorized={false}
                    searchPlaceholder={__('components.ui.icon-picker.search')}
                    triggerPlaceholder={__('components.ui.icon-picker.trigger')}
                    emptyPlaceholder={__('components.ui.icon-picker.empty')}
                    disabled={disabled}
                    value={data.icon}
                    onValueChange={(value) => setData('icon', value || '')}
                />
            </div>

            <div className="grid gap-2 md:col-span-4">
                <Label htmlFor="description" indicator={'optional'}>
                    {__(
                        'assets.pages.form.fields.informations.description.label',
                    )}
                </Label>
                <Textarea
                    id="description"
                    name="description"
                    placeholder={__(
                        'assets.pages.form.fields.informations.description.placeholder',
                    )}
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
    data,
    setData,
    disabled = false,
}: {
    attribute_keys?: string[];
    // Change these any types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    const __ = useTrans();

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
            toast.error(__('common.flash.error'), {
                description: __(
                    'assets.pages.form.fields.attributes.flash.unique_key',
                ),
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
            toast.success(
                __('assets.pages.form.fields.attributes.flash.updated'),
            );
        } else {
            // Add new attribute
            setData('attributes', [
                ...data.attributes,
                {
                    key: attributeData.key,
                    value: attributeData.value,
                },
            ]);
            toast.success(
                __('assets.pages.form.fields.attributes.flash.added'),
            );
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
        toast.success(__('assets.pages.form.fields.attributes.flash.deleted'));
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
                                {__(
                                    'assets.pages.form.fields.attributes.buttons.add_attribute',
                                )}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {status === 'editing'
                                        ? __(
                                              'assets.pages.form.fields.attributes.dialog.title_edit',
                                          )
                                        : __(
                                              'assets.pages.form.fields.attributes.dialog.title_create',
                                          )}
                                </DialogTitle>
                                <DialogDescription>
                                    {status === 'editing'
                                        ? __(
                                              'assets.pages.form.fields.attributes.dialog.description_edit',
                                          )
                                        : __(
                                              'assets.pages.form.fields.attributes.dialog.description_create',
                                          )}
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
                                            {__(
                                                'assets.pages.form.fields.attributes.dialog.fields.key.label',
                                            )}
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
                                            placeholder={__(
                                                'assets.pages.form.fields.attributes.dialog.fields.key.placeholder',
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="value"
                                            indicator={'required'}
                                        >
                                            {__(
                                                'assets.pages.form.fields.attributes.dialog.fields.value.label',
                                            )}
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
                                            placeholder={__(
                                                'assets.pages.form.fields.attributes.dialog.fields.value.placeholder',
                                            )}
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
                                            ? __(
                                                  'assets.pages.form.fields.attributes.dialog.buttons.confirm_edit',
                                              )
                                            : __(
                                                  'assets.pages.form.fields.attributes.dialog.buttons.confirm_create',
                                              )}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}

                {attribute_keys && attribute_keys.length > 0 && (
                    <div className="grid gap-2">
                        <Label>
                            {__(
                                'assets.pages.form.fields.attributes.fua.title',
                            )}
                        </Label>
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
                    <Label>
                        {__(
                            'assets.pages.form.fields.attributes.current.title',
                        )}
                    </Label>
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
                                                            {__(
                                                                'assets.pages.form.fields.attributes.buttons.edit_attribute',
                                                            )}
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
                                                            {__(
                                                                'assets.pages.form.fields.attributes.buttons.delete_attribute',
                                                            )}
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
                            {__(
                                'assets.pages.form.fields.attributes.current.empty',
                            )}
                        </div>
                    )}
                </div>
            </div>
        </TabsContent>
    );
}

export function AttachmentsTab({
    data,
    setData,
    disabled = false,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setData: any;
    disabled?: boolean;
}) {
    const maxFiles = 10;
    const maxSizeMB = 10;
    const accept = 'image/*,application/pdf';

    const __ = useTrans();

    return (
        <TabsContent value={'attachments'}>
            <FileUpload
                value={data.attachments || []}
                onValueChange={(files: FileWithPreview[]) =>
                    setData('attachments', files)
                }
                accept={accept}
                maxFiles={maxFiles}
                maxSizeMB={maxSizeMB}
                disabled={disabled}
                texts={{
                    dropAreaTitle: __(
                        'components.ui.file-upload.dropAreaTitle',
                    ),
                    dropAreaHeader: __(
                        'components.ui.file-upload.dropAreaHeader',
                    ),
                    dropAreaSubtext: __(
                        'components.ui.file-upload.dropAreaSubtext',
                        undefined,
                        {
                            maxFiles,
                            maxSizeMB,
                            accept,
                        },
                    ),
                    selectButton: __('components.ui.file-upload.selectButton'),
                    filesHeader: __('components.ui.file-upload.filesHeader'),
                    removeAllButton: __(
                        'components.ui.file-upload.removeAllButton',
                    ),
                    removeFileAriaLabel: __(
                        'components.ui.file-upload.removeFileAriaLabel',
                    ),
                    renameFileAriaLabel: __(
                        'components.ui.file-upload.renameFileAriaLabel',
                    ),
                    previewFileAriaLabel: __(
                        'components.ui.file-upload.previewFileAriaLabel',
                    ),
                    errorPrefix: __('components.ui.file-upload.errorPrefix'),
                    FileUploadLabel: __(
                        'components.ui.file-upload.FileUploadLabel',
                    ),
                    AttachmentsLabel: __(
                        'components.ui.file-upload.AttachmentsLabel',
                    ),
                    emptyAttachmentsText: __(
                        'components.ui.file-upload.emptyAttachmentsText',
                    ),
                }}
            />
        </TabsContent>
    );
}
