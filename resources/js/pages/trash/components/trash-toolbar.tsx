import {
    FilterButtonContent,
    getToolbarButtonStyle,
    Toolbar,
    ToolbarLabel,
    ToolbarReset,
    ToolbarSearch,
    ToolbarSeparator,
} from '@/components/data-toolbar';
import { FilterSimpleSelect } from '@/components/filter-simple-select';
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
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
} from '@/components/ui/select';
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { Clock, Filter } from 'lucide-react';
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
    const [pendingRetention, setPendingRetention] = useState<string | null>(
        null,
    );

    const typeOptions = [
        { value: 'ticket', label: __('trash.tabs.tickets') },
        { value: 'user', label: __('trash.tabs.users') },
        { value: 'asset', label: __('trash.tabs.assets') },
        { value: 'role', label: __('trash.tabs.roles') },
    ];

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
        <Toolbar>
            <ToolbarLabel label={__('common.filters.title') || 'Filters'} />

            <ToolbarSearch
                value={searchTerm}
                onChange={onSearchChange}
                placeholder={
                    __('trash.pages.index.toolbar.search') || 'Search trash...'
                }
            />

            <FilterSimpleSelect
                title={__('trash.pages.index.toolbar.type') || 'Type'}
                icon={<Filter className="h-3.5 w-3.5" />}
                options={typeOptions}
                value={activeTab}
                onChange={(val) =>
                    onTabChange(val as 'ticket' | 'user' | 'asset' | 'role')
                }
                placeholder={__('trash.pages.index.toolbar.type') || 'Type'}
            />

            <ToolbarSeparator />

            <div className="flex items-center">
                <Select
                    value={String(retentionDays)}
                    onValueChange={handleRetentionSelect}
                    disabled={!canManageSettings}
                >
                    <SelectTrigger
                        className={cn(
                            getToolbarButtonStyle(true),
                            !canManageSettings &&
                            'cursor-not-allowed opacity-50',
                        )}
                    >
                        <FilterButtonContent
                            icon={<Clock className="h-3.5 w-3.5 opacity-70" />}
                            title={
                                __('trash.toolbar.retention') || 'Retention'
                            }
                            isSelected={true}
                        >
                            <span className="whitespace-nowrap">
                                {retentionDays}{' '}
                                {__('common.time.days') || 'days'}
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
                                    {days} {__('common.time.days') || 'days'}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {searchTerm.length > 0 && (
                <ToolbarReset
                    onClick={onClearSearch}
                    label={__('common.filters.reset') || 'Reset'}
                />
            )}

            <AlertDialog
                open={isRetentionAlertOpen}
                onOpenChange={setIsRetentionAlertOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {__('trash.modals.retention.title') ||
                                'Change Retention Period?'}
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
                            {__('trash.modals.retention.buttons.cancel') ||
                                'Cancel'}
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={confirmRetentionChange}>
                            {__('trash.modals.retention.buttons.confirm') ||
                                'Confirm Change'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Toolbar>
    );
}
