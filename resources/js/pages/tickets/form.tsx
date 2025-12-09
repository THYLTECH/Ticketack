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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

// Custom Components
import { CategoriesSheet } from './relations/categories';
import { PrioritiesSheet } from './relations/priorities';
import { StatusesSheet } from './relations/statuses';

// Types
import {
    Asset,
    SharedData,
    TicketCategory,
    TicketPriority,
    TicketStatus,
    User,
} from '@/types';

// Icons
import { Link, usePage } from '@inertiajs/react';
import {
    Ellipsis,
    MinusCircle,
    Plus,
    PlusCircle,
    UserMinus,
    X,
} from 'lucide-react';
import { toast } from 'sonner';

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

    // Ensure selected relations still exist
    React.useEffect(() => {
        // Priority
        if (
            data.priority_id &&
            !priorities.find((priority) => priority.id === data.priority_id)
        ) {
            setData('priority_id', null);
        }
        // Category
        if (
            data.category_id &&
            !categories.find((category) => category.id === data.category_id)
        ) {
            setData('category_id', null);
        }
        // Status
        if (
            data.status_id &&
            !statuses.find((status) => status.id === data.status_id)
        ) {
            setData('status_id', null);
        }
    }, [priorities, statuses, categories]);

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
                <Label htmlFor="priority_id" indicator="required">
                    Priority
                </Label>
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
                                    <SelectItem disabled value=" ">
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
                        <PrioritiesSheet priorities={priorities}>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    size={'icon'}
                                    variant={'outline'}
                                >
                                    <Ellipsis />
                                </Button>
                            </TooltipTrigger>
                        </PrioritiesSheet>
                        <TooltipContent>Manage Priorities</TooltipContent>
                    </Tooltip>
                </div>
            </div>

            {/* Status */}
            <div className="grid gap-2 md:col-span-1">
                <Label htmlFor="status_id" indicator="required">
                    Status
                </Label>
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
                                    <SelectItem disabled value=" ">
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
                        <StatusesSheet statuses={statuses}>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    size={'icon'}
                                    variant={'outline'}
                                >
                                    <Ellipsis />
                                </Button>
                            </TooltipTrigger>
                        </StatusesSheet>
                        <TooltipContent>Manage Statuses</TooltipContent>
                    </Tooltip>
                </div>
            </div>

            {/* Category */}
            <div className="grid gap-2 md:col-span-1">
                <Label htmlFor="category_id" indicator="required">
                    Category
                </Label>
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
                                    <SelectItem disabled value=" ">
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
                        <CategoriesSheet categories={categories}>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    size={'icon'}
                                    variant={'outline'}
                                >
                                    <Ellipsis />
                                </Button>
                            </TooltipTrigger>
                        </CategoriesSheet>
                        <TooltipContent>Manage Categories</TooltipContent>
                    </Tooltip>
                </div>
            </div>

            {/* Asset */}
            <div className="grid gap-2 md:col-span-1">
                <Label htmlFor="asset_id" indicator="required">
                    Asset
                </Label>
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
                                    <SelectItem disabled value=" ">
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
                            <Button
                                type="button"
                                size={'icon'}
                                variant={'outline'}
                                asChild
                            >
                                <Link href={route('assets.index')}>
                                    <Ellipsis />
                                </Link>
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

export function UsersTab({
    data,
    setData,
    users,
    disabled = false,
}: {
    // Change these any types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setData: any;
    users: User[];
    disabled?: boolean;
}) {
    const __ = useTrans();

    const { auth } = usePage<SharedData>().props;

    const [open, setOpen] = React.useState(false);
    const [tempUsersAssigned, setTempUsersAssigned] = React.useState<User[]>(
        users || [],
    );

    const handleAddUser = (user: User) => {
        setData('assignees', [...data.assignees, user]);
        setTempUsersAssigned(
            tempUsersAssigned.filter((u: User) => u.id !== user.id),
        );
        setOpen(false);
        toast.success(__('User added successfully.'));
    };

    const handleRemoveUser = (user: User) => {
        setData(
            'assignees',
            data.assignees.filter((u: User) => u.id !== user.id),
        );
        setTempUsersAssigned([...tempUsersAssigned, user]);
        toast.success(__('User removed successfully.'));
    };

    return (
        <TabsContent value={'users'} className="grid gap-4">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {data.assignees.length !== 0 && !disabled && (
                        <Button
                            variant={'outline'}
                            size={'sm'}
                            className="w-max"
                            type="button"
                        >
                            <Plus />
                            Assign users
                        </Button>
                    )}
                </DialogTrigger>
                <DialogContent className="!max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Assign users</DialogTitle>
                        <DialogDescription>
                            Select users you want to assign to this ticket.
                        </DialogDescription>
                    </DialogHeader>
                    {tempUsersAssigned.length === 0 ? (
                        <Empty className="gap-2 border border-dashed !p-8">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <UserMinus />
                                </EmptyMedia>
                                <EmptyTitle>No users fournd.</EmptyTitle>
                                <EmptyDescription>
                                    All users have been assigned to this ticket.
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    ) : (
                        <>
                            <div className="overflow-hidden rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Roles</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {tempUsersAssigned.map((user: User) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="space-x-3">
                                                    <span>{user.name}</span>
                                                    {user.id ===
                                                        auth.user.id && (
                                                        <Badge>You</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {user.email}
                                                </TableCell>
                                                <TableCell>
                                                    {user.roles &&
                                                        user.roles.map(
                                                            (role) => (
                                                                <Badge
                                                                    key={
                                                                        role.id
                                                                    }
                                                                    className="mr-2"
                                                                    variant={
                                                                        'secondary'
                                                                    }
                                                                >
                                                                    {role.name}
                                                                </Badge>
                                                            ),
                                                        )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {!disabled && (
                                                        <Button
                                                            size={'sm'}
                                                            type="button"
                                                            onClick={() =>
                                                                handleAddUser(
                                                                    user,
                                                                )
                                                            }
                                                        >
                                                            <PlusCircle />
                                                            Assign
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {data.assignees.length === 0 ? (
                <Empty className="gap-2 border border-dashed !p-8">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <UserMinus />
                        </EmptyMedia>
                        <EmptyTitle>No users assigned.</EmptyTitle>
                        <EmptyDescription>
                            Assign users to this ticket to allow them to view
                            and manage it.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        {!disabled && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setOpen(true)}
                                type="button"
                            >
                                <Plus />
                                Assign users
                            </Button>
                        )}
                    </EmptyContent>
                </Empty>
            ) : (
                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Roles</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.assignees.map((user: User) => (
                                <TableRow key={user.id}>
                                    <TableCell className="space-x-3">
                                        <span>{user.name}</span>
                                        {user.id === auth.user.id && (
                                            <Badge>You</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        {user.roles &&
                                            user.roles.map((role) => (
                                                <Badge
                                                    key={role.id}
                                                    className="mr-2"
                                                    variant={'secondary'}
                                                >
                                                    {role.name}
                                                </Badge>
                                            ))}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {!disabled && (
                                            <Button
                                                size={'sm'}
                                                type="button"
                                                variant={'outline'}
                                                onClick={() =>
                                                    handleRemoveUser(user)
                                                }
                                            >
                                                <MinusCircle />
                                                Remove
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </TabsContent>
    );
}

// ---------------------------------------
//  Sheets
// ---------------------------------------

interface CommonSheetProps {
    children: React.ReactNode;
}
