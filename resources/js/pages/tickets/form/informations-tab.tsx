import { FileUpload } from '@/components/file-upload';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatBytes } from '@/hooks/use-file-upload';
import {
    renderAsset,
    renderTicketCategory,
    renderTicketPriority,
    renderTicketStatus,
} from '@/lib/render';
import { useTrans } from '@/lib/translation';
import { CategoriesSheet } from '@/pages/tickets/relations/categories';
import { PrioritiesSheet } from '@/pages/tickets/relations/priorities';
import { StatusesSheet } from '@/pages/tickets/relations/statuses';
import {
    Asset,
    Attachment,
    TicketCategory,
    TicketPriority,
    TicketStatus,
} from '@/types';
import { Link, router } from '@inertiajs/react';
import {
    BookOpenCheck,
    Download,
    Ellipsis,
    Eye,
    EyeOff,
    FileText,
    MinusCircle,
    SquareArrowOutUpRight,
    Trash2,
    X,
} from 'lucide-react';
import * as React from 'react';
import { MarkdownEditor } from './markdown-editor';
import { TicketFormData } from './types';

interface InformationsTabProps {
    errors: Record<string, string>;
    data: TicketFormData;
    setData: <K extends keyof TicketFormData>(
        key: K,
        value: TicketFormData[K],
    ) => void;
    disabled?: boolean;
    priorities: TicketPriority[];
    statuses: TicketStatus[];
    categories: TicketCategory[];
    assets: Asset[];
    clearErrors?: (field?: keyof TicketFormData) => void;
    existingAttachments?: Attachment[];
}

