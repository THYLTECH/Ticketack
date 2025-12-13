// resources/js/pages/assets/index.tsx

// Necessary imports
import { cn, userHasPermission } from '@/lib/utils';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo, useState, useEffect } from 'react';

// Layout
import AppLayout from '@/layouts/app/layout';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Custom functions
import { formatDate, getIcon } from '@/lib/utils';

// Types
import type { Asset, BreadcrumbItem, SharedData } from '@/types';

// Custom components

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
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
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { Input } from '@/components/ui/input';

// Icons
import {
    ChevronDown,
    ListTree,
    Maximize,
    Minimize,
    Plus,
    RefreshCcw,
} from 'lucide-react';
import LaravelPagination from '@/components/LaravelPagination';

// Interfaces

interface AssetRowProps {
    asset: Asset;
    assetsByParent: Record<string, Asset[]>;
    openState: Record<string, boolean>;
    toggleNode: (id: string) => void;
    renderAssetRows: (parentId: string | null) => React.ReactNode;
    search?: string;
}

interface AssetTableControls {
    toggleAll: (expand: boolean) => void;
    isAllExpanded: boolean;
    isAllRetracted: boolean;
    allParentIdsCount: number;
}

interface AssetTableProps {
    assets: Asset[];
    assetsByParent: Record<string, Asset[]>;
    openState: Record<string, boolean>;
    toggleNode: (id: string) => void;
    search?: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export default function Index({ assets }: { assets: { data: Asset[], links: PaginationLink[] , filters:{search?: string} } }) {
    const __ = useTrans();
    const filters = {
        search: '', // Default value for search
    };

    // ---------------------------------------
    const [openState, setOpenState] = useState<Record<string, boolean>>({});
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    useEffect(()=> {
        if(!searchTerm)
        {
            setOpenState({});
            return;
        }

        const assetMap = new Map(assets.data.map(a=>[a.id, a]));
        const parentsToExpand = new Set<string>();
        assets.data.forEach((asset) => {
            if (asset.title.toLowerCase().includes(searchTerm.toLowerCase())) {
                let currentParentId = asset.parent_id;
                
                while (currentParentId) {
                    const parentIdString = String(currentParentId)
                    parentsToExpand.add(parentIdString);
                    
                    const parentAsset = assetMap.get(currentParentId);
                    
                    if(!parentAsset) break;
                    
                    currentParentId = parentAsset.parent_id;

                }
            }
        });
        const newOpenState: Record<string, boolean> = {};
        
        parentsToExpand.forEach((id) => {
            newOpenState[id] = true;
        });

        setOpenState(newOpenState);
        
    },[searchTerm, assets.data]);

    const assetsByParent = useMemo(
        () =>
            assets.data.reduce(
                (acc, asset) => {
                    const parentId = asset.parent_id || 'root';
                    if (!acc[parentId]) {
                        acc[parentId] = [];
                    }
                    acc[parentId].push(asset);
                    return acc;
                },
                {} as Record<string, Asset[]>,
            ),
        [assets],
    );

    const allParentIds = useMemo(() => {
        return assets.data
            .filter((asset) => assetsByParent[asset.id]?.length > 0)
            .map((asset) => asset.id);
    }, [assets, assetsByParent]);

    const toggleAll = (expand: boolean) => {
        const newState: Record<string, boolean> = {};
        allParentIds.forEach((id) => {
            newState[id] = expand;
        });
        setOpenState(newState);
    };

    const isAllExpanded = allParentIds.every((id) => openState[id]);
    const isAllRetracted = allParentIds.every((id) => !openState[id]);

    const toggleNode = (id: string) => {
        setOpenState((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const controls: AssetTableControls = {
        toggleAll,
        isAllExpanded,
        isAllRetracted,
        allParentIdsCount: allParentIds.length,
    };
    // ----------------------------------------------------

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('dashboard.pages.breadcrumbs.dashboard'),
            href: route('dashboard'),
        },
        {
            title: __('assets.pages.breadcrumbs.index'),
            href: '#',
        },
    ];

    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('assets.pages.index.head_title')} />

            <Card>
                <CardHeader>
                    <CardTitle>{__('assets.pages.index.title')}</CardTitle>
                    <CardDescription>
                        {__('assets.pages.index.description')}
                    </CardDescription>

                    <CardAction className="flex items-center gap-2">
                    <div className="relative">
                        <Input 
                            type="text"
                            placeholder="Rechercher..."
                            className="w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                        <ExpandCollapseButtons {...controls} />

                        {userHasPermission({
                            user: auth.user,
                            permission: 'create assets',
                        }) && (
                            <Button asChild>
                                <Link href={route('assets.create')}>
                                    <Plus />
                                    {__('assets.pages.index.buttons.create')}
                                </Link>
                            </Button>
                        )}
                    </CardAction>
                </CardHeader>
                <Separator />

                <CardContent>
                    {assets.data.length === 0 ? (
                        <AssetEmpty />
                    ) : (
                        <>
                            <AssetTable
                                assets={assets.data}
                                assetsByParent={assetsByParent}
                                openState={openState}
                                toggleNode={toggleNode}
                                search={searchTerm}
                            />

                            <div className="mt-4">
                                <LaravelPagination links={assets.links} />
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </AppLayout>
    );
}

function ExpandCollapseButtons({
    toggleAll,
    isAllExpanded,
    isAllRetracted,
    allParentIdsCount,
}: AssetTableControls) {
    const __ = useTrans();

    if (allParentIdsCount === 0) {
        return null;
    }

    return (
        <>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleAll(false)}
                        disabled={isAllRetracted}
                    >
                        <Minimize />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    {__('assets.pages.index.buttons.collapse')}
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleAll(true)}
                        disabled={isAllExpanded}
                    >
                        <Maximize />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    {__('assets.pages.index.buttons.expand')}
                </TooltipContent>
            </Tooltip>
        </>
    );
}

