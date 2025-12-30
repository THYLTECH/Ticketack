import { FileUpload } from '@/components/file-upload';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Switch } from '@/components/ui/switch';
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
import { FileWithPreview } from '@/hooks/use-file-upload';
import {
    renderAsset,
    renderTicketCategory,
    renderTicketPriority,
    renderTicketStatus,
} from '@/lib/render';
import { useTrans } from '@/lib/translation';
import {
    Asset,
    SharedData,
    TicketCategory,
    TicketPriority,
    TicketStatus,
    User,
} from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Ellipsis,
    Eye,
    EyeOff,
    MinusCircle,
    Plus,
    Search,
    UserMinus,
    X,
} from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { CategoriesSheet } from './relations/categories';
import { PrioritiesSheet } from './relations/priorities';
import { StatusesSheet } from './relations/statuses';

/**
 * Definition of the form data structure to avoid 'any'
 */
interface TicketFormData {
    title: string;
    description: string;
    is_public: boolean;
    priority_id: number | null;
    status_id: number | null;
    category_id: number | null;
    asset_id: number | null;
    attachments: FileWithPreview[];
    assignees: User[];
}

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

    const config = {
        maxFiles: 10,
        maxSizeMB: 10,
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

    return (
        <TabsContent value="informations" className="grid gap-6 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border bg-background p-4 shadow-sm md:col-span-2">
                <div className="space-y-0.5">
                    <Label className="text-base font-semibold">
                        {__('tickets.column.visibility')}
                    </Label>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {data.is_public ? (
                            <>
                                <Eye className="h-4 w-4 text-emerald-600" />{' '}
                                {__('tickets.pages.form.fields.public_label')}
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

            <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="title" indicator="required">
                    {__('tickets.column.title')}
                </Label>
                <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    required
                    placeholder={__('tickets.pages.form.placeholders.title')}
                    disabled={disabled}
                />
                {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                )}
            </div>

            <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="description" indicator="required">
                    Description
                </Label>
                <Textarea
                    id="description"
                    placeholder={__(
                        'tickets.pages.form.placeholders.description',
                    )}
                    className="max-h-[24rem] min-h-[8rem]"
                    value={data.description}
                    required
                    onChange={(e) => setData('description', e.target.value)}
                    disabled={disabled}
                />
                {errors.description && (
                    <p className="text-sm text-destructive">
                        {errors.description}
                    </p>
                )}
            </div>

            <div className="grid gap-2 md:col-span-1">
                <Label htmlFor="priority_id" indicator="required">
                    {__('tickets.column.priority')}
                </Label>
                <div className="flex w-full items-center gap-2">
                    <div className="relative flex w-full items-center">
                        <Select
                            value={
                                data.priority_id ? String(data.priority_id) : ''
                            }
                            disabled={disabled}
                            onValueChange={(val) =>
                                setData('priority_id', val ? Number(val) : null)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue
                                    placeholder={__(
                                        'tickets.pages.form.placeholders.select_priority',
                                    )}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {priorities.map((p) => (
                                    <SelectItem key={p.id} value={String(p.id)}>
                                        {renderTicketPriority(p)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {data.priority_id && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-8 h-6 w-6 text-muted-foreground"
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
            </div>

            <div className="grid gap-2 md:col-span-1">
                <Label htmlFor="status_id" indicator="required">
                    {__('tickets.column.status')}
                </Label>
                <div className="flex w-full items-center gap-2">
                    <div className="relative flex w-full items-center">
                        <Select
                            value={data.status_id ? String(data.status_id) : ''}
                            disabled={disabled}
                            onValueChange={(val) =>
                                setData('status_id', val ? Number(val) : null)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue
                                    placeholder={__(
                                        'tickets.pages.form.placeholders.select_status',
                                    )}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map((s) => (
                                    <SelectItem key={s.id} value={String(s.id)}>
                                        {renderTicketStatus(s)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {data.status_id && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-8 h-6 w-6 text-muted-foreground"
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
            </div>

            <div className="grid gap-2 md:col-span-1">
                <Label htmlFor="category_id" indicator="required">
                    {__('tickets.column.category')}
                </Label>
                <div className="flex w-full items-center gap-2">
                    <div className="relative flex w-full items-center">
                        <Select
                            value={
                                data.category_id ? String(data.category_id) : ''
                            }
                            disabled={disabled}
                            onValueChange={(val) =>
                                setData('category_id', val ? Number(val) : null)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue
                                    placeholder={__(
                                        'tickets.pages.form.placeholders.select_category',
                                    )}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {renderTicketCategory(c)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {data.category_id && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-8 h-6 w-6 text-muted-foreground"
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
            </div>

            <div className="grid gap-2 md:col-span-1">
                <Label htmlFor="asset_id" indicator="required">
                    {__('tickets.filters.equipment')}
                </Label>
                <div className="flex w-full items-center gap-2">
                    <div className="relative flex w-full items-center">
                        <Select
                            value={data.asset_id ? String(data.asset_id) : ''}
                            disabled={disabled}
                            onValueChange={(val) =>
                                setData('asset_id', val ? Number(val) : null)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue
                                    placeholder={__(
                                        'tickets.pages.form.placeholders.select_asset',
                                    )}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {assets.map((a) => (
                                    <SelectItem key={a.id} value={String(a.id)}>
                                        {renderAsset(a)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {data.asset_id && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-8 h-6 w-6 text-muted-foreground"
                                onClick={() => setData('asset_id', null)}
                                disabled={disabled}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                    <Button asChild type="button" size="icon" variant="outline">
                        <Link href={route('assets.index')}>
                            <Ellipsis className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid md:col-span-2">
                <FileUpload
                    value={data.attachments || []}
                    onValueChange={(files) => setData('attachments', files)}
                    accept={config.accept}
                    maxFiles={config.maxFiles}
                    maxSizeMB={config.maxSizeMB}
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
                        )
                            .replace(':maxFiles', String(config.maxFiles))
                            .replace(':maxSizeMB', String(config.maxSizeMB)),
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
    data: { assignees: User[] };
    setData: <K extends keyof TicketFormData>(
        key: K,
        value: TicketFormData[K],
    ) => void;
    users: User[];
    disabled?: boolean;
}) {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');

    const availableUsers = React.useMemo(() => {
        const assignedIds = data.assignees.map((u) => u.id);
        return users.filter((u) => {
            const isNotAssigned = !assignedIds.includes(u.id);
            const matchesSearch =
                u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase());
            return isNotAssigned && matchesSearch;
        });
    }, [users, data.assignees, searchQuery]);

    const handleAddUser = (user: User) => {
        setData('assignees', [...data.assignees, user]);
        setOpen(false);
        setSearchQuery('');
        toast.success(__('tickets.pages.show.comments.notifications.sent'));
    };

    const handleRemoveUser = (userId: number) => {
        setData(
            'assignees',
            data.assignees.filter((u) => u.id !== userId),
        );
        toast.success(__('tickets.pages.show.comments.notifications.deleted'));
    };

    return (
        <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-lg font-medium">
                        {__('tickets.pages.form.tabs.assignees')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {__('tickets.pages.edit.description')}
                    </p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" disabled={disabled}>
                            <Plus className="mr-2 h-4 w-4" />
                            {__(
                                'tickets.pages.show.calendar.notifications.scheduled',
                            )}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="gap-0 p-0 sm:max-w-[500px]">
                        <DialogHeader className="border-b px-6 py-4">
                            <DialogTitle>
                                {__('tickets.pages.form.tabs.assignees')}
                            </DialogTitle>
                            <DialogDescription>
                                {__(
                                    'tickets.pages.show.comments.editor.placeholder',
                                )}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="border-b px-4 py-3">
                            <div className="relative flex items-center">
                                <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder={__(
                                        'tickets.pages.show.tabs.logs_content.search_placeholder',
                                    )}
                                    className="border-none pl-8 shadow-none focus-visible:ring-0"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="max-h-[350px] overflow-y-auto p-2">
                            {availableUsers.length === 0 ? (
                                <div className="flex h-24 flex-col items-center justify-center text-center text-sm text-muted-foreground">
                                    <p>
                                        {__(
                                            'tickets.pages.show.tabs.logs_content.no_results',
                                        )}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {availableUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className="group flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-muted"
                                            onClick={() => handleAddUser(user)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 border">
                                                    <AvatarImage
                                                        src={
                                                            user.avatar?.url ??
                                                            undefined
                                                        }
                                                    />
                                                    <AvatarFallback className="text-xs">
                                                        {user.name
                                                            .substring(0, 2)
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">
                                                        {user.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="h-7 opacity-0 transition-opacity group-hover:opacity-100"
                                            >
                                                {__(
                                                    'tickets.pages.show.calendar.notifications.scheduled',
                                                )}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {data.assignees.length === 0 ? (
                <Empty className="border border-dashed py-10">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <UserMinus />
                        </EmptyMedia>
                        <EmptyTitle>
                            {__(
                                'tickets.pages.show.tabs.info_content.no_assignees',
                            )}
                        </EmptyTitle>
                    </EmptyHeader>
                </Empty>
            ) : (
                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead>
                                    {__('tickets.column.assignee')}
                                </TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.assignees.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="py-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={
                                                        user.avatar?.url ??
                                                        undefined
                                                    }
                                                />
                                                <AvatarFallback className="text-xs">
                                                    {user.name
                                                        .substring(0, 2)
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium">
                                                        {user.name}
                                                    </span>
                                                    {user.id ===
                                                        auth.user.id && (
                                                        <Badge
                                                            variant="outline"
                                                            className="h-5 px-1.5 text-[10px]"
                                                        >
                                                            You
                                                        </Badge>
                                                    )}
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles &&
                                            user.roles.length > 0 ? (
                                                user.roles.map((role) => (
                                                    <Badge
                                                        key={role.id}
                                                        variant="secondary"
                                                        className="font-normal"
                                                    >
                                                        {role.name}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <span className="text-xs text-muted-foreground">
                                                    -
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {!disabled && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() =>
                                                    handleRemoveUser(user.id)
                                                }
                                            >
                                                <MinusCircle className="h-4 w-4" />
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
