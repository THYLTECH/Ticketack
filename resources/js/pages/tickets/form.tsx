// resources/js/pages/tickets/form.tsx

// Necessary imports
import * as React from 'react';

// Hooks
import { FileWithPreview } from '@/hooks/use-file-upload';
import { useTrans } from '@/lib/translation';

// Utils
import {
    renderAsset,
    renderTicketCategory,
    renderTicketPriority,
    renderTicketStatus,
} from '@/lib/render';

// Shadnc UI Components
import { FileUpload } from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

// Types
import { Asset, TicketCategory, TicketPriority, TicketStatus } from '@/types';

// Icons
import { Ellipsis, X } from 'lucide-react';
import { PrioritiesSheet } from './relations/priorities';

// ---------------------------------------
//  Tabs
// ---------------------------------------

interface InformationsTabProps {
    errors: Record<string, string>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setData: any;
    disabled?: boolean;

    priorities: TicketPriority[];
    statuses: TicketStatus[];
    categories: TicketCategory[];
    assets: Asset[];
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
}: InformationsTabProps) {
    const __ = useTrans();

    const maxFiles = 10;
    const maxSizeMB = 10;
    const accept = 'image/*,application/pdf';

    return (
        <TabsContent
            value={'informations'}
            className="grid gap-4 md:grid-cols-2"
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
                    placeholder="eg. Server not responding"
                    aria-invalid={errors.title ? 'true' : 'false'}
                    autoFocus
                    disabled={disabled}
                />
            </div>

            <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="description" indicator={'required'}>
                    Description
                </Label>
                <Textarea
                    id="description"
                    name="description"
                    placeholder="eg. The main server is not responding since 3 PM..."
                    className="max-h-[24rem] min-h-[8rem]"
                    value={data.description}
                    required
                    onChange={(e) => setData('description', e.target.value)}
                    disabled={disabled}
                />
            </div>

            {/* Priority */}
            <div className="grid gap-2 md:col-span-1">
                <Label htmlFor="priority_id">Priority</Label>
                <div className="flex w-full items-center gap-2">
                    {/* Select Priorities */}
                    <div className="flex w-full items-center gap-2">
                        <Select
                            value={String(data.priority_id || '')}
                            name="priority_id"
                            disabled={disabled}
                            required
                            onValueChange={(value: string) =>
                                setData('priority_id', Number(value) || '')
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                {priorities?.map((priority) => (
                                    <SelectItem
                                        key={priority.id}
                                        value={String(priority.id)}
                                        disabled={data.id === priority.id}
                                    >
                                        {renderTicketPriority(priority)}
                                    </SelectItem>
                                ))}

                                {priorities.length === 0 && (
                                    <SelectItem disabled value=' '>
                                        No priorities found.
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>

                        {data.priority_id && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={'outline'}
                                        size={'icon'}
                                        onClick={() =>
                                            setData('priority_id', null)
                                        }
                                        disabled={disabled}
                                    >
                                        <X />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Clear</TooltipContent>
                            </Tooltip>
                        )}
                    </div>

                    {/* Manage priorities */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <PrioritiesSheet priorities={priorities}>
                                <Button type="button" size={'icon'}>
                                    <Ellipsis />
                                </Button>
                            </PrioritiesSheet>
                        </TooltipTrigger>
                        <TooltipContent>Manage Priorities</TooltipContent>
                    </Tooltip>
                </div>
            </div>

            {/* Status */}
            <div className="grid gap-2 md:col-span-1">
                <Label htmlFor="status_id">Status</Label>
                <div className="flex w-full items-center gap-2">
                    {/* Select Status */}
                    <div className="flex w-full items-center gap-2">
                        <Select
                            value={String(data.status_id || '')}
                            disabled={disabled}
                            name="status_id"
                            required
                            onValueChange={(value: string) =>
                                setData('status_id', Number(value) || '')
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses?.map((status) => (
                                    <SelectItem
                                        key={status.id}
                                        value={String(status.id)}
                                        disabled={data.id === status.id}
                                    >
                                        {renderTicketStatus(status)}
                                    </SelectItem>
                                ))}
                                {statuses.length === 0 && (
                                    <SelectItem disabled value=' '>
                                        No statuses found.
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>

                        {data.status_id && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={'outline'}
                                        size={'icon'}
                                        onClick={() =>
                                            setData('status_id', null)
                                        }
                                        disabled={disabled}
                                    >
                                        <X />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Clear</TooltipContent>
                            </Tooltip>
                        )}
                    </div>

                    {/* Manage Statuses */}

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button type="button" size={'icon'}>
                                <Ellipsis />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Manage Statuses</TooltipContent>
                    </Tooltip>
                </div>
            </div>

            {/* Category */}
            <div className="grid gap-2 md:col-span-1">
                <Label htmlFor="category_id">Category</Label>
                <div className="flex w-full items-center gap-2">
                    {/* Select Categories */}
                    <div className="flex w-full items-center gap-2">
                        <Select
                            value={String(data.category_id || '')}
                            name="category_id"
                            disabled={disabled}
                            required
                            onValueChange={(value: string) =>
                                setData('category_id', Number(value) || '')
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories?.map((category) => (
                                    <SelectItem
                                        key={category.id}
                                        value={String(category.id)}
                                        disabled={data.id === category.id}
                                    >
                                        {renderTicketCategory(category)}
                                    </SelectItem>
                                ))}
                                {categories.length === 0 && (
                                    <SelectItem disabled value=' '>
                                        No categories found.
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>

                        {data.category_id && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={'outline'}
                                        size={'icon'}
                                        onClick={() =>
                                            setData('category_id', null)
                                        }
                                        disabled={disabled}
                                    >
                                        <X />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Clear</TooltipContent>
                            </Tooltip>
                        )}
                    </div>

                    {/* Manage categories */}

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button type="button" size={'icon'}>
                                <Ellipsis />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Manage Categories</TooltipContent>
                    </Tooltip>
                </div>
            </div>

            {/* Asset */}
            <div className="grid gap-2 md:col-span-1">
                <Label htmlFor="asset_id">Asset</Label>
                <div className="flex w-full items-center gap-2">
                    {/* Select Asset */}
                    <div className="flex w-full items-center gap-2">
                        <Select
                            value={String(data.asset_id || '')}
                            disabled={disabled}
                            name="asset_id"
                            required
                            onValueChange={(value: string) =>
                                setData('asset_id', Number(value) || '')
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Asset" />
                            </SelectTrigger>
                            <SelectContent>
                                {assets?.map((asset) => (
                                    <SelectItem
                                        key={asset.id}
                                        value={String(asset.id)}
                                        disabled={data.id === asset.id}
                                    >
                                        {renderAsset(asset)}
                                    </SelectItem>
                                ))}
                                {assets.length === 0 && (
                                    <SelectItem disabled value=' '>
                                        No assets found.
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>

                        {data.asset_id && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={'outline'}
                                        size={'icon'}
                                        onClick={() =>
                                            setData('asset_id', null)
                                        }
                                        disabled={disabled}
                                    >
                                        <X />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Clear</TooltipContent>
                            </Tooltip>
                        )}
                    </div>

                    {/* Manage Assets */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button type="button" size={'icon'}>
                                <Ellipsis />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Manage Assets</TooltipContent>
                    </Tooltip>
                </div>
            </div>

            <div className="grid md:col-span-2">
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
        </TabsContent>
    );
}

// ---------------------------------------
//  Sheets
// ---------------------------------------

interface CommonSheetProps {
    children: React.ReactNode;
}

interface StatusesSheetProps extends CommonSheetProps {
    statuses: TicketStatus[];
}

function StatusesSheet({ children, statuses }: StatusesSheetProps) {}

interface CategoriesSheetProps extends CommonSheetProps {
    categories: TicketCategory[];
}

function CategoriesSheet({ children, categories }: CategoriesSheetProps) {}

interface AssetsSheetProps extends CommonSheetProps {
    assets: Asset[];
}
function AssetsSheet({ children, assets }: AssetsSheetProps) {}
