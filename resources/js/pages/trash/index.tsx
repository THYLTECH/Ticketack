import { useState, useCallback, useEffect, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import { debounce } from 'lodash';

// Layout
import AppLayout from '@/layouts/app/layout';

// Composants Custom
import LaravelPagination from '@/components/LaravelPagination';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Custom functions
import { formatDate, cn } from '@/lib/utils';

// Types
import type { BreadcrumbItem } from '@/types';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

// Icons
import {
    RotateCcw,
    Trash2,
    User,
    Box,
    Shield,
    Search,
    X,
    AlertTriangle,
    CheckCircle2,
    type LucideIcon
} from 'lucide-react';

// --- Interfaces ---

interface DeletedItem {
    id: number;
    name?: string;
    title?: string;
    email?: string;
    deleted_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData<T> {
    data: T[];
    links: PaginationLink[];
    total: number;
}

interface TrashIndexProps {
    deletedUsers: PaginatedData<DeletedItem>;
    deletedRoles: PaginatedData<DeletedItem>;
    deletedAssets: PaginatedData<DeletedItem>;
    filters?: { search?: string };
}

type DeleteActionType = 'single' | 'bulk';

export default function TrashIndex({ deletedUsers, deletedRoles, deletedAssets, filters }: TrashIndexProps) {
    const __ = useTrans();

    const [itemToDelete, setItemToDelete] = useState<{ id?: number; type: string; name?: string } | null>(null);
    const [deleteActionType, setDeleteActionType] = useState<DeleteActionType>('single');
    const [isDeleting, setIsDeleting] = useState(false);

    const [search, setSearch] = useState(filters?.search || '');
    const [activeTab, setActiveTab] = useState<'users' | 'assets' | 'roles'>('users');

    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    useEffect(() => {
        setSelectedIds([]);
    }, [activeTab, search, deletedUsers, deletedRoles, deletedAssets]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('dashboard.pages.breadcrumbs.dashboard'),
            href: route('dashboard'),
        },
        {
            title: __('trash.pages.breadcrumbs.index'),
            href: route('trash.index'),
        },
    ];

    const debouncedSearch = useMemo(
        () =>
            debounce((value: string) => {
                router.get(
                    route('trash.index'),
                    { search: value },
                    { preserveState: true, preserveScroll: true, replace: true }
                );
            }, 400),
        []
    );

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        debouncedSearch(value);
    };

    const clearSearch = () => {
        setSearch('');
        debouncedSearch('');
    };

    const handleSelectAll = (checked: boolean, data: DeletedItem[]) => {
        if (checked) {
            setSelectedIds(data.map(item => item.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (checked: boolean, id: number) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(itemId => itemId !== id));
        }
    };

    const handleRestore = (type: string, id: number) => {
        router.put(route('trash.restore', { type, id }), {}, {
            preserveScroll: true,
        });
    };

    const handleBulkRestore = () => {
        if (selectedIds.length === 0) return;

        router.post(route('trash.bulk-restore'), {
            type: activeTab === 'users' ? 'user' : activeTab === 'assets' ? 'asset' : 'role',
            ids: selectedIds
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedIds([]);
            }
        });
    };

    const confirmForceDelete = (type: string, item: DeletedItem) => {
        setDeleteActionType('single');
        setItemToDelete({
            id: item.id,
            type,
            name: item.name || item.title || __('trash.common.item_unnamed')
        });
    };

    const confirmBulkDelete = () => {
        if (selectedIds.length === 0) return;
        setDeleteActionType('bulk');
        setItemToDelete({
            type: activeTab === 'users' ? 'user' : activeTab === 'assets' ? 'asset' : 'role',
            name: `${selectedIds.length} ${__('trash.common.items')}`
        });
    };

    const handleExecuteDelete = () => {
        if (!itemToDelete) return;
        setIsDeleting(true);

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setItemToDelete(null);
                setSelectedIds([]);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
            onError: () => {
                setIsDeleting(false);
            }
        };

        if (deleteActionType === 'bulk') {
            router.post(route('trash.bulk-force-delete'), {
                ids: selectedIds,
                type: itemToDelete.type
            }, options);
        } else {
            router.delete(route('trash.force-delete', {
                type: itemToDelete.type,
                id: itemToDelete.id
            }), options);
        }
    };
    const TrashTable = ({ data, links, type, icon: Icon, label }: { data: DeletedItem[], links: PaginationLink[], type: string, icon: LucideIcon, label: string }) => {
        if (data.length === 0) {
            const searchDesc = __('trash.pages.index.empty.search_description');
            const typeDesc = __('trash.pages.index.empty.description');

            const emptyDescription = search
                ? searchDesc.replace('{term}', search).replace(':term', search)
                : typeDesc.replace('{type}', label.toLowerCase()).replace(':type', label.toLowerCase());

            return (
                <Empty className="border border-dashed mt-4">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            {search ? <Search /> : <Icon />}
                        </EmptyMedia>
                        <EmptyTitle>
                            {search ? __('trash.pages.index.empty.search_title') : __('trash.pages.index.empty.title')}
                        </EmptyTitle>
                        <EmptyDescription>
                            {emptyDescription}
                        </EmptyDescription>
                    </EmptyHeader>
                    {search && (
                        <EmptyContent>
                            <Button variant="outline" size="sm" onClick={clearSearch}>
                                <X className="mr-2 h-4 w-4" />
                                {__('trash.pages.index.buttons.clear_search')}
                            </Button>
                        </EmptyContent>
                    )}
                </Empty>
            );
        }

        const allSelected = data.length > 0 && selectedIds.length === data.length;

        return (
            <div className="space-y-4">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40px]">
                                    <Checkbox
                                        checked={allSelected}
                                        onCheckedChange={(checked) => handleSelectAll(checked as boolean, data)}
                                        aria-label="Select all"
                                    />
                                </TableHead>

                                <TableHead className="w-[50px]"></TableHead>

                                <TableHead className="text-xs text-muted-foreground text-left">
                                    {__('trash.pages.index.table.headers.name')}
                                </TableHead>

                                <TableHead className="w-[12rem] text-xs text-muted-foreground text-left">
                                    {__('trash.pages.index.table.headers.deleted_at')}
                                </TableHead>

                                <TableHead className="w-[8rem] text-xs text-muted-foreground text-left">
                                    {__('trash.pages.index.table.headers.actions')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id} className="relative hover:bg-muted/50 transition-colors group">
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedIds.includes(item.id)}
                                            onCheckedChange={(checked) => handleSelectRow(checked as boolean, item.id)}
                                            aria-label={`Select ${item.name}`}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center justify-start pl-2">
                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-left">
                                        <div className="font-medium">
                                            {item.name || item.title || __('trash.common.unknown')}
                                        </div>
                                        {item.email && (
                                            <div className="text-xs text-muted-foreground">
                                                {item.email}
                                            </div>
                                        )}
                                    </TableCell>

                                    <TableCell className="text-left">
                                        {formatDate(item.deleted_at)}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex justify-start items-center gap-1">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                            onClick={() => handleRestore(type, item.id)}
                                                        >
                                                            <RotateCcw className="h-4 w-4" />
                                                            <span className="sr-only">{__('trash.pages.index.buttons.restore')}</span>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>{__('trash.pages.index.buttons.restore')}</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() => confirmForceDelete(type, item)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="sr-only">{__('trash.pages.index.buttons.force_delete')}</span>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>{__('trash.pages.index.buttons.force_delete')}</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {selectedIds.length > 0 && (
                    <div className="flex items-center justify-between bg-primary/5 border border-primary/20 p-2 rounded-md animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-2 px-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">
                                {selectedIds.length} {__('trash.common.selected')}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="h-8 bg-background border-primary/20 hover:bg-background/80" onClick={handleBulkRestore}>
                                <RotateCcw className="mr-2 h-3 w-3" />
                                {__('trash.buttons.restore_selected')}
                            </Button>
                            <Button size="sm" variant="destructive" className="h-8" onClick={confirmBulkDelete}>
                                <Trash2 className="mr-2 h-3 w-3" />
                                {__('trash.buttons.delete_selected')}
                            </Button>
                        </div>
                    </div>
                )}

                <div className="mt-4">
                    <LaravelPagination links={links} />
                </div>
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('trash.pages.index.head_title')} />

            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="text-left">
                            <CardTitle>{__('trash.pages.index.title')}</CardTitle>
                            <CardDescription className="mt-1.5">
                                {__('trash.pages.index.description')}
                            </CardDescription>
                        </div>

                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder={__('trash.pages.index.search_placeholder')}
                                className="pl-9 pr-8 h-9"
                                value={search}
                                onChange={handleSearchChange}
                            />
                            {search && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                    </div>
                </CardHeader>
                <Separator />

                <CardContent className="p-0">
                    <div className="flex w-full border-b px-4">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-[1px]",
                                activeTab === 'users'
                                    ? "border-primary text-foreground"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <User className="h-4 w-4" />
                            {__('trash.tabs.users')}
                            {deletedUsers.total > 0 && (
                                <Badge variant="secondary" className="ml-1.5 px-1.5 h-5 text-[10px]">
                                    {deletedUsers.total}
                                </Badge>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('assets')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-[1px]",
                                activeTab === 'assets'
                                    ? "border-primary text-foreground"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Box className="h-4 w-4" />
                            {__('trash.tabs.assets')}
                            {deletedAssets.total > 0 && (
                                <Badge variant="secondary" className="ml-1.5 px-1.5 h-5 text-[10px]">
                                    {deletedAssets.total}
                                </Badge>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('roles')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-[1px]",
                                activeTab === 'roles'
                                    ? "border-primary text-foreground"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Shield className="h-4 w-4" />
                            {__('trash.tabs.roles')}
                            {deletedRoles.total > 0 && (
                                <Badge variant="secondary" className="ml-1.5 px-1.5 h-5 text-[10px]">
                                    {deletedRoles.total}
                                </Badge>
                            )}
                        </button>
                    </div>

                    <div className="p-6 pt-10 relative">
                        {activeTab === 'users' && (
                            <TrashTable
                                data={deletedUsers.data}
                                links={deletedUsers.links}
                                type="user"
                                icon={User}
                                label={__('trash.tabs.users')}
                            />
                        )}

                        {activeTab === 'assets' && (
                            <TrashTable
                                data={deletedAssets.data}
                                links={deletedAssets.links}
                                type="asset"
                                icon={Box}
                                label={__('trash.tabs.assets')}
                            />
                        )}

                        {activeTab === 'roles' && (
                            <TrashTable
                                data={deletedRoles.data}
                                links={deletedRoles.links}
                                type="role"
                                icon={Shield}
                                label={__('trash.tabs.roles')}
                            />
                        )}
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{__('trash.modals.delete.title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {deleteActionType === 'bulk'
                                ? __('trash.modals.delete.bulk_description_prefix')
                                : __('trash.modals.delete.description_prefix')
                            }{' '}
                            <span className="font-bold text-foreground">
                                {itemToDelete?.name}
                            </span>.
                            <br/>
                            <span className="text-red-600 font-medium mt-2 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                {__('trash.modals.delete.warning')}
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            {__('trash.modals.delete.buttons.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => { e.preventDefault(); handleExecuteDelete(); }}
                            className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
                            disabled={isDeleting}
                        >
                            {isDeleting
                                ? __('trash.modals.delete.buttons.deleting')
                                : __('trash.modals.delete.buttons.confirm')
                            }
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