function AssetEmpty() {
    const __ = useTrans();

    return (
        <Empty className="border border-dashed">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <ListTree />
                </EmptyMedia>
                <EmptyTitle>{__('assets.pages.index.empty.title')}</EmptyTitle>
                <EmptyDescription>
                    {__('assets.pages.index.empty.description')}
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button variant="outline" size="sm" asChild>
                    <Link href={route('assets.index')}>
                        <RefreshCcw />
                        {__('assets.pages.index.empty.button')}
                    </Link>
                </Button>
            </EmptyContent>
        </Empty>
    );
}

function AssetTable({
    assetsByParent,
    openState,
    toggleNode,
    search,
}: AssetTableProps) {
    const __ = useTrans();

    const renderAssetRows = (parentId: string | null) => {
        const currentAssets = assetsByParent[parentId || 'root'] || [];

        return currentAssets.map((asset) => (
            <AssetRow
                key={asset.id}
                asset={asset}
                assetsByParent={assetsByParent}
                openState={openState}
                toggleNode={toggleNode}
                renderAssetRows={renderAssetRows}
                search={search}
            />
        ));
    };

    return (
        <Table>
            <TableHeader className="sticky top-0 z-10 bg-card shadow-sm">
                <TableRow>
                    <TableHead className="pl-6 text-xs text-muted-foreground">
                        {__('assets.pages.index.table.headers.asset')}
                    </TableHead>
                    <TableHead className="w-[8rem] text-right text-xs text-muted-foreground">
                        {__('assets.pages.index.table.headers.updated_at')}
                    </TableHead>
                    <TableHead className="w-[8rem] text-right text-xs text-muted-foreground">
                        {__('assets.pages.index.table.headers.created_at')}
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>{renderAssetRows(null)}</TableBody>
        </Table>
    );
}

function AssetRow({
    asset,
    assetsByParent,
    openState,
    toggleNode,
    renderAssetRows,
    search
}: AssetRowProps) {
    const hasChildren = !!assetsByParent[asset.id]?.length;
    const isMatch = search && asset.title.toLowerCase().includes(search.toLowerCase());
    const isOpen = openState[asset.id] || false;

    const depthLevel = asset.depth_level || 0;
    const indentation = depthLevel * 1.5;

    const Icon = asset.icon ? getIcon(asset.icon) : null;

    const handleToggle = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        toggleNode(id);
    };

    const auth = usePage<SharedData>().props.auth;

    return (
        <>
            <TableRow
                className="group relative cursor-pointer transition-colors"
                onClick={() => {
                    if (
                        userHasPermission({
                            user: auth.user,
                            permission: 'show assets',
                        })
                    ) {
                        router.get(route('assets.show', { asset: asset.id }));
                    }
                }}
            >
                <TableCell
                    className="font-medium"
                    style={{ paddingLeft: `1.5rem` }}
                >
                    {userHasPermission({
                        user: auth.user,
                        permission: 'show assets',
                    }) && (
                        <Link
                            href={route('assets.show', { asset: asset.id })}
                            className="absolute inset-0 z-0"
                        />
                    )}

                    <div
                        className={`flex items-center gap-2`}
                        style={{ marginLeft: `${indentation}rem` }}
                    >
                        <div
                            className={`h-8 ${depthLevel > 0 ? 'border-l border-dashed' : ''}`}
                        ></div>

                        {hasChildren ? (
                            <Button
                                variant={'ghost'}
                                size="icon-sm"
                                onClick={(e) => handleToggle(e, asset.id)}
                                className={cn(
                                    'z-10 shrink-0 transition-transform duration-200',
                                    isOpen ? 'rotate-180' : 'rotate-0',
                                )}
                            >
                                <ChevronDown />
                            </Button>
                        ) : (
                            <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center`}
                            ></div>
                        )}

                        <div className="flex items-center gap-2">
                            {Icon && (
                                <Icon className="h-6 w-6 rounded-md border p-0.5 text-muted-foreground" />
                            )}
                            <span className={isMatch ? "bg-yellow-200 text-black px-1 rounded" : ""}>
                            {asset.title}
                            </span>
                        </div>
                    </div>
                </TableCell>

                <TableCell className="w-[8rem] text-right">
                    {formatDate(asset.updated_at)}
                </TableCell>
                <TableCell className="w-[8rem] text-right">
                    {formatDate(asset.created_at)}
                </TableCell>
            </TableRow>

            {isOpen && hasChildren && renderAssetRows(asset.id)}
        </>
    );
}
