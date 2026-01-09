import { FilterButtonContent, getToolbarButtonStyle } from '@/components/data-toolbar';
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
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import {
    Box,
    Clock,
    Search,
    Shield,
    Ticket,
    Trash2,
    User,
    X,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    activeTab: 'ticket' | 'user' | 'asset' | 'role';
    onTabChange: (tab: 'ticket' | 'user' | 'asset' | 'role') => void;
    onClearSearch: () => void;
    retentionDays: number;
    canManageSettings: boolean;
}

export function TrashToolbar({
    searchTerm,
    onSearchChange,
    activeTab,
    onTabChange,
    onClearSearch,
    retentionDays,
    canManageSettings,
}: Props) {
    const __ = useTrans();
    const [isRetentionAlertOpen, setIsRetentionAlertOpen] = useState(false);
    const [pendingRetention, setPendingRetention] = useState<string | null>(null);

    const tabs = [
        { id: 'ticket', label: __('trash.tabs.tickets'), icon: Ticket },
        { id: 'user', label: __('trash.tabs.users'), icon: User },
        { id: 'asset', label: __('trash.tabs.assets'), icon: Box },
        { id: 'role', label: __('trash.tabs.roles'), icon: Shield },
    ] as const;

    const handleRetentionSelect = (val: string) => {
        setPendingRetention(val);
        setIsRetentionAlertOpen(true);
    };

    const confirmRetentionChange = () => {
        if (!pendingRetention) return;

        router.post(
            route('trash.update-retention'),
            {
                type: activeTab,
                days: parseInt(pendingRetention),
            },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => {
                    setIsRetentionAlertOpen(false);
                    setPendingRetention(null);
                },
            },
        );
    };

    const retentionOptions = [1, 5, 7, 10, 15, 30, 60, 90, 180, 365];

    return (
        <div className="flex w-full flex-col gap-4 rounded-md border bg-background p-2 pl-3 shadow-sm xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
                <div className="mr-2 hidden items-center gap-2 text-sm font-medium text-muted-foreground md:flex">
                    <Trash2 className="h-4 w-4" />
                    <span>{__('trash.pages.index.toolbar.title')}</span>
                </div>

                <Separator
                    orientation="vertical"
                    className="mr-2 hidden h-6 md:block"
                />

                <div className="relative flex items-center">
                    <Search className="absolute left-2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                        placeholder={__('trash.pages.index.toolbar.search')}
                        className="h-8 w-50 border-dashed bg-transparent pl-8 text-xs shadow-none focus-visible:border-solid focus-visible:ring-1"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {searchTerm && (
                    <Button
                        variant="ghost"
                        onClick={onClearSearch}
                        size="sm"
                        className="h-8 border-solid px-2 text-xs font-medium text-muted-foreground hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                        {__('tickets.pages.index.toolbar.clear')}
                        <X className="ml-2 h-3.5 w-3.5" />
                    </Button>
                )}

                <Separator
                    orientation="vertical"
                    className="mx-2 hidden h-6 md:block"
                />

                <div className="flex items-center gap-2">
                    <Select
                        value={String(retentionDays)}
                        onValueChange={handleRetentionSelect}
                        disabled={!canManageSettings}
                    >
                        <SelectTrigger
                            className={cn(
                                getToolbarButtonStyle(true),
                                'h-8 px-3',
                                !canManageSettings &&
                                    'cursor-not-allowed opacity-50',
                            )}
                        >
                            <FilterButtonContent
                                icon={<Clock className="h-3.5 w-3.5 opacity-70" />}
                                title={__('trash.toolbar.retention') || 'Retention'}
                                isSelected={true}
                            >
                                <span className="whitespace-nowrap">
                                    {retentionDays} {__('common.time.days') || 'days'}
                                </span>
                            </FilterButtonContent>
                        </SelectTrigger>
                        <SelectContent align="start">
                            <SelectGroup>
                                <SelectLabel className="px-2 py-1.5 text-[10px] font-normal uppercase tracking-wider text-muted-foreground">
                                    {__('trash.pages.index.toolbar.auto_delete_after') ||
                                        'Auto-delete items older than'}
                                </SelectLabel>
                                {retentionOptions.map((days) => (
                                    <SelectItem key={days} value={String(days)}>
                                        {days}{' '}
                                        {__('common.time.days') || 'days'}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <Button
                            key={tab.id}
                            variant={isActive ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => onTabChange(tab.id)}
                            className={cn(
                                'h-8 text-xs font-medium',
                                isActive &&
                                    'bg-secondary text-secondary-foreground shadow-sm',
                            )}
                        >
                            <Icon className="mr-2 h-3.5 w-3.5" />
                            {tab.label}
                        </Button>
                    );
                })}
            </div>

            <AlertDialog
                open={isRetentionAlertOpen}
                onOpenChange={setIsRetentionAlertOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {__('trash.modals.retention.title') || 'Change Retention Period?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {(
                                __('trash.modals.retention.description') ||
                                'Are you sure you want to change the automatic deletion period to :days days? Items older than this will be permanently deleted immediately.'
                            ).replace(':days', pendingRetention || '...')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setPendingRetention(null)}
                        >
                            {__('trash.modals.retention.buttons.cancel') || 'Cancel'}
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={confirmRetentionChange}>
                            {__('trash.modals.retention.buttons.confirm') || 'Confirm Change'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