export function InformationsTab({
    errors,
    data,
    setData,
    disabled = false,
    priorities,
    statuses,
    categories,
    assets,
    clearErrors,
    existingAttachments = [],
}: InformationsTabProps) {
    const __ = useTrans();
    const [fileToDelete, setFileToDelete] = React.useState<Attachment | null>(
        null,
    );

    const maxTotalFiles = 10;
    const remainingSlots = Math.max(0, maxTotalFiles - existingAttachments.length);

    const config = {
        maxFiles: remainingSlots,
        maxSizeMB: 8,
        accept: 'image/*,application/pdf',
    };

    React.useEffect(() => {
        if (
            data.priority_id &&
            !priorities.some((p) => p.id === data.priority_id)
        )
            setData('priority_id', null);
        if (
            data.category_id &&
            !categories.some((c) => c.id === data.category_id)
        )
            setData('category_id', null);
        if (data.status_id && !statuses.some((s) => s.id === data.status_id))
            setData('status_id', null);
        if (
            data.asset_id &&
            !assets.some((a) => String(a.id) === String(data.asset_id))
        )
            setData('asset_id', null);
    }, [
        priorities,
        statuses,
        categories,
        assets,
        data.priority_id,
        data.category_id,
        data.status_id,
        data.asset_id,
        setData,
    ]);

    const handleDeleteAttachment = () => {
        if (!fileToDelete) return;

        router.delete(route('attachments.destroy', fileToDelete.id), {
            preserveScroll: true,
            onFinish: () => setFileToDelete(null),
        });
    };

    return (
        <TabsContent
            value="informations"
            className="animate-in space-y-8 fade-in slide-in-from-bottom-2"
        >
            <Card className="border-l-4 border-l-emerald-500 bg-emerald-50/20 shadow-sm transition-all hover:shadow-md dark:bg-emerald-950/10">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                            <BookOpenCheck className="h-5 w-5" />
                            {__('tickets.pages.form.knowledge_base.title')}
                        </CardTitle>
                        <p className="text-sm text-emerald-700/80 dark:text-emerald-300/80">
                            {__(
                                'tickets.pages.form.knowledge_base.description',
                            )}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border bg-background/50 px-3 py-2 shadow-sm">
                        <Label
                            htmlFor="reference-mode"
                            className="cursor-pointer text-sm font-medium text-emerald-800 dark:text-emerald-200"
                        >
                            {data.is_referenced
                                ? __(
                                      'tickets.pages.form.knowledge_base.status_on',
                                  )
                                : __(
                                      'tickets.pages.form.knowledge_base.status_off',
                                  )}
                        </Label>
                        <Switch
                            id="reference-mode"
                            checked={data.is_referenced}
                            onCheckedChange={(checked) =>
                                setData('is_referenced', checked)
                            }
                            disabled={disabled}
                            className="data-[state=checked]:bg-emerald-600"
                        />
                    </div>
                </CardHeader>
                {data.is_referenced && (
                    <CardContent className="animate-in pt-0 fade-in slide-in-from-top-4">
                        <Separator className="mb-6 bg-emerald-200/50" />
                        <MarkdownEditor
                            value={data.detailed_solution || ''}
                            onChange={(val: string) =>
                                setData('detailed_solution', val)
                            }
                            disabled={disabled}
                        />
                        {errors.detailed_solution && (
                            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-destructive">
                                <MinusCircle className="h-4 w-4" />
                                {errors.detailed_solution}
                            </p>
                        )}
                    </CardContent>
                )}
            </Card>

            <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
                <div className="space-y-1">
                    <Label className="text-base font-semibold">
                        {__('tickets.column.visibility')}
                    </Label>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {data.is_public ? (
                            <>
                                <Eye className="h-4 w-4 text-emerald-600" />{' '}
                                <span className="font-medium text-emerald-700 dark:text-emerald-400">
                                    {__(
                                        'tickets.pages.form.fields.public_label',
                                    )}
                                </span>
                            </>
                        ) : (
                            <>
                                <EyeOff className="h-4 w-4" />{' '}
                                {__('tickets.pages.form.fields.private_label')}
                            </>
                        )}
                    </div>
                </div>
                <Switch
                    checked={data.is_public}
                    onCheckedChange={(checked) => setData('is_public', checked)}
                    disabled={disabled}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="title" indicator="required">
                        {__('tickets.column.title')}
                    </Label>
                    <Input
                        id="title"
                        value={data.title}
                        onChange={(e) => {
                            setData('title', e.target.value);
                            clearErrors?.('title');
                        }}
                        required
                        placeholder={__(
                            'tickets.pages.form.placeholders.title',
                        )}
                        disabled={disabled}
                        className={
                            errors.title
                                ? 'border-destructive focus-visible:ring-destructive'
                                : ''
                        }
                    />
                    {errors.title && (
                        <p className="text-sm font-medium text-destructive">
                            {errors.title}
                        </p>
                    )}
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description" indicator="required">
                        {__('tickets.column.description')}
                    </Label>
                    <Textarea
                        id="description"
                        placeholder={__(
                            'tickets.pages.form.placeholders.description',
                        )}
                        className={`min-h-40 resize-y ${errors.description ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                        value={data.description}
                        required
                        onChange={(e) => {
                            setData('description', e.target.value);
                            clearErrors?.('description');
                        }}
                        disabled={disabled}
                    />
                    {errors.description && (
                        <p className="text-sm font-medium text-destructive">
                            {errors.description}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="priority_id" indicator="required">
                        {__('tickets.column.priority')}
                    </Label>
                    <div className="flex w-full items-center gap-2">
                        <div className="relative flex w-full items-center">
                            <Select
                                value={
                                    data.priority_id
                                        ? String(data.priority_id)
                                        : ''
                                }
                                disabled={disabled}
                                onValueChange={(val) =>
                                    setData(
                                        'priority_id',
                                        val ? Number(val) : null,
                                    )
                                }
                            >
                                <SelectTrigger
                                    className={`w-full ${errors.priority_id ? 'border-destructive focus:ring-destructive' : ''}`}
                                >
                                    <SelectValue
                                        placeholder={__(
                                            'tickets.pages.form.placeholders.select_priority',
                                        )}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {priorities.map((p) => (
                                        <SelectItem
                                            key={p.id}
                                            value={String(p.id)}
                                        >
                                            {renderTicketPriority(p)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {data.priority_id && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-8 h-6 w-6 text-muted-foreground hover:text-destructive"
                                    onClick={() => setData('priority_id', null)}
                                    disabled={disabled}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                        <PrioritiesSheet priorities={priorities}>
                            <Button type="button" size="icon" variant="outline">
                                <Ellipsis className="h-4 w-4" />
                            </Button>
                        </PrioritiesSheet>
                    </div>
                    {errors.priority_id && (
                        <p className="text-sm font-medium text-destructive">
                            {errors.priority_id}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status_id">
                        {__('tickets.column.status')}
                    </Label>
                    <div className="flex w-full items-center gap-2">
                        <div className="relative flex w-full items-center">
                            <Select
                                value={
                                    data.status_id ? String(data.status_id) : ''
                                }
                                disabled={disabled}
                                onValueChange={(val) =>
                                    setData(
                                        'status_id',
                                        val ? Number(val) : null,
                                    )
                                }
                            >
                                <SelectTrigger
                                    className={`w-full ${errors.status_id ? 'border-destructive focus:ring-destructive' : ''}`}
                                >
                                    <SelectValue
                                        placeholder={__(
                                            'tickets.pages.form.placeholders.select_status',
                                        )}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map((s) => (
                                        <SelectItem
                                            key={s.id}
                                            value={String(s.id)}
                                        >
                                            {renderTicketStatus(s)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {data.status_id && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-8 h-6 w-6 text-muted-foreground hover:text-destructive"
                                    onClick={() => setData('status_id', null)}
                                    disabled={disabled}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                        <StatusesSheet statuses={statuses}>
                            <Button type="button" size="icon" variant="outline">
                                <Ellipsis className="h-4 w-4" />
                            </Button>
                        </StatusesSheet>
                    </div>
                    {errors.status_id && (
                        <p className="text-sm font-medium text-destructive">
                            {errors.status_id}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category_id" indicator="required">
                        {__('tickets.column.category')}
                    </Label>
                    <div className="flex w-full items-center gap-2">
                        <div className="relative flex w-full items-center">
                            <Select
                                value={
                                    data.category_id
                                        ? String(data.category_id)
                                        : ''
                                }
                                disabled={disabled}
                                onValueChange={(val) =>
                                    setData(
                                        'category_id',
                                        val ? Number(val) : null,
                                    )
                                }
                            >
                                <SelectTrigger
                                    className={`w-full ${errors.category_id ? 'border-destructive focus:ring-destructive' : ''}`}
                                >
                                    <SelectValue
                                        placeholder={__(
                                            'tickets.pages.form.placeholders.select_category',
                                        )}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((c) => (
                                        <SelectItem
                                            key={c.id}
                                            value={String(c.id)}
                                        >
                                            {renderTicketCategory(c)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {data.category_id && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-8 h-6 w-6 text-muted-foreground hover:text-destructive"
                                    onClick={() => setData('category_id', null)}
                                    disabled={disabled}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                        <CategoriesSheet categories={categories}>
                            <Button type="button" size="icon" variant="outline">
                                <Ellipsis className="h-4 w-4" />
                            </Button>
                        </CategoriesSheet>
                    </div>
                    {errors.category_id && (
                        <p className="text-sm font-medium text-destructive">
                            {errors.category_id}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="asset_id">
                        {__('tickets.filters.equipment')}
                    </Label>
                    <div className="flex w-full items-center gap-2">
                        <div className="relative flex w-full items-center">
                            <Select
                                value={
                                    data.asset_id ? String(data.asset_id) : ''
                                }
                                disabled={disabled}
                                onValueChange={(val) =>
                                    setData(
                                        'asset_id',
                                        val ? Number(val) : null,
                                    )
                                }
                            >
                                <SelectTrigger
                                    className={`w-full ${errors.asset_id ? 'border-destructive focus:ring-destructive' : ''}`}
                                >
                                    <SelectValue
                                        placeholder={__(
                                            'tickets.pages.form.placeholders.select_asset',
                                        )}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {assets.map((a) => (
                                        <SelectItem
                                            key={a.id}
                                            value={String(a.id)}
                                        >
                                            {renderAsset(a)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {data.asset_id && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-8 h-6 w-6 text-muted-foreground hover:text-destructive"
                                    onClick={() => setData('asset_id', null)}
                                    disabled={disabled}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                        <Button
                            asChild
                            type="button"
                            size="icon"
                            variant="outline"
                        >
                            <Link href={route('assets.index')}>
                                <Ellipsis className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                    {errors.asset_id && (
                        <p className="text-sm font-medium text-destructive">
                            {errors.asset_id}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {existingAttachments.length > 0 && (
                    <div className="mb-4 space-y-3">
                        <Label>
                            {__(
                                'tickets.pages.edit.attachments.existing_attachments',
                            )}
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {existingAttachments.map((attachment) => (
                                <div
                                    key={attachment.id}
                                    className="flex items-center justify-between gap-2 rounded-lg border bg-muted/40 p-2 pe-3 transition-all"
                                >
                                    <div className="flex flex-1 items-center gap-3 overflow-hidden">
                                        <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border bg-background">
                                            <FileText className="size-5 text-muted-foreground" />
                                        </div>
                                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                            <p className="truncate text-sm font-medium">
                                                {attachment.file_name ||
                                                    attachment.title ||
                                                    'Sans titre'}
                                            </p>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <p>
                                                    {formatBytes(
                                                        attachment.file_size ||
                                                            0,
                                                    )}
                                                </p>
                                                {attachment.mime_type && (
                                                    <>
                                                        <span>∙</span>
                                                        <p>
                                                            {
                                                                attachment.mime_type
                                                            }
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="icon-sm"
                                                        variant="ghost"
                                                        asChild
                                                    >
                                                        <a
                                                            href={
                                                                attachment.url
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            {attachment.mime_type?.startsWith(
                                                                'image/',
                                                            ) ||
                                                            attachment.mime_type ===
                                                                'application/pdf' ? (
                                                                <SquareArrowOutUpRight className="size-4" />
                                                            ) : (
                                                                <Download className="size-4" />
                                                            )}
                                                        </a>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {__(
                                                        'tickets.pages.edit.attachments.view_or_download',
                                                    )}
                                                </TooltipContent>
                                            </Tooltip>

                                            {!disabled && (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            size="icon-sm"
                                                            variant="ghost"
                                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                            onClick={() =>
                                                                setFileToDelete(
                                                                    attachment,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {__(
                                                            'tickets.pages.edit.attachments.delete_button',
                                                        )}
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}
                                        </TooltipProvider>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <FileUpload
                    value={data.attachments || []}
                    onValueChange={(files) => setData('attachments', files)}
                    accept={config.accept}
                    maxFiles={config.maxFiles}
                    maxSizeMB={config.maxSizeMB}
                    disabled={disabled || remainingSlots === 0}
                    texts={{
                        dropAreaTitle: __(
                            'components.ui.file-upload.dropAreaTitle',
                        ),
                        dropAreaHeader: __(
                            'components.ui.file-upload.dropAreaHeader',
                        ),
                        dropAreaSubtext: __(
                            'components.ui.file-upload.dropAreaSubtext',
                        )
                            .replace(':maxFiles', String(config.maxFiles))
                            .replace(':maxSizeMB', String(config.maxSizeMB))
                            .replace(
                                ':accept',
                                config.accept
                                    .replace(/image\/\*/g, 'images')
                                    .replace(
                                        /application\/pdf/g,
                                        'PDF documents',
                                    ),
                            ),
                        selectButton: __(
                            'components.ui.file-upload.selectButton',
                        ),
                        filesHeader: __(
                            'components.ui.file-upload.filesHeader',
                        ),
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
                        errorPrefix: __(
                            'components.ui.file-upload.errorPrefix',
                        ),
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
            </div>

            <AlertDialog
                open={!!fileToDelete}
                onOpenChange={(open) => !open && setFileToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {__('tickets.pages.edit.attachments.dialog.title')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {__(
                                'tickets.pages.edit.attachments.dialog.description',
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {__('tickets.pages.edit.attachments.dialog.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteAttachment}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {__(
                                'tickets.pages.edit.attachments.dialog.confirm',
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </TabsContent>
    );
}
