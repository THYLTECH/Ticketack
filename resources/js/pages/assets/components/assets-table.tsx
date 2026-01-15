import { SortableTableHead } from '@/components/sortable-table-head';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useTrans } from '@/lib/translation';
import { cn, formatDate, getIcon, userHasPermission } from '@/lib/utils';
import type { Asset, SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import {
    ChevronDown,
    Eye,
    ListTree,
    MoreHorizontal,
    Pencil,
    Trash,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

interface Props {
    assets: Asset[];
    searchTerm: string;
    globalExpand: boolean | null;
    setGlobalExpand: (val: boolean | null) => void;
}

type SortField = 'title' | 'updated_at' | 'created_at';
type SortDirection = 'asc' | 'desc';

export function AssetsTable({
    assets,
    searchTerm,
    globalExpand,
    setGlobalExpand,
}: Props) {
    const __ = useTrans();
    const [openState, setOpenState] = useState<Record<string, boolean>>({});
    const [deleteConfirm, setDeleteConfirm] = useState<{
        isOpen: boolean;
        id?: number | string;
    }>({ isOpen: false });

    const params = new URLSearchParams(window.location.search);
    const sortField = (params.get('sort') as SortField) || 'created_at';
    const sortDirection = (params.get('direction') as SortDirection) || 'desc';

    const assetIds = useMemo(
        () => new Set(assets.map((a) => String(a.id))),
        [assets],
    );

    const assetsByParent = useMemo(() => {
        const grouped: Record<string, Asset[]> = {};

        assets.forEach((asset) => {
            const pid = asset.parent_id ? Number(asset.parent_id) : null;
            const isOrphan = pid && !assetIds.has(String(pid));
            const parentKey = isOrphan || !pid ? 'root' : String(pid);

            if (!grouped[parentKey]) {
                grouped[parentKey] = [];
            }
            grouped[parentKey].push(asset);
        });

        return grouped;
    }, [assets, assetIds]);

    useEffect(() => {
        if (globalExpand !== null) {
            const newState: Record<string, boolean> = {};
            assets.forEach((a) => (newState[String(a.id)] = globalExpand));
            setOpenState(newState);
            const timer = setTimeout(() => setGlobalExpand(null), 100);
            return () => clearTimeout(timer);
        }
    }, [globalExpand, assets, setGlobalExpand]);

    useEffect(() => {
        if (searchTerm.trim()) {
            const newState: Record<string, boolean> = {};
            assets.forEach((a) => (newState[String(a.id)] = true));
            setOpenState(newState);
        }
    }, [searchTerm, assets]);

    const toggleNode = (id: number | string) => {
        const idStr = String(id);
        setOpenState((prev) => ({ ...prev, [idStr]: !prev[idStr] }));
    };

    const handleSort = (field: string) => {
        const newDirection =
            sortField === field && sortDirection === 'desc' ? 'asc' : 'desc';

        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('sort', field);
        currentUrl.searchParams.set('direction', newDirection);

        router.get(
            currentUrl.toString(),
            {},
            { preserveState: true, replace: true, preserveScroll: true },
        );
    };

    const confirmDelete = () => {
        if (deleteConfirm.id) {
            router.delete(route('assets.destroy', deleteConfirm.id), {
                onFinish: () => setDeleteConfirm({ isOpen: false }),
            });
        }
    };

    const sortNodes = (nodes: Asset[]) => {
        return [...nodes].sort((a, b) => {
            let valA: string | number = '';
            let valB: string | number = '';

            switch (sortField) {
                case 'title':
                    valA = a.title.toLowerCase();
                    valB = b.title.toLowerCase();
                    break;
                case 'updated_at':
                    valA = new Date(a.updated_at).getTime();
                    valB = new Date(b.updated_at).getTime();
                    break;
                case 'created_at':
                    valA = new Date(a.created_at).getTime();
                    valB = new Date(b.created_at).getTime();
                    break;
                default:
                    return 0;
            }

            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const renderRows = (parentId: string) => {
        const children = assetsByParent[parentId];
        if (!children || children.length === 0) return null;

        const sortedChildren = sortNodes(children);

        return sortedChildren.map((asset) => (
            <AssetRow
                key={asset.id}
                asset={asset}
                assetsByParent={assetsByParent}
                openState={openState}
                toggleNode={toggleNode}
                renderAssetRows={renderRows}
                searchTerm={searchTerm}
                onDeleteClick={(id) => setDeleteConfirm({ isOpen: true, id })}
            />
        ));
    };

    return (
        <>
            <div className="w-full overflow-hidden rounded-lg border bg-background shadow-sm">
                <div className="relative overflow-x-auto">
                    <Table className="min-w-full">
                        <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent">
                                <SortableTableHead
                                    label={__(
                                        'assets.pages.index.table.headers.asset',
                                    )}
                                    column="title"
                                    currentSort={sortField}
                                    currentDirection={sortDirection}
                                    onSort={handleSort}
                                    className="w-full min-w-50 pl-6 md:w-[40%]"
                                />
                                <TableHead className="hidden w-[25%] text-center font-semibold text-foreground md:table-cell">
                                    {__(
                                        'assets.pages.index.table.headers.attributes',
                                    )}
                                </TableHead>
                                <SortableTableHead
                                    label={__(
                                        'assets.pages.index.table.headers.updated_at',
                                    )}
                                    column="updated_at"
                                    currentSort={sortField}
                                    currentDirection={sortDirection}
                                    onSort={handleSort}
                                    className="hidden w-[15%] text-right lg:table-cell"
                                />
                                <SortableTableHead
                                    label={__(
                                        'assets.pages.index.table.headers.created_at',
                                    )}
                                    column="created_at"
                                    currentSort={sortField}
                                    currentDirection={sortDirection}
                                    onSort={handleSort}
                                    className="hidden w-[15%] pr-6 text-right lg:table-cell"
                                />
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>{renderRows('root')}</TableBody>
                    </Table>
                </div>
            </div>

            <AlertDialog
                open={deleteConfirm.isOpen}
                onOpenChange={(open) =>
                    !open &&
                    setDeleteConfirm({ ...deleteConfirm, isOpen: false })
                }
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {__('assets.pages.delete.title')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {__('assets.pages.delete.description') ||
                                'Are you sure you want to delete this asset? This action cannot be undone.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {__('assets.pages.delete.buttons.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {__('assets.pages.delete.buttons.confirm')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

interface AssetRowProps {
    asset: Asset;
    assetsByParent: Record<string, Asset[]>;
    openState: Record<string, boolean>;
    toggleNode: (id: number | string) => void;
    renderAssetRows: (parentId: string) => React.ReactNode;
    searchTerm: string;
    onDeleteClick: (id: number | string) => void;
}

function AssetRow({
    asset,
    assetsByParent,
    openState,
    toggleNode,
    renderAssetRows,
    searchTerm,
    onDeleteClick,
}: AssetRowProps) {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;
    const assetIdStr = String(asset.id);

    const hasChildren = assetsByParent[assetIdStr]?.length > 0;
    const isOpen = openState[assetIdStr] || false;

    const depthLevel = asset.depth_level || 0;
    const indentation = depthLevel * 20;

    const Icon = asset.icon ? getIcon(asset.icon) : null;

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleNode(asset.id);
    };

    const handleRowClick = () => {
        if (userHasPermission({ user: auth.user, permission: 'show assets' })) {
            router.get(route('assets.show', { asset: asset.id }));
        }
    };

    const highlightText = (text: string | null, highlight: string) => {
        if (!text) return null;
        if (!highlight || !highlight.trim()) return text;

        const escapedHighlight = highlight.replace(
            /[.*+?^${}()|[\]\\]/g,
            '\\$&',
        );
        const parts = text.split(new RegExp(`(${escapedHighlight})`, 'gi'));

        return parts.map((part, i) =>
            part.toLowerCase() === highlight.toLowerCase() ? (
                <span
                    key={i}
                    className="rounded-[2px] bg-yellow-200 px-0.5 font-medium text-yellow-900 dark:bg-yellow-900/50 dark:text-yellow-200"
                >
                    {part}
                </span>
            ) : (
                part
            ),
        );
    };

    const isMatch = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        const titleMatch = asset.title.toLowerCase().includes(lowerSearch);
        const descMatch =
            asset.description &&
            asset.description.toLowerCase().includes(lowerSearch);
        const attrMatch = asset.attributes.some(
            (a) =>
                a.key.toLowerCase().includes(lowerSearch) ||
                a.value.toLowerCase().includes(lowerSearch),
        );
        return searchTerm && (titleMatch || descMatch || attrMatch);
    }, [searchTerm, asset]);

    const isDescriptionMatch =
        searchTerm &&
        asset.description &&
        asset.description.toLowerCase().includes(searchTerm.toLowerCase());

    return (
        <React.Fragment>
            <TableRow
                className={cn(
                    'group h-12 cursor-pointer border-b border-border/40 transition-all hover:bg-muted/40',
                    isMatch &&
                        'bg-blue-50/50 hover:bg-blue-50/80 dark:bg-blue-900/10 dark:hover:bg-blue-900/20',
                )}
                onClick={handleRowClick}
            >
                <TableCell className="relative py-2 pl-4 align-middle md:pl-6">
                    <div
                        className="flex items-center gap-2"
                        style={{ paddingLeft: `${indentation}px` }}
                    >
                        {depthLevel > 0 && (
                            <>
                                <div
                                    className="absolute bottom-0 top-0 w-px bg-border/40"
                                    style={{
                                        left: `calc(1rem + ${indentation - 20}px + 10px)`,
                                    }}
                                />
                                <div
                                    className="absolute h-px w-2.5 bg-border/40"
                                    style={{
                                        left: `calc(1rem + ${indentation - 20}px + 10px)`,
                                    }}
                                />
                            </>
                        )}

                        {hasChildren ? (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleToggle}
                                className={cn(
                                    'z-10 h-6 w-6 shrink-0 rounded-md text-muted-foreground transition-transform duration-200 hover:bg-background/80 hover:text-foreground',
                                    isOpen ? 'rotate-180' : '-rotate-90',
                                )}
                            >
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        ) : (
                            <div className="h-6 w-6 shrink-0" />
                        )}

                        <div className="flex min-w-0 items-center gap-3">
                            <div
                                className={cn(
                                    'hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-background/50 shadow-sm transition-colors sm:flex',
                                    isMatch
                                        ? 'border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400'
                                        : 'text-muted-foreground group-hover:border-primary/30 group-hover:text-primary',
                                )}
                            >
                                {Icon ? (
                                    <Icon className="h-4 w-4" />
                                ) : (
                                    <ListTree className="h-4 w-4" />
                                )}
                            </div>

                            <div className="flex min-w-0 flex-col">
                                <span
                                    className={cn(
                                        'truncate text-sm font-medium transition-colors',
                                        isMatch
                                            ? 'text-foreground'
                                            : 'text-muted-foreground group-hover:text-foreground',
                                    )}
                                >
                                    {highlightText(asset.title, searchTerm)}
                                </span>
                                {isDescriptionMatch && (
                                    <span className="truncate text-xs text-muted-foreground/80">
                                        {highlightText(
                                            asset.description,
                                            searchTerm,
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </TableCell>

                <TableCell className="hidden align-middle md:table-cell">
                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                        {asset.attributes.slice(0, 2).map((attr, index) => (
                            <Badge
                                key={index}
                                variant="outline"
                                className="border-dashed border-border/60 bg-background/50 px-1.5 py-0 font-mono text-[10px] font-normal text-muted-foreground"
                            >
                                <span className="font-semibold text-foreground/70">
                                    {highlightText(attr.key, searchTerm)}
                                </span>
                                <span className="mx-1 opacity-50">:</span>
                                <span>
                                    {highlightText(attr.value, searchTerm)}
                                </span>
                            </Badge>
                        ))}
                        {asset.attributes.length > 2 && (
                            <Badge
                                variant="secondary"
                                className="h-5 px-1.5 text-[10px] font-medium"
                            >
                                +{asset.attributes.length - 2}
                            </Badge>
                        )}
                    </div>
                </TableCell>

                <TableCell className="hidden text-right align-middle text-xs text-muted-foreground tabular-nums lg:table-cell">
                    {formatDate(asset.updated_at)}
                </TableCell>
                <TableCell className="hidden pr-6 text-right align-middle text-xs text-muted-foreground tabular-nums lg:table-cell">
                    {formatDate(asset.created_at)}
                </TableCell>

                <TableCell className="w-12 pr-4 text-right align-middle">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground/60 transition-all hover:bg-muted hover:text-foreground"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <DropdownMenuItem
                                onClick={() =>
                                    router.get(
                                        route('assets.show', {
                                            asset: asset.id,
                                        }),
                                    )
                                }
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                {__('assets.pages.show.head_title') || 'View'}
                            </DropdownMenuItem>

                            {userHasPermission({
                                user: auth.user,
                                permission: 'update assets',
                            }) && (
                                <DropdownMenuItem
                                    onClick={() =>
                                        router.get(
                                            route('assets.edit', {
                                                asset: asset.id,
                                            }),
                                        )
                                    }
                                >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    {__('assets.pages.form.buttons.edit') ||
                                        'Edit'}
                                </DropdownMenuItem>
                            )}

                            {userHasPermission({
                                user: auth.user,
                                permission: 'delete assets',
                            }) && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => onDeleteClick(asset.id)}
                                        className="text-destructive focus:text-destructive"
                                    >
                                        <Trash className="mr-2 h-4 w-4" />
                                        {__(
                                            'assets.pages.form.buttons.delete',
                                        ) || 'Delete'}
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>

            {isOpen && hasChildren && (
                <React.Fragment>{renderAssetRows(assetIdStr)}</React.Fragment>
            )}
        </React.Fragment>
    );
}
